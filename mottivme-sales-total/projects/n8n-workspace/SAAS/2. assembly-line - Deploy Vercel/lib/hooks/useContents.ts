'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables, Insertable, Updatable } from '@/lib/supabase/types';

type Content = Tables<'contents'>;
type ContentInsert = Insertable<'contents'>;
type ContentUpdate = Updatable<'contents'>;

export function useContents(projectId?: string) {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch contents
  const fetchContents = useCallback(async (pid?: string) => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (pid || projectId) {
      query = query.eq('project_id', pid || projectId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    setContents(data || []);
    setIsLoading(false);
  }, [supabase, projectId]);

  // Create content
  const createContent = useCallback(async (content: ContentInsert) => {
    const { data, error } = await supabase
      .from('contents')
      .insert(content)
      .select()
      .single();

    if (error) return { error };

    setContents(prev => [data, ...prev]);
    return { data };
  }, [supabase]);

  // Update content
  const updateContent = useCallback(async (id: string, updates: ContentUpdate) => {
    const { data, error } = await supabase
      .from('contents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { error };

    setContents(prev => prev.map(c => c.id === id ? data : c));
    return { data };
  }, [supabase]);

  // Delete content
  const deleteContent = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', id);

    if (error) return { error };

    setContents(prev => prev.filter(c => c.id !== id));
    return { success: true };
  }, [supabase]);

  // Approve content
  const approveContent = useCallback(async (id: string) => {
    return updateContent(id, {
      status: 'approved',
      approved_at: new Date().toISOString()
    });
  }, [updateContent]);

  // Reject content
  const rejectContent = useCallback(async (id: string) => {
    return updateContent(id, { status: 'rejected' });
  }, [updateContent]);

  // Initial fetch
  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Real-time subscription
  useEffect(() => {
    const filter = projectId
      ? `project_id=eq.${projectId}`
      : undefined;

    const channel = supabase
      .channel('contents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contents',
          filter,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setContents(prev => [payload.new as Content, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setContents(prev =>
              prev.map(c => c.id === payload.new.id ? payload.new as Content : c)
            );
          } else if (payload.eventType === 'DELETE') {
            setContents(prev => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId]);

  return {
    contents,
    isLoading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    approveContent,
    rejectContent,
  };
}

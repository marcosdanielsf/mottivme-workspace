'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables, Insertable, Updatable } from '@/lib/supabase/types';

type Funnel = Tables<'funnels'>;
type FunnelStep = Tables<'funnel_steps'>;

export function useFunnels(projectId?: string) {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [currentFunnel, setCurrentFunnel] = useState<Funnel | null>(null);
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch funnels for project
  const fetchFunnels = useCallback(async (pid?: string) => {
    const targetProjectId = pid || projectId;
    if (!targetProjectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('funnels')
      .select('*')
      .eq('project_id', targetProjectId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    setFunnels(data || []);
    setIsLoading(false);
  }, [supabase, projectId]);

  // Create funnel
  const createFunnel = useCallback(async (
    funnel: Omit<Insertable<'funnels'>, 'project_id'>
  ) => {
    if (!projectId) return { error: new Error('No project selected') };

    const { data, error } = await supabase
      .from('funnels')
      .insert({ ...funnel, project_id: projectId })
      .select()
      .single();

    if (error) return { error };

    setFunnels(prev => [data, ...prev]);
    return { data };
  }, [supabase, projectId]);

  // Update funnel
  const updateFunnel = useCallback(async (
    id: string,
    updates: Updatable<'funnels'>
  ) => {
    const { data, error } = await supabase
      .from('funnels')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { error };

    setFunnels(prev => prev.map(f => f.id === id ? data : f));
    if (currentFunnel?.id === id) {
      setCurrentFunnel(data);
    }
    return { data };
  }, [supabase, currentFunnel]);

  // Delete funnel
  const deleteFunnel = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('funnels')
      .delete()
      .eq('id', id);

    if (error) return { error };

    setFunnels(prev => prev.filter(f => f.id !== id));
    if (currentFunnel?.id === id) {
      setCurrentFunnel(null);
    }
    return { success: true };
  }, [supabase, currentFunnel]);

  // Get funnel with steps
  const getFunnel = useCallback(async (id: string) => {
    const { data: funnelData, error: funnelError } = await supabase
      .from('funnels')
      .select('*')
      .eq('id', id)
      .single();

    if (funnelError) return { error: funnelError };

    const { data: stepsData } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('funnel_id', id)
      .order('created_at', { ascending: true });

    setCurrentFunnel(funnelData);
    setSteps(stepsData || []);

    return { data: funnelData, steps: stepsData };
  }, [supabase]);

  // Save funnel flow (nodes and edges from React Flow)
  const saveFunnelFlow = useCallback(async (
    id: string,
    nodes: any[],
    edges: any[],
    viewport?: any
  ) => {
    const { data, error } = await supabase
      .from('funnels')
      .update({
        nodes: nodes as any,
        edges: edges as any,
        viewport: viewport as any,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { error };

    setFunnels(prev => prev.map(f => f.id === id ? data : f));
    if (currentFunnel?.id === id) {
      setCurrentFunnel(data);
    }
    return { data };
  }, [supabase, currentFunnel]);

  // Add step to funnel
  const addStep = useCallback(async (
    funnelId: string,
    step: Omit<Insertable<'funnel_steps'>, 'funnel_id'>
  ) => {
    const { data, error } = await supabase
      .from('funnel_steps')
      .insert({ ...step, funnel_id: funnelId })
      .select()
      .single();

    if (error) return { error };

    setSteps(prev => [...prev, data]);
    return { data };
  }, [supabase]);

  // Update step
  const updateStep = useCallback(async (
    stepId: string,
    updates: Updatable<'funnel_steps'>
  ) => {
    const { data, error } = await supabase
      .from('funnel_steps')
      .update(updates)
      .eq('id', stepId)
      .select()
      .single();

    if (error) return { error };

    setSteps(prev => prev.map(s => s.id === stepId ? data : s));
    return { data };
  }, [supabase]);

  // Delete step
  const deleteStep = useCallback(async (stepId: string) => {
    const { error } = await supabase
      .from('funnel_steps')
      .delete()
      .eq('id', stepId);

    if (error) return { error };

    setSteps(prev => prev.filter(s => s.id !== stepId));
    return { success: true };
  }, [supabase]);

  // Publish funnel
  const publishFunnel = useCallback(async (id: string) => {
    return updateFunnel(id, {
      status: 'active',
      published_at: new Date().toISOString(),
    });
  }, [updateFunnel]);

  // Pause funnel
  const pauseFunnel = useCallback(async (id: string) => {
    return updateFunnel(id, { status: 'paused' });
  }, [updateFunnel]);

  // Initial fetch
  useEffect(() => {
    fetchFunnels();
  }, [fetchFunnels]);

  // Real-time subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel('funnels-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funnels',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFunnels(prev => [payload.new as Funnel, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setFunnels(prev =>
              prev.map(f => f.id === payload.new.id ? payload.new as Funnel : f)
            );
            if (currentFunnel?.id === payload.new.id) {
              setCurrentFunnel(payload.new as Funnel);
            }
          } else if (payload.eventType === 'DELETE') {
            setFunnels(prev => prev.filter(f => f.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId, currentFunnel]);

  return {
    funnels,
    currentFunnel,
    steps,
    isLoading,
    error,
    fetchFunnels,
    createFunnel,
    updateFunnel,
    deleteFunnel,
    getFunnel,
    saveFunnelFlow,
    addStep,
    updateStep,
    deleteStep,
    publishFunnel,
    pauseFunnel,
    setCurrentFunnel,
  };
}

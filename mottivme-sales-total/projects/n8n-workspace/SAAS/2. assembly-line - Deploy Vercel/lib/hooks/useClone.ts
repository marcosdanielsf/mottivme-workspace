'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables, Insertable, Updatable } from '@/lib/supabase/types';

type CloneExpert = Tables<'clone_experts'>;
type CloneMaterial = Tables<'clone_materials'>;
type DnaTrait = Tables<'dna_traits'>;

export function useClone(projectId?: string) {
  const [clone, setClone] = useState<CloneExpert | null>(null);
  const [materials, setMaterials] = useState<CloneMaterial[]>([]);
  const [traits, setTraits] = useState<DnaTrait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch clone for project
  const fetchClone = useCallback(async (pid?: string) => {
    const targetProjectId = pid || projectId;
    if (!targetProjectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('clone_experts')
      .select('*')
      .eq('project_id', targetProjectId)
      .single();

    if (error && error.code !== 'PGRST116') {
      setError(error);
      setIsLoading(false);
      return;
    }

    setClone(data || null);

    // Fetch materials if clone exists
    if (data) {
      const { data: materialsData } = await supabase
        .from('clone_materials')
        .select('*')
        .eq('clone_id', data.id)
        .order('created_at', { ascending: false });

      setMaterials(materialsData || []);

      // Fetch DNA traits
      const { data: traitsData } = await supabase
        .from('dna_traits')
        .select('*')
        .eq('clone_id', data.id);

      setTraits(traitsData || []);
    }

    setIsLoading(false);
  }, [supabase, projectId]);

  // Create or update clone
  const upsertClone = useCallback(async (
    pid: string,
    updates: Partial<Omit<CloneExpert, 'id' | 'project_id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data, error } = await supabase
      .from('clone_experts')
      .upsert({
        project_id: pid,
        ...updates,
      }, { onConflict: 'project_id' })
      .select()
      .single();

    if (error) return { error };

    setClone(data);
    return { data };
  }, [supabase]);

  // Update clone
  const updateClone = useCallback(async (
    updates: Updatable<'clone_experts'>
  ) => {
    if (!clone) return { error: new Error('No clone found') };

    const { data, error } = await supabase
      .from('clone_experts')
      .update(updates)
      .eq('id', clone.id)
      .select()
      .single();

    if (error) return { error };

    setClone(data);
    return { data };
  }, [supabase, clone]);

  // Add material
  const addMaterial = useCallback(async (
    material: Omit<Insertable<'clone_materials'>, 'clone_id'>
  ) => {
    if (!clone) return { error: new Error('No clone found') };

    const { data, error } = await supabase
      .from('clone_materials')
      .insert({ ...material, clone_id: clone.id })
      .select()
      .single();

    if (error) return { error };

    setMaterials(prev => [data, ...prev]);
    return { data };
  }, [supabase, clone]);

  // Delete material
  const deleteMaterial = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('clone_materials')
      .delete()
      .eq('id', id);

    if (error) return { error };

    setMaterials(prev => prev.filter(m => m.id !== id));
    return { success: true };
  }, [supabase]);

  // Add DNA trait
  const addTrait = useCallback(async (
    trait: Omit<Insertable<'dna_traits'>, 'clone_id'>
  ) => {
    if (!clone) return { error: new Error('No clone found') };

    const { data, error } = await supabase
      .from('dna_traits')
      .insert({ ...trait, clone_id: clone.id })
      .select()
      .single();

    if (error) return { error };

    setTraits(prev => [...prev, data]);
    return { data };
  }, [supabase, clone]);

  // Initial fetch
  useEffect(() => {
    fetchClone();
  }, [fetchClone]);

  // Real-time subscription for clone changes
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel('clone-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clone_experts',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setClone(payload.new as CloneExpert);
          } else if (payload.eventType === 'DELETE') {
            setClone(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId]);

  // Compute quality score based on materials and traits
  const qualityScore = clone?.quality_score || 0;

  const materialsCount = {
    videos: materials.filter(m => m.type === 'video').length,
    audios: materials.filter(m => m.type === 'audio').length,
    textos: materials.filter(m => m.type === 'text').length,
    transcricoes: materials.filter(m => m.type === 'transcript').length,
  };

  return {
    clone,
    materials,
    traits,
    materialsCount,
    qualityScore,
    isLoading,
    error,
    fetchClone,
    upsertClone,
    updateClone,
    addMaterial,
    deleteMaterial,
    addTrait,
  };
}

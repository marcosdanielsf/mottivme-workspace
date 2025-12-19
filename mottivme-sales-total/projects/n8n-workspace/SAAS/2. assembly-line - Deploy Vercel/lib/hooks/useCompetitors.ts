'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables, Insertable, Updatable } from '@/lib/supabase/types';

type Competitor = Tables<'competitors'>;
type CompetitorAd = Tables<'competitor_ads'>;
type Pattern = Tables<'patterns'>;

export function useCompetitors(projectId?: string) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [ads, setAds] = useState<CompetitorAd[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch competitors for project
  const fetchCompetitors = useCallback(async (pid?: string) => {
    const targetProjectId = pid || projectId;
    if (!targetProjectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch competitors
      const { data: competitorsData, error: competitorsError } = await supabase
        .from('competitors')
        .select('*')
        .eq('project_id', targetProjectId)
        .order('created_at', { ascending: false });

      if (competitorsError) throw competitorsError;

      setCompetitors(competitorsData || []);

      // Fetch ads for all competitors
      if (competitorsData && competitorsData.length > 0) {
        const competitorIds = competitorsData.map(c => c.id);
        const { data: adsData } = await supabase
          .from('competitor_ads')
          .select('*')
          .in('competitor_id', competitorIds)
          .order('first_seen_at', { ascending: false });

        setAds(adsData || []);
      }

      // Fetch patterns
      const { data: patternsData } = await supabase
        .from('patterns')
        .select('*')
        .eq('project_id', targetProjectId);

      setPatterns(patternsData || []);

    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, projectId]);

  // Add competitor
  const addCompetitor = useCallback(async (
    competitor: Omit<Insertable<'competitors'>, 'project_id'>
  ) => {
    if (!projectId) return { error: new Error('No project selected') };

    const { data, error } = await supabase
      .from('competitors')
      .insert({ ...competitor, project_id: projectId })
      .select()
      .single();

    if (error) return { error };

    setCompetitors(prev => [data, ...prev]);
    return { data };
  }, [supabase, projectId]);

  // Update competitor
  const updateCompetitor = useCallback(async (
    id: string,
    updates: Updatable<'competitors'>
  ) => {
    const { data, error } = await supabase
      .from('competitors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { error };

    setCompetitors(prev => prev.map(c => c.id === id ? data : c));
    return { data };
  }, [supabase]);

  // Delete competitor
  const deleteCompetitor = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('competitors')
      .delete()
      .eq('id', id);

    if (error) return { error };

    setCompetitors(prev => prev.filter(c => c.id !== id));
    setAds(prev => prev.filter(a => a.competitor_id !== id));
    return { success: true };
  }, [supabase]);

  // Add ad to competitor
  const addAd = useCallback(async (
    competitorId: string,
    ad: Omit<Insertable<'competitor_ads'>, 'competitor_id'>
  ) => {
    const { data, error } = await supabase
      .from('competitor_ads')
      .insert({ ...ad, competitor_id: competitorId })
      .select()
      .single();

    if (error) return { error };

    setAds(prev => [data, ...prev]);
    return { data };
  }, [supabase]);

  // Add pattern
  const addPattern = useCallback(async (
    pattern: Omit<Insertable<'patterns'>, 'project_id'>
  ) => {
    if (!projectId) return { error: new Error('No project selected') };

    const { data, error } = await supabase
      .from('patterns')
      .insert({ ...pattern, project_id: projectId })
      .select()
      .single();

    if (error) return { error };

    setPatterns(prev => [...prev, data]);
    return { data };
  }, [supabase, projectId]);

  // Get ads for specific competitor
  const getCompetitorAds = useCallback((competitorId: string) => {
    return ads.filter(a => a.competitor_id === competitorId);
  }, [ads]);

  // Get patterns by category
  const getPatternsByCategory = useCallback((category: Pattern['category']) => {
    return patterns.filter(p => p.category === category);
  }, [patterns]);

  // Initial fetch
  useEffect(() => {
    fetchCompetitors();
  }, [fetchCompetitors]);

  // Real-time subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel('competitors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competitors',
          filter: `project_id=eq.${projectId}`,
        },
        () => fetchCompetitors()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patterns',
          filter: `project_id=eq.${projectId}`,
        },
        () => fetchCompetitors()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId, fetchCompetitors]);

  // Computed stats
  const totalAds = ads.length;
  const activeAds = ads.filter(a => a.status === 'active').length;

  const patternStats = {
    ganchos: patterns.filter(p => p.category === 'ganchos').map(p => ({
      text: p.pattern_name,
      percentage: p.usage_percentage || 0,
    })),
    estruturas: patterns.filter(p => p.category === 'estrutura').map(p => ({
      text: p.pattern_name,
      percentage: p.usage_percentage || 0,
    })),
    ctas: patterns.filter(p => p.category === 'ctas').map(p => ({
      text: p.pattern_name,
      percentage: p.usage_percentage || 0,
    })),
  };

  return {
    competitors,
    ads,
    patterns,
    totalAds,
    activeAds,
    patternStats,
    isLoading,
    error,
    fetchCompetitors,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    addAd,
    addPattern,
    getCompetitorAds,
    getPatternsByCategory,
  };
}

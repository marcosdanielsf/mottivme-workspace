'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

type Generation = Tables<'generations'>;

interface DashboardMetrics {
  projectsCount: number;
  projectsGrowth: number;
  contentsCount: number;
  contentsToday: number;
  completedProjects: number;
  activeGenerations: number;
}

interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
  created_at: string;
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    projectsCount: 0,
    projectsGrowth: 0,
    contentsCount: 0,
    contentsToday: 0,
    completedProjects: 0,
    activeGenerations: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      // Fetch projects created this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: projectsThisMonth } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Fetch contents count
      const { count: contentsCount } = await supabase
        .from('contents')
        .select('*', { count: 'exact', head: true });

      // Fetch contents created today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count: contentsToday } = await supabase
        .from('contents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());

      // Fetch completed projects
      const { count: completedProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'complete');

      // Fetch active generations
      const { count: activeGenerations } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'running']);

      setMetrics({
        projectsCount: projectsCount || 0,
        projectsGrowth: projectsThisMonth || 0,
        contentsCount: contentsCount || 0,
        contentsToday: contentsToday || 0,
        completedProjects: completedProjects || 0,
        activeGenerations: activeGenerations || 0,
      });

      // Fetch recent activities (from generations and exports)
      const { data: generations } = await supabase
        .from('generations')
        .select('*, projects(name)')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: exports } = await supabase
        .from('exports')
        .select('*, projects(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and format activities
      const formattedActivities: Activity[] = [];

      if (generations) {
        generations.forEach((gen: any) => {
          const icons: Record<string, string> = {
            'clone': '🧠',
            'posicionamento': '🎯',
            'ofertas': '💰',
            'marketing': '📱',
            'funnels': '🔥',
            'scripts': '📝',
          };
          formattedActivities.push({
            id: gen.id,
            icon: icons[gen.phase || ''] || '🤖',
            text: `${gen.agent_name} ${gen.status === 'complete' ? 'concluído' : gen.status === 'error' ? 'falhou' : 'em andamento'} para "${(gen.projects as any)?.name || 'projeto'}"`,
            time: formatTimeAgo(gen.created_at),
            created_at: gen.created_at,
          });
        });
      }

      if (exports) {
        exports.forEach((exp: any) => {
          formattedActivities.push({
            id: exp.id,
            icon: '📤',
            text: `Exportação para ${exp.destination} ${exp.status === 'complete' ? 'concluída' : exp.status === 'failed' ? 'falhou' : 'em andamento'}`,
            time: formatTimeAgo(exp.created_at),
            created_at: exp.created_at,
          });
        });
      }

      // Sort by date and take top 10
      formattedActivities.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(formattedActivities.slice(0, 10));
      setRecentGenerations(generations || []);

    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Real-time subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => fetchMetrics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contents' },
        () => fetchMetrics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'generations' },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchMetrics]);

  return {
    metrics,
    activities,
    recentGenerations,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR');
}

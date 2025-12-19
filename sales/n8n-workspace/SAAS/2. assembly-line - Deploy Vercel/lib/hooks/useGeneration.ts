'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/types';

type Generation = Tables<'generations'>;

export interface GenerationAgent {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress: number;
  output?: string;
  phase: string;
  agentNumber: number;
}

// Definição dos agentes por fase
const AGENTS_CONFIG: Omit<GenerationAgent, 'status' | 'progress' | 'output'>[] = [
  // FASE 1A - Clone
  { id: 'dna-psicologico', name: 'DNA Psicológico', description: 'Extração do DNA psicológico do expert', phase: 'clone', agentNumber: 1 },
  { id: 'engenharia-reversa', name: 'Engenharia Reversa', description: 'Análise reversa de conteúdos', phase: 'clone', agentNumber: 2 },
  { id: 'configurador', name: 'Configurador do Clone', description: 'Configuração dos parâmetros', phase: 'clone', agentNumber: 3 },
  { id: 'clone-creator', name: 'Clone Creator', description: 'Geração do System Prompt', phase: 'clone', agentNumber: 4 },

  // FASE 1B - Posicionamento
  { id: 'identity-mapper', name: 'Identity Mapper', description: 'Mapeamento de identidade', phase: 'posicionamento', agentNumber: 5 },
  { id: 'pesquisa-internacional', name: 'Pesquisa Internacional', description: 'Análise de mercado global', phase: 'posicionamento', agentNumber: 6 },
  { id: 'pesquisa-brasil', name: 'Pesquisa Brasil', description: 'Análise de mercado brasileiro', phase: 'posicionamento', agentNumber: 7 },
  { id: 'sintese-estrategica', name: 'Síntese Estratégica', description: 'Consolidação de pesquisas', phase: 'posicionamento', agentNumber: 8 },

  // FASE 2 - Ofertas
  { id: 'avatar-creator', name: 'Avatar Creator', description: 'Criação de avatares psicológicos', phase: 'ofertas', agentNumber: 9 },
  { id: 'promessa-generator', name: 'Promise Generator', description: 'Geração de promessas', phase: 'ofertas', agentNumber: 10 },
  { id: 'big-idea', name: 'Big Idea Creator', description: 'Criação do mecanismo único', phase: 'ofertas', agentNumber: 11 },
  { id: 'oferta-hormozi', name: 'Oferta Hormozi', description: 'Estruturação de ofertas', phase: 'ofertas', agentNumber: 12 },

  // FASE 3 - Marketing
  { id: 'content-strategy', name: 'Content Strategy', description: 'Estratégia de conteúdo', phase: 'marketing', agentNumber: 13 },
  { id: 'reels-factory', name: 'Reels Factory', description: 'Scripts para Reels', phase: 'marketing', agentNumber: 14 },
  { id: 'carrossel-factory', name: 'Carrossel Factory', description: 'Scripts para Carrosséis', phase: 'marketing', agentNumber: 15 },
  { id: 'stories-factory', name: 'Stories Factory', description: 'Scripts para Stories', phase: 'marketing', agentNumber: 16 },
  { id: 'email-sequences', name: 'Email Sequences', description: 'Sequências de email', phase: 'marketing', agentNumber: 17 },
];

// Mapeamento de action para agentes
const ACTION_AGENTS: Record<string, number[]> = {
  generateCloneExpert: [1, 2, 3, 4],
  generatePosicionamentoEstrategico: [5, 6, 7, 8],
  generateEcossistemaDeOfertas: [9, 10, 11, 12],
  generateMarketingeGeracaodeDemanda: [13, 14, 15, 16, 17],
};

export function useGeneration(projectId?: string) {
  const [agents, setAgents] = useState<GenerationAgent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Inicializar agentes com status padrão
  const initializeAgents = useCallback((action?: string) => {
    const agentNumbers = action ? ACTION_AGENTS[action] : Object.values(ACTION_AGENTS).flat();

    const initialAgents = AGENTS_CONFIG
      .filter(a => agentNumbers.includes(a.agentNumber))
      .map(agent => ({
        ...agent,
        status: 'pending' as const,
        progress: 0,
        output: undefined,
      }));

    setAgents(initialAgents);
    return initialAgents;
  }, []);

  // Buscar gerações do projeto
  const fetchGenerations = useCallback(async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error);
      return;
    }

    setGenerations(data || []);

    // Atualizar status dos agentes baseado nas gerações
    if (data && data.length > 0) {
      const latestByAgent: Record<string, Generation> = {};
      data.forEach(gen => {
        if (!latestByAgent[gen.agent_name] ||
            new Date(gen.created_at) > new Date(latestByAgent[gen.agent_name].created_at)) {
          latestByAgent[gen.agent_name] = gen;
        }
      });

      setAgents(prev => prev.map(agent => {
        const gen = Object.values(latestByAgent).find(g => g.agent_number === agent.agentNumber);
        if (gen) {
          return {
            ...agent,
            status: gen.status as GenerationAgent['status'],
            progress: gen.status === 'complete' ? 100 : gen.status === 'running' ? 50 : 0,
            output: gen.output ? JSON.stringify(gen.output) : undefined,
          };
        }
        return agent;
      }));

      // Verificar se está gerando
      const runningGen = data.find(g => g.status === 'running' || g.status === 'pending');
      setIsGenerating(!!runningGen);
      if (runningGen) {
        setCurrentPhase(runningGen.phase || null);
      }
    }
  }, [supabase, projectId]);

  // Iniciar geração
  const startGeneration = useCallback(async (action: string) => {
    if (!projectId) {
      setError(new Error('No project selected'));
      return { error: new Error('No project selected') };
    }

    setIsGenerating(true);
    setError(null);

    // Inicializar agentes para esta action
    const actionAgents = initializeAgents(action);

    // Marcar primeiro agente como running
    if (actionAgents.length > 0) {
      setAgents(prev => prev.map((a, i) =>
        i === 0 ? { ...a, status: 'running' as const, progress: 0 } : a
      ));
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start generation');
      }

      const data = await response.json();

      // Definir fase atual
      const phaseMap: Record<string, string> = {
        generateCloneExpert: 'clone',
        generatePosicionamentoEstrategico: 'posicionamento',
        generateEcossistemaDeOfertas: 'ofertas',
        generateMarketingeGeracaodeDemanda: 'marketing',
      };
      setCurrentPhase(phaseMap[action] || null);

      return { data };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setIsGenerating(false);

      // Marcar agentes como erro
      setAgents(prev => prev.map(a =>
        a.status === 'running' ? { ...a, status: 'error' as const } : a
      ));

      return { error };
    }
  }, [projectId, initializeAgents]);

  // Atualizar agente específico
  const updateAgent = useCallback((agentId: string, updates: Partial<GenerationAgent>) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // Real-time subscription para gerações
  useEffect(() => {
    if (!projectId) return;

    // Buscar gerações iniciais
    fetchGenerations();
    initializeAgents();

    // Subscrever para mudanças em tempo real
    const channel = supabase
      .channel(`generations-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generations',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newGen = payload.new as Generation;
            setGenerations(prev => [newGen, ...prev]);

            // Atualizar agente correspondente
            setAgents(prev => prev.map(agent => {
              if (agent.agentNumber === newGen.agent_number) {
                return {
                  ...agent,
                  status: newGen.status as GenerationAgent['status'],
                  progress: newGen.status === 'running' ? 10 : 0,
                };
              }
              return agent;
            }));

            setIsGenerating(true);
          } else if (payload.eventType === 'UPDATE') {
            const updatedGen = payload.new as Generation;
            setGenerations(prev =>
              prev.map(g => g.id === updatedGen.id ? updatedGen : g)
            );

            // Atualizar agente correspondente
            setAgents(prev => {
              const newAgents = prev.map(agent => {
                if (agent.agentNumber === updatedGen.agent_number) {
                  return {
                    ...agent,
                    status: updatedGen.status as GenerationAgent['status'],
                    progress: updatedGen.status === 'complete' ? 100 :
                              updatedGen.status === 'running' ? 50 :
                              updatedGen.status === 'error' ? 0 : agent.progress,
                    output: updatedGen.output ? JSON.stringify(updatedGen.output) : undefined,
                  };
                }
                return agent;
              });

              // Se um agente completou, iniciar o próximo
              if (updatedGen.status === 'complete') {
                const completedIndex = newAgents.findIndex(a => a.agentNumber === updatedGen.agent_number);
                if (completedIndex >= 0 && completedIndex < newAgents.length - 1) {
                  const nextAgent = newAgents[completedIndex + 1];
                  if (nextAgent.status === 'pending') {
                    newAgents[completedIndex + 1] = { ...nextAgent, status: 'running', progress: 0 };
                  }
                }
              }

              return newAgents;
            });

            // Verificar se todos completaram
            if (updatedGen.status === 'complete' || updatedGen.status === 'error') {
              // Verificar se há mais agentes pendentes/running
              setAgents(prev => {
                const stillRunning = prev.some(a => a.status === 'running' || a.status === 'pending');
                if (!stillRunning) {
                  setIsGenerating(false);
                  setCurrentPhase(null);
                }
                return prev;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, projectId, fetchGenerations, initializeAgents]);

  // Calcular progresso total
  const totalProgress = agents.length > 0
    ? agents.reduce((acc, a) => acc + a.progress, 0) / agents.length
    : 0;

  const completedAgents = agents.filter(a => a.status === 'complete').length;
  const isComplete = agents.length > 0 && completedAgents === agents.length;

  return {
    agents,
    isGenerating,
    currentPhase,
    generations,
    error,
    totalProgress,
    completedAgents,
    isComplete,
    startGeneration,
    updateAgent,
    initializeAgents,
    fetchGenerations,
  };
}

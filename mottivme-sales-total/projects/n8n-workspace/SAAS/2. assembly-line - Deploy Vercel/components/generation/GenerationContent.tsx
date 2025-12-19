'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import { useGeneration } from '@/lib/hooks';
import { Card, Button, Badge, Progress, IconButton } from '@/components/ui';
import {
  Brain,
  Loader2,
  Clock,
  ChevronDown,
  Sparkles,
  Copy,
  Edit3,
  Eye,
  RefreshCw,
  Zap,
  Target,
  Users,
  DollarSign,
  Mail,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Timer,
  Rocket,
  Trophy,
  Play,
  AlertCircle,
} from '@/components/ui/icons';
import type { GenerationAgent } from '@/lib/hooks/useGeneration';

// ============================================
// AGENT ICONS CONFIG
// ============================================

const agentIcons: Record<string, React.ReactNode> = {
  'DNA Psicol\u00f3gico': <Brain className="w-5 h-5" />,
  'Engenharia Reversa': <Zap className="w-5 h-5" />,
  'Configurador do Clone': <Target className="w-5 h-5" />,
  'Clone Creator': <Sparkles className="w-5 h-5" />,
  'Identity Mapper': <Users className="w-5 h-5" />,
  'Pesquisa Internacional': <Target className="w-5 h-5" />,
  'Pesquisa Brasil': <Target className="w-5 h-5" />,
  'S\u00edntese Estrat\u00e9gica': <Brain className="w-5 h-5" />,
  'Avatar Creator': <Users className="w-5 h-5" />,
  'Promise Generator': <Sparkles className="w-5 h-5" />,
  'Big Idea Creator': <Zap className="w-5 h-5" />,
  'Oferta Hormozi': <DollarSign className="w-5 h-5" />,
  'Content Strategy': <ArrowRight className="w-5 h-5" />,
  'Reels Factory': <Smartphone className="w-5 h-5" />,
  'Carrossel Factory': <Smartphone className="w-5 h-5" />,
  'Stories Factory': <Smartphone className="w-5 h-5" />,
  'Email Sequences': <Mail className="w-5 h-5" />,
};

// ============================================
// GENERATION PHASES
// ============================================

const GENERATION_PHASES = [
  { id: 'generateCloneExpert', name: 'Fase 1A: Clone Expert', description: 'DNA Psicol\u00f3gico, Engenharia Reversa, Configura\u00e7\u00e3o e Cria\u00e7\u00e3o do Clone' },
  { id: 'generatePosicionamentoEstrategico', name: 'Fase 1B: Posicionamento', description: 'Pesquisa de Mercado e S\u00edntese Estrat\u00e9gica' },
  { id: 'generateEcossistemaDeOfertas', name: 'Fase 2: Ofertas', description: 'Avatar, Promessas, Big Idea e Ecossistema de Ofertas' },
  { id: 'generateMarketingeGeracaodeDemanda', name: 'Fase 3: Marketing', description: 'Conte\u00fados para Reels, Carross\u00e9is, Stories e Emails' },
];

// ============================================
// GENERATION CONTENT
// ============================================

export const GenerationContent: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const { currentProject } = useProjectsStore();
  const {
    agents,
    isGenerating,
    totalProgress,
    completedAgents,
    isComplete,
    error,
    startGeneration,
  } = useGeneration(currentProject?.id);

  const [expandedAgent, setExpandedAgent] = React.useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [selectedPhase, setSelectedPhase] = React.useState<string | null>(null);

  // Find current running agent
  const currentAgent = agents.find(a => a.status === 'running');

  // Timer effect
  React.useEffect(() => {
    if (!isGenerating || isComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating, isComplete]);

  // Show confetti when complete
  React.useEffect(() => {
    if (isComplete && agents.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isComplete, agents.length]);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate remaining time
  const estimatedTotal = totalProgress > 0 ? Math.round(elapsedTime / (totalProgress / 100)) : 0;
  const remainingTime = Math.max(0, estimatedTotal - elapsedTime);

  // Handle start generation
  const handleStartGeneration = async (phase: string) => {
    setElapsedTime(0);
    setSelectedPhase(phase);
    await startGeneration(phase);
  };

  // If no project selected
  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-white/40" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Nenhum projeto selecionado</h2>
        <p className="text-white/40 mb-6">
          Selecione um projeto no Dashboard para iniciar a gera\u00e7\u00e3o.
        </p>
        <Button onClick={() => setActiveTab('dashboard')}>
          Ir para Dashboard
        </Button>
      </div>
    );
  }

  // If not generating and no agents, show phase selection
  if (!isGenerating && agents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4 bg-brand-500/20 text-brand-400">
            <Sparkles className="w-4 h-4" />
            Assembly Line
          </div>

          <h2 className="text-3xl font-bold mb-2">
            Iniciar <span className="text-gradient">Gera\u00e7\u00e3o</span>
          </h2>

          <p className="text-white/40">
            Projeto: <span className="text-white">{currentProject.name}</span>
          </p>
        </div>

        {/* Phase Selection */}
        <div className="space-y-4 animate-slide-up stagger-1">
          <h3 className="font-semibold text-lg">Selecione a fase para gerar:</h3>

          {GENERATION_PHASES.map((phase, index) => (
            <Card
              key={phase.id}
              className={cn(
                'cursor-pointer transition-all hover:border-brand-500/50',
                selectedPhase === phase.id && 'border-brand-500 ring-2 ring-brand-500/20'
              )}
              onClick={() => setSelectedPhase(phase.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{phase.name}</h4>
                  <p className="text-sm text-white/40">{phase.description}</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 transition-colors',
                  selectedPhase === phase.id
                    ? 'border-brand-500 bg-brand-500'
                    : 'border-white/20'
                )} />
              </div>
            </Card>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-center animate-slide-up stagger-2">
          <Button
            size="lg"
            disabled={!selectedPhase}
            onClick={() => selectedPhase && handleStartGeneration(selectedPhase)}
          >
            <Play className="w-5 h-5" />
            Iniciar Gera\u00e7\u00e3o
          </Button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-white/30 animate-fade-in">
          A gera\u00e7\u00e3o ser\u00e1 processada pelo workflow n8n conectado
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">&#127881;</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="bg-danger/10 border-danger/20 animate-slide-up">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger" />
            <div>
              <p className="font-semibold text-danger">Erro na gera\u00e7\u00e3o</p>
              <p className="text-sm text-white/60">{error.message}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="text-center animate-slide-up">
        <div className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4 transition-all',
          isComplete
            ? 'bg-success-muted text-success'
            : 'bg-brand-500/20 text-brand-400'
        )}>
          {isComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Estrat\u00e9gia Completa!
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Assembly Line Ativo
            </>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {isComplete ? (
            <>Sua estrat\u00e9gia est\u00e1 <span className="text-gradient">pronta</span>! &#128640;</>
          ) : (
            <>Gerando sua <span className="text-gradient">estrat\u00e9gia</span>...</>
          )}
        </h2>

        <p className="text-white/40">
          {isComplete
            ? 'Todos os agentes conclu\u00edram o trabalho'
            : `${completedAgents} de ${agents.length} agentes conclu\u00eddos`
          }
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 animate-slide-up stagger-1">
        <Card className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-brand-400 mb-1">
            <Timer className="w-4 h-4" />
            <span className="text-sm">Tempo</span>
          </div>
          <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
        </Card>

        <Card className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
            <Rocket className="w-4 h-4" />
            <span className="text-sm">Progresso</span>
          </div>
          <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
        </Card>

        <Card className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-success mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Economia</span>
          </div>
          <p className="text-2xl font-bold">R$ 15K</p>
        </Card>
      </div>

      {/* Main Progress */}
      <Card className="animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Pipeline de Gera\u00e7\u00e3o</h3>
          {!isComplete && remainingTime > 0 && (
            <Badge variant="brand">
              <Clock className="w-3 h-3" />
              ~{formatTime(remainingTime)} restantes
            </Badge>
          )}
        </div>

        <Progress value={totalProgress} size="lg" className="mb-6" />

        {/* Current Agent Highlight */}
        {currentAgent && !isComplete && (
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 mb-6 animate-pulse-glow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
                {agentIcons[currentAgent.name] || <Brain className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{currentAgent.name}</span>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                </div>
                <p className="text-sm text-white/40">{currentAgent.description}</p>
                <Progress value={currentAgent.progress || 0} size="sm" className="mt-2" />
              </div>
              <span className="text-lg font-bold text-brand-400">
                {Math.round(currentAgent.progress || 0)}%
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Agents List */}
      <div className="space-y-3 animate-slide-up stagger-3">
        <h4 className="font-semibold text-lg mb-4">Agentes</h4>

        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={index}
            isExpanded={expandedAgent === agent.id}
            onToggle={() => setExpandedAgent(
              expandedAgent === agent.id ? null : agent.id
            )}
          />
        ))}
      </div>

      {/* Complete Actions */}
      {isComplete && (
        <Card gradient className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg mb-1">&#127881; Estrat\u00e9gia Completa!</h4>
              <p className="text-white/40 text-sm">
                Todos os {agents.length} agentes conclu\u00edram o trabalho em {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setActiveTab('content')}>
                <Eye className="w-4 h-4" />
                Ver Conte\u00fados
              </Button>
              <Button onClick={() => setActiveTab('vortex')}>
                <Sparkles className="w-4 h-4" />
                Abrir Editor Vortex
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Footer Tip */}
      <div className="text-center text-sm text-white/30 animate-fade-in">
        &#128161; Voc\u00ea pode clicar em cada agente para ver e editar os outputs gerados
      </div>
    </div>
  );
};

// ============================================
// AGENT CARD
// ============================================

interface AgentCardProps {
  agent: GenerationAgent;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, index, isExpanded, onToggle }) => {
  const statusConfig = {
    complete: {
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
    },
    running: {
      icon: <Loader2 className="w-5 h-5 animate-spin text-brand-400" />,
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/30',
      text: 'text-brand-400',
    },
    pending: {
      icon: <Clock className="w-5 h-5 text-white/30" />,
      bg: 'bg-white/5',
      border: 'border-white/10',
      text: 'text-white/40',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-danger" />,
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      text: 'text-danger',
    },
  };

  const status = statusConfig[agent.status] || statusConfig.pending;

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300',
        status.bg,
        status.border,
        agent.status === 'running' && 'ring-2 ring-brand-500/30',
        isExpanded && 'ring-2 ring-white/20'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4"
        disabled={agent.status === 'pending'}
      >
        {/* Status Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          agent.status === 'complete' ? 'bg-success/20' :
          agent.status === 'running' ? 'bg-brand-500/20' :
          'bg-white/5'
        )}>
          {status.icon}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-medium',
              agent.status === 'pending' && 'text-white/40'
            )}>
              {agent.name}
            </span>
            {agent.status === 'complete' && (
              <Badge variant="success" className="text-2xs">Conclu\u00eddo</Badge>
            )}
            {agent.status === 'running' && (
              <Badge variant="brand" className="text-2xs">Processando</Badge>
            )}
            {agent.status === 'error' && (
              <Badge variant="danger" className="text-2xs">Erro</Badge>
            )}
          </div>
          <p className={cn(
            'text-sm',
            agent.status === 'pending' ? 'text-white/20' : 'text-white/40'
          )}>
            {agent.description || 'Aguardando...'}
          </p>
        </div>

        {/* Progress / Expand */}
        {agent.status === 'running' && (
          <div className="w-24">
            <Progress value={agent.progress || 0} size="sm" />
          </div>
        )}

        {agent.status === 'complete' && (
          <ChevronDown className={cn(
            'w-5 h-5 text-white/40 transition-transform',
            isExpanded && 'rotate-180'
          )} />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && agent.status === 'complete' && (
        <div className="px-4 pb-4 pt-0 animate-slide-down">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/40">Output gerado:</span>
              <div className="flex gap-1">
                <IconButton size="sm">
                  <Copy className="w-4 h-4" />
                </IconButton>
                <IconButton size="sm">
                  <Edit3 className="w-4 h-4" />
                </IconButton>
                <IconButton size="sm">
                  <RefreshCw className="w-4 h-4" />
                </IconButton>
              </div>
            </div>
            <p className="text-sm text-white/80 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {agent.output || 'Conte\u00fado gerado aparecer\u00e1 aqui...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationContent;

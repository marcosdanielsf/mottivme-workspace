'use client';

import * as React from 'react';
import { cn, getGreeting, formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { useProjects, useDashboard } from '@/lib/hooks';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Card, Button, Badge, Progress, Avatar, IconButton, Skeleton } from '@/components/ui';
import {
  BarChart3,
  FileText,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Clock,
  Check,
  Loader2,
  Plus,
  MoreHorizontal,
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  Zap,
  ArrowRight,
  Target,
  Users,
  Mail,
  Smartphone,
  Calendar,
} from '@/components/ui/icons';
import type { Project, Activity, AISuggestion } from '@/lib/types';
import type { Tables } from '@/lib/supabase/types';

// ============================================
// DASHBOARD PAGE
// ============================================

export const DashboardContent: React.FC = () => {
  const { setActiveTab, setShowNewProjectModal } = useAppStore();
  const { user, profile } = useAuthContext();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { metrics, activities, isLoading: dashboardLoading, refetch } = useDashboard();

  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([
    {
      id: '1',
      type: 'reactivation',
      title: 'Reativacao de Leads',
      description: 'Voce tem leads inativos nos seus projetos. Posso criar um fluxo de reativacao.',
      impact: 'R$ 42.350',
      projectId: '1',
    },
  ]);

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const greeting = getGreeting();
  const userName = profile?.name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="space-y-8 pb-8">
      {/* Greeting */}
      <section className="animate-slide-up">
        <h3 className="text-3xl font-bold mb-2">
          {greeting}, <span className="text-gradient">{userName}</span>!
        </h3>
        <p className="text-white/40">Aqui esta o resumo dos seus projetos</p>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardLoading ? (
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </>
        ) : (
          <>
            <MetricCard
              icon={<BarChart3 className="w-5 h-5" />}
              iconBg="from-brand-500 to-purple-600"
              title="Projetos"
              value={metrics.projectsCount.toString()}
              change={`+${metrics.projectsGrowth} este mes`}
              changeType="positive"
              delay={0}
            />
            <MetricCard
              icon={<FileText className="w-5 h-5" />}
              iconBg="from-blue-500 to-cyan-500"
              title="Conteudos"
              value={metrics.contentsCount.toLocaleString()}
              change={`+${metrics.contentsToday} hoje`}
              changeType="positive"
              delay={50}
            />
            <MetricCard
              icon={<Check className="w-5 h-5" />}
              iconBg="from-emerald-500 to-green-500"
              title="Completos"
              value={metrics.completedProjects.toString()}
              change="projetos finalizados"
              changeType="neutral"
              delay={100}
            />
            <MetricCard
              icon={<Target className="w-5 h-5" />}
              iconBg="from-orange-500 to-red-500"
              title="Em Geracao"
              value={metrics.activeGenerations.toString()}
              change="agentes ativos"
              changeType="positive"
              delay={150}
            />
          </>
        )}
      </section>

      {/* AI Suggestion */}
      {suggestions.length > 0 && (
        <section className="animate-slide-up stagger-2">
          <AISuggestionCard 
            suggestion={suggestions[0]} 
            onDismiss={() => dismissSuggestion(suggestions[0].id)}
            onAccept={() => {
              setActiveTab('generation');
              dismissSuggestion(suggestions[0].id);
            }}
          />
        </section>
      )}

      {/* Main Grid: Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Section */}
        <section className="lg:col-span-2 animate-slide-up stagger-3">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold">Projetos Recentes</h4>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('projects')}>
              Ver todos <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsLoading ? (
              <>
                <Skeleton className="h-52" />
                <Skeleton className="h-52" />
              </>
            ) : (
              <>
                {projects.slice(0, 3).map((project, index) => (
                  <ProjectCardSupabase key={project.id} project={project} delay={index * 50} />
                ))}

                {/* New Project Card */}
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="glass rounded-xl p-6 border-2 border-dashed border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[200px] group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-brand-500/20 flex items-center justify-center transition-all">
                    <Plus className="w-6 h-6 text-white/40 group-hover:text-brand-400" />
                  </div>
                  <span className="text-white/40 group-hover:text-white font-medium transition-all">
                    Novo Projeto
                  </span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="animate-slide-up stagger-4">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold">Atividade</h4>
            <IconButton size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </IconButton>
          </div>

          <Card className="divide-y divide-white/5 p-0 overflow-hidden">
            {dashboardLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="p-6 text-center text-white/40">
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* Quick Stats */}
      <section className="animate-slide-up stagger-5">
        <h4 className="text-xl font-bold mb-6">Desempenho Semanal</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard
            icon={<Smartphone className="w-5 h-5" />}
            label="Posts Publicados"
            value="47"
            trend="+12"
          />
          <QuickStatCard
            icon={<Mail className="w-5 h-5" />}
            label="Emails Enviados"
            value="2.3K"
            trend="+340"
          />
          <QuickStatCard
            icon={<Users className="w-5 h-5" />}
            label="Leads Capturados"
            value="892"
            trend="+156"
          />
          <QuickStatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Calls Agendadas"
            value="34"
            trend="+8"
          />
        </div>
      </section>

      {/* Streak / Gamification */}
      <section className="animate-slide-up stagger-6">
        <Card gradient className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl shadow-glow-sm">
              🔥
            </div>
            <div>
              <p className="font-bold text-lg">7 dias criando!</p>
              <p className="text-white/40 text-sm">Você está no top 3% dos estrategistas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient">2,847</p>
              <p className="text-xs text-white/40">pontos totais</p>
            </div>
            <Button variant="secondary" size="sm">
              Ver Ranking
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

// ============================================
// METRIC CARD
// ============================================

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconBg,
  title,
  value,
  change,
  changeType,
  delay,
}) => {
  return (
    <Card 
      interactive 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white',
          iconBg
        )}>
          {icon}
        </div>
        <TrendingUp className={cn(
          'w-5 h-5',
          changeType === 'positive' && 'text-success',
          changeType === 'negative' && 'text-danger',
          changeType === 'neutral' && 'text-white/40',
        )} />
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-white/40 text-sm">{title}</p>
      <p className={cn(
        'text-xs mt-2',
        changeType === 'positive' && 'text-success',
        changeType === 'negative' && 'text-danger',
        changeType === 'neutral' && 'text-white/40',
      )}>
        {change}
      </p>
    </Card>
  );
};

// ============================================
// AI SUGGESTION CARD
// ============================================

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onDismiss: () => void;
  onAccept: () => void;
}

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onDismiss,
  onAccept,
}) => {
  return (
    <Card gradient>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <span className="text-gradient">Sugestão da IA</span>
            <Badge variant="brand">Novo</Badge>
          </h4>
          <p className="text-white/60 mb-4">
            {suggestion.description.split(suggestion.impact)[0]}
            <span className="text-success font-medium">{suggestion.impact}</span>
            {suggestion.description.split(suggestion.impact)[1]}
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={onAccept}>
              <Sparkles className="w-4 h-4" />
              Criar Fluxo
            </Button>
            <Button variant="ghost" onClick={() => {}}>
              Ver Detalhes
            </Button>
            <Button variant="ghost" onClick={onDismiss} className="text-white/40">
              Ignorar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// PROJECT CARD
// ============================================

interface ProjectCardProps {
  project: Project;
  delay: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, delay }) => {
  const statusConfig = {
    complete: { 
      badge: <Badge variant="success"><Check className="w-3 h-3" /> Completo</Badge>,
      progressColor: 'bg-success',
    },
    generating: { 
      badge: <Badge variant="brand"><Loader2 className="w-3 h-3 animate-spin" /> Gerando</Badge>,
      progressColor: 'bg-gradient-to-r from-brand-500 to-blue-500',
    },
    draft: { 
      badge: <Badge>Rascunho</Badge>,
      progressColor: 'bg-white/20',
    },
    paused: { 
      badge: <Badge variant="warning"><Pause className="w-3 h-3" /> Pausado</Badge>,
      progressColor: 'bg-warning',
    },
  };

  const status = statusConfig[project.status] || statusConfig.draft;

  return (
    <Card 
      interactive
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h5 className="font-semibold text-lg">{project.name}</h5>
          <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {project.lastUpdate}
          </p>
        </div>
        {status.badge}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/40">Progresso</span>
          <span className="text-white/60 font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', status.progressColor)}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* ROI */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-white/40 text-sm">ROI Projetado</span>
        <span className="text-success font-semibold">{project.roi}</span>
      </div>

      {/* Action */}
      <Button 
        variant="ghost" 
        className="w-full mt-4 justify-center"
      >
        {project.status === 'complete' ? 'Abrir Projeto' : 'Continuar'}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </Card>
  );
};

// ============================================
// PROJECT CARD SUPABASE (for database data)
// ============================================

type SupabaseProject = Tables<'projects'>;

interface ProjectCardSupabaseProps {
  project: SupabaseProject;
  delay: number;
}

const ProjectCardSupabase: React.FC<ProjectCardSupabaseProps> = ({ project, delay }) => {
  const statusConfig: Record<string, { badge: React.ReactNode; progressColor: string }> = {
    complete: {
      badge: <Badge variant="success"><Check className="w-3 h-3" /> Completo</Badge>,
      progressColor: 'bg-success',
    },
    generating: {
      badge: <Badge variant="brand"><Loader2 className="w-3 h-3 animate-spin" /> Gerando</Badge>,
      progressColor: 'bg-gradient-to-r from-brand-500 to-blue-500',
    },
    briefing: {
      badge: <Badge>Briefing</Badge>,
      progressColor: 'bg-white/20',
    },
    archived: {
      badge: <Badge variant="warning">Arquivado</Badge>,
      progressColor: 'bg-warning',
    },
  };

  const status = statusConfig[project.status] || statusConfig.briefing;

  // Format the date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `ha ${diffMins} min`;
    if (diffHours < 24) return `ha ${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `ha ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card
      interactive
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h5 className="font-semibold text-lg">{project.name}</h5>
          <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {formatDate(project.updated_at)}
          </p>
        </div>
        {status.badge}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/40">Progresso</span>
          <span className="text-white/60 font-medium">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', status.progressColor)}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-white/40 mb-4 line-clamp-2">{project.description}</p>
      )}

      {/* Action */}
      <Button
        variant="ghost"
        className="w-full mt-4 justify-center"
      >
        {project.status === 'complete' ? 'Abrir Projeto' : 'Continuar'}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </Card>
  );
};

// ============================================
// ACTIVITY ITEM
// ============================================

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-all cursor-pointer group">
      <span className="text-xl">{activity.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{activity.text}</p>
        <p className="text-xs text-white/40">{activity.time}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-all" />
    </div>
  );
};

// ============================================
// QUICK STAT CARD
// ============================================

interface QuickStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ icon, label, value, trend }) => {
  return (
    <Card className="py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
          {icon}
        </div>
        <span className="text-sm text-white/40">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-success">{trend}</span>
      </div>
    </Card>
  );
};

export default DashboardContent;

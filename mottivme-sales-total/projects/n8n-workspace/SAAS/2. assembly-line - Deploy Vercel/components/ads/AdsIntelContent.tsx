'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, Button, Badge, IconButton, Input, Progress } from '@/components/ui';
import {
  Target,
  Search,
  Plus,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Eye,
  Copy,
  Sparkles,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Zap,
  Globe,
  Instagram,
  Video,
  Image,
  FileText,
  MoreHorizontal,
  Loader2,
  Brain,
} from '@/components/ui/icons';

// ============================================
// TYPES
// ============================================

interface Competitor {
  id: string;
  name: string;
  avatar: string;
  platform: 'meta' | 'google' | 'tiktok';
  totalAds: number;
  activeAds: number;
  avgDuration: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

interface Ad {
  id: string;
  competitorId: string;
  type: 'video' | 'image' | 'carousel';
  thumbnail: string;
  headline: string;
  status: 'active' | 'paused' | 'ended';
  daysRunning: number;
  platform: 'meta' | 'google' | 'tiktok';
  engagement: 'high' | 'medium' | 'low';
  hook?: string;
  cta?: string;
}

interface Pattern {
  id: string;
  category: string;
  pattern: string;
  usage: number;
  trend: 'up' | 'down' | 'stable';
  examples: string[];
}

// ============================================
// MOCK DATA
// ============================================

const mockCompetitors: Competitor[] = [
  { id: '1', name: 'Thiago Nigro', avatar: '💰', platform: 'meta', totalAds: 47, activeAds: 12, avgDuration: '23 dias', lastUpdated: 'há 2h', trend: 'up' },
  { id: '2', name: 'Nathalia Arcuri', avatar: '📊', platform: 'meta', totalAds: 38, activeAds: 8, avgDuration: '31 dias', lastUpdated: 'há 5h', trend: 'stable' },
  { id: '3', name: 'Primo Rico', avatar: '🎯', platform: 'meta', totalAds: 52, activeAds: 15, avgDuration: '18 dias', lastUpdated: 'há 1h', trend: 'up' },
  { id: '4', name: 'Gustavo Cerbasi', avatar: '📚', platform: 'meta', totalAds: 29, activeAds: 5, avgDuration: '45 dias', lastUpdated: 'há 12h', trend: 'down' },
];

const mockAds: Ad[] = [
  { id: '1', competitorId: '1', type: 'video', thumbnail: '🎬', headline: 'O erro que te impede de ficar rico', status: 'active', daysRunning: 45, platform: 'meta', engagement: 'high', hook: 'Você sabia que 90% das pessoas...', cta: 'Saiba mais' },
  { id: '2', competitorId: '1', type: 'video', thumbnail: '🎬', headline: '3 investimentos para 2024', status: 'active', daysRunning: 23, platform: 'meta', engagement: 'high', hook: 'Se você quer ficar rico em 2024...', cta: 'Descubra agora' },
  { id: '3', competitorId: '2', type: 'image', thumbnail: '🖼️', headline: 'Planilha gratuita de orçamento', status: 'active', daysRunning: 67, platform: 'meta', engagement: 'medium', hook: 'Chega de viver no vermelho!', cta: 'Baixar grátis' },
  { id: '4', competitorId: '3', type: 'video', thumbnail: '🎬', headline: 'Como eu saí do zero', status: 'active', daysRunning: 12, platform: 'meta', engagement: 'high', hook: 'Em 2019 eu estava quebrado...', cta: 'Ver história' },
  { id: '5', competitorId: '3', type: 'carousel', thumbnail: '📱', headline: '5 passos para investir', status: 'active', daysRunning: 34, platform: 'meta', engagement: 'medium', hook: 'Você não precisa de muito dinheiro', cta: 'Começar hoje' },
  { id: '6', competitorId: '4', type: 'video', thumbnail: '🎬', headline: 'Casais e dinheiro', status: 'paused', daysRunning: 89, platform: 'meta', engagement: 'low', hook: 'Brigas por dinheiro acabam relacionamentos', cta: 'Resolver agora' },
];

const mockPatterns: Pattern[] = [
  { id: '1', category: 'Ganchos', pattern: 'Pergunta retórica', usage: 34, trend: 'up', examples: ['Você sabia que...?', 'Já parou pra pensar...?'] },
  { id: '2', category: 'Ganchos', pattern: 'Número + Promessa', usage: 28, trend: 'stable', examples: ['3 passos para...', '5 erros que...'] },
  { id: '3', category: 'Ganchos', pattern: 'Storytelling pessoal', usage: 21, trend: 'up', examples: ['Em 2019 eu...', 'Quando eu comecei...'] },
  { id: '4', category: 'CTAs', pattern: 'Urgência', usage: 45, trend: 'stable', examples: ['Só até hoje', 'Últimas vagas'] },
  { id: '5', category: 'CTAs', pattern: 'Curiosidade', usage: 32, trend: 'up', examples: ['Descubra como', 'Saiba mais'] },
  { id: '6', category: 'Estrutura', pattern: 'Problema → Solução', usage: 67, trend: 'stable', examples: ['Mostra a dor, depois a oferta'] },
  { id: '7', category: 'Estrutura', pattern: 'VSL curto (< 2min)', usage: 54, trend: 'up', examples: ['Vídeos de 45s a 90s'] },
];

// ============================================
// ADS INTEL CONTENT
// ============================================

export const AdsIntelContent: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'ads' | 'patterns' | 'insights'>('ads');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isScanning, setIsScanning] = React.useState(false);

  const filteredAds = selectedCompetitor 
    ? mockAds.filter(ad => ad.competitorId === selectedCompetitor)
    : mockAds;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 animate-slide-up">
        {[
          { label: 'Concorrentes', value: mockCompetitors.length, icon: Users, color: 'text-blue-400' },
          { label: 'Anúncios Ativos', value: mockAds.filter(a => a.status === 'active').length, icon: Target, color: 'text-green-400' },
          { label: 'Padrões Identificados', value: mockPatterns.length, icon: Brain, color: 'text-brand-400' },
          { label: 'Última Análise', value: 'há 2h', icon: Clock, color: 'text-orange-400' },
        ].map((stat, i) => (
          <Card key={i} className="text-center py-4" style={{ animationDelay: `${i * 50}ms` }}>
            <stat.icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/40">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Competitors Sidebar */}
        <div className="col-span-3 space-y-4 animate-slide-up stagger-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Concorrentes</h4>
              <Button size="sm" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Input 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="mb-4"
            />

            <div className="space-y-2">
              <button
                onClick={() => setSelectedCompetitor(null)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all flex items-center gap-3',
                  !selectedCompetitor ? 'bg-brand-500/20 border border-brand-500/30' : 'hover:bg-white/5'
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-lg">
                  👥
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Todos</p>
                  <p className="text-xs text-white/40">{mockAds.length} anúncios</p>
                </div>
              </button>

              {mockCompetitors.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompetitor(comp.id)}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 group',
                    selectedCompetitor === comp.id ? 'bg-brand-500/20 border border-brand-500/30' : 'hover:bg-white/5'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                    {comp.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{comp.name}</p>
                    <p className="text-xs text-white/40">{comp.activeAds} ativos</p>
                  </div>
                  {comp.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                  {comp.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger" />}
                </button>
              ))}
            </div>

            <Button variant="secondary" className="w-full mt-4" onClick={handleScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Escaneando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Escanear Novos
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-4 animate-slide-up stagger-2">
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'ads', label: 'Anúncios', icon: Target },
              { id: 'patterns', label: 'Padrões', icon: Brain },
              { id: 'insights', label: 'Insights IA', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ads Grid */}
          {activeTab === 'ads' && (
            <div className="grid grid-cols-2 gap-4">
              {filteredAds.map((ad, i) => (
                <AdCard key={ad.id} ad={ad} competitor={mockCompetitors.find(c => c.id === ad.competitorId)} delay={i * 50} />
              ))}
            </div>
          )}

          {/* Patterns */}
          {activeTab === 'patterns' && (
            <PatternsView patterns={mockPatterns} />
          )}

          {/* AI Insights */}
          {activeTab === 'insights' && (
            <InsightsView competitors={mockCompetitors} ads={mockAds} />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AD CARD
// ============================================

interface AdCardProps {
  ad: Ad;
  competitor?: Competitor;
  delay: number;
}

const AdCard: React.FC<AdCardProps> = ({ ad, competitor, delay }) => {
  const typeConfig = {
    video: { icon: Video, label: 'Vídeo', color: 'text-red-400' },
    image: { icon: Image, label: 'Imagem', color: 'text-blue-400' },
    carousel: { icon: FileText, label: 'Carrossel', color: 'text-purple-400' },
  };

  const type = typeConfig[ad.type];
  const engagementColor = ad.engagement === 'high' ? 'text-success' : ad.engagement === 'medium' ? 'text-warning' : 'text-white/40';

  return (
    <Card 
      interactive 
      className="animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Thumbnail */}
      <div className="aspect-video rounded-lg bg-white/5 flex items-center justify-center text-4xl mb-4 relative overflow-hidden group-hover:bg-white/10 transition-all">
        {ad.thumbnail}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
          <IconButton className="bg-white/20">
            <Play className="w-5 h-5" />
          </IconButton>
          <IconButton className="bg-white/20">
            <ExternalLink className="w-5 h-5" />
          </IconButton>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={ad.status === 'active' ? 'success' : ad.status === 'paused' ? 'warning' : 'default'}>
            {ad.status === 'active' ? 'Ativo' : ad.status === 'paused' ? 'Pausado' : 'Encerrado'}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-black/60">
            <type.icon className={cn('w-3 h-3', type.color)} />
            {type.label}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-sm line-clamp-1">{ad.headline}</p>
            <p className="text-xs text-white/40">{competitor?.name}</p>
          </div>
        </div>

        {/* Hook */}
        {ad.hook && (
          <div className="p-2 rounded-lg bg-white/5">
            <p className="text-xs text-white/40 mb-1">Gancho:</p>
            <p className="text-xs text-white/70">"{ad.hook}"</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/40">
              <Clock className="w-3 h-3" />
              {ad.daysRunning} dias
            </span>
            <span className={cn('flex items-center gap-1', engagementColor)}>
              <TrendingUp className="w-3 h-3" />
              {ad.engagement === 'high' ? 'Alto' : ad.engagement === 'medium' ? 'Médio' : 'Baixo'}
            </span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <IconButton size="sm">
              <Copy className="w-3 h-3" />
            </IconButton>
            <IconButton size="sm">
              <Sparkles className="w-3 h-3" />
            </IconButton>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// PATTERNS VIEW
// ============================================

interface PatternsViewProps {
  patterns: Pattern[];
}

const PatternsView: React.FC<PatternsViewProps> = ({ patterns }) => {
  const categories = [...new Set(patterns.map(p => p.category))];

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category}>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-400" />
            {category}
          </h4>

          <div className="space-y-3">
            {patterns.filter(p => p.category === category).map((pattern) => (
              <div key={pattern.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{pattern.pattern}</p>
                    {pattern.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {pattern.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger" />}
                  </div>
                  <Badge variant={pattern.usage >= 40 ? 'success' : pattern.usage >= 25 ? 'brand' : 'default'}>
                    {pattern.usage}% dos ads
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {pattern.examples.map((ex, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/10 text-xs text-white/60">
                      "{ex}"
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

// ============================================
// INSIGHTS VIEW
// ============================================

interface InsightsViewProps {
  competitors: Competitor[];
  ads: Ad[];
}

const InsightsView: React.FC<InsightsViewProps> = ({ competitors, ads }) => {
  const insights = [
    {
      type: 'opportunity',
      title: 'Oportunidade: Vídeos curtos',
      description: 'Seus concorrentes estão investindo pesado em vídeos de 45-90s. Anúncios com essa duração têm 3x mais engajamento.',
      action: 'Criar vídeo curto',
      icon: Video,
      color: 'text-success',
    },
    {
      type: 'trend',
      title: 'Tendência: Storytelling pessoal',
      description: '67% dos ads de alto desempenho começam com uma história pessoal. Use sua jornada como gancho.',
      action: 'Ver exemplos',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      type: 'alert',
      title: 'Alerta: Gancho saturado',
      description: '"Você sabia que..." está em 34% dos ads. Considere ganchos mais originais para se destacar.',
      action: 'Sugerir ganchos',
      icon: AlertCircle,
      color: 'text-warning',
    },
    {
      type: 'competitor',
      title: 'Primo Rico aumentou investimento',
      description: 'Passou de 8 para 15 anúncios ativos nos últimos 7 dias. Foco em vídeos sobre renda variável.',
      action: 'Analisar',
      icon: Users,
      color: 'text-brand-400',
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-brand-500/10 to-blue-500/10 border-brand-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Resumo da Análise</h4>
            <p className="text-sm text-white/60">
              Analisei {ads.length} anúncios de {competitors.length} concorrentes. 
              Os padrões mostram foco em <strong>vídeos curtos com storytelling</strong> e 
              CTAs de <strong>urgência</strong>. A melhor oportunidade agora é explorar 
              formatos de carrossel, que estão sendo subutilizados.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <Card key={i} className="group hover:border-white/20 transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center', insight.color)}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-sm">{insight.title}</h5>
              </div>
            </div>
            <p className="text-sm text-white/50 mb-4">{insight.description}</p>
            <Button variant="ghost" size="sm" className="w-full group-hover:bg-white/5">
              {insight.action}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Gerar Anúncio com Base nos Padrões</h4>
          <Badge variant="brand">IA</Badge>
        </div>
        <p className="text-sm text-white/50 mb-4">
          Use os padrões identificados para gerar um anúncio otimizado para seu produto.
        </p>
        <Button className="w-full">
          <Sparkles className="w-4 h-4" />
          Gerar Anúncio Competitivo
        </Button>
      </Card>
    </div>
  );
};

export default AdsIntelContent;

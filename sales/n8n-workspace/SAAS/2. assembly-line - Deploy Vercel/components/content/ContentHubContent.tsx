'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { useProjects, useContents } from '@/lib/hooks';
import { Card, Button, Badge, IconButton, Input, Progress, Textarea, Skeleton } from '@/components/ui';
import {
  Search,
  Filter,
  Plus,
  Copy,
  Edit3,
  Eye,
  Trash2,
  RefreshCw,
  Sparkles,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Download,
  Share2,
  MoreHorizontal,
  FileText,
  Film,
  Smartphone,
  Mail,
  Target,
  Layers,
  Clock,
  Calendar,
  Grid,
  List,
  CheckCircle2,
  Loader2,
  Zap,
  ExternalLink,
  ImagePlus,
} from '@/components/ui/icons';
import type { Content, ContentType } from '@/lib/types';
import type { Tables } from '@/lib/supabase/types';

// ============================================
// CONTENT TYPE CONFIG
// ============================================

interface ContentTypeConfig {
  id: ContentType | 'all';
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const contentTypes: ContentTypeConfig[] = [
  { id: 'all', label: 'Todos', icon: <Layers className="w-4 h-4" />, color: 'text-white', bgColor: 'bg-white/10' },
  { id: 'post', label: 'Posts', icon: <FileText className="w-4 h-4" />, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { id: 'reel', label: 'Reels', icon: <Film className="w-4 h-4" />, color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  { id: 'story', label: 'Stories', icon: <Smartphone className="w-4 h-4" />, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  { id: 'carrossel', label: 'Carrosséis', icon: <Layers className="w-4 h-4" />, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { id: 'email', label: 'Emails', icon: <Mail className="w-4 h-4" />, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  { id: 'ad', label: 'Ads', icon: <Target className="w-4 h-4" />, color: 'text-red-400', bgColor: 'bg-red-500/20' },
];

// ============================================
// MOCK DATA - More content for demo
// ============================================

const mockContents: Content[] = [
  // Posts
  { id: '1', projectId: '1', type: 'post', title: 'O erro que 90% cometem...', content: 'Você sabia que a maioria das pessoas comete esse erro fatal quando tenta investir?\n\nEles acham que precisam de muito dinheiro para começar.\n\nMas a verdade é: você pode começar com R$ 100.\n\nO segredo não está no quanto você tem, mas em COMO você investe.\n\nSalva esse post e comenta "EU QUERO" que eu te mando o método completo.', status: 'approved', createdAt: '2024-02-15' },
  { id: '2', projectId: '1', type: 'post', title: '3 sinais de que você precisa mudar', content: 'Se você se identifica com pelo menos 2 desses sinais, precisa urgentemente mudar sua estratégia:\n\n1️⃣ Você trabalha mais de 10h por dia e ainda assim não sobra dinheiro\n\n2️⃣ Você não consegue tirar férias sem se preocupar com as contas\n\n3️⃣ Você não sabe quanto vai ganhar no próximo mês\n\nSe isso é você, comenta "MUDAR" que vou te mostrar o caminho.', status: 'approved', createdAt: '2024-02-15' },
  { id: '3', projectId: '1', type: 'post', title: 'A verdade que ninguém conta', content: 'Vou te contar algo que a maioria dos "gurus" esconde...\n\nNão existe fórmula mágica.\n\nO que existe é MÉTODO + CONSISTÊNCIA.\n\nEu levei 3 anos para descobrir isso. Você pode aprender em 3 meses.\n\nQuer saber como? Link na bio.', status: 'draft', createdAt: '2024-02-14' },
  
  // Reels
  { id: '4', projectId: '1', type: 'reel', title: 'Gancho: Você sabia que...', content: '[GANCHO - 0-3s]\n"Você sabia que 90% das pessoas que tentam investir PERDEM dinheiro?"\n\n[DESENVOLVIMENTO - 3-20s]\n"E o pior: elas nem sabem o porquê.\n\nA verdade é que existe um erro básico que quase todo mundo comete.\n\nElas investem sem ter um MÉTODO."\n\n[CTA - 20-30s]\n"Se você quer aprender o método que me fez sair de R$ 0 para R$ 100 mil investidos, comenta MÉTODO aqui embaixo."', status: 'approved', createdAt: '2024-02-14' },
  { id: '5', projectId: '1', type: 'reel', title: 'Gancho: O maior erro', content: '[GANCHO - 0-3s]\n"O maior erro que você pode cometer em 2024..."\n\n[DESENVOLVIMENTO - 3-25s]\n"...é deixar seu dinheiro parado na poupança.\n\nEnquanto você ganha 6% ao ano, a inflação come 5%.\n\nVocê está literalmente PERDENDO dinheiro.\n\nMas existe uma alternativa simples que rende 3x mais."\n\n[CTA - 25-30s]\n"Quer saber qual? Segue o perfil e ativa o sininho."', status: 'approved', createdAt: '2024-02-13' },
  { id: '6', projectId: '1', type: 'reel', title: 'Gancho: Pare de fazer isso', content: '[GANCHO - 0-3s]\n"Se você faz isso, pare AGORA."\n\n[DESENVOLVIMENTO - 3-22s]\n"Guardar dinheiro embaixo do colchão.\n\nOk, ninguém mais faz isso literalmente.\n\nMas deixar na conta corrente é a mesma coisa.\n\nSeu dinheiro precisa TRABALHAR pra você."\n\n[CTA - 22-30s]\n"Comenta TRABALHAR que eu te mostro como."', status: 'draft', createdAt: '2024-02-12' },

  // Stories
  { id: '7', projectId: '1', type: 'story', title: 'Enquete: Quanto você investe?', content: '📊 ENQUETE\n\nQuanto você investe por mês?\n\n🔘 Nada ainda\n🔘 Até R$ 500\n🔘 R$ 500 a R$ 2.000\n🔘 Mais de R$ 2.000\n\n[Usar sticker de enquete]', status: 'approved', createdAt: '2024-02-15' },
  { id: '8', projectId: '1', type: 'story', title: 'Caixinha de perguntas', content: '🎯 CAIXINHA\n\nQual sua maior dúvida sobre investimentos?\n\n[Usar sticker de perguntas]\n\nVou responder as melhores nos próximos stories!', status: 'approved', createdAt: '2024-02-14' },

  // Carrosséis
  { id: '9', projectId: '1', type: 'carrossel', title: '5 passos para começar a investir', content: 'SLIDE 1 (CAPA):\n"5 passos para começar a investir HOJE"\n\nSLIDE 2:\n"Passo 1: Organize suas finanças\nAntes de investir, saiba quanto entra e quanto sai."\n\nSLIDE 3:\n"Passo 2: Monte sua reserva de emergência\n6 meses de gastos essenciais."\n\nSLIDE 4:\n"Passo 3: Defina seus objetivos\nCurto, médio ou longo prazo?"\n\nSLIDE 5:\n"Passo 4: Escolha a corretora certa\nTaxa zero é essencial."\n\nSLIDE 6:\n"Passo 5: Comece com pouco\nR$ 100 já é suficiente."\n\nSLIDE 7 (CTA):\n"Salva esse post e comenta COMEÇAR!"', status: 'approved', createdAt: '2024-02-13' },

  // Emails
  { id: '10', projectId: '1', type: 'email', title: '[D+0] Bem-vindo ao Método', content: 'Assunto: Você tomou a melhor decisão do ano 🎯\n\n---\n\nOlá, [NOME]!\n\nSeja muito bem-vindo(a) ao Método Liberdade.\n\nNos próximos dias, vou te mostrar exatamente como sair do zero e construir uma carteira de investimentos sólida.\n\nMas antes, preciso que você faça UMA coisa:\n\n👉 Adicione este email aos seus contatos para não perder nenhuma mensagem.\n\nAmanhã você recebe o primeiro passo do método.\n\nAté lá!\n\n[ASSINATURA]', status: 'approved', createdAt: '2024-02-15' },
  { id: '11', projectId: '1', type: 'email', title: '[D+1] Minha história', content: 'Assunto: Como eu saí de R$ 0 para R$ 100 mil investidos\n\n---\n\n[NOME], tudo bem?\n\nAntes de te ensinar o método, preciso te contar uma história.\n\nEm 2019, eu estava QUEBRADO.\n\nTrabalhava 12 horas por dia e não sobrava nada no final do mês.\n\nAté que eu descobri algo que mudou tudo...\n\n[Continua o storytelling...]\n\nAmanhã eu vou te mostrar o PRIMEIRO passo que dei.\n\n[ASSINATURA]', status: 'approved', createdAt: '2024-02-15' },
  { id: '12', projectId: '1', type: 'email', title: '[D+3] O primeiro passo', content: 'Assunto: O passo que 90% das pessoas pula (e se arrepende)\n\n---\n\n[NOME],\n\nHoje vou revelar o PRIMEIRO passo do método.\n\nE posso garantir: 90% das pessoas pula essa etapa.\n\nÉ por isso que elas falham.\n\nO primeiro passo é: [CONTEÚDO DO MÉTODO]\n\n[ASSINATURA]', status: 'draft', createdAt: '2024-02-15' },
  { id: '13', projectId: '1', type: 'email', title: '[D+5] Oferta especial', content: 'Assunto: [NOME], tenho uma proposta pra você\n\n---\n\nNos últimos dias, você aprendeu:\n\n✅ [Resumo do que foi ensinado]\n\nAgora chegou a hora de dar o próximo passo.\n\nEstou abrindo vagas para o Método Liberdade Completo.\n\nE como você está na minha lista, tem acesso a uma condição ESPECIAL...\n\n[OFERTA]\n\n[ASSINATURA]', status: 'draft', createdAt: '2024-02-15' },

  // Ads
  { id: '14', projectId: '1', type: 'ad', title: 'Ad Principal - Vídeo', content: '[GANCHO - 0-3s]\n"Se você ganha mais de R$ 3.000 e ainda não investe, me desculpa mas..."\n\n[PROBLEMA - 3-15s]\n"...você está deixando dinheiro na mesa.\n\nA cada mês que passa, você perde a chance de fazer seu dinheiro trabalhar pra você."\n\n[SOLUÇÃO - 15-40s]\n"Eu criei um método simples que qualquer pessoa pode usar.\n\nNão importa se você nunca investiu na vida.\n\nEm 30 dias, você vai ter sua primeira carteira montada."\n\n[CTA - 40-45s]\n"Clica no botão abaixo e começa agora."', status: 'approved', createdAt: '2024-02-14' },
  { id: '15', projectId: '1', type: 'ad', title: 'Ad Retargeting - Imagem', content: '🎯 HEADLINE:\n"Você viu, mas não clicou..."\n\n📝 COPY PRIMÁRIO:\nEi, eu sei que você viu meu vídeo sobre investimentos.\n\nE provavelmente pensou: "depois eu vejo isso".\n\nMas deixa eu te fazer uma pergunta:\n\nQuanto dinheiro você vai deixar de ganhar esperando o "momento certo"?\n\n👉 O momento certo é AGORA.\n\n🔘 CTA: Quero Começar Hoje', status: 'approved', createdAt: '2024-02-13' },
];

// ============================================
// CONTENT HUB CONTENT
// ============================================

type SupabaseContent = Tables<'contents'>;

export const ContentHubContent: React.FC = () => {
  const { projects } = useProjects();
  const { contents: supabaseContents, isLoading, createContent, updateContent, deleteContent, approveContent } = useContents();

  const [filter, setFilter] = React.useState<ContentType | 'all'>('all');
  const [projectFilter, setProjectFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Convert Supabase contents to legacy format for compatibility
  const contents: Content[] = React.useMemo(() => {
    if (supabaseContents.length > 0) {
      return supabaseContents.map(c => ({
        id: c.id,
        projectId: c.project_id,
        type: c.type as ContentType,
        title: c.title || '',
        content: c.body || '',
        status: c.status as 'draft' | 'approved',
        createdAt: c.created_at,
      }));
    }
    // Fallback to mock data if no Supabase data
    return mockContents;
  }, [supabaseContents]);

  // Filter contents
  const filteredContents = contents.filter(content => {
    const matchesType = filter === 'all' || content.type === filter;
    const matchesProject = projectFilter === 'all' || content.projectId === projectFilter;
    const matchesSearch = !searchQuery || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesProject && matchesSearch;
  });

  // Group by type for stats
  const contentStats = contentTypes.slice(1).map(type => ({
    ...type,
    count: contents.filter(c => c.type === type.id).length,
  }));

  // Handle generate more
  const handleGenerateMore = (type: ContentType) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Would add new content here
    }, 2000);
  };

  // Handle copy
  const handleCopy = (content: Content) => {
    navigator.clipboard.writeText(content.content);
    // Would show toast here
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-slide-up">
        {contentStats.map((stat, index) => (
          <button
            key={stat.id}
            onClick={() => setFilter(stat.id as ContentType)}
            className={cn(
              'p-4 rounded-xl transition-all duration-200 text-left',
              filter === stat.id 
                ? 'glass ring-2 ring-brand-500/50' 
                : 'bg-white/5 hover:bg-white/10'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.bgColor)}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs text-white/40">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <Card className="p-4 animate-slide-up stagger-1">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar conteúdos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id as ContentType | 'all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filter === type.id
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                )}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
            <IconButton
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white/10 text-white' : ''}
            >
              <Grid className="w-4 h-4" />
            </IconButton>
            <IconButton
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white/10 text-white' : ''}
            >
              <List className="w-4 h-4" />
            </IconButton>
          </div>

          {/* Generate More */}
          <Button onClick={() => handleGenerateMore(filter === 'all' ? 'post' : filter)} disabled={isGenerating}>
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Gerar Mais
          </Button>
        </div>
      </Card>

      {/* Email Sequence (Special View) */}
      {filter === 'email' && (
        <Card className="animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-400" />
              Sequência de Emails
            </h4>
            <Badge variant="success">4 emails</Badge>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-white/10" />
            
            {/* Email Items */}
            <div className="space-y-4">
              {filteredContents
                .filter(c => c.type === 'email')
                .map((email, index) => (
                  <div key={email.id} className="flex items-start gap-4 relative">
                    {/* Day Badge */}
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-sm',
                      email.status === 'approved' 
                        ? 'bg-success text-white' 
                        : 'bg-white/10 text-white/60'
                    )}>
                      D+{index === 0 ? '0' : index === 1 ? '1' : index === 2 ? '3' : '5'}
                    </div>
                    
                    {/* Email Card */}
                    <button
                      onClick={() => setSelectedContent(email)}
                      className="flex-1 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium mb-1">{email.title}</p>
                          <p className="text-sm text-white/40 line-clamp-2">
                            {email.content.split('\n')[0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <IconButton size="sm" onClick={(e) => { e.stopPropagation(); handleCopy(email); }}>
                            <Copy className="w-4 h-4" />
                          </IconButton>
                          <IconButton size="sm">
                            <Edit3 className="w-4 h-4" />
                          </IconButton>
                        </div>
                      </div>
                      {email.status === 'approved' ? (
                        <Badge variant="success" className="mt-2">
                          <CheckCircle2 className="w-3 h-3" /> Aprovado
                        </Badge>
                      ) : (
                        <Badge className="mt-2">Rascunho</Badge>
                      )}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}

      {/* Content Grid */}
      {filter !== 'email' && (
        <div className={cn(
          'animate-slide-up stagger-2',
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        )}>
          {filteredContents.map((content, index) => (
            <ContentCard
              key={content.id}
              content={content}
              viewMode={viewMode}
              onClick={() => setSelectedContent(content)}
              onCopy={() => handleCopy(content)}
              delay={index * 30}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredContents.length === 0 && (
        <Card className="py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h4 className="font-semibold mb-2">Nenhum conteúdo encontrado</h4>
          <p className="text-white/40 text-sm mb-4">
            {searchQuery ? 'Tente outra busca' : 'Gere novos conteúdos com a IA'}
          </p>
          <Button onClick={() => handleGenerateMore('post')}>
            <Sparkles className="w-4 h-4" />
            Gerar Conteúdos
          </Button>
        </Card>
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onCopy={() => handleCopy(selectedContent)}
        />
      )}

      {/* Bulk Actions Bar (would show when items selected) */}
      {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-xl p-4 flex items-center gap-4 animate-slide-up">
        <span className="text-sm">3 selecionados</span>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
        <Button variant="danger" size="sm">
          <Trash2 className="w-4 h-4" />
          Excluir
        </Button>
      </div> */}
    </div>
  );
};

// ============================================
// CONTENT CARD
// ============================================

interface ContentCardProps {
  content: Content;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onCopy: () => void;
  delay: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, viewMode, onClick, onCopy, delay }) => {
  const typeConfig = contentTypes.find(t => t.id === content.type);

  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="w-full p-4 glass rounded-xl flex items-center gap-4 hover:bg-white/5 transition-all group text-left animate-slide-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', typeConfig?.bgColor)}>
          <span className={typeConfig?.color}>{typeConfig?.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{content.title}</p>
          <p className="text-sm text-white/40 truncate">{content.content.split('\n')[0]}</p>
        </div>

        <Badge variant={content.status === 'approved' ? 'success' : 'default'}>
          {content.status === 'approved' ? 'Aprovado' : 'Rascunho'}
        </Badge>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <IconButton size="sm" onClick={(e) => { e.stopPropagation(); onCopy(); }}>
            <Copy className="w-4 h-4" />
          </IconButton>
          <IconButton size="sm">
            <Edit3 className="w-4 h-4" />
          </IconButton>
          <IconButton size="sm">
            <RefreshCw className="w-4 h-4" />
          </IconButton>
        </div>
      </button>
    );
  }

  return (
    <Card
      interactive
      className="flex flex-col animate-slide-up group"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={cn('px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1', typeConfig?.bgColor)}>
          <span className={typeConfig?.color}>{typeConfig?.icon}</span>
          <span className={typeConfig?.color}>{typeConfig?.label}</span>
        </div>
        <Badge variant={content.status === 'approved' ? 'success' : 'default'} className="text-2xs">
          {content.status === 'approved' ? '✓ Aprovado' : 'Rascunho'}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="font-semibold mb-2 line-clamp-2">{content.title}</h4>

      {/* Preview */}
      <p className="text-sm text-white/40 flex-1 line-clamp-3 mb-4">
        {content.content.split('\n').slice(0, 3).join(' ')}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-xs text-white/30 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(content.createdAt).toLocaleDateString('pt-BR')}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <IconButton size="sm" onClick={(e) => { e.stopPropagation(); onCopy(); }}>
            <Copy className="w-4 h-4" />
          </IconButton>
          <IconButton size="sm" onClick={(e) => e.stopPropagation()}>
            <Edit3 className="w-4 h-4" />
          </IconButton>
          <IconButton size="sm" onClick={(e) => e.stopPropagation()}>
            <RefreshCw className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// CONTENT DETAIL MODAL
// ============================================

interface ContentDetailModalProps {
  content: Content;
  onClose: () => void;
  onCopy: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ content, onClose, onCopy }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content.content);
  const typeConfig = contentTypes.find(t => t.id === content.type);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50 glass rounded-2xl flex flex-col animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', typeConfig?.bgColor)}>
              <span className={typeConfig?.color}>{typeConfig?.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold">{content.title}</h3>
              <p className="text-sm text-white/40">{typeConfig?.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={content.status === 'approved' ? 'success' : 'default'}>
              {content.status === 'approved' ? '✓ Aprovado' : 'Rascunho'}
            </Badge>
            <IconButton onClick={onClose}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans leading-relaxed">
                {content.content}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onCopy}>
              <Copy className="w-4 h-4" />
              Copiar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
              Regenerar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button onClick={() => setIsEditing(false)}>
                <Check className="w-4 h-4" />
                Salvar
              </Button>
            ) : (
              <>
                <Button variant="secondary" size="sm">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button size="sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Aprovar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentHubContent;

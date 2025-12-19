// ============================================
// ASSEMBLY LINE - TYPE DEFINITIONS
// ============================================

// Project Types
export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'generating' | 'complete' | 'paused';
  progress: number;
  lastUpdate: string;
  roi: string;
  createdAt: string;
  avatar?: ProjectAvatar;
  outputs?: ProjectOutputs;
}

export interface ProjectAvatar {
  name: string;
  age: string;
  occupation: string;
  pains: string[];
  desires: string[];
  objections: string[];
}

export interface ProjectOutputs {
  dna: boolean;
  research: boolean;
  avatar: boolean;
  offer: boolean;
  funnel: boolean;
  content: boolean;
  emails: boolean;
  ads: boolean;
}

// Funnel/Vortex Types
export type NodeType = 'etapa' | 'rescue' | 'comunidade' | 'lancamento';
export type EtapaType = 'abordagem' | 'ativacao' | 'qualificacao' | 'sondagem' | 'pitch';
export type ChannelType = 'instagram' | 'whatsapp' | 'email';
export type NodeStatus = 'draft' | 'active' | 'paused';

export interface VortexNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: EtapaNodeData | RescueNodeData | ComunidadeNodeData | LancamentoNodeData;
}

export interface EtapaNodeData {
  tipo: EtapaType;
  titulo: string;
  icone: string;
  mensagem: string;
  canal: ChannelType;
  status: NodeStatus;
  temRescue: boolean;
}

export interface RescueNodeData {
  etapaPaiId: string;
  cadencia: RescueCadencia[];
}

export interface RescueCadencia {
  tempo: string; // "+2h", "+4h", "+24h"
  tipo: 'audio' | 'video' | 'texto';
  conteudo: string;
}

export interface ComunidadeNodeData {
  nome: string;
  tipo: 'whatsapp' | 'telegram' | 'discord';
  linkConvite: string;
  mensagemBoasVindas: string;
  conteudoNurturing: NurturingItem[];
}

export interface NurturingItem {
  dia: number;
  tipo: string;
  conteudo: string;
}

export interface LancamentoNodeData {
  nome: string;
  etapas: LancamentoEtapa[];
}

export interface LancamentoEtapa {
  dia: string;
  tipo: string;
  conteudo: string;
}

// Edge Types
export type EdgeType = 'respondeu' | 'nao_respondeu' | 'entrou_grupo' | 'agendou';

export interface VortexEdge {
  id: string;
  source: string;
  target: string;
  tipo: EdgeType;
  label?: string;
  animated?: boolean;
}

// Content Types
export type ContentType = 'post' | 'reel' | 'story' | 'carrossel' | 'email' | 'ad';
export type ContentStatus = 'draft' | 'approved' | 'published';

export interface Content {
  id: string;
  projectId: string;
  type: ContentType;
  title: string;
  content: string;
  status: ContentStatus;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Agent Types
export type AgentStatus = 'pending' | 'running' | 'complete' | 'error';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  progress?: number;
  output?: string;
  error?: string;
}

// Clone Types
export interface Clone {
  id: string;
  name: string;
  photo?: string;
  status: 'active' | 'training' | 'inactive';
  quality: number;
  dna: CloneDNA;
  materials: CloneMaterials;
}

export interface CloneDNA {
  tomDeVoz: string;
  vocabulario: string[];
  estilo: string;
  gatilhos: string[];
}

export interface CloneMaterials {
  videos: number;
  audios: number;
  textos: number;
  transcricoes: number;
}

// Competitor Types
export interface Competitor {
  id: string;
  name: string;
  handle: string;
  platform: 'instagram' | 'facebook' | 'tiktok';
  adsCount: number;
  lastUpdate: string;
  photo?: string;
}

export interface CompetitorAd {
  id: string;
  competitorId: string;
  type: 'video' | 'image' | 'carousel';
  daysActive: number;
  thumbnail?: string;
  transcript?: string;
  analysis?: AdAnalysis;
}

export interface AdAnalysis {
  gancho: string;
  estrutura: string;
  cta: string;
  duracao?: number;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'expired';
  lastSync?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'starter' | 'pro' | 'agency';
  usage: UserUsage;
}

export interface UserUsage {
  projects: number;
  projectsLimit: number;
  contents: number;
  contentsLimit: number;
  exports: number;
  exportsLimit: number;
}

// Metrics
export interface DashboardMetrics {
  projects: number;
  projectsGrowth: string;
  contents: number;
  contentsGrowth: string;
  roi: string;
  roiLabel: string;
}

// Activity
export interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
  projectId?: string;
}

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

// AI Suggestion
export interface AISuggestion {
  id: string;
  type: 'reactivation' | 'optimization' | 'content' | 'ads';
  title: string;
  description: string;
  impact: string;
  projectId?: string;
}

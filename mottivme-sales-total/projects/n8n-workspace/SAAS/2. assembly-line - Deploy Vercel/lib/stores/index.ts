import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Project, 
  Content, 
  Agent, 
  Clone, 
  Competitor, 
  Integration,
  DashboardMetrics,
  Activity,
  AISuggestion,
  User
} from '@/lib/types';

// ============================================
// APP STORE
// ============================================

interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Modals
  showNewProjectModal: boolean;
  setShowNewProjectModal: (show: boolean) => void;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Modals
      showNewProjectModal: false,
      setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
      
      // User
      user: {
        id: '1',
        name: 'Marcos',
        email: 'marcos@mottivme.com',
        plan: 'pro',
        usage: {
          projects: 12,
          projectsLimit: 100,
          contents: 1847,
          contentsLimit: 10000,
          exports: 45,
          exportsLimit: 100,
        },
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'assembly-line-app',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// ============================================
// PROJECTS STORE
// ============================================

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [
    { 
      id: '1', 
      name: 'Método Liberdade', 
      status: 'complete', 
      progress: 100, 
      lastUpdate: 'há 2 dias', 
      roi: 'R$ 847.000',
      createdAt: '2024-01-15',
    },
    { 
      id: '2', 
      name: 'Fitness Pro', 
      status: 'generating', 
      progress: 75, 
      lastUpdate: 'há 5 min', 
      roi: 'R$ 320.000',
      createdAt: '2024-02-01',
    },
    { 
      id: '3', 
      name: 'Invest Academy', 
      status: 'generating', 
      progress: 45, 
      lastUpdate: 'há 12 min', 
      roi: 'R$ 560.000',
      createdAt: '2024-02-10',
    },
  ],
  currentProject: null,
  isLoading: false,
  
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === id ? { ...p, ...updates } : p
    ),
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),
}));

// ============================================
// DASHBOARD STORE
// ============================================

interface DashboardState {
  metrics: DashboardMetrics;
  activities: Activity[];
  suggestions: AISuggestion[];
  
  setMetrics: (metrics: DashboardMetrics) => void;
  addActivity: (activity: Activity) => void;
  dismissSuggestion: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: {
    projects: 12,
    projectsGrowth: '+3 este mês',
    contents: 1847,
    contentsGrowth: '+124 hoje',
    roi: 'R$ 2.4M',
    roiLabel: 'projetado este ano',
  },
  activities: [
    { id: '1', icon: '📤', text: 'Projeto "Método Liberdade" exportado para GHL', time: 'há 2h' },
    { id: '2', icon: '📱', text: '47 posts gerados para "Fitness Pro"', time: 'há 5h' },
    { id: '3', icon: '🤖', text: 'Clone atualizado com novos áudios', time: 'ontem' },
    { id: '4', icon: '🎯', text: 'Análise de 23 ads concorrentes concluída', time: 'ontem' },
  ],
  suggestions: [
    {
      id: '1',
      type: 'reactivation',
      title: 'Reativação de Leads',
      description: 'Você tem 847 leads inativos no projeto "Método Liberdade". Posso criar um fluxo de reativação.',
      impact: 'R$ 42.350',
      projectId: '1',
    },
  ],
  
  setMetrics: (metrics) => set({ metrics }),
  addActivity: (activity) => set((state) => ({ 
    activities: [activity, ...state.activities].slice(0, 10) 
  })),
  dismissSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.filter((s) => s.id !== id),
  })),
}));

// ============================================
// GENERATION STORE
// ============================================

interface GenerationState {
  agents: Agent[];
  isGenerating: boolean;
  currentAgentIndex: number;
  
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  startGeneration: () => void;
  stopGeneration: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  agents: [
    { id: '1', name: 'DNA Psicológico', description: 'Analisando tom de voz e personalidade', status: 'complete', output: 'Tom: direto, empático, prático...' },
    { id: '2', name: 'Pesquisa de Mercado', description: 'Identificando concorrentes e tendências', status: 'complete', output: '3 concorrentes principais identificados...' },
    { id: '3', name: 'Avatar Creator', description: 'Criando perfil psicográfico do avatar', status: 'running', progress: 67 },
    { id: '4', name: 'Oferta Hormozi', description: 'Estruturando oferta irresistível', status: 'pending' },
    { id: '5', name: 'Promise Generator', description: 'Gerando promessas e headlines', status: 'pending' },
    { id: '6', name: 'Big Idea Creator', description: 'Criando conceito central', status: 'pending' },
    { id: '7', name: 'Funnel Builder', description: 'Montando estrutura do funil', status: 'pending' },
    { id: '8', name: 'Content Factory', description: 'Gerando conteúdos de todas as etapas', status: 'pending' },
  ],
  isGenerating: true,
  currentAgentIndex: 2,
  
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => 
      a.id === id ? { ...a, ...updates } : a
    ),
  })),
  startGeneration: () => set({ isGenerating: true }),
  stopGeneration: () => set({ isGenerating: false }),
}));

// ============================================
// CONTENT STORE
// ============================================

interface ContentState {
  contents: Content[];
  filter: string;
  isLoading: boolean;
  
  setContents: (contents: Content[]) => void;
  setFilter: (filter: string) => void;
  addContent: (content: Content) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  contents: [
    { id: '1', projectId: '1', type: 'post', title: 'O erro que 90% cometem...', content: 'Você sabia que a maioria das pessoas...', status: 'approved', createdAt: '2024-02-15' },
    { id: '2', projectId: '1', type: 'post', title: '3 sinais de que você...', content: 'Presta atenção nesses sinais...', status: 'approved', createdAt: '2024-02-15' },
    { id: '3', projectId: '1', type: 'reel', title: 'Gancho: Você sabia?', content: 'Script de 30s sobre investimentos...', status: 'draft', createdAt: '2024-02-14' },
    { id: '4', projectId: '1', type: 'reel', title: 'Gancho: O maior erro', content: 'Script de 45s sobre mindset...', status: 'draft', createdAt: '2024-02-14' },
    { id: '5', projectId: '1', type: 'email', title: 'D+0 Welcome', content: 'Bem-vindo ao método que vai...', status: 'approved', createdAt: '2024-02-13' },
    { id: '6', projectId: '1', type: 'email', title: 'D+1 História', content: 'Deixa eu te contar como...', status: 'approved', createdAt: '2024-02-13' },
  ],
  filter: 'all',
  isLoading: false,
  
  setContents: (contents) => set({ contents }),
  setFilter: (filter) => set({ filter }),
  addContent: (content) => set((state) => ({ 
    contents: [...state.contents, content] 
  })),
  updateContent: (id, updates) => set((state) => ({
    contents: state.contents.map((c) => 
      c.id === id ? { ...c, ...updates } : c
    ),
  })),
  deleteContent: (id) => set((state) => ({
    contents: state.contents.filter((c) => c.id !== id),
  })),
}));

// ============================================
// COMPETITORS STORE
// ============================================

interface CompetitorsState {
  competitors: Competitor[];
  patterns: {
    ganchos: { text: string; percentage: number }[];
    estruturas: { text: string; percentage: number }[];
  };
  
  setCompetitors: (competitors: Competitor[]) => void;
  addCompetitor: (competitor: Competitor) => void;
  removeCompetitor: (id: string) => void;
}

export const useCompetitorsStore = create<CompetitorsState>((set) => ({
  competitors: [
    { id: '1', name: 'Método X', handle: '@metodox_oficial', platform: 'instagram', adsCount: 47, lastUpdate: 'há 2h' },
    { id: '2', name: 'Invest Pro', handle: '@investpro', platform: 'instagram', adsCount: 23, lastUpdate: 'há 2h' },
  ],
  patterns: {
    ganchos: [
      { text: '"Você sabia que..."', percentage: 34 },
      { text: '"O erro que 90%..."', percentage: 28 },
      { text: '"3 coisas que..."', percentage: 21 },
    ],
    estruturas: [
      { text: 'Problema → Erro → Solução', percentage: 45 },
      { text: 'História → Virada → CTA', percentage: 32 },
    ],
  },
  
  setCompetitors: (competitors) => set({ competitors }),
  addCompetitor: (competitor) => set((state) => ({ 
    competitors: [...state.competitors, competitor] 
  })),
  removeCompetitor: (id) => set((state) => ({
    competitors: state.competitors.filter((c) => c.id !== id),
  })),
}));

// ============================================
// CLONE STORE
// ============================================

interface CloneState {
  clone: Clone | null;
  testOutput: string;
  isGenerating: boolean;

  setClone: (clone: Clone) => void;
  updateClone: (updates: Partial<Clone>) => void;
  setTestOutput: (output: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useCloneStore = create<CloneState>((set) => ({
  clone: {
    id: '1',
    name: 'Dr. João Silva',
    status: 'active',
    quality: 78,
    dna: {
      tomDeVoz: 'Didático, empático',
      vocabulario: ['liberdade', 'resultado', 'método'],
      estilo: 'Direto ao ponto',
      gatilhos: ['escassez', 'autoridade'],
    },
    materials: {
      videos: 12,
      audios: 34,
      textos: 67,
      transcricoes: 23,
    },
  },
  testOutput: '',
  isGenerating: false,

  setClone: (clone) => set({ clone }),
  updateClone: (updates) => set((state) => ({
    clone: state.clone ? { ...state.clone, ...updates } : null,
  })),
  setTestOutput: (output) => set({ testOutput: output }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));

// ============================================
// INTEGRATIONS STORE
// ============================================

interface IntegrationsState {
  integrations: Integration[];
  
  setIntegrations: (integrations: Integration[]) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  integrations: [
    { id: '1', name: 'GoHighLevel', icon: '🔧', status: 'connected', lastSync: 'há 5 min' },
    { id: '2', name: 'n8n', icon: '⚡', status: 'connected', lastSync: 'há 1h' },
    { id: '3', name: 'Meta Ads', icon: '📘', status: 'expired' },
    { id: '4', name: 'Airtable', icon: '📊', status: 'disconnected' },
  ],
  
  setIntegrations: (integrations) => set({ integrations }),
  updateIntegration: (id, updates) => set((state) => ({
    integrations: state.integrations.map((i) => 
      i.id === id ? { ...i, ...updates } : i
    ),
  })),
}));

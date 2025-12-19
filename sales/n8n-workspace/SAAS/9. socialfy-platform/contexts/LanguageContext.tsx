import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Traduções PT-BR e EN
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.leads': 'Lead Intelligence',
    'nav.linkedin_search': 'Busca LinkedIn',
    'nav.instagram_search': 'Busca Instagram',
    'nav.cnpj_search': 'Busca CNPJ',
    'nav.campaigns': 'Campanhas',
    'nav.cadence_builder': 'Criador de Cadências',
    'nav.active_cadences': 'Cadências Ativas',
    'nav.show_rate': 'Show-Rate Guard',
    'nav.pipeline': 'Pipeline',
    'nav.inbox': 'Caixa Unificada',
    'nav.content': 'Estúdio de Conteúdo',
    'nav.agents': 'Agentes IA',
    'nav.icp': 'Analisador ICP',
    'nav.analytics': 'Analytics',
    'nav.accounts': 'Contas',
    'nav.integrations': 'Integrações',
    'nav.settings': 'Configurações',

    // Sections
    'section.prospecting': 'Prospecção',
    'section.cadences': 'Cadências',
    'section.engagement': 'Engajamento',
    'section.intelligence': 'Inteligência',
    'section.configuration': 'Configuração',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Visão geral do desempenho de vendas',
    'dashboard.last_30_days': 'Últimos 30 Dias',
    'dashboard.new_campaign': 'Nova Campanha',
    'dashboard.total_leads': 'Total de Leads',
    'dashboard.active_cadences': 'Cadências Ativas',
    'dashboard.meetings': 'Reuniões',
    'dashboard.show_rate': 'Show-Rate',
    'dashboard.channel_performance': 'Performance por Canal',
    'dashboard.cadence_funnel': 'Funil de Cadências',
    'dashboard.active_campaigns': 'Campanhas Ativas',
    'dashboard.view_all': 'Ver Tudo',

    // Metrics descriptions
    'metric.total_leads_desc': 'Total de prospectos no banco',
    'metric.active_cadences_desc': 'Leads atualmente em sequência',
    'metric.meetings_desc': 'Agendadas esta semana',
    'metric.show_rate_desc': 'Meta: 70% ✅',

    // Funnel
    'funnel.started': 'Iniciados',
    'funnel.day_1_3': 'Dia 1-3',
    'funnel.day_4_7': 'Dia 4-7',
    'funnel.responded': 'Respondidos',
    'funnel.meeting': 'Reunião',
    'funnel.won': 'Ganhos',
    'funnel.conversion': 'conversão',

    // Table headers
    'table.campaign': 'Campanha',
    'table.type': 'Tipo',
    'table.channels': 'Canais',
    'table.leads': 'Leads',
    'table.responses': 'Respostas',
    'table.conversion': 'Conv.',
    'table.status': 'Status',

    // Status
    'status.active': 'Ativo',
    'status.paused': 'Pausado',
    'status.completed': 'Concluído',
    'status.draft': 'Rascunho',

    // Common
    'common.search': 'Buscar...',
    'common.search_full': 'Buscar leads, campanhas ou configurações...',
    'common.notifications': 'Notificações',
    'common.mark_all_read': 'Marcar todas como lidas',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.new': 'Novo',
    'common.filter': 'Filtrar',

    // Settings
    'settings.title': 'Configurações',
    'settings.appearance': 'Aparência',
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.light': 'Claro',
    'settings.dark': 'Escuro',
    'settings.portuguese': 'Português',
    'settings.english': 'Inglês',

    // Leads
    'leads.title': 'Lead Intelligence',
    'leads.subtitle': 'Gerencie e analise seus prospectos',
    'leads.add_lead': 'Adicionar Lead',
    'leads.icp_score': 'Score ICP',

    // Pipeline
    'pipeline.title': 'Pipeline',
    'pipeline.subtitle': 'Acompanhe seus negócios em andamento',
    'pipeline.new': 'Novos',
    'pipeline.relationship': 'Relacionamento',
    'pipeline.scheduled': 'Agendados',
    'pipeline.proposal': 'Proposta',
    'pipeline.negotiation': 'Negociação',
    'pipeline.won': 'Ganhos',

    // Inbox
    'inbox.title': 'Caixa Unificada',
    'inbox.subtitle': 'Todas as conversas em um só lugar',
    'inbox.all_channels': 'Todos os Canais',

    // Agents
    'agents.title': 'Agentes IA',
    'agents.subtitle': 'Configure sua força de trabalho autônoma',
    'agents.new_agent': 'Novo Agente',

    // Accounts
    'accounts.title': 'Contas Conectadas',
    'accounts.subtitle': 'Gerencie seus perfis sociais e canais de comunicação',
  },

  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.leads': 'Lead Intelligence',
    'nav.linkedin_search': 'LinkedIn Search',
    'nav.instagram_search': 'Instagram Search',
    'nav.cnpj_search': 'CNPJ Search',
    'nav.campaigns': 'Campaigns',
    'nav.cadence_builder': 'Cadence Builder',
    'nav.active_cadences': 'Active Cadences',
    'nav.show_rate': 'Show-Rate Guard',
    'nav.pipeline': 'Pipeline',
    'nav.inbox': 'Unified Inbox',
    'nav.content': 'Content Studio',
    'nav.agents': 'AI Agents',
    'nav.icp': 'ICP Analyzer',
    'nav.analytics': 'Analytics',
    'nav.accounts': 'Accounts',
    'nav.integrations': 'Integrations',
    'nav.settings': 'Settings',

    // Sections
    'section.prospecting': 'Prospecting',
    'section.cadences': 'Cadences',
    'section.engagement': 'Engagement',
    'section.intelligence': 'Intelligence',
    'section.configuration': 'Configuration',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Overview of your sales performance',
    'dashboard.last_30_days': 'Last 30 Days',
    'dashboard.new_campaign': 'New Campaign',
    'dashboard.total_leads': 'Total Leads',
    'dashboard.active_cadences': 'Active Cadences',
    'dashboard.meetings': 'Meetings',
    'dashboard.show_rate': 'Show-Rate',
    'dashboard.channel_performance': 'Channel Performance',
    'dashboard.cadence_funnel': 'Cadence Funnel',
    'dashboard.active_campaigns': 'Active Campaigns',
    'dashboard.view_all': 'View All',

    // Metrics descriptions
    'metric.total_leads_desc': 'Total prospects in database',
    'metric.active_cadences_desc': 'Leads currently in sequence',
    'metric.meetings_desc': 'Scheduled this week',
    'metric.show_rate_desc': 'Target: 70% ✅',

    // Funnel
    'funnel.started': 'Started',
    'funnel.day_1_3': 'Day 1-3',
    'funnel.day_4_7': 'Day 4-7',
    'funnel.responded': 'Responded',
    'funnel.meeting': 'Meeting',
    'funnel.won': 'Won',
    'funnel.conversion': 'conversion',

    // Table headers
    'table.campaign': 'Campaign',
    'table.type': 'Type',
    'table.channels': 'Channels',
    'table.leads': 'Leads',
    'table.responses': 'Responses',
    'table.conversion': 'Conv.',
    'table.status': 'Status',

    // Status
    'status.active': 'Active',
    'status.paused': 'Paused',
    'status.completed': 'Completed',
    'status.draft': 'Draft',

    // Common
    'common.search': 'Search...',
    'common.search_full': 'Search leads, campaigns, or settings...',
    'common.notifications': 'Notifications',
    'common.mark_all_read': 'Mark all read',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.new': 'New',
    'common.filter': 'Filter',

    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.portuguese': 'Portuguese',
    'settings.english': 'English',

    // Leads
    'leads.title': 'Lead Intelligence',
    'leads.subtitle': 'Manage and analyze your prospects',
    'leads.add_lead': 'Add Lead',
    'leads.icp_score': 'ICP Score',

    // Pipeline
    'pipeline.title': 'Pipeline',
    'pipeline.subtitle': 'Track your deals in progress',
    'pipeline.new': 'New',
    'pipeline.relationship': 'Relationship',
    'pipeline.scheduled': 'Scheduled',
    'pipeline.proposal': 'Proposal',
    'pipeline.negotiation': 'Negotiation',
    'pipeline.won': 'Won',

    // Inbox
    'inbox.title': 'Unified Inbox',
    'inbox.subtitle': 'All conversations in one place',
    'inbox.all_channels': 'All Channels',

    // Agents
    'agents.title': 'AI Agents',
    'agents.subtitle': 'Configure your autonomous workforce',
    'agents.new_agent': 'New Agent',

    // Accounts
    'accounts.title': 'Connected Accounts',
    'accounts.subtitle': 'Manage your social profiles and communication channels',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('socialfy-language');
      if (stored === 'pt' || stored === 'en') return stored;
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('pt')) return 'pt';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('socialfy-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

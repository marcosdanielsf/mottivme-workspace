'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { Button, IconButton, Badge, Input } from '@/components/ui';
import {
  Bell,
  Plus,
  Search,
  Settings,
  ChevronDown,
  Sparkles,
} from '@/components/ui/icons';

// ============================================
// PAGE TITLES CONFIG
// ============================================

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Visão geral dos seus projetos e métricas',
  },
  briefing: {
    title: 'Novo Projeto',
    subtitle: 'Vamos criar algo incrível juntos',
  },
  generation: {
    title: 'Geração',
    subtitle: 'Assembly Line processando sua estratégia',
  },
  vortex: {
    title: 'Editor Vortex',
    subtitle: 'Construa funis de conversação visualmente',
  },
  content: {
    title: 'Content Hub',
    subtitle: 'Todos os conteúdos gerados pela IA',
  },
  ads: {
    title: 'Competitive Intelligence',
    subtitle: 'Espionagem de anúncios dos concorrentes',
  },
  clone: {
    title: 'Clone do Expert',
    subtitle: 'Configure e treine seu clone de IA',
  },
  export: {
    title: 'Export Center',
    subtitle: 'Exporte para GHL, n8n e mais',
  },
  settings: {
    title: 'Configurações',
    subtitle: 'Integrações e preferências',
  },
};

// ============================================
// HEADER COMPONENT
// ============================================

export const Header: React.FC = () => {
  const { activeTab, setShowNewProjectModal } = useAppStore();
  const [showSearch, setShowSearch] = React.useState(false);
  const [hasNotifications] = React.useState(true);
  
  const pageInfo = pageTitles[activeTab] || { title: '', subtitle: '' };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight">{pageInfo.title}</h2>
          <p className="text-white/40 text-sm">{pageInfo.subtitle}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className={cn(
            'flex items-center transition-all duration-300 overflow-hidden',
            showSearch ? 'w-64' : 'w-10'
          )}>
            {showSearch ? (
              <Input
                placeholder="Buscar..."
                icon={<Search className="w-4 h-4" />}
                className="animate-fade-in"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            ) : (
              <IconButton onClick={() => setShowSearch(true)}>
                <Search className="w-5 h-5" />
              </IconButton>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <IconButton>
              <Bell className="w-5 h-5" />
            </IconButton>
            {hasNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-pulse" />
            )}
          </div>

          {/* AI Quick Action */}
          <Button variant="secondary" size="sm" className="hidden md:flex">
            <Sparkles className="w-4 h-4" />
            Pedir à IA
            <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
          </Button>

          {/* New Project */}
          <Button onClick={() => setShowNewProjectModal(true)}>
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Breadcrumb (optional, for nested pages) */}
      {/* <div className="flex items-center gap-2 mt-2 text-sm text-white/40">
        <span>Dashboard</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">Projetos</span>
      </div> */}
    </header>
  );
};

export default Header;

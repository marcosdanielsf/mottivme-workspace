'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { Button, Avatar, Badge, Tooltip } from '@/components/ui';
import {
  Home,
  MessageCircle,
  Brain,
  Workflow,
  Smartphone,
  Target,
  Bot,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Crown,
} from '@/components/ui/icons';
import type { LucideIcon } from 'lucide-react';

// ============================================
// NAV ITEMS CONFIG
// ============================================

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  isNew?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'briefing', label: 'Briefing', icon: MessageCircle },
  { id: 'generation', label: 'Geração', icon: Brain, isNew: true },
  { id: 'vortex', label: 'Editor Vortex', icon: Workflow },
  { id: 'content', label: 'Content Hub', icon: Smartphone, badge: 47 },
  { id: 'ads', label: 'Competitive Intel', icon: Target },
  { id: 'clone', label: 'Clone Expert', icon: Bot },
  { id: 'export', label: 'Export Center', icon: Download },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

// ============================================
// SIDEBAR COMPONENT
// ============================================

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed, 
    toggleSidebar,
    user,
  } = useAppStore();

  return (
    <aside
      className={cn(
        'h-full glass border-r border-white/5 flex flex-col transition-all duration-300 relative',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <span className="text-xl">🏭</span>
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg tracking-tight">Assembly Line</h1>
              <p className="text-xs text-white/40">by MOTTIVME</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          const button = (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-brand-500/20 to-blue-500/20 text-white border border-brand-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
              style={{ 
                animationDelay: `${index * 30}ms`,
                animation: 'slideUp 0.4s ease-out forwards',
                opacity: 0,
              }}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                isActive && 'text-brand-400',
                !sidebarCollapsed && 'group-hover:scale-110'
              )} />
              
              {!sidebarCollapsed && (
                <>
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <Badge variant="brand" className="text-2xs">
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* New indicator */}
                  {item.isNew && (
                    <Badge variant="success" className="text-2xs">
                      Novo
                    </Badge>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                  )}
                </>
              )}
              
              {/* Collapsed badge */}
              {sidebarCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-2xs flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
          
          // Wrap with tooltip when collapsed
          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.id} content={item.label} side="right">
                {button}
              </Tooltip>
            );
          }
          
          return button;
        })}
      </nav>

      {/* Pro Upgrade Card (only when expanded) */}
      {!sidebarCollapsed && user?.plan !== 'agency' && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-blue-500/10 border border-brand-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium">Upgrade para Agency</span>
            </div>
            <p className="text-xs text-white/40 mb-3">
              White-label, múltiplos clientes, API
            </p>
            <Button size="sm" className="w-full">
              <Sparkles className="w-3 h-3" />
              Fazer Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className={cn(
          'flex items-center gap-3',
          sidebarCollapsed && 'justify-center'
        )}>
          <Avatar 
            name={user?.name || 'User'} 
            size="md"
          />
          {!sidebarCollapsed && (
            <div className="animate-fade-in flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-brand-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {user?.plan === 'pro' ? 'Pro' : user?.plan === 'agency' ? 'Agency' : 'Starter'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

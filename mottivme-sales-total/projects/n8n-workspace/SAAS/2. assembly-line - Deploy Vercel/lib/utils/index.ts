import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency (BRL)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format number with K/M suffix
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays} dias`;
  return then.toLocaleDateString('pt-BR');
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get greeting based on time
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    complete: 'text-success',
    generating: 'text-brand-400',
    pending: 'text-white/40',
    active: 'text-success',
    paused: 'text-warning',
    error: 'text-danger',
    draft: 'text-white/40',
    connected: 'text-success',
    disconnected: 'text-white/40',
    expired: 'text-warning',
  };
  return colors[status] || 'text-white/40';
}

// Get status badge variant
export function getStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    complete: 'badge-success',
    generating: 'badge-brand',
    pending: 'bg-white/10 text-white/40',
    active: 'badge-success',
    paused: 'badge-warning',
    error: 'badge-danger',
    draft: 'bg-white/10 text-white/40',
    connected: 'badge-success',
    disconnected: 'bg-white/10 text-white/40',
    expired: 'badge-warning',
  };
  return badges[status] || 'bg-white/10 text-white/40';
}

// Edge colors for Vortex
export const edgeColors: Record<string, string> = {
  respondeu: '#22c55e',
  nao_respondeu: '#ef4444',
  entrou_grupo: '#8b5cf6',
  agendou: '#3b82f6',
};

// Etapa icons
export const etapaIcons: Record<string, string> = {
  abordagem: '👋',
  ativacao: '⚡',
  qualificacao: '🎯',
  sondagem: '🔍',
  pitch: '💰',
};

// Etapa colors
export const etapaColors: Record<string, string> = {
  abordagem: '#3b82f6',
  ativacao: '#f59e0b',
  qualificacao: '#8b5cf6',
  sondagem: '#06b6d4',
  pitch: '#22c55e',
};

// Content type icons
export const contentIcons: Record<string, string> = {
  post: '📝',
  reel: '🎬',
  story: '📱',
  carrossel: '🎠',
  email: '📧',
  ad: '📢',
};

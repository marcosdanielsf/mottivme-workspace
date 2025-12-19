import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return formatDate(date);
}

export function calculateScore(data: {
  totalTimeSeconds: number;
  visitCount: number;
  sectionsVisited: number;
  ctaClicks: number;
  hasChat: boolean;
  watchedVideo: boolean;
}): number {
  let score = 0;

  // Tempo na proposta (max 30 pontos)
  const timeMinutes = data.totalTimeSeconds / 60;
  score += Math.min(timeMinutes * 2, 30);

  // Número de visitas (max 15 pontos)
  score += Math.min(data.visitCount * 5, 15);

  // Seções visitadas (max 20 pontos)
  score += data.sectionsVisited * 4;

  // Cliques em CTAs (max 15 pontos)
  score += Math.min(data.ctaClicks * 5, 15);

  // Chat iniciado (10 pontos)
  if (data.hasChat) score += 10;

  // Vídeo assistido (10 pontos)
  if (data.watchedVideo) score += 10;

  // Revisita bonus (10 pontos)
  if (data.visitCount > 1) score += 10;

  return Math.min(Math.round(score), 100);
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-gray-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "Quente";
  if (score >= 40) return "Morno";
  return "Frio";
}

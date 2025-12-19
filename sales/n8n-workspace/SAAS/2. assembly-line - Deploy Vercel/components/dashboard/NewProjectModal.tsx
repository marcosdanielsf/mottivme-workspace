'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { Button, IconButton, Card } from '@/components/ui';
import {
  X,
  MessageCircle,
  FileText,
  Download,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
} from '@/components/ui/icons';

// ============================================
// NEW PROJECT MODAL
// ============================================

export const NewProjectModal: React.FC = () => {
  const { showNewProjectModal, setShowNewProjectModal, setActiveTab } = useAppStore();

  if (!showNewProjectModal) return null;

  const handleStartFromScratch = () => {
    setShowNewProjectModal(false);
    setActiveTab('briefing');
  };

  const handleUseTemplate = () => {
    setShowNewProjectModal(false);
    // TODO: Open template selector
  };

  const handleImport = () => {
    setShowNewProjectModal(false);
    // TODO: Open import dialog
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setShowNewProjectModal(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="glass rounded-2xl p-8 w-full max-w-lg pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Novo Projeto</h3>
              <p className="text-sm text-white/40">Escolha como quer começar</p>
            </div>
            <IconButton onClick={() => setShowNewProjectModal(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* From Scratch */}
            <button
              onClick={handleStartFromScratch}
              className="w-full p-4 glass glass-hover rounded-xl flex items-center gap-4 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-glow-sm group-hover:shadow-glow transition-all">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">Começar do Zero</p>
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Recomendado
                  </span>
                </div>
                <p className="text-sm text-white/40">
                  Responda algumas perguntas e a IA cria toda a estratégia
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-1" />
            </button>

            {/* Template */}
            <button
              onClick={handleUseTemplate}
              className="w-full p-4 glass glass-hover rounded-xl flex items-center gap-4 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold mb-1">Usar Template</p>
                <p className="text-sm text-white/40">
                  Comece com um funil pré-configurado
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-1" />
            </button>

            {/* Import */}
            <button
              onClick={handleImport}
              className="w-full p-4 glass glass-hover rounded-xl flex items-center gap-4 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold mb-1">Importar Projeto</p>
                <p className="text-sm text-white/40">
                  Carregue um projeto existente ou de outro cliente
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all group-hover:translate-x-1" />
            </button>
          </div>

          {/* Templates Preview */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-white/40 mb-3">Templates populares:</p>
            <div className="flex gap-2 flex-wrap">
              {['Funil Vortex', 'High Ticket', 'Lançamento', 'Perpétuo', 'VSL'].map((template) => (
                <button
                  key={template}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcut */}
          <p className="text-center text-xs text-white/30 mt-6">
            Dica: Pressione <kbd className="px-1.5 py-0.5 rounded bg-white/10 mx-1">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 mx-1">N</kbd> para abrir rapidamente
          </p>
        </div>
      </div>
    </>
  );
};

export default NewProjectModal;

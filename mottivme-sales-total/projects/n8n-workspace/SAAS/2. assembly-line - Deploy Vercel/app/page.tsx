'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/stores';

// Layout Components
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Page Components
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { NewProjectModal } from '@/components/dashboard/NewProjectModal';
import { BriefingContent } from '@/components/briefing/BriefingContent';
import { GenerationContent } from '@/components/generation/GenerationContent';
import { ContentHubContent } from '@/components/content/ContentHubContent';
import { VortexEditor } from '@/components/vortex/VortexEditor';
import { CloneExpertContent } from '@/components/clone/CloneExpertContent';
import { AdsIntelContent } from '@/components/ads/AdsIntelContent';
import { ExportCenterContent } from '@/components/export/ExportCenterContent';
import { SettingsContent } from '@/components/settings/SettingsContent';

// ============================================
// MAIN APP PAGE
// ============================================

export default function HomePage() {
  const { activeTab } = useAppStore();

  // Keyboard shortcut for new project
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        useAppStore.getState().setShowNewProjectModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render active content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'briefing':
        return <BriefingContent />;
      case 'generation':
        return <GenerationContent />;
      case 'vortex':
        return <VortexEditor />;
      case 'content':
        return <ContentHubContent />;
      case 'ads':
        return <AdsIntelContent />;
      case 'clone':
        return <CloneExpertContent />;
      case 'export':
        return <ExportCenterContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      <NewProjectModal />
    </div>
  );
}

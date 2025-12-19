'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, Button, Badge, IconButton } from '@/components/ui';
import {
  Download,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Loader2,
  Zap,
  Globe,
  Mail,
  Smartphone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Settings,
  Link,
  Eye,
  Users,
  Code,
  Package,
} from '@/components/ui/icons';

// ============================================
// TYPES
// ============================================

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'disconnected' | 'expired';
  lastSync?: string;
  category: 'crm' | 'automation' | 'ads' | 'other';
}

interface ExportItem {
  id: string;
  type: 'funnel' | 'emails' | 'content' | 'ads' | 'clone';
  name: string;
  items: number;
  lastExport?: string;
}

interface ExportHistory {
  id: string;
  destination: string;
  type: string;
  items: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
}

// ============================================
// MOCK DATA
// ============================================

const integrations: Integration[] = [
  { id: '1', name: 'GoHighLevel', icon: '🚀', description: 'CRM e automação completa', status: 'connected', lastSync: 'há 2h', category: 'crm' },
  { id: '2', name: 'n8n', icon: '⚡', description: 'Automações e workflows', status: 'connected', lastSync: 'há 5h', category: 'automation' },
  { id: '3', name: 'Meta Ads', icon: '📘', description: 'Facebook e Instagram Ads', status: 'expired', category: 'ads' },
  { id: '4', name: 'Google Ads', icon: '🔍', description: 'Campanhas de pesquisa', status: 'disconnected', category: 'ads' },
  { id: '5', name: 'Airtable', icon: '📊', description: 'Database e organização', status: 'disconnected', category: 'other' },
  { id: '6', name: 'Zapier', icon: '🔗', description: 'Conectar com 5000+ apps', status: 'disconnected', category: 'automation' },
  { id: '7', name: 'Mailchimp', icon: '📧', description: 'Email marketing', status: 'disconnected', category: 'other' },
  { id: '8', name: 'Webhook', icon: '🪝', description: 'Integração customizada', status: 'connected', lastSync: 'há 1h', category: 'automation' },
];

const exportItems: ExportItem[] = [
  { id: '1', type: 'funnel', name: 'Funil Vortex Completo', items: 8, lastExport: '2024-02-15' },
  { id: '2', type: 'emails', name: 'Sequência de Emails', items: 4, lastExport: '2024-02-14' },
  { id: '3', type: 'content', name: 'Posts e Reels', items: 47 },
  { id: '4', type: 'ads', name: 'Criativos de Ads', items: 12, lastExport: '2024-02-13' },
  { id: '5', type: 'clone', name: 'DNA do Clone', items: 1 },
];

const exportHistory: ExportHistory[] = [
  { id: '1', destination: 'GoHighLevel', type: 'Funil Completo', items: 8, status: 'success', date: '2024-02-15 14:32' },
  { id: '2', destination: 'n8n', type: 'Webhook Leads', items: 1, status: 'success', date: '2024-02-15 10:15' },
  { id: '3', destination: 'Meta Ads', type: 'Criativos', items: 5, status: 'failed', date: '2024-02-14 18:45' },
  { id: '4', destination: 'Download', type: 'Emails (JSON)', items: 4, status: 'success', date: '2024-02-14 09:20' },
];

// ============================================
// EXPORT CENTER CONTENT
// ============================================

export const ExportCenterContent: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'export' | 'integrations' | 'history'>('export');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [isExporting, setIsExporting] = React.useState(false);
  const [selectedDestination, setSelectedDestination] = React.useState<string | null>(null);

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');

  const handleExport = () => {
    if (!selectedDestination || selectedItems.length === 0) return;
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setSelectedItems([]);
      setSelectedDestination(null);
    }, 2000);
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 animate-slide-up">
        {[
          { label: 'Integrações Ativas', value: connectedIntegrations.length, icon: Link, color: 'text-success' },
          { label: 'Exports Este Mês', value: 23, icon: Download, color: 'text-blue-400' },
          { label: 'Items Exportáveis', value: exportItems.reduce((a, b) => a + b.items, 0), icon: Package, color: 'text-brand-400' },
          { label: 'Último Export', value: 'há 2h', icon: Clock, color: 'text-orange-400' },
        ].map((stat, i) => (
          <Card key={i} className="text-center py-4">
            <stat.icon className={cn('w-6 h-6 mx-auto mb-2', stat.color)} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/40">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-slide-up stagger-1">
        {[
          { id: 'export', label: 'Exportar', icon: Download },
          { id: 'integrations', label: 'Integrações', icon: Link },
          { id: 'history', label: 'Histórico', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all',
              activeTab === tab.id
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-12 gap-6 animate-slide-up stagger-2">
          {/* Items to Export */}
          <div className="col-span-7">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">O que exportar?</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedItems(selectedItems.length === exportItems.length ? [] : exportItems.map(i => i.id))}
                >
                  {selectedItems.length === exportItems.length ? 'Desmarcar todos' : 'Selecionar todos'}
                </Button>
              </div>

              <div className="space-y-3">
                {exportItems.map((item) => {
                  const typeConfig = {
                    funnel: { icon: Zap, color: 'text-brand-400', bg: 'bg-brand-500/20' },
                    emails: { icon: Mail, color: 'text-green-400', bg: 'bg-green-500/20' },
                    content: { icon: Smartphone, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                    ads: { icon: Globe, color: 'text-red-400', bg: 'bg-red-500/20' },
                    clone: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/20' },
                  };
                  const config = typeConfig[item.type];
                  const isSelected = selectedItems.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        'w-full p-4 rounded-xl text-left transition-all flex items-center gap-4',
                        isSelected 
                          ? 'bg-brand-500/20 border-2 border-brand-500/50' 
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      )}
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                        isSelected ? 'bg-brand-500 border-brand-500' : 'border-white/30'
                      )}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>

                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                        <config.icon className={cn('w-5 h-5', config.color)} />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-white/40">{item.items} items</p>
                      </div>

                      {item.lastExport && (
                        <Badge variant="default" className="text-2xs">
                          Exportado em {item.lastExport}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Destination */}
          <div className="col-span-5 space-y-4">
            <Card>
              <h4 className="font-semibold mb-4">Para onde exportar?</h4>

              <div className="space-y-2 mb-4">
                {connectedIntegrations.map((integration) => (
                  <button
                    key={integration.id}
                    onClick={() => setSelectedDestination(integration.id)}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-all flex items-center gap-3',
                      selectedDestination === integration.id
                        ? 'bg-brand-500/20 border border-brand-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                    )}
                  >
                    <span className="text-2xl">{integration.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{integration.name}</p>
                      <p className="text-xs text-white/40">Conectado • {integration.lastSync}</p>
                    </div>
                    {selectedDestination === integration.id && (
                      <CheckCircle2 className="w-5 h-5 text-brand-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setSelectedDestination('download')}
                  className={cn(
                    'w-full p-3 rounded-lg text-left transition-all flex items-center gap-3',
                    selectedDestination === 'download'
                      ? 'bg-brand-500/20 border border-brand-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Download Local</p>
                    <p className="text-xs text-white/40">JSON, CSV ou ZIP</p>
                  </div>
                </button>
              </div>
            </Card>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleExport}
              disabled={!selectedDestination || selectedItems.length === 0 || isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Exportar {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 animate-slide-up">
          {['crm', 'automation', 'ads', 'other'].map((category) => {
            const items = integrations.filter(i => i.category === category);
            const labels = { crm: 'CRM & Vendas', automation: 'Automação', ads: 'Anúncios', other: 'Outros' };

            return (
              <Card key={category}>
                <h4 className="font-semibold mb-4">{labels[category as keyof typeof labels]}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((integration) => (
                    <div
                      key={integration.id}
                      className={cn(
                        'p-4 rounded-xl border transition-all',
                        integration.status === 'connected' ? 'bg-success/5 border-success/20' 
                          : integration.status === 'expired' ? 'bg-warning/5 border-warning/20'
                          : 'bg-white/5 border-white/10'
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <p className="font-semibold">{integration.name}</p>
                          <p className="text-xs text-white/40">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={integration.status === 'connected' ? 'success' : integration.status === 'expired' ? 'warning' : 'default'}>
                          {integration.status === 'connected' ? 'Conectado' : integration.status === 'expired' ? 'Expirado' : 'Desconectado'}
                        </Badge>
                        <Button size="sm" variant={integration.status === 'connected' ? 'ghost' : 'primary'}>
                          {integration.status === 'connected' ? <Settings className="w-4 h-4" /> : 'Conectar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">API & Webhooks</h4>
                <p className="text-sm text-white/40">Integração customizada</p>
              </div>
              <Button variant="secondary" size="sm">
                <Code className="w-4 h-4" />
                Documentação
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-xs text-white/40 mb-2">API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-black/20 px-3 py-2 rounded-lg">sk_live_••••••••</code>
                  <IconButton size="sm"><Eye className="w-4 h-4" /></IconButton>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-xs text-white/40 mb-2">Webhook URL</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-black/20 px-3 py-2 rounded-lg truncate">https://api.assembly.ai/wh/abc</code>
                  <IconButton size="sm"><ExternalLink className="w-4 h-4" /></IconButton>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <Card className="animate-slide-up">
          <h4 className="font-semibold mb-4">Histórico de Exports</h4>
          <div className="space-y-2">
            {exportHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  item.status === 'success' ? 'bg-success/20' : 'bg-danger/20'
                )}>
                  {item.status === 'success' ? <CheckCircle2 className="w-5 h-5 text-success" /> : <X className="w-5 h-5 text-danger" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.type}</p>
                  <p className="text-xs text-white/40">{item.items} items → {item.destination}</p>
                </div>
                <div className="text-right">
                  <Badge variant={item.status === 'success' ? 'success' : 'danger'}>
                    {item.status === 'success' ? 'Sucesso' : 'Falhou'}
                  </Badge>
                  <p className="text-xs text-white/30 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExportCenterContent;

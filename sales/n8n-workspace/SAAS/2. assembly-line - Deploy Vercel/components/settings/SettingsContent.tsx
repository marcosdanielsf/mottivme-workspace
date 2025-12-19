'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/stores';
import { Card, Button, Badge, IconButton, Input, Progress } from '@/components/ui';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Zap,
  Mail,
  Smartphone,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Loader2,
  Crown,
  Star,
  Users,
  Building,
  LogOut,
  Trash2,
  Download,
  Upload,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Key,
  Lock,
  AlertCircle,
  CheckCircle2,
  Info,
} from '@/components/ui/icons';

// ============================================
// SETTINGS CONTENT
// ============================================

export const SettingsContent: React.FC = () => {
  const { user } = useAppStore();
  const [activeSection, setActiveSection] = React.useState('profile');
  const [isSaving, setIsSaving] = React.useState(false);

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Assinatura', icon: CreditCard },
    { id: 'api', label: 'API & Dados', icon: Key },
    { id: 'team', label: 'Time', icon: Users },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card className="p-2 sticky top-6">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all',
                    activeSection === section.id
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="col-span-9 space-y-6">
          {activeSection === 'profile' && <ProfileSection user={user} onSave={handleSave} isSaving={isSaving} />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'appearance' && <AppearanceSection />}
          {activeSection === 'security' && <SecuritySection />}
          {activeSection === 'billing' && <BillingSection />}
          {activeSection === 'api' && <APISection />}
          {activeSection === 'team' && <TeamSection />}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PROFILE SECTION
// ============================================

const ProfileSection: React.FC<{ user: any; onSave: () => void; isSaving: boolean }> = ({ user, onSave, isSaving }) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <h4 className="font-semibold mb-6">Informações Pessoais</h4>
        
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
              {user?.name?.[0] || 'M'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Nome</label>
                <Input defaultValue={user?.name || 'Marcos'} />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Sobrenome</label>
                <Input defaultValue="Silva" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Email</label>
              <Input defaultValue="marcos@mottivme.com" type="email" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Telefone</label>
            <Input defaultValue="+55 11 99999-9999" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Fuso Horário</label>
            <Input defaultValue="America/Sao_Paulo" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar Alterações
          </Button>
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Perfil Público</h4>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Bio</label>
            <textarea 
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-brand-500/50 transition-all resize-none"
              rows={3}
              defaultValue="Expert em marketing digital e funis de vendas."
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Website</label>
            <Input defaultValue="https://mottivme.com" />
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============================================
// NOTIFICATIONS SECTION
// ============================================

const NotificationsSection: React.FC = () => {
  const [settings, setSettings] = React.useState({
    emailDigest: true,
    pushNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    weeklyReport: true,
    newFeatures: true,
    sounds: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <h4 className="font-semibold mb-6">Preferências de Notificação</h4>
        
        <div className="space-y-4">
          {[
            { key: 'emailDigest', label: 'Resumo por Email', description: 'Receba um resumo diário das atividades', icon: Mail },
            { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações no navegador e celular', icon: Bell },
            { key: 'projectUpdates', label: 'Atualizações de Projetos', description: 'Quando um projeto for concluído ou precisar de atenção', icon: Zap },
            { key: 'weeklyReport', label: 'Relatório Semanal', description: 'Métricas e insights toda segunda-feira', icon: Calendar },
            { key: 'newFeatures', label: 'Novidades do Produto', description: 'Seja o primeiro a saber sobre novos recursos', icon: Star },
            { key: 'marketingEmails', label: 'Emails de Marketing', description: 'Ofertas especiais e promoções', icon: Mail },
            { key: 'sounds', label: 'Sons', description: 'Tocar sons para notificações', icon: Volume2 },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-white/40">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggle(item.key as keyof typeof settings)}
                className={cn(
                  'w-12 h-7 rounded-full transition-all relative',
                  settings[item.key as keyof typeof settings] ? 'bg-brand-500' : 'bg-white/20'
                )}
              >
                <div className={cn(
                  'w-5 h-5 rounded-full bg-white absolute top-1 transition-all',
                  settings[item.key as keyof typeof settings] ? 'left-6' : 'left-1'
                )} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// APPEARANCE SECTION
// ============================================

const AppearanceSection: React.FC = () => {
  const [theme, setTheme] = React.useState('dark');
  const [accentColor, setAccentColor] = React.useState('violet');

  const colors = [
    { id: 'violet', color: '#8b5cf6' },
    { id: 'blue', color: '#3b82f6' },
    { id: 'green', color: '#22c55e' },
    { id: 'orange', color: '#f97316' },
    { id: 'pink', color: '#ec4899' },
    { id: 'cyan', color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <h4 className="font-semibold mb-6">Tema</h4>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { id: 'light', label: 'Claro', icon: Sun },
            { id: 'dark', label: 'Escuro', icon: Moon },
            { id: 'system', label: 'Sistema', icon: Smartphone },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                theme === t.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
              )}
            >
              <t.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        <h4 className="font-semibold mb-4">Cor de Destaque</h4>
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              className={cn(
                'w-10 h-10 rounded-full transition-all',
                accentColor === c.id && 'ring-2 ring-offset-2 ring-offset-background'
              )}
              style={{ backgroundColor: c.color, '--tw-ring-color': c.color } as React.CSSProperties}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Densidade da Interface</h4>
        <div className="grid grid-cols-3 gap-4">
          {['Compacto', 'Confortável', 'Espaçoso'].map((d, i) => (
            <button
              key={d}
              className={cn(
                'p-3 rounded-lg border transition-all text-sm',
                i === 1 ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// SECURITY SECTION
// ============================================

const SecuritySection: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <h4 className="font-semibold mb-6">Alterar Senha</h4>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Senha Atual</label>
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Nova Senha</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Confirmar Nova Senha</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button>
            <Lock className="w-4 h-4" />
            Atualizar Senha
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold">Autenticação em Dois Fatores</h4>
            <p className="text-sm text-white/40">Adicione uma camada extra de segurança</p>
          </div>
          <Badge variant="warning">Desativado</Badge>
        </div>
        <Button variant="secondary">
          <Shield className="w-4 h-4" />
          Ativar 2FA
        </Button>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Sessões Ativas</h4>
        <div className="space-y-3">
          {[
            { device: 'MacBook Pro', location: 'São Paulo, BR', current: true, time: 'Agora' },
            { device: 'iPhone 15', location: 'São Paulo, BR', current: false, time: 'há 2 dias' },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-white/40" />
                <div>
                  <p className="font-medium text-sm">{session.device}</p>
                  <p className="text-xs text-white/40">{session.location} • {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <Badge variant="success">Atual</Badge>
              ) : (
                <Button variant="ghost" size="sm">Encerrar</Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-danger/30 bg-danger/5">
        <h4 className="font-semibold text-danger mb-2">Zona de Perigo</h4>
        <p className="text-sm text-white/40 mb-4">Ações irreversíveis</p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Exportar Dados
          </Button>
          <Button variant="danger" size="sm">
            <Trash2 className="w-4 h-4" />
            Excluir Conta
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ============================================
// BILLING SECTION
// ============================================

const BillingSection: React.FC = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="bg-gradient-to-br from-brand-500/20 to-blue-500/20 border-brand-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Plano Pro</h3>
              <p className="text-white/60">R$ 297/mês • Renova em 15/03/2024</p>
            </div>
          </div>
          <Button variant="secondary">Gerenciar Plano</Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Projetos', used: 12, total: 'Ilimitado' },
            { label: 'Conteúdos', used: 1847, total: 'Ilimitado' },
            { label: 'Exports', used: 23, total: 100 },
            { label: 'Clone Calls', used: 450, total: 1000 },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-black/20">
              <p className="text-xs text-white/40 mb-1">{item.label}</p>
              <p className="font-semibold">{item.used} <span className="text-white/40 font-normal">/ {item.total}</span></p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Método de Pagamento</h4>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-white/40">Expira em 12/2025</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Alterar</Button>
        </div>
        <Button variant="secondary" size="sm">
          <CreditCard className="w-4 h-4" />
          Adicionar Cartão
        </Button>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Histórico de Faturas</h4>
        <div className="space-y-2">
          {[
            { date: 'Fev 2024', amount: 'R$ 297,00', status: 'paid' },
            { date: 'Jan 2024', amount: 'R$ 297,00', status: 'paid' },
            { date: 'Dez 2023', amount: 'R$ 297,00', status: 'paid' },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-white/40">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Pago</Badge>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// API SECTION
// ============================================

const APISection: React.FC = () => {
  const [showKey, setShowKey] = React.useState(false);

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <h4 className="font-semibold mb-4">Chaves de API</h4>
        <p className="text-sm text-white/40 mb-6">Use estas chaves para integrar com outros sistemas</p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Production Key</p>
              <Badge variant="success">Ativa</Badge>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-black/20 px-3 py-2 rounded-lg">
                {showKey ? 'sk_live_a1b2c3d4e5f6g7h8i9j0' : 'sk_live_••••••••••••••••••••'}
              </code>
              <IconButton onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </IconButton>
              <IconButton>
                <Copy className="w-4 h-4" />
              </IconButton>
            </div>
          </div>

          <Button variant="secondary">
            <RefreshCw className="w-4 h-4" />
            Gerar Nova Chave
          </Button>
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Webhooks</h4>
        <div className="p-4 rounded-lg bg-white/5 mb-4">
          <p className="text-sm text-white/40 mb-2">Endpoint URL</p>
          <code className="text-sm font-mono">https://api.assemblyline.ai/webhook/your-id</code>
        </div>
        <Button variant="secondary" size="sm">
          <ExternalLink className="w-4 h-4" />
          Ver Documentação
        </Button>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Exportar Dados</h4>
        <p className="text-sm text-white/40 mb-4">Baixe todos os seus dados em formato JSON</p>
        <Button variant="secondary">
          <Download className="w-4 h-4" />
          Solicitar Export
        </Button>
      </Card>
    </div>
  );
};

// ============================================
// TEAM SECTION
// ============================================

const TeamSection: React.FC = () => {
  const members = [
    { name: 'Marcos Silva', email: 'marcos@mottivme.com', role: 'Owner', avatar: 'M' },
    { name: 'Ana Costa', email: 'ana@mottivme.com', role: 'Admin', avatar: 'A' },
    { name: 'Pedro Santos', email: 'pedro@mottivme.com', role: 'Editor', avatar: 'P' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold">Membros do Time</h4>
            <p className="text-sm text-white/40">3 de 5 membros</p>
          </div>
          <Button>
            <Users className="w-4 h-4" />
            Convidar
          </Button>
        </div>

        <div className="space-y-3">
          {members.map((member, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center font-bold">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-white/40">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={member.role === 'Owner' ? 'brand' : 'default'}>{member.role}</Badge>
                {member.role !== 'Owner' && (
                  <IconButton size="sm">
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h4 className="font-semibold mb-4">Permissões por Função</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left">
                <th className="pb-3">Permissão</th>
                <th className="pb-3 text-center">Owner</th>
                <th className="pb-3 text-center">Admin</th>
                <th className="pb-3 text-center">Editor</th>
              </tr>
            </thead>
            <tbody className="text-white/60">
              {[
                ['Criar projetos', true, true, true],
                ['Editar projetos', true, true, true],
                ['Excluir projetos', true, true, false],
                ['Gerenciar time', true, true, false],
                ['Billing', true, false, false],
                ['Configurações', true, true, false],
              ].map(([perm, ...roles], i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="py-3">{perm}</td>
                  {roles.map((r, j) => (
                    <td key={j} className="py-3 text-center">
                      {r ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SettingsContent;

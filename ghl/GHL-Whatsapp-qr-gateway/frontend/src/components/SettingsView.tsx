import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Icons } from './icons';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export function SettingsView() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [tenantInfo, setTenantInfo] = useState<{ name: string; slug: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's tenant
      const { data: userData, error: userError } = await supabase
        .from('ghl_wa_users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (userError || !userData) throw new Error('User not associated with a tenant');

      // Get tenant settings
      const { data: tenantData, error: tenantError } = await supabase
        .from('ghl_wa_tenants')
        .select('name, slug, webhook_url, webhook_secret')
        .eq('id', userData.tenant_id)
        .single();

      if (tenantError) throw tenantError;

      if (tenantData) {
        setTenantInfo({ name: tenantData.name, slug: tenantData.slug });
        setWebhookUrl(tenantData.webhook_url || '');
        setWebhookSecret(tenantData.webhook_secret || '');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error(error.message || 'Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('ghl_wa_users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!userData) throw new Error('Tenant not found');

      const { error } = await supabase
        .from('ghl_wa_tenants')
        .update({
          webhook_url: webhookUrl,
          webhook_secret: webhookSecret
        })
        .eq('id', userData.tenant_id);

      if (error) throw error;

      toast.success('Configurações salvas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-grid">
      <section className="panel">
        <div className="section-heading">
          <h2>
            <Icons.Settings className="icon-lg" />
            {t('settings')}
          </h2>
          <p>Configurações da sua conta e integrações</p>
        </div>

        {tenantInfo && (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Informações da Empresa</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nome:</span>
              <span style={{ fontWeight: '500' }}>{tenantInfo.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>Slug:</span>
              <code style={{ background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{tenantInfo.slug}</code>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="webhookUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Webhook URL (GHL / N8N / Zapier)
            </label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Para onde devemos enviar as mensagens recebidas no WhatsApp?
            </p>
            <div style={{ position: 'relative' }}>
              <Icons.Webhook className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://services.leadconnectorhq.com/hooks/..."
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="webhookSecret" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Webhook Secret (Opcional)
            </label>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Chave secreta para validar a autenticidade das requisições (header X-Webhook-Secret)
            </p>
            <div style={{ position: 'relative' }}>
              <Icons.Lock className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="webhookSecret"
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="••••••••••••••••"
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner-sm"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Icons.Save className="icon" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

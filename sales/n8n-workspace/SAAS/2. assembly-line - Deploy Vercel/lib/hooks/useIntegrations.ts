'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Tables, Insertable, Updatable } from '@/lib/supabase/types';

type Integration = Tables<'integrations'>;

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch all integrations for current user
  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }

    setIntegrations(data || []);
    setIsLoading(false);
  }, [supabase]);

  // Add integration
  const addIntegration = useCallback(async (
    integration: Omit<Insertable<'integrations'>, 'user_id'>
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('integrations')
      .insert({ ...integration, user_id: user.id })
      .select()
      .single();

    if (error) return { error };

    setIntegrations(prev => [data, ...prev]);
    return { data };
  }, [supabase]);

  // Update integration
  const updateIntegration = useCallback(async (
    id: string,
    updates: Updatable<'integrations'>
  ) => {
    const { data, error } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { error };

    setIntegrations(prev => prev.map(i => i.id === id ? data : i));
    return { data };
  }, [supabase]);

  // Delete integration
  const deleteIntegration = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id);

    if (error) return { error };

    setIntegrations(prev => prev.filter(i => i.id !== id));
    return { success: true };
  }, [supabase]);

  // Connect integration (OAuth flow starter)
  const connectIntegration = useCallback(async (provider: Integration['provider']) => {
    // This would typically redirect to OAuth flow
    // For now, we just create a placeholder entry
    return addIntegration({
      provider,
      name: getProviderName(provider),
      status: 'connected',
    });
  }, [addIntegration]);

  // Disconnect integration
  const disconnectIntegration = useCallback(async (id: string) => {
    return updateIntegration(id, {
      status: 'disconnected',
      access_token: null,
      refresh_token: null,
    });
  }, [updateIntegration]);

  // Sync integration
  const syncIntegration = useCallback(async (id: string) => {
    // Update last sync time
    return updateIntegration(id, {
      last_sync_at: new Date().toISOString(),
    });
  }, [updateIntegration]);

  // Get integration by provider
  const getByProvider = useCallback((provider: Integration['provider']) => {
    return integrations.find(i => i.provider === provider);
  }, [integrations]);

  // Check if provider is connected
  const isConnected = useCallback((provider: Integration['provider']) => {
    const integration = integrations.find(i => i.provider === provider);
    return integration?.status === 'connected';
  }, [integrations]);

  // Initial fetch
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integrations',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIntegrations(prev => [payload.new as Integration, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setIntegrations(prev =>
              prev.map(i => i.id === payload.new.id ? payload.new as Integration : i)
            );
          } else if (payload.eventType === 'DELETE') {
            setIntegrations(prev => prev.filter(i => i.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return {
    integrations,
    isLoading,
    error,
    fetchIntegrations,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    getByProvider,
    isConnected,
  };
}

// Helper function to get display name for provider
function getProviderName(provider: Integration['provider']): string {
  const names: Record<Integration['provider'], string> = {
    gohighlevel: 'GoHighLevel',
    n8n: 'n8n',
    meta: 'Meta Ads',
    google: 'Google',
    zapier: 'Zapier',
    airtable: 'Airtable',
    mailchimp: 'Mailchimp',
    webhook: 'Webhook',
  };
  return names[provider];
}

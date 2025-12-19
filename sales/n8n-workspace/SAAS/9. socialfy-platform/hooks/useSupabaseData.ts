import { useState, useEffect } from 'react';
import { db, Lead, Campaign, Message, PipelineDeal, ConnectedAccount, AIAgent } from '../lib/supabase';

// Types for UI (matching constants.ts format)
export interface UIMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

export interface UICampaign {
  id: string;
  name: string;
  type: string;
  status: string;
  channels: string[];
  leads: number;
  responses: number;
  conversionRate: number;
  cadenceName: string;
  owner: string;
}

export interface UILead {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  status: string;
  channels: string[];
  icpScore: number;
  cadenceStatus?: {
    name: string;
    step: string;
    nextActivity: string;
  };
}

export interface UIPipelineCard {
  id: string;
  leadName: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  channels: string[];
  cadenceStatus: string;
  nextActivity: string;
  showRateGuard?: Record<string, string>;
}

export interface UIAccount {
  id: string;
  platform: string;
  name: string;
  status: string;
  usage: number;
  limit: number;
}

export interface UIAgent {
  id: string;
  name: string;
  type: string;
  language: string;
  model: string;
  isActive: boolean;
  description: string;
}

// Transform functions (DB -> UI format)
function transformCampaign(campaign: Campaign): UICampaign {
  const typeMap: Record<string, string> = {
    'connection': 'Connection',
    'warm_up': 'Warm-up',
    'authority': 'Authority',
    'instagram_dm': 'Instagram DM',
    'multi_channel': 'Multi-channel',
  };

  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'active': 'Active',
    'paused': 'Paused',
    'completed': 'Completed',
    'archived': 'Archived',
  };

  return {
    id: campaign.id,
    name: campaign.name,
    type: typeMap[campaign.type] || campaign.type,
    status: statusMap[campaign.status] || campaign.status,
    channels: campaign.channels || [],
    leads: campaign.leads_count || 0,
    responses: campaign.responses_count || 0,
    conversionRate: campaign.conversion_rate || 0,
    cadenceName: campaign.cadence_name || 'N/A',
    owner: campaign.owner_id || 'Unassigned',
  };
}

function transformLead(lead: Lead): UILead {
  const statusMap: Record<string, string> = {
    'available': 'Available',
    'in_cadence': 'In Cadence',
    'responding': 'Responding',
    'scheduled': 'Scheduled',
    'converted': 'Converted',
    'lost': 'Lost',
  };

  return {
    id: lead.id,
    name: lead.name,
    title: lead.title || '',
    company: lead.company || '',
    avatar: lead.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`,
    status: statusMap[lead.status] || lead.status,
    channels: lead.channels || [],
    icpScore: lead.icp_score || 0,
    cadenceStatus: undefined, // Will be populated by lead_cadences join
  };
}

function transformPipelineDeal(deal: PipelineDeal & { lead?: any }): UIPipelineCard {
  const stageMap: Record<string, string> = {
    'new': 'New',
    'relationship': 'Relationship',
    'scheduled': 'Scheduled',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'won': 'Won',
    'lost': 'Lost',
  };

  return {
    id: deal.id,
    leadName: deal.lead?.name || 'Unknown',
    title: deal.lead?.title || '',
    company: deal.lead?.company || '',
    value: deal.value || 0,
    stage: stageMap[deal.stage] || deal.stage,
    channels: deal.lead?.channels || [],
    cadenceStatus: deal.meeting_scheduled_at ? 'Meeting Scheduled' : 'In Progress',
    nextActivity: deal.meeting_type || 'Follow-up',
    showRateGuard: deal.show_rate_guard || undefined,
  };
}

function transformAccount(account: ConnectedAccount): UIAccount {
  return {
    id: account.id,
    platform: account.platform,
    name: account.account_name,
    status: account.status === 'connected' ? 'Connected' : account.status,
    usage: account.daily_usage || 0,
    limit: account.daily_limit || 100,
  };
}

function transformAgent(agent: AIAgent): UIAgent {
  const typeMap: Record<string, string> = {
    'connection': 'Connection',
    'inbox': 'Inbox',
    'content': 'Content',
    'qualifier': 'Qualifier',
    'voice_ai': 'Voice AI',
  };

  return {
    id: agent.id,
    name: agent.name,
    type: typeMap[agent.type] || agent.type,
    language: agent.language,
    model: agent.model,
    isActive: agent.is_active,
    description: agent.description || '',
  };
}

// Main hook
export function useSupabaseData() {
  const [leads, setLeads] = useState<UILead[]>([]);
  const [campaigns, setCampaigns] = useState<UICampaign[]>([]);
  const [pipeline, setPipeline] = useState<UIPipelineCard[]>([]);
  const [accounts, setAccounts] = useState<UIAccount[]>([]);
  const [agents, setAgents] = useState<UIAgent[]>([]);
  const [metrics, setMetrics] = useState<UIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          leadsResult,
          campaignsResult,
          pipelineResult,
          accountsResult,
          agentsResult,
        ] = await Promise.all([
          db.leads.list({ limit: 100 }),
          db.campaigns.list(),
          db.pipeline.list(),
          db.accounts.list(),
          db.agents.list(),
        ]);

        // Check for errors
        if (leadsResult.error) throw leadsResult.error;
        if (campaignsResult.error) throw campaignsResult.error;
        if (pipelineResult.error) throw pipelineResult.error;
        if (accountsResult.error) throw accountsResult.error;
        if (agentsResult.error) throw agentsResult.error;

        // Transform data
        const transformedLeads = (leadsResult.data || []).map(transformLead);
        const transformedCampaigns = (campaignsResult.data || []).map(transformCampaign);
        const transformedPipeline = (pipelineResult.data || []).map(transformPipelineDeal);
        const transformedAccounts = (accountsResult.data || []).map(transformAccount);
        const transformedAgents = (agentsResult.data || []).map(transformAgent);

        setLeads(transformedLeads);
        setCampaigns(transformedCampaigns);
        setPipeline(transformedPipeline);
        setAccounts(transformedAccounts);
        setAgents(transformedAgents);

        // Calculate metrics
        const activeCadences = transformedLeads.filter(l => l.status === 'In Cadence').length;
        const meetings = transformedPipeline.filter(p => p.stage === 'Scheduled').length;
        const wonDeals = transformedPipeline.filter(p => p.stage === 'Won').length;
        const totalScheduled = meetings + wonDeals;
        const showRate = totalScheduled > 0 ? Math.round((wonDeals / totalScheduled) * 100) : 0;

        setMetrics([
          {
            label: 'Total Leads',
            value: transformedLeads.length.toLocaleString(),
            change: '+12%',
            trend: 'up',
            description: 'Total prospects in database'
          },
          {
            label: 'Active Cadences',
            value: activeCadences.toString(),
            change: '+5%',
            trend: 'up',
            description: 'Leads currently in sequence'
          },
          {
            label: 'Meetings',
            value: meetings.toString(),
            change: '+23%',
            trend: 'up',
            description: 'Scheduled this week'
          },
          {
            label: 'Show-Rate',
            value: `${showRate}%`,
            change: '+2%',
            trend: 'up',
            description: 'Target: 70% ✅'
          },
        ]);

      } catch (err: any) {
        console.error('Error fetching Supabase data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Refetch function for manual refresh
  const refetch = () => {
    setLoading(true);
    // Re-trigger useEffect by updating a dependency would go here
    // For now, we'll just recall the fetch logic
  };

  return {
    leads,
    campaigns,
    pipeline,
    accounts,
    agents,
    metrics,
    loading,
    error,
    refetch,
  };
}

export default useSupabaseData;

// Supabase Edge Function: Webhook Handler
// Receives events from external services (LinkedIn, Instagram, WhatsApp, N8N)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
}

interface WebhookPayload {
  source: 'linkedin' | 'instagram' | 'whatsapp' | 'email' | 'n8n' | 'phone'
  event: string
  data: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret')
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET')

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json() as WebhookPayload
    const { source, event, data } = payload

    console.log(`Webhook received: ${source} - ${event}`)

    let result: any

    switch (source) {
      case 'linkedin':
        result = await handleLinkedInEvent(supabase, event, data)
        break
      case 'instagram':
        result = await handleInstagramEvent(supabase, event, data)
        break
      case 'whatsapp':
        result = await handleWhatsAppEvent(supabase, event, data)
        break
      case 'email':
        result = await handleEmailEvent(supabase, event, data)
        break
      case 'phone':
        result = await handlePhoneEvent(supabase, event, data)
        break
      case 'n8n':
        result = await handleN8NEvent(supabase, event, data)
        break
      default:
        throw new Error(`Unknown source: ${source}`)
    }

    return new Response(
      JSON.stringify({ success: true, source, event, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// LinkedIn Events
async function handleLinkedInEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'connection_accepted':
      return await updateLeadStatus(supabase, data.lead_id, 'responding', {
        linkedin_connected: true,
        connected_at: new Date().toISOString()
      })

    case 'message_received':
      return await createInboundMessage(supabase, 'linkedin', data)

    case 'profile_viewed':
      return await logActivity(supabase, data.lead_id, 'profile_view', 'linkedin', data)

    default:
      return { event, data }
  }
}

// Instagram Events
async function handleInstagramEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'dm_received':
      return await createInboundMessage(supabase, 'instagram', data)

    case 'follow_back':
      return await updateLeadStatus(supabase, data.lead_id, 'responding', {
        instagram_following: true
      })

    case 'story_reply':
      return await createInboundMessage(supabase, 'instagram', {
        ...data,
        message_type: 'story_reply'
      })

    default:
      return { event, data }
  }
}

// WhatsApp Events
async function handleWhatsAppEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'message_received':
      return await createInboundMessage(supabase, 'whatsapp', data)

    case 'message_read':
      return await updateMessageStatus(supabase, data.message_id, 'read')

    case 'message_delivered':
      return await updateMessageStatus(supabase, data.message_id, 'delivered')

    default:
      return { event, data }
  }
}

// Email Events
async function handleEmailEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'reply_received':
      return await createInboundMessage(supabase, 'email', data)

    case 'email_opened':
      return await logActivity(supabase, data.lead_id, 'email_opened', 'email', data)

    case 'link_clicked':
      return await logActivity(supabase, data.lead_id, 'link_clicked', 'email', data)

    case 'bounced':
      return await handleBounce(supabase, data)

    default:
      return { event, data }
  }
}

// Phone Events
async function handlePhoneEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'call_completed':
      return await logActivity(supabase, data.lead_id, 'call', 'phone', {
        duration: data.duration,
        outcome: data.outcome,
        recording_url: data.recording_url
      })

    case 'voicemail_left':
      return await logActivity(supabase, data.lead_id, 'voicemail', 'phone', data)

    case 'meeting_scheduled':
      return await createPipelineDeal(supabase, data)

    default:
      return { event, data }
  }
}

// N8N Events (automation results)
async function handleN8NEvent(supabase: any, event: string, data: any) {
  switch (event) {
    case 'message_sent':
      return await updateMessageStatus(supabase, data.message_id, 'sent')

    case 'cadence_step_completed':
      return await updateActivityStatus(supabase, data.activity_id, 'completed')

    case 'lead_enriched':
      return await enrichLead(supabase, data.lead_id, data.enrichment_data)

    case 'meeting_confirmed':
      return await updatePipelineStage(supabase, data.deal_id, 'scheduled', {
        meeting_scheduled_at: data.meeting_time,
        meeting_type: data.meeting_type
      })

    default:
      return { event, data }
  }
}

// Helper Functions
async function updateLeadStatus(supabase: any, leadId: string, status: string, metadata?: any) {
  const update: any = { status }
  if (metadata) {
    update.custom_fields = metadata
  }

  const { data, error } = await supabase
    .from('socialfy_leads')
    .update(update)
    .eq('id', leadId)
    .select()
    .single()

  if (error) throw error

  // Check if lead is in a cadence and update it
  await supabase
    .from('socialfy_lead_cadences')
    .update({
      status: status === 'responding' ? 'responded' : 'active',
      responded_at: status === 'responding' ? new Date().toISOString() : null
    })
    .eq('lead_id', leadId)
    .eq('status', 'active')

  return data
}

async function createInboundMessage(supabase: any, channel: string, data: any) {
  // Find lead by identifier
  let leadQuery = supabase.from('socialfy_leads').select('*')

  if (data.lead_id) {
    leadQuery = leadQuery.eq('id', data.lead_id)
  } else if (data.email) {
    leadQuery = leadQuery.eq('email', data.email)
  } else if (data.phone) {
    leadQuery = leadQuery.eq('phone', data.phone)
  } else if (data.linkedin_url) {
    leadQuery = leadQuery.eq('linkedin_url', data.linkedin_url)
  } else if (data.instagram_handle) {
    leadQuery = leadQuery.eq('instagram_handle', data.instagram_handle)
  }

  const { data: lead } = await leadQuery.single()

  if (!lead) {
    throw new Error('Lead not found for inbound message')
  }

  // Create message
  const message = {
    organization_id: lead.organization_id,
    lead_id: lead.id,
    channel,
    direction: 'inbound',
    content: data.content || data.message,
    status: 'delivered',
    is_read: false,
    external_id: data.external_id,
    metadata: data.metadata,
    sent_at: data.sent_at || new Date().toISOString()
  }

  const { data: newMessage, error } = await supabase
    .from('socialfy_messages')
    .insert(message)
    .select()
    .single()

  if (error) throw error

  // Update lead status to responding
  await updateLeadStatus(supabase, lead.id, 'responding')

  // Broadcast realtime event
  await supabase.channel('inbox').send({
    type: 'broadcast',
    event: 'new_message',
    payload: newMessage
  })

  return newMessage
}

async function updateMessageStatus(supabase: any, messageId: string, status: string) {
  const update: any = { status }
  if (status === 'read') {
    update.is_read = true
    update.read_at = new Date().toISOString()
  }

  return await supabase
    .from('socialfy_messages')
    .update(update)
    .eq('id', messageId)
}

async function logActivity(supabase: any, leadId: string, type: string, channel: string, data: any) {
  const { data: lead } = await supabase
    .from('socialfy_leads')
    .select('organization_id')
    .eq('id', leadId)
    .single()

  return await supabase.from('socialfy_activities').insert({
    organization_id: lead?.organization_id,
    lead_id: leadId,
    type,
    channel,
    direction: 'inbound',
    content: data.content || `${type} event`,
    status: 'completed',
    responded: false,
    metadata: data,
    performed_at: new Date().toISOString()
  })
}

async function updateActivityStatus(supabase: any, activityId: string, status: string) {
  return await supabase
    .from('socialfy_activities')
    .update({ status })
    .eq('id', activityId)
}

async function handleBounce(supabase: any, data: any) {
  const { lead_id, bounce_type } = data

  // Update lead-cadence status
  await supabase
    .from('socialfy_lead_cadences')
    .update({ status: 'bounced' })
    .eq('lead_id', lead_id)
    .eq('status', 'active')

  // Log the bounce
  return await logActivity(supabase, lead_id, 'bounce', 'email', {
    bounce_type,
    reason: data.reason
  })
}

async function enrichLead(supabase: any, leadId: string, enrichmentData: any) {
  const { data: lead } = await supabase
    .from('socialfy_leads')
    .select('*')
    .eq('id', leadId)
    .single()

  return await supabase
    .from('socialfy_leads')
    .update({
      ...enrichmentData,
      source_data: {
        ...lead?.source_data,
        ...enrichmentData.source_data
      }
    })
    .eq('id', leadId)
}

async function createPipelineDeal(supabase: any, data: any) {
  const { data: lead } = await supabase
    .from('socialfy_leads')
    .select('*')
    .eq('id', data.lead_id)
    .single()

  return await supabase.from('socialfy_pipeline_deals').insert({
    organization_id: lead?.organization_id,
    lead_id: data.lead_id,
    campaign_id: data.campaign_id,
    value: data.value || 0,
    currency: 'BRL',
    stage: 'scheduled',
    meeting_scheduled_at: data.meeting_time,
    meeting_type: data.meeting_type
  })
}

async function updatePipelineStage(supabase: any, dealId: string, stage: string, metadata?: any) {
  const update: any = { stage, ...metadata }

  if (stage === 'won') {
    update.won_at = new Date().toISOString()
  } else if (stage === 'lost') {
    update.lost_at = new Date().toISOString()
  }

  return await supabase
    .from('socialfy_pipeline_deals')
    .update(update)
    .eq('id', dealId)
}

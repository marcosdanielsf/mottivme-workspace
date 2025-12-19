// Supabase Edge Function: Generate AI Message
// Uses Claude API to generate personalized messages for leads

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateMessageRequest {
  lead_id: string
  channel: 'linkedin' | 'instagram' | 'whatsapp' | 'email'
  message_type: 'connection' | 'follow_up' | 'warm_up' | 'authority' | 'meeting_request'
  agent_id?: string
  context?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { lead_id, channel, message_type, agent_id, context } = await req.json() as GenerateMessageRequest

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('socialfy_leads')
      .select('*')
      .eq('id', lead_id)
      .single()

    if (leadError || !lead) {
      throw new Error(`Lead not found: ${lead_id}`)
    }

    // Fetch agent configuration (if provided)
    let agentConfig = null
    if (agent_id) {
      const { data: agent } = await supabase
        .from('socialfy_ai_agents')
        .select('*')
        .eq('id', agent_id)
        .single()
      agentConfig = agent
    }

    // Build prompt based on message type and channel
    const systemPrompt = buildSystemPrompt(channel, message_type, agentConfig)
    const userPrompt = buildUserPrompt(lead, channel, message_type, context)

    // Call Claude API
    const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!claudeApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: agentConfig?.model === 'Claude Opus' ? 'claude-3-opus-20240229' : 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    })

    const claudeData = await claudeResponse.json()

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${JSON.stringify(claudeData)}`)
    }

    const generatedMessage = claudeData.content[0].text

    // Log the generation for analytics
    await supabase.from('socialfy_activities').insert({
      organization_id: lead.organization_id,
      lead_id: lead.id,
      type: 'ai_generation',
      channel: channel,
      direction: 'outbound',
      content: generatedMessage,
      status: 'completed',
      metadata: {
        message_type,
        agent_id,
        model: agentConfig?.model || 'Claude Sonnet'
      },
      performed_at: new Date().toISOString()
    })

    // Update agent execution count
    if (agent_id) {
      await supabase.rpc('increment_agent_executions', { agent_id })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: generatedMessage,
        lead: {
          id: lead.id,
          name: lead.name,
          company: lead.company
        },
        channel,
        message_type
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating message:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function buildSystemPrompt(
  channel: string,
  messageType: string,
  agent: any
): string {
  const basePrompt = agent?.system_prompt || `Você é um SDR experiente escrevendo mensagens de prospecção em português brasileiro.
Seja profissional mas humano, evite parecer robótico ou genérico.
Mantenha as mensagens curtas e diretas.`

  const channelGuidelines: Record<string, string> = {
    linkedin: 'Para LinkedIn: máximo 300 caracteres para connection notes, tom profissional mas personalizado.',
    instagram: 'Para Instagram DM: tom mais casual e direto, use emojis com moderação, máximo 500 caracteres.',
    whatsapp: 'Para WhatsApp: tom conversacional, direto ao ponto, pode usar emojis, máximo 300 caracteres.',
    email: 'Para Email: estrutura clara com subject line, abertura, corpo e CTA, tom profissional.'
  }

  const typeGuidelines: Record<string, string> = {
    connection: 'Mensagem de conexão inicial: crie rapport mencionando algo específico do perfil.',
    follow_up: 'Follow-up: relembre o contexto anterior e agregue valor.',
    warm_up: 'Warm-up: interaja com conteúdo do lead antes de fazer pitch.',
    authority: 'Authority: compartilhe insight relevante para o setor do lead.',
    meeting_request: 'Pedido de reunião: seja direto sobre o valor e sugira horários.'
  }

  return `${basePrompt}

${channelGuidelines[channel] || ''}
${typeGuidelines[messageType] || ''}`
}

function buildUserPrompt(
  lead: any,
  channel: string,
  messageType: string,
  context?: string
): string {
  let prompt = `Gere uma mensagem de ${messageType} para ${channel} para o seguinte lead:

Nome: ${lead.name}
Cargo: ${lead.title || 'Não informado'}
Empresa: ${lead.company || 'Não informada'}
ICP Score: ${lead.icp_score || 0}/100`

  if (lead.source_data) {
    prompt += `\n\nDados adicionais do perfil:\n${JSON.stringify(lead.source_data, null, 2)}`
  }

  if (context) {
    prompt += `\n\nContexto adicional: ${context}`
  }

  prompt += '\n\nGere apenas a mensagem, sem explicações ou formatação adicional.'

  return prompt
}

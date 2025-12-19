import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Create Supabase admin client lazily
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Verify webhook secret (optional but recommended)
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (process.env.N8N_WEBHOOK_SECRET && webhookSecret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      generation_id,
      project_id,
      agent_name,
      agent_number,
      phase,
      status,
      output,
      error_message,
      tokens_input,
      tokens_output,
      duration_ms,
      model,
    } = body;

    // Update generation record
    if (generation_id) {
      await supabaseAdmin
        .from('generations')
        .update({
          status: status || 'complete',
          output,
          error_message,
          tokens_input,
          tokens_output,
          duration_ms,
          model,
          phase,
          agent_number,
        })
        .eq('id', generation_id);
    }

    // Update project based on agent output
    if (project_id && output) {
      switch (agent_name) {
        case 'generateCloneExpert':
          // Update clone_experts table
          await supabaseAdmin
            .from('clone_experts')
            .upsert({
              project_id,
              dna_psicologico: output.dna_psicologico,
              engenharia_reversa: output.engenharia_reversa,
              configuracao_clone: output.configuracao_clone,
              system_prompt: output.system_prompt,
              status: 'ready',
            }, { onConflict: 'project_id' });
          break;

        case 'generatePosicionamentoEstrategico':
          await supabaseAdmin
            .from('clone_experts')
            .update({
              analise_concorrentes: output.analise_concorrentes,
              oportunidades_diferenciacao: output.oportunidades_diferenciacao,
              tendencias_nicho: output.tendencias_nicho,
              concorrentes_internacionais: output.concorrentes_internacionais,
              concorrentes_brasileiros: output.concorrentes_brasileiros,
              sintese_estrategica: output.sintese_estrategica,
            })
            .eq('project_id', project_id);
          break;

        case 'generateEcossistemaDeOfertas':
          await supabaseAdmin
            .from('offers')
            .upsert({
              project_id,
              avatar: output.avatar,
              avatar_detalhado: output.avatar_detalhado,
              promessas: output.promessas,
              big_idea: output.big_idea,
              mecanismo_unico: output.mecanismo_unico,
              headline_principal: output.headline_principal,
              subheadlines: output.subheadlines,
              high_ticket: output.high_ticket,
              mid_ticket: output.mid_ticket,
              low_ticket: output.low_ticket,
              backend: output.backend,
              frontend: output.frontend,
              lead_magnet: output.lead_magnet,
              status: 'ready',
            }, { onConflict: 'project_id' });
          break;

        case 'generateMarketingeGeracaodeDemanda':
        case 'generateScriptsFunnels':
        case 'generateScriptsCalendarioeScripts':
          // Insert contents
          if (output.contents && Array.isArray(output.contents)) {
            const contents = output.contents.map((content: any) => ({
              project_id,
              type: content.type,
              title: content.title,
              body: content.body,
              hook: content.hook,
              cta: content.cta,
              slides: content.slides,
              subject: content.subject,
              sequence_day: content.sequence_day,
              generated_by: agent_name,
              generation_id,
              status: 'draft',
            }));

            await supabaseAdmin.from('contents').insert(contents);
          }
          break;
      }

      // Update project progress
      const { data: progressData } = await supabaseAdmin
        .rpc('get_project_progress', { p_project_id: project_id });

      await supabaseAdmin
        .from('projects')
        .update({
          progress: progressData || 0,
          status: status === 'error' ? 'briefing' : (progressData >= 100 ? 'complete' : 'generating'),
        })
        .eq('id', project_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  ghlService,
  configureGHLFromEnv,
  FUNNEL_STAGES,
  GHL_TEMPLATES,
} from "@/lib/integrations/ghl";
import { n8nService, configureN8NFromEnv } from "@/lib/integrations/n8n";

// Inicializa integrações
configureGHLFromEnv();
configureN8NFromEnv();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, proposalId, eventType, eventData } = body;

    if (!leadId || !proposalId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    // Insert tracking event
    const { data: event, error: eventError } = await supabaseAdmin
      .from("tracking_events")
      .insert({
        lead_id: leadId,
        proposal_id: proposalId,
        event_type: eventType,
        event_data: eventData || {},
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Error inserting tracking event:", eventError);
      return NextResponse.json(
        { error: "Failed to track event" },
        { status: 500 }
      );
    }

    // Update lead stats based on event type
    if (eventType === "page_view") {
      await supabaseAdmin
        .from("leads")
        .update({
          visit_count: supabaseAdmin.rpc("increment_visit_count"),
          last_activity: new Date().toISOString(),
          status: "viewed",
        })
        .eq("id", leadId);
    }

    if (eventType === "time_on_page") {
      const timeSeconds = eventData?.seconds || 0;
      await supabaseAdmin
        .from("leads")
        .update({
          total_time_seconds: supabaseAdmin.rpc("add_time", { seconds: timeSeconds }),
          last_activity: new Date().toISOString(),
        })
        .eq("id", leadId);
    }

    if (eventType === "cta_click") {
      await supabaseAdmin
        .from("leads")
        .update({
          status: "hot",
          last_activity: new Date().toISOString(),
        })
        .eq("id", leadId);

      // Create alert for company owner
      const { data: lead } = await supabaseAdmin
        .from("leads")
        .select("proposal_id, proposals(company_id)")
        .eq("id", leadId)
        .single();

      const proposals = lead?.proposals as unknown as { company_id: string } | null;
      if (proposals?.company_id) {
        await supabaseAdmin.from("lead_alerts").insert({
          company_id: proposals.company_id,
          lead_id: leadId,
          type: "cta_click",
          title: "Lead clicou no CTA!",
          message: "Um lead clicou no botão de ação da sua proposta.",
        });
      }

      // Notifica GHL sobre CTA click
      await notifyGHL(leadId, "cta_clicked");

      // Notifica n8n workflow
      await notifyN8N(leadId, proposalId, "cta_clicked");
    }

    // Notifica GHL sobre primeira visualização
    if (eventType === "page_view") {
      const { data: leadData } = await supabaseAdmin
        .from("leads")
        .select("visit_count")
        .eq("id", leadId)
        .single();

      if (leadData?.visit_count === 1) {
        await notifyGHL(leadId, "proposal_opened");
        await notifyN8N(leadId, proposalId, "proposal_opened");
      }
    }

    // Verifica score alto para notificar GHL
    if (eventType === "time_on_page" || eventType === "scroll") {
      const { data: leadData } = await supabaseAdmin
        .from("leads")
        .select("score")
        .eq("id", leadId)
        .single();

      if (leadData && leadData.score >= 70) {
        await notifyGHL(leadId, "high_score");
        await notifyN8N(leadId, proposalId, "high_score");
      }
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Error in track API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Notifica o GHL sobre eventos importantes do lead
 */
async function notifyGHL(
  leadId: string,
  event: "proposal_opened" | "cta_clicked" | "high_score"
) {
  try {
    // Busca dados completos do lead
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select(
        `
        *,
        proposals (
          id,
          title,
          companies (
            id,
            name
          )
        )
      `
      )
      .eq("id", leadId)
      .single();

    if (!lead || !lead.email) return;

    // Busca contato no GHL
    const ghlContact = await ghlService.searchContact(lead.email);
    if (!ghlContact) return;

    const proposal = lead.proposals as unknown as {
      title: string;
    };

    // Prepara mensagem baseada no evento
    let message: string;
    const tags: string[] = [];

    switch (event) {
      case "proposal_opened":
        message = GHL_TEMPLATES.PROPOSAL_OPENED(lead.name, proposal.title);
        tags.push("proposta-visualizada");
        break;

      case "cta_clicked":
        message = GHL_TEMPLATES.CTA_CLICKED(lead.name);
        tags.push("clicou-cta", "lead-quente");
        break;

      case "high_score":
        message = GHL_TEMPLATES.HIGH_ENGAGEMENT(lead.name);
        tags.push("score-alto", "lead-quente");
        break;

      default:
        return;
    }

    // Atualiza tags
    if (tags.length > 0) {
      await ghlService.addTags(ghlContact.id, tags);
    }

    // Envia mensagem via WhatsApp (apenas se GHL configurado)
    if (process.env.GHL_SEND_MESSAGES === "true") {
      await ghlService.sendMessage({
        contactId: ghlContact.id,
        message,
        type: "SMS", // WhatsApp no GHL
      });
    }

    console.log(`GHL notified: ${event} for lead ${leadId}`);
  } catch (error) {
    // Não quebra o fluxo se GHL falhar
    console.error("Error notifying GHL:", error);
  }
}

/**
 * Notifica n8n workflow sobre eventos importantes do lead
 */
async function notifyN8N(
  leadId: string,
  proposalId: string,
  event: "proposal_opened" | "cta_clicked" | "high_score"
) {
  try {
    if (!n8nService.isEnabled()) return;

    // Busca dados completos do lead e proposta
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select(
        `
        *,
        proposals (
          id,
          title,
          value
        )
      `
      )
      .eq("id", leadId)
      .single();

    if (!lead) return;

    const proposal = lead.proposals as unknown as {
      id: string;
      title: string;
      value?: number;
    };

    // Trigger n8n workflow
    await n8nService.triggerLeadAlert(event, {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      score: lead.score,
    }, {
      id: proposal?.id || proposalId,
      title: proposal?.title || "Proposta",
      value: proposal?.value,
    });

    console.log(`n8n notified: ${event} for lead ${leadId}`);
  } catch (error) {
    // Não quebra o fluxo se n8n falhar
    console.error("Error notifying n8n:", error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  ghlService,
  configureGHLFromEnv,
  FUNNEL_STAGES,
  GHL_TEMPLATES,
} from "@/lib/integrations/ghl";

// Inicializa GHL
configureGHLFromEnv();

/**
 * Webhook para receber eventos do GHL
 * POST /api/webhooks/ghl
 *
 * Eventos suportados:
 * - contact.created: Novo contato criado no GHL
 * - contact.updated: Contato atualizado
 * - conversation.message: Nova mensagem recebida
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log("GHL Webhook received:", event, data);

    switch (event) {
      case "contact.created":
        await handleContactCreated(data);
        break;

      case "contact.updated":
        await handleContactUpdated(data);
        break;

      case "conversation.message":
        await handleNewMessage(data);
        break;

      default:
        console.log("Unhandled GHL event:", event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GHL webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para sincronizar lead do PROPOSTAL com GHL
 * PUT /api/webhooks/ghl?action=sync
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "sync") {
      const body = await request.json();
      return await syncLeadToGHL(body);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("GHL sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

/**
 * Sincroniza um lead do PROPOSTAL com o GHL
 */
async function syncLeadToGHL(params: {
  leadId: string;
  event: "proposal_opened" | "cta_clicked" | "high_score" | "chat_escalation";
  sendMessage?: boolean;
}) {
  const { leadId, event, sendMessage = true } = params;

  // Busca lead no Supabase
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
          name,
          owner_phone
        )
      )
    `
    )
    .eq("id", leadId)
    .single();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const proposal = lead.proposals as unknown as {
    id: string;
    title: string;
    companies: { id: string; name: string; owner_phone: string };
  };

  // Busca ou cria contato no GHL
  let ghlContact = await ghlService.searchContact(lead.email || lead.phone || "");

  if (!ghlContact && (lead.email || lead.phone)) {
    ghlContact = await ghlService.createContact({
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      name: lead.name,
      source: "propostal",
      tags: ["propostal", "lead"],
    });
  }

  if (!ghlContact) {
    return NextResponse.json(
      { error: "Could not find or create GHL contact" },
      { status: 400 }
    );
  }

  // Determina ações baseadas no evento
  let funnelStage: string = FUNNEL_STAGES.PROPOSAL_SENT;
  let messageTemplate: string | null = null;
  const tags: string[] = [];

  switch (event) {
    case "proposal_opened":
      funnelStage = FUNNEL_STAGES.PROPOSAL_SENT;
      tags.push("proposta-visualizada");
      messageTemplate = GHL_TEMPLATES.PROPOSAL_OPENED(
        lead.name,
        proposal.title
      );
      break;

    case "cta_clicked":
      funnelStage = FUNNEL_STAGES.PROPOSAL_FOLLOW_UP;
      tags.push("clicou-cta", "lead-quente");
      messageTemplate = GHL_TEMPLATES.CTA_CLICKED(lead.name);
      break;

    case "high_score":
      funnelStage = FUNNEL_STAGES.QUALIFIED;
      tags.push("score-alto", "lead-quente");
      messageTemplate = GHL_TEMPLATES.HIGH_ENGAGEMENT(lead.name);
      break;

    case "chat_escalation":
      funnelStage = FUNNEL_STAGES.FOLLOW_UP;
      tags.push("chat-escalado", "urgente");
      messageTemplate = GHL_TEMPLATES.CHAT_ESCALATION(lead.name);
      break;
  }

  // Atualiza tags
  if (tags.length > 0) {
    await ghlService.addTags(ghlContact.id, tags);
  }

  // Envia mensagem se configurado
  if (sendMessage && messageTemplate) {
    await ghlService.sendMessage({
      contactId: ghlContact.id,
      message: messageTemplate,
      type: "SMS", // WhatsApp
    });
  }

  // Atualiza o lead no Supabase com o ID do GHL
  await supabaseAdmin
    .from("leads")
    .update({
      // Podemos adicionar um campo ghl_contact_id depois
    })
    .eq("id", leadId);

  return NextResponse.json({
    success: true,
    ghlContactId: ghlContact.id,
    funnelStage,
    tags,
    messageSent: sendMessage && !!messageTemplate,
  });
}

/**
 * Handler: Novo contato criado no GHL
 */
async function handleContactCreated(data: {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) {
  console.log("New GHL contact:", data.id);

  // Verifica se já existe lead com esse email/telefone
  const query = supabaseAdmin.from("leads").select("id");

  if (data.email) {
    const { data: existingLead } = await query.eq("email", data.email).single();
    if (existingLead) {
      console.log("Lead already exists for email:", data.email);
      return;
    }
  }

  // Pode criar lógica para criar lead automaticamente se necessário
}

/**
 * Handler: Contato atualizado no GHL
 */
async function handleContactUpdated(data: {
  id: string;
  customFields?: Record<string, string>;
  tags?: string[];
}) {
  console.log("GHL contact updated:", data.id);

  // Pode sincronizar mudanças de volta para o Supabase
}

/**
 * Handler: Nova mensagem recebida no GHL
 */
async function handleNewMessage(data: {
  contactId: string;
  message: string;
  direction: "inbound" | "outbound";
}) {
  if (data.direction !== "inbound") return;

  console.log("New inbound message from GHL contact:", data.contactId);

  // Pode criar lógica para processar mensagens
  // e atualizar o chat do PROPOSTAL
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";
import {
  ghlService,
  configureGHLFromEnv,
  GHL_TEMPLATES,
} from "@/lib/integrations/ghl";
import { n8nService, configureN8NFromEnv } from "@/lib/integrations/n8n";

// Inicializa integrações
configureGHLFromEnv();
configureN8NFromEnv();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ESCALATION_TRIGGERS = [
  "quero fechar",
  "vamos fechar",
  "fechado",
  "muito caro",
  "desconto",
  "parcelar",
  "falar com alguém",
  "atendente",
  "humano",
  "pessoa real",
  "negociar",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, message, proposalId } = body;

    if (!leadId || !message || !proposalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get proposal context
    const { data: proposal } = await supabaseAdmin
      .from("proposals")
      .select("*, companies(*)")
      .eq("id", proposalId)
      .single();

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Save user message
    await supabaseAdmin.from("chat_messages").insert({
      lead_id: leadId,
      sender: "user",
      message,
    });

    // Check for escalation triggers
    const shouldEscalate = ESCALATION_TRIGGERS.some((trigger) =>
      message.toLowerCase().includes(trigger)
    );

    if (shouldEscalate) {
      // Create alert for human follow-up
      await supabaseAdmin.from("lead_alerts").insert({
        company_id: proposal.company_id,
        lead_id: leadId,
        type: "chat_started",
        title: "Lead quer falar com humano!",
        message: `Mensagem: "${message}"`,
      });

      const escalationResponse =
        "Entendi! Vou chamar alguém da equipe para te ajudar. Enquanto isso, posso responder mais alguma dúvida sobre a proposta?";

      // Save bot response
      await supabaseAdmin.from("chat_messages").insert({
        lead_id: leadId,
        sender: "bot",
        message: escalationResponse,
        metadata: { escalated: true },
      });

      // Notifica GHL sobre escalação
      await notifyGHLEscalation(leadId, message);

      // Notifica n8n workflow sobre escalação
      await notifyN8NEscalation(leadId, proposalId, message, proposal);

      return NextResponse.json({
        response: escalationResponse,
        escalated: true,
      });
    }

    // Generate AI response
    const systemPrompt = `Você é a Luna, assistente virtual da ${proposal.companies?.name || "empresa"}.
Você está ajudando um potencial cliente com dúvidas sobre uma proposta comercial.

INFORMAÇÕES DA PROPOSTA:
- Título: ${proposal.title}
- Valor: R$ ${proposal.value?.toLocaleString("pt-BR")}
- Cliente: ${proposal.client_name}

REGRAS:
1. Seja simpática, mas profissional
2. Responda apenas sobre a proposta e o serviço
3. Se perguntarem sobre desconto, diga que pode verificar com a equipe
4. Incentive o agendamento de uma call para tirar dúvidas
5. Mantenha respostas curtas (2-3 frases)
6. Use emojis moderadamente
7. Não invente informações que não estão na proposta`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content || "Desculpe, não consegui processar sua mensagem. Tente novamente.";

    // Save bot response
    await supabaseAdmin.from("chat_messages").insert({
      lead_id: leadId,
      sender: "bot",
      message: botResponse,
    });

    // Track chat event
    await supabaseAdmin.from("tracking_events").insert({
      lead_id: leadId,
      proposal_id: proposalId,
      event_type: "chat_message",
      event_data: { userMessage: message },
    });

    // Update lead status
    await supabaseAdmin
      .from("leads")
      .update({
        status: "engaged",
        last_activity: new Date().toISOString(),
      })
      .eq("id", leadId);

    return NextResponse.json({
      response: botResponse,
      escalated: false,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json(
        { error: "Missing leadId" },
        { status: 400 }
      );
    }

    const { data: messages, error } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Notifica o GHL quando o chat é escalado para um humano
 */
async function notifyGHLEscalation(leadId: string, originalMessage: string) {
  try {
    // Busca dados do lead
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("*, proposals(title)")
      .eq("id", leadId)
      .single();

    if (!lead || !lead.email) return;

    // Busca contato no GHL
    const ghlContact = await ghlService.searchContact(lead.email);
    if (!ghlContact) return;

    // Adiciona tags de escalação
    await ghlService.addTags(ghlContact.id, [
      "chat-escalado",
      "urgente",
      "lead-quente",
    ]);

    // Envia notificação para o vendedor via WhatsApp (se configurado)
    if (process.env.GHL_SEND_MESSAGES === "true") {
      // Mensagem para o lead confirmando
      await ghlService.sendMessage({
        contactId: ghlContact.id,
        message: GHL_TEMPLATES.CHAT_ESCALATION(lead.name),
        type: "SMS",
      });
    }

    console.log(`GHL escalation notified for lead ${leadId}`);
  } catch (error) {
    console.error("Error notifying GHL escalation:", error);
  }
}

/**
 * Notifica n8n workflow quando o chat é escalado para um humano
 */
async function notifyN8NEscalation(
  leadId: string,
  proposalId: string,
  originalMessage: string,
  proposal: {
    id: string;
    title: string;
    company_id: string;
    companies?: {
      id: string;
      name: string;
      owner_phone?: string;
    };
  }
) {
  try {
    if (!n8nService.isEnabled()) return;

    // Busca dados do lead
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) return;

    // Trigger n8n workflow de escalação
    await n8nService.triggerChatEscalation(
      {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      },
      {
        id: proposal.id,
        title: proposal.title,
      },
      {
        id: proposal.companies?.id || proposal.company_id,
        name: proposal.companies?.name || "Empresa",
        owner_phone: proposal.companies?.owner_phone,
      },
      originalMessage
    );

    console.log(`n8n escalation notified for lead ${leadId}`);
  } catch (error) {
    console.error("Error notifying n8n escalation:", error);
  }
}

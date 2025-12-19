/**
 * GoHighLevel (GHL) Integration Service
 * Integração com o CRM GoHighLevel para:
 * - Atualizar etapa do funil
 * - Enviar mensagens WhatsApp/Instagram
 * - Criar/atualizar contatos
 * - Notificar vendedores
 */

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Etapas do funil mapeadas para o GHL
export const FUNNEL_STAGES = {
  NEW_LEAD: "Novo Lead",
  FIRST_CONTACT: "Primeiro Contato",
  FOLLOW_UP: "Em Follow-Up",
  QUALIFIED: "Qualificado",
  MEETING_SCHEDULED: "Agendamento Marcado",
  RESCHEDULED: "Reagendado",
  NO_SHOW: "No-Show",
  MEETING_DONE: "Reunião Realizada",
  PROPOSAL_SENT: "Proposta Enviada",
  PROPOSAL_FOLLOW_UP: "Follow-Up Proposta",
  CONTRACT_SENT: "Contrato Enviado",
  AWAITING_PAYMENT: "Aguardando Pagamento",
  ACTIVE_CLIENT: "Cliente Ativo",
  LOST: "Perdido",
} as const;

export type FunnelStage = (typeof FUNNEL_STAGES)[keyof typeof FUNNEL_STAGES];

interface GHLConfig {
  apiKey: string;
  locationId: string;
}

interface GHLContact {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  source?: string;
  customFields?: Record<string, string>;
}

interface SendMessageParams {
  contactId: string;
  message: string;
  type?: "SMS" | "IG" | "Email"; // SMS = WhatsApp no GHL
}

interface UpdateContactParams {
  contactId: string;
  customFields?: { id: string; value: string }[];
  tags?: string[];
  firstName?: string;
  lastName?: string;
}

class GHLService {
  private config: GHLConfig | null = null;

  /**
   * Configura as credenciais do GHL
   */
  configure(config: GHLConfig) {
    this.config = config;
  }

  /**
   * Headers padrão para requisições GHL
   */
  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error("GHL not configured. Call configure() first.");
    }
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      Version: GHL_VERSION,
      "Content-Type": "application/json",
    };
  }

  /**
   * Busca um contato por email ou telefone
   */
  async searchContact(query: string): Promise<GHLContact | null> {
    if (!this.config) return null;

    try {
      const response = await fetch(`${GHL_API_BASE}/contacts/search`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          locationId: this.config.locationId,
          query,
          pageLimit: 1,
        }),
      });

      if (!response.ok) {
        console.error("GHL search error:", await response.text());
        return null;
      }

      const data = await response.json();
      return data.contacts?.[0] || null;
    } catch (error) {
      console.error("GHL searchContact error:", error);
      return null;
    }
  }

  /**
   * Cria um novo contato no GHL
   */
  async createContact(contact: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    source?: string;
    tags?: string[];
  }): Promise<GHLContact | null> {
    if (!this.config) return null;

    try {
      const response = await fetch(`${GHL_API_BASE}/contacts`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          locationId: this.config.locationId,
          ...contact,
        }),
      });

      if (!response.ok) {
        console.error("GHL create contact error:", await response.text());
        return null;
      }

      const data = await response.json();
      return data.contact;
    } catch (error) {
      console.error("GHL createContact error:", error);
      return null;
    }
  }

  /**
   * Atualiza um contato existente
   */
  async updateContact(params: UpdateContactParams): Promise<boolean> {
    if (!this.config) return false;

    try {
      const body: Record<string, unknown> = {};

      if (params.customFields) {
        body.customFields = params.customFields;
      }
      if (params.tags) {
        body.tags = params.tags;
      }
      if (params.firstName) {
        body.firstName = params.firstName;
      }
      if (params.lastName) {
        body.lastName = params.lastName;
      }

      const response = await fetch(
        `${GHL_API_BASE}/contacts/${params.contactId}`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        console.error("GHL update contact error:", await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error("GHL updateContact error:", error);
      return false;
    }
  }

  /**
   * Atualiza a etapa do funil de um contato
   */
  async updateFunnelStage(
    contactId: string,
    stage: FunnelStage,
    customFieldId: string
  ): Promise<boolean> {
    return this.updateContact({
      contactId,
      customFields: [{ id: customFieldId, value: stage }],
    });
  }

  /**
   * Envia uma mensagem para o contato (WhatsApp ou Instagram)
   */
  async sendMessage(params: SendMessageParams): Promise<boolean> {
    if (!this.config) return false;

    try {
      const response = await fetch(`${GHL_API_BASE}/conversations/messages`, {
        method: "POST",
        headers: {
          ...this.getHeaders(),
          Version: "2021-04-15", // Versão diferente para mensagens
        },
        body: JSON.stringify({
          type: params.type || "SMS", // SMS = WhatsApp no GHL
          contactId: params.contactId,
          message: params.message,
        }),
      });

      if (!response.ok) {
        console.error("GHL send message error:", await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error("GHL sendMessage error:", error);
      return false;
    }
  }

  /**
   * Adiciona tags a um contato
   */
  async addTags(contactId: string, tags: string[]): Promise<boolean> {
    return this.updateContact({ contactId, tags });
  }

  /**
   * Busca os custom fields da location
   */
  async getCustomFields(): Promise<
    { id: string; fieldKey: string; name: string }[]
  > {
    if (!this.config) return [];

    try {
      const response = await fetch(
        `${GHL_API_BASE}/locations/${this.config.locationId}/customFields`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        console.error("GHL get custom fields error:", await response.text());
        return [];
      }

      const data = await response.json();
      return data.customFields || [];
    } catch (error) {
      console.error("GHL getCustomFields error:", error);
      return [];
    }
  }
}

// Singleton instance
export const ghlService = new GHLService();

/**
 * Helper para configurar o GHL a partir de variáveis de ambiente
 */
export function configureGHLFromEnv() {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (apiKey && locationId) {
    ghlService.configure({ apiKey, locationId });
    return true;
  }

  console.warn("GHL environment variables not set (GHL_API_KEY, GHL_LOCATION_ID)");
  return false;
}

/**
 * Mensagens templates para WhatsApp
 */
export const GHL_TEMPLATES = {
  PROPOSAL_OPENED: (clientName: string, proposalTitle: string) =>
    `Oi ${clientName}! Vi que você abriu a proposta "${proposalTitle}". Tem alguma dúvida? Estou aqui para ajudar!`,

  CTA_CLICKED: (clientName: string) =>
    `${clientName}, que ótimo! Vi que você clicou para agendar. Vou te chamar em instantes para confirmarmos o melhor horário.`,

  HIGH_ENGAGEMENT: (clientName: string) =>
    `${clientName}, percebi que você está analisando a proposta com atenção. Posso te ajudar a esclarecer algum ponto?`,

  FOLLOW_UP_24H: (clientName: string, proposalTitle: string) =>
    `Oi ${clientName}! Passando para saber se você teve tempo de analisar a proposta "${proposalTitle}". Alguma dúvida que eu possa ajudar?`,

  CHAT_ESCALATION: (clientName: string) =>
    `${clientName}, entendi! Vou pedir para um especialista entrar em contato com você agora mesmo.`,
};

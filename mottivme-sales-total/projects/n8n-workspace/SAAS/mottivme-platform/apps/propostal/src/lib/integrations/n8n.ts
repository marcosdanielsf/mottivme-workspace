/**
 * n8n Webhook Integration Service
 *
 * Triggers n8n workflows via HTTP webhooks for PROPOSTAL events
 */

// n8n Base URL (configure in environment)
const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE || "https://cliente-a1.mentorfy.io/webhook";

// Workflow webhook paths (matching the imported workflows)
export const N8N_WEBHOOKS = {
  LEAD_ALERT: "propostal-lead-alert",
  CHAT_ESCALATION: "propostal-chat-escalation",
  SYNC_LEAD: "propostal-sync-lead",
} as const;

// Event types
export type N8NEventType = "cta_clicked" | "high_score" | "proposal_opened" | "chat_escalation" | "lead_created";

// Payload interfaces
export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  score?: number;
}

export interface ProposalData {
  id: string;
  title: string;
  value?: number;
}

export interface CompanyData {
  id: string;
  name: string;
  owner_phone?: string;
}

export interface N8NLeadAlertPayload {
  event: N8NEventType;
  lead: LeadData;
  proposal: ProposalData;
  timestamp: string;
}

export interface N8NChatEscalationPayload {
  event: "chat_escalation";
  lead: LeadData;
  proposal: ProposalData;
  company: CompanyData;
  message: string;
  timestamp: string;
}

export interface N8NSyncLeadPayload {
  event: "lead_created";
  record: LeadData & { company?: string };
  timestamp: string;
}

class N8NService {
  private baseUrl: string;
  private enabled: boolean;

  constructor() {
    this.baseUrl = N8N_WEBHOOK_BASE;
    this.enabled = process.env.N8N_ENABLED === "true";
  }

  /**
   * Configure n8n service from environment variables
   */
  configure(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    this.enabled = process.env.N8N_ENABLED === "true";
  }

  /**
   * Check if n8n integration is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Send webhook request to n8n
   */
  private async sendWebhook<T>(path: string, payload: T): Promise<{ success: boolean; error?: string }> {
    if (!this.enabled) {
      console.log("[n8n] Integration disabled, skipping webhook:", path);
      return { success: true };
    }

    const url = `${this.baseUrl}/${path}`;

    try {
      console.log("[n8n] Sending webhook to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[n8n] Webhook failed:", response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      console.log("[n8n] Webhook sent successfully:", path);
      return { success: true };
    } catch (error) {
      console.error("[n8n] Webhook error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  /**
   * Trigger Lead Alert workflow
   * Called when: CTA clicked, high score, proposal opened
   */
  async triggerLeadAlert(
    event: "cta_clicked" | "high_score" | "proposal_opened",
    lead: LeadData,
    proposal: ProposalData
  ): Promise<{ success: boolean; error?: string }> {
    const payload: N8NLeadAlertPayload = {
      event,
      lead,
      proposal,
      timestamp: new Date().toISOString(),
    };

    return this.sendWebhook(N8N_WEBHOOKS.LEAD_ALERT, payload);
  }

  /**
   * Trigger Chat Escalation workflow
   * Called when: Chat is escalated to human
   */
  async triggerChatEscalation(
    lead: LeadData,
    proposal: ProposalData,
    company: CompanyData,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    const payload: N8NChatEscalationPayload = {
      event: "chat_escalation",
      lead,
      proposal,
      company,
      message,
      timestamp: new Date().toISOString(),
    };

    return this.sendWebhook(N8N_WEBHOOKS.CHAT_ESCALATION, payload);
  }

  /**
   * Trigger Sync Lead workflow
   * Called when: New lead is created in Supabase
   */
  async triggerSyncLead(lead: LeadData & { company?: string }): Promise<{ success: boolean; error?: string }> {
    const payload: N8NSyncLeadPayload = {
      event: "lead_created",
      record: lead,
      timestamp: new Date().toISOString(),
    };

    return this.sendWebhook(N8N_WEBHOOKS.SYNC_LEAD, payload);
  }
}

// Singleton instance
export const n8nService = new N8NService();

/**
 * Configure n8n service from environment variables
 * Call this at app startup or in API routes
 */
export function configureN8NFromEnv() {
  n8nService.configure(process.env.N8N_WEBHOOK_BASE);
}

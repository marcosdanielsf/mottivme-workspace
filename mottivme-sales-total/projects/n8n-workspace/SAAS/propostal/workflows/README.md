# Workflows n8n - Propostal

Workflows de automacao do Propostal para integracao com GHL e alertas.

---

## Workflows Disponiveis

| Workflow | Funcao | Trigger |
|----------|--------|---------|
| **Sync Supabase → GHL** | Cria/atualiza contato no GHL quando lead e criado | Webhook Supabase INSERT |
| **Update Score GHL** | Atualiza Custom Fields de score no GHL | Webhook Supabase UPDATE |
| **Lead Quente Alert** | Envia alerta WhatsApp quando score > 70 | Webhook interno |
| **Chat Escalation Alert** | Notifica quando lead pede atendimento humano | Webhook chat |
| **Follow-up 24h** | Envia follow-up se lead nao retornou | Scheduler |

---

## Fluxo de Dados

```
Propostal (Frontend)
    │
    ▼ tracking events
Supabase (leads, tracking_events)
    │
    ▼ Database Trigger
n8n Webhook
    │
    ├──► GHL (Custom Fields)
    │     • proposal_score
    │     • proposal_status
    │     • proposal_url
    │
    └──► WhatsApp Alert (se score > 70)
```

---

## Custom Fields GHL Utilizados

| Campo | Key | Tipo |
|-------|-----|------|
| Score da Proposta | `contact.score_da_proposta` | NUMERICAL |
| Status da Proposta | `contact.contactproposal_status` | SINGLE_OPTIONS |
| Link da Proposta | `contact.contactproposal_url` | TEXT |

---

## Como Configurar

### 1. Webhook Supabase → n8n

No Supabase, crie um Database Webhook ou Edge Function:

```sql
-- Trigger para chamar webhook quando score muda
CREATE OR REPLACE FUNCTION notify_score_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score IS DISTINCT FROM OLD.score THEN
    PERFORM net.http_post(
      url := 'https://[SEU-N8N]/webhook/propostal-score-update',
      body := jsonb_build_object(
        'email', NEW.email,
        'score', NEW.score,
        'status', NEW.status,
        'name', NEW.name
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_score_change
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_score_change();
```

### 2. Importar Workflows no n8n

1. Acesse seu n8n
2. Va em Workflows > Import
3. Importe cada arquivo .json desta pasta
4. Configure as credenciais (GHL API Key, WhatsApp)
5. Ative os workflows

---

## Credenciais Necessarias

```yaml
GHL:
  location_id: cd1uyzpJox6XPt4Vct8Y
  api_key: pit-fe627027-b9cb-4ea3-aaa4-149459e66a03

Supabase:
  project_id: bfumywvwubvernvhjehk
  url: https://bfumywvwubvernvhjehk.supabase.co
```

---

*Atualizado em: Dezembro 2025*

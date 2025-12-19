# Scripts - Mottivme Sales Ecosystem

Scripts de configuracao e setup do ecossistema de vendas.

---

## Scripts Disponiveis

### 1. criar-custom-fields-ghl.sh
**Status:** ✅ EXECUTADO (Campos ja existiam)

Cria os Custom Fields no GoHighLevel para:
- Lead Enriched (vertical, lead_score, source_channel, last_agent_action)
- Proposta (proposal_url, proposal_score, proposal_status)
- Agent (current_agent)

```bash
chmod +x criar-custom-fields-ghl.sh
./criar-custom-fields-ghl.sh
```

### 2. create_sales_ecosystem_tables.sql
**Status:** 📋 PRONTO PARA EXECUTAR

Cria as tabelas do ecossistema de vendas no Supabase CEO.

**Tabelas criadas:**
| Tabela | Descricao |
|--------|-----------|
| `sales_leads` | Lead centralizado com sync GHL |
| `sales_propostas` | Propostas do Propostal |
| `sales_agent_interactions` | Log de acoes dos agentes IA |
| `sales_metrics` | Metricas agregadas |
| `sales_alerts` | Alertas do Sentinel |
| `sales_pipelines` | Config de pipelines por vertical |
| `sales_prompts` | Prompts versionados dos agentes |

**Como executar:**
1. Acesse: https://supabase.com/dashboard/project/bfumywvwubvernvhjehk/sql
2. Copie o conteudo de `create_sales_ecosystem_tables.sql`
3. Cole no SQL Editor
4. Clique em "Run"

---

## Estrutura de Dados

### Fluxo GHL → Supabase
```
GHL Custom Field          →  Supabase sales_leads
─────────────────────────────────────────────────
contact.contactvertical    →  vertical
contact.contactlead_score  →  lead_score
contact.contactsource      →  source_channel
contact.contactcurrent_agent → current_agent
contact.contactetapa_funil →  etapa_funil
```

### Fluxo Propostal → Supabase
```
Propostal Event           →  Supabase
─────────────────────────────────────────────────
proposal.viewed           →  sales_propostas.proposal_status
proposal.score_updated    →  sales_propostas.proposal_score
proposal.chat_message     →  sales_agent_interactions
```

---

## Credenciais Utilizadas

```yaml
# GHL
location_id: cd1uyzpJox6XPt4Vct8Y
api_key: pit-fe627027-b9cb-4ea3-aaa4-149459e66a03

# Supabase CEO
project_id: bfumywvwubvernvhjehk
url: https://bfumywvwubvernvhjehk.supabase.co
```

---

## Proximos Passos

Apos executar `create_sales_ecosystem_tables.sql`:

1. [ ] Configurar RLS (Row Level Security) nas tabelas
2. [ ] Criar webhook n8n: GHL → Supabase (sync leads)
3. [ ] Criar webhook n8n: Propostal → Supabase (tracking)
4. [ ] Inserir prompts base dos agentes
5. [ ] Testar fluxo completo com lead de teste

---

*Criado em: Dezembro 2025*
*Projeto: Mottivme Sales Ecosystem*

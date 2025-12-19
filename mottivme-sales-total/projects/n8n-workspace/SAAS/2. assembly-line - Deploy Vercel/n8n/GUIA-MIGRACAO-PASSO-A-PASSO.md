# Guia de Migração n8n: Airtable → Supabase

> **Escolha seu método**: Este guia oferece duas opções:
> - **OPÇÃO A: Nó Postgres** (RECOMENDADO) - Mais direto, performático, queries SQL nativas
> - **OPÇÃO B: HTTP Request** - Via REST API do Supabase

---

# OPÇÃO A: Usando Nó Postgres (RECOMENDADO)

## PASSO 1A: Criar Credencial Postgres no n8n

1. Vá em **Credentials > Add Credential**
2. Selecione **Postgres**
3. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `Supabase Postgres` |
| **Host** | `db.bfumywvwubvernvhjehk.supabase.co` |
| **Database** | `postgres` |
| **User** | `postgres` |
| **Password** | `[SUA DATABASE PASSWORD]` |
| **Port** | `5432` |
| **SSL** | ✅ Enabled |

> **Onde encontrar a Database Password?**
> Supabase Dashboard → Settings → Database → Connection string → Password

## PASSO 2A: Configurar Variáveis de Ambiente

No n8n, vá em **Settings > Variables** e adicione:

| Variable | Value |
|----------|-------|
| `APP_CALLBACK_URL` | `https://assembly-line-deploy-vercel.vercel.app` |
| `N8N_WEBHOOK_SECRET` | `assembly-line-secret-2024` |

## PASSO 3A: Substituir Nós Airtable por Postgres

### Buscar Dados do Expert (SELECT)

```sql
SELECT get_expert_data('{{ $json.query?.recordId || $json.body?.project_id }}'::uuid) as data;
```

### Salvar Clone - FASE 1A (UPDATE)

```sql
UPDATE clone_experts SET
  dna_psicologico = '{{ $('1. Agent 1: DNA Psicológico1').item.json.output }}',
  engenharia_reversa = '{{ $('2. Agent 2: Engenheiro Reverso2').item.json.output }}',
  configuracao_clone = '{{ $('3. Agent 3: Configurador1').item.json.output }}',
  system_prompt = '{{ $json.output }}',
  status = 'ready',
  updated_at = NOW()
WHERE project_id = '{{ $json.project_id }}'::uuid
RETURNING *;
```

### Salvar Posicionamento - FASE 1B (UPDATE)

```sql
UPDATE clone_experts SET
  analise_concorrentes = '{{ $('5. Agent 5: Identity Mapper').item.json.text }}',
  concorrentes_internacionais = '{{ $('6A. Perplexity Internacional').item.json.choices[0].message.content }}',
  concorrentes_brasileiros = '{{ $('6B. Perplexity Brasil').item.json.choices[0].message.content }}',
  sintese_estrategica = '{{ $('6C. Synthesis and Strategic Analysis').item.json.text }}',
  updated_at = NOW()
WHERE project_id = '{{ $json.project_id }}'::uuid
RETURNING *;
```

### Salvar Ofertas - FASE 2 (UPSERT)

```sql
INSERT INTO offers (project_id, avatar, promessas, big_idea, high_ticket, frontend, status, created_at, updated_at)
VALUES (
  '{{ $json.project_id }}'::uuid,
  '{{ $('7. Agent: Avatar Creator').item.json.text }}',
  '{{ $('8. Agent: Promise Generator').item.json.text }}',
  '{{ $('9. Agent: Big Idea Creator').item.json.text }}',
  '{{ $json["High Ticket Ofertas - IA"] }}',
  '{{ $json["Ofertas Front End - IA"] }}',
  'ready',
  NOW(),
  NOW()
)
ON CONFLICT (project_id) DO UPDATE SET
  avatar = EXCLUDED.avatar,
  promessas = EXCLUDED.promessas,
  big_idea = EXCLUDED.big_idea,
  high_ticket = EXCLUDED.high_ticket,
  frontend = EXCLUDED.frontend,
  status = 'ready',
  updated_at = NOW()
RETURNING *;
```

### Inserir Conteúdo (INSERT)

```sql
INSERT INTO contents (project_id, type, title, body, hook, cta, generated_by, status, created_at)
VALUES (
  '{{ $json.project_id }}'::uuid,
  'reel',
  '{{ $json.title || "Reel gerado" }}',
  '{{ $json.script || $json.content }}',
  '{{ $json.hook }}',
  '{{ $json.cta }}',
  'generateMarketingeGeracaodeDemanda',
  'draft',
  NOW()
)
RETURNING *;
```

---

# OPÇÃO B: Usando HTTP Request (REST API)

## PASSO 1B: Configurar Variáveis de Ambiente no n8n

No seu n8n, vá em **Settings > Variables** e adicione:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://bfumywvwubvernvhjehk.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdW15d3Z3dWJ2ZXJudmhqZWhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQwMzc5OSwiZXhwIjoyMDY2OTc5Nzk5fQ.fdTsdGlSqemXzrXEU4ov1SUpeDn_3bSjOingqkSAWQE` |
| `APP_CALLBACK_URL` | `https://assembly-line-deploy-vercel.vercel.app` |
| `N8N_WEBHOOK_SECRET` | `assembly-line-secret-2024` |

## PASSO 2B: Criar Credencial HTTP no n8n

1. Vá em **Credentials > Add Credential**
2. Selecione **HTTP Header Auth**
3. Configure:
   - **Name**: `Supabase API`
   - **Header Name**: `apikey`
   - **Header Value**: `[sua SUPABASE_SERVICE_ROLE_KEY]`

---

## PASSO 3: Executar SQL no Supabase

Vá no **Supabase Dashboard > SQL Editor** e execute:

```sql
-- Função para buscar todos os dados do expert
CREATE OR REPLACE FUNCTION get_expert_data(p_project_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'project', (SELECT row_to_json(p.*) FROM projects p WHERE p.id = p_project_id),
    'briefing', (SELECT row_to_json(b.*) FROM briefings b WHERE b.project_id = p_project_id),
    'clone', (SELECT row_to_json(c.*) FROM clone_experts c WHERE c.project_id = p_project_id),
    'offers', (SELECT row_to_json(o.*) FROM offers o WHERE o.project_id = p_project_id)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_expert_data(UUID) TO anon, authenticated, service_role;
```

---

## PASSO 4: Substituir Nós no Workflow

### 4.1 Substituir "Get Product1" e "Get Expert Record"

**Deletar** os nós Airtable de leitura e **adicionar** um HTTP Request:

```
Method: POST
URL: {{$env.SUPABASE_URL}}/rest/v1/rpc/get_expert_data
Authentication: HTTP Header Auth (Supabase API)
Headers:
  Content-Type: application/json
Body (JSON):
{
  "p_project_id": "{{ $json.query.recordId }}"
}
```

O retorno será:
```json
{
  "project": { ... dados do projeto ... },
  "briefing": { ... dados do briefing ... },
  "clone": { ... dados do clone ... },
  "offers": { ... dados das ofertas ... }
}
```

### 4.2 Substituir "💾 Update Airtable - FASE" (Clone - FASE 1A)

**Deletar** o nó Airtable e **adicionar** HTTP Request:

```
Method: PATCH
URL: {{$env.SUPABASE_URL}}/rest/v1/clone_experts?project_id=eq.{{ $json.project_id }}
Authentication: HTTP Header Auth (Supabase API)
Headers:
  Content-Type: application/json
  Prefer: return=representation
Body (JSON):
{
  "dna_psicologico": {{ $('1. Agent 1: DNA Psicológico1').item.json.output }},
  "engenharia_reversa": {{ $('2. Agent 2: Engenheiro Reverso2').item.json.output }},
  "configuracao_clone": {{ $('3. Agent 3: Configurador1').item.json.output }},
  "system_prompt": {{ $json.output }},
  "status": "ready"
}
```

### 4.3 Substituir "💾 Update Airtable - FASE 1B2" (Posicionamento)

```
Method: PATCH
URL: {{$env.SUPABASE_URL}}/rest/v1/clone_experts?project_id=eq.{{ $json.project_id }}
Body (JSON):
{
  "analise_concorrentes": {{ $('5. Agent 5: Identity Mapper').item.json.text }},
  "concorrentes_internacionais": {{ $('6A. Perplexity Internacional').item.json.choices[0].message.content }},
  "concorrentes_brasileiros": {{ $('6B. Perplexity Brasil').item.json.choices[0].message.content }},
  "sintese_estrategica": {{ $('6C. Synthesis and Strategic Analysis').item.json.text }}
}
```

### 4.4 Substituir "💾 Update Airtable - FASE 2" (Ofertas)

```
Method: POST
URL: {{$env.SUPABASE_URL}}/rest/v1/offers
Headers:
  Prefer: resolution=merge-duplicates,return=representation
Body (JSON):
{
  "project_id": "{{ $json.project_id }}",
  "avatar": {{ avatar_json }},
  "promessas": {{ promessas_json }},
  "big_idea": {{ big_idea_json }},
  "high_ticket": {{ high_ticket_json }},
  "frontend": {{ frontend_json }},
  "status": "ready"
}
```

### 4.5 Substituir nós de Conteúdo (FASE 3/4/5, Reels, Carrossel, Stories)

```
Method: POST
URL: {{$env.SUPABASE_URL}}/rest/v1/contents
Body (JSON):
{
  "project_id": "{{ $json.project_id }}",
  "type": "reel",
  "title": "{{ $json.title }}",
  "body": "{{ $json.script }}",
  "hook": "{{ $json.hook }}",
  "cta": "{{ $json.cta }}",
  "generated_by": "generateMarketingeGeracaodeDemanda",
  "status": "draft"
}
```

---

## PASSO 5: Adicionar Callback para o App

**IMPORTANTE**: Após cada nó de salvamento no Supabase, adicione um nó de callback:

```
Method: POST
URL: {{ $json.callback_url }}/api/webhook/n8n
Headers:
  Content-Type: application/json
  x-webhook-secret: {{$env.N8N_WEBHOOK_SECRET}}
Body (JSON):
{
  "generation_id": "{{ $('Webhook').item.json.body.generation_id }}",
  "project_id": "{{ $('Webhook').item.json.body.project_id }}",
  "agent_name": "{{ $('Webhook').item.json.body.action }}",
  "phase": "clone",
  "status": "complete",
  "output": {
    "dna_psicologico": {{ dna }},
    "system_prompt": {{ clone }}
  }
}
```

---

## PASSO 6: Configurar Variáveis no Vercel

No Vercel, adicione:

| Variable | Value |
|----------|-------|
| `N8N_WEBHOOK_URL` | `https://seu-n8n.com/webhook/4c260be3-43f4-476e-b483-49622747a35e` |
| `N8N_WEBHOOK_SECRET` | `assembly-line-secret-2024` (mesmo do n8n) |

---

## PASSO 7: Testar

1. Vá no App → Dashboard → Selecione um projeto
2. Vá na aba **Geração**
3. Selecione "Fase 1A: Clone Expert"
4. Clique em **Iniciar Geração**
5. Acompanhe o progresso em tempo real

---

## Mapeamento de Campos Airtable → Supabase

| Campo Airtable | Tabela Supabase | Coluna |
|---------------|-----------------|--------|
| Expert Name | briefings | (via project.name) |
| Nicho do Expert | briefings | nicho |
| DNA Extraido | clone_experts | dna_psicologico |
| Engenharia Reversa | clone_experts | engenharia_reversa |
| Configuração do Clone | clone_experts | configuracao_clone |
| Clone | clone_experts | system_prompt |
| Identity Map | clone_experts | analise_concorrentes |
| Market Intelligence | clone_experts | sintese_estrategica |
| Avatares Psicológicos | offers | avatar |
| Promessa Central | offers | promessas |
| Big Idea | offers | big_idea |
| High Ticket Ofertas | offers | high_ticket |
| Back End Ofertas | offers | mid_ticket |
| Front End Ofertas | offers | frontend |

---

## Troubleshooting

### Erro 401 Unauthorized
- Verifique se a credencial `Supabase API` está configurada corretamente
- Verifique se está usando a `SERVICE_ROLE_KEY` (não a anon key)

### Erro 404 Not Found
- Verifique se a função `get_expert_data` foi criada no Supabase
- Verifique se o `project_id` existe

### Callback não chega no App
- Verifique se a URL do callback está correta
- Verifique se o `N8N_WEBHOOK_SECRET` está igual no n8n e no Vercel

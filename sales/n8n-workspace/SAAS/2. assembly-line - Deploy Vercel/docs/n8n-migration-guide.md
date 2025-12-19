# Guia de Migração n8n: Airtable → Supabase

## Visão Geral

O workflow n8n "Assembly line APP" usa Airtable como banco de dados. Este guia documenta como substituir os nós Airtable por chamadas HTTP para a API REST do Supabase.

## Configuração do Supabase no n8n

### Credenciais Necessárias

1. No n8n, crie uma credencial HTTP Header Auth com:
   - **Name**: `Supabase API`
   - **Header Name**: `apikey`
   - **Header Value**: `[SUPABASE_ANON_KEY]`

2. Para operações que requerem bypass de RLS, crie outra credencial:
   - **Name**: `Supabase Service Role`
   - **Header Name**: `apikey`
   - **Header Value**: `[SUPABASE_SERVICE_ROLE_KEY]`

### URL Base
```
https://[PROJECT_ID].supabase.co/rest/v1
```

## Mapeamento de Tabelas

### Airtable "Expert DNA Profile" → Múltiplas Tabelas Supabase

| Campo Airtable | Tabela Supabase | Coluna Supabase |
|---------------|-----------------|-----------------|
| Expert Name | briefings | - (vem do project.name) |
| Nicho do Expert | briefings | nicho |
| Clone | clone_experts | system_prompt |
| DNA Extraido | clone_experts | dna_psicologico |
| Engenharia Reversa | clone_experts | engenharia_reversa |
| Configuração do Clone | clone_experts | configuracao_clone |
| Identity Map | clone_experts | analise_concorrentes |
| Market Intelligence | clone_experts | sintese_estrategica |
| Avatares Psicológicos | offers | avatar |
| Promessa Central | offers | promessas |
| Big Idea | offers | big_idea |
| High Ticket Ofertas | offers | high_ticket |
| Back End Ofertas | offers | backend |
| Front End Ofertas | offers | frontend |

## Substituições de Nós

### 1. GET Expert Record (Leitura)

**Airtable Original:**
```
Table: Expert DNA Profile
Operation: Get
ID: {{ $json.query.recordId }}
```

**Supabase HTTP Request:**
```
Method: GET
URL: https://[PROJECT_ID].supabase.co/rest/v1/rpc/get_expert_data
Headers:
  - apikey: [SUPABASE_ANON_KEY]
  - Authorization: Bearer [SUPABASE_ANON_KEY]
  - Content-Type: application/json
Body:
{
  "p_project_id": "{{ $json.query.recordId }}"
}
```

### 2. UPDATE Airtable - FASE 1A (Clone)

**Airtable Original:**
```
Table: Expert DNA Profile
Operation: Update
Fields: DNA Extraido, Engenharia Reversa, Configuração do Clone, Clone
```

**Supabase HTTP Request:**
```
Method: PATCH
URL: https://[PROJECT_ID].supabase.co/rest/v1/clone_experts?project_id=eq.{{ $json.project_id }}
Headers:
  - apikey: [SUPABASE_SERVICE_ROLE_KEY]
  - Authorization: Bearer [SUPABASE_SERVICE_ROLE_KEY]
  - Content-Type: application/json
  - Prefer: return=representation
Body:
{
  "dna_psicologico": {{ $json.dna_extraido }},
  "engenharia_reversa": {{ $json.engenharia_reversa }},
  "configuracao_clone": {{ $json.configuracao_clone }},
  "system_prompt": {{ $json.clone }},
  "status": "ready"
}
```

### 3. UPDATE Airtable - FASE 1B (Posicionamento)

**Airtable Original:**
```
Table: Expert DNA Profile
Operation: Update
Fields: Identity Map, Market Intelligence, Avatares Psicológicos, Promessa Central, Big Idea
```

**Supabase HTTP Request:**
```
Method: PATCH
URL: https://[PROJECT_ID].supabase.co/rest/v1/clone_experts?project_id=eq.{{ $json.project_id }}
Body:
{
  "analise_concorrentes": {{ $json.identity_map }},
  "concorrentes_internacionais": {{ $json.concorrentes_internacionais }},
  "concorrentes_brasileiros": {{ $json.concorrentes_brasileiros }},
  "sintese_estrategica": {{ $json.market_intelligence }}
}

---

Method: POST (upsert)
URL: https://[PROJECT_ID].supabase.co/rest/v1/offers
Headers:
  - Prefer: resolution=merge-duplicates
Body:
{
  "project_id": "{{ $json.project_id }}",
  "avatar": {{ $json.avatares_psicologicos }},
  "promessas": {{ $json.promessa_central }},
  "big_idea": {{ $json.big_idea }}
}
```

### 4. UPDATE Airtable - FASE 2 (Ofertas)

**Supabase HTTP Request:**
```
Method: PATCH
URL: https://[PROJECT_ID].supabase.co/rest/v1/offers?project_id=eq.{{ $json.project_id }}
Body:
{
  "high_ticket": {{ $json.high_ticket }},
  "mid_ticket": {{ $json.mid_ticket }},
  "backend": {{ $json.backend }},
  "frontend": {{ $json.frontend }},
  "lead_magnet": {{ $json.lead_magnet }},
  "status": "ready"
}
```

### 5. UPDATE Airtable - FASE 3 (Marketing/Conteúdos)

**Supabase HTTP Request - Conteúdos:**
```
Method: POST
URL: https://[PROJECT_ID].supabase.co/rest/v1/contents
Body (array):
[
  {
    "project_id": "{{ $json.project_id }}",
    "type": "reel",
    "title": "{{ $item.title }}",
    "body": "{{ $item.script }}",
    "hook": "{{ $item.hook }}",
    "cta": "{{ $item.cta }}",
    "generated_by": "generateMarketingeGeracaodeDemanda",
    "status": "draft"
  }
]
```

## Função RPC para Buscar Dados Completos

Execute no Supabase SQL Editor:

```sql
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
```

## Callback para o App

Após cada fase, o n8n deve chamar o webhook do app para atualizar o progresso:

```
Method: POST
URL: {{ $json.callback_url }}
Headers:
  - x-webhook-secret: [N8N_WEBHOOK_SECRET]
  - Content-Type: application/json
Body:
{
  "generation_id": "{{ $json.generation_id }}",
  "project_id": "{{ $json.project_id }}",
  "agent_name": "generateCloneExpert",
  "phase": "clone",
  "status": "complete",
  "output": {
    "dna_psicologico": {{ $json.dna }},
    "engenharia_reversa": {{ $json.engenharia }},
    "system_prompt": {{ $json.clone }}
  },
  "tokens_input": {{ $json.tokens_input }},
  "tokens_output": {{ $json.tokens_output }},
  "duration_ms": {{ $json.duration }}
}
```

## Fluxo Completo

1. **App** → Chama `/api/generate` com `action` e `project_id`
2. **App** → Cria registro em `generations` com status "pending"
3. **App** → Dispara webhook n8n com dados do projeto
4. **n8n** → Recebe webhook e roteia para a fase correta
5. **n8n** → Lê dados do Supabase via HTTP
6. **n8n** → Executa agentes de IA
7. **n8n** → Salva resultados no Supabase via HTTP
8. **n8n** → Chama callback do App para atualizar progresso
9. **App** → Webhook recebe atualização e atualiza UI via Supabase Realtime

## Variáveis de Ambiente Necessárias no n8n

```
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]
APP_CALLBACK_URL=https://[APP_URL]/api/webhook/n8n
N8N_WEBHOOK_SECRET=[secret]
```

## Checklist de Migração

- [ ] Criar credenciais HTTP no n8n para Supabase
- [ ] Criar função RPC `get_expert_data` no Supabase
- [ ] Substituir nó "Get Product1" por HTTP Request GET
- [ ] Substituir nó "Get Expert Record" por HTTP Request GET
- [ ] Substituir "💾 Update Airtable - FASE" por HTTP Request PATCH
- [ ] Substituir "💾 Update Airtable - FASE 1B2" por HTTP Request PATCH
- [ ] Substituir "💾 Update Airtable - FASE 2" por HTTP Request PATCH
- [ ] Substituir "💾 Update Airtable - FASE 3" por HTTP Request PATCH
- [ ] Substituir "💾 Update Airtable - FASE 4" por HTTP Request POST (contents)
- [ ] Substituir "💾 Update Airtable - FASE 5" por HTTP Request POST (contents)
- [ ] Substituir "💾 Update Airtable - Reels" por HTTP Request POST (contents)
- [ ] Substituir "💾 Update Airtable - Carrossel" por HTTP Request POST (contents)
- [ ] Substituir "💾 Update Airtable - Stories" por HTTP Request POST (contents)
- [ ] Adicionar nó HTTP Request no final de cada fase para callback
- [ ] Testar cada fase individualmente
- [ ] Configurar variáveis de ambiente no Vercel

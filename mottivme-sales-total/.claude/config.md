# Configuração Claude Code - Mottivme

> **Para retomar qualquer sessão, cole isso no início:**
> ```
> Ler configuração: /Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/.claude/config.md
> ```

---

## Arquitetura do Ecossistema

```
                              ┌─────────────────┐
                              │  CLAUDE CODE    │
                              │ (Desenvolvedor) │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
             ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
             │   MONDAY    │    │   NOTION    │    │   GITHUB    │
             │  (Tarefas)  │    │   (Docs)    │    │  (Código)   │
             └──────┬──────┘    └──────┬──────┘    └─────────────┘
                    │                  │
                    └────────┬─────────┘
                             ▼
                      ┌─────────────┐
                      │     N8N     │
                      │(ORQUESTRADOR)│
                      └──────┬──────┘
                             │
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
     ┌─────────┐       ┌──────────┐      ┌─────────┐
     │   GHL   │       │ SUPABASE │      │  APIs   │
     │  (CRM)  │       │ (Dados)  │      │(Externas)│
     └─────────┘       └──────────┘      └─────────┘
```

**Claude Code** = Eu. Desenvolvo, documento, integro e automatizo.
Acesso direto a Monday, Notion, GitHub. Via APIs acesso n8n, GHL, Supabase.

---

## Integrações Ativas

### Monday.com
- **Token:** `eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM1MDA3Mzc3NSwiYWFpIjoxMSwidWlkIjozNjMzNzQwNiwiaWFkIjoiMjAyNC0wNC0yMVQwOTo1MjozMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQwNjE3OTksInJnbiI6InVzZTEifQ.-8-lOl8h6fcG82m_GdzckKnimiRRNTCxx8cHZTEEhXw`
- **Board Principal:** 1. TENHO QUE (ID: 5145987292)
- **Grupo Executar:** metas_gerais_
- **API:** https://api.monday.com/v2

#### Colunas do Board "TENHO QUE"
| Coluna | ID | Uso |
|--------|-----|-----|
| Status | `status71` | Status da tarefa |
| Prioridade | `dup__of_andamento` | Ordem de prioridade (1-7) |
| Urgente | `urgente8` | Se URGENTE: 1. Importante / 3. Não Importante |
| Não Urgente | `n_o_urgente3` | Se NÃO URGENTE: 2. Importante / 4. Não Importante |

```
┌─────────────────────────────────────────────────────────┐
│              MATRIZ DE EISENHOWER                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   URGENTE (urgente8)       NÃO URGENTE (n_o_urgente3)  │
│   ┌───────────────────┐    ┌───────────────────┐       │
│   │ 1. IMPORTANTE     │    │ 2. IMPORTANTE     │       │
│   │    (Fazer já!)    │    │    (Agendar)      │       │
│   ├───────────────────┤    ├───────────────────┤       │
│   │ 3. NÃO IMPORTANTE │    │ 4. NÃO IMPORTANTE │       │
│   │    (Delegar)      │    │    (Eliminar)     │       │
│   └───────────────────┘    └───────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Notion
- **Token:** `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`
- **Database Ferramentas:** 28774e84-7c05-8175-bba6-cd28cb32baa6
- **Database Tópicos:** 28774e84-7c05-819f-90a5-d9020da0812b
- **API:** https://api.notion.com/v1
- **Version:** 2022-06-28

### n8n
- **URL:** https://cliente-a1.mentorfy.io
- **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjM2NzAyYS1mYjFjLTQ3MWMtYjIyYy02Yjg5OGExN2JjYjEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY1OTQ4OTU2fQ.Xgwkv2FR3Gz3kiqvDZvfKDoc8K1Wb-aqh8IaNe9G9l4`
- **Total Workflows:** 396

### GoHighLevel (GHL)
- **Location ID:** cd1uyzpJox6XPt4Vct8Y
- **API Key:** `pit-fe627027-b9cb-4ea3-aaa4-149459e66a03`
- **API:** https://services.leadconnectorhq.com

### Supabase (CEO)
- **Project ID:** bfumywvwubvernvhjehk
- **URL:** https://bfumywvwubvernvhjehk.supabase.co

### Google Drive - Estrutura de Calls
- **Pasta Origem (Meet Recordings):** `1WTJrbMl8HLppIHIeHT94Qsbog9XpxOx2`
- **Pasta Destino (7. Calls):** `1xJlrfzeOEMD6oPtG1e40IYHT1rWPqniH`

| Subpasta | ID |
|----------|-----|
| 1. Vendas | `1yr256LwbLKJZ5HzHgC7Zq25MrSOKTQEs` |
| 2. Onboarding | `1JS87Zs1bRSiNKjqVPTZ3GkfCvMnUj8PO` |
| 3. Revisao | `1psAln8h2Il5ic6U8Nv8UhRWt6RNbnmyQ` |
| 4. Suporte | `15Q6LzE0Mujxj-Q8lqNjx8rmRjVyUx0Kw` |
| 5. Churn | `1G56zGj8N6mhdS7nZH77mtK15wGDFV8kk` |
| 6. Outros | `1Z0Zdo05XxtBhIe8mwUUkgGsld3PanHKU` |

---

## Workflows Ativos

### 1. Organizador de Calls (Google Drive)
**Função:** Monitora pasta Meet Recordings, classifica por prefixo, busca contato no GHL, numera, renomeia, move e salva no Supabase.

**Formato do arquivo de entrada:**
```
TIPO - Nome - Telefone - LocationID
Exemplo: Kickoff - Dr Luiz - 18996216638 - cd1uyzpJox6XPt4Vct8Y
```

```
┌─────────────────────────────────────────────────────────────┐
│  FLUXO: Organizador de Calls                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Google Drive Trigger (Meet Recordings)                     │
│       ↓                                                     │
│  Classificar Arquivo por Prefixo (Code)                    │
│   → Extrai: tipo, nome, telefone, locationId               │
│       ↓                                                     │
│  Buscar Contato GHL (HTTP Request)                         │
│   → Busca contact_id pelo telefone                         │
│       ↓                                                     │
│  Buscar Próximo Número (PostgreSQL)                        │
│   → get_next_call_number(tipo)                             │
│       ↓                                                     │
│  Renomear Arquivo (Google Drive Update)                    │
│   → Formato: "1 - Kickoff - Nome - Tel - LocationId"       │
│       ↓                                                     │
│  Mover para Subpasta (Google Drive Move)                   │
│       ↓                                                     │
│  Registrar em call_recordings (PostgreSQL)                 │
│   → Salva: contact_id, location_id, gdrive_url, etc.       │
│       ↓                                                     │
│  IF: Dados incompletos? → Notificar CS (WhatsApp)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Prefixos Reconhecidos:**
| Prefixo | Tipo | Pasta Destino |
|---------|------|---------------|
| DIAGNOSTICO, DIAG_ | diagnostico | 1. Vendas |
| KICKOFF, KICK_ | kickoff | 2. Onboarding |
| ACOMPANHAMENTO, ACOMP_ | acompanhamento | 3. Revisao |
| REVISAO, REV_ | revisao | 3. Revisao |
| ALINHAMENTO, ALINH_ | alinhamento | 3. Revisao |
| SUPORTE, SUP_ | suporte | 4. Suporte |
| CHURN, CHURN_ | churn | 5. Churn |
| (sem prefixo) | outro | 6. Outros |

**Lógica de Notificação:**
- Com prefixo + nome + telefone → Move sem notificar
- Com prefixo + dados incompletos → Move + Notifica CS
- Sem prefixo → Move para "6. Outros" sem notificar

**Expressão do Rename (IMPORTANTE):**
```
={{ $json.numero }} - {{ $('Classificar Arquivo por Prefixo').item.json.arquivo.nomeLimpo }}
```

### 2. AI Agent - Head de Vendas (Supabase)
**Função:** Monitora pasta 1. Vendas (dentro de 7. Calls), busca dados no Supabase, analisa transcrição com IA e salva scores no GHL.

```
┌─────────────────────────────────────────────────────────────┐
│  FLUXO: AI Agent - Head de Vendas                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Google Drive Trigger (1. Vendas)                          │
│       ↓                                                     │
│  Buscar Call no Supabase (PostgreSQL)                      │
│   → JOIN call_recordings + locations                       │
│   → Traz: association_id, api_key, etc.                    │
│       ↓                                                     │
│  IF: Call existe? → Sim: continua / Não: skip              │
│       ↓                                                     │
│  Export Google Doc como Texto (HTTP Request) ⭐ IMPORTANTE │
│   → URL: googleapis.com/drive/v3/files/{id}/export         │
│   → mimeType=text/plain                                    │
│       ↓                                                     │
│  Config GHL + Dados Supabase (Set)                         │
│   → location_id, contact_id, tipo_call do Supabase         │
│   → texto = $('Export Google Doc como Texto').item.json.data│
│       ↓                                                     │
│  AI Agent - Head de Vendas (Groq Llama 3.3 70B)            │
│   → Análise BANT/SPIN com scores 0-100                     │
│       ↓                                                     │
│  Code - Processar Análise                                  │
│   → Parse JSON, define tier (A+/B/C/D)                     │
│       ↓                                                     │
│  ┌──────────────────┬──────────────────────────┐           │
│  │ Listar Custom    │ Salvar em Custom Object  │           │
│  │ Fields GHL       │ (anlises_de_call)        │           │
│  └────────┬─────────┴──────────┬───────────────┘           │
│           │                    ↓                            │
│           │           Buscar Associations                   │
│           │                    ↓                            │
│           │           Associar Call ao Contato              │
│           │            → associationId DINÂMICO             │
│           ↓                    ↓                            │
│  Code - Encontrar IDs         │                            │
│           ↓                    │                            │
│  Atualizar Campos GHL ────────┴──→ Atualizar Status        │
│   (HTTP PUT)                       Supabase                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**⚠️ SOLUÇÃO: Extração de Texto de Google Docs**

O node "Download Arquivo" do Google Drive retorna binário para Google Docs.
**Solução que funciona:** Usar HTTP Request para exportar como texto puro.

```json
{
  "method": "GET",
  "url": "https://www.googleapis.com/drive/v3/files/{{ $('Google Drive Trigger').item.json.id }}/export",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googleDriveOAuth2Api",
  "sendQuery": true,
  "queryParameters": {
    "parameters": [{ "name": "mimeType", "value": "text/plain" }]
  },
  "options": {
    "response": { "response": { "responseFormat": "text" } }
  }
}
```

**Expressão para pegar o texto:**
```
={{ $('Export Google Doc como Texto').item.json.data }}
```

**Custom Fields GHL (Contact):**
| Campo | Field Key |
|-------|-----------|
| Score Total | contact.score_total |
| Probabilidade Fechamento | contact.probabilidade_fechamento |
| Status Análise | contact.status_analise |
| Tier da Call | contact.tier_call |
| Resumo Executivo | contact.resumo_executivo |
| Scores Formatado | contact.scores_formatado |
| BANT Score | contact.qualificacao_bant_score |
| SPIN Score | contact.descoberta_spin_score |
| Condução Score | contact.conducao_score |
| Fechamento Score | contact.fechamento_score |

**Tiers de Classificação:**
| Score | Tier | Emoji |
|-------|------|-------|
| 81-100 | A+ EXCELENTE | 🏆 |
| 61-80 | B BOA | ✅ |
| 41-60 | C MEDIANA | ⚠️ |
| 0-40 | D FRACA | ❌ |

**Salva em:**
- Custom Fields do Contato GHL (scores)
- Custom Object `anlises_de_call` (análise completa)
- Associação Contact ↔ Custom Object (dinâmica via `association_id`)
- Supabase `call_recordings` (status atualizado)

**Custom Object `anlises_de_call` - Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| resumo_da_call | Text | Resumo executivo da análise |
| data_call | Date | Data da call (YYYY-MM-DD) |
| tipo | Text | diagnostico, kickoff, etc. |
| sentimento | Text | positivo, neutro, negativo |
| pontuacao_geral | Number | Score total 0-100 |
| participantes | Text | Nome do lead (dinâmico) |
| duracao_minutos | Number | Duração estimada |
| proximos_passos | Text | Ações de follow-up |
| pontos_positivos | Text | Highlights da call |
| pontos_atencao | Text | Feedback de condução |
| objecoes_identificadas | Text | Red flags encontrados |
| link_gravacao | Text | URL do Google Drive |
| bant_score | Number | Score BANT 0-10 |
| spin_score | Number | Score SPIN 0-10 |
| conducao_score | Number | Score condução 0-10 |
| fechamento_score | Number | Score fechamento 0-10 |
| probabilidade_fechamento | Number | Probabilidade 0-100% |
| status_analise | Text | QUALIFICADO/NUTRIR/DESQUALIFICAR |
| tier | Text | A+ EXCELENTE, B BOA, C MEDIANA, D FRACA |

**⚠️ SINTAXE n8n - IMPORTANTE:**
```javascript
// ✅ FUNCIONA - usar essa sintaxe:
$('NodeName').item.json.campo
$('NodeName').first().json.campo

// ❌ NÃO FUNCIONA - causa [undefined]:
$items('NodeName').first().json.campo
```

---

## Tabelas Supabase

### locations
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  api_key VARCHAR(255) NOT NULL,
  association_id VARCHAR(50),  -- ID da associação Contact<->Custom Object no GHL
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location principal (agência)
INSERT INTO locations (location_id, name, api_key, association_id) VALUES
('cd1uyzpJox6XPt4Vct8Y', 'Mottivme Principal', 'pit-fe627027-b9cb-4ea3-aaa4-149459e66a03', '6942e44cfcab409ac99caefa');

-- Migração: adicionar association_id se tabela já existe
-- ALTER TABLE locations ADD COLUMN IF NOT EXISTS association_id VARCHAR(50);
-- UPDATE locations SET association_id = '6942e44cfcab409ac99caefa' WHERE location_id = 'cd1uyzpJox6XPt4Vct8Y';
```

### call_recordings
```sql
CREATE TABLE call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50),
  titulo TEXT,
  gdrive_file_id VARCHAR(255),
  gdrive_url TEXT,
  contact_id VARCHAR(100),
  location_id VARCHAR(50),
  nome_lead VARCHAR(255),
  telefone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW(),
  analyzed_at TIMESTAMP
);

-- Constraints
ALTER TABLE call_recordings ADD CONSTRAINT call_recordings_status_check
  CHECK (status IN ('pendente', 'movido', 'processando', 'analisado', 'erro'));

ALTER TABLE call_recordings ADD CONSTRAINT call_recordings_tipo_check
  CHECK (tipo IN ('diagnostico', 'kickoff', 'acompanhamento', 'revisao', 'suporte', 'alinhamento', 'churn', 'outro'));
```

### call_counters
```sql
CREATE TABLE call_counters (
  tipo VARCHAR(50) PRIMARY KEY,
  ultimo_numero INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir tipos iniciais
INSERT INTO call_counters (tipo, ultimo_numero) VALUES
('diagnostico', 0), ('kickoff', 0), ('acompanhamento', 0),
('revisao', 0), ('suporte', 0), ('alinhamento', 0), ('churn', 0), ('outro', 0);

-- Função para incrementar contador
CREATE OR REPLACE FUNCTION get_next_call_number(p_tipo VARCHAR)
RETURNS INTEGER AS $$
DECLARE v_numero INTEGER;
BEGIN
  UPDATE call_counters
  SET ultimo_numero = ultimo_numero + 1, updated_at = NOW()
  WHERE tipo = p_tipo
  RETURNING ultimo_numero INTO v_numero;

  IF v_numero IS NULL THEN
    INSERT INTO call_counters (tipo, ultimo_numero) VALUES (p_tipo, 1);
    RETURN 1;
  END IF;

  RETURN v_numero;
END;
$$ LANGUAGE plpgsql;
```

---

## Regras de Uso

### Monday + Notion (OBRIGATÓRIO)

> **SEMPRE que criar:**
> - **Página no Notion** → Adicionar link na tarefa relacionada do Monday
> - **Tarefa no Monday** → Se tiver doc, criar no Notion e vincular
>
> **Os dois devem estar conectados.**

```
┌─────────────────────────────────────────────────┐
│  Tarefa Monday  ←→  Página Notion               │
├─────────────────────────────────────────────────┤
│  • Criar tarefa Monday → se tiver doc,          │
│    criar página Notion e colar link na tarefa   │
│                                                 │
│  • Criar página Notion → adicionar link         │
│    na tarefa relacionada do Monday              │
└─────────────────────────────────────────────────┘
```

### Estrutura de Pastas n8n
```
1. Aquisição/    (Marketing + Lead Gen + Comercial)
2. Entrega/      (Agentes + SecretárIA + Call Analyzers)
3. Retenção/     (Financeiro + MIS)
4. Infra/        (Tools + Integrações + Notificações)
5. Labs/         (RAG + Prompt Engineer + Experimentos)
99. Arquivo/
```

---

## Comandos Rápidos

### Criar tarefa no Monday (grupo EXECUTAR)
```bash
curl -X POST https://api.monday.com/v2 \
  -H "Authorization: TOKEN_MONDAY" \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { create_item (board_id: 5145987292, group_id: \"metas_gerais_\", item_name: \"NOME_TAREFA\") { id } }"}'
```

### Criar página no Notion
```bash
curl -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer TOKEN_NOTION" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"parent": {"database_id": "28774e84-7c05-8175-bba6-cd28cb32baa6"}, "properties": {"Name": {"title": [{"text": {"content": "TITULO"}}]}}}'
```

### Listar workflows n8n
```bash
curl -X GET "https://cliente-a1.mentorfy.io/api/v1/workflows?limit=250" \
  -H "X-N8N-API-KEY: TOKEN_N8N"
```

---

## Arquivos de Referência

| Arquivo | Caminho |
|---------|---------|
| Reorganização n8n | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/n8n-workspace/n8n-reorganizacao-resumo.md` |
| Mapeamento n8n | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/n8n-workspace/n8n-mapeamento-completo.txt` |
| Scripts SQL | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/scripts/` |
| Config Claude | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/.claude/config.md` |
| Organizador de Calls (JSON) | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/n8n-workspace/Fluxos n8n/organizador-calls-FINAL.json` |
| AI Agent Head Vendas (JSON) | `/Users/marcosdaniels/Documents/Projetos/MOTTIVME SALES TOTAL/n8n-workspace/Fluxos n8n/AI-Agent-Head-Vendas-SUPABASE.json` |

---

## Links Úteis

| Sistema | Link |
|---------|------|
| Monday Board | https://mottivme.monday.com/boards/5145987292 |
| Notion Reorganização n8n | https://www.notion.so/Reorganiza-o-n8n-Plano-Completo-2cc74e847c0581d0ad86f487bb063949 |
| n8n Dashboard | https://cliente-a1.mentorfy.io |
| Supabase Dashboard | https://supabase.com/dashboard/project/bfumywvwubvernvhjehk |

---

## Tarefas Pendentes

### Reorganização n8n
- [ ] Deletar 45 workflows identificados
- [ ] Revisar 4 pares de duplicatas
- [ ] Mover ~137 workflows sem categoria
- [ ] Criar pastas no n8n (requer license enterprise)

### Secretária IA (Ideia)
- [ ] Criar tools Monday para agente
- [ ] Integrar WhatsApp
- [ ] Conectar GHL Calendar

### Organizador de Calls
- [x] Criar workflow de organização automática
- [x] Configurar classificação por prefixo
- [x] Implementar numeração sequencial por tipo
- [x] Criar tabelas call_recordings e call_counters
- [x] Adicionar busca de contact_id no GHL
- [x] Salvar contact_id e location_id no Supabase
- [x] Integrar com AI Agent Head de Vendas
- [ ] Configurar envio real de notificação WhatsApp via GHL
- [ ] Ativar workflows em produção

### AI Agent Head de Vendas
- [x] Buscar dados do Supabase (contact_id, location_id)
- [x] Atualizar status para 'analisado' após processar
- [x] Salvar link_gravacao no Custom Object
- [x] Resolver extração de texto de Google Docs (usar HTTP Request export)
- [x] Criar 7 campos de scores no Custom Object GHL (via API)
- [x] Atualizar jsonBody do "Salvar em Custom Object" com todos os 19 campos
- [x] Tornar `associationId` dinâmico (multi-tenant)
- [x] JOIN com tabela locations para trazer association_id
- [ ] Executar migração SQL (adicionar association_id em locations)
- [ ] Testar fluxo completo end-to-end

---

## Concluído Recentemente

### 18/12/2025 - Custom Object Completo + Multi-Tenant
- **Criados 7 campos de scores via API GHL:**
  - bant_score, spin_score, conducao_score, fechamento_score
  - probabilidade_fechamento, status_analise, tier
- **jsonBody "Salvar em Custom Object" atualizado:**
  - 19 campos totais (12 existentes + 7 novos)
  - `participantes` agora dinâmico (nome_lead do Supabase)
  - Todos os scores mapeados da análise IA
- **Multi-tenant implementado:**
  - Coluna `association_id` adicionada na tabela `locations`
  - Query JOIN: `call_recordings + locations`
  - Node "Associar Call ao Contato" usa `association_id` dinâmico
- **Sintaxe n8n corrigida:**
  - `$items('...').first().json.` causava [undefined]
  - Voltou para `$('...').item.json.` que funciona

### 17/12/2025 - Solução Extração de Texto Google Docs
- **Problema:** Node "Download Arquivo" retorna binário para Google Docs, `texto` vinha undefined
- **Tentativas que falharam:**
  - Google File Conversion para HTML → caracteres garbled
  - Extract from HTML → erro "could not find <table>"
  - Code node para decodificar binário → não funcionou
- **Solução que funciona:** HTTP Request para Google Drive API export
  - URL: `https://www.googleapis.com/drive/v3/files/{id}/export?mimeType=text/plain`
  - Authentication: predefinedCredentialType (googleDriveOAuth2Api)
  - Response format: text
  - Texto vem em `$json.data`

### 17/12/2025 - Integração Organizador + AI Agent
- Workflows conectados via Supabase
- Organizador salva: contact_id, location_id, gdrive_url
- AI Agent busca dados do Supabase ao processar
- Status de call_recordings: pendente → movido → analisado
- Tabela locations criada para multi-tenant
- Documentação atualizada

### 17/12/2025 - Organizador de Calls v2
- Busca contato GHL pelo telefone extraído do nome
- Formato arquivo: "TIPO - Nome - Telefone - LocationID"
- Expressão de rename corrigida (sem duplicação)
- INSERT completo com todos os campos

### 16/12/2025 - AI Agent Head de Vendas
- Custom Objects criados no GHL (4 objetos, 36 campos)
- Workflow atualizado para salvar análises em Custom Objects
- Integração completa: Gemini → Análise → GHL Custom Fields + Custom Object

---

## Próximo Passo (para novo chat)

**Executar migração SQL no Supabase:**
```sql
ALTER TABLE locations ADD COLUMN IF NOT EXISTS association_id VARCHAR(50);
UPDATE locations SET association_id = '6942e44cfcab409ac99caefa' WHERE location_id = 'cd1uyzpJox6XPt4Vct8Y';
```

**Testar fluxo completo:**
1. Subir arquivo de call no Meet Recordings
2. Verificar organização automática
3. Verificar análise IA
4. Conferir Custom Object criado no GHL
5. Conferir associação Contact ↔ Custom Object

---

*Atualizado em: 18 Dezembro 2025*
*Projeto: Mottivme Sales Ecosystem*

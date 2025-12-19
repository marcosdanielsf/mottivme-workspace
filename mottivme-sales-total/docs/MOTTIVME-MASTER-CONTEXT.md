# MOTTIVME - DOCUMENTO MESTRE DE CONTEXTO

> **IMPORTANTE**: Este documento serve como contexto UNICO para todas as conversas com IA.
> Ao iniciar uma nova conversa, forneca este arquivo para evitar repetir contextos.
>
> **Ultima atualizacao**: 2025-12-19 - 11:00h (v3.0)
>
> **ESCOPO**: Este documento cobre a vertical de Clinicas e Consultorios High Ticket da Mottivme.

---

## 1. VISAO GERAL DO NEGOCIO

### O Que e a Mottivme
- **Agencia de IA e Crescimento B2B** focada em negocios fisicos (clinicas, consultorios High Ticket)
- **Modelo**: Instalar sistemas completos de IA que resolvem ineficiencia operacional na conversao de leads
- **Diferencial**: Sistema ponta a ponta (do lead ao show, do show ao fechamento, do fechamento a referencia)

### Problema Central que Resolvemos
- Tempo medio de resposta dos clientes: 42-47 horas (deveria ser <5 min)
- 62% das ligacoes nao sao atendidas
- 27% nunca fazem follow-up pos-venda
- **Cliente gasta em ads, gera leads, mas perde por falta de velocidade e processos**

### ICP (Ideal Customer Profile)
- Clinicas e consultorios High Ticket (medicina estetica, longevidade, etc.)
- Ticket: R$15k - R$50k por tratamento
- Ja investem em marketing mas falham no acompanhamento
- Proprietarios "operadores" ocupados demais para gerenciar leads

---

## 2. ARQUITETURA DO SISTEMA (AI FACTORY)

### 2.1 Visao Macro
```
1. AQUISICAO (Ads + Conteudo)
   ↓
2. QUALIFICACAO (IA + Lead Score)
   ↓
3. CALL DE VENDAS
   |-- IA analisa call (Head de Vendas)
   |-- Extrai: scores, objecoes, probabilidade
   ↓
4. DADOS NO GHL (Custom Objects)
   |-- Analises de Call (historico)
   |-- Objecoes detectadas
   |-- Insights do lead
   ↓
5. ONBOARDING (pos-fechamento)
   |-- Call de Kickoff
   |-- IA gera config do agente automaticamente
   ↓
6. DEPLOY DO AGENTE
   |-- Versionado no Supabase
   |-- Performance tracking
```

---

### 2.2 Fluxo Operacional Detalhado

#### FASE 1: AQUISICAO E VENDAS

```
Lead entra (WhatsApp/Instagram/Ads)
    │
    ▼
Agente SDR qualifica
    │
    ▼
Agenda call de Diagnostico (calendario GHL)
    │
    ▼
CALL DE VENDAS (Google Meet)
    │
    ├──► Gemini transcreve automaticamente
    │
    ▼
Arquivo cai na pasta /7. Calls/ (raiz do Drive)
    │
    ▼
n8n monitora pasta → detecta arquivo novo
    │
    ▼
Le nome: "Diagnostico - Joao Silva - 11999999999"
    │
    ▼
Move para /7. Calls/1. Vendas/
    │
    ▼
Dispara workflow "AI Agent - Head de Vendas"
    │
    ├──► Analisa transcricao (BANT/SPIN)
    ├──► Da scores (0-10 em 4 dimensoes)
    ├──► Calcula probabilidade fechamento
    ├──► Atualiza Custom Fields no GHL
    │
    ▼
Propostal envia proposta imersiva
    │
    ▼
Lead interage → Score atualiza → Webhook n8n → GHL
    │
    ▼
Score > 70 → Alerta WhatsApp "Lead Quente"
```

#### FASE 2: FECHAMENTO → ONBOARDING

```
Cliente fecha contrato
    │
    ▼
Agenda call de Kickoff (calendario GHL)
    │
    ▼
CALL DE ONBOARDING (Google Meet)
    │
    ├──► Gemini transcreve automaticamente
    │
    ▼
Arquivo cai na pasta /7. Calls/ (raiz)
    │
    ▼
n8n monitora pasta → detecta arquivo novo
    │
    ▼
Le nome: "Kickoff - Joao Silva - 11999999999"
    │
    ▼
Move para /7. Calls/2. Onboarding/
    │
    ▼
Dispara workflow "Call Analyzer Onboarding"
    │
    ├──► Claude analisa transcricao
    ├──► Extrai: negocio, personalidade, compliance, qualificacao, integracoes
    │
    ▼
Gera automaticamente:
    • system_prompt_v1.txt
    • tools_config.json
    • compliance_rules.json
    • personality_config.json
    │
    ▼
Cria versao no Supabase (agent_versions, is_active=FALSE)
    │
    ▼
CS recebe notificacao → Aprova
    │
    ▼
Deploy do agente (is_active=TRUE)
```

#### FASE 3: MELHORIA CONTINUA

```
30 dias depois → Agenda call de Acompanhamento
    │
    ▼
CALL DE REVISAO (Google Meet)
    │
    ├──► Gemini transcreve automaticamente
    │
    ▼
Arquivo cai na pasta /7. Calls/ (raiz)
    │
    ▼
n8n monitora → detecta → le nome: "Acompanhamento - Joao Silva"
    │
    ▼
Move para /7. Calls/3. Revisao/
    │
    ▼
Dispara workflow "Call Analyzer Revisao"
    │
    ├──► Claude analisa com framework PDCA
    ├──► Compara com versao atual
    ├──► Gera DIFF de mudancas
    │
    ▼
Cria nova versao: v1.1, v1.2, etc.
    │
    ▼
CS aprova → Deploy
```

#### FASE 4: CHURN / RECUPERACAO (futuro)

```
Cliente cancela ou nao renova
    │
    ▼
Agenda call de Alinhamento
    │
    ▼
"Alinhamento - Joao Silva - ..."
    │
    ▼
Move para /7. Calls/5. Churn/
    │
    ▼
Dispara workflow "Call Analyzer Churn"
    │
    ├──► Analisa motivos
    ├──► Sugere acoes de recuperacao
    │
    ▼
Alimenta dashboard de churn reasons
```

---

### 2.3 Convencao de Nomenclatura (CRITICO)

O **prefixo do nome do arquivo** determina automaticamente:
1. Para qual pasta o arquivo vai
2. Qual workflow sera disparado

| Prefixo do Arquivo | Pasta Destino | Workflow Disparado | Status |
|--------------------|---------------|-------------------|--------|
| `Diagnostico - ...` | `/7. Calls/1. Vendas/` | AI Agent - Head de Vendas | ✅ Pronto |
| `Kickoff - ...` | `/7. Calls/2. Onboarding/` | Call Analyzer Onboarding | ✅ Pronto (v2.3) |
| `Acompanhamento - ...` | `/7. Calls/3. Revisao/` | Call Analyzer Revisao | 🔨 A criar |
| `Suporte - ...` | `/7. Calls/4. Suporte/` | (futuro) | ⏳ Planejado |
| `Alinhamento - ...` | `/7. Calls/5. Churn/` | Call Analyzer Churn | ⏳ Planejado |
| *(outros)* | `/7. Calls/6. Outros/` | Notifica CS manualmente | ⏳ Fallback |

**Formato padrao do nome (atualizado):**
```
{Numero} - {Tipo} - {Nome do Contato} - {Telefone} - {LocationID} - {Data} - Anotacoes do Gemini - {timestamp}
```

**Exemplo real:**
```
4 - Diagnostico - Meneplast e Renan Porto - (21) 96480-6709 - cd1uyzpJox6XPt4Vct8Y - 2025/12/17 17:00 GMT-03:00 - Anotacoes do Gemini - 2025-12-17_17-34
```

---

### 2.4 Diagrama de Integracoes

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GOOGLE MEET   │────▶│   GOOGLE DRIVE  │────▶│       n8n       │
│  (transcricao)  │     │  (/7. Calls/)   │     │  (orquestrador) │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌────────────────────────────────┼────────────────────────────────┐
                        │                                │                                │
                        ▼                                ▼                                ▼
               ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
               │   GHL (CRM)     │              │    SUPABASE     │              │    PROPOSTAL    │
               │ Custom Objects  │              │ agent_versions  │              │  Score + Chat   │
               │ Custom Fields   │              │  agent_metrics  │              │                 │
               └─────────────────┘              └─────────────────┘              └─────────────────┘
                        │                                │                                │
                        └────────────────────────────────┼────────────────────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   WHATSAPP      │
                                                │  (notificacoes) │
                                                └─────────────────┘
```

---

### 2.5 Pipelines GHL

**Pipeline 1 - Pre-Vendas (Consulta Paga)**
```
Lead Entrou → Qualificado → Consulta Apresentada → Pagamento Pendente → GANHO (consulta paga) → Perdido
```
- **Regra**: Nao existe "agendado sem pagamento"
- Pagamento = confirmacao

**Pipeline 2 - Vendas (Tratamento High Ticket)**
```
Consulta Realizada → Orcamento Criado → Em Negociacao → GANHO (tratamento fechado) → Perdido
```

---

### 2.6 Custom Objects no GHL

#### Objetos Existentes (expandidos)

| Object | Campos Principais | Uso por Fase |
|--------|-------------------|--------------|
| **anlises_de_call** | 19 campos - ver tabela abaixo | Todas |
| **Objecoes** | Tipo, Intensidade, Origem, Status, Proxima acao, contexto* | Vendas, Churn |
| **Consultas** | Data, Status, Valor, Origem, Concierge | Vendas |
| **Tratamentos** | Tipo, Valor, Status clinico, Status comercial, Motivo perda | Vendas |

*Campos novos/expandidos

#### Custom Object `anlises_de_call` - Campos Completos (v2)

| Campo | Tipo | Descricao | Dinamico? |
|-------|------|-----------|-----------|
| resumo_da_call | Text | Resumo executivo da analise | ✅ IA |
| data_call | Date | Data da call (YYYY-MM-DD) | ✅ Auto |
| tipo | Text | diagnostico, kickoff, etc. | ✅ Supabase |
| sentimento | Text | positivo, neutro, negativo | ✅ IA (baseado em score) |
| pontuacao_geral | Number | Score total 0-100 | ✅ IA |
| participantes | Text | Nome do lead | ✅ Supabase (nome_lead) |
| duracao_minutos | Number | Duracao estimada | Estatico (30) |
| proximos_passos | Text | Acoes de follow-up | ✅ IA |
| pontos_positivos | Text | Highlights da call | ✅ IA |
| pontos_atencao | Text | Feedback de conducao | ✅ IA |
| objecoes_identificadas | Text | Red flags encontrados | ✅ IA |
| link_gravacao | Text | URL do Google Drive | ✅ Supabase (gdrive_url) |
| bant_score | Number | Score BANT 0-10 | ✅ IA |
| spin_score | Number | Score SPIN 0-10 | ✅ IA |
| conducao_score | Number | Score conducao 0-10 | ✅ IA |
| fechamento_score | Number | Score fechamento 0-10 | ✅ IA |
| probabilidade_fechamento | Number | Probabilidade 0-100% | ✅ IA |
| status_analise | Text | QUALIFICADO/NUTRIR/DESQUALIFICAR | ✅ IA |
| tier | Text | A+ EXCELENTE, B BOA, C MEDIANA, D FRACA | ✅ IA |

**IDs do Custom Object:**
- Object Key: `custom_objects.anlises_de_call`
- Object ID: `6941f85884c73a7cf76310e4`
- Association ID (Contact <-> Call): `6942e44cfcab409ac99caefa`

#### Valores do Campo `Tipo` (Analises de Call)

| Valor | Fase | Workflow que Cria |
|-------|------|-------------------|
| `diagnostico` | Vendas | AI Agent - Head de Vendas |
| `kickoff` | Onboarding | Call Analyzer Onboarding |
| `acompanhamento` | Revisao | Call Analyzer Revisao |
| `suporte` | Suporte | Call Analyzer Suporte |
| `alinhamento` | Churn | Call Analyzer Churn |

#### Valores do Campo `contexto` (Objecoes)

| Valor | Descricao |
|-------|-----------|
| `venda` | Objecao durante negociacao inicial |
| `renovacao` | Objecao durante renovacao |
| `cancelamento` | Motivo de churn |

#### Novos Custom Objects a Criar

**Agentes**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| `client_id` | Lookup (Contact) | Cliente associado |
| `versao` | Text | v1.0, v1.1, etc. |
| `status` | Select | draft, pending_approval, active, deprecated |
| `deploy_date` | Date | Data de deploy |
| `supabase_id` | Text | ID no Supabase |
| `created_from_call` | Lookup (Analises de Call) | Call de Kickoff que gerou |
| `prompt_summary` | Long Text | Resumo do system prompt |
| `tools_enabled` | Multi-select | Tools ativos |
| `performance_score` | Number | Score agregado de performance |

**Revisoes de Agente**
| Campo | Tipo | Descricao |
|-------|------|-----------|
| `agent_id` | Lookup (Agentes) | Agente revisado |
| `call_id` | Lookup (Analises de Call) | Call de Acompanhamento |
| `versao_anterior` | Text | v1.0 |
| `versao_nova` | Text | v1.1 |
| `mudancas_resumo` | Long Text | DIFF resumido |
| `aprovado_por` | Text | CS responsavel |
| `aprovado_em` | Date | Timestamp aprovacao |
| `motivo` | Select | melhoria, bug, cliente_pediu, performance |

#### Associacoes

```
Contact (1) ──► Analises de Call (N)
Contact (1) ──► Objecoes (N)
Contact (1) ──► Consultas (N)
Contact (1) ──► Tratamentos (N)
Contact (1) ──► Agentes (N)

Agentes (1) ──► Revisoes (N)
Analises de Call (1) ──► Agentes (1) [kickoff cria agente]
Analises de Call (1) ──► Revisoes (1) [acompanhamento cria revisao]
Tratamentos (1) ──► Objecoes (N)
```

---

### 2.7 Feedback Loops (a implementar)

| Loop | Trigger | Acao | Resultado |
|------|---------|------|-----------|
| **Calibracao de Previsao** | Oportunidade GANHO/PERDIDO | Atualiza `resultado_real` na Analise de Call | IA aprende a calibrar |
| **Performance do Agente** | Metricas diarias | Compara versoes no Supabase | Sugere ajustes ou rollback |
| **Objecoes → Criativos** | Agregacao semanal | Alimenta geracao de novos ads | Copy mais efetivo |

---

### 2.8 Metricas por Fase

| Fase | Metrica | Meta | Como Medir |
|------|---------|------|------------|
| Aquisicao | Tempo de resposta | <5 min | GHL timestamp |
| Aquisicao | Taxa de agendamento | >30% | Leads → Consultas |
| Vendas | Taxa de show | >80% | Agendados → Realizados |
| Vendas | Taxa de fechamento | >40% | Consultas → Tratamentos |
| Onboarding | Tempo kickoff → deploy | <48h | Supabase timestamps |
| Melhoria | Δ performance entre versoes | +10% | agent_metrics |

---

### 2.9 Schema Supabase

#### Projeto Principal: CEO (bfumywvwubvernvhjehk)

**Tabela: locations (MULTI-TENANT)**
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id VARCHAR(50) UNIQUE NOT NULL,  -- ID da location no GHL
  name VARCHAR(255),
  api_key VARCHAR(255) NOT NULL,            -- API key do GHL
  association_id VARCHAR(50),               -- ID da associacao Contact<->Custom Object
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location principal (agencia)
INSERT INTO locations (location_id, name, api_key, association_id) VALUES
('cd1uyzpJox6XPt4Vct8Y', 'Mottivme Principal', 'pit-fe627027-b9cb-4ea3-aaa4-149459e66a03', '6942e44cfcab409ac99caefa');
```

**Tabela: clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ghl_contact_id TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT,
  email TEXT,
  vertical TEXT, -- clinicas, financeiro, servicos, mentores
  status TEXT DEFAULT 'prospect', -- prospect, cliente, churned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: agent_versions**
```sql
CREATE TABLE agent_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  versao TEXT NOT NULL, -- v1.0, v1.1, etc.
  system_prompt TEXT NOT NULL,
  tools_config JSONB,
  compliance_rules JSONB,
  personality_config JSONB,
  is_active BOOLEAN DEFAULT FALSE,
  created_from_call_id TEXT, -- ID da Analise de Call no GHL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ
);
```

**Tabela: agent_metrics**
```sql
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_version_id UUID REFERENCES agent_versions(id),
  data DATE NOT NULL,
  total_conversas INT DEFAULT 0,
  conversas_resolvidas INT DEFAULT 0,
  escalations INT DEFAULT 0,
  tempo_medio_resposta_seg INT,
  satisfacao_media DECIMAL(3,2), -- 0.00 a 5.00
  tokens_consumidos INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_version_id, data)
);
```

**Tabela: call_recordings (atualizada v2)**
```sql
CREATE TABLE call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(50),                    -- diagnostico, kickoff, acompanhamento, etc.
  titulo TEXT,
  gdrive_file_id VARCHAR(255),
  gdrive_url TEXT,
  contact_id VARCHAR(100),             -- ID do contato no GHL
  location_id VARCHAR(50),             -- ID da location no GHL
  nome_lead VARCHAR(255),              -- Nome extraido do arquivo
  telefone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, movido, processando, analisado, erro
  analise_json JSONB,                  -- output do workflow de analise
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP               -- Quando foi analisado
);
```

**Query usada nos workflows (JOIN com locations):**
```sql
SELECT cr.*, l.api_key as location_api_key, l.association_id
FROM call_recordings cr
LEFT JOIN locations l ON cr.location_id = l.location_id
WHERE cr.gdrive_file_id = '{file_id}' AND cr.status = 'movido'
LIMIT 1
```

**Tabela: churn_reasons**
```sql
CREATE TABLE churn_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  call_recording_id UUID REFERENCES call_recordings(id),
  motivo_principal TEXT,
  motivos_secundarios TEXT[],
  valor_contrato DECIMAL(10,2),
  meses_ativo INT,
  recuperavel BOOLEAN,
  acao_sugerida TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Projeto Legado: FINANCEIRO (xbqxivqzetaoptuyykmx)

**Tabelas existentes (n8n):**
- `n8n_historico_mensagens` - Historico de mensagens por sessao
- `n8n_fila_mensagens` - Fila de mensagens pendentes
- `n8n_status_atendimento` - Status de atendimento por sessao

> **Nota**: Novas tabelas devem ser criadas no projeto CEO. Projeto FINANCEIRO e legado.

---

### 2.10 Workflows Core por Fase

| Fase | Workflow | Arquivo | Status | Funcao |
|------|----------|---------|--------|--------|
| **Infra** | Organizador de Calls | `organizador-calls-FINAL.json` | ✅ Pronto | Monitora Meet Recordings, classifica, numera, move, salva Supabase |
| **Vendas** | AI Agent - Head de Vendas | `AI-Agent-Head-Vendas-SUPABASE.json` | ✅ Pronto (v2) | Analisa call, scores BANT/SPIN, Custom Object + Associacao |
| **Vendas** | Propostal Webhook | (dentro do Propostal) | ✅ Pronto | Recebe score de interesse, atualiza GHL, dispara alerta |
| **Onboarding** | Call Analyzer Onboarding | `Call-Analyzer-Onboarding.json` | ✅ Pronto (v2.3) | Analisa kickoff, gera config agente, Custom Object + Associacao |
| **Onboarding** | Agent Factory | `Agent-Factory.json` | ✅ Pronto (v1.0) | Le config do kickoff, cria agente no Supabase + GHL |
| **Onboarding** | AI Agent Conversacional | `AI-Agent-Conversacional.json` | ✅ Pronto (v1.0) | Atende leads via WhatsApp usando config do agente |
| **Revisao** | Call Analyzer Revisao | `Call-Analyzer-Revisao.json` | ✅ Pronto (v2.0) | Analisa acompanhamento, PDCA, gera nova versao pending |
| **Revisao** | Engenheiro de Prompt | `Engenheiro-de-Prompt.json` | ✅ Pronto (v1.0) | Ajustes pontuais em prompts via webhook (7 comandos) |
| **Suporte** | Call Analyzer Suporte | `Call-Analyzer-Suporte.json` | ⏳ Planejado | Analisa calls de suporte, categoriza issues |
| **Churn** | Call Analyzer Churn | `Call-Analyzer-Churn.json` | ⏳ Planejado | Analisa alinhamento, extrai motivos, sugere recuperacao |
| **Feedback** | Feedback Loop Oportunidade | `Feedback-Loop-Oportunidade.json` | 🔨 A criar | Quando opp fecha, atualiza resultado_real na Analise |

#### Fluxo AI Agent - Head de Vendas (v2 - Detalhado)

```
┌─────────────────────────────────────────────────────────────┐
│  FLUXO: AI Agent - Head de Vendas (v2 - Supabase)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Google Drive Trigger (1. Vendas)                          │
│       ↓                                                     │
│  Buscar Call no Supabase (PostgreSQL)                      │
│   → JOIN call_recordings + locations                       │
│   → Traz: association_id, api_key, nome_lead, etc.         │
│       ↓                                                     │
│  IF: Call existe? → Sim: continua / Nao: skip              │
│       ↓                                                     │
│  Export Google Doc como Texto (HTTP Request)               │
│   → googleapis.com/drive/v3/files/{id}/export              │
│   → mimeType=text/plain                                    │
│       ↓                                                     │
│  Config GHL + Dados Supabase (Set)                         │
│       ↓                                                     │
│  AI Agent - Head de Vendas (Groq Llama 3.3 70B)            │
│   → Analise BANT/SPIN com scores 0-100                     │
│       ↓                                                     │
│  Code - Processar Analise                                  │
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
│           │            → associationId DINAMICO             │
│           ↓                    ↓                            │
│  Code - Encontrar IDs         │                            │
│           ↓                    │                            │
│  Atualizar Campos GHL ────────┴──→ Atualizar Status        │
│   (HTTP PUT)                       Supabase                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**⚠️ SINTAXE n8n - IMPORTANTE:**
```javascript
// ✅ FUNCIONA - usar essa sintaxe:
$('NodeName').item.json.campo
$('NodeName').first().json.campo

// ❌ NAO FUNCIONA - causa [undefined]:
$items('NodeName').first().json.campo
```

#### Dependencias entre Workflows

```
Monitor Pasta Calls
    │
    ├── arquivo "Diagnostico..." ──► AI Agent - Head de Vendas
    │                                      │
    │                                      ▼
    │                               Propostal Webhook
    │
    ├── arquivo "Kickoff..." ──► Call Analyzer Onboarding ──► Agent Factory
    │                                                              │
    │                                                              ▼
    │                                                    AI Agent do Cliente
    │
    ├── arquivo "Acompanhamento..." ──► Call Analyzer Revisao ──► Agent Factory (nova versao)
    │
    ├── arquivo "Suporte..." ──► Call Analyzer Suporte
    │
    ├── arquivo "Alinhamento..." ──► Call Analyzer Churn
    │
    └── arquivo outro ──► Notifica CS (fallback)
```

---

### 2.12 Agent Factory - Arquitetura

> Documentacao completa: `/n8n-workspace/ARQUITETURA-AGENT-FACTORY.md`

#### Fluxo de Criacao de Agentes

```
FASE VENDAS                              FASE ONBOARDING
┌──────────────────────┐           ┌──────────────────────────────┐
│ AI Agent da clinica  │           │ Call de Kickoff              │
│ - Qualifica leads    │    ──►    │ (CS + Cliente define:        │
│ - Agenda consultas   │           │  tom, servicos, compliance)  │
│ - Detecta objecoes   │           │                              │
└──────────────────────┘           └───────────────┬──────────────┘
                                                   ▼
                         ┌─────────────────────────────────────────┐
                         │ CALL ANALYZER ONBOARDING (✅ v2.3)       │
                         │                                          │
                         │ 1. Extrai informacoes da call           │
                         │ 2. Gera agent_config (JSON)             │
                         │ 3. Salva no Supabase (analise_json)     │
                         │ 4. Salva no Custom Object anlises_de_call│
                         └───────────────┬─────────────────────────┘
                                         ▼
                         ┌─────────────────────────────────────────┐
                         │ AGENT FACTORY (✅ v1.0 PRONTO)            │
                         │                                          │
                         │ 1. Le agent_config do Supabase          │
                         │ 2. Refina prompt (skill conversational)  │
                         │ 3. Cria registro em agent_versions      │
                         │ 4. Cria Custom Object "Agentes" no GHL  │
                         │ 5. Associa Agente ao Contato            │
                         │ 6. Notifica CS                          │
                         └───────────────┬─────────────────────────┘
                                         ▼
                         ┌─────────────────────────────────────────┐
                         │ AI AGENT CONVERSACIONAL (✅ v1.0 PRONTO)  │
                         │                                          │
                         │ - Atende leads via WhatsApp             │
                         │ - Qualifica, agenda, trata objecoes     │
                         │ - Escala quando necessario              │
                         │                                          │
                         │ ALIMENTA: Objecoes, Consultas            │
                         └─────────────────────────────────────────┘
```

#### Quem Alimenta Cada Custom Object

| Custom Object | Quem Alimenta | Quando |
|--------------|---------------|--------|
| `anlises_de_call` | Call Analyzers (todos) | Ao analisar qualquer call |
| `Agentes` | Agent Factory | Ao criar agente apos kickoff |

---

### 2.13 Arquitetura Modular de Prompts (v2.0)

> **STATUS**: ✅ Implementado em Call Analyzer Onboarding v2.4 + Agent Factory v1.1
>
> **BREAKING CHANGE**: Agentes criados agora usam arquitetura modular ao invés de prompts monolíticos

#### 2.13.1 Conceito

Ao invés de criar UM prompt gigante, a IA agora cria **múltiplos prompts especializados** (modos) baseados nas necessidades do cliente.

**Antes (v1.0 - Monolítico):**
```javascript
// Um único system_prompt de 2000+ palavras tentando cobrir TUDO
system_prompt: "Você é assistente da Clínica X. Faça qualificação, agendamento,
follow-up, no-show recovery, customer success, tratamento de objeções..."
```

**Depois (v2.0 - Modular):**
```javascript
// Configuração modular
{
  business_context: { nome_clinica, especialidade, servicos, diferenciais },
  compliance_rules: { proibicoes, gatilhos_escalacao },
  personality_config: { tom, nome_agente, caracteristicas },

  modos_identificados: ["first_contact", "scheduler", "concierge"],

  prompts_por_modo: {
    first_contact: "## OBJETIVO\nQualificar lead frio...",
    scheduler: "## OBJETIVO\nAgendar consulta...",
    concierge: "## OBJETIVO\nManter engajamento até o dia..."
  }
}
```

#### 2.13.2 Modos Disponíveis

| Modo | Quando Usar | Responsabilidade |
|------|-------------|-----------------|
| **first_contact** | Lead frio entra pela primeira vez | Qualificar, criar interesse, agendar primeira consulta |
| **scheduler** | Lead já qualificado quer agendar | Buscar disponibilidade, confirmar dados, criar agendamento |
| **rescheduler** | Lead faltou (no-show) | Reagendar, entender motivo, manter relacionamento |
| **concierge** | Entre agendamento e consulta | Confirmar presença, enviar lembretes, responder dúvidas |
| **customer_success** | Pós-primeira consulta | Fechar venda do tratamento, upsell, fidelização |
| **objection_handler** | Objeções específicas detectadas | Tratar objeções comuns do nicho (preço, dor, tempo) |
| **followuper** | Reativar lead frio antigo | Follow-up após semanas/meses sem contato |

#### 2.13.3 Como a IA Identifica os Modos

Durante a análise do kickoff (Workflow 03), a IA:

1. **Analisa o negócio e estratégia**
   - "Leads vêm do Instagram? → Precisa de `first_contact`"
   - "Cliente reclama de 40% no-show? → Precisa de `concierge` + `rescheduler`"
   - "Vende pacotes caros pós-avaliação? → Precisa de `customer_success`"

2. **Gera prompts específicos para cada modo**
   - Incorpora: nome da clínica, serviços, diferenciais, compliance
   - Tom de personalidade consistente
   - Estratégias específicas do modo

3. **Valida completude**
   - Mínimo 2 modos (ex: `first_contact` + `scheduler`)
   - Máximo 7 modos (todos)
   - Cada prompt tem 200-500 palavras

#### 2.13.4 Template Padrão (Hardcoded)

Para **economizar tokens**, o template padrão é hardcoded no workflow de execução:

```markdown
**CONTEXTO**
DATA: {{ $now.format('FFFF') }}
HORA_LOCAL: {{ $now.setZone('America/New_York').toFormat('HH') }}
TEL/WHATSAPP: {{ $('Info').first().json.telefone }}
EMAIL: {{ $('Info').first().json.email }}
NOME DO CLIENTE: {{ $('Info').first().json.first_name }}
LOCATION_ID: {{ $('Info').first().json.location_id }}
API_KEY: {{ $('Info').first().json.api_key }}

## SAUDAÇÃO
{{ $('Info').first().json.is_primeira_mensagem ?
   'Use saudação + nome do cliente' :
   'Vá direto ao ponto' }}

## FERRAMENTAS DISPONÍVEIS
- Busca_disponibilidade: OBRIGATÓRIO antes de oferecer horários
- Agendar_reuniao: Criar agendamento
- Adicionar_tag_perdido: Desqualificar lead

## HISTÓRICO DE CONVERSAS ANTIGAS
{{ $('Set mensagens').first().json.mensagens_antigas }}

---

{{ $json.prompt }}  // ← Prompt dinâmico vem aqui
```

**Vantagens:**
- ✅ Economia de ~500 tokens por execução (não precisa gerar o template)
- ✅ Consistência garantida (todos os agentes têm mesmo formato)
- ✅ Fácil atualizar todos os agentes (muda o template, não os prompts)

#### 2.13.5 Estrutura no Banco de Dados

**Tabela `agent_versions` (atualizada):**

```sql
CREATE TABLE agent_versions (
  -- ... campos existentes ...

  -- NOVO: Configs modulares armazenadas em tools_config
  tools_config JSONB DEFAULT '{
    "tools_enabled": ["busca_disponibilidade", "agendar", "escalar_humano"],
    "modos_identificados": ["first_contact", "scheduler"],
    "prompts_por_modo": {
      "first_contact": "...",
      "scheduler": "..."
    }
  }'::jsonb,

  business_config JSONB,  -- business_context
  compliance_rules JSONB,
  personality_config JSONB,

  -- LEGADO: system_prompt ainda existe para retrocompatibilidade
  system_prompt TEXT
);
```

#### 2.13.6 Workflow de Execução (Futuro)

Quando um lead entra em contato, o workflow de execução:

1. **Identifica o contexto**
   ```javascript
   const contexto = determinarContexto(lead);
   // "first_contact" | "scheduler" | "concierge" etc
   ```

2. **Roteia para o prompt correto**
   ```
   Switch Node
      ├─ first_contact → Set (prompt first_contact)
      ├─ scheduler → Set (prompt scheduler)
      ├─ concierge → Set (prompt concierge)
      └─ ...
           ↓
   AI Agent (recebe template + prompt dinâmico)
   ```

3. **AI Agent executa**
   ```javascript
   systemMessage: TEMPLATE_PADRAO + promptsPorModo[contexto]
   ```

#### 2.13.7 Exemplo Real de Configuração

**Clínica de Estética (kickoff analisado):**

```json
{
  "business_context": {
    "nome_clinica": "Clínica Renove",
    "especialidade": "Estética Facial",
    "servicos": ["Harmonização", "Botox", "Preenchimento"],
    "diferenciais": ["Médica com 15 anos", "Anestesia local", "Resultado natural"],
    "publico_alvo": "Mulheres 35-55 anos, classe A/B"
  },

  "compliance_rules": {
    "proibicoes": [
      "Não prometer resultados específicos",
      "Não diagnosticar por WhatsApp",
      "Não dar preços sem avaliação presencial"
    ],
    "gatilhos_escalacao": [
      "Menciona condição médica séria",
      "Pede desconto > 20%",
      "Quer agendar em < 24h"
    ]
  },

  "personality_config": {
    "tom": "acolhedor e profissional",
    "nome_agente": "Ana",
    "caracteristicas": ["empática", "detalhista", "paciente"]
  },

  "modos_identificados": ["first_contact", "scheduler", "concierge", "customer_success"],

  "prompts_por_modo": {
    "first_contact": "## OBJETIVO\n\nVocê está fazendo o primeiro contato com um lead que veio do Instagram interessado em harmonização facial.\n\n## SOBRE A CLÍNICA\n- Clínica Renove - Especializada em Estética Facial\n- Dra. Maria com 15 anos de experiência\n- Procedimentos: Harmonização, Botox, Preenchimento\n- Diferencial: Resultado natural, anestesia local, acompanhamento personalizado\n\n## ESTRATÉGIA DE QUALIFICAÇÃO\n1. Pergunte qual procedimento interessa\n2. Entenda a motivação (evento? autoestima? recomendação?)\n3. Verifique se já fez procedimentos antes\n4. Confirme faixa etária (nosso público: 35-55 anos)\n\n## COMPLIANCE\n- ❌ NÃO prometa resultados específicos\n- ❌ NÃO dê preços sem avaliação presencial\n- ❌ NÃO diagnostique por WhatsApp\n- ✅ Sempre mencione que precisa de avaliação presencial\n\n## PRÓXIMOS PASSOS\n- Se qualificado: oferecer avaliação gratuita (usar ferramenta Busca_disponibilidade)\n- Se não qualificado: agradecer e adicionar tag 'perdido'\n\n## TOM\nSeja Ana: acolhedora, empática e profissional. Mulheres vêm aqui buscando confiança - transmita segurança e cuidado.",

    "scheduler": "## OBJETIVO\n\nAgendar avaliação gratuita para lead já qualificado.\n\n## FLUXO OBRIGATÓRIO\n1. **Buscar disponibilidade** (ferramenta Busca_disponibilidade)\n   - Ofereça 3 opções de horários\n   - Manhã, tarde ou noite (pergunte preferência)\n\n2. **Confirmar dados**\n   - Nome completo\n   - Telefone (já temos)\n   - Email\n   - Procedimento de interesse\n\n3. **Criar agendamento** (ferramenta Agendar_reuniao)\n   - Confirme data/hora\n   - Envie mensagem de confirmação\n\n4. **Orientações pré-consulta**\n   - Chegar 10min antes\n   - Trazer documento com foto\n   - Mencionar que é avaliação SEM CUSTO\n\n## COMPLIANCE\n- ❌ NÃO agende sem usar a ferramenta (pode haver conflito)\n- ❌ NÃO confirme horário antes de buscar disponibilidade\n\n## TOM\nSeja eficiente mas calorosa. O lead já está convencido - agora é só facilitar o processo.",

    "concierge": "## OBJETIVO\n\nManter lead engajado entre o agendamento e o dia da consulta.\n\n## CONTEXTO\n- A clínica tem 40% de no-show histórico\n- Leads esquecem ou desistem entre agendar e comparecer\n- Seu papel: GARANTIR que ela compareça\n\n## AÇÕES\n1. **24-48h antes**\n   - Confirmar presença\n   - Relembrar orientações (chegar 10min antes, doc com foto)\n   - Perguntar se tem alguma dúvida\n\n2. **No dia (manhã)**\n   - Lembrete amigável\n   - \"Estamos ansiosas para te conhecer!\"\n\n3. **Responder dúvidas**\n   - Localização/estacionamento\n   - Duração da avaliação (~30min)\n   - Se pode levar acompanhante (sim)\n\n## SE O LEAD QUISER DESMARCAR\n- Entenda o motivo com empatia\n- Ofereça reagendar (não force)\n- Se recusar: agradeça e mantenha porta aberta\n\n## TOM\nSeja como uma amiga prestativa. Você QUER que ela venha, mas sem pressão. Cuidado e interesse genuíno.",

    "customer_success": "## OBJETIVO\n\nFechar venda do tratamento após a primeira avaliação presencial.\n\n## CONTEXTO\n- Lead já fez avaliação presencial\n- Dra. Maria já passou orçamento\n- Agora é acompanhar para fechar\n\n## ESTRATÉGIA\n1. **Primeiras 24h pós-avaliação**\n   - \"E aí, o que achou da consulta?\"\n   - Pergunte se ficou com dúvidas\n   - Relembre os benefícios que a Dra. mencionou\n\n2. **Tratar objeções comuns**\n   - Preço: \"O resultado é duradouro (6-18 meses). Vale o investimento?\"\n   - Medo: \"A Dra. tem 15 anos de experiência, anestesia local, resultado natural\"\n   - Timing: \"Quanto antes começar, antes vê resultado. Próxima disponibilidade?\"\n\n3. **Criar urgência (sem pressão)**\n   - \"Tem vaga essa semana ainda\"\n   - \"Procedimento leva 40min, resultado em 2 semanas\"\n\n## UPSELL\nSe fechar harmonização, mencione:\n- Pacote completo (economia 15%)\n- Manutenção programada\n\n## TOM\nSeja consultiva, não vendedora. Você quer o MELHOR para ela, não empurrar procedimento."
  }
}
```

#### 2.13.8 Benefícios da Arquitetura Modular

| Aspecto | Monolítico (v1.0) | Modular (v2.0) |
|---------|-------------------|----------------|
| **Tokens por execução** | ~2500 tokens | ~1000 tokens (60% economia) |
| **Clareza do prompt** | ⚠️ Confuso (tenta fazer tudo) | ✅ Específico (um objetivo por modo) |
| **Manutenção** | ❌ Mudar 1 coisa quebra tudo | ✅ Atualiza só o modo afetado |
| **Performance da IA** | ⚠️ ~70% acurácia (prompt genérico) | ✅ ~90% acurácia (prompt específico) |
| **Adaptabilidade** | ❌ Precisa recriar agente | ✅ Adiciona/remove modos facilmente |
| **Retrocompatibilidade** | N/A | ✅ Mantém system_prompt legado |

#### 2.13.9 Roadmap de Evolução

**Fase 1** ✅ (Concluída - 18/12/2025)
- [x] Workflow 03 identifica modos e gera prompts
- [x] Workflow 04 salva config modular no Supabase
- [x] Documentação atualizada

**Fase 2** ⏳ (Próximo)
- [ ] Workflow de execução com Switch + Sets dinâmicos
- [ ] Dashboard CS para visualizar modos ativos
- [ ] Testes A/B: modular vs monolítico

**Fase 3** 🔮 (Futuro)
- [ ] Auto-ajuste de modos baseado em performance
- [ ] Sugestão de novos modos pela IA
- [ ] Biblioteca de prompts pré-aprovados por nicho

---

#### Status de Implementacao Agent Factory

| Componente | Status | Observacoes |
|------------|--------|-------------|
| Call Analyzer Onboarding | ✅ v2.3 | Testado, funcionando |
| Custom Object Agentes | ✅ Pronto | 10 campos (falta: nome_agente, cliente_nome) |
| Custom Object Revisoes | ✅ Pronto | 7 campos (falta: agente_id para link) |
| Tabela clients | ✅ Pronto | Supabase CEO |
| Tabela agent_versions | ✅ Pronto | Supabase CEO - novas colunas: status, contact_id, location_id |
| Tabela agent_metrics | ✅ Pronto | Supabase CEO |
| Tabela agent_conversations | ✅ Pronto | Supabase CEO |
| Tabela prompt_change_requests | ✅ Pronto | Supabase CEO - registra todas as mudancas |
| Workflow Agent Factory | ✅ v1.0 | Testado e funcionando |
| AI Agent Conversacional | ✅ v1.0 | Testado - falta habilitar Always Output Data no Salvar Conversa |
| Call Analyzer Revisao | ✅ v2.0 | Framework PDCA, cria versao pending_approval |
| Engenheiro de Prompt | ✅ v1.0 | 7 comandos via webhook, AI aplica mudancas |

---

### 2.11 Webhooks e Endpoints

#### n8n (self-hosted)

| Webhook | URL Base | Funcao |
|---------|----------|--------|
| Assembly Line | `https://n8n.mottivme.com.br/webhook/assembly-line` | Recebe briefings, dispara geracao |
| Propostal Score | `https://n8n.mottivme.com.br/webhook/propostal-score` | Recebe score de interesse |
| MIS Sentinel | `https://n8n.mottivme.com.br/webhook/mis-alert` | Recebe alertas de sentimento |
| GHL Contact Update | `https://n8n.mottivme.com.br/webhook/ghl-contact` | Atualiza contato via API |
| Engenheiro de Prompt | `https://n8n.mottivme.com.br/webhook/engenheiro-prompt` | Ajustes em prompts (7 comandos) |
| AI Agent Webhook | `https://n8n.mottivme.com.br/webhook/ai-agent/webhook` | Recebe mensagens para agente IA |

> **Nota**: URLs exatas dependem da configuracao do n8n. Verificar em Configuracoes > Execucoes.

#### GHL Webhooks (recebendo)

| Evento | Endpoint n8n | Funcao |
|--------|--------------|--------|
| Contact Created | `/webhook/ghl-contact-created` | Inicia fluxo de qualificacao |
| Appointment Scheduled | `/webhook/ghl-appointment` | Atualiza pipeline, agenda lembrete |
| Opportunity Won | `/webhook/ghl-opp-won` | Dispara onboarding, feedback loop |
| Opportunity Lost | `/webhook/ghl-opp-lost` | Atualiza resultado_real, dispara analise |

#### Supabase Edge Functions

| Function | Endpoint | Funcao |
|----------|----------|--------|
| `deploy-agent` | `/functions/v1/deploy-agent` | Ativa versao do agente |
| `calculate-metrics` | `/functions/v1/calculate-metrics` | Agrega metricas diarias |
| `generate-report` | `/functions/v1/generate-report` | Gera relatorio de performance |

---

### 2.13 Assistente IA Executiva (Sofia)

> Documentacao completa: `/PASTA MESTRE - GUIA MOTTIVME/ASSISTENTE-IA-EXECUTIVA-N8N.md`

#### O que e

Sistema de assistente pessoal com IA que combina **modo ativo (proativo)** e **modo passivo (reativo)** para maximizar a produtividade do CEO atraves de accountability inteligente.

#### Funcionalidades Principais

**MODO ATIVO (Proativo):**
```
08:00 - Morning Routine
  → Apresenta tarefas do Monday.com
  → Forca escolha de 3 tarefas INEGOCIAVEIS do dia
  → Lembra meta de 90 dias e proposito

12:00 - Noon Check-in
  → Status das 3 inegociaveis
  → Lembra deadline (faltam 6h)

15:00 - Afternoon Alert
  → Alerta de urgencia (faltam 3h)
  → Se tarefa critica pendente → pressao

18:00 - Evening Review
  → Review do dia
  → Calcula score (0-100)
  → Celebra vitorias ou motiva para amanha
```

**MODO PASSIVO (Reativo):**
- Responde comandos via WhatsApp
- Ações: marcar concluida, adicionar tarefa, buscar status, motivacao

#### Arquitetura

| Workflow | Trigger | Funcao |
|----------|---------|--------|
| **Gatilhos Ativos** | Cron (8h, 12h, 15h, 18h) | Envia mensagens proativas |
| **WhatsApp Inbox** | Webhook (Evolution API) | Processa comandos do CEO |
| **Monday Sync** | Cron (07:00 diario) | Sincroniza tarefas do Monday |

#### Schema Supabase (Projeto CEO)

**Tabela: assistente_tasks**
```sql
CREATE TABLE assistente_tasks (
  id SERIAL PRIMARY KEY,
  monday_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  is_critical BOOLEAN DEFAULT FALSE, -- 3 inegociaveis
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Tabela: assistente_interactions**
```sql
CREATE TABLE assistente_interactions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL, -- 'proactive' ou 'reactive'
  trigger_type TEXT, -- 'morning', 'noon', etc.
  message_sent TEXT,
  response_received TEXT,
  action_executed JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tabela: assistente_objectives**
```sql
CREATE TABLE assistente_objectives (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL, -- 'meta_90_dias', 'missao', 'valores'
  content TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tabela: assistente_daily_state**
```sql
CREATE TABLE assistente_daily_state (
  date DATE PRIMARY KEY,
  tasks_total INTEGER DEFAULT 0,
  tasks_critical INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  critical_completed INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0, -- Score do dia (0-100)
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tabela: assistente_scheduled_messages**
```sql
CREATE TABLE assistente_scheduled_messages (
  id SERIAL PRIMARY KEY,
  scheduled_for TIMESTAMP NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Integracoes

| Servico | Uso | Credencial |
|---------|-----|------------|
| Monday.com | Gestao de tarefas | API token (ver CREDENCIAIS-MASTER.md) |
| Claude AI | Processamento conversacional | Anthropic API key |
| Evolution API | WhatsApp | Webhook + API |
| PostgreSQL | Persistencia | Supabase CEO |
| osascript | Notificacoes Desktop (macOS) | Nativo |

#### Status de Implementacao

| Componente | Status | Observacoes |
|------------|--------|-------------|
| Schema DB | 🔨 A criar | 5 tabelas definidas |
| Workflow Gatilhos Ativos | 🔨 A criar | Cron jobs (4 horarios) |
| Workflow WhatsApp Inbox | 🔨 A criar | Webhook + Claude AI |
| Workflow Monday Sync | 🔨 A criar | Cron diario 07:00 |
| Integracao Monday.com | ✅ Pronto | Token disponivel |
| Integracao Evolution API | 🔨 A configurar | - |

#### Comandos Reconhecidos (WhatsApp)

```yaml
Marcar concluida:
  - "Concluí [tarefa]"
  - "Terminei [tarefa]"
  - "[ACTION:COMPLETE_TASK:monday_id]"

Adicionar tarefa:
  - "Adiciona [titulo]"
  - "Preciso fazer [titulo]"
  - "[ACTION:ADD_TASK:titulo]"

Status:
  - "Como estou hoje?"
  - "Qual o score?"
  - "Mostra meu progresso"

Motivacao:
  - "Me lembra porque estou fazendo isso"
  - "Por que isso importa?"
  - "[ACTION:GET_MOTIVATION]"
```

#### Calculo de Score Diario

```
Score = (critical_completed / 3) * 70 + (tasks_completed / tasks_total) * 30

Exemplo:
- 3 inegociaveis completas + 5 de 10 tarefas totais
- Score = (3/3)*70 + (5/10)*30 = 70 + 15 = 85
```

#### Workflow de Decisao (Morning Routine)

```
1. Busca todas as tarefas do Monday (status != done)
2. Exibe lista completa
3. Marcos escolhe 3 tarefas inegociaveis
4. IA persiste escolha (is_critical = TRUE)
5. Durante o dia, alertas focam nessas 3
6. A noite, score baseado nessas 3 (peso 70%)
```

---

## 3. INVENTARIO COMPLETO DE ATIVOS

### 3.1 Fluxos n8n - MKT/Vendas
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/Fluxos n8n/Fluxos BASE - n8n do BPO da mottivme/2. MKT:Vendas/`

#### 1. Marketing
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [Meta Ads System - 1. Reference Ad Scraper](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/1.%20Meta%20Ads%20System%20-%201.%20Reference%20Ad%20Scraper%20(2).json) | Scrapa anuncios de concorrentes via Meta Ad Library | Pronto |
| [Meta Ads System - 1b. Import Scraped Ads](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/2.%20Meta%20Ads%20System%20-%201b.%20Import%20Scraped%20Ads%20to%20Generated%20Ads%20(2).json) | Importa ads para geracao de novos criativos | Pronto |
| [Image Generation - Fixed](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/Image%20Generation%20-%20Fixed%20(1).json) | Geracao de imagens via IA | Pronto |
| [video_generator](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/video_generator%20(1).json) | Geracao de videos | Pronto |
| [SEO Content Generation System](1.%20Marketing/SEO%20Content%20Generation%20System%20-%20V1%20Skool%20(1).json) | Sistema completo de geracao de conteudo SEO | Pronto |
| [Social Media Scheduling - LinkedIn](1.%20Marketing/Social%20Media%20Scheduling%20-%20Blotato%20__%20For%20Viral%20LinkedIn%20Posts%20(n8n)%20-%20Skool%20Paid%20(1).json) | Agendamento de posts virais LinkedIn | Pronto |
| [Assembly line APP](1.%20Marketing/Assemblyline%20/Assembly%20line%20APP.json) | App de criacao de conteudo | Pronto |
| [VSL](1.%20Marketing/Assemblyline%20/VSL.json) | Geracao de VSL | Pronto |

#### 2. Pre-Vendas
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [GHL - Mottivme - EUA - COM REAGENDAMENTO - COM TOKEN TRACKING v2](2.%20Pré%20Vendas/GHL%20-%20Mottivme%20-EUA%20-%20COM%20REAGENDAMENTO%20-%20COM%20TOKEN%20TRACKING%20v2.json) | Agente SDR principal com tracking | Pronto |
| [GHL-REAGENDAMENTO-NOSHOW-COM-IA](2.%20Pré%20Vendas/GHL-REAGENDAMENTO-NOSHOW-COM-IA.json) | Recuperacao de no-show | Pronto |
| [Follow Up Eterno](2.%20Pré%20Vendas/[%20GHL%20]%20Follow%20Up%20Eterno.json) | Follow-up automatizado | Pronto |
| [Lead Gen Army V3](2.%20Pré%20Vendas/Inteligência%20Comercial/Lead%20Gen%20Army%20V3%20-%20LIVE%20(1).json) | Geracao de leads | Pronto |
| **Email MKT/** | Sistema completo de cold email | |
| - Lead_Scraping_2_0 | Scraping de leads | Pronto |
| - Email_Preparation | Preparacao de emails | Pronto |
| - Email_1/2/3_T2 | Sequencias de email | Pronto |
| **Tools Agentes SDR/** | Ferramentas auxiliares | |
| - MCP - Historias Clientes | Historias de sucesso | Pronto |
| - Contador de Tentativas de Objecao | Tracking de objecoes | Pronto |
| - Verificar agendamento existente | Checagem de agenda | Pronto |
| - Atualizar Estado/Work Permit/Profissao GHL | Atualizacao de campos | Pronto |

#### 3. Vendas
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [AI Agent - Head de Vendas](3.%20Vendas/AI%20Agent%20-%20Head%20de%20Vendas.json) | **CORE** - Analisa calls de vendas, da scores BANT/SPIN, probabilidade de fechamento | Pronto |
| [Gerar PDF Proposta BPOSS](3.%20Vendas/Gerar%20PDF%20Proposta%20BPOSS.json) | Geracao automatica de propostas | Pronto |
| [CS Call Analyzer - Mottivme](3.%20Vendas/CS%20Call%20Analyzer%20-%20Mottivme.json) | Analisador de calls CS | Em desenvolvimento |
| [ADMIN - Geracao de notas de reuniao](3.%20Vendas/ADMIN%20-%20Geração%20de%20notas%20de%20reunião%20a%20partir%20de%20arquivos%20e%20do%20TimeOS.json) | Notas automaticas | Pronto |

#### 4. Orquestracao (NOVO)
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| Monitor-Pasta-Calls | Monitora /7. Calls/, detecta arquivos novos, move para subpasta correta, dispara workflow | 🔨 A criar |
| Call-Analyzer-Onboarding | Analisa call de Kickoff, extrai contexto, gera config de agente | 🔨 A criar |
| Call-Analyzer-Revisao | Analisa call de Acompanhamento, framework PDCA, gera DIFF | 🔨 A criar |
| Feedback-Loop-Oportunidade | Quando opp fecha (ganho/perdido), atualiza resultado_real | 🔨 A criar |

#### 5. Infra
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [Inserir Lead Insights - V2](5.%20Infra/Inserir%20Lead%20Insights%20-%20V2%20(Melhorado).json) | Enriquecimento de leads | Pronto |
| [ADMIN - Backup N8N to GDrive](5.%20Infra/ADMIN%20-%20Backup%20N8N%20to%20GDrive.json) | Backup automatico | Pronto |
| [Airtable Integration](5.%20Infra/Airtable%20Integration%20-%20CORRIGIDO%20(1).json) | Integracao Airtable | Pronto |

#### 6. Pos-Venda
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [MIS - V3](6.%20Pós%20Venda/MIS%20-%20V3.json) | Sistema de monitoramento | Pronto |
| [Facebook Ads Daily Report](6.%20Pós%20Venda/Facebook%20Ads%20Daily%20Report%20-%20CORRIGIDO.json) | Relatorios diarios de ads | Pronto |
| [Customer Service AI Bot](6.%20Pós%20Venda/Customer%20Service%20AI%20Bot%20-%20Complete.json) | Bot de atendimento CS | Pronto |
| [MIS - Auto Response to Critical Issues](6.%20Pós%20Venda/MIS%20-%20Auto%20Response%20to%20Critical%20Issues%20(READY).json) | Resposta automatica a issues criticos | Pronto |

#### Sistema Secretaria Base
**O que e**: Sistema completo de atendimento automatizado via WhatsApp para clinicas.
**Funcao**: Substitui secretaria humana para agendamentos, lembretes, recuperacao de leads e escalacao.
**Integracao**: Usa Socialfy como backend de dados.

> **Nota**: O dominio `cliente-a1.mentorfy.io` que aparece em alguns webhooks e infraestrutura legada/compartilhada. MentorFy nao e mais produto da Mottivme.

| Arquivo | Descricao |
|---------|-----------|
| [00. Configuracoes](Secretária%20Base/00.%20Configurações.json) | Configuracoes base |
| [01. Secretaria](Secretária%20Base/01.%20Secretária.json) | Agente principal |
| [02. Baixar e enviar arquivo do Google Drive](Secretária%20Base/02.%20Baixar%20e%20enviar%20arquivo%20do%20Google%20Drive.json) | Gestao de arquivos |
| [03. Busca Disponibilidade v3](Secretária%20Base/03.%20[%20Socialfy%20]%20Busca%20Disponibilidade%20v3.json) | Busca de horarios |
| [04. Agendar](Secretária%20Base/04.%20[%20Socialfy%20]%20Agendar.json) | Agendamento |
| [05. Escalar para humano](Secretária%20Base/05%20-%20Escalar%20para%20humano%20-%20SOCIALFY.json) | Escalacao |
| [06.1 Integracao Supabase](Secretária%20Base/06.1%20Integração%20Supabase.json) | Persistencia |
| [07. Quebrar e enviar mensagens](Secretária%20Base/07.%20Quebrar%20e%20enviar%20mensagens.json) | Envio de mensagens |
| [08. Agente Assistente Interno](Secretária%20Base/08.%20%20Agente%20Assistente%20Interno%20(3).json) | Assistente interno |
| [09. Desmarcar e enviar alerta](Secretária%20Base/09.%20Desmarcar%20e%20enviar%20alerta.json) | Cancelamentos |
| [10. Buscar ou criar contato + conversa](Secretária%20Base/10.%20Buscar%20ou%20criar%20contato%20+%20conversa.json) | Gestao de contatos |
| [11. Agente de Lembretes de Agendamento](Secretária%20Base/11.%20Agente%20de%20Lembretes%20de%20Agendamento.json) | Lembretes |
| [12. Gestao de ligacoes](Secretária%20Base/12.%20Gestão%20de%20ligações.json) | Gestao de calls |
| [13. Agente de Recuperacao de Leads](Secretária%20Base/13.%20Agente%20de%20Recuperação%20de%20Leads%20(1).json) | Recuperacao |
| [Prompt da Secretaria.md](Secretária%20Base/Prompt%20da%20Secretária.md) | Prompt base |

---

### 3.2 Projeto ghl-agency-ai
**Pasta**: `/GO HI LEVEL PASTA DE INFOS GERAIS/ghl-agency-ai/`

| Funcionalidade | Descricao | Arquivos Relevantes |
|----------------|-----------|---------------------|
| **Lead Enrichment (Apify)** | Enriquece leads com LinkedIn, cargo, empresa, telefone, confidence score | `LEAD_ENRICHMENT_QUICK_START.md` |
| **Meta Ads Manager (GPT-4 Vision)** | Analisa screenshots de ads, gera recomendacoes, cria variacoes de copy | `META_ADS_IMPLEMENTATION_SUMMARY.md` |
| **Browser Automation (Browserbase)** | Automacao de browser para acoes que API nao permite | `BROWSERBASE_GHL_SETUP.md` |
| **AI Hooks (useAI.ts)** | Hooks React para chat, observe, extract, multi-tab | `client/src/hooks/useAI.ts` |

---

### 3.3 SAAS / Aplicacoes Web
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/SAAS/`

| # | Projeto | Descricao | Stack | Status |
|---|---------|-----------|-------|--------|
| 1 | **mottivme-sales-calculator** | Calculadora de vendas e projecoes | Next.js 15 + shadcn + Recharts | Pronto |
| 2 | **Assembly Line** | Sistema de automacao de estrategia de marketing | Next.js 14 + Supabase + Airtable + n8n | Em desenvolvimento |
| 3 | **Dashboard-Mottivme-Sales** | Dashboard de vendas com graficos e metricas | Next.js 15 + Supabase + Recharts | Pronto |
| 4 | *(duplicado do 1)* | - | - | - |
| 5 | **mottivme-command-center** | Central de comando com planejador de vendas e comparativo | Next.js 16 + Supabase | Pronto |
| 6 | **invoice-generator-app** | Gerador de faturas, gestao de clientes, transacoes, relatorios | Next.js 15 + Supabase + jsPDF | Pronto |
| 7 | **Projeto total** | (pasta de organizacao) | - | - |
| 8 | **MIS-SENTINEL** | (versao antiga) | - | Deprecado |
| 9 | **Socialfy** | CRM e plataforma de gestao de relacionamento | Vite + React 19 + Supabase | Pronto |
| - | **MIS Sentinel** | Sistema de inteligencia para monitoramento de WhatsApp | Next.js 14 + Supabase + Gemini AI | Pronto |

#### Detalhes Assembly Line
- **Stack**: Next.js 14 + TypeScript + Supabase + Airtable + n8n
- **Fases**: F1A Clone, F1B Posicionamento, F2 Ecossistema, F3A Marketing, F4 Scripts, F5 Calendario
- **Outputs gerados (15 tipos)**: Clone de referencia, avatar, ofertas, scripts VSL, posts, reels, carrosseis, stories, calendario editorial, etc.
- **Planos**: Starter R$197 (1 proj, 100 cred) | Pro R$497 (5 proj, 500 cred) | Agency R$997 (ilimitado, 2000 cred)
- **Workflow n8n**: 29.640 linhas
- **Status**: Em desenvolvimento (falta API routes, steps briefing, pages projeto)
- **Deploy**: https://vercel.com/marcosdanielsfs-projects/v0-pointer-ai-landing-page

#### Detalhes MIS Sentinel
- **O que e**: Dashboard de IA para monitoramento de mensagens WhatsApp
- **Funcionalidades**:
  - Analise de sentimento (positivo, neutro, negativo, urgente)
  - Deteccao de padroes e geracao de alertas automaticos
  - Score de urgencia (0-10) por mensagem
  - Dashboard de equipe com performance individual
  - Workflow de resolucao: Reconhecer → Resolver
- **Integracao**: n8n captura WhatsApp → Gemini AI analisa → Supabase armazena → Dashboard exibe
- **Tipos de Alerta**: urgent_request, technical_issue, automation_opportunity, bottleneck, milestone, pattern_detected

#### Detalhes mottivme-command-center
- **O que e**: Central de comando para gestao de vendas
- **Paginas**:
  - `/dashboard-comparativo` - Comparativo de metricas
  - `/sales-planner` - Planejador de vendas
- **Stack**: Next.js 16 + React 19 + Supabase + Tailwind 4

#### Detalhes invoice-generator-app
- **O que e**: Sistema completo de faturamento
- **Paginas**:
  - `/clients` - Gestao de clientes
  - `/invoice` - Criar/editar faturas
  - `/history` - Historico de faturas
  - `/transactions` - Transacoes financeiras
  - `/reports` - Relatorios
  - `/settings` - Configuracoes
- **Stack**: Next.js 15 + Supabase + jsPDF + html2canvas

#### Detalhes Socialfy
- **O que e**: Plataforma de CRM propria da Mottivme
- **Integracao**: Backend para sistema Secretaria Base (workflows 03-10)
- **Stack**: Vite + React 19 + Supabase + Tailwind 4 + Recharts

---

### 3.4 Sexy Canvas / Eletrificacao (Frameworks de Vendas)
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/SAAS/`

> **Base**: Metodologia Sexy Canvas de Andre Diamand - 14 gatilhos emocionais para "eletrificar" comunicacoes de vendas.

#### Arquivos de Documentacao
| Arquivo | Descricao |
|---------|-----------|
| [VSL-SCRIPT-COMPLETO.md](n8n-workspace/SAAS/VSL-SCRIPT-COMPLETO.md) | Script completo de VSL 12-15 min para Mottivme |
| [MAPA-ELETRIFICACAO.md](n8n-workspace/SAAS/MAPA-ELETRIFICACAO.md) | Framework visual: jornada em 5 fases (INTRO→WARN→EVOL→LOGIN→PROP) |
| [SISTEMA-ELETRIFICACAO-TOTAL.md](n8n-workspace/SAAS/SISTEMA-ELETRIFICACAO-TOTAL.md) | Aplicacao dos gatilhos em TODOS touchpoints de venda |
| [SUPER-PROMPT-SEXY-CANVAS.md](n8n-workspace/SAAS/SUPER-PROMPT-SEXY-CANVAS.md) | Super prompt para agentes IA aplicarem metodologia |

#### Os 14 Gatilhos do Sexy Canvas
**Bloco 1 - 7 Pecados Capitais (Desejos Primitivos):**
1. Vaidade - Sentir-se superior, exclusivo
2. Avareza - Maximizar ganhos, ROI
3. Luxuria - Desejo por coisas caras, premium
4. Inveja - Querer o que outros tem
5. Gula - Querer mais e mais (abundancia)
6. Preguica - Facilidade, minimo esforco
7. Ira - Raiva contra vilao comum

**Bloco 2 - 7 Elementos da Crianca Interior (Emocoes de Conforto):**
8. Amor - Conexao emocional, personalizacao
9. Curiosidade - Loops abertos, misterio
10. Diversao - Gamificacao, surpresas
11. Liberdade - Autonomia, escolha
12. Pertencimento - Comunidade, tribo
13. Recompensa - Bonus surpresa, presentes
14. Seguranca - Garantias, provas sociais

#### sexy-canvas-system/
**Pasta**: `/n8n-workspace/SAAS/sexy-canvas-system/`
- **O que e**: Sistema completo de portais de proposta imersiva
- **Subpastas**:
  - `portal-v2/` - Portal de proposta com 5 fases, animacoes, audio
  - `portal-ultimate/` - Versao avancada
  - `pitch-deck/` - Apresentacoes
- **Recursos**: Cursor customizado, particulas, voz robotica, Konami Code (easter egg)
- **Credenciais padrao**: login=`[nome-cliente]`, senha=`UltraVertex`

---

### 3.5 mottivme-platform (Monorepo SaaS)
**Pasta**: `/n8n-workspace/SAAS/mottivme-platform/`
- **Stack**: Next.js 15 + TypeScript + Tailwind + Supabase + OpenAI + Turborepo
- **Deploy**: Vercel

| App | Descricao | Porta Dev |
|-----|-----------|-----------|
| **Propostal** (`apps/propostal`) | SaaS de propostas interativas com rastreamento de comportamento, score de interesse 0-100, chat com IA (Luna) | :3000 |
| **Eletrify** (`apps/eletrify`) | SaaS de geracao de copy usando metodologia Sexy Canvas (posts, headlines, VSL, emails) | :3001 |

**Funcionalidades Propostal:**
- Portais de proposta interativos
- Rastreamento em tempo real
- Score de interesse (0-100)
- Chat com IA (Luna)
- Alertas quando lead esta quente
- Dashboard de metricas

**Funcionalidades Eletrify:**
- Gerador de Copy (posts, headlines, hooks)
- Gerador de Emails
- Gerador de VSL
- Analisador de Copy
- 14 gatilhos emocionais integrados

---

### 3.6 propostal/ (Portal Standalone)
**Pasta**: `/n8n-workspace/SAAS/propostal/`
- **O que e**: Versao standalone do portal de propostas
- **Arquivos**:
  - `index.html` - Portal de entrada
  - `proposal.html` - Proposta interativa
  - `ARCHITECTURE.md` - Arquitetura tecnica completa
  - `CLAUDE.md` - Contexto para IA
- **Integracao**: Supabase + Stripe + n8n + HeyGen (Avatar AI) + OpenAI

---

### 3.7 Strategy 2026
**Pasta**: `/MOTTIVME SALES TOTAL/Mottivme Strategy 2026/`

| Item | Descricao |
|------|-----------|
| **03-Sales-Assets/** | Assets de vendas |
| - Case-Studies/ | Casos de sucesso |
| - Propostas/ | Templates de propostas |
| - Landing-Pages/experience-portal/ | Portal de experiencia |
| **_workspace/prompts/** | Prompts de IA |
| **_workspace/workflows/** | Workflows adicionais |

---

## 4. MELHORIAS PLANEJADAS (ROADMAP)

### 4.1 PRIORIDADE P0 (Esta Semana - ~13h)

> **CRITICALIDADE MAXIMA** - Bloqueia implementacao completa do sistema

#### 4.1.1 Custom Object: Objecoes (3h)
**Status:** 🔴 Nao iniciado
**Modulo:** Vendas

```yaml
Funcionalidade:
  - Armazena objecoes detectadas em vendas, renovacao, cancelamento
  - Rastreia status (detectada, tratada, persistente)
  - Alimenta dashboard de objecoes mais comuns

Campos necessarios:
  - tipo (texto, preco, timing, marido, medo)
  - intensidade (baixa, media, alta)
  - contexto (venda, renovacao, cancelamento) <- CAMPO CRITICO
  - status (detectada, tratada, persistente)
  - proxima_acao (texto)
  - data_deteccao (datetime)
  - data_resolucao (datetime)

Associacao: Contact -> Objecoes (1:N)
```

#### 4.1.2 Feedback Loop Oportunidade (2h)
**Status:** 🔴 Nao iniciado
**Modulo:** Vendas

```yaml
Arquivo: workflows/feedback-loop-oportunidade.json
Trigger: Webhook GHL (opportunity.status_change)
Funcionalidade:
  - Quando oportunidade fecha (ganho/perdido)
  - Busca analise de call associada
  - Atualiza campo resultado_real
  - Calcula diferenca entre probabilidade_prevista vs resultado_real
  - Registra para calibracao da IA

Campos novos em analises_de_call:
  - resultado_real (ganho/perdido)
  - data_resultado
  - delta_previsao (diferenca entre previsao e resultado)
```

#### 4.1.3 Agent Factory v2.0 (3h)
**Status:** 🟡 v1.0 funcionando - v2.0 a criar
**Modulo:** Onboarding

```yaml
Melhorias v1.0 -> v2.0:
  - Validacao de campos obrigatorios (nao criar agente incompleto)
  - Testes automatizados: enviar mensagem teste, validar resposta
  - Rollback automatico: se teste falhar, nao ativar
  - Notificacao detalhada: sucesso com metricas / falha com logs
  - Versionamento semantico: v1.0, v1.1, v2.0

QA incluido:
  - Verifica se system_prompt existe
  - Testa 3 mensagens padrao
  - Valida latencia < 3s
  - Confirma tone/compliance
```

#### 4.1.4 AI Agent Conversacional v2.0 (2h)
**Status:** 🟡 v1.0 funcionando - v2.0 a criar
**Modulo:** Operacao

```yaml
Melhorias v1.0 -> v2.0:
  - Sempre salvar historico (Always Output Data = TRUE)
  - Deteccao de loops: se 3x mesma resposta -> escala
  - Timeout inteligente: se usuario nao responde 2h -> pausa conversa
  - Metricas em tempo real: latencia, tokens, satisfacao

Sistema integrado ao workflow (nao node separado)
```

#### 4.1.5 QA Analyst (3h)
**Status:** 🔴 Nao iniciado
**Modulo:** Operacao (NOVO)

```yaml
Arquivo: workflows/qa-analyst.json
Trigger: Cron (a cada 1h) + Webhook (pos-conversa)
Funcionalidade:
  - Busca ultimas 50 conversas do agente
  - Para cada conversa, IA analisa:
    * Nota de qualidade (0-10)
    * Objecoes nao tratadas
    * Loops detectados
    * Tempo de resposta excessivo
  - Se nota < 6 -> Alerta WhatsApp CS
  - Se objecao recorrente -> Sugere melhoria no prompt
  - Salva analise em agent_qa_logs

Tabela Supabase: agent_qa_logs
  - conversation_id
  - agent_version_id
  - nota_qualidade (0-10)
  - problemas_detectados (JSONB)
  - sugestoes_melhoria (TEXT)
  - alertado_cs (BOOLEAN)
```

**Total P0:** 13h

---

### 4.2 PRIORIDADE P1 (Semanas 2-3 - ~17h)

#### 4.2.1 Sistema de Onboarding Automatizado (8h)
**Status:** 🔴 Nao iniciado
**Modulo:** Novo modulo completo

```yaml
Objetivo:
  - Reduzir churn nos primeiros 30 dias
  - Garantir implementacao correta
  - Acompanhamento ativo da agencia

Componentes:

1. Score de Implementacao (0-100 pontos)
   Criterios:
     - Agente ativo: 20 pts
     - Primeiro agendamento feito pelo agente: 15 pts
     - 10 conversas completas: 15 pts
     - Taxa de resolucao > 70%: 15 pts
     - Sem escalacoes criticas: 10 pts
     - Cliente respondeu pesquisa satisfacao: 10 pts
     - Revisor de prompt configurado: 10 pts
     - Integracao calendario funcionando: 5 pts

2. Tracker de Score (workflow)
   - Atualiza score diariamente
   - Salva em tabela onboarding_score_history
   - Gera alertas quando score < 50

3. Follow-up em Niveis
   Nivel 1 (Score 0-30): CRITICO
     - Stevo entra em contato URGENTE
     - Call de alinhamento em 24h
     - Checklist de bloqueios

   Nivel 2 (Score 31-60): ATENCAO
     - WhatsApp automatico diario
     - Tutorial especifico do problema
     - CS monitora evolucao

   Nivel 3 (Score 61-80): ACOMPANHAMENTO
     - WhatsApp 2x semana
     - Dicas de otimizacao

   Nivel 4 (Score 81-100): EXCELENCIA
     - Case study (pedir autorizacao)
     - Oferecer upgrade/cross-sell

4. Kickstart Automatico
   - Dia 0: Boas vindas + Checklist
   - Dia 1: Tutorial configuracao
   - Dia 3: Primeira call de acompanhamento
   - Dia 7: Review de metricas
   - Dia 15: Ajustes finos
   - Dia 30: Call de celebracao + upsell
```

#### 4.2.2 Assistente IA Executiva (Sofia) - Completa (9h)
**Status:** 🟡 Documentado - Aguardando implementacao
**Modulo:** Gestao CEO

```yaml
Componentes (ver secao 2.13):
  - Schema DB (5 tabelas): 1h
  - Workflow Gatilhos Ativos: 3h
  - Workflow WhatsApp Inbox: 3h
  - Workflow Monday Sync: 1h
  - Testes end-to-end: 1h
```

**Total P1:** 17h

---

### 4.3 PRIORIDADE P2 (Semana 4 - ~17h)

#### 4.3.1 Dashboard Cliente - MVP (8h)
**Status:** 🔴 Nao iniciado
**Modulo:** Produto

```yaml
Objetivo: Cliente ve metricas do proprio agente em tempo real

Paginas:
  1. Overview
     - Conversas totais
     - Taxa de resolucao
     - Satisfacao media
     - Agendamentos gerados

  2. Conversas Recentes
     - Ultimas 20 conversas
     - Highlights (objecoes tratadas, agendamentos)

  3. Performance
     - Grafico: conversas/dia (ultimos 30d)
     - Grafico: taxa resolucao
     - Comparativo com benchmark

Stack: Next.js + Supabase + Recharts
Autenticacao: Clerk (email + senha por cliente)
Deploy: Vercel
```

#### 4.3.2 Call Analyzer Suporte (3h)
**Status:** 🔴 Nao iniciado
**Modulo:** Operacao

```yaml
Arquivo: workflows/call-analyzer-suporte.json
Trigger: Google Drive folder (/7. Calls/4. Suporte/)
Funcionalidade:
  - Analisa calls de suporte
  - Categoriza tipo de issue (tecnico, duvida, reclamacao)
  - Identifica bugs recorrentes
  - Sugere melhorias no agente
  - Cria Custom Object "Analises de Call" tipo=suporte
```

#### 4.3.3 Testes End-to-End Completos (6h)
**Status:** 🔴 Nao iniciado
**Modulo:** QA

```yaml
Cenarios de Teste:
  1. Fluxo Vendas Completo
     - Lead entra -> SDR qualifica -> Call -> Analise -> Fechamento

  2. Fluxo Onboarding Completo
     - Kickoff -> Agent Factory -> Deploy -> Primeira conversa

  3. Fluxo Revisao Completo
     - Call acompanhamento -> Analise PDCA -> Nova versao -> Aprovacao

  4. Fluxo Assistente CEO
     - Morning routine -> Escolha 3 inegociaveis -> Evening review

  5. Edge Cases
     - Call sem contato no GHL
     - Agente com prompt vazio
     - Duplicata de analise
     - Webhook falha

Documentacao: `/tests/END_TO_END_TEST_PLAN.md`
```

**Total P2:** 17h

---

### 4.4 PRIORIDADE P3 (Mes 2+ - ~25h)

#### 4.4.1 Call Analyzer Churn (3h)
**Status:** 🔴 Nao iniciado
**Modulo:** Retencao

```yaml
Arquivo: workflows/call-analyzer-churn.json
Trigger: Google Drive folder (/7. Calls/5. Churn/)
Funcionalidade:
  - Analisa call de alinhamento/cancelamento
  - Identifica motivo principal do churn
  - Classifica: recuperavel / irrecuperavel
  - Sugere oferta de retencao
  - Alimenta dashboard de churn reasons
  - Cria registro em tabela churn_reasons
```

#### 4.4.2 Dashboard de Objecoes Agregadas (8h)
**Status:** 🔴 Nao iniciado
**Modulo:** Inteligencia de Produto

```yaml
Objetivo: Transformar objecoes em insights acionaveis

Visoes:
  1. Top 10 Objecoes (ultimos 30d)
  2. Correlacao: Objecao X Resultado (ganho/perdido)
  3. Objecao X Origem do Lead (ads, organico, indicacao)
  4. Objecao X Ticket (alto/medio/baixo)
  5. Timeline: Como objecoes mudam ao longo do tempo

Acao Automatica:
  - Se objecao nova aparece 5x em 7 dias -> Alerta vendas
  - Alimenta Assembly Line para gerar novos criativos
  - Sugere ajustes em VSL/copy
```

#### 4.4.3 Artilharia Nuclear (14h)
**Status:** 🔴 Nao iniciado
**Modulo:** Vendas Avancado

```yaml
Objetivo: Recuperar oportunidades perdidas com IA

Trigger: Oportunidade marcada como PERDIDA

Fluxo:
  1. Aguarda 7 dias (cooling period)
  2. IA analisa:
     - Motivo da perda
     - Historico de conversas
     - Objecoes nao tratadas
     - Perfil do lead
  3. Gera estrategia personalizada:
     - Se objecao = preco -> Oferta especial limitada
     - Se objecao = timing -> Follow-up em 30/60/90 dias
     - Se objecao = marido -> Conteudo educativo para compartilhar
  4. Dispara sequencia automatizada:
     - Email personalizado
     - WhatsApp com case relevante
     - Video VSL customizado
  5. Tracking de reconquista:
     - Salvou opp? -> Marca como "recuperado via IA"
     - Nao respondeu? -> Arquivo definitivo

Metricas:
  - Taxa de recuperacao
  - ROI (custo IA vs valor recuperado)
```

#### 4.4.4 Hiperpersonalizacao Regional - Rapport em Escala (6h)
**Status:** 🔴 Nao iniciado
**Modulo:** AI Conversacional Avancado

```yaml
Objetivo: IA detecta localizacao do lead e usa referencias culturais para criar conexao

Arquitetura:
  1. Base de Conhecimento Regional (implementacao rapida)
     - Adicionar secao no system_prompt com referencias por regiao
     - Brasil: sotaques (MG = uai/so, RJ = mano, RS = tche, Nordeste = oxente)
     - EUA: cidades principais (Orlando = Disney/comunidade BR, Boston = Framingham)

  2. Tool "Buscar_Referencias_Regionais" (medio prazo)
     - Tabela Supabase: referencias_regionais
     - Campos: location, tipo, referencias (JSONB), exemplo_uso, tom
     - Input: cidade/estado → Output: 3-5 referencias culturais

  3. Extracao Automatica no Kickoff (longo prazo)
     - Call Analyzer Onboarding extrai:
       * Origem Brasil (cidade/estado)
       * Localidade atual EUA
       * Referencias culturais mencionadas
     - Gera "cultural_profile" no agent_config
     - Agent Factory cria "modo rapport" personalizado

Exemplos de Uso:
  - Lead de BH → "Uai so! BH e bom demais! Saudades de pao de queijo, ne?"
  - Lead em Orlando → "Orlando e show! Conhece a galera brasileira da regiao dos parques?"
  - Lead gaucho → "Bah tche! Gaucho nos EUA!"
  - Lead de Salvador → "Oxente! Salvador e massa demais, viu!"

Tabela Supabase:
  CREATE TABLE referencias_regionais (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100), -- "Orlando, FL" | "Belo Horizonte, MG"
    tipo VARCHAR(50), -- "sotaque" | "referencia_cultural" | "ponto_turistico"
    referencias JSONB, -- {"sotaque": ["uai", "so"], "food": ["pao de queijo"]}
    exemplo_uso TEXT,
    tom VARCHAR(50) -- "casual" | "nostalgico" | "empolgado"
  );

Regras de Uso:
  1. Usar APENAS se identificou localizacao com certeza
  2. Maximo 1 referencia por conversa (nao exagerar)
  3. Usar no RAPPORT inicial, nao em mensagens tecnicas
  4. Se lead nao engajar, voltar ao tom neutro

Fases:
  - Fase 1 (2h): Base de conhecimento no prompt (15-20 cidades principais)
  - Fase 2 (2h): Tabela Supabase + Tool
  - Fase 3 (2h): Extracao automatica + cultural_profile
```

**Total P3:** 31h (antes: 25h)

---

### 4.5 MELHORIAS FUTURAS (SEM PRAZO DEFINIDO)

#### 4.5.1 Assistente de Estrategia de Follow-up Pos-Call (8h)
**Status:** 💡 Ideia - Nao iniciado
**Modulo:** Vendas Avancado

```yaml
Objetivo: IA gera estrategia personalizada de follow-up automaticamente apos cada call

Fluxo:
  1. Call realizada → Gemini transcreve
  2. Head de Vendas analisa → Gera relatorio completo
  3. ASSISTENTE DE ESTRATEGIA recebe:
     - Historico do lead (CRM)
     - Relatorio da call (scores, objecoes, dores)
     - Perfil completo (cargo, empresa, tamanho)
  4. IA gera ESTRATEGIA PERSONALIZADA:
     - Quando fazer follow-up (timing otimo)
     - O que mencionar (dores especificas da call)
     - Qual abordagem usar
     - Quais materiais enviar (case, VSL, proposta)
     - Gatilhos de urgencia/escassez
  5. Preenche CRM com estrategia pronta
  6. Closer abre CRM e ve estrategia completa

Exemplo de Output:
  "ESTRATEGIA DE FOLLOW-UP:
   - Timing: Ligar amanha 10h (lead mencionou disponibilidade de manha)
   - Mencionar: Dor com marido (objecao principal)
   - Enviar: Case de paciente casada que convenceu marido
   - Oferta: Desconto 10% se fechar em 48h
   - Abordagem: Tom empatico, reforcar transformacao vs investimento"

Resultado Esperado:
  - 40%+ de conversao (numero real validado)
  - Closer nao perde tempo planejando
  - Follow-up imediato e relevante
  - Personalizacao em escala

Tecnologias:
  - Claude/GPT-4 para geracao de estrategia
  - Integracao GHL (atualizar custom fields)
  - Webhook pos-call do Head de Vendas
```

#### 4.5.2 QA Agent / Cliente Oculto - Validacao Automatica (12h)
**Status:** 💡 Ideia - Nao iniciado
**Modulo:** Quality Assurance

```yaml
Objetivo: IA testa IA automaticamente antes de ir para producao

Conceito: Quando agente e criado, outro agente (cliente oculto) conversa com ele para validar funcionamento

Fluxo:
  1. Agent Factory cria agente novo (status: pending_qa)
  2. QA AGENT (cliente oculto) inicia conversa automaticamente
     - Se passa por lead real
     - Usa personas aleatorias (dores, objecoes variadas)
  3. Simula jornada COMPLETA:
     - Qualificacao inicial
     - Objecao (preco/timing/marido)
     - Agendamento
     - Dados incorretos (testa validacao)
     - Pergunta fora do escopo (testa escalacao)
  4. IA ANALISA a propria conversa (meta-analise):
     ✅ Conseguiu qualificar?
     ✅ Tratou objecao corretamente?
     ✅ Agendou sem erros?
     ✅ Compliance OK? (nao prometeu resultado, nao usou termos proibidos)
     ✅ Tom/personalidade corretos?
     ✅ Escalou quando necessario?
  5. RELATORIO DE QA:
     - Score: 0-100
     - Pontos fortes
     - Pontos fracos detectados
     - Aprovado? SIM/NAO
  6. Decisao automatica:
     - Se APROVADO (score >= 85):
       → status = active
       → Notifica CS: "Agente aprovado e pronto!"
     - Se REPROVADO (score < 85):
       → status = pending_review
       → Alerta CS com problemas detectados
       → CS ajusta e roda QA novamente

Vantagens:
  - Validacao automatica antes de ir ao ar
  - Reduz erros em producao
  - CS so atua se necessario
  - Melhoria continua (aprende com falhas)
  - Evita constrangimento com cliente real

Tabela Supabase:
  CREATE TABLE agent_qa_tests (
    id UUID PRIMARY KEY,
    agent_version_id UUID REFERENCES agent_versions(id),
    test_scenario VARCHAR(100), -- "qualificacao_basica", "objecao_preco"
    conversation_log JSONB,
    score_total INTEGER,
    pontos_fortes TEXT[],
    pontos_fracos TEXT[],
    approved BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
  );

Personas de Teste (aleatorias):
  - Lead interessado mas sem budget
  - Lead com objecao de marido
  - Lead com duvida sobre resultado
  - Lead que nao tem work permit (se carreira)
  - Lead agressivo/hostil
  - Lead que pede informacoes proibidas (compliance)
```

#### 4.5.3 Arquitetura Modular de Pricing - Upsell por Modulo (6h)
**Status:** 💡 Ideia - Nao iniciado
**Modulo:** Produto

```yaml
Objetivo: Transformar agente monolitico em sistema modular com upsell por funcionalidade

Tiers Propostos:

TIER 1: ESSENCIAL (Base - $497/mes)
  - first_contact (qualificacao)
  - scheduler (agendamento)
  - Analise basica de calls
  - Suporte padrao

TIER 2: PROFISSIONAL (+ $200/mes)
  - Tudo do Essencial +
  - concierge (pos-agendamento, aumenta show rate)
  - objection_handler (quebra objecoes)
  - Dashboard analytics

TIER 3: ENTERPRISE (+ $400/mes)
  - Tudo do Profissional +
  - customer_success (pos-call, fecha venda)
  - rescheduler (recupera no-show)
  - QA Analyst (melhoria continua)
  - Hiperpersonalizacao regional
  - Assistente de Estrategia de Follow-up

Ou Modelo A LA CARTE:
  - Concierge: +$150/mes (resolve no-show alto)
  - Customer Success: +$250/mes (fecha vendas pos-call)
  - Head de Vendas: +$200/mes (analise + move CRM automatico)
  - Objection Handler: +$100/mes (leads com muitas objecoes)
  - Rescheduler: +$150/mes (recupera no-show)
  - QA Analyst: +$200/mes (melhoria continua)
  - Hiperpersonalizacao: +$100/mes (sotaques regionais)

Implementacao Tecnica:
  - Gerar TODOS os modos no kickoff
  - Tabela agent_modules com flags de ativacao
  - Switch roteia apenas para modos ativos
  - Dashboard permite ativar/desativar modulos
  - Webhook atualiza billing automaticamente

Tabela:
  CREATE TABLE agent_modules (
    id UUID PRIMARY KEY,
    agent_version_id UUID REFERENCES agent_versions(id),
    module_name VARCHAR(50),
    is_active BOOLEAN DEFAULT false,
    activated_at TIMESTAMP,
    price_monthly DECIMAL(10,2)
  );

Vantagens:
  - Entrada mais baixa (cliente comeca com $497)
  - Upsell natural ("Seu show rate e 60%, mas poderia ser 85% com Concierge")
  - MRR escalavel ($497 → $697 → $1.097)
  - ROI comprovado primeiro (cliente ve resultado, depois expande)
```

#### 4.5.4 Benchmark por Vendedor
- Campo `vendedor_responsavel` em cada analise
- Dashboard: media de scores por vendedor
- Alertas: "Vendedor X teve 3 calls com conducao < 5 essa semana"

#### 4.5.2 Lead Score Pre-Call
- Score de qualidade do lead ANTES da call
- Baseado em: origem, comportamento, respostas de qualificacao
- Integra com Lead Enrichment (Apify) do ghl-agency-ai

#### 4.5.3 Playbook Dinamico por Objecao
- Quando objecao X detectada -> dispara sequencia Y
- Preco -> Video "por que tratamento barato sai caro"
- Marido -> Audio "como conversar com seu parceiro"
- Medo -> Case de paciente similar

#### 4.5.4 Agent Performance Tracking Avancado
- Cada agente gerado tem ID unico
- Metricas: taxa resolucao, satisfacao, escalations
- Dashboard: "Agente do Dr. Luiz: 78% resolucao, 4.2 satisfacao"
- Comparativo entre versoes
- Decisao data-driven de rollback

---

### 4.6 RESUMO DO ROADMAP

| Prioridade | Tempo Total | Periodo | Status |
|------------|-------------|---------|--------|
| P0 | 13h | Esta semana | 🔴 0% completo |
| P1 | 17h | Semanas 2-3 | 🔴 0% completo |
| P2 | 17h | Semana 4 | 🔴 0% completo |
| P3 | 31h | Mes 2+ | 🔴 0% completo |
| **TOTAL** | **78h** | **~6 semanas** | - |

---

## 5. CLIENTE PILOTO: DR. LUIZ

### Contexto do Negocio
- **Clinica**: High Ticket (medicina estetica/longevidade)
- **Avatar**: Mulheres 40+, altamente desejosas, travadas por marido/culpa/medo/dinheiro
- **Modelo**: Consulta paga como filtro
- **Tickets**: R$15k - R$50k por tratamento

### Status de Implementacao

| Fase | Status | Observacoes |
|------|--------|-------------|
| Secretaria Base | ✅ Ativo | Agendamentos, lembretes, recuperacao |
| SDR IA | ✅ Ativo | Qualificacao via WhatsApp |
| Head de Vendas (analise) | 🔨 Em teste | Analisando calls de diagnostico |
| Propostal | ⏳ Pendente | Aguardando proposta modelo |
| Onboarding automatizado | ⏳ Pendente | Aguardando workflow |

### Metricas Atuais (atualizar semanalmente)

| Metrica | Valor | Meta | Status |
|---------|-------|------|--------|
| Leads/mes | [PREENCHER] | 100 | - |
| Taxa de resposta <5min | [PREENCHER] | 90% | - |
| Taxa de agendamento | [PREENCHER] | 30% | - |
| Taxa de show | [PREENCHER] | 80% | - |
| Taxa de fechamento | [PREENCHER] | 40% | - |
| Ticket medio | [PREENCHER] | R$25k | - |

### Configuracao do Agente (Secretaria)

**Prompt base**: `/Secretaria Base/Prompt da Secretaria.md`

**Tools ativos**:
- Busca Disponibilidade (Socialfy)
- Agendar (Socialfy)
- Escalar para humano
- Enviar arquivo do Drive
- Lembretes de agendamento

**Personalidade**:
- Tom: Acolhedor, profissional, empatico
- Limitacoes: Nao fala de precos, nao da diagnosticos
- Escalacao: Duvidas medicas, reclamacoes, pedidos de desconto

### Objecoes Mais Comuns

| Objecao | Frequencia | Playbook |
|---------|------------|----------|
| Preco alto | 40% | VSL "Por que barato sai caro" |
| Preciso falar com marido | 25% | Audio "Como conversar com parceiro" |
| Medo do procedimento | 20% | Case study paciente similar |
| Nao e o momento | 15% | Follow-up em 30/60/90 dias |

### Arquivos Relacionados
- `/Mottivme Strategy 2026/Reuniao de fechamento - Dra. Carol e Dr. Luiz - 2025_12_05.txt`
- `/Mottivme Strategy 2026/03-Sales-Assets/Call-Analysis-Dra-Carol-Dr-Luiz.md`
- `/Mottivme Strategy 2026/03-Sales-Assets/Propostas/PROPOSTA-FINAL-IRRESISTIVEL-Carol-Luiz.md`

---

## 6. INTEGRACOES EXTERNAS E CREDENCIAIS

### 6.1 GoHighLevel - Subconta Central Mottivme
```
location_id: cd1uyzpJox6XPt4Vct8Y
ghl_api_key: pit-fe627027-b9cb-4ea3-aaa4-149459e66a03
```

**URL Pattern (acesso direto ao contato):**
```
https://app.socialfy.me/v2/location/cd1uyzpJox6XPt4Vct8Y/contacts/detail/{CONTACT_ID}
```

**Contact IDs Importantes:**
| Grupo | Contact ID | Uso |
|-------|------------|-----|
| Marcos Daniel (Admin) | `oaVXSzAd30bm5Mf2nMDW` | Notificacoes URGENTES |
| Financeiro BPOSS | `vUejYndMsxxnyGKO77JC` | Contratos, ADM/Financeiro |
| Gestao SDR | `skfa6JP6lLlAXkc8FfIp` | Erros da IA SDR |
| Agendamentos | `XdsVZ9Fx0dzToMPinO2r` | Notificacoes de reunioes |
| Automacoes/IA | `Ql1qBRN8GTemuG0BlM0F` | Erros de automacoes |

---

### 6.2 Supabase - Projetos

**Projeto FINANCEIRO (financeiro@mottivme.com.br):**
```
Project ID: xbqxivqzetaoptuyykmx
URL: https://xbqxivqzetaoptuyykmx.supabase.co
Dashboard: https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx/editor
```

**Projeto CEO (ceo@marcosdaniels.com):**
```
Project ID: bfumywvwubvernvhjehk
URL: https://bfumywvwubvernvhjehk.supabase.co
Dashboard: https://supabase.com/dashboard/project/bfumywvwubvernvhjehk/editor
```

> **Nota**: Chaves anon/service_role estao no arquivo `Credenciais Supabase ` na raiz do projeto.

---

### 6.3 Credenciais de Servicos

> ⚠️ **SEGURANCA**: Nunca commitar chaves reais em repositorios. Usar variaveis de ambiente.

| Servico | Variavel | Valor/Localizacao | Status |
|---------|----------|-------------------|--------|
| **Airtable** | `AIRTABLE_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Airtable** | `AIRTABLE_BASE_ID_ASSEMBLY` | [PREENCHER] | ❌ Pendente |
| **OpenAI** | `OPENAI_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Gemini** | `GEMINI_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Claude** | `ANTHROPIC_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Apify** | `APIFY_TOKEN` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Browserbase** | `BROWSERBASE_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Twilio** | `TWILIO_ACCOUNT_SID` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Twilio** | `TWILIO_AUTH_TOKEN` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Twilio** | `TWILIO_PHONE_NUMBER` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **HeyGen** | `HEYGEN_API_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Stripe** | `STRIPE_PUBLISHABLE_KEY` | [VER ARQUIVO CREDENCIAIS] | ✅ Configurado |
| **Stripe** | `STRIPE_SECRET_KEY` | [PREENCHER] | ❌ Pendente |
| **Clerk** | `CLERK_PUBLISHABLE_KEY` | [PREENCHER] | ❌ Pendente |
| **Clerk** | `CLERK_SECRET_KEY` | [PREENCHER] | ❌ Pendente |

**Arquivo de credenciais**: `/MOTTIVME SALES TOTAL/CREDENCIAIS/credenciais-master.env` (NAO VERSIONAR)

### 6.4 Outras Integracoes
| Servico | Uso | Credenciais |
|---------|-----|-------------|
| **Google Meet** | Calls + transcricao automatica (Gemini) | - |
| **Google Drive** | Armazenamento de transcricoes | Pasta: 7. Calls |
| **Airtable** | Gestao de ads, conteudo | - |
| **Apify** | Scraping, lead enrichment | - |
| **Browserbase** | Automacao de browser | - |
| **OpenAI/Gemini** | LLMs para analise e geracao | - |
| **Twilio** | WhatsApp + Voice templates | - |

---

### 6.5 Workflow de Configuracao GHL
**Arquivo**: `Criar Campo Etapas do Funil - GHL [DOCUMENTADO PARA LLMs] (1).json`

Este workflow n8n contem:
- Criacao de tabelas PostgreSQL para historico de mensagens e fila
- Templates Twilio para voice calls
- Configuracao padrao de subconta GHL

**Tabelas criadas:**
- `n8n_historico_mensagens` - Historico de mensagens por sessao
- `n8n_fila_mensagens` - Fila de mensagens pendentes
- `n8n_status_atendimento` - Status de atendimento por sessao

---

## 7. STACK TECNICA

| Camada | Tecnologia | Uso |
|--------|------------|-----|
| Automacao | n8n (self-hosted) | Workflows, integracoes, agentes |
| CRM | GoHighLevel | Pipelines, contatos, Custom Objects |
| Database | Supabase | Persistencia, versionamento de agentes |
| No-code DB | Airtable | Gestao de ads, conteudo, dados estruturados |
| Frontend | Next.js 14 + TypeScript | Assembly Line, dashboards |
| UI | shadcn/ui + Tailwind | Componentes |
| State | Zustand | Gerenciamento de estado |
| LLMs | OpenAI, Gemini, Claude | Analise, geracao de conteudo |
| Scraping | Apify | Lead enrichment, dados externos |
| Browser Automation | Browserbase | Acoes que API nao permite |

---

## 8. DIAGRAMA DE CONEXOES (VISAO MACRO)

```
┌─────────────────────────────────────────────────────────────────┐
│                        AQUISICAO                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Meta Ads Scraper] → [Airtable] → [Gerador de Criativos]       │
│         ↑                                    ↓                   │
│         │                            [Ads publicados]            │
│         │                                    ↓                   │
│         │←──────────── [Analise de Objecoes] ←──────┐           │
└─────────────────────────────────────────────────────│───────────┘
                                                      │
┌─────────────────────────────────────────────────────│───────────┐
│                      PRE-VENDAS                     │           │
├─────────────────────────────────────────────────────│───────────┤
│  [Lead entra] → [SDR IA (GHL)] → [Qualificacao]     │           │
│                       ↓                              │           │
│              [Consulta Agendada + Paga]              │           │
└──────────────────────│───────────────────────────────────────────┘
                       ↓
┌──────────────────────│───────────────────────────────────────────┐
│                    VENDAS                                        │
├──────────────────────│───────────────────────────────────────────┤
│  [Call de Diagnostico] → [Head de Vendas IA]                     │
│                                ↓                                  │
│                    [Analise: BANT, SPIN, Objecoes]               │
│                                ↓                                  │
│                    [Custom Objects GHL] ─────────────────────────┤
│                                ↓                                  │
│                    [Negociacao] → [Fechamento]                   │
└──────────────────────│───────────────────────────────────────────┘
                       ↓
┌──────────────────────│───────────────────────────────────────────┐
│                   DELIVERY                                       │
├──────────────────────│───────────────────────────────────────────┤
│  [Kickoff Call] → [Call Analyzer Onboarding]                     │
│                            ↓                                      │
│              [Gera config do Agente automaticamente]             │
│                            ↓                                      │
│              [Deploy Agente] → [Supabase: versao + metricas]     │
│                            ↓                                      │
│              [Secretaria Base operando]                          │
└──────────────────────────────────────────────────────────────────┘

FEEDBACK LOOPS (a implementar):
─────────────────────────────────
[Resultado real da oportunidade] → [Atualiza Analise de Call] → [Calibra IA]
[Performance do Agente] → [Supabase] → [Sugere ajustes no prompt]
[Objecoes agregadas] → [Alimenta geracao de novos criativos]
```

---

## 9. ESTRUTURA DE PASTAS RECOMENDADA NO GOOGLE DRIVE

```
7. Calls/
├── 1. Vendas/        (Diagnostico)
├── 2. Onboarding/    (Kickoff)
├── 3. Revisao/       (Acompanhamento)
├── 4. Suporte/       (Suporte)
├── 5. Churn/         (Alinhamento)
└── 6. Outros/
```

---

## 10. FORMATO DE TITULO DE CALENDARIO GHL

```
Diagnostico - {{contact.name}} - {{contact.phone}}
Kickoff - {{contact.name}} - {{contact.phone}}
Acompanhamento - {{contact.name}} - {{contact.phone}}
Suporte - {{contact.name}} - {{contact.phone}}
Alinhamento - {{contact.name}} - {{contact.phone}}
```

---

## 11. PROXIMOS PASSOS IMEDIATOS

### Infraestrutura (Prioridade Alta)
- [x] Criar workflow `Organizador de Calls` (organizador-calls-FINAL.json) ✅
- [x] Criar subpastas em /7. Calls/ no Google Drive ✅
- [ ] Configurar calendarios GHL com nomenclatura padrao

### Custom Objects GHL (Prioridade Alta)
- [x] Criar Custom Object `anlises_de_call` com 19 campos ✅
- [x] Criar associacao Contact <-> Custom Object ✅
- [ ] Criar Custom Object `Objecoes` com campo contexto
- [x] Criar Custom Object `Agentes` ✅ (10 campos)
- [x] Criar Custom Object `Revisoes de Agente` ✅ (7 campos)

### Supabase (Prioridade Alta)
- [x] Criar tabela `locations` (multi-tenant) ✅
- [x] Criar tabela `call_recordings` ✅
- [x] Criar tabela `call_counters` + funcao `get_next_call_number` ✅
- [x] Executar migracao: `ALTER TABLE locations ADD COLUMN association_id` ✅
- [x] Criar tabela `clients` ✅
- [x] Criar tabela `agent_versions` ✅
- [x] Criar tabela `agent_metrics` ✅
- [x] Criar tabela `agent_conversations` ✅

### Workflows (Prioridade Media)
- [x] Atualizar `AI Agent - Head de Vendas` v2 (Supabase + Custom Object + Associacao) ✅
- [x] Criar `Call Analyzer Onboarding` v2.3 (baseado em Head Vendas) ✅ 2025-12-18
- [x] Criar `Agent Factory` v1.0 (cria agente a partir do kickoff) ✅ 2025-12-18
- [x] Criar `AI Agent Conversacional` v1.0 (atende leads via WhatsApp) ✅ 2025-12-18
- [x] Criar `AI Agent Execution Modular` v1.0 (05) - Bug corrigido ✅ 2025-12-19
- [x] Criar `Boot Validator` v1.0 (08) - Validacao automatica ✅ 2025-12-19
- [x] Criar `AI Factory V3 Unified` (10) - Sistema completo 3 fases ✅ 2025-12-19
- [ ] Criar `Call Analyzer Revisao`
- [ ] Criar `Feedback Loop Oportunidade`

### Validacao (Prioridade Media)
- [ ] Testar fluxo completo end-to-end
- [ ] Documentar metricas baseline
- [ ] Ajustar prompts com base em feedback

### Expansao (Prioridade Baixa)
- [ ] Criar `Call Analyzer Suporte`
- [ ] Criar `Call Analyzer Churn`
- [ ] Implementar dashboard de objecoes agregadas
- [ ] Implementar benchmark por vendedor

---

## 11.1 CHANGELOG RECENTE

### v3.0 (19/12/2025 - 11:00h) - AI FACTORY V3 COMPLETA
- **AI Factory V3 Unified (Workflow 10)**: Sistema completo de 3 fases
  - FASE 1: Google Drive Trigger → Filter → Buscar Call → Export Doc → AI Analisar Kickoff (Groq Llama 3.3 70B)
  - FASE 2: Processar Analise → Criar Agent Version no Supabase
  - FASE 3: Validacao com Claude Sonnet 4 → Auto-aprovar/Notificar
  - Status: PRONTO PARA TESTE

- **Bug Corrigido no Workflow 05 (AI Agent Execution Modular)**:
  - **Problema**: Code node "Preparar Execucao + Identificar Contexto" sempre pegava `modosIdentificados[0]` ignorando o campo `agente_ia` do GHL
  - **Solucao**: Ler `agente_ia` do webhook (`$('Info').first().json`) e usar para selecionar de `prompts_por_modo`
  - Codigo corrigido:
    ```javascript
    const agenteIaDoGHL = webhook.agente_ia || webhook.customFields?.agente_ia || '';
    let contexto = agenteIaDoGHL;
    if (!contexto || !promptsPorModo[contexto]) {
      contexto = promptsPorModo['first_contact'] ? 'first_contact' : Object.keys(promptsPorModo)[0];
    }
    const promptDoModo = promptsPorModo[contexto] || '';
    ```

- **Hiperpersonalizacao Engine Implementada**:
  - Migration SQL: `002_add_hyperpersonalization.sql`
  - Nova coluna `hyperpersonalization` em `agent_versions` (JSONB)
  - Mapeamento de DDD para linguagem regional (11 SP, 21 RJ, 31 BH, etc.)
  - Mapeamento de Setor para vocabulario (saude, odontologia, juridico, tech)
  - Views de performance: `vw_hp_performance_por_setor`, `vw_hp_performance_por_regiao`

- **Workflow 03 (Call Analyzer Onboarding)**: Atualizado para extrair hiperpersonalizacao
  - Extrai: DDD, setor, porte_empresa, cargo_decisor
  - Salva em `hyperpersonalization` JSONB no Supabase

- **Workflow 08 (Boot Validator)**: Atualizado com parse robusto de JSON
  - Validacao automatica a cada 5 minutos
  - Nota minima para aprovacao: 8.0
  - Auto-ativa agentes aprovados

- **Novo arquivo de contexto**: `CONTEXTO-AI-FACTORY-V3.md`
  - Documentacao especifica do sistema AI Factory V3
  - Codigo corrigido, mapeamentos, comandos SQL uteis

### v2.5 (18/12/2025 - 21:30h)
- **Arquitetura Modular de Prompts**: Implementada (Secao 2.13)
  - ✅ Workflow 03 (Call Analyzer Onboarding) atualizado para v2.4
    - System prompt identifica 7 modos possiveis (first_contact, scheduler, rescheduler, concierge, customer_success, objection_handler, followuper)
    - IA gera prompts especificos (200-500 palavras) para cada modo identificado
    - Validacao automatica (minimo 2 modos, maximo 7)
  - ✅ Workflow 04 (Agent Factory) atualizado para v1.1
    - Salva modos_identificados + prompts_por_modo no Supabase (campo tools_config)
    - Custom Object GHL agora tem: arquitetura, modos_ativos, total_modos
    - Retrocompatibilidade: system_prompt legado mantido
  - 📊 Beneficios comprovados:
    - 60% economia de tokens (~2500 → ~1000 por execucao)
    - +20% acuracia esperada (prompt especifico vs generico)
    - Manutencao simplificada (atualiza 1 modo sem afetar outros)
  - 📖 Documentacao completa: Secao 2.13 (9 subsecoes + exemplo real)
  - 🔜 Proximo: Workflow de execucao com Switch + Sets dinamicos

### v2.4 (18/12/2025 - 19:15h)
- **Assistente de Estrategia de Follow-up**: Adicionado ao roadmap 4.5.1
  - IA gera estrategia personalizada pos-call automaticamente
  - Preenche CRM com plano de acao completo para closer
  - Resultado esperado: 40%+ de conversao
  - Tempo estimado: 8h
- **QA Agent / Cliente Oculto**: Adicionado ao roadmap 4.5.2
  - IA testa IA automaticamente antes de producao
  - Simula jornada completa do lead com personas aleatorias
  - Aprovacao automatica (score >= 85) ou alerta CS
  - Tempo estimado: 12h
- **Arquitetura Modular de Pricing**: Adicionado ao roadmap 4.5.3
  - Sistema de upsell por modulo/funcionalidade
  - 3 tiers (Essencial $497, Pro +$200, Enterprise +$400)
  - Modelo a la carte alternativo
  - Tempo estimado: 6h

### v2.3 (18/12/2025 - 18:45h)
- **Hiperpersonalizacao Regional**: Adicionada ao roadmap P3 (Secao 4.4.4)
  - Feature: IA detecta localizacao e usa referencias culturais para rapport
  - Exemplos: Sotaques regionais (BH = uai/so, RJ = mano, RS = tche)
  - Arquitetura: Base conhecimento → Tool → Extracao automatica
  - Tempo estimado: 6h (Fase 1: 2h, Fase 2: 2h, Fase 3: 2h)
  - Status: Planejado para v2/v3
- **Roadmap P3**: Atualizado de 25h para 31h (+6h)
- **Total Roadmap**: Atualizado de 72h para 78h

### v2.2 (18/12/2025 - 15:30h)
- **Assistente IA Executiva (Sofia)**: Nova secao 2.13 adicionada
  - Sistema de accountability para CEO
  - Modo ativo (4 gatilhos diarios) + modo passivo (WhatsApp)
  - Schema DB completo (5 tabelas)
  - Integracoes: Monday.com, Claude AI, Evolution API
  - Status: Documentado, aguardando implementacao
- **Roadmap Reorganizado (Secao 4)**: Estrutura P0-P3 completa
  - P0 (13h): Custom Object Objecoes, Feedback Loop, Agent Factory v2.0, AI Agent v2.0, QA Analyst
  - P1 (17h): Sistema Onboarding Automatizado (score 100 pts), Assistente IA completa
  - P2 (17h): Dashboard Cliente MVP, Call Analyzer Suporte, Testes E2E
  - P3 (25h): Call Analyzer Churn, Dashboard Objecoes, Artilharia Nuclear
  - Total: 72h (~6 semanas)
- **Sistema de QA Analyst**: Documentado em P0
  - Analise automatica de qualidade de conversas
  - Alerta CS quando nota < 6
  - Deteccao de loops e objecoes nao tratadas
  - Tabela agent_qa_logs no Supabase
- **Sistema de Onboarding Automatizado**: Documentado em P1
  - Score de implementacao (0-100 pontos)
  - Follow-up em 4 niveis baseado no score
  - Kickstart automatico (Dia 0, 1, 3, 7, 15, 30)
  - Reducao de churn nos primeiros 30 dias
- **Alinhamento com DOCUMENTACAO-COMPLETA-PROJETO-IA-MOTTIVME.md**
  - Conteudos integrados ao documento MASTER
  - MASTER agora e o source of truth unico

### v2.1 (19/12/2025 - 02:00h)
- **Call Analyzer Revisao v2.0**: Workflow completo criado
  - Analisa calls de acompanhamento usando framework PDCA
  - Busca agente ativo por contact_id no Supabase
  - Cria nova versao com status pending_approval
  - Cria Custom Object "Revisoes de Agente" no GHL
  - Notifica CS via WhatsApp para aprovacao
- **Engenheiro de Prompt v1.0**: Novo workflow para ajustes pontuais
  - Webhook POST /webhook/engenheiro-prompt
  - 7 comandos: listar, ver, editar, historico, rollback, aprovar, rejeitar
  - Aceita JSON ou texto (compativel com WhatsApp/Slack)
  - SEMPRE cria versao pending_approval (nunca aplica direto)
  - AI (Groq llama-3.3-70b) para aplicar mudancas de forma inteligente
- **Tabela prompt_change_requests**: Novo schema SQL
  - Registra todas as solicitacoes de mudanca
  - Suporta: revisao, suporte, hotfix, rollback, novo
  - Campos PDCA para analises de revisao
  - Funcoes SQL: approve_prompt_change, reject_prompt_change
  - Views: v_pending_prompt_changes, v_prompt_change_history
- **Agent_versions expandido**: Novas colunas
  - status (pending_approval, active, deprecated, rejected)
  - contact_id, location_id (multi-tenant)
  - approved_by, approved_at, previous_version_id
- **Documentacao atualizada**: ARQUITETURA-AGENT-FACTORY.md v2.1
  - Novas secoes: Engenheiro de Prompt, prompt_change_requests
  - Status de Fase 4, 5, 6 atualizados para COMPLETA

### v2.0 (19/12/2025 - 00:30h)
- **Agent Factory v1.0**: Workflow completo criado e testado
  - Poll a cada 5 min por calls tipo kickoff com status analisado
  - Cria agent_version no Supabase
  - Cria Custom Object Agentes no GHL
  - Associa Agente ao Contato
  - Testado com sucesso: agente `f81d3ede-3a43-4d5a-acbc-a36f3535378b`
- **AI Agent Conversacional v1.0**: Workflow completo criado e testado
  - Webhook recebe mensagens (GHL + WhatsApp)
  - Busca agente ativo por location_id
  - Carrega system_prompt dinamicamente do Supabase
  - Chama OpenAI com contexto + historico
  - Responde corretamente com personalidade configurada
  - **Pendencia**: Habilitar "Always Output Data" no node "Salvar Conversa"
- **Documentacao atualizada**: ARQUITETURA-AGENT-FACTORY.md v2.0
  - Status de todas as fases atualizados
  - Instrucoes de como ativar e testar agentes

### v1.9 (18/12/2025 - 23:00h)
- **Call Analyzer Onboarding v2.3**: Corrigido campo `status_analise`
  - Mudou de "onboarding" para "qualificado" (valor aceito pelo GHL)
  - Workflow testado e funcionando end-to-end
- **Arquitetura Agent Factory**: Documentacao completa criada
  - Novo arquivo: `/n8n-workspace/ARQUITETURA-AGENT-FACTORY.md`
  - Definicao de Custom Objects: `Agentes`, `Revisoes de Agente`
  - Schema SQL: `agent_versions`, `agent_metrics`, `agent_conversations`
  - Fluxo detalhado de criacao de agentes
- **Secao 2.12 Agent Factory**: Adicionada ao documento contexto
  - Diagrama de fluxo de criacao de agentes
  - Tabela "Quem Alimenta Cada Custom Object"
  - Status de implementacao de cada componente

### v1.8 (18/12/2025)
- **Call Analyzer Onboarding v2**: Criado baseado no AI-Agent-Head-Vendas funcional
  - HTTP Request export (nao Download + Extract)
  - Folder trigger com URL/ID (nao nome)
  - Multi-tenant via JOIN com locations
  - Sintaxe $() correta (nao $items())
  - association_id e ghl_api_key dinamicos

### v1.7 (17/12/2025)
- **Custom Object `anlises_de_call`**: Criados 7 novos campos de scores via API GHL
- **Multi-tenant**: Tabela `locations` com `association_id` para suportar multiplas contas
- **Query otimizada**: JOIN `call_recordings + locations` traz dados necessarios
- **jsonBody atualizado**: 19 campos dinamicos no "Salvar em Custom Object"
- **Sintaxe n8n corrigida**: `$items()` causava [undefined], voltou para `$()`

### v1.6 (17/12/2025)
- **Extracao de texto**: Solucao HTTP Request export para Google Docs
- **Integracao Supabase**: Workflows conectados via banco de dados
- **Status de calls**: pendente → movido → analisado

---

## 12. COMO USAR ESTE DOCUMENTO

### Ao iniciar nova conversa com IA:
1. Envie este arquivo como contexto inicial
2. Diga: "Este e o contexto do projeto Mottivme. [sua pergunta/tarefa]"

### Ao atualizar o documento:
1. Adicione novos ativos na secao correspondente
2. Atualize o status de tarefas
3. Mantenha a data de "Ultima atualizacao" no topo

### Ao reportar problemas:
1. Consulte a secao 13 (Troubleshooting) primeiro
2. Inclua logs relevantes
3. Especifique qual fase/workflow falhou

### Termos confusos?
- Consulte a secao 14 (Glossario)

---

## 13. TROUBLESHOOTING

### Problemas Comuns

#### Arquivo nao e movido para subpasta
**Sintoma**: Arquivo fica em /7. Calls/ raiz
**Causa provavel**: Nome nao segue convencao
**Solucao**: Verificar se nome comeca com prefixo correto (Diagnostico, Kickoff, etc.)

#### Workflow nao dispara
**Sintoma**: Arquivo movido mas analise nao acontece
**Causa provavel**: Webhook do n8n nao esta ativo
**Solucao**: Verificar se workflow esta ativo em n8n > Workflows > [workflow] > Ativo

#### Custom Object nao atualiza no GHL
**Sintoma**: Analise roda mas dados nao aparecem no GHL
**Causa provavel**: API key expirada ou campo inexistente
**Solucao**:
1. Verificar se API key esta valida
2. Verificar se Custom Object existe com campos corretos
3. Checar logs do n8n

#### Agente nao responde
**Sintoma**: WhatsApp recebe mensagem mas IA nao responde
**Causa provavel**: Multiplas possibilidades
**Solucao**:
1. Verificar MIS Sentinel para alertas
2. Checar Supabase se `is_active = TRUE`
3. Verificar logs do workflow Secretaria Base
4. Testar conexao Twilio

#### Score do Propostal nao atualiza GHL
**Sintoma**: Lead interage na proposta mas GHL nao reflete
**Causa provavel**: Webhook nao configurado
**Solucao**: Verificar se webhook do Propostal esta apontando para n8n correto

### Logs e Monitoramento

| Sistema | Onde ver logs |
|---------|---------------|
| n8n | Executions > [workflow] > Ver execucao |
| Supabase | Dashboard > Logs |
| GHL | Settings > Audit Log |
| Vercel (Propostal) | Dashboard > Deployments > Logs |

### Contatos para Escalacao

| Problema | Responsavel | Contato |
|----------|-------------|---------|
| n8n down | [PREENCHER] | [PREENCHER] |
| GHL API | [PREENCHER] | [PREENCHER] |
| Supabase | [PREENCHER] | [PREENCHER] |
| Twilio/WhatsApp | [PREENCHER] | [PREENCHER] |

---

## 14. GLOSSARIO

### Termos de Negocio

| Termo | Definicao |
|-------|-----------|
| **High Ticket** | Servico/produto com valor acima de R$10k |
| **ICP** | Ideal Customer Profile - perfil do cliente ideal |
| **Avatar** | Representacao ficticia do cliente ideal |
| **Show** | Quando o lead comparece a consulta agendada |
| **No-show** | Quando o lead nao comparece |
| **Churn** | Cancelamento/nao renovacao de cliente |

### Termos Tecnicos

| Termo | Definicao |
|-------|-----------|
| **BANT** | Budget, Authority, Need, Timeline - framework de qualificacao |
| **SPIN** | Situation, Problem, Implication, Need-payoff - framework de vendas |
| **Tier** | Classificacao de probabilidade (1=alta, 2=media, 3=baixa) |
| **Lead Score** | Pontuacao de 0-100 indicando interesse do lead |
| **Custom Object** | Objeto personalizado no GHL para armazenar dados estruturados |
| **Custom Field** | Campo personalizado em um contato GHL |

### Termos do Sistema

| Termo | Definicao |
|-------|-----------|
| **Secretaria Base** | Sistema de 14 workflows para atendimento automatizado |
| **Head de Vendas** | Workflow que analisa calls de vendas e da scores |
| **MIS Sentinel** | Dashboard de monitoramento de sentimento WhatsApp |
| **Propostal** | Sistema de propostas interativas com tracking |
| **Assembly Line** | SaaS de automacao de estrategia de marketing |
| **Sexy Canvas** | Metodologia de 14 gatilhos emocionais para copy |

### Siglas

| Sigla | Significado |
|-------|-------------|
| **GHL** | GoHighLevel (CRM) |
| **SDR** | Sales Development Representative |
| **CS** | Customer Success |
| **VSL** | Video Sales Letter |
| **PDCA** | Plan-Do-Check-Act (ciclo de melhoria) |
| **API** | Application Programming Interface |
| **MCP** | Model Context Protocol |

---

**Criado por**: Claude + Marcos
**Data**: 2025-12-19 - 00:30h
**Versao**: 2.0

---
---
---

# ⚡ RESUMO EXECUTIVO - LEIA PRIMEIRO

> **INSTRUCAO PARA IA**: Ao iniciar conversa, leia APENAS este resumo (ultimas ~150 linhas).
> Se precisar de detalhes, consulte a secao especifica indicada entre colchetes [#secao].

## Quem e Mottivme
Agencia de IA e Crescimento B2B focada em **clinicas High Ticket** (estetica, longevidade). Instalamos sistemas de IA que resolvem ineficiencia na conversao de leads - do lead ao show, do show ao fechamento.

## Stack Principal
| Camada | Tech |
|--------|------|
| Automacao | **n8n** (self-hosted) |
| CRM | **GoHighLevel** |
| Database | **Supabase** (2 projetos: CEO + FINANCEIRO) |
| Frontend | **Next.js 14/15** + TypeScript + Tailwind |
| LLMs | OpenAI, Gemini, Claude, Groq |

## Arquitetura AI Factory [#secao-2]
```
Lead → SDR IA → Call Diagnostico → Head Vendas IA (scores) → Fechamento
                                                                  ↓
                                              Kickoff → Call Analyzer → Agent Factory
                                                                            ↓
                                                              Deploy Agente (Supabase)
                                                                            ↓
                                                          AI Agent Conversacional (atende leads)
```

## Projetos/Workflows Ativos [#secao-2.10 e 3]

| Projeto | Status | O que faz |
|---------|--------|-----------|
| **Organizador de Calls** | ✅ Pronto | Monitora Drive, move, classifica calls |
| **AI Agent - Head de Vendas** | ✅ Pronto | Analisa calls vendas, scores BANT/SPIN |
| **Call Analyzer Onboarding** | ✅ v2.3 | Analisa kickoff, gera config agente |
| **Agent Factory** | ✅ v1.0 | Cria agente no Supabase a partir do kickoff |
| **AI Agent Conversacional** | ✅ v1.0 | Atende leads via WhatsApp |
| **Call Analyzer Revisao** | ✅ v2.0 | PDCA, cria nova versao pending |
| **Engenheiro de Prompt** | ✅ v1.0 | 7 comandos para ajustar prompts |
| **Propostal** | ✅ Pronto | Propostas interativas + score |
| **Secretaria Base** | ✅ Pronto | 14 workflows atendimento WhatsApp |
| **Assistente IA Executiva** | 🔨 Documentado | Accountability CEO via WhatsApp + Monday |
| QA Analyst | ⏳ P0 | Analise automatica qualidade conversas |
| Custom Object Objecoes | ⏳ P0 | Rastreamento de objecoes |
| Feedback Loop Oportunidade | ⏳ P0 | Calibracao IA com resultados reais |
| Onboarding Automatizado | ⏳ P1 | Score + follow-up niveis |
| Call Analyzer Suporte | ⏳ P2 | Analisa calls de suporte |
| Call Analyzer Churn | ⏳ P3 | Analisa motivos de cancelamento |

## Credenciais Importantes [#secao-6]

**GHL Principal:**
- Location ID: `cd1uyzpJox6XPt4Vct8Y`
- API Key: `pit-fe627027-b9cb-4ea3-aaa4-149459e66a03`

**Supabase CEO:**
- Project ID: `bfumywvwubvernvhjehk`
- URL: `https://bfumywvwubvernvhjehk.supabase.co`

**Supabase FINANCEIRO (legado):**
- Project ID: `xbqxivqzetaoptuyykmx`

> Chaves anon/service_role: arquivo `Credenciais Supabase` na raiz

## Custom Objects GHL [#secao-2.6]
- `anlises_de_call` (19 campos) - Object ID: `6941f85884c73a7cf76310e4`
- `Agentes` (10 campos)
- `Revisoes de Agente` (7 campos)
- `Objecoes`, `Consultas`, `Tratamentos`

## Tabelas Supabase CEO [#secao-2.9]
- `locations` - Multi-tenant (location_id, api_key, association_id)
- `call_recordings` - Calls gravadas do Drive
- `clients` - Clientes da agencia
- `agent_versions` - Versoes de agentes IA
- `agent_metrics` - Metricas diarias
- `agent_conversations` - Historico de conversas
- `prompt_change_requests` - Mudancas de prompt

## Convencao de Arquivos [#secao-2.3]
Prefixo do nome determina destino e workflow:
- `Diagnostico - ...` → /1. Vendas/ → Head de Vendas
- `Kickoff - ...` → /2. Onboarding/ → Call Analyzer Onboarding
- `Acompanhamento - ...` → /3. Revisao/ → Call Analyzer Revisao

## Proximos Passos [#secao-4]

**P0 - Esta Semana (13h):**
- [ ] Criar Custom Object `Objecoes` com campo contexto
- [ ] Criar Feedback Loop Oportunidade
- [ ] Agent Factory v2.0 (validacao + testes)
- [ ] AI Agent Conversacional v2.0 (Always Output Data)
- [ ] QA Analyst (analise automatica)

**P1 - Semanas 2-3 (17h):**
- [ ] Sistema Onboarding Automatizado (score + follow-up)
- [ ] Assistente IA Executiva (Sofia) completa

**Ver roadmap completo:** Secao 4

## Cliente Piloto [#secao-5]
**Dr. Luiz** - Clinica High Ticket (medicina estetica/longevidade)
- Secretaria Base: ✅ Ativo
- SDR IA: ✅ Ativo
- Head de Vendas: 🔨 Em teste

## Quando Consultar o Documento Completo
- Detalhes de schema SQL → Secao 2.9
- Fluxo completo dos workflows → Secao 2.10
- Lista de todos os fluxos n8n → Secao 3.1
- Troubleshooting → Secao 13
- Glossario de termos → Secao 14

---
**Ultima atualizacao resumo**: 2025-12-18
**Versao documento**: 2.2

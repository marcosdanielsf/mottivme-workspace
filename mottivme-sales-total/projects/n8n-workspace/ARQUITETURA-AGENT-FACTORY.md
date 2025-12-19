# ARQUITETURA AGENT FACTORY - MOTTIVME

> Sistema de criacao automatica de agentes de IA baseado em calls de kickoff

**Ultima atualizacao**: 2025-12-19 02:00h (v2.1)

---

## 1. VISAO GERAL DO FLUXO

```
                           FASE VENDAS                    FASE ONBOARDING
                    ┌─────────────────────┐        ┌─────────────────────────────┐
                    │                     │        │                             │
Lead entra    ──►   │  AI Agent           │  ──►   │  Call de Kickoff            │
                    │  (da clinica)       │        │  (CS + Cliente)             │
                    │                     │        │                             │
                    │  - Qualifica        │        │  - Define tom               │
                    │  - Agenda consulta  │        │  - Define servicos          │
                    │  - Detecta objecoes │        │  - Define compliance        │
                    │                     │        │  - Define escalacao         │
                    └─────────────────────┘        └──────────────┬──────────────┘
                                                                  │
                                                                  ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │           CALL ANALYZER ONBOARDING (✅ v2.3 PRONTO)          │
                    │                                                              │
                    │  1. Extrai informacoes da call                              │
                    │  2. Gera agent_config (JSON)                                │
                    │  3. Salva no Supabase (analise_json)                        │
                    │  4. Salva no Custom Object "anlises_de_call"                │
                    │                                                              │
                    │  OUTPUT: { system_prompt, tools_config, compliance_rules,   │
                    │            personality_config, negocio, qualificacao }       │
                    └──────────────────────────┬──────────────────────────────────┘
                                               │
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                 AGENT FACTORY (✅ v1.0 PRONTO)               │
                    │                                                              │
                    │  TRIGGER: Poll a cada 5 min                                 │
                    │  Query: calls tipo='kickoff' AND status='analisado'         │
                    │         AND NOT EXISTS em agent_versions                    │
                    │                                                              │
                    │  1. Le agent_config do Supabase                             │
                    │  2. Extrai system_prompt, tools, compliance, personality    │
                    │  3. Cria registro em Supabase "agent_versions"              │
                    │  4. Cria Custom Object "Agentes" no GHL                     │
                    │  5. Associa Agente ao Contato                               │
                    │  6. Status inicial: pending_approval                        │
                    │                                                              │
                    │  OUTPUT: agent_version_id, ghl_custom_object_id             │
                    └──────────────────────────┬──────────────────────────────────┘
                                               │
                                               ▼ (CS aprova)
                    ┌─────────────────────────────────────────────────────────────┐
                    │          AI AGENT CONVERSACIONAL (✅ v1.0 PRONTO)            │
                    │                                                              │
                    │  TRIGGER: Webhook mensagem WhatsApp/GHL                     │
                    │                                                              │
                    │  1. Recebe mensagem do lead                                 │
                    │  2. Busca agente ativo para location (is_active=true)       │
                    │  3. Carrega system_prompt, tools_config, compliance         │
                    │  4. Busca historico de conversa (ultimas 10 msgs)           │
                    │  5. Chama IA (OpenAI/Anthropic) com tools                   │
                    │  6. Se IA quer usar tool -> executa -> chama IA novamente   │
                    │  7. Detecta objecoes automaticamente                        │
                    │  8. Salva conversa no Supabase                              │
                    │  9. Envia resposta pelo mesmo canal                         │
                    │                                                              │
                    │  TOOLS DISPONIVEIS:                                         │
                    │  - buscar_disponibilidade (agenda)                          │
                    │  - agendar_consulta                                         │
                    │  - escalar_para_humano                                      │
                    │                                                              │
                    │  ALIMENTA:                                                  │
                    │  - agent_conversations (Supabase)                           │
                    │  - agent_conversation_messages (Supabase)                   │
                    │  - Custom Object "Objecoes" (quando detecta)                │
                    │  - Custom Object "Consultas" (quando agenda)                │
                    └──────────────────────────┬──────────────────────────────────┘
                                               │
                                               │  (30 dias depois)
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │            CALL ANALYZER REVISAO (✅ v2.0 PRONTO)            │
                    │                                                              │
                    │  TRIGGER: Google Drive pasta /3. Revisao/                   │
                    │                                                              │
                    │  1. Analisa call de acompanhamento usando PDCA              │
                    │  2. Busca agente ativo no Supabase                          │
                    │  3. Compara resultados vs expectativas                      │
                    │  4. Gera nova versao com status pending_approval            │
                    │  5. Cria Custom Object "Revisoes de Agente" no GHL          │
                    │  6. Notifica CS para aprovacao                              │
                    │                                                              │
                    │  OUTPUT: Nova versao pendente + notificacao CS              │
                    └──────────────────────────┬──────────────────────────────────┘
                                               │
                                               │  (ajustes pontuais sob demanda)
                                               ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │            ENGENHEIRO DE PROMPT (✅ v1.0 PRONTO)             │
                    │                                                              │
                    │  TRIGGER: Webhook POST /webhook/engenheiro-prompt           │
                    │                                                              │
                    │  COMANDOS:                                                  │
                    │  - listar: Lista agentes ativos                             │
                    │  - ver "Cliente": Mostra config atual                       │
                    │  - editar "Cliente" "instrucao": Propoe mudanca             │
                    │  - historico "Cliente": Historico de versoes                │
                    │  - rollback "Cliente" vX.X: Reativa versao                  │
                    │  - aprovar {uuid}: Aprova versao pendente                   │
                    │  - rejeitar {uuid} motivo: Rejeita versao                   │
                    │                                                              │
                    │  SEGURANCA:                                                 │
                    │  - SEMPRE cria versao pending_approval (nunca aplica direto)│
                    │  - Requer aprovacao explicita via aprovar/rejeitar          │
                    │                                                              │
                    │  OUTPUT: Nova versao pendente ou acao executada             │
                    └─────────────────────────────────────────────────────────────┘
```

---

## 2. CUSTOM OBJECTS - DEFINICAO COMPLETA

### 2.1 Custom Object: `Agentes` (A CRIAR)

| Campo | Tipo | Descricao | Obrigatorio |
|-------|------|-----------|-------------|
| nome_agente | Text | Nome do agente (ex: "Dra. Ana IA") | Sim |
| cliente_nome | Text | Nome da clinica/consultorio | Sim |
| especialidade | Text | Especialidade (estetica, odonto, etc) | Sim |
| versao_atual | Text | Versao ativa (v1.0, v1.1, etc) | Sim |
| status | Text | ativo, pausado, em_revisao | Sim |
| data_ativacao | Date | Quando foi ativado | Sim |
| system_prompt | Text | Prompt atual (resumido) | Nao |
| tools_habilitadas | Text | Lista de tools ativas | Nao |
| total_conversas | Number | Total de conversas realizadas | Nao |
| total_agendamentos | Number | Total de agendamentos feitos | Nao |
| taxa_conversao | Number | % de leads que agendaram | Nao |
| satisfacao_media | Number | Score medio de satisfacao 0-5 | Nao |
| ultima_revisao | Date | Data da ultima revisao | Nao |
| proxima_revisao | Date | Data da proxima revisao | Nao |
| link_config_supabase | Text | ID do agent_version no Supabase | Nao |

**Associacoes:**
- Contact <-> Agente (1 cliente tem 1 agente)

---

### 2.2 Custom Object: `Revisoes de Agente` (A CRIAR)

| Campo | Tipo | Descricao | Obrigatorio |
|-------|------|-----------|-------------|
| agente_id | Text | ID do Custom Object Agente | Sim |
| versao_anterior | Text | Versao antes da revisao | Sim |
| versao_nova | Text | Versao apos revisao (se aprovado) | Nao |
| data_revisao | Date | Data da call de revisao | Sim |
| tipo_revisao | Text | mensal, trimestral, emergencial | Sim |
| status | Text | pendente, aprovado, rejeitado | Sim |
| diff_system_prompt | Text | Mudancas no prompt | Nao |
| diff_tools | Text | Mudancas nas tools | Nao |
| diff_compliance | Text | Mudancas em compliance | Nao |
| motivo_revisao | Text | Por que foi revisado | Nao |
| resultado_esperado | Text | O que espera melhorar | Nao |
| aprovado_por | Text | Nome de quem aprovou | Nao |
| link_call_revisao | Text | URL da call de revisao | Nao |

**Associacoes:**
- Agente <-> Revisao (1 agente tem N revisoes)
- Contact <-> Revisao (cliente pode ver historico)

---

### 2.3 Custom Object: `Objecoes` (EXISTE - EXPANDIR)

| Campo | Tipo | Descricao | Quem Alimenta |
|-------|------|-----------|---------------|
| tipo | Text | preco, tempo, confianca, etc | AI Agent |
| intensidade | Text | baixa, media, alta | AI Agent |
| origem | Text | WhatsApp, Telefone, Email | AI Agent |
| status | Text | aberta, tratada, resolvida | AI Agent / CS |
| proxima_acao | Text | Acao sugerida | AI Agent |
| contexto | Text | Trecho da conversa | AI Agent |
| resposta_usada | Text | Como foi tratada | AI Agent |
| resultado | Text | sucesso, falha, escalou | AI Agent |
| data_deteccao | Date | Quando foi detectada | AI Agent |

**Quem Alimenta:** AI Agent conversacional durante atendimento

---

### 2.4 Custom Object: `Consultas` (EXISTE - EXPANDIR)

| Campo | Tipo | Descricao | Quem Alimenta |
|-------|------|-----------|---------------|
| data_consulta | Date | Data/hora agendada | AI Agent |
| status | Text | agendada, confirmada, realizada, no_show | AI Agent / CS |
| valor | Number | Valor do procedimento | CS |
| origem | Text | WhatsApp, Instagram, Site | AI Agent |
| concierge | Text | Quem atendeu inicialmente | AI Agent |
| procedimento | Text | Tipo de procedimento | AI Agent |
| objecoes_tratadas | Text | IDs das objecoes tratadas | AI Agent |
| tempo_qualificacao | Number | Minutos ate agendar | AI Agent |
| mensagens_trocadas | Number | Total de msgs na conversa | AI Agent |

**Quem Alimenta:** AI Agent quando agenda consulta

---

## 3. TABELAS SUPABASE

### 3.1 Tabela: `agent_versions` (A CRIAR)

```sql
CREATE TABLE agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamentos
  client_id UUID REFERENCES clients(id),          -- Cliente dono do agente
  contact_id VARCHAR(100),                        -- ID do contato no GHL
  location_id VARCHAR(50),                        -- ID da location no GHL
  call_recording_id UUID REFERENCES call_recordings(id), -- Call de kickoff

  -- Versionamento
  version VARCHAR(20) NOT NULL,                   -- v1.0, v1.1, etc
  is_active BOOLEAN DEFAULT false,                -- Se e a versao ativa
  previous_version_id UUID REFERENCES agent_versions(id), -- Versao anterior

  -- Configuracao do Agente
  agent_name VARCHAR(255),                        -- Nome do agente
  system_prompt TEXT NOT NULL,                    -- Prompt completo
  tools_config JSONB,                             -- { tools_enabled: [], calendar: "ghl" }
  compliance_rules JSONB,                         -- { proibicoes: [], escalacao: [] }
  personality_config JSONB,                       -- { tom: "", caracteristicas: [] }
  business_config JSONB,                          -- { servicos: [], precos: [], etc }
  qualification_config JSONB,                     -- { perguntas: [], criterios: [] }

  -- IDs externos
  ghl_custom_object_id VARCHAR(100),              -- ID do Custom Object "Agentes" no GHL

  -- Status
  status VARCHAR(50) DEFAULT 'draft',             -- draft, pending_approval, active, archived
  approved_by VARCHAR(255),                       -- Quem aprovou
  approved_at TIMESTAMP,                          -- Quando aprovou

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  activated_at TIMESTAMP                          -- Quando foi ativado
);

-- Index para buscar versao ativa de um cliente
CREATE INDEX idx_agent_versions_active ON agent_versions(contact_id, is_active) WHERE is_active = true;
```

---

### 3.2 Tabela: `agent_metrics` (A CRIAR)

```sql
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_version_id UUID REFERENCES agent_versions(id) NOT NULL,

  -- Periodo
  data DATE NOT NULL,

  -- Metricas de Volume
  total_conversas INT DEFAULT 0,
  total_mensagens_recebidas INT DEFAULT 0,
  total_mensagens_enviadas INT DEFAULT 0,

  -- Metricas de Qualificacao
  leads_qualificados INT DEFAULT 0,
  leads_desqualificados INT DEFAULT 0,
  leads_em_nutricao INT DEFAULT 0,

  -- Metricas de Agendamento
  consultas_agendadas INT DEFAULT 0,
  consultas_confirmadas INT DEFAULT 0,
  consultas_realizadas INT DEFAULT 0,
  consultas_no_show INT DEFAULT 0,

  -- Metricas de Objecoes
  objecoes_detectadas INT DEFAULT 0,
  objecoes_tratadas INT DEFAULT 0,
  objecoes_escaladas INT DEFAULT 0,

  -- Metricas de Performance
  tempo_medio_resposta_seg INT,                   -- Tempo medio de resposta
  satisfacao_media DECIMAL(3,2),                  -- Score 0.00 a 5.00
  taxa_conversao DECIMAL(5,2),                    -- % leads -> agendamento
  taxa_escalacao DECIMAL(5,2),                    -- % conversas escaladas

  -- Metricas de Custo
  tokens_input INT DEFAULT 0,
  tokens_output INT DEFAULT 0,
  custo_estimado DECIMAL(10,4),                   -- Em USD

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),

  -- Constraint para evitar duplicatas
  UNIQUE(agent_version_id, data)
);

-- Index para relatorios
CREATE INDEX idx_agent_metrics_date ON agent_metrics(data);
CREATE INDEX idx_agent_metrics_version ON agent_metrics(agent_version_id);
```

---

### 3.3 Tabela: `agent_conversations` (A CRIAR)

```sql
CREATE TABLE agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_version_id UUID REFERENCES agent_versions(id) NOT NULL,

  -- Identificacao
  contact_id VARCHAR(100),                        -- ID do lead no GHL
  conversation_id VARCHAR(255),                   -- ID da conversa no canal
  channel VARCHAR(50),                            -- whatsapp, instagram, messenger

  -- Status
  status VARCHAR(50) DEFAULT 'ativa',             -- ativa, encerrada, escalada
  outcome VARCHAR(50),                            -- agendou, desqualificado, nutrir, escalado

  -- Metricas
  mensagens_total INT DEFAULT 0,
  duracao_minutos INT,
  objecoes_detectadas INT DEFAULT 0,

  -- Resultado
  agendou_consulta BOOLEAN DEFAULT false,
  consulta_id UUID,                               -- ID se agendou
  escalou_para VARCHAR(255),                      -- Nome se escalou
  motivo_escalacao TEXT,

  -- Timestamps
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,

  -- Dados
  summary TEXT,                                   -- Resumo da conversa
  objecoes_json JSONB,                            -- Lista de objecoes detectadas
  qualificacao_json JSONB                         -- Dados de qualificacao coletados
);
```

---

## 4. WORKFLOW: AGENT FACTORY

### 4.1 Trigger Options

**Opcao A: Webhook (recomendado)**
- Call Analyzer Onboarding chama webhook no final
- Mais rapido, processamento imediato

**Opcao B: Poll Supabase**
- Poll a cada X minutos
- Query: `SELECT * FROM call_recordings WHERE status = 'analisado' AND agent_created = false`

### 4.2 Fluxo Detalhado

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AGENT FACTORY WORKFLOW                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. TRIGGER                                                                 │
│     - Webhook POST /agent-factory/create                                    │
│     - Body: { call_recording_id, contact_id, location_id }                  │
│                                                                              │
│  2. BUSCAR DADOS                                                            │
│     - Supabase: call_recordings (pega analise_json)                         │
│     - Supabase: locations (pega api_key, association_id)                    │
│                                                                              │
│  3. REFINAR SYSTEM PROMPT (usar skill conversational-bot-prompt-engineer)   │
│     - Input: agent_config do Call Analyzer                                  │
│     - Aplica CRITICS framework                                              │
│     - Output: system_prompt otimizado                                       │
│                                                                              │
│  4. CRIAR VERSAO NO SUPABASE                                                │
│     - INSERT em agent_versions                                              │
│     - version = 'v1.0'                                                      │
│     - status = 'pending_approval' ou 'active' (config)                      │
│                                                                              │
│  5. CRIAR CUSTOM OBJECT "Agentes" NO GHL                                    │
│     - POST /objects/custom_objects.agentes/records                          │
│     - Campos: nome_agente, cliente_nome, versao_atual, status               │
│                                                                              │
│  6. ASSOCIAR AGENTE AO CONTATO                                              │
│     - POST /associations/relations                                          │
│     - Contact <-> Agente                                                    │
│                                                                              │
│  7. ATUALIZAR SUPABASE                                                      │
│     - UPDATE call_recordings SET agent_created = true                       │
│     - UPDATE agent_versions SET ghl_custom_object_id = '{id}'               │
│                                                                              │
│  8. NOTIFICAR CS (opcional)                                                 │
│     - Slack/WhatsApp: "Agente {nome} criado para {cliente}"                 │
│     - Link para revisar/aprovar                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. COMO O AI AGENT ALIMENTA OS CUSTOM OBJECTS

### 5.1 Durante Conversa com Lead

O AI Agent conversacional (que roda no n8n ou GHL Conversations AI) deve:

**A) Detectar Objecao:**
```javascript
// Quando detecta objecao na mensagem do lead
if (objecao_detectada) {
  // HTTP POST para GHL Custom Object
  POST /objects/custom_objects.objecoes/records
  {
    "locationId": location_id,
    "properties": {
      "tipo": "preco",
      "intensidade": "alta",
      "contexto": "Lead disse: 'Achei muito caro'",
      "resposta_usada": "Mostrei parcelamento e ROI",
      "resultado": "tratada"
    }
  }

  // Associar ao contato
  POST /associations/relations
}
```

**B) Agendar Consulta:**
```javascript
// Quando agenda consulta
POST /objects/custom_objects.consultas/records
{
  "locationId": location_id,
  "properties": {
    "data_consulta": "2025-01-15",
    "status": "agendada",
    "procedimento": "Avaliacao",
    "origem": "WhatsApp",
    "tempo_qualificacao": 12,
    "mensagens_trocadas": 23
  }
}
```

**C) Registrar Metricas:**
```javascript
// Ao final de cada conversa
// Incrementa metricas diarias no Supabase
UPDATE agent_metrics
SET total_conversas = total_conversas + 1,
    consultas_agendadas = consultas_agendadas + (agendou ? 1 : 0)
WHERE agent_version_id = '{id}' AND data = CURRENT_DATE
```

---

## 6. STATUS DE IMPLEMENTACAO

### Fase 1: Infraestrutura ✅ COMPLETA
1. [x] Criar Custom Object "Agentes" no GHL (10 campos)
2. [x] Criar Custom Object "Revisoes de Agente" no GHL (7 campos)
3. [x] Criar tabela `agent_versions` no Supabase
4. [x] Criar tabela `agent_metrics` no Supabase
5. [x] Criar tabela `agent_conversations` no Supabase
6. [x] Criar tabela `agent_conversation_messages` no Supabase
7. [x] Criar associacao Contact <-> Agentes no GHL (ID: 6943cca19794d70a16b01941)

### Fase 2: Agent Factory ✅ COMPLETA
8. [x] Criar workflow Agent Factory (n8n) - `Agent-Factory.json`
9. [x] Poll a cada 5 min por calls pendentes
10. [x] Criar agent_version no Supabase
11. [x] Criar Custom Object Agentes no GHL
12. [x] Associar Agente ao Contato
13. [x] Testar criacao de agente (testado: f81d3ede-3a43-4d5a-acbc-a36f3535378b)

### Fase 3: AI Agent Conversacional ✅ COMPLETA
14. [x] Criar workflow AI Agent Conversacional - `AI-Agent-Conversacional.json`
15. [x] Webhook para receber mensagens (GHL + WhatsApp)
16. [x] Buscar agente ativo por location
17. [x] Carregar config dinamica (system_prompt, tools, compliance)
18. [x] Buscar historico de conversa
19. [x] Chamar IA com tools (OpenAI)
20. [x] Implementar tool execution loop
21. [x] Detectar objecoes automaticamente
22. [x] Salvar conversa no Supabase
23. [x] Enviar resposta via GHL API

### Fase 4: Revisao ✅ COMPLETA
24. [x] Criar workflow Call Analyzer Revisao - `Call-Analyzer-Revisao.json` v2.0
25. [x] Implementar analise PDCA (Plan-Do-Check-Act)
26. [x] Implementar criacao de versao pending_approval
27. [x] Implementar notificacao CS para aprovacao

### Fase 5: Engenheiro de Prompt ✅ COMPLETA
28. [x] Criar workflow Engenheiro de Prompt - `Engenheiro-de-Prompt.json` v1.0
29. [x] Implementar 7 comandos: listar, ver, editar, historico, rollback, aprovar, rejeitar
30. [x] Implementar AI para aplicar mudancas (Groq llama-3.3-70b)
31. [x] Implementar fluxo de aprovacao unificado

### Fase 6: Banco de Dados ✅ COMPLETA
32. [x] Criar tabela `prompt_change_requests` - registra todas as solicitacoes
33. [x] Adicionar colunas em `agent_versions`: status, contact_id, location_id, approved_by
34. [x] Criar funcoes SQL: approve_prompt_change, reject_prompt_change
35. [x] Criar views: v_pending_prompt_changes, v_prompt_change_history

### Fase 7: Integracao Calendario 🔨 PENDENTE
36. [ ] Integrar tool buscar_disponibilidade com GHL Calendar
37. [ ] Integrar tool agendar_consulta com GHL Appointments

### Fase 8: Interface Web 🔨 PENDENTE
38. [ ] Criar paginas no mottivme-command-center para Engenheiro de Prompt
39. [ ] Implementar editor de prompt com diff visual
40. [ ] Implementar dashboard de versoes pendentes

---

## 7. ARQUIVOS DO SISTEMA

### 7.1 Workflows n8n

| Arquivo | Descricao | Status |
|---------|-----------|--------|
| `Call-Analyzer-Onboarding.json` | Analisa kickoff, gera agent_config | ✅ v2.3 |
| `Agent-Factory.json` | Cria agente a partir de config | ✅ v1.0 |
| `AI-Agent-Conversacional.json` | Atende leads usando config do agente | ✅ v1.0 |
| `Call-Analyzer-Revisao.json` | Analisa calls de acompanhamento (PDCA) | ✅ v2.0 |
| `Engenheiro-de-Prompt.json` | Suporte interno para ajustes de prompts | ✅ v1.0 |

### 7.2 Scripts SQL

| Arquivo | Descricao |
|---------|-----------|
| `scripts/supabase-ceo-schema.sql` | Schema principal (clients, agent_versions, call_recordings) |
| `scripts/supabase-prompt-change-requests.sql` | Tabela de solicitacoes de mudanca + funcoes de aprovacao |

---

## 8. COMO ATIVAR UM AGENTE

Apos o Agent Factory criar um agente com status `pending_approval`, o CS deve aprovar:

```sql
UPDATE agent_versions
SET
  status = 'active',
  is_active = true,
  approved_by = 'Nome do CS',
  approved_at = NOW(),
  activated_at = NOW()
WHERE id = '{agent_version_id}';
```

O AI Agent Conversacional busca apenas agentes com `is_active = true` e `status = 'active'`.

---

## 9. COMO TESTAR O AI AGENT

1. Ativar o agente no Supabase (SQL acima)
2. Importar `AI-Agent-Conversacional.json` no n8n
3. Ativar o workflow
4. Configurar webhook no GHL para POST para: `https://n8n.mottivme.com.br/webhook/ai-agent/webhook`
5. Enviar mensagem de teste via WhatsApp

Payload esperado do GHL:
```json
{
  "type": "InboundMessage",
  "contactId": "xxx",
  "locationId": "cd1uyzpJox6XPt4Vct8Y",
  "conversationId": "xxx",
  "body": "Oi, quero saber sobre os tratamentos"
}
```

---

---

## 10. ENGENHEIRO DE PROMPT

### 10.1 Conceito

Sistema de suporte interno para ajustes pontuais em prompts de agentes, sem precisar de call formal de acompanhamento.

### 10.2 Webhook

**URL**: `POST /webhook/engenheiro-prompt`

**Formatos aceitos**:

```json
// Via JSON estruturado
{
  "comando": "editar",
  "cliente": "Dr. Luiz",
  "instrucao": "Adicionar: sempre perguntar sobre alergias"
}

// Via texto (WhatsApp/Slack)
{
  "message": "/prompt editar Dr. Luiz Adicionar: sempre perguntar sobre alergias"
}
```

### 10.3 Comandos Disponiveis

| Comando | Descricao | Exemplo |
|---------|-----------|---------|
| listar | Lista todos os agentes ativos | `/prompt listar` |
| ver | Mostra config atual do agente | `/prompt ver "Dr. Luiz"` |
| editar | Propoe mudanca no prompt | `/prompt editar "Dr. Luiz" "Adicionar: perguntar alergias"` |
| historico | Mostra historico de versoes | `/prompt historico "Dr. Luiz"` |
| rollback | Reativa versao anterior | `/prompt rollback "Dr. Luiz" v1.2` |
| aprovar | Aprova versao pendente | `/prompt aprovar {uuid}` |
| rejeitar | Rejeita versao pendente | `/prompt rejeitar {uuid} motivo` |

### 10.4 Fluxo de Aprovacao

Tanto o Call Analyzer Revisao quanto o Engenheiro de Prompt seguem o mesmo fluxo:

```
Mudanca Proposta
    ↓
Nova agent_version criada
    status: pending_approval
    is_active: false
    ↓
Registro em prompt_change_requests
    ↓
Notificacao para CS
    ↓
CS revisa (via comando aprovar/rejeitar)
    ↓
IF aprova:
    ├─► UPDATE is_active=true, status=active
    ├─► Desativa versao anterior automaticamente
    └─► Notifica "Agente atualizado"
ELSE:
    └─► UPDATE status=rejected
```

### 10.5 Seguranca

- **NUNCA** aplica mudanca diretamente
- **SEMPRE** cria versao com status `pending_approval`
- Requer aprovacao explicita via comando `aprovar`
- Registra quem solicitou e quem aprovou em `prompt_change_requests`

---

## 11. TABELA prompt_change_requests

### 11.1 Campos Principais

| Campo | Tipo | Descricao |
|-------|------|-----------|
| agent_version_id | UUID | Versao criada (pending_approval) |
| previous_version_id | UUID | Versao anterior |
| requested_by | VARCHAR | Quem solicitou |
| request_type | VARCHAR | revisao, suporte, hotfix, rollback, novo |
| request_source | VARCHAR | call_analyzer_revisao, engenheiro_webhook, etc |
| changes_summary | TEXT | Resumo legivel das mudancas |
| changes_json | JSONB | Diff detalhado |
| pdca_analysis | JSONB | Analise PDCA (se vier do Revisao) |
| impact_level | VARCHAR | low, medium, high, critical |
| status | VARCHAR | pending, approved, rejected, expired, cancelled |
| reviewed_by | VARCHAR | Quem aprovou/rejeitou |
| reviewed_at | TIMESTAMP | Quando foi revisado |

### 11.2 Views Uteis

- `v_pending_prompt_changes` - Solicitacoes pendentes com detalhes do cliente
- `v_prompt_change_history` - Historico completo de mudancas por cliente

### 11.3 Funcoes SQL

- `approve_prompt_change(request_id, reviewed_by)` - Aprova e ativa a versao
- `reject_prompt_change(request_id, reviewed_by, reason)` - Rejeita a versao

---

*Documento criado em: 18/12/2025*
*Versao: 2.1*
*Autor: Claude + Marcos*

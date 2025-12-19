# PRODUTO-ASSEMBLY-LINE.md
> Sistema de orquestracao de agentes de IA para vendas

---

## 1. VISAO GERAL

### O que e o Assembly Line
Plataforma que conecta multiplos agentes de IA especializados em uma "linha de montagem" de vendas, onde cada agente tem uma funcao especifica no funil.

### Proposta de Valor
> "Transforme seu funil de vendas em uma fabrica automatizada de conversoes"

### Status
- **Fase:** MVP em desenvolvimento
- **Prioridade:** Alta
- **Stack:** n8n + Supabase + GHL + OpenAI

---

## 2. ARQUITETURA

### Conceito da Linha de Montagem
```
┌─────────────────────────────────────────────────────────────────┐
│                    ASSEMBLY LINE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LEAD    →  [PROSPECTOR]  →  [QUALIFIER]  →  [SCHEDULER]       │
│              (Prospecta)      (Qualifica)     (Agenda)         │
│                                                                 │
│            →  [PRESENTER]  →  [CLOSER]  →  [ONBOARDER]         │
│               (Apresenta)     (Fecha)       (Integra)          │
│                                                                 │
│            →  [RETAINER]  →  [ADVOCATE]                        │
│               (Retem)        (Indica)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Agentes Especializados

| Agente | Funcao | Input | Output |
|--------|--------|-------|--------|
| Prospector | Encontra e aborda leads | Lista de prospects | Leads contatados |
| Qualifier | Aplica criterios BANT/NEPQ | Lead contatado | Lead qualificado (score) |
| Scheduler | Agenda reunioes | Lead qualificado | Reuniao agendada |
| Presenter | Apresenta solucao | Reuniao | Proposta enviada |
| Closer | Fecha negociacao | Proposta | Deal fechado |
| Onboarder | Faz onboarding | Cliente novo | Cliente ativo |
| Retainer | Mantem engajamento | Cliente ativo | Cliente retido |
| Advocate | Gera indicacoes | Cliente satisfeito | Novos leads |

---

## 3. COMPONENTES TECNICOS

### Backend (n8n)
```
/Fluxos n8n/Assembly Line/
├── orchestrator.json       # Coordena todos os agentes
├── prospector-agent.json   # Prospecção automatica
├── qualifier-agent.json    # Qualificação com IA
├── scheduler-agent.json    # Agendamento inteligente
├── presenter-agent.json    # Apresentação de propostas
├── closer-agent.json       # Fechamento e objeções
├── onboarder-agent.json    # Onboarding automatico
├── retainer-agent.json     # Retenção e upsell
└── advocate-agent.json     # Sistema de indicações
```

### Database (Supabase)
```sql
-- Tabela principal de leads
CREATE TABLE assembly_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT,           -- ID do CRM (GHL)
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    current_stage TEXT,         -- Estagio atual na linha
    score INT DEFAULT 0,        -- Score de qualificação
    agent_history JSONB,        -- Historico de interações por agente
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de interações
CREATE TABLE assembly_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES assembly_leads(id),
    agent TEXT NOT NULL,        -- Nome do agente
    action TEXT NOT NULL,       -- Ação executada
    input JSONB,                -- Dados de entrada
    output JSONB,               -- Resultado
    success BOOLEAN,
    duration_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de metricas
CREATE TABLE assembly_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period DATE NOT NULL,
    agent TEXT NOT NULL,
    total_processed INT DEFAULT 0,
    successful INT DEFAULT 0,
    failed INT DEFAULT 0,
    avg_duration_ms INT,
    conversion_rate DECIMAL(5,2)
);
```

### API Routes (se Next.js)
```
/api/assembly/
├── leads/
│   ├── POST   - Criar lead
│   ├── GET    - Listar leads
│   └── [id]/
│       ├── GET    - Detalhes do lead
│       ├── PUT    - Atualizar lead
│       └── DELETE - Remover lead
├── agents/
│   ├── GET    - Status dos agentes
│   └── [name]/
│       └── POST   - Executar agente manualmente
├── metrics/
│   ├── GET    - Dashboard de metricas
│   └── [agent]/ - Metricas por agente
└── webhooks/
    ├── ghl/       - Eventos do GHL
    └── n8n/       - Callbacks do n8n
```

---

## 4. FLUXO DE EXECUCAO

### Ciclo de Vida do Lead
```
1. ENTRADA
   - Webhook do GHL (novo lead)
   - Importação manual
   - Prospecção ativa

2. PROCESSAMENTO
   - Prospector identifica e aborda
   - Qualifier aplica BANT/NEPQ
   - Score calculado (1-100)

3. QUALIFICADO (score >= 70)
   - Scheduler oferece horarios
   - Reunião agendada

4. REUNIAO
   - Presenter conduz
   - Proposta gerada

5. NEGOCIACAO
   - Closer maneja objeções
   - Follow-up automatico

6. FECHAMENTO
   - Pagamento processado
   - Onboarder assume

7. RETENCAO
   - Retainer monitora engajamento
   - Advocate solicita indicações
```

### Orquestração
```javascript
// Exemplo de orquestração
const processLead = async (lead) => {
  const pipeline = [
    { agent: 'prospector', condition: !lead.contacted },
    { agent: 'qualifier', condition: !lead.qualified },
    { agent: 'scheduler', condition: lead.score >= 70 && !lead.scheduled },
    { agent: 'presenter', condition: lead.scheduled && !lead.presented },
    { agent: 'closer', condition: lead.presented && !lead.closed },
    { agent: 'onboarder', condition: lead.closed && !lead.onboarded }
  ];

  for (const step of pipeline) {
    if (step.condition) {
      await executeAgent(step.agent, lead);
      break; // Proximo passo na proxima iteração
    }
  }
};
```

---

## 5. CONFIGURACAO DOS AGENTES

### Prospector Agent
```yaml
name: Prospector
trigger: manual / schedule
input:
  - lista de prospects (CSV, API)
  - criterios de filtragem
actions:
  - buscar dados complementares
  - enviar primeira mensagem
  - registrar interação
output:
  - lead criado no sistema
  - status: contacted
kpis:
  - taxa de resposta
  - custo por lead contatado
```

### Qualifier Agent
```yaml
name: Qualifier
trigger: lead_contacted
input:
  - dados do lead
  - historico de mensagens
actions:
  - analisar respostas
  - aplicar criterios BANT
  - calcular score
  - fazer perguntas NEPQ
output:
  - score (1-100)
  - motivo da pontuação
  - próximo passo recomendado
kpis:
  - taxa de qualificação
  - precisão do score
```

### Scheduler Agent
```yaml
name: Scheduler
trigger: lead_qualified (score >= 70)
input:
  - dados do lead
  - disponibilidade do calendar
actions:
  - oferecer horarios
  - confirmar agendamento
  - enviar lembretes
output:
  - reunião agendada
  - evento no calendar
kpis:
  - taxa de agendamento
  - taxa de comparecimento
```

### Closer Agent
```yaml
name: Closer
trigger: proposal_sent
input:
  - proposta enviada
  - objeções do lead
  - historico completo
actions:
  - identificar objeção
  - aplicar técnica de fechamento
  - oferecer alternativas
  - processar pagamento
output:
  - deal fechado ou perdido
  - motivo (se perdido)
kpis:
  - taxa de fechamento
  - ticket médio
  - ciclo de vendas
```

---

## 6. INTEGRACAO GHL

### Custom Objects
```javascript
// Objeto personalizado no GHL
const assemblyLineObject = {
  name: "Assembly Line Status",
  fields: [
    { name: "current_agent", type: "dropdown" },
    { name: "score", type: "number" },
    { name: "last_interaction", type: "datetime" },
    { name: "stage_duration", type: "number" },
    { name: "conversion_probability", type: "percentage" }
  ]
};
```

### Webhooks
```
# GHL → Assembly Line
POST /webhook/ghl/new-lead
POST /webhook/ghl/status-change
POST /webhook/ghl/message-received

# Assembly Line → GHL
PUT /contacts/{id}/custom-fields
POST /contacts/{id}/notes
POST /contacts/{id}/tasks
```

---

## 7. METRICAS E DASHBOARD

### KPIs por Agente
```
┌─────────────────────────────────────────────────────────────────┐
│                 ASSEMBLY LINE DASHBOARD                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROSPECTOR         QUALIFIER          SCHEDULER               │
│  ─────────────      ───────────       ──────────               │
│  Contatados: 500    Qualificados: 200  Agendados: 150          │
│  Taxa: 40%          Taxa: 40%          Taxa: 75%               │
│                                                                 │
│  PRESENTER          CLOSER             ONBOARDER               │
│  ──────────         ────────           ──────────              │
│  Apresentou: 120    Fechou: 48         Onboarded: 45           │
│  Taxa: 80%          Taxa: 40%          Taxa: 94%               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  FUNIL GERAL                                                   │
│  ────────────                                                  │
│  Leads: 500 → Qualif: 200 → Agenda: 150 → Fechou: 48          │
│  Conversao Total: 9.6%                                         │
│  Receita: R$ 480.000 | Ticket Médio: R$ 10.000                │
└─────────────────────────────────────────────────────────────────┘
```

### Alertas
- Agente com taxa abaixo da meta
- Lead parado em estágio > 48h
- Erro de execução de agente
- Score de qualidade baixo

---

## 8. ROADMAP

### MVP (Atual)
- [ ] Orchestrator base
- [ ] Qualifier Agent
- [ ] Scheduler Agent
- [ ] Dashboard básico
- [ ] Integração GHL

### V1.0
- [ ] Todos os 8 agentes
- [ ] Dashboard avançado
- [ ] Configuração por cliente
- [ ] A/B testing de mensagens

### V2.0
- [ ] Multi-tenant (SaaS)
- [ ] Marketplace de agentes
- [ ] IA treinável por cliente
- [ ] Relatórios avançados

---

## 9. CREDENCIAIS NECESSARIAS

```yaml
# Supabase
SUPABASE_URL: # Ver CREDENCIAIS-MASTER.md
SUPABASE_ANON_KEY:
SUPABASE_SERVICE_KEY:

# GHL
GHL_LOCATION_ID:
GHL_API_KEY:

# OpenAI
OPENAI_API_KEY:

# n8n
N8N_WEBHOOK_URL:
```

---

## 10. ARQUIVOS RELACIONADOS

```
/n8n-workspace/
├── Fluxos n8n/Assembly Line/     # Workflows dos agentes
├── prompts/assembly/              # Prompts dos agentes
└── templates/assembly/            # Templates de mensagens

/MOTTIVME SALES TOTAL/
├── CONTEXTOS/PRODUTOS/PRODUTO-ASSEMBLY-LINE.md  # Este arquivo
└── CREDENCIAIS/CREDENCIAIS-MASTER.md            # Credenciais
```

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

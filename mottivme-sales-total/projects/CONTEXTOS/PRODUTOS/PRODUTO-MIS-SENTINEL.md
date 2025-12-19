# PRODUTO-MIS-SENTINEL.md
> Sistema de monitoramento e inteligencia para gestao de vendas e operacoes

---

## 1. VISAO GERAL

### O que e o MIS Sentinel
**MIS = Management Information System**

Plataforma de monitoramento em tempo real que centraliza dados de todas as operacoes de vendas, marketing e atendimento, gerando alertas e insights acionaveis.

### Proposta de Valor
> "Nunca mais seja pego de surpresa - saiba tudo que acontece no seu negócio em tempo real"

### Status
- **Fase:** Planejamento
- **Prioridade:** Media-Alta
- **Stack Planejada:** Next.js + Supabase + n8n + Integrações

---

## 2. PROBLEMA QUE RESOLVE

### Dores do Cliente
```
❌ Dados espalhados em várias ferramentas
❌ Demora para perceber problemas
❌ Relatórios manuais demorados
❌ Falta de visibilidade em tempo real
❌ Decisões baseadas em "achismo"
❌ Equipe perdendo oportunidades quentes
```

### Solução MIS Sentinel
```
✅ Dashboard unificado
✅ Alertas em tempo real
✅ Relatórios automáticos
✅ KPIs sempre atualizados
✅ Insights de IA
✅ Notificações inteligentes
```

---

## 3. FUNCIONALIDADES PLANEJADAS

### Core Features
```
┌─────────────────────────────────────────────────────────────────┐
│                     MIS SENTINEL                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] COMMAND CENTER      [2] ALERT ENGINE                      │
│      - Dashboard em          - Regras customizáveis           │
│        tempo real            - Multi-canal (WhatsApp,         │
│      - KPIs principais         Email, Slack)                  │
│      - Drill-down             - Escalação automática          │
│                                                                 │
│  [3] DATA FUSION         [4] INSIGHT ENGINE                    │
│      - Conecta GHL           - Análise de IA                  │
│      - Conecta Supabase      - Previsões                      │
│      - Conecta n8n           - Anomalias                      │
│      - APIs externas         - Recomendações                  │
│                                                                 │
│  [5] REPORT FACTORY      [6] HEALTH MONITOR                    │
│      - Relatórios            - Status dos sistemas            │
│        automáticos           - Uptime monitoring              │
│      - Agendados             - Error tracking                 │
│      - Customizáveis         - Performance metrics            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detalhamento

#### 1. Command Center (Dashboard)
```
┌─────────────────────────────────────────────────────────────────┐
│                    COMMAND CENTER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HOJE           ESTA SEMANA      ESTE MÊS                      │
│  ─────          ───────────      ────────                      │
│  Leads: 45      Leads: 234       Leads: 1.023                  │
│  Calls: 12      Calls: 67        Calls: 289                    │
│  Fechou: 3      Fechou: 18       Fechou: 76                    │
│  Revenue: 15k   Revenue: 90k     Revenue: 380k                 │
│                                                                 │
│  🔴 ALERTAS ATIVOS (3)                                         │
│  ────────────────────                                          │
│  • Lead quente há 2h sem follow-up                             │
│  • Taxa de no-show acima do normal (35%)                       │
│  • Workflow "Lembrete 24h" com erro                            │
│                                                                 │
│  📊 FUNIL TEMPO REAL                                           │
│  ──────────────────                                            │
│  Lead [████████████████████] 100                               │
│  Qualif [██████████████     ] 70                               │
│  Agenda [██████████         ] 50                               │
│  Call [███████             ] 35                                │
│  Prop [█████               ] 25                                │
│  Fechou [███                ] 15                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2. Alert Engine
```yaml
alert_types:
  - lead_quente:
      condition: score > 80 AND last_contact > 1h
      channels: [whatsapp, slack]
      priority: high

  - no_show_alto:
      condition: no_show_rate > 30%
      channels: [email, slack]
      priority: medium

  - workflow_erro:
      condition: error_count > 3 in 1h
      channels: [slack, email]
      priority: critical
      escalate_to: technical

  - meta_risco:
      condition: current < target * 0.7 AND days_remaining < 10
      channels: [slack]
      priority: high
```

#### 3. Data Fusion (Integrações)
```
FONTES DE DADOS:
├── GoHighLevel
│   ├── Contacts
│   ├── Opportunities
│   ├── Conversations
│   └── Calendars
├── Supabase
│   ├── Custom tables
│   └── Analytics
├── n8n
│   ├── Workflow stats
│   └── Execution logs
├── WhatsApp (Evolution)
│   ├── Messages
│   └── Conversations
├── Meta Ads
│   ├── Spend
│   ├── Leads
│   └── CPL
└── Google Analytics
    ├── Traffic
    └── Conversions
```

#### 4. Insight Engine (IA)
```javascript
// Tipos de insights gerados
const insightTypes = {
  anomaly: "Taxa de conversão caiu 25% vs semana passada",
  prediction: "Baseado no ritmo atual, meta será atingida em D+5",
  recommendation: "Leads da fonte X convertem 40% mais - aumentar budget",
  correlation: "Leads que respondem em <1h fecham 3x mais",
  alert: "SDR João está 30% abaixo da média - verificar"
};
```

#### 5. Report Factory
```
RELATÓRIOS AUTOMÁTICOS:
├── Daily
│   ├── Resumo do dia
│   └── Alertas pendentes
├── Weekly
│   ├── Performance por SDR
│   ├── Funil completo
│   └── ROI por fonte
├── Monthly
│   ├── Executive summary
│   ├── Comparativo metas
│   └── Forecast próximo mês
└── Custom
    ├── Sob demanda
    └── Exportável (PDF, Excel)
```

#### 6. Health Monitor
```
SISTEMAS MONITORADOS:
├── n8n Workflows
│   ├── Status: ✅ Running
│   ├── Errors: 0
│   └── Last run: 2 min ago
├── GHL Webhooks
│   ├── Status: ✅ Active
│   ├── Queue: 0
│   └── Latency: 150ms
├── Supabase
│   ├── Status: ✅ Online
│   ├── Connections: 12/100
│   └── Storage: 45%
└── WhatsApp
    ├── Status: ✅ Connected
    ├── Session: Active
    └── Queue: 3 msgs
```

---

## 4. ARQUITETURA TECNICA

### Stack Planejada
```
Frontend:     Next.js 15 + TypeScript + Tailwind
Dashboard:    Tremor / Recharts
Backend:      Next.js API Routes
Database:     Supabase PostgreSQL
Queue:        Supabase Edge Functions
Alerts:       n8n workflows
Integrations: REST APIs + Webhooks
```

### Database Schema (Planejado)
```sql
-- Métricas agregadas
CREATE TABLE metrics_hourly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP,
    source TEXT,  -- 'ghl', 'ads', 'whatsapp'
    metric_type TEXT,  -- 'leads', 'calls', 'revenue'
    value DECIMAL,
    metadata JSONB
);

-- Alertas
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT,
    severity TEXT,  -- 'low', 'medium', 'high', 'critical'
    title TEXT,
    description TEXT,
    data JSONB,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Regras de alerta
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    condition JSONB,  -- { field, operator, value }
    channels TEXT[],  -- ['whatsapp', 'slack', 'email']
    priority TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP
);

-- Status dos sistemas
CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_name TEXT,
    status TEXT,  -- 'healthy', 'degraded', 'down'
    metrics JSONB,
    last_check TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insights de IA
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT,  -- 'anomaly', 'prediction', 'recommendation'
    title TEXT,
    description TEXT,
    data JSONB,
    actionable BOOLEAN,
    action_taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Fluxo de Dados
```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA PIPELINE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [SOURCES]           [PROCESSING]         [OUTPUT]             │
│                                                                 │
│  GHL ──────┐                                                    │
│  Supabase ─┼──→ [Data Fusion] ──→ [Analytics] ──→ Dashboard    │
│  n8n ──────┤            │                  │                   │
│  Meta Ads ─┤            │                  │                   │
│  WhatsApp ─┘            ↓                  ↓                   │
│                   [Alert Engine]    [Insight Engine]           │
│                         │                  │                   │
│                         ↓                  ↓                   │
│                   [Notifications]    [Recommendations]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. CASOS DE USO

### 1. Alerta de Lead Quente
```
TRIGGER: Lead com score > 80 por mais de 1 hora sem contato
ACTION:
  1. WhatsApp para SDR responsável
  2. Notificação no Slack do time
  3. Criar task no GHL
MESSAGE:
  "🔥 LEAD QUENTE: João Silva (Score 85)
   Vendo proposta há 45 min
   Último contato: há 3 dias
   → Ligar AGORA"
```

### 2. Anomalia de No-Show
```
TRIGGER: Taxa de no-show > 30% nas últimas 24h
ACTION:
  1. Email para gestor
  2. Slack no canal de operações
  3. Gerar relatório detalhado
MESSAGE:
  "⚠️ ANOMALIA DETECTADA
   No-show rate: 35% (média: 22%)
   Agendamentos afetados: 7 de 20
   Possíveis causas:
   - Lembretes não enviados (verificar workflow)
   - Horários específicos (13h-15h tem 50% no-show)"
```

### 3. Previsão de Meta
```
TRIGGER: Daily at 9am
ACTION:
  1. Calcular projeção
  2. Enviar resumo
MESSAGE:
  "📊 FORECAST DO MÊS
   Meta: R$ 500.000
   Atual: R$ 320.000 (64%)
   Projeção: R$ 485.000 (97%)

   Status: 🟡 Em risco
   Recomendação: Aumentar calls em 20%"
```

---

## 6. MODELO DE NEGOCIO

### Planos (Planejados)
```
STARTER           BUSINESS          ENTERPRISE
R$ 297/mês        R$ 597/mês        Sob consulta

- 1 dashboard     - 5 dashboards    - Ilimitado
- 5 alertas       - Ilimitado       - White label
- 3 integrações   - 10 integrações  - API completa
- Relatório       - Relatórios      - Customizações
  semanal          diários          - SLA
- Email support   - Chat support    - Suporte dedicado
```

---

## 7. ROADMAP

### MVP (3 meses)
- [ ] Dashboard básico com GHL
- [ ] 5 alertas pré-configurados
- [ ] Relatório semanal automático
- [ ] Health check de sistemas

### V1.0 (6 meses)
- [ ] Todas integrações core
- [ ] Alert engine customizável
- [ ] Insight engine básico
- [ ] App mobile (notificações)

### V2.0 (12 meses)
- [ ] Previsões avançadas (ML)
- [ ] Multi-tenant
- [ ] API pública
- [ ] Marketplace de integrações

---

## 8. INTEGRACAO COM OUTROS PRODUTOS

```
┌─────────────────────────────────────────────────────────────────┐
│                  ECOSSISTEMA MOTTIVME                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ASSEMBLY LINE ──→ MIS SENTINEL ←── PROPOSTAL                  │
│  (dados de agentes)    │         (dados de propostas)          │
│                        │                                        │
│  ELETRIFY ────────────→│←─────── SOCIALFY                      │
│  (performance copy)    │      (métricas social)                │
│                        │                                        │
│                        ↓                                        │
│               [COMMAND CENTER]                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. PROXIMOS PASSOS

### Para iniciar
1. Definir MVP mínimo viável
2. Mapear integrações prioritárias
3. Design do dashboard principal
4. Setup projeto Next.js
5. Criar conectores GHL e Supabase
6. Beta com clientes internos

### Perguntas em aberto
- Começar com quantas integrações?
- Dashboard web-first ou mobile-first?
- Self-service ou setup assistido?

---

*Documento criado em: Dezembro 2025*
*Status: Planejamento*

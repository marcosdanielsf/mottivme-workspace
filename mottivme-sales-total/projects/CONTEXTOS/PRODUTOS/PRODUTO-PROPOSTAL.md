# PRODUTO-PROPOSTAL.md
> SaaS de propostas comerciais interativas com rastreamento de comportamento

---

## 1. VISAO GERAL

### O que e o Propostal
Plataforma SaaS para criar propostas comerciais interativas que rastreiam o comportamento do lead, calculam score de interesse e alertam quando o lead está "quente".

### Proposta de Valor
> "Saiba EXATAMENTE quando seu lead está pronto para comprar"

### Status
- **Fase:** MVP desenvolvido
- **Prioridade:** Alta
- **Stack:** Next.js 15 + Supabase + OpenAI
- **URL Dev:** http://localhost:3000

---

## 2. FUNCIONALIDADES

### Core Features
```
┌─────────────────────────────────────────────────────────────────┐
│                       PROPOSTAL                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] PORTAL INTERATIVO    [2] BEHAVIOR TRACKING                │
│      - Design imersivo        - Scroll depth                   │
│      - Capítulos clicáveis    - Time on page                   │
│      - Animações              - Clicks por seção               │
│      - Áudio/narração         - Mouse movements                │
│                                                                 │
│  [3] INTEREST SCORE       [4] LUNA AI CHAT                     │
│      - Score 0-100           - Chat com IA                     │
│      - Baseado em             - Responde dúvidas               │
│        comportamento          - Coleta objeções               │
│      - Atualização real-time  - Agenda reunião                │
│                                                                 │
│  [5] ALERTS               [6] DASHBOARD                        │
│      - Lead quente           - Métricas por proposta          │
│      - Proposta aberta        - Conversão                     │
│      - Tempo > threshold      - Comparativos                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detalhamento

#### 1. Portal Interativo
- Cursor customizado (dourado)
- Partículas flutuantes
- Transições cinematográficas
- Sistema de fases/capítulos
- Narração automática por seção
- Easter eggs (Konami Code)
- Progress bar de leitura
- Cards expandíveis

#### 2. Behavior Tracking
```javascript
// Eventos rastreados
const trackedEvents = {
  page_view: { timestamp, referrer },
  scroll_depth: { percentage, section },
  time_on_page: { seconds, section },
  click: { element, section, position },
  hover: { element, duration },
  chat_open: { timestamp },
  chat_message: { content, isUser },
  proposal_section_view: { section, duration },
  cta_click: { ctaId, position }
};
```

#### 3. Interest Score (0-100)
```javascript
// Cálculo do score
const calculateScore = (events) => {
  let score = 0;

  // Tempo na página (max 30 pontos)
  score += Math.min(events.timeOnPage / 60 * 5, 30);

  // Scroll depth (max 20 pontos)
  score += events.scrollDepth * 0.2;

  // Cliques em seções (max 15 pontos)
  score += Math.min(events.sectionClicks * 3, 15);

  // Interação com chat (max 20 pontos)
  score += events.chatMessages * 4;

  // CTA clicks (max 15 pontos)
  score += events.ctaClicks * 5;

  return Math.min(score, 100);
};

// Thresholds
const thresholds = {
  cold: 0-30,
  warm: 31-60,
  hot: 61-80,
  burning: 81-100
};
```

#### 4. Luna AI Chat
```yaml
name: Luna
role: Assistente de vendas na proposta
personality:
  - Prestativa
  - Conhecedora do produto
  - Persuasiva mas não agressiva
capabilities:
  - Responder dúvidas sobre a proposta
  - Coletar objeções
  - Agendar reunião
  - Aplicar gatilhos Sexy Canvas
restrictions:
  - Não dar descontos sem aprovação
  - Não fazer promessas fora do escopo
```

#### 5. Alertas
- **Lead quente:** Score > 80
- **Proposta aberta:** Notificação imediata
- **Tempo alto:** > 10 min na proposta
- **Volta à proposta:** Lead retornando
- **Chat ativo:** Conversa em andamento

---

## 3. ARQUITETURA TECNICA

### Localizacao no Monorepo
```
mottivme-platform/
├── apps/
│   └── propostal/           # Este produto
│       ├── src/
│       │   ├── app/         # App Router
│       │   ├── components/  # Componentes React
│       │   ├── lib/         # Utilitários
│       │   └── types/       # TypeScript types
│       └── package.json
```

### Database Schema
```sql
-- Propostas
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    client_name TEXT,
    client_email TEXT,
    status TEXT DEFAULT 'draft', -- draft, sent, viewed, accepted, rejected
    content JSONB,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Sessões de visualização
CREATE TABLE proposal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id),
    visitor_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_seconds INT,
    interest_score INT DEFAULT 0
);

-- Eventos de comportamento
CREATE TABLE proposal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES proposal_sessions(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Mensagens do chat
CREATE TABLE proposal_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES proposal_sessions(id),
    role TEXT, -- 'user' ou 'assistant'
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alertas
CREATE TABLE proposal_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id),
    alert_type TEXT,
    data JSONB,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Routes
```
/api/proposals/
├── POST   - Criar proposta
├── GET    - Listar propostas
└── [id]/
    ├── GET    - Detalhes
    ├── PUT    - Atualizar
    ├── DELETE - Remover
    ├── /send  - Enviar para cliente
    ├── /track - Receber eventos
    └── /chat  - Chat com Luna

/api/analytics/
├── GET    - Dashboard geral
└── [proposalId]/ - Métricas da proposta
```

---

## 4. PORTAL IMERSIVO (Sexy Canvas)

### Sistema de Fases
```
FASE 0: INTRO
├── Cursor customizado
├── Partículas flutuantes
├── Voz robótica + risada sarcástica
└── Gatilhos: Curiosidade 🔥🔥🔥🔥🔥, Luxúria 🔥🔥🔥🔥

FASE 1: AVISO
├── "Esta proposta é diferente"
├── Prepara para experiência imersiva
└── Gatilhos: Segurança 🔥🔥🔥🔥, Curiosidade 🔥🔥🔥🔥🔥

FASE 2: EVOLUÇÃO
├── Timeline animada
├── De onde você está → Onde pode chegar
└── Gatilhos: Inveja 🔥🔥🔥🔥🔥, Avareza 🔥🔥🔥🔥🔥

FASE 3: LOGIN
├── Convite formal personalizado
├── Credenciais exclusivas
└── Gatilhos: Vaidade 🔥🔥🔥🔥🔥, Amor 🔥🔥🔥🔥🔥

FASE 4: PROPOSTA
├── Conteúdo completo
├── Opções de investimento
├── Chat com Luna
└── Gatilhos: TODOS convergindo
```

### Credenciais Padrão
```
LOGIN: [nome-do-cliente]
SENHA: UltraVertex
```

### Easter Eggs
```
Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
Recompensa: Código "EXTRAORDINARIO2025" (5% desconto extra)

DevTools: Abrir console (F12)
Mensagem: Dica para mencionar na call
```

---

## 5. INTEGRACAO GHL

### Eventos enviados ao GHL
```javascript
// Webhook para GHL quando score muda
const notifyGHL = async (proposalId, event) => {
  await fetch(`${GHL_WEBHOOK_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      proposalId,
      contactId: proposal.client_ghl_id,
      event: event.type,
      score: event.score,
      timestamp: new Date().toISOString()
    })
  });
};

// Eventos
// - proposal_viewed
// - score_updated
// - chat_started
// - cta_clicked
// - lead_hot (score > 80)
```

### Custom Fields no GHL
```
custom_field_proposal_link
custom_field_proposal_score
custom_field_proposal_status
custom_field_last_viewed
custom_field_time_on_proposal
```

---

## 6. METRICAS

### Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                 PROPOSTAL DASHBOARD                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROPOSTAS ENVIADAS      TAXA DE ABERTURA                      │
│  ─────────────────       ────────────────                      │
│  Este mês: 45            85%                                   │
│  Total: 234              (vs 30% email tradicional)            │
│                                                                 │
│  TEMPO MÉDIO             SCORE MÉDIO                           │
│  ──────────              ───────────                           │
│  12 min 34 seg           67/100                                │
│                                                                 │
│  LEADS QUENTES AGORA                                           │
│  ───────────────────                                           │
│  🔥 João Silva - Score 92 - Vendo agora                        │
│  🔥 Maria Santos - Score 85 - Chat ativo                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Benchmarks Esperados
| Métrica | Proposta Normal | Propostal |
|---------|-----------------|-----------|
| Taxa de abertura | 30% | 85%+ |
| Tempo na proposta | 2 min | 12+ min |
| Taxa de agendamento | 15% | 45%+ |
| Show-rate | 50% | 75%+ |
| Taxa de fechamento | 20% | 40%+ |

---

## 7. MODELO DE NEGOCIO

### Planos (Planejados)
```
STARTER        PRO              ENTERPRISE
R$ 97/mês      R$ 297/mês       Sob consulta

- 10 propostas - 50 propostas   - Ilimitado
- Tracking     - Tracking+      - White label
- Score        - Luna AI        - API
- Alertas      - Alertas+       - Integrações
               - Dashboard      - SLA
```

---

## 8. ARQUIVOS RELACIONADOS

### No Monorepo
```
/n8n-workspace/SAAS/mottivme-platform/
├── apps/propostal/                    # App principal
├── packages/database/migrations/      # Schema SQL
└── .env.local                         # Variáveis de ambiente
```

### Portal Standalone (Sexy Canvas)
```
/n8n-workspace/SAAS/sexy-canvas-system/
├── portal-v2/
│   ├── index.html                     # Portal de entrada (5 fases)
│   └── proposta-v2.html               # Proposta interativa
├── SUPER-PROMPT-SEXY-CANVAS.md        # Prompt para IA
└── MAPA-ELETRIFICACAO.md              # Framework visual
```

### Propostal Standalone (Versão Anterior)
```
/n8n-workspace/SAAS/propostal/
└── ARCHITECTURE.md                    # Arquitetura detalhada
```

---

## 9. SETUP E DEPLOY

### Desenvolvimento Local
```bash
cd /n8n-workspace/SAAS/mottivme-platform
npm install
npm run dev:propostal  # http://localhost:3000
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deploy Vercel
```bash
cd apps/propostal
vercel --prod
```

---

## 10. ROADMAP

### MVP (Atual)
- [x] Portal interativo base
- [x] Sistema de fases
- [x] Tracking básico
- [x] Score de interesse
- [ ] Luna AI Chat
- [ ] Dashboard

### V1.0
- [ ] CRUD de propostas
- [ ] Templates
- [ ] Alertas em tempo real
- [ ] Integração GHL completa

### V2.0
- [ ] Multi-tenant
- [ ] White label
- [ ] A/B testing de propostas
- [ ] Analytics avançado

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

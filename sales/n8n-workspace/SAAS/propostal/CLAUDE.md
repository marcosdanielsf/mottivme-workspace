# CLAUDE.md — Briefing do Projeto Propostal

> Este arquivo serve como contexto para o Claude Code. Leia-o completamente antes de qualquer implementação.

---

## 🎯 O QUE É O PROPOSTAL

**Propostal** é um SaaS B2B que transforma propostas comerciais (PDFs/docs) em **portais interativos** que:

1. **Rastreiam comportamento** do lead (tempo por seção, cliques, revisitas)
2. **Calculam score de interesse** (0-100) em tempo real
3. **Adaptam conteúdo** baseado no comportamento (se ficou muito tempo em "preço", mostra ROI)
4. **Incluem avatar AI (Luna)** que fala o nome do cliente via vídeo personalizado
5. **Têm chat híbrido** (AI responde dúvidas + escala para humano quando necessário)
6. **Enviam alertas** para o vendedor (WhatsApp/Dashboard) quando lead está quente

**Público-alvo:** Mentores, agências, consultores, qualquer negócio que envia propostas para clientes.

**Modelo de negócio:**
- Starter: R$197/mês (self-service)
- Pro: R$497/mês (done-with-you)
- Enterprise: R$1.497/mês (done-for-you)

---

## 🏗️ STACK TECNOLÓGICA

```
FRONTEND:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
├── shadcn/ui (componentes)
├── Zustand (estado)
└── React Query (data fetching)

BACKEND:
├── Supabase (Auth + Database + Realtime + Storage)
├── Edge Functions (Supabase/Vercel)
└── N8N (automações/webhooks)

INTEGRAÇÕES:
├── Stripe (pagamentos)
├── HeyGen ou D-ID + ElevenLabs (avatar Luna)
├── OpenAI GPT-4o-mini (chat Luna)
├── Z-API ou Evolution API (WhatsApp alerts)
└── Resend (emails transacionais)

DEPLOY:
├── Vercel (frontend + API routes)
└── Supabase (banco + auth)
```

---

## 📁 ESTRUTURA DE PASTAS ESPERADA

```
propostal/
├── apps/
│   ├── web/                    # App principal (dashboard + landing)
│   │   ├── app/
│   │   │   ├── (auth)/         # Páginas de login/register
│   │   │   ├── (dashboard)/    # Dashboard logado
│   │   │   │   ├── page.tsx    # Overview
│   │   │   │   ├── leads/      # Lista de leads
│   │   │   │   ├── proposals/  # Gerenciar propostas
│   │   │   │   ├── templates/  # Templates de proposta
│   │   │   │   ├── settings/   # Configurações
│   │   │   │   └── analytics/  # Métricas
│   │   │   ├── (marketing)/    # Landing page pública
│   │   │   └── api/            # API Routes
│   │   │       ├── track/      # Webhook de tracking
│   │   │       ├── chat/       # Endpoint do chat Luna
│   │   │       ├── webhooks/   # Stripe, etc
│   │   │       └── proposals/  # CRUD propostas
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   │
│   └── portal/                 # App do portal de proposta (standalone)
│       ├── app/
│       │   └── [proposalId]/   # Rota dinâmica por proposta
│       └── ...
│
├── packages/
│   ├── database/               # Schema Supabase + tipos
│   ├── ui/                     # Componentes compartilhados
│   └── utils/                  # Funções utilitárias
│
├── supabase/
│   ├── migrations/             # SQL migrations
│   └── functions/              # Edge functions
│
└── docs/
    └── ARCHITECTURE.md         # Documentação técnica
```

---

## 🗄️ BANCO DE DADOS (SUPABASE)

### Tabelas Principais

```sql
-- Empresas (clientes do SaaS)
companies (id, name, email, plan, brand_colors, logo_url, stripe_customer_id, owner_phone, created_at)

-- Propostas
proposals (id, company_id, title, client_name, client_email, content JSONB, template, expiry_date, status, value, video_url, created_at)

-- Leads (quem recebe proposta)
leads (id, proposal_id, name, email, phone, company, score, status, last_activity, total_time_seconds, visit_count, created_at)

-- Eventos de tracking
tracking_events (id, lead_id, proposal_id, event_type, event_data JSONB, created_at)

-- Chat
chat_messages (id, lead_id, sender, message, created_at)

-- Alertas
alerts (id, company_id, lead_id, type, title, message, is_read, created_at)
```

### RLS (Row Level Security)
- Cada empresa só vê seus próprios dados
- Leads são públicos (para o portal funcionar sem auth)
- Tracking events são write-only para o portal

---

## ✅ O QUE JÁ FOI CRIADO (PROTÓTIPOS HTML)

Os seguintes arquivos HTML estáticos foram criados como protótipo visual:

1. **landing/index.html** — Landing page do SaaS
2. **dashboard/index.html** — Dashboard de rastreamento
3. **portal-template/proposal.html** — Template do portal de proposta
4. **docs/ARCHITECTURE.md** — Documentação técnica

> ⚠️ Estes são PROTÓTIPOS. Precisam ser convertidos para Next.js + Supabase.

---

## 🎯 O QUE PRECISA SER IMPLEMENTADO

### FASE 1: Setup Inicial
- [ ] Criar projeto Next.js 14 com TypeScript
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Configurar Supabase (auth + database)
- [ ] Criar migrations SQL
- [ ] Setup variáveis de ambiente

### FASE 2: Autenticação
- [ ] Login/Register com Supabase Auth
- [ ] Onboarding de nova empresa
- [ ] Proteção de rotas (middleware)

### FASE 3: Dashboard
- [ ] Overview com stats (propostas, leads, conversão)
- [ ] Lista de leads com filtros e busca
- [ ] Detalhe do lead (timeline, score, comportamento)
- [ ] CRUD de propostas
- [ ] Gerador de proposta (formulário → portal)

### FASE 4: Portal de Proposta
- [ ] Rota dinâmica /p/[id]
- [ ] Renderização do template com dados do banco
- [ ] Sistema de tracking (enviar eventos para API)
- [ ] Chat widget com Luna
- [ ] Vídeo personalizado (integração HeyGen/D-ID)

### FASE 5: Tracking & Score
- [ ] API route para receber eventos
- [ ] Cálculo de score em tempo real
- [ ] Supabase Realtime para dashboard ao vivo
- [ ] Sistema de alertas (quando score > 70)

### FASE 6: Chat Luna
- [ ] Endpoint de chat com OpenAI
- [ ] Contexto da proposta no prompt
- [ ] Detecção de intenção de compra
- [ ] Escalação para humano (webhook WhatsApp)

### FASE 7: Integrações
- [ ] Stripe Checkout (3 planos)
- [ ] Webhooks Stripe (subscription lifecycle)
- [ ] HeyGen/D-ID para gerar vídeo Luna
- [ ] WhatsApp alerts (Z-API ou Evolution)
- [ ] Emails com Resend

### FASE 8: Polish
- [ ] Templates de proposta pré-prontos
- [ ] Customização de cores/logo por empresa
- [ ] Analytics detalhado
- [ ] Exportar relatórios

---

## 🔐 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PORTAL_URL=http://localhost:3001

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Avatar (escolher um)
HEYGEN_API_KEY=
# ou
DID_API_KEY=
ELEVENLABS_API_KEY=

# WhatsApp
WHATSAPP_INSTANCE_ID=
WHATSAPP_TOKEN=
WHATSAPP_OWNER_PHONE=

# Email
RESEND_API_KEY=
```

---

## 📏 CONVENÇÕES DE CÓDIGO

- **Componentes:** PascalCase (LeadCard.tsx)
- **Hooks:** camelCase com use (useLeads.ts)
- **Utils:** camelCase (calculateScore.ts)
- **API Routes:** kebab-case (/api/track-event)
- **Database:** snake_case (tracking_events)
- **Types:** PascalCase com I ou T prefix (ILead, TProposal)

---

## 🚀 COMANDOS PARA COMEÇAR

```bash
# Criar projeto
npx create-next-app@latest propostal --typescript --tailwind --app --src-dir

# Instalar dependências
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install stripe @stripe/stripe-js
npm install openai
npm install resend
npm install lucide-react
npx shadcn@latest init

# Supabase CLI
npm install -g supabase
supabase init
supabase start
```

---

## 💡 DICAS PARA O CLAUDE CODE

1. **Sempre verifique** se o arquivo já existe antes de criar
2. **Use os protótipos HTML** como referência visual
3. **Siga a estrutura de pastas** definida acima
4. **Implemente por fases** — não tente fazer tudo de uma vez
5. **Teste cada feature** antes de passar para a próxima
6. **Commits frequentes** com mensagens descritivas

---

## 📞 CONTATO

**Projeto de:** Marcos Daniel — Mottivme Sales
**Objetivo:** Lançar MVP em 30 dias

---

*Última atualização: Dezembro 2025*

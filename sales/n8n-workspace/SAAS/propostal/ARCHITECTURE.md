# 🚀 PROPOSTAL — Arquitetura Técnica

> Sistema completo de propostas interativas com rastreamento, avatar AI e chat híbrido.

---

## 📁 Estrutura do Projeto

```
propostal/
├── landing/
│   └── index.html              # Landing page do SaaS
├── dashboard/
│   └── index.html              # Dashboard de rastreamento
├── portal-template/
│   └── proposal.html           # Template white-label da proposta
└── docs/
    └── ARCHITECTURE.md         # Este arquivo
```

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                           PROPOSTAL                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   LANDING    │     │  DASHBOARD   │     │   PORTAL     │        │
│  │    PAGE      │     │              │     │  TEMPLATE    │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      SUPABASE                                │   │
│  │  • Autenticação (Auth)                                       │   │
│  │  • Banco de dados (PostgreSQL)                               │   │
│  │  • Realtime (WebSockets)                                     │   │
│  │  • Storage (arquivos)                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                    │                    │                 │
│         ▼                    ▼                    ▼                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   STRIPE     │     │   N8N        │     │   HEYGEN     │        │
│  │  Pagamentos  │     │  Automações  │     │  Avatar AI   │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                              │                                      │
│                              ▼                                      │
│                       ┌──────────────┐                             │
│                       │   OPENAI     │                             │
│                       │  Chat Luna   │                             │
│                       └──────────────┘                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas Principais

```sql
-- Empresas/Clientes do SaaS
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'starter', -- starter, pro, enterprise
    brand_primary TEXT DEFAULT '#d4af37',
    brand_secondary TEXT DEFAULT '#0a0a0a',
    logo_url TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Propostas
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_company TEXT,
    content JSONB NOT NULL, -- Conteúdo da proposta (problemas, soluções, preços, etc)
    template TEXT DEFAULT 'default',
    expiry_date TIMESTAMPTZ,
    status TEXT DEFAULT 'draft', -- draft, active, expired, won, lost
    value DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (quem recebe a proposta)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    linkedin_url TEXT,
    avatar_url TEXT,
    score INTEGER DEFAULT 0, -- 0-100
    status TEXT DEFAULT 'pending', -- pending, viewed, engaged, hot, won, lost
    last_activity TIMESTAMPTZ,
    total_time_seconds INTEGER DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos de Tracking
CREATE TABLE tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- page_view, section_enter, section_exit, cta_click, chat_message, video_play, etc
    event_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensagens do Chat
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user', 'bot', 'human'
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alertas/Notificações
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- lead_online, high_score, chat_started, revisit, etc
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tracking_events_lead ON tracking_events(lead_id);
CREATE INDEX idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_proposals_company ON proposals(company_id);
```

### Views Úteis

```sql
-- Score do lead calculado em tempo real
CREATE VIEW lead_scores AS
SELECT 
    l.id,
    l.name,
    l.email,
    l.total_time_seconds,
    l.visit_count,
    (
        LEAST(l.total_time_seconds / 60, 30) * 2 + -- Até 60 pontos por tempo (max 30 min)
        LEAST(l.visit_count * 5, 20) + -- Até 20 pontos por visitas
        CASE WHEN EXISTS (SELECT 1 FROM chat_messages WHERE lead_id = l.id AND sender = 'user') THEN 15 ELSE 0 END + -- Chat
        CASE WHEN EXISTS (SELECT 1 FROM tracking_events WHERE lead_id = l.id AND event_type = 'cta_click') THEN 10 ELSE 0 END -- CTA
    ) as calculated_score
FROM leads l;

-- Leads online (atividade nos últimos 5 minutos)
CREATE VIEW online_leads AS
SELECT l.*
FROM leads l
WHERE l.last_activity > NOW() - INTERVAL '5 minutes';
```

---

## 🔄 Integrações

### 1. HeyGen (Avatar Luna)

**Objetivo:** Gerar vídeos personalizados da Luna falando o nome do cliente.

```javascript
// Exemplo de chamada à API do HeyGen
const generateLunaVideo = async (clientName, companyName) => {
    const response = await fetch('https://api.heygen.com/v2/video/generate', {
        method: 'POST',
        headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            video_inputs: [{
                character: {
                    type: 'avatar',
                    avatar_id: 'LUNA_AVATAR_ID', // ID do avatar criado no HeyGen
                    avatar_style: 'normal'
                },
                voice: {
                    type: 'text',
                    input_text: `Olá ${clientName}! Eu sou a Luna, assistente da ${companyName}. Preparamos esta proposta especialmente para você. Role para baixo e descubra como podemos transformar seu negócio.`,
                    voice_id: 'pt-BR-FranciscaNeural' // Voz em português
                }
            }],
            dimension: {
                width: 720,
                height: 720
            }
        })
    });
    
    return response.json();
};
```

**Alternativa mais econômica: ElevenLabs + D-ID**

```javascript
// 1. Gerar áudio com ElevenLabs
const generateAudio = async (text) => {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID', {
        method: 'POST',
        headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
    });
    return response.arrayBuffer();
};

// 2. Gerar vídeo com D-ID
const generateVideo = async (audioUrl, avatarUrl) => {
    const response = await fetch('https://api.d-id.com/talks', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.DID_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source_url: avatarUrl, // Imagem da Luna
            script: { type: 'audio', audio_url: audioUrl }
        })
    });
    return response.json();
};
```

---

### 2. N8N Workflows

#### Workflow 1: Tracking Events → Supabase → Alerts

```json
{
    "name": "Propostal Tracking",
    "nodes": [
        {
            "name": "Webhook Tracking",
            "type": "n8n-nodes-base.webhook",
            "parameters": {
                "path": "propostal-track",
                "method": "POST"
            }
        },
        {
            "name": "Save to Supabase",
            "type": "n8n-nodes-base.supabase",
            "parameters": {
                "operation": "insert",
                "table": "tracking_events",
                "columns": "lead_id,proposal_id,event_type,event_data"
            }
        },
        {
            "name": "Update Lead Score",
            "type": "n8n-nodes-base.supabase",
            "parameters": {
                "operation": "update",
                "table": "leads",
                "updateKey": "id",
                "columns": "score,last_activity,total_time_seconds"
            }
        },
        {
            "name": "Check Alert Conditions",
            "type": "n8n-nodes-base.if",
            "parameters": {
                "conditions": {
                    "number": [{ "value1": "={{$json.score}}", "operation": "larger", "value2": 70 }]
                }
            }
        },
        {
            "name": "Send WhatsApp Alert",
            "type": "n8n-nodes-base.httpRequest",
            "parameters": {
                "url": "https://api.z-api.io/instances/{{INSTANCE_ID}}/token/{{TOKEN}}/send-text",
                "method": "POST",
                "body": {
                    "phone": "{{OWNER_PHONE}}",
                    "message": "🔥 LEAD QUENTE!\n\n{{$json.leadName}} está com score {{$json.score}}/100\n\nÚltima ação: {{$json.eventType}}\n\nAbra o dashboard para ver mais."
                }
            }
        }
    ]
}
```

#### Workflow 2: Gerar Proposta Automaticamente

```json
{
    "name": "Propostal Generator",
    "nodes": [
        {
            "name": "Webhook New Proposal",
            "type": "n8n-nodes-base.webhook",
            "parameters": { "path": "propostal-generate", "method": "POST" }
        },
        {
            "name": "Fetch Company Data",
            "type": "n8n-nodes-base.supabase",
            "parameters": { "operation": "getAll", "table": "companies", "filters": "id={{$json.companyId}}" }
        },
        {
            "name": "Generate Luna Video",
            "type": "n8n-nodes-base.httpRequest",
            "parameters": {
                "url": "https://api.heygen.com/v2/video/generate",
                "method": "POST"
            }
        },
        {
            "name": "Create Proposal Record",
            "type": "n8n-nodes-base.supabase",
            "parameters": { "operation": "insert", "table": "proposals" }
        },
        {
            "name": "Create Lead Record",
            "type": "n8n-nodes-base.supabase",
            "parameters": { "operation": "insert", "table": "leads" }
        },
        {
            "name": "Generate Unique URL",
            "type": "n8n-nodes-base.code",
            "parameters": {
                "code": "return { url: `https://app.propostal.com.br/p/${$json.proposalId}` }"
            }
        },
        {
            "name": "Send Email with Proposal",
            "type": "n8n-nodes-base.emailSend",
            "parameters": {
                "to": "={{$json.clientEmail}}",
                "subject": "{{$json.companyName}} preparou algo especial para você",
                "html": "..."
            }
        }
    ]
}
```

---

### 3. Chat Luna (OpenAI + Escalação)

```javascript
// Endpoint do chat
const handleChatMessage = async (leadId, message) => {
    // 1. Buscar contexto da proposta
    const proposal = await supabase
        .from('proposals')
        .select('*, companies(*)')
        .eq('leads.id', leadId)
        .single();

    // 2. Verificar se deve escalar para humano
    const escalationTriggers = [
        'quero fechar', 'vamos fechar', 'fechado', 
        'muito caro', 'desconto', 'parcelar',
        'falar com alguém', 'atendente', 'humano'
    ];
    
    const shouldEscalate = escalationTriggers.some(t => 
        message.toLowerCase().includes(t)
    );

    if (shouldEscalate) {
        // Notificar time humano
        await sendWhatsAppAlert(proposal.companies.owner_phone, {
            leadId,
            message,
            type: 'escalation'
        });
        
        return {
            response: "Entendi! Vou chamar alguém da equipe para te ajudar. Enquanto isso, posso responder mais alguma dúvida?",
            escalated: true
        };
    }

    // 3. Responder com OpenAI
    const systemPrompt = `
        Você é a Luna, assistente virtual da ${proposal.companies.name}.
        Você está ajudando ${proposal.client_name} com dúvidas sobre uma proposta.
        
        INFORMAÇÕES DA PROPOSTA:
        - Título: ${proposal.title}
        - Valor: ${proposal.value}
        - Conteúdo: ${JSON.stringify(proposal.content)}
        
        REGRAS:
        1. Seja simpática, mas profissional
        2. Responda apenas sobre a proposta
        3. Se perguntarem sobre desconto, diga que pode verificar com a equipe
        4. Incentive o agendamento de uma call
        5. Mantenha respostas curtas (2-3 frases)
    `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        max_tokens: 150
    });

    return {
        response: completion.choices[0].message.content,
        escalated: false
    };
};
```

---

### 4. Stripe (Pagamentos)

```javascript
// Criar checkout session
const createCheckout = async (companyId, plan) => {
    const prices = {
        starter: 'price_starter_id',
        pro: 'price_pro_id',
        enterprise: 'price_enterprise_id'
    };

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card', 'boleto', 'pix'],
        line_items: [{ price: prices[plan], quantity: 1 }],
        success_url: 'https://app.propostal.com.br/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://app.propostal.com.br/pricing',
        metadata: { companyId }
    });

    return session.url;
};

// Webhook de eventos Stripe
const handleStripeWebhook = async (event) => {
    switch (event.type) {
        case 'checkout.session.completed':
            await supabase
                .from('companies')
                .update({ 
                    plan: event.data.object.metadata.plan,
                    stripe_customer_id: event.data.object.customer
                })
                .eq('id', event.data.object.metadata.companyId);
            break;
            
        case 'invoice.payment_failed':
            // Notificar e reduzir para plano gratuito
            break;
    }
};
```

---

## 📊 Score de Lead (Algoritmo)

```javascript
const calculateLeadScore = (lead, events) => {
    let score = 0;
    
    // Tempo na proposta (max 30 pontos)
    const timeMinutes = lead.total_time_seconds / 60;
    score += Math.min(timeMinutes * 2, 30);
    
    // Número de visitas (max 15 pontos)
    score += Math.min(lead.visit_count * 5, 15);
    
    // Seções visitadas (max 20 pontos)
    const sectionsVisited = new Set(
        events.filter(e => e.event_type === 'section_enter')
              .map(e => e.event_data.section)
    ).size;
    score += sectionsVisited * 4;
    
    // Cliques em CTAs (max 15 pontos)
    const ctaClicks = events.filter(e => e.event_type === 'cta_click').length;
    score += Math.min(ctaClicks * 5, 15);
    
    // Chat iniciado (10 pontos)
    const hasChat = events.some(e => e.event_type === 'chat_message');
    if (hasChat) score += 10;
    
    // Vídeo assistido (10 pontos)
    const watchedVideo = events.some(e => e.event_type === 'video_play');
    if (watchedVideo) score += 10;
    
    // Revisita (10 pontos bonus)
    if (lead.visit_count > 1) score += 10;
    
    // Passou mais tempo em preços (indicador de interesse)
    const priceTime = events
        .filter(e => e.event_type === 'section_exit' && e.event_data.section === 'pricing')
        .reduce((acc, e) => acc + (e.event_data.timeSeconds || 0), 0);
    if (priceTime > 120) score += 10; // +10 se ficou mais de 2min em preços
    
    return Math.min(Math.round(score), 100);
};
```

---

## 🚀 Deploy

### Opção 1: Vercel (Recomendado)

```bash
# Landing Page
cd landing && vercel --prod

# Dashboard (precisa de backend)
cd dashboard && vercel --prod
```

### Opção 2: Railway/Render (Full-stack)

```yaml
# railway.toml
[build]
  builder = "nixpacks"
  
[deploy]
  startCommand = "npm start"
  
[[services]]
  name = "propostal-api"
  
[[services]]
  name = "propostal-dashboard"
```

### Variáveis de Ambiente Necessárias

```env
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# HeyGen/D-ID
HEYGEN_API_KEY=
# ou
DID_API_KEY=
ELEVENLABS_API_KEY=

# OpenAI
OPENAI_API_KEY=

# WhatsApp (Z-API ou Evolution)
WHATSAPP_INSTANCE_ID=
WHATSAPP_TOKEN=
```

---

## 📈 Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Taxa de abertura | >80% |
| Tempo médio na proposta | >8 minutos |
| Taxa de engajamento (chat/cta) | >40% |
| Taxa de conversão (proposta → venda) | >35% |
| Churn mensal | <5% |

---

## 🔮 Roadmap

### V1.0 (MVP)
- [x] Landing page
- [x] Dashboard de tracking
- [x] Template de proposta
- [ ] Integração Supabase
- [ ] Tracking básico
- [ ] Chat com Luna (OpenAI)

### V1.5
- [ ] Avatar Luna com HeyGen
- [ ] Alertas WhatsApp
- [ ] Stripe checkout
- [ ] Múltiplos templates

### V2.0
- [ ] Builder visual de propostas
- [ ] A/B testing automático
- [ ] Integração CRM (Pipedrive, HubSpot)
- [ ] App mobile para alerts

---

*Documentação criada por Mottivme Sales — Dezembro 2025*

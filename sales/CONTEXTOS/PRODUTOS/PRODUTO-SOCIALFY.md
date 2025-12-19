# PRODUTO-SOCIALFY.md
> Plataforma de gestao e automacao de redes sociais com IA

---

## 1. VISAO GERAL

### O que e o Socialfy
Plataforma SaaS para gestao de redes sociais que usa IA para criar conteudo, agendar posts, analisar engajamento e sugerir otimizacoes.

### Proposta de Valor
> "Sua IA de social media que nunca dorme, nunca esquece e sempre engaja"

### Status
- **Fase:** Conceito/Planejamento
- **Prioridade:** Media
- **Stack Planejada:** Next.js + Supabase + OpenAI + APIs sociais

---

## 2. FUNCIONALIDADES PLANEJADAS

### Core Features
```
┌─────────────────────────────────────────────────────────────────┐
│                       SOCIALFY                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] CONTENT STUDIO     [2] SCHEDULER      [3] ANALYTICS       │
│      - Gerador de         - Multi-plataforma  - Metricas em    │
│        copy com IA        - Best time to      tempo real       │
│      - Banco de ideias    post              - Comparativos     │
│      - Templates          - Queues           - Insights IA     │
│                                                                 │
│  [4] INBOX UNIFICADO    [5] LISTENING      [6] AUTOMATION      │
│      - DMs de todas       - Mencoes          - Respostas       │
│        redes             - Sentimento        automaticas       │
│      - Resposta IA       - Concorrentes     - Engajamento      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detalhamento por Feature

#### 1. Content Studio
- Gerador de copy com Sexy Canvas
- Sugestoes baseadas em trending topics
- Banco de ideias salvas
- Templates por nicho
- A/B testing de copies
- Rewriter para adaptar tom

#### 2. Scheduler
- Calendario visual
- Multi-conta e multi-plataforma
- Best time to post (baseado em dados)
- Filas de conteudo
- Republish de evergreen content
- Preview em tempo real

#### 3. Analytics
- Dashboard unificado
- Metricas por post/periodo
- Comparativo com concorrentes
- ROI de campanhas
- Insights gerados por IA
- Relatorios automaticos

#### 4. Inbox Unificado
- DMs de Instagram, Facebook, Twitter
- Comentarios centralizados
- Respostas com IA
- Templates de resposta
- Escalacao para humano
- Historico por contato

#### 5. Listening
- Monitoramento de mencoes
- Analise de sentimento
- Tracking de concorrentes
- Alertas em tempo real
- Tendencias do nicho

#### 6. Automation
- Respostas automaticas (IA)
- Auto-like em comentarios
- DM de boas-vindas
- Sequencias de engajamento
- Regras personalizadas

---

## 3. ARQUITETURA TECNICA

### Stack Tecnologica
```
Frontend:     Next.js 15 + TypeScript + Tailwind + shadcn/ui
Backend:      Next.js API Routes + Edge Functions
Database:     Supabase PostgreSQL
Auth:         Supabase Auth
Storage:      Supabase Storage (midias)
IA:           OpenAI GPT-4o + Claude (fallback)
Queue:        Vercel Cron + Supabase Edge Functions
APIs:         Meta Graph API, Twitter API, LinkedIn API
```

### Database Schema (Planejado)
```sql
-- Usuarios e contas sociais
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    platform TEXT,  -- 'instagram', 'facebook', 'twitter', 'linkedin'
    platform_id TEXT,
    access_token TEXT ENCRYPTED,
    refresh_token TEXT ENCRYPTED,
    metadata JSONB,
    created_at TIMESTAMP
);

-- Posts agendados
CREATE TABLE scheduled_posts (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts(id),
    content TEXT,
    media_urls TEXT[],
    scheduled_for TIMESTAMP,
    status TEXT,  -- 'scheduled', 'published', 'failed'
    published_at TIMESTAMP,
    platform_post_id TEXT,
    metrics JSONB,
    created_at TIMESTAMP
);

-- Inbox unificado
CREATE TABLE inbox_messages (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts(id),
    platform_message_id TEXT,
    sender_id TEXT,
    sender_name TEXT,
    content TEXT,
    direction TEXT,  -- 'inbound', 'outbound'
    responded BOOLEAN,
    ai_suggested_response TEXT,
    created_at TIMESTAMP
);

-- Analytics
CREATE TABLE analytics_daily (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts(id),
    date DATE,
    followers INT,
    following INT,
    posts INT,
    likes INT,
    comments INT,
    shares INT,
    reach INT,
    impressions INT,
    engagement_rate DECIMAL
);
```

### Integrações de API

#### Meta (Instagram/Facebook)
```javascript
// Permissões necessárias
const metaScopes = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_messages'
];
```

#### Twitter
```javascript
// Permissões necessárias
const twitterScopes = [
  'tweet.read',
  'tweet.write',
  'users.read',
  'dm.read',
  'dm.write'
];
```

---

## 4. MODULO DE IA

### Content Generation
```javascript
const generatePost = async (input) => {
  const prompt = `
    Você é um especialista em social media usando o framework Sexy Canvas.

    CONTEXTO:
    - Nicho: ${input.niche}
    - Objetivo: ${input.objective}
    - Tom: ${input.tone}
    - Plataforma: ${input.platform}

    GATILHOS A APLICAR:
    ${input.triggers.join(', ')}

    GERE:
    - Copy principal (max ${input.maxLength} caracteres)
    - 3 variações para A/B test
    - Hashtags relevantes
    - Melhor horário para postar
  `;

  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  });
};
```

### Auto-responder
```javascript
const generateResponse = async (message, context) => {
  const prompt = `
    Você é o assistente de social media de ${context.brandName}.

    MENSAGEM RECEBIDA:
    "${message.content}"

    CONTEXTO:
    - Plataforma: ${message.platform}
    - Histórico: ${context.history}
    - Tom da marca: ${context.tone}

    GERE:
    - Resposta adequada
    - Se for reclamação, seja empático
    - Se for dúvida, seja prestativo
    - Se precisar escalar, sinalize
  `;

  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  });
};
```

---

## 5. MODELO DE NEGOCIO

### Planos
```
┌─────────────────────────────────────────────────────────────────┐
│                    PLANOS SOCIALFY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STARTER           PRO              AGENCY                      │
│  R$ 97/mês         R$ 197/mês       R$ 497/mês                 │
│                                                                 │
│  - 3 contas        - 10 contas      - 30 contas               │
│  - 30 posts/mês    - 150 posts/mês  - Ilimitado               │
│  - Analytics       - Analytics+     - White label             │
│  - Scheduler       - Inbox          - API access              │
│  - Suporte email   - Suporte chat   - Suporte prioritário     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Metricas de Negocio
- **MRR Target:** R$ 50.000 em 12 meses
- **CAC Target:** R$ 200
- **LTV Target:** R$ 1.500
- **Churn Target:** < 5%/mês

---

## 6. FLUXO DO USUARIO

### Onboarding
```
1. CADASTRO
   - Email + Senha / Google OAuth
   - Dados básicos

2. CONECTAR REDES
   - Autenticar Instagram/Facebook
   - Autenticar Twitter
   - Autenticar LinkedIn

3. CONFIGURAR PERFIL DA MARCA
   - Tom de voz
   - Palavras-chave
   - Concorrentes

4. PRIMEIRO CONTEUDO
   - Usar gerador de copy
   - Agendar primeiro post
   - Ver preview

5. TOUR DO DASHBOARD
   - Conhecer features
   - Configurar preferências
```

### Workflow Diário
```
1. ACESSAR DASHBOARD
   - Ver métricas do dia
   - Alertas e pendências

2. CHECAR INBOX
   - Responder DMs
   - Aprovar respostas IA

3. CRIAR CONTEUDO
   - Usar ideias sugeridas
   - Gerar copies
   - Agendar posts

4. REVISAR AGENDA
   - Confirmar posts agendados
   - Ajustar horários

5. ANALISAR PERFORMANCE
   - Ver o que funcionou
   - Ajustar estratégia
```

---

## 7. DIFERENCIAL COMPETITIVO

### vs Buffer/Hootsuite
- IA nativa para criação de conteúdo
- Preço mais acessível
- Interface em português
- Suporte local

### vs MLabs
- IA mais avançada (Sexy Canvas)
- Inbox unificado com IA
- Analytics mais profundo
- Foco em resultados de vendas

### Unique Value
- Framework Sexy Canvas integrado
- Foco em conversão, não só engajamento
- Integração com funil de vendas
- IA treinada para vendas

---

## 8. ROADMAP

### MVP (3 meses)
- [ ] Auth + conectar Instagram
- [ ] Scheduler básico
- [ ] Gerador de copy simples
- [ ] Dashboard de métricas

### V1.0 (6 meses)
- [ ] Multi-plataforma (FB, Twitter)
- [ ] Inbox unificado
- [ ] IA para respostas
- [ ] Best time to post

### V2.0 (12 meses)
- [ ] Listening avançado
- [ ] A/B testing
- [ ] White label
- [ ] API pública

---

## 9. PROXIMOS PASSOS

### Para iniciar desenvolvimento
1. Validar demanda (landing page)
2. Definir MVP mínimo
3. Criar design system
4. Setup do projeto
5. Desenvolver auth + conexão IG
6. Beta fechado

### Perguntas em aberto
- Priorizar Instagram ou multi-plataforma?
- Self-service ou onboarding assistido?
- Freemium ou só planos pagos?

---

## 10. ARQUIVOS RELACIONADOS

```
/mottivme-platform/apps/socialfy/  # (a criar)
/CONTEXTOS/FRAMEWORKS/FRAMEWORK-SEXY-CANVAS.md  # Para geração de copy
```

---

*Documento criado em: Dezembro 2025*
*Status: Conceito/Planejamento*

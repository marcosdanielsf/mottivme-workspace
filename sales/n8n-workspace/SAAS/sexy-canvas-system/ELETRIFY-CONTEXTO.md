# 🔥 ELETRIFY - DOCUMENTO DE CONTEXTO DO PROJETO

> **Este documento serve para contextualizar o Claude Code sobre o projeto e o que precisa ser construído.**

---

## 📋 RESUMO EXECUTIVO

**Nome do Projeto:** ELETRIFY (ou SexyCanvas AI)

**O que é:** Um SaaS que automatiza a criação de materiais de venda eletrificados (copy, propostas, VSLs, pitch decks, emails, posts) usando a metodologia "Sexy Canvas" de André Diamand - que aplica 14 gatilhos emocionais para maximizar conversão.

**Problema que resolve:** Empresas e profissionais gastam horas criando materiais de venda genéricos que não convertem. O Eletrify usa IA + metodologia comprovada para gerar materiais que ATIVAM emoções e CONVERTEM.

**Para quem:** 
- Agências de marketing
- Consultores e mentores
- Médicos que vendem mentorias
- Infoprodutores
- Times de vendas B2B

**Modelo de negócio:** SaaS com planos mensais (R$ 197 / R$ 497 / R$ 997)

---

## 🎯 A METODOLOGIA SEXY CANVAS

O coração do produto é a metodologia de André Diamand que usa **14 gatilhos emocionais** divididos em 2 blocos:

### BLOCO 1: 7 Pecados Capitais (Desejos Primitivos)
1. **VAIDADE** - Desejo de se sentir superior, exclusivo
2. **AVAREZA** - Foco em ganhos financeiros, economia
3. **LUXÚRIA** - Desejo por coisas caras, experiências premium
4. **INVEJA** - Querer o que outros têm, não ficar para trás
5. **GULA** - Querer mais e mais, abundância
6. **PREGUIÇA** - Querer facilidade, mínimo esforço
7. **IRA** - Raiva contra um vilão comum, frustração validada

### BLOCO 2: 7 Elementos da Criança Interior (Emoções de Conforto)
8. **AMOR** - Conexão emocional, cuidado, personalização
9. **CURIOSIDADE** - Necessidade de saber, loops abertos
10. **DIVERSÃO** - Prazer, gamificação, surpresas
11. **LIBERDADE** - Autonomia, poder de escolha
12. **PERTENCIMENTO** - Fazer parte de algo maior, comunidade
13. **RECOMPENSA** - Presentes, bônus, surpresas positivas
14. **SEGURANÇA** - Garantias, provas, eliminação de medo

### Como funciona na prática:
- Cada tipo de material (post, email, VSL, proposta) tem uma **combinação ideal de gatilhos**
- A IA analisa o contexto (nicho, público, objetivo) e seleciona os gatilhos certos
- O output é copy/material que ATIVA emoções específicas para maximizar conversão

---

## 🏗️ FUNCIONALIDADES DO MVP

### 1. **Gerador de Copy Eletrificada**
- Input: Nicho, público-alvo, objetivo, tom de voz
- Output: Copy com gatilhos emocionais aplicados
- Tipos:
  - Posts para Instagram/LinkedIn
  - Legendas para Reels
  - Headlines e hooks
  - CTAs

### 2. **Gerador de Emails**
- Sequência de 5-7 emails pós-lead magnet
- Emails de carrinho abandonado
- Emails de lançamento
- Cold emails B2B
- Cada email com gatilhos específicos da jornada

### 3. **Gerador de Scripts de Vídeo (VSL)**
- Input: Produto/serviço, público, preço, objeções
- Output: Script completo de 10-15 minutos
- Estrutura: Hook → História → Revelação → Prova → Oferta → CTA
- Marcações de edição (B-roll, texto na tela, etc.)

### 4. **Gerador de Propostas Imersivas**
- Portal de entrada com login exclusivo
- Proposta interativa estilo Apple
- Animações, sons, storytelling
- Exporta como HTML para deploy

### 5. **Gerador de Pitch Deck**
- 10-12 slides com estrutura persuasiva
- Exporta como HTML interativo ou PDF
- Navegação por teclado/touch

### 6. **Analisador de Copy**
- Usuário cola copy existente
- Sistema identifica quais gatilhos estão sendo usados
- Sugere melhorias para aumentar conversão
- Score de "eletrificação" (0-100)

### 7. **Biblioteca de Templates**
- Templates prontos por nicho (médicos, advogados, coaches, etc.)
- Templates por objetivo (lançamento, evergreen, high-ticket)
- Usuário pode salvar seus próprios templates

---

## 🛠️ STACK TECNOLÓGICO SUGERIDO

### Frontend:
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui** (componentes)
- **Framer Motion** (animações)
- **Zustand** (estado global)

### Backend:
- **Next.js API Routes** (ou tRPC)
- **Prisma** (ORM)
- **PostgreSQL** (via Supabase ou Neon)

### IA:
- **Anthropic Claude API** (geração de copy)
- **OpenAI API** (fallback/comparação)

### Autenticação:
- **Clerk** ou **NextAuth.js**

### Pagamentos:
- **Stripe** (assinaturas)

### Infraestrutura:
- **Vercel** (deploy)
- **Supabase** (database + storage)

---

## 📁 ESTRUTURA DE PASTAS SUGERIDA

```
eletrify/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard home)
│   │   ├── copy/
│   │   │   └── page.tsx (gerador de copy)
│   │   ├── emails/
│   │   │   └── page.tsx (gerador de emails)
│   │   ├── vsl/
│   │   │   └── page.tsx (gerador de VSL)
│   │   ├── proposals/
│   │   │   └── page.tsx (gerador de propostas)
│   │   ├── pitch-deck/
│   │   │   └── page.tsx (gerador de pitch)
│   │   ├── analyzer/
│   │   │   └── page.tsx (analisador)
│   │   ├── templates/
│   │   │   └── page.tsx (biblioteca)
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── generate/
│   │   │   ├── copy/route.ts
│   │   │   ├── email/route.ts
│   │   │   ├── vsl/route.ts
│   │   │   ├── proposal/route.ts
│   │   │   └── pitch/route.ts
│   │   ├── analyze/route.ts
│   │   ├── webhook/stripe/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx
│   └── page.tsx (landing page)
├── components/
│   ├── ui/ (shadcn components)
│   ├── forms/
│   │   ├── CopyForm.tsx
│   │   ├── EmailForm.tsx
│   │   ├── VSLForm.tsx
│   │   └── ...
│   ├── outputs/
│   │   ├── CopyOutput.tsx
│   │   ├── EmailOutput.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   └── shared/
├── lib/
│   ├── ai/
│   │   ├── prompts/
│   │   │   ├── copy-prompt.ts
│   │   │   ├── email-prompt.ts
│   │   │   ├── vsl-prompt.ts
│   │   │   └── ...
│   │   ├── claude.ts
│   │   └── openai.ts
│   ├── triggers/
│   │   └── sexy-canvas.ts (definição dos 14 gatilhos)
│   ├── db.ts (prisma client)
│   ├── stripe.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
├── .env.example
├── package.json
└── README.md
```

---

## 🔑 ARQUIVOS CORE DO SISTEMA

### 1. `lib/triggers/sexy-canvas.ts`
```typescript
export const SEXY_CANVAS_TRIGGERS = {
  // Bloco 1: 7 Pecados Capitais
  VAIDADE: {
    id: 'vaidade',
    name: 'Vaidade',
    description: 'Desejo de se sentir superior, exclusivo, admirado',
    keywords: ['exclusivo', 'VIP', 'seleto', 'elite', 'poucos têm acesso'],
    useCases: ['high-ticket', 'produtos premium', 'comunidades fechadas'],
    intensity: 1-5,
  },
  AVAREZA: {
    id: 'avareza',
    name: 'Avareza',
    description: 'Foco em ganhos financeiros, economia, ROI',
    keywords: ['economia', 'desconto', 'ROI', 'retorno', 'lucro'],
    useCases: ['ofertas', 'comparações de preço', 'B2B'],
  },
  // ... demais gatilhos
};

export const TRIGGER_COMBINATIONS = {
  'post-instagram': ['CURIOSIDADE', 'INVEJA', 'IRA'],
  'email-vendas': ['AVAREZA', 'PREGUICA', 'SEGURANCA'],
  'vsl': ['IRA', 'INVEJA', 'AVAREZA', 'PREGUICA', 'SEGURANCA'],
  'proposta-high-ticket': ['VAIDADE', 'LUXURIA', 'AMOR', 'SEGURANCA'],
  // ... demais combinações
};
```

### 2. `lib/ai/prompts/base-prompt.ts`
```typescript
export const SEXY_CANVAS_SYSTEM_PROMPT = `
Você é um especialista em copywriting persuasivo usando a metodologia Sexy Canvas.

Seu objetivo é criar copy que ELETRIFICA a mente do cliente ativando emoções específicas.

OS 14 GATILHOS EMOCIONAIS:
[lista completa dos gatilhos com descrição]

REGRAS:
1. Sempre use no mínimo 3 gatilhos por peça
2. O hook deve prender em 3 segundos
3. Nunca seja genérico - sempre personalize
4. Copy boa INCOMODA, não acomoda
5. Termine com CTA claro usando AVAREZA ou URGÊNCIA

Para cada output, indique quais gatilhos foram usados e onde.
`;
```

---

## 📊 MODELO DE DADOS (PRISMA)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  plan          Plan      @default(FREE)
  credits       Int       @default(10)
  createdAt     DateTime  @default(now())
  generations   Generation[]
  templates     Template[]
}

enum Plan {
  FREE
  STARTER
  PRO
  ENTERPRISE
}

model Generation {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  type          GenerationType
  input         Json
  output        String    @db.Text
  triggersUsed  String[]
  createdAt     DateTime  @default(now())
}

enum GenerationType {
  COPY
  EMAIL
  VSL
  PROPOSAL
  PITCH_DECK
  ANALYSIS
}

model Template {
  id            String    @id @default(cuid())
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  name          String
  type          GenerationType
  niche         String?
  content       Json
  isPublic      Boolean   @default(false)
  createdAt     DateTime  @default(now())
}
```

---

## 🎨 FLUXO PRINCIPAL DO USUÁRIO

```
1. LANDING PAGE
   └── Ver benefícios → CTA "Começar Grátis"

2. REGISTRO/LOGIN
   └── Clerk auth → Redirect para Dashboard

3. DASHBOARD
   ├── Ver créditos disponíveis
   ├── Histórico de gerações
   └── Escolher tipo de material

4. GERAÇÃO (exemplo: Copy)
   ├── Preencher formulário:
   │   ├── Nicho/mercado
   │   ├── Público-alvo
   │   ├── Objetivo (vender, engajar, educar)
   │   ├── Tom de voz
   │   └── Contexto adicional
   ├── Selecionar gatilhos (opcional, IA sugere)
   └── Clicar "Gerar"

5. OUTPUT
   ├── Ver copy gerada
   ├── Ver gatilhos usados (highlighted)
   ├── Editar/regenerar
   ├── Copiar para clipboard
   └── Salvar como template

6. ANÁLISE (opcional)
   ├── Colar copy existente
   ├── Ver score de eletrificação
   ├── Ver gatilhos detectados
   └── Ver sugestões de melhoria
```

---

## 💰 PLANOS E PREÇOS

| Feature | FREE | STARTER (R$197) | PRO (R$497) | ENTERPRISE (R$997) |
|---------|------|-----------------|-------------|---------------------|
| Gerações/mês | 10 | 100 | 500 | Ilimitado |
| Tipos de output | Copy apenas | Todos | Todos | Todos |
| Análise de copy | ❌ | ✅ | ✅ | ✅ |
| Templates salvos | 3 | 20 | Ilimitado | Ilimitado |
| Propostas imersivas | ❌ | ❌ | ✅ | ✅ |
| API access | ❌ | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ❌ | ✅ |

---

## 📁 DOCUMENTOS DE REFERÊNCIA

Os seguintes documentos contêm a metodologia completa e exemplos:

1. **SUPER-PROMPT-SEXY-CANVAS.md** - Prompt completo com os 14 gatilhos, templates e exemplos
2. **SISTEMA-ELETRIFICACAO-TOTAL.md** - Aplicação em todos os touchpoints de venda
3. **VSL-SCRIPT-COMPLETO.md** - Exemplo de script de 12 minutos
4. **MAPA-ELETRIFICACAO.md** - Framework visual de aplicação por fase
5. **portal-v2/** - Exemplo de portal de proposta imersiva (HTML)
6. **pitch-deck/** - Exemplo de pitch deck interativo (HTML)

**IMPORTANTE:** Esses documentos devem ser lidos e internalizados para entender a metodologia antes de começar a desenvolver.

---

## 🚀 ORDEM DE DESENVOLVIMENTO SUGERIDA

### FASE 1: Setup (1-2 dias)
- [ ] Criar projeto Next.js 14 com TypeScript
- [ ] Configurar Tailwind + Shadcn/ui
- [ ] Configurar Prisma + Supabase
- [ ] Configurar Clerk auth
- [ ] Setup básico de rotas e layout

### FASE 2: Core - Gerador de Copy (3-5 dias)
- [ ] Implementar `lib/triggers/sexy-canvas.ts`
- [ ] Implementar prompts base para Claude
- [ ] Criar formulário de input
- [ ] Criar componente de output com gatilhos highlighted
- [ ] Integrar com Claude API
- [ ] Testar e refinar prompts

### FASE 3: Demais Geradores (5-7 dias)
- [ ] Gerador de Emails
- [ ] Gerador de VSL
- [ ] Analisador de Copy
- [ ] Biblioteca de Templates

### FASE 4: Features Premium (3-5 dias)
- [ ] Gerador de Propostas Imersivas
- [ ] Gerador de Pitch Deck
- [ ] Export para HTML/PDF

### FASE 5: Monetização (2-3 dias)
- [ ] Integrar Stripe
- [ ] Implementar sistema de créditos
- [ ] Gates por plano

### FASE 6: Polish (2-3 dias)
- [ ] Landing page
- [ ] Onboarding
- [ ] Emails transacionais
- [ ] Analytics

---

## ❓ PERGUNTAS PARA DECISÃO

Antes de começar, preciso que você defina:

1. **Stack confirmado?** Next.js 14 + Supabase + Clerk + Stripe?
2. **Começar por qual módulo?** (sugiro Gerador de Copy)
3. **Domínio?** eletrify.com.br? sexycanvas.ai?
4. **Precisa de landing page primeiro ou vai direto pro app?**

---

## 🎯 COMANDO PARA INICIAR

Quando abrir o Claude Code, use este comando inicial:

```
Leia o arquivo ELETRIFY-CONTEXTO.md para entender o projeto completo.
Este é um SaaS de geração de copy/materiais de venda usando a metodologia 
Sexy Canvas (14 gatilhos emocionais).

Comece criando a estrutura base do projeto Next.js 14 com:
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Estrutura de pastas conforme documentado

Depois implemente o módulo core: Gerador de Copy com integração Claude API.
```

---

*Documento criado em Dezembro 2025 para projeto Eletrify/SexyCanvas AI*

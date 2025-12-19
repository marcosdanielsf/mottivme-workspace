# CLAUDE.md - Contexto do Projeto ELETRIFY

## 🎯 O QUE É ESTE PROJETO

**ELETRIFY** é um SaaS de geração de materiais de venda (copy, emails, VSLs, propostas, pitch decks) usando a metodologia **Sexy Canvas** - um framework de 14 gatilhos emocionais que maximizam conversão.

**Problema:** Profissionais gastam horas criando materiais de venda genéricos que não convertem.

**Solução:** IA + metodologia comprovada para gerar materiais que ATIVAM emoções e CONVERTEM.

**Público:** Agências, consultores, mentores, médicos, infoprodutores, times de vendas B2B.

---

## 🧠 A METODOLOGIA SEXY CANVAS (CORE DO PRODUTO)

O sistema usa **14 gatilhos emocionais** divididos em 2 blocos:

### BLOCO 1: 7 Pecados Capitais
1. **VAIDADE** - Exclusividade, superioridade
2. **AVAREZA** - Ganhos financeiros, economia
3. **LUXÚRIA** - Experiências premium, desejo
4. **INVEJA** - Querer o que outros têm
5. **GULA** - Abundância, querer mais
6. **PREGUIÇA** - Facilidade, mínimo esforço
7. **IRA** - Raiva contra vilão comum

### BLOCO 2: 7 Elementos da Criança Interior
8. **AMOR** - Conexão, cuidado
9. **CURIOSIDADE** - Loops abertos, mistério
10. **DIVERSÃO** - Prazer, gamificação
11. **LIBERDADE** - Autonomia, escolha
12. **PERTENCIMENTO** - Comunidade, tribo
13. **RECOMPENSA** - Bônus, surpresas
14. **SEGURANÇA** - Garantias, provas

### Aplicação:
- Cada tipo de material tem combinação ideal de gatilhos
- IA seleciona gatilhos baseado em contexto (nicho, público, objetivo)
- Output é copy que ATIVA emoções específicas

---

## 🛠️ STACK TECNOLÓGICO

```
Frontend:     Next.js 14 (App Router) + TypeScript + Tailwind + Shadcn/ui
Backend:      Next.js API Routes + Prisma
Database:     PostgreSQL (Supabase)
IA:           Anthropic Claude API
Auth:         Clerk
Pagamentos:   Stripe
Deploy:       Vercel
```

---

## 📁 ESTRUTURA DO PROJETO

```
eletrify/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/
│   │   ├── page.tsx (home)
│   │   ├── copy/page.tsx
│   │   ├── emails/page.tsx
│   │   ├── vsl/page.tsx
│   │   ├── proposals/page.tsx
│   │   ├── pitch-deck/page.tsx
│   │   ├── analyzer/page.tsx
│   │   └── templates/page.tsx
│   ├── api/generate/[type]/route.ts
│   └── api/analyze/route.ts
├── components/ui/, forms/, outputs/, layout/
├── lib/
│   ├── triggers/sexy-canvas.ts (14 gatilhos)
│   ├── ai/prompts/*.ts
│   ├── ai/claude.ts
│   └── db.ts, stripe.ts
├── prisma/schema.prisma
└── types/index.ts
```

---

## 🔑 ARQUIVO CORE: lib/triggers/sexy-canvas.ts

Este é o coração do sistema. Define os 14 gatilhos e suas combinações:

```typescript
export const TRIGGERS = {
  VAIDADE: { id: 'vaidade', name: 'Vaidade', ... },
  AVAREZA: { id: 'avareza', name: 'Avareza', ... },
  // ... todos os 14
}

export const COMBINATIONS = {
  'copy-instagram': ['CURIOSIDADE', 'INVEJA', 'IRA'],
  'email-vendas': ['AVAREZA', 'PREGUICA', 'SEGURANCA'],
  'vsl': ['IRA', 'INVEJA', 'AVAREZA', 'PREGUICA'],
  'proposta': ['VAIDADE', 'LUXURIA', 'AMOR', 'SEGURANCA'],
}
```

---

## 📊 MODELO DE DADOS

```prisma
model User {
  id, email, name, plan (FREE/STARTER/PRO/ENTERPRISE)
  credits (Int), generations[], templates[]
}

model Generation {
  id, userId, type (COPY/EMAIL/VSL/PROPOSAL/PITCH)
  input (Json), output (Text), triggersUsed (String[])
}

model Template {
  id, userId, name, type, niche, content (Json), isPublic
}
```

---

## 🚀 MÓDULOS DO MVP (em ordem de prioridade)

### 1. Gerador de Copy (CORE)
- Input: nicho, público, objetivo, tom
- Output: copy eletrificada com gatilhos marcados
- Tipos: posts, headlines, hooks, CTAs

### 2. Gerador de Emails
- Sequências de 5-7 emails
- Cold emails, carrinho abandonado, lançamento

### 3. Gerador de VSL
- Script de 10-15 minutos
- Estrutura: Hook → História → Revelação → Oferta → CTA

### 4. Analisador de Copy
- Analisa copy existente
- Identifica gatilhos usados
- Score de eletrificação (0-100)
- Sugestões de melhoria

### 5. Propostas Imersivas (Premium)
- Portal de entrada com login
- Proposta interativa com animações
- Export HTML

### 6. Pitch Deck (Premium)
- 10-12 slides persuasivos
- Export HTML/PDF

---

## 📁 DOCUMENTOS DE REFERÊNCIA

Ler estes arquivos para entender a metodologia completa:

1. **ELETRIFY-CONTEXTO.md** - Contexto completo do projeto
2. **SUPER-PROMPT-SEXY-CANVAS.md** - Prompt com os 14 gatilhos
3. **SISTEMA-ELETRIFICACAO-TOTAL.md** - Aplicação em touchpoints
4. **VSL-SCRIPT-COMPLETO.md** - Exemplo de VSL
5. **portal-v2/** - Exemplo de proposta imersiva
6. **pitch-deck/** - Exemplo de pitch deck

---

## ⚡ COMANDOS ÚTEIS

```bash
# Setup inicial
npx create-next-app@latest eletrify --typescript --tailwind --app
cd eletrify
npx shadcn@latest init

# Instalar dependências
npm install @prisma/client @clerk/nextjs stripe @anthropic-ai/sdk zustand framer-motion

# Prisma
npx prisma init
npx prisma db push
npx prisma generate

# Dev
npm run dev
```

---

## 🎯 COMEÇAR POR

1. Setup Next.js 14 + Tailwind + Shadcn
2. Implementar `lib/triggers/sexy-canvas.ts`
3. Criar prompts base em `lib/ai/prompts/`
4. Implementar Gerador de Copy (formulário + output)
5. Integrar Claude API
6. Testar e iterar

---

## ❓ DECISÕES PENDENTES

- [ ] Domínio: eletrify.com.br? sexycanvas.ai?
- [ ] Fazer landing page antes ou ir direto pro app?
- [ ] Usar tRPC ou API Routes padrão?

---

*Última atualização: Dezembro 2025*

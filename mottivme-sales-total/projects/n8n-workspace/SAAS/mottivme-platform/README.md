# 🚀 MOTTIVME PLATFORM

Monorepo contendo dois SaaS complementares:

## 📦 Projetos

### 1. PROPOSTAL (`apps/propostal`)
SaaS de propostas interativas com rastreamento de comportamento.

**Funcionalidades:**
- Portais de proposta interativos
- Rastreamento em tempo real
- Score de interesse (0-100)
- Chat com IA (Luna)
- Alertas quando lead está quente
- Dashboard de métricas

### 2. ELETRIFY (`apps/eletrify`)
SaaS de geração de copy usando metodologia Sexy Canvas.

**Funcionalidades:**
- Gerador de Copy (posts, headlines, hooks)
- Gerador de Emails
- Gerador de VSL
- Analisador de Copy
- 14 gatilhos emocionais

---

## 🛠️ Stack Tecnológica

```
Frontend:     Next.js 15 (App Router) + TypeScript + Tailwind CSS
Backend:      Next.js API Routes
Database:     Supabase (PostgreSQL)
IA:           OpenAI GPT-4o
Deploy:       Vercel
Monorepo:     Turborepo
```

---

## 🚀 Setup Rápido

### 1. Instalar dependências
```bash
cd mottivme-platform
npm install
```

### 2. Configurar variáveis de ambiente
```bash
# Copiar .env.local para cada app
cp .env.local apps/propostal/.env.local
cp .env.local apps/eletrify/.env.local
```

### 3. Configurar Supabase
1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Execute o arquivo `packages/database/migrations/001_initial_schema.sql`

### 4. Rodar em desenvolvimento
```bash
# Rodar ambos os projetos
npm run dev

# Ou rodar individualmente
npm run dev:propostal  # http://localhost:3000
npm run dev:eletrify   # http://localhost:3001
```

---

## 🌐 Deploy no Vercel

### Deploy Automático
```bash
# Na raiz do monorepo
vercel

# Ou deploy individual
cd apps/propostal && vercel --prod
cd apps/eletrify && vercel --prod
```

### Configurar no Vercel Dashboard
1. Importe o repositório
2. Configure o Root Directory: `apps/propostal` ou `apps/eletrify`
3. Adicione as variáveis de ambiente
4. Deploy!

---

## 📁 Estrutura do Projeto

```
mottivme-platform/
├── apps/
│   ├── propostal/           # SaaS de propostas
│   │   ├── src/
│   │   │   ├── app/         # App Router
│   │   │   ├── components/  # Componentes React
│   │   │   ├── lib/         # Utilitários
│   │   │   └── types/       # TypeScript types
│   │   └── package.json
│   │
│   └── eletrify/            # SaaS de copy
│       ├── src/
│       │   ├── app/         # App Router
│       │   ├── components/  # Componentes React
│       │   ├── lib/
│       │   │   ├── triggers/  # 14 gatilhos Sexy Canvas
│       │   │   └── ai/        # Prompts de IA
│       │   └── types/
│       └── package.json
│
├── packages/
│   ├── database/            # Schema Supabase
│   ├── ui/                  # Componentes compartilhados (futuro)
│   └── utils/               # Funções utilitárias (futuro)
│
├── .env.local               # Variáveis de ambiente
├── turbo.json               # Configuração Turborepo
└── package.json             # Root package
```

---

## 🔑 Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 URLs dos Projetos

| Projeto | Dev | Produção |
|---------|-----|----------|
| Propostal | http://localhost:3000 | propostal.vercel.app |
| Eletrify | http://localhost:3001 | eletrify.vercel.app |

---

## 🎯 Roadmap

### MVP (Atual)
- [x] Landing pages
- [x] Portal de proposta interativo
- [x] Gerador de Copy
- [x] API de tracking
- [x] Chat com IA
- [x] Schema de banco de dados

### V1.0
- [ ] Autenticação completa
- [ ] Dashboard funcional
- [ ] CRUD de propostas
- [ ] Sistema de créditos
- [ ] Stripe integration

### V2.0
- [ ] Avatar Luna com vídeo
- [ ] Alertas WhatsApp
- [ ] Analytics avançado
- [ ] A/B testing

---

## 📞 Suporte

**Projeto de:** Marcos Daniel — Mottivme Sales

---

*Criado em Dezembro 2025*

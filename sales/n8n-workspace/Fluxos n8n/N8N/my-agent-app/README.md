# My Agent App

Aplicação VoltAgent usando **Google Gemini 2.0 Flash** - o modelo mais barato disponível!

## 💰 Custos Comparativos

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) | Economia vs Claude |
|--------|----------------------|------------------------|-------------------|
| **Google Gemini 2.0 Flash** | $0.075 | $0.30 | 98% mais barato |
| OpenAI GPT-4o-mini | $0.15 | $0.60 | 95% mais barato |
| Groq Llama 3.3 70B | GRÁTIS* | GRÁTIS* | 100% mais barato |
| Anthropic Claude Sonnet 4.5 | $3.00 | $15.00 | - |
| Anthropic Claude Opus 4.5 | $5.00 | $25.00 | +67% mais caro |

*Groq é gratuito mas tem rate limits

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Adicione as dependências do Google AI:
```bash
npm install @ai-sdk/google
```

3. Configure sua API key:
```bash
cp .env.example .env
# Edite .env e adicione sua GOOGLE_GENERATIVE_AI_API_KEY
```

## 📝 Como Usar

Executar em modo desenvolvimento:
```bash
npm run dev
```

Build para produção:
```bash
npm run build
npm start
```

## 🔑 Obtendo API Keys

### Google AI (Gemini) - Recomendado
1. Acesse: https://aistudio.google.com/apikey
2. Crie uma nova API key
3. Adicione no `.env` como `GOOGLE_GENERATIVE_AI_API_KEY`

### Groq (Gratuito) - Alternativa
1. Acesse: https://console.groq.com/keys
2. Crie uma conta gratuita
3. Gere uma API key
4. Adicione no `.env` como `GROQ_API_KEY`

## 🔄 Trocar de Modelo

Para usar outro modelo, edite `src/index.ts`:

**Para Groq (gratuito):**
```typescript
import { createGroq } from '@ai-sdk/groq';
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
model: groq('llama-3.3-70b-versatile')
```

**Para Claude Sonnet 4.5:**
```typescript
import { createAnthropic } from '@ai-sdk/anthropic';
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
model: anthropic('claude-sonnet-4-5-20250929')
```

**Para Claude Opus 4.5:**
```typescript
model: anthropic('claude-opus-4-5-20251101')
```

## 📚 Documentação

- VoltAgent: https://voltagent.dev
- Google AI: https://ai.google.dev/gemini-api/docs
- Vercel AI SDK: https://sdk.vercel.ai

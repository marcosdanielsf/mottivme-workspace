# PRODUTO-ELETRIFY.md
> SaaS de geracao de copy usando a metodologia Sexy Canvas

---

## 1. VISAO GERAL

### O que e o Eletrify
Plataforma SaaS que usa IA para gerar copies persuasivas aplicando automaticamente os 14 gatilhos emocionais da metodologia Sexy Canvas de Andre Diamand.

### Proposta de Valor
> "Copies que ELETRIFICAM a mente do seu cliente - sem precisar ser copywriter"

### Status
- **Fase:** MVP desenvolvido
- **Prioridade:** Alta
- **Stack:** Next.js 15 + Supabase + OpenAI
- **URL Dev:** http://localhost:3001

---

## 2. FUNCIONALIDADES

### Core Features
```
┌─────────────────────────────────────────────────────────────────┐
│                       ELETRIFY                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] GERADOR DE COPY     [2] GERADOR DE EMAILS                 │
│      - Posts para redes      - Sequências                      │
│      - Headlines             - Cold emails                     │
│      - Hooks de abertura     - Follow-ups                     │
│      - Descrições            - Nurturing                      │
│                                                                 │
│  [3] GERADOR DE VSL      [4] ANALISADOR DE COPY                │
│      - Scripts completos     - Score de persuasão             │
│      - Roteiros de vídeo     - Gatilhos detectados            │
│      - Estrutura AIDA        - Sugestões de melhoria          │
│                                                                 │
│  [5] 14 GATILHOS         [6] TEMPLATES                         │
│      - Seleção manual        - Por nicho                      │
│      - Sugestão por          - Por objetivo                   │
│        objetivo              - Editáveis                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Os 14 Gatilhos Emocionais
```
┌─────────────────────────────────────────────────────────────────┐
│              7 PECADOS CAPITAIS + 7 CRIANÇA INTERIOR            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PECADOS CAPITAIS:                                              │
│  1. LUXÚRIA    - Desejo intenso por algo                       │
│  2. GULA       - Querer mais e mais                            │
│  3. AVAREZA    - Medo de perder dinheiro/oportunidade          │
│  4. PREGUIÇA   - Busca por atalhos e facilidade                │
│  5. IRA        - Frustração com status quo                     │
│  6. INVEJA     - Querer o que outros têm                       │
│  7. VAIDADE    - Desejo de reconhecimento                      │
│                                                                 │
│  CRIANÇA INTERIOR:                                              │
│  8. CURIOSIDADE - Vontade de descobrir                         │
│  9. AMOR        - Conexão emocional                            │
│  10. SEGURANÇA  - Proteção e garantias                         │
│  11. MEDO       - Aversão à perda                              │
│  12. FANTASIA   - Sonhos e aspirações                          │
│  13. PERTENCER  - Fazer parte de algo                          │
│  14. URGÊNCIA   - Agir agora                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. ARQUITETURA TECNICA

### Localizacao no Monorepo
```
mottivme-platform/
├── apps/
│   └── eletrify/            # Este produto
│       ├── src/
│       │   ├── app/         # App Router
│       │   ├── components/  # Componentes React
│       │   ├── lib/
│       │   │   ├── triggers/  # 14 gatilhos Sexy Canvas
│       │   │   └── ai/        # Prompts de IA
│       │   └── types/
│       └── package.json
```

### Database Schema
```sql
-- Usuários e workspace
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT,
    niche TEXT,
    brand_voice JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Copies geradas
CREATE TABLE copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    type TEXT, -- 'post', 'headline', 'email', 'vsl', etc
    input JSONB,
    output TEXT,
    triggers_used TEXT[],
    score INT,
    favorited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    type TEXT,
    niche TEXT,
    structure TEXT,
    triggers TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id)
);

-- Análises de copy
CREATE TABLE copy_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    original_copy TEXT,
    analysis JSONB,
    suggestions TEXT[],
    score INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### API Routes
```
/api/generate/
├── /post      - Gerar post para redes
├── /headline  - Gerar headlines
├── /hook      - Gerar hooks de abertura
├── /email     - Gerar emails
├── /vsl       - Gerar script de VSL
└── /custom    - Geração customizada

/api/analyze/
└── POST       - Analisar copy existente

/api/templates/
├── GET        - Listar templates
└── POST       - Criar template

/api/copies/
├── GET        - Histórico de copies
└── [id]/
    ├── GET    - Detalhes
    └── PUT    - Favoritar/editar
```

---

## 4. MOTOR DE GERACAO

### Prompt Base (Sexy Canvas)
```javascript
const basePrompt = `
Você é um copywriter expert na metodologia Sexy Canvas de André Diamand.

METODOLOGIA SEXY CANVAS:
A copy perfeita não vende produtos - ela ELETRIFICA emoções.
Cada palavra deve acionar pelo menos um dos 14 gatilhos emocionais.

OS 14 GATILHOS:
${triggers.map(t => `- ${t.name}: ${t.description}`).join('\n')}

REGRAS DE OURO:
1. Nunca seja genérico - seja específico e visceral
2. Provoque desconforto antes de oferecer a solução
3. Use linguagem sensorial (ver, sentir, ouvir)
4. Crie contraste entre DOR e PRAZER
5. Termine sempre com chamada emocional, não racional

NICHO: ${input.niche}
OBJETIVO: ${input.objective}
GATILHOS PRIORITÁRIOS: ${input.triggers.join(', ')}
TOM: ${input.tone}
`;
```

### Gerador de Posts
```javascript
const generatePost = async (input) => {
  const prompt = `
    ${basePrompt}

    GERE UM POST PARA ${input.platform} COM:
    - Hook de abertura (usar ${input.triggers[0]})
    - Desenvolvimento (aplicar gatilhos secundários)
    - CTA emocional (não racional)
    - Max ${input.maxLength} caracteres

    TEMA: ${input.topic}
    PRODUTO/SERVIÇO: ${input.product}
  `;

  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8
  });
};
```

### Gerador de VSL
```javascript
const generateVSL = async (input) => {
  const prompt = `
    ${basePrompt}

    GERE UM SCRIPT DE VSL (Video Sales Letter) COM:

    ESTRUTURA (12-15 minutos):
    1. HOOK (30 seg) - Gatilho: Curiosidade + Medo
    2. HISTÓRIA (3 min) - Gatilho: Empatia + Dor
    3. VIRADA (2 min) - Gatilho: Esperança
    4. SOLUÇÃO (3 min) - Gatilho: Fantasia + Avareza
    5. PROVA (2 min) - Gatilho: Segurança + Inveja
    6. OFERTA (2 min) - Gatilho: Gula + Vaidade
    7. URGÊNCIA (1 min) - Gatilho: Medo + Urgência
    8. CTA (30 seg) - Gatilho: Todos convergindo

    PRODUTO: ${input.product}
    AVATAR: ${input.avatar}
    PREÇO: ${input.price}
  `;

  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });
};
```

### Analisador de Copy
```javascript
const analyzeCopy = async (copy) => {
  const prompt = `
    ANALISE ESTA COPY USANDO A METODOLOGIA SEXY CANVAS:

    "${copy}"

    RETORNE EM JSON:
    {
      "score": 0-100,
      "triggers_detected": ["gatilho1", "gatilho2"],
      "triggers_missing": ["gatilho3"],
      "strengths": ["ponto forte 1", "ponto forte 2"],
      "weaknesses": ["ponto fraco 1"],
      "suggestions": [
        {
          "original": "trecho original",
          "improved": "trecho melhorado",
          "reason": "por que é melhor"
        }
      ],
      "rewritten_version": "versão completa reescrita"
    }
  `;

  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });
};
```

---

## 5. BIBLIOTECA DE GATILHOS

### Estrutura de Cada Gatilho
```javascript
// /lib/triggers/luxuria.ts
export const luxuria = {
  id: 'luxuria',
  name: 'Luxúria',
  category: 'pecados',
  description: 'Desejo intenso por algo que parece irresistível',
  when_to_use: [
    'Lançamentos de produtos premium',
    'Ofertas exclusivas',
    'Experiências únicas'
  ],
  power_words: [
    'irresistível', 'exclusivo', 'secreto', 'proibido',
    'tentador', 'sedutor', 'viciante', 'magnético'
  ],
  examples: [
    'A estratégia proibida que os experts não querem que você saiba',
    'O método secreto que vai te deixar viciado em resultados'
  ],
  combinations: ['vaidade', 'curiosidade', 'avareza'],
  intensity: {
    low: 'Ideal para produtos de necessidade',
    medium: 'Funciona bem para serviços',
    high: 'Perfeito para high ticket e exclusivos'
  }
};
```

### Mapa de Combinacoes
```
OBJETIVO → GATILHOS RECOMENDADOS
────────────────────────────────
Lançamento      → Curiosidade + Urgência + Inveja
Escassez        → Medo + Avareza + Urgência
Autoridade      → Vaidade + Segurança + Pertencer
Storytelling    → Amor + Fantasia + Curiosidade
Objeção Preço   → Avareza + Medo + Preguiça
High Ticket     → Luxúria + Vaidade + Inveja
Recorrência     → Segurança + Pertencer + Amor
```

---

## 6. INTERFACE DO USUARIO

### Fluxo de Geração
```
1. SELECIONAR TIPO
   - Post, Headline, Email, VSL, etc.

2. DEFINIR CONTEXTO
   - Nicho/mercado
   - Produto/serviço
   - Avatar/público

3. ESCOLHER GATILHOS
   - Seleção manual ou
   - Sugestão automática por objetivo

4. CONFIGURAR DETALHES
   - Tom de voz
   - Tamanho
   - Plataforma

5. GERAR
   - 3 variações
   - Score de cada uma

6. REFINAR
   - Editar
   - Regenerar
   - Salvar favoritos
```

### Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│                    ELETRIFY DASHBOARD                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COPIES GERADAS          GATILHOS MAIS USADOS                  │
│  ─────────────           ───────────────────                   │
│  Este mês: 234           1. Curiosidade (89%)                  │
│  Total: 1.456            2. Urgência (76%)                     │
│                          3. Avareza (68%)                      │
│                                                                 │
│  SCORE MÉDIO             TIPOS MAIS GERADOS                    │
│  ──────────              ─────────────────                     │
│  78/100                  1. Posts (45%)                        │
│                          2. Headlines (28%)                    │
│                          3. Emails (15%)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. MODELO DE NEGOCIO

### Planos
```
FREE             PRO              AGENCY
R$ 0             R$ 97/mês        R$ 297/mês

- 10 copies/mês  - 100 copies     - Ilimitado
- Posts apenas   - Todos os tipos - White label
- 3 gatilhos     - 14 gatilhos    - Workspaces
- Sem histórico  - Histórico      - API
                 - Templates      - Multi-user
                 - Analisador     - Suporte priority
```

### Métricas Target
- **Free → Pro Conversion:** 15%
- **Churn:** < 5%/mês
- **MRR Target:** R$ 30.000 em 6 meses

---

## 8. SETUP E DEPLOY

### Desenvolvimento Local
```bash
cd /n8n-workspace/SAAS/mottivme-platform
npm install
npm run dev:eletrify  # http://localhost:3001
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Deploy Vercel
```bash
cd apps/eletrify
vercel --prod
```

---

## 9. ARQUIVOS RELACIONADOS

```
/n8n-workspace/SAAS/mottivme-platform/apps/eletrify/   # App
/n8n-workspace/SAAS/SUPER-PROMPT-SEXY-CANVAS.md        # Prompt base
/n8n-workspace/SAAS/MAPA-ELETRIFICACAO.md              # Framework visual
/n8n-workspace/SAAS/SISTEMA-ELETRIFICACAO-TOTAL.md     # Sistema completo
/CONTEXTOS/FRAMEWORKS/FRAMEWORK-SEXY-CANVAS.md         # Documentação
```

---

## 10. ROADMAP

### MVP (Atual)
- [x] Gerador de posts
- [x] Seleção de gatilhos
- [x] Interface básica
- [ ] Histórico de copies
- [ ] Templates

### V1.0
- [ ] Gerador de emails
- [ ] Gerador de VSL
- [ ] Analisador de copy
- [ ] Dashboard completo

### V2.0
- [ ] Multi-workspace
- [ ] White label
- [ ] API pública
- [ ] Integração com Socialfy

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

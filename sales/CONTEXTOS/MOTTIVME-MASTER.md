# MOTTIVME-MASTER.md
> Visao geral da empresa - Use este documento como ponto de partida

---

## 1. IDENTIDADE DA EMPRESA

### Quem Somos
**Mottivme Sales** - Agencia de automacao de vendas e marketing especializada em criar sistemas autonomos de prospeccao, qualificacao e fechamento.

### Modelo de Negocio
- **B2B Services**: Implementacao de sistemas de automacao para clientes
- **SaaS Products**: Plataformas proprias (Propostal, Eletrify, Socialfy)
- **AI Factory**: Fabrica de agentes de IA especializados por vertical

### Missao
> "Transformar negocios em maquinas de vendas autonomas usando IA e automacao inteligente"

---

## 2. VERTICAIS DE ATUACAO

| Vertical | Documento de Contexto | Clientes |
|----------|----------------------|----------|
| Clinicas High Ticket | `VERTICAIS/VERTICAL-CLINICAS.md` | Dr. Luiz, Orthodontic Biguacu |
| Servicos Financeiros | `VERTICAIS/VERTICAL-FINANCEIRO.md` | Lappe Financial Group |
| Servicos Gerais | `VERTICAIS/VERTICAL-SERVICOS.md` | (Template) |
| Mentores/Infoprodutores | `VERTICAIS/VERTICAL-MENTORES.md` | Carol/Luiz Medical Mentorship |

---

## 3. PRODUTOS PROPRIOS

| Produto | Documento | Status |
|---------|-----------|--------|
| Assembly Line | `PRODUTOS/PRODUTO-ASSEMBLY-LINE.md` | MVP |
| Socialfy | `PRODUTOS/PRODUTO-SOCIALFY.md` | Conceito |
| Propostal | `PRODUTOS/PRODUTO-PROPOSTAL.md` | MVP |
| Eletrify | `PRODUTOS/PRODUTO-ELETRIFY.md` | MVP |
| MIS Sentinel | `PRODUTOS/PRODUTO-MIS-SENTINEL.md` | Planejamento |

---

## 4. STACK TECNOLOGICA

### Automacao & IA
- **n8n**: Orquestracao de workflows (self-hosted)
- **OpenAI**: GPT-4o para agentes de IA
- **ElevenLabs**: Sintese de voz para avatares
- **Heygen**: Avatares de video

### CRM & Comunicacao
- **GoHighLevel (GHL)**: CRM principal, pipelines, automacoes
- **Kommo**: CRM alternativo (vertical financeiro)
- **Evolution API**: WhatsApp multi-device

### Desenvolvimento
- **Next.js 15**: Frontend (App Router)
- **Supabase**: Backend (PostgreSQL + Auth)
- **Vercel**: Deploy e hosting
- **Turborepo**: Monorepo management

### Inteligencia
- **MCP Servers**: Context7, Claude Flow, RUV Swarm
- **Claude Code**: Desenvolvimento assistido por IA

---

## 5. ARQUITETURA AI FACTORY

```
┌─────────────────────────────────────────────────────────┐
│                    AI FACTORY                           │
├─────────────────────────────────────────────────────────┤
│  CAMADA DE ORQUESTRACAO                                 │
│  ├── n8n (workflows)                                    │
│  ├── GHL (CRM + pipelines)                              │
│  └── Supabase (dados + auth)                            │
├─────────────────────────────────────────────────────────┤
│  CAMADA DE AGENTES                                      │
│  ├── SDR Agent (prospecção)                             │
│  ├── Secretaria Virtual (atendimento)                   │
│  ├── Closer Agent (qualificação)                        │
│  └── Content Agent (criação)                            │
├─────────────────────────────────────────────────────────┤
│  CAMADA DE COMUNICACAO                                  │
│  ├── WhatsApp (Evolution API)                           │
│  ├── Email (GHL)                                        │
│  ├── SMS (GHL)                                          │
│  └── Voice (ElevenLabs)                                 │
├─────────────────────────────────────────────────────────┤
│  CAMADA DE DADOS                                        │
│  ├── PostgreSQL (Supabase)                              │
│  ├── GHL Custom Objects                                 │
│  └── n8n Variables                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 6. EQUIPE CORE

| Nome | Role | Email |
|------|------|-------|
| Marcos Daniel | Founder/CEO | marcos@mottivme.com.br |
| Isabella Delduco | Senior SDR / Business Operations Lead | isabella@mottivme.com.br |

---

## 7. FRAMEWORKS METODOLOGICOS

| Framework | Documento | Aplicacao |
|-----------|-----------|-----------|
| Sexy Canvas | `FRAMEWORKS/FRAMEWORK-SEXY-CANVAS.md` | Copywriting e vendas |
| CRITICS | (Embutido nos prompts) | Criacao de agentes IA |
| No-Go Sales | (Aplicado em verticais) | Qualificacao de leads |
| NEPQ | (Aplicado em verticais) | Perguntas neuro-emocionais |

---

## 8. CREDENCIAIS E ACESSOS

Ver documento: `CREDENCIAIS/CREDENCIAIS-MASTER.md`

**Ambientes Supabase:**
- Projeto Financeiro: `xbqxivqzetaoptuyykmx`
- Projeto CEO: `bfumywvwubvernvhjehk`

**GoHighLevel:**
- Location ID: `cd1uyzpJox6XPt4Vct8Y`

---

## 9. GUIA DE USO DOS DOCUMENTOS

### Quando usar cada documento:

| Situacao | Documento |
|----------|-----------|
| Visao geral, estrategia, arquitetura | `MOTTIVME-MASTER.md` (este) |
| Trabalhar com clinicas odonto/medicas | `VERTICAL-CLINICAS.md` |
| Trabalhar com consultores financeiros | `VERTICAL-FINANCEIRO.md` |
| Trabalhar com mentores/infoprodutores | `VERTICAL-MENTORES.md` |
| Desenvolver Assembly Line | `PRODUTO-ASSEMBLY-LINE.md` |
| Desenvolver Propostal | `PRODUTO-PROPOSTAL.md` |
| Desenvolver Eletrify | `PRODUTO-ELETRIFY.md` |
| Criar copy/vendas | `FRAMEWORK-SEXY-CANVAS.md` |
| Configurar integrações | `CREDENCIAIS-MASTER.md` |

### Combinacoes Comuns:

1. **Implementar agente para clinica:**
   - MOTTIVME-MASTER.md + VERTICAL-CLINICAS.md

2. **Desenvolver feature do Propostal:**
   - MOTTIVME-MASTER.md + PRODUTO-PROPOSTAL.md + CREDENCIAIS-MASTER.md

3. **Criar campanha de vendas:**
   - VERTICAL-[ESPECIFICA].md + FRAMEWORK-SEXY-CANVAS.md

---

## 10. LINKS IMPORTANTES

### Repositorios
- Monorepo Platform: `/n8n-workspace/SAAS/mottivme-platform/`
- Sexy Canvas System: `/n8n-workspace/SAAS/sexy-canvas-system/`
- Workflows n8n: `/n8n-workspace/Fluxos n8n/`

### Documentacao
- Master Context Original: `/MOTTIVME-MASTER-CONTEXT.md`
- Strategy 2026: `/Mottivme Strategy 2026/`

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

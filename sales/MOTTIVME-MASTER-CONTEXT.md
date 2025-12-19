# MOTTIVME - DOCUMENTO MESTRE DE CONTEXTO

> **IMPORTANTE**: Este documento serve como contexto UNICO para todas as conversas com IA.
> Ao iniciar uma nova conversa, forneca este arquivo para evitar repetir contextos.
>
> **Ultima atualizacao**: 2025-12-16 (v1.2)
>
> **ESCOPO**: Este documento cobre a vertical de Clinicas e Consultorios High Ticket da Mottivme.

---

## 1. VISAO GERAL DO NEGOCIO

### O Que e a Mottivme
- **Agencia de IA e Crescimento B2B** focada em negocios fisicos (clinicas, consultorios High Ticket)
- **Modelo**: Instalar sistemas completos de IA que resolvem ineficiencia operacional na conversao de leads
- **Diferencial**: Sistema ponta a ponta (do lead ao show, do show ao fechamento, do fechamento a referencia)

### Problema Central que Resolvemos
- Tempo medio de resposta dos clientes: 42-47 horas (deveria ser <5 min)
- 62% das ligacoes nao sao atendidas
- 27% nunca fazem follow-up pos-venda
- **Cliente gasta em ads, gera leads, mas perde por falta de velocidade e processos**

### ICP (Ideal Customer Profile)
- Clinicas e consultorios High Ticket (medicina estetica, longevidade, etc.)
- Ticket: R$15k - R$50k por tratamento
- Ja investem em marketing mas falham no acompanhamento
- Proprietarios "operadores" ocupados demais para gerenciar leads

---

## 2. ARQUITETURA DO SISTEMA (AI FACTORY)

### Fluxo Macro
```
1. AQUISICAO (Ads + Conteudo)
   |
2. QUALIFICACAO (IA + Lead Score)
   |
3. CALL DE VENDAS
   |-- IA analisa call (Head de Vendas)
   |-- Extrai: scores, objecoes, probabilidade
   |
4. DADOS NO GHL (Custom Objects)
   |-- Analises de Call (historico)
   |-- Objecoes detectadas
   |-- Insights do lead
   |
5. ONBOARDING (pos-fechamento)
   |-- Call de Kickoff
   |-- IA gera config do agente automaticamente
   |
6. DEPLOY DO AGENTE
   |-- Versionado no Supabase
   |-- Performance tracking
```

### Pipelines GHL

**Pipeline 1 - Pre-Vendas (Consulta Paga)**
```
Lead Entrou -> Qualificado -> Consulta Apresentada -> Pagamento Pendente -> GANHO (consulta paga) -> Perdido
```
- Regra: Nao existe "agendado sem pagamento"
- Pagamento = confirmacao

**Pipeline 2 - Vendas (Tratamento High Ticket)**
```
Consulta Realizada -> Orcamento Criado -> Em Negociacao -> GANHO (tratamento fechado) -> Perdido
```

### Custom Objects Necessarios no GHL

| Object | Campos Principais | Associacao |
|--------|-------------------|------------|
| **Analises de Call** | Data, Tipo, Scores (BANT, SPIN, Conducao, Fechamento), Tier, Resumo, Probabilidade | Contact (1) -> Analises (N) |
| **Objecoes** | Tipo, Intensidade, Origem, Status, Proxima acao | Contact (1) -> Objecoes (N), Treatment (1) -> Objecoes (N) |
| **Consultas** | Data, Status, Valor, Origem, Concierge | Contact (1) -> Consultas (N) |
| **Tratamentos** | Tipo, Valor, Status clinico, Status comercial, Motivo perda | Contact (1) -> Tratamentos (N) |

---

## 3. INVENTARIO COMPLETO DE ATIVOS

### 3.1 Fluxos n8n - MKT/Vendas
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/Fluxos n8n/Fluxos BASE - n8n do BPO da mottivme/2. MKT:Vendas/`

#### 1. Marketing
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [Meta Ads System - 1. Reference Ad Scraper](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/1.%20Meta%20Ads%20System%20-%201.%20Reference%20Ad%20Scraper%20(2).json) | Scrapa anuncios de concorrentes via Meta Ad Library | Pronto |
| [Meta Ads System - 1b. Import Scraped Ads](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/2.%20Meta%20Ads%20System%20-%201b.%20Import%20Scraped%20Ads%20to%20Generated%20Ads%20(2).json) | Importa ads para geracao de novos criativos | Pronto |
| [Image Generation - Fixed](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/Image%20Generation%20-%20Fixed%20(1).json) | Geracao de imagens via IA | Pronto |
| [video_generator](1.%20Marketing/Meta%20ads%20scraper%20e%20criacao%20de%20conteúdo%20/video_generator%20(1).json) | Geracao de videos | Pronto |
| [SEO Content Generation System](1.%20Marketing/SEO%20Content%20Generation%20System%20-%20V1%20Skool%20(1).json) | Sistema completo de geracao de conteudo SEO | Pronto |
| [Social Media Scheduling - LinkedIn](1.%20Marketing/Social%20Media%20Scheduling%20-%20Blotato%20__%20For%20Viral%20LinkedIn%20Posts%20(n8n)%20-%20Skool%20Paid%20(1).json) | Agendamento de posts virais LinkedIn | Pronto |
| [Assembly line APP](1.%20Marketing/Assemblyline%20/Assembly%20line%20APP.json) | App de criacao de conteudo | Pronto |
| [VSL](1.%20Marketing/Assemblyline%20/VSL.json) | Geracao de VSL | Pronto |

#### 2. Pre-Vendas
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [GHL - Mottivme - EUA - COM REAGENDAMENTO - COM TOKEN TRACKING v2](2.%20Pré%20Vendas/GHL%20-%20Mottivme%20-EUA%20-%20COM%20REAGENDAMENTO%20-%20COM%20TOKEN%20TRACKING%20v2.json) | Agente SDR principal com tracking | Pronto |
| [GHL-REAGENDAMENTO-NOSHOW-COM-IA](2.%20Pré%20Vendas/GHL-REAGENDAMENTO-NOSHOW-COM-IA.json) | Recuperacao de no-show | Pronto |
| [Follow Up Eterno](2.%20Pré%20Vendas/[%20GHL%20]%20Follow%20Up%20Eterno.json) | Follow-up automatizado | Pronto |
| [Lead Gen Army V3](2.%20Pré%20Vendas/Inteligência%20Comercial/Lead%20Gen%20Army%20V3%20-%20LIVE%20(1).json) | Geracao de leads | Pronto |
| **Email MKT/** | Sistema completo de cold email | |
| - Lead_Scraping_2_0 | Scraping de leads | Pronto |
| - Email_Preparation | Preparacao de emails | Pronto |
| - Email_1/2/3_T2 | Sequencias de email | Pronto |
| **Tools Agentes SDR/** | Ferramentas auxiliares | |
| - MCP - Historias Clientes | Historias de sucesso | Pronto |
| - Contador de Tentativas de Objecao | Tracking de objecoes | Pronto |
| - Verificar agendamento existente | Checagem de agenda | Pronto |
| - Atualizar Estado/Work Permit/Profissao GHL | Atualizacao de campos | Pronto |

#### 3. Vendas
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [AI Agent - Head de Vendas](3.%20Vendas/AI%20Agent%20-%20Head%20de%20Vendas.json) | **CORE** - Analisa calls de vendas, da scores BANT/SPIN, probabilidade de fechamento | Pronto |
| [Gerar PDF Proposta BPOSS](3.%20Vendas/Gerar%20PDF%20Proposta%20BPOSS.json) | Geracao automatica de propostas | Pronto |
| [CS Call Analyzer - Mottivme](3.%20Vendas/CS%20Call%20Analyzer%20-%20Mottivme.json) | Analisador de calls CS | Em desenvolvimento |
| [ADMIN - Geracao de notas de reuniao](3.%20Vendas/ADMIN%20-%20Geração%20de%20notas%20de%20reunião%20a%20partir%20de%20arquivos%20e%20do%20TimeOS.json) | Notas automaticas | Pronto |

#### 5. Infra
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [Inserir Lead Insights - V2](5.%20Infra/Inserir%20Lead%20Insights%20-%20V2%20(Melhorado).json) | Enriquecimento de leads | Pronto |
| [ADMIN - Backup N8N to GDrive](5.%20Infra/ADMIN%20-%20Backup%20N8N%20to%20GDrive.json) | Backup automatico | Pronto |
| [Airtable Integration](5.%20Infra/Airtable%20Integration%20-%20CORRIGIDO%20(1).json) | Integracao Airtable | Pronto |

#### 6. Pos-Venda
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| [MIS - V3](6.%20Pós%20Venda/MIS%20-%20V3.json) | Sistema de monitoramento | Pronto |
| [Facebook Ads Daily Report](6.%20Pós%20Venda/Facebook%20Ads%20Daily%20Report%20-%20CORRIGIDO.json) | Relatorios diarios de ads | Pronto |
| [Customer Service AI Bot](6.%20Pós%20Venda/Customer%20Service%20AI%20Bot%20-%20Complete.json) | Bot de atendimento CS | Pronto |
| [MIS - Auto Response to Critical Issues](6.%20Pós%20Venda/MIS%20-%20Auto%20Response%20to%20Critical%20Issues%20(READY).json) | Resposta automatica a issues criticos | Pronto |

#### Sistema Secretaria Base
**O que e**: Sistema completo de atendimento automatizado via WhatsApp para clinicas.
**Funcao**: Substitui secretaria humana para agendamentos, lembretes, recuperacao de leads e escalacao.
**Integracao**: Usa Socialfy como backend de dados.

> **Nota**: O dominio `cliente-a1.mentorfy.io` que aparece em alguns webhooks e infraestrutura legada/compartilhada. MentorFy nao e mais produto da Mottivme.

| Arquivo | Descricao |
|---------|-----------|
| [00. Configuracoes](Secretária%20Base/00.%20Configurações.json) | Configuracoes base |
| [01. Secretaria](Secretária%20Base/01.%20Secretária.json) | Agente principal |
| [02. Baixar e enviar arquivo do Google Drive](Secretária%20Base/02.%20Baixar%20e%20enviar%20arquivo%20do%20Google%20Drive.json) | Gestao de arquivos |
| [03. Busca Disponibilidade v3](Secretária%20Base/03.%20[%20Socialfy%20]%20Busca%20Disponibilidade%20v3.json) | Busca de horarios |
| [04. Agendar](Secretária%20Base/04.%20[%20Socialfy%20]%20Agendar.json) | Agendamento |
| [05. Escalar para humano](Secretária%20Base/05%20-%20Escalar%20para%20humano%20-%20SOCIALFY.json) | Escalacao |
| [06.1 Integracao Supabase](Secretária%20Base/06.1%20Integração%20Supabase.json) | Persistencia |
| [07. Quebrar e enviar mensagens](Secretária%20Base/07.%20Quebrar%20e%20enviar%20mensagens.json) | Envio de mensagens |
| [08. Agente Assistente Interno](Secretária%20Base/08.%20%20Agente%20Assistente%20Interno%20(3).json) | Assistente interno |
| [09. Desmarcar e enviar alerta](Secretária%20Base/09.%20Desmarcar%20e%20enviar%20alerta.json) | Cancelamentos |
| [10. Buscar ou criar contato + conversa](Secretária%20Base/10.%20Buscar%20ou%20criar%20contato%20+%20conversa.json) | Gestao de contatos |
| [11. Agente de Lembretes de Agendamento](Secretária%20Base/11.%20Agente%20de%20Lembretes%20de%20Agendamento.json) | Lembretes |
| [12. Gestao de ligacoes](Secretária%20Base/12.%20Gestão%20de%20ligações.json) | Gestao de calls |
| [13. Agente de Recuperacao de Leads](Secretária%20Base/13.%20Agente%20de%20Recuperação%20de%20Leads%20(1).json) | Recuperacao |
| [Prompt da Secretaria.md](Secretária%20Base/Prompt%20da%20Secretária.md) | Prompt base |

---

### 3.2 Projeto ghl-agency-ai
**Pasta**: `/GO HI LEVEL PASTA DE INFOS GERAIS/ghl-agency-ai/`

| Funcionalidade | Descricao | Arquivos Relevantes |
|----------------|-----------|---------------------|
| **Lead Enrichment (Apify)** | Enriquece leads com LinkedIn, cargo, empresa, telefone, confidence score | `LEAD_ENRICHMENT_QUICK_START.md` |
| **Meta Ads Manager (GPT-4 Vision)** | Analisa screenshots de ads, gera recomendacoes, cria variacoes de copy | `META_ADS_IMPLEMENTATION_SUMMARY.md` |
| **Browser Automation (Browserbase)** | Automacao de browser para acoes que API nao permite | `BROWSERBASE_GHL_SETUP.md` |
| **AI Hooks (useAI.ts)** | Hooks React para chat, observe, extract, multi-tab | `client/src/hooks/useAI.ts` |

---

### 3.3 SAAS / Aplicacoes Web
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/SAAS/`

| # | Projeto | Descricao | Stack | Status |
|---|---------|-----------|-------|--------|
| 1 | **mottivme-sales-calculator** | Calculadora de vendas e projecoes | Next.js 15 + shadcn + Recharts | Pronto |
| 2 | **Assembly Line** | Sistema de automacao de estrategia de marketing | Next.js 14 + Supabase + Airtable + n8n | Em desenvolvimento |
| 3 | **Dashboard-Mottivme-Sales** | Dashboard de vendas com graficos e metricas | Next.js 15 + Supabase + Recharts | Pronto |
| 4 | *(duplicado do 1)* | - | - | - |
| 5 | **mottivme-command-center** | Central de comando com planejador de vendas e comparativo | Next.js 16 + Supabase | Pronto |
| 6 | **invoice-generator-app** | Gerador de faturas, gestao de clientes, transacoes, relatorios | Next.js 15 + Supabase + jsPDF | Pronto |
| 7 | **Projeto total** | (pasta de organizacao) | - | - |
| 8 | **MIS-SENTINEL** | (versao antiga) | - | Deprecado |
| 9 | **Socialfy** | CRM e plataforma de gestao de relacionamento | Vite + React 19 + Supabase | Pronto |
| - | **MIS Sentinel** | Sistema de inteligencia para monitoramento de WhatsApp | Next.js 14 + Supabase + Gemini AI | Pronto |

#### Detalhes Assembly Line
- **Stack**: Next.js 14 + TypeScript + Supabase + Airtable + n8n
- **Fases**: F1A Clone, F1B Posicionamento, F2 Ecossistema, F3A Marketing, F4 Scripts, F5 Calendario
- **Outputs gerados (15 tipos)**: Clone de referencia, avatar, ofertas, scripts VSL, posts, reels, carrosseis, stories, calendario editorial, etc.
- **Planos**: Starter R$197 (1 proj, 100 cred) | Pro R$497 (5 proj, 500 cred) | Agency R$997 (ilimitado, 2000 cred)
- **Workflow n8n**: 29.640 linhas
- **Status**: Em desenvolvimento (falta API routes, steps briefing, pages projeto)
- **Deploy**: https://vercel.com/marcosdanielsfs-projects/v0-pointer-ai-landing-page

#### Detalhes MIS Sentinel
- **O que e**: Dashboard de IA para monitoramento de mensagens WhatsApp
- **Funcionalidades**:
  - Analise de sentimento (positivo, neutro, negativo, urgente)
  - Deteccao de padroes e geracao de alertas automaticos
  - Score de urgencia (0-10) por mensagem
  - Dashboard de equipe com performance individual
  - Workflow de resolucao: Reconhecer → Resolver
- **Integracao**: n8n captura WhatsApp → Gemini AI analisa → Supabase armazena → Dashboard exibe
- **Tipos de Alerta**: urgent_request, technical_issue, automation_opportunity, bottleneck, milestone, pattern_detected

#### Detalhes mottivme-command-center
- **O que e**: Central de comando para gestao de vendas
- **Paginas**:
  - `/dashboard-comparativo` - Comparativo de metricas
  - `/sales-planner` - Planejador de vendas
- **Stack**: Next.js 16 + React 19 + Supabase + Tailwind 4

#### Detalhes invoice-generator-app
- **O que e**: Sistema completo de faturamento
- **Paginas**:
  - `/clients` - Gestao de clientes
  - `/invoice` - Criar/editar faturas
  - `/history` - Historico de faturas
  - `/transactions` - Transacoes financeiras
  - `/reports` - Relatorios
  - `/settings` - Configuracoes
- **Stack**: Next.js 15 + Supabase + jsPDF + html2canvas

#### Detalhes Socialfy
- **O que e**: Plataforma de CRM propria da Mottivme
- **Integracao**: Backend para sistema Secretaria Base (workflows 03-10)
- **Stack**: Vite + React 19 + Supabase + Tailwind 4 + Recharts

---

### 3.4 Sexy Canvas / Eletrificacao (Frameworks de Vendas)
**Pasta**: `/MOTTIVME SALES TOTAL/n8n-workspace/SAAS/`

> **Base**: Metodologia Sexy Canvas de Andre Diamand - 14 gatilhos emocionais para "eletrificar" comunicacoes de vendas.

#### Arquivos de Documentacao
| Arquivo | Descricao |
|---------|-----------|
| [VSL-SCRIPT-COMPLETO.md](n8n-workspace/SAAS/VSL-SCRIPT-COMPLETO.md) | Script completo de VSL 12-15 min para Mottivme |
| [MAPA-ELETRIFICACAO.md](n8n-workspace/SAAS/MAPA-ELETRIFICACAO.md) | Framework visual: jornada em 5 fases (INTRO→WARN→EVOL→LOGIN→PROP) |
| [SISTEMA-ELETRIFICACAO-TOTAL.md](n8n-workspace/SAAS/SISTEMA-ELETRIFICACAO-TOTAL.md) | Aplicacao dos gatilhos em TODOS touchpoints de venda |
| [SUPER-PROMPT-SEXY-CANVAS.md](n8n-workspace/SAAS/SUPER-PROMPT-SEXY-CANVAS.md) | Super prompt para agentes IA aplicarem metodologia |

#### Os 14 Gatilhos do Sexy Canvas
**Bloco 1 - 7 Pecados Capitais (Desejos Primitivos):**
1. Vaidade - Sentir-se superior, exclusivo
2. Avareza - Maximizar ganhos, ROI
3. Luxuria - Desejo por coisas caras, premium
4. Inveja - Querer o que outros tem
5. Gula - Querer mais e mais (abundancia)
6. Preguica - Facilidade, minimo esforco
7. Ira - Raiva contra vilao comum

**Bloco 2 - 7 Elementos da Crianca Interior (Emocoes de Conforto):**
8. Amor - Conexao emocional, personalizacao
9. Curiosidade - Loops abertos, misterio
10. Diversao - Gamificacao, surpresas
11. Liberdade - Autonomia, escolha
12. Pertencimento - Comunidade, tribo
13. Recompensa - Bonus surpresa, presentes
14. Seguranca - Garantias, provas sociais

#### sexy-canvas-system/
**Pasta**: `/n8n-workspace/SAAS/sexy-canvas-system/`
- **O que e**: Sistema completo de portais de proposta imersiva
- **Subpastas**:
  - `portal-v2/` - Portal de proposta com 5 fases, animacoes, audio
  - `portal-ultimate/` - Versao avancada
  - `pitch-deck/` - Apresentacoes
- **Recursos**: Cursor customizado, particulas, voz robotica, Konami Code (easter egg)
- **Credenciais padrao**: login=`[nome-cliente]`, senha=`UltraVertex`

---

### 3.5 mottivme-platform (Monorepo SaaS)
**Pasta**: `/n8n-workspace/SAAS/mottivme-platform/`
- **Stack**: Next.js 15 + TypeScript + Tailwind + Supabase + OpenAI + Turborepo
- **Deploy**: Vercel

| App | Descricao | Porta Dev |
|-----|-----------|-----------|
| **Propostal** (`apps/propostal`) | SaaS de propostas interativas com rastreamento de comportamento, score de interesse 0-100, chat com IA (Luna) | :3000 |
| **Eletrify** (`apps/eletrify`) | SaaS de geracao de copy usando metodologia Sexy Canvas (posts, headlines, VSL, emails) | :3001 |

**Funcionalidades Propostal:**
- Portais de proposta interativos
- Rastreamento em tempo real
- Score de interesse (0-100)
- Chat com IA (Luna)
- Alertas quando lead esta quente
- Dashboard de metricas

**Funcionalidades Eletrify:**
- Gerador de Copy (posts, headlines, hooks)
- Gerador de Emails
- Gerador de VSL
- Analisador de Copy
- 14 gatilhos emocionais integrados

---

### 3.6 propostal/ (Portal Standalone)
**Pasta**: `/n8n-workspace/SAAS/propostal/`
- **O que e**: Versao standalone do portal de propostas
- **Arquivos**:
  - `index.html` - Portal de entrada
  - `proposal.html` - Proposta interativa
  - `ARCHITECTURE.md` - Arquitetura tecnica completa
  - `CLAUDE.md` - Contexto para IA
- **Integracao**: Supabase + Stripe + n8n + HeyGen (Avatar AI) + OpenAI

---

### 3.7 Strategy 2026
**Pasta**: `/MOTTIVME SALES TOTAL/Mottivme Strategy 2026/`

| Item | Descricao |
|------|-----------|
| **03-Sales-Assets/** | Assets de vendas |
| - Case-Studies/ | Casos de sucesso |
| - Propostas/ | Templates de propostas |
| - Landing-Pages/experience-portal/ | Portal de experiencia |
| **_workspace/prompts/** | Prompts de IA |
| **_workspace/workflows/** | Workflows adicionais |

---

## 4. MELHORIAS PLANEJADAS (ROADMAP)

### 4.1 Feedback Loop IA -> Resultado Real
- Quando oportunidade fecha -> atualiza Analise de Call com `resultado_real`
- IA aprende a calibrar previsoes
- Relatorio: "IA previu X, aconteceu Y, acuracia Z%"

### 4.2 Benchmark por Vendedor
- Campo `vendedor_responsavel` em cada analise
- Dashboard: media de scores por vendedor
- Alertas: "Vendedor X teve 3 calls com conducao < 5 essa semana"

### 4.3 Objecoes como Inteligencia de Produto
- Dashboard agregado de objecoes (nao por contato, mas geral)
- Correlacao: objecao X origem X ticket X resultado
- Alimenta copy, VSL, anuncios

### 4.4 Lead Score Pre-Call
- Score de qualidade do lead ANTES da call
- Baseado em: origem, comportamento, respostas de qualificacao
- Integra com Lead Enrichment (Apify) do ghl-agency-ai

### 4.5 Playbook Dinamico por Objecao
- Quando objecao X detectada -> dispara sequencia Y
- Preco -> Video "por que tratamento barato sai caro"
- Marido -> Audio "como conversar com seu parceiro"
- Medo -> Case de paciente similar

### 4.6 Agent Performance Tracking
- Cada agente gerado tem ID unico
- Metricas: taxa resolucao, satisfacao, escalations
- Dashboard: "Agente do Dr. Luiz: 78% resolucao, 4.2 satisfacao"

### 4.7 Versao do Agente <-> Resultado
- Supabase: `agent_versions` com metricas agregadas
- Comparativo entre versoes
- Decisao data-driven de rollback

---

## 5. CLIENTE ATUAL: DR. LUIZ

### Contexto
- Clinica High Ticket (medicina estetica/longevidade)
- Avatar: Mulheres 40+, altamente desejosas, travadas por marido/culpa/medo/dinheiro
- Consulta paga como filtro
- Tickets: R$15k - R$50k

### Arquivos Relacionados
- `/Mottivme Strategy 2026/Reuniao de fechamento - Dra. Carol e Dr. Luiz - 2025_12_05.txt`
- `/Mottivme Strategy 2026/03-Sales-Assets/Call-Analysis-Dra-Carol-Dr-Luiz.md`
- `/Mottivme Strategy 2026/03-Sales-Assets/Propostas/PROPOSTA-FINAL-IRRESISTIVEL-Carol-Luiz.md`

---

## 6. INTEGRACOES EXTERNAS E CREDENCIAIS

### 6.1 GoHighLevel - Subconta Central Mottivme
```
location_id: cd1uyzpJox6XPt4Vct8Y
ghl_api_key: pit-fe627027-b9cb-4ea3-aaa4-149459e66a03
```

**URL Pattern (acesso direto ao contato):**
```
https://app.socialfy.me/v2/location/cd1uyzpJox6XPt4Vct8Y/contacts/detail/{CONTACT_ID}
```

**Contact IDs Importantes:**
| Grupo | Contact ID | Uso |
|-------|------------|-----|
| Marcos Daniel (Admin) | `oaVXSzAd30bm5Mf2nMDW` | Notificacoes URGENTES |
| Financeiro BPOSS | `vUejYndMsxxnyGKO77JC` | Contratos, ADM/Financeiro |
| Gestao SDR | `skfa6JP6lLlAXkc8FfIp` | Erros da IA SDR |
| Agendamentos | `XdsVZ9Fx0dzToMPinO2r` | Notificacoes de reunioes |
| Automacoes/IA | `Ql1qBRN8GTemuG0BlM0F` | Erros de automacoes |

---

### 6.2 Supabase - Projetos

**Projeto FINANCEIRO (financeiro@mottivme.com.br):**
```
Project ID: xbqxivqzetaoptuyykmx
URL: https://xbqxivqzetaoptuyykmx.supabase.co
Dashboard: https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx/editor
```

**Projeto CEO (ceo@marcosdaniels.com):**
```
Project ID: bfumywvwubvernvhjehk
URL: https://bfumywvwubvernvhjehk.supabase.co
Dashboard: https://supabase.com/dashboard/project/bfumywvwubvernvhjehk/editor
```

> **Nota**: Chaves anon/service_role estao no arquivo `Credenciais Supabase ` na raiz do projeto.

---

### 6.3 Outras Integracoes
| Servico | Uso | Credenciais |
|---------|-----|-------------|
| **Google Meet** | Calls + transcricao automatica (Gemini) | - |
| **Google Drive** | Armazenamento de transcricoes | Pasta: 7. Calls |
| **Airtable** | Gestao de ads, conteudo | - |
| **Apify** | Scraping, lead enrichment | - |
| **Browserbase** | Automacao de browser | - |
| **OpenAI/Gemini** | LLMs para analise e geracao | - |
| **Twilio** | WhatsApp + Voice templates | - |

---

### 6.4 Workflow de Configuracao GHL
**Arquivo**: `Criar Campo Etapas do Funil - GHL [DOCUMENTADO PARA LLMs] (1).json`

Este workflow n8n contem:
- Criacao de tabelas PostgreSQL para historico de mensagens e fila
- Templates Twilio para voice calls
- Configuracao padrao de subconta GHL

**Tabelas criadas:**
- `n8n_historico_mensagens` - Historico de mensagens por sessao
- `n8n_fila_mensagens` - Fila de mensagens pendentes
- `n8n_status_atendimento` - Status de atendimento por sessao

---

## 7. STACK TECNICA

| Camada | Tecnologia | Uso |
|--------|------------|-----|
| Automacao | n8n (self-hosted) | Workflows, integracoes, agentes |
| CRM | GoHighLevel | Pipelines, contatos, Custom Objects |
| Database | Supabase | Persistencia, versionamento de agentes |
| No-code DB | Airtable | Gestao de ads, conteudo, dados estruturados |
| Frontend | Next.js 14 + TypeScript | Assembly Line, dashboards |
| UI | shadcn/ui + Tailwind | Componentes |
| State | Zustand | Gerenciamento de estado |
| LLMs | OpenAI, Gemini, Claude | Analise, geracao de conteudo |
| Scraping | Apify | Lead enrichment, dados externos |
| Browser Automation | Browserbase | Acoes que API nao permite |

---

## 8. DIAGRAMA DE CONEXOES (VISAO MACRO)

```
┌─────────────────────────────────────────────────────────────────┐
│                        AQUISICAO                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Meta Ads Scraper] → [Airtable] → [Gerador de Criativos]       │
│         ↑                                    ↓                   │
│         │                            [Ads publicados]            │
│         │                                    ↓                   │
│         │←──────────── [Analise de Objecoes] ←──────┐           │
└─────────────────────────────────────────────────────│───────────┘
                                                      │
┌─────────────────────────────────────────────────────│───────────┐
│                      PRE-VENDAS                     │           │
├─────────────────────────────────────────────────────│───────────┤
│  [Lead entra] → [SDR IA (GHL)] → [Qualificacao]     │           │
│                       ↓                              │           │
│              [Consulta Agendada + Paga]              │           │
└──────────────────────│───────────────────────────────────────────┘
                       ↓
┌──────────────────────│───────────────────────────────────────────┐
│                    VENDAS                                        │
├──────────────────────│───────────────────────────────────────────┤
│  [Call de Diagnostico] → [Head de Vendas IA]                     │
│                                ↓                                  │
│                    [Analise: BANT, SPIN, Objecoes]               │
│                                ↓                                  │
│                    [Custom Objects GHL] ─────────────────────────┤
│                                ↓                                  │
│                    [Negociacao] → [Fechamento]                   │
└──────────────────────│───────────────────────────────────────────┘
                       ↓
┌──────────────────────│───────────────────────────────────────────┐
│                   DELIVERY                                       │
├──────────────────────│───────────────────────────────────────────┤
│  [Kickoff Call] → [Call Analyzer Onboarding]                     │
│                            ↓                                      │
│              [Gera config do Agente automaticamente]             │
│                            ↓                                      │
│              [Deploy Agente] → [Supabase: versao + metricas]     │
│                            ↓                                      │
│              [Secretaria Base operando]                          │
└──────────────────────────────────────────────────────────────────┘

FEEDBACK LOOPS (a implementar):
─────────────────────────────────
[Resultado real da oportunidade] → [Atualiza Analise de Call] → [Calibra IA]
[Performance do Agente] → [Supabase] → [Sugere ajustes no prompt]
[Objecoes agregadas] → [Alimenta geracao de novos criativos]
```

---

## 9. ESTRUTURA DE PASTAS RECOMENDADA NO GOOGLE DRIVE

```
7. Calls/
├── 1. Vendas/        (Diagnostico)
├── 2. Onboarding/    (Kickoff)
├── 3. Revisao/       (Acompanhamento)
├── 4. Suporte/       (Suporte)
├── 5. Churn/         (Alinhamento)
└── 6. Outros/
```

---

## 10. FORMATO DE TITULO DE CALENDARIO GHL

```
Diagnostico - {{contact.name}} - {{contact.phone}}
Kickoff - {{contact.name}} - {{contact.phone}}
Acompanhamento - {{contact.name}} - {{contact.phone}}
Suporte - {{contact.name}} - {{contact.phone}}
Alinhamento - {{contact.name}} - {{contact.phone}}
```

---

## 11. PROXIMOS PASSOS IMEDIATOS

1. [ ] Criar Custom Objects no GHL (Analises de Call, Objecoes, Consultas, Tratamentos)
2. [ ] Atualizar workflow "AI Agent - Head de Vendas" para salvar em Custom Objects (nao apenas Custom Fields)
3. [ ] Criar tabelas no Supabase (clients, agent_versions, call_recordings, agent_metrics)
4. [ ] Implementar Feedback Loop (resultado real -> analise de call)
5. [ ] Criar workflow "Call Analyzer Onboarding" (gera config de agente)
6. [ ] Testar com Dr. Luiz

---

## 12. COMO USAR ESTE DOCUMENTO

### Ao iniciar nova conversa com IA:
1. Envie este arquivo como contexto inicial
2. Diga: "Este e o contexto do projeto Mottivme. [sua pergunta/tarefa]"

### Ao atualizar o documento:
1. Adicione novos ativos na secao correspondente
2. Atualize o status de tarefas
3. Mantenha a data de "Ultima atualizacao" no topo

---

**Criado por**: Claude + Marcos
**Data**: 2025-12-16
**Versao**: 1.2

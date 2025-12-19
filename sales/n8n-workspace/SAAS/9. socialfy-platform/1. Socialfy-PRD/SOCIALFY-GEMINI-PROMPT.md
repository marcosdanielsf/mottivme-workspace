# SOCIALFY - Prompt para Geracao de Frontend (Gemini/Canvas)

## CONTEXTO

Voce vai criar o frontend de uma plataforma SaaS chamada **Socialfy** - uma ferramenta de Sales Intelligence + Prospeccao Automatizada.

**Stack obrigatoria:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (componentes)

**Referencia visual:** Plataforma Vencefy (screenshots anexos)

---

## ESTRUTURA DE NAVEGACAO

### Sidebar (fixa a esquerda)
```
Logo: Socialfy (icone + texto)

Menu Principal:
- Dashboard (icon: LayoutDashboard)
- Campanhas (icon: Megaphone)
- Cadencias (icon: GitBranch)
- Conteudo (icon: FileText)
- Caixa de Entrada (icon: Inbox)
- Contas LinkedIn (icon: Linkedin)
- Contas Instagram (icon: Instagram)
- Leads (icon: Users)
- Kanban (icon: Columns)
- Agentes IA (icon: Bot)
- Equipe (icon: Users)
- Relatorios (icon: BarChart3)
- Configuracoes (icon: Settings)

Footer:
- Central de Ajuda (icon: HelpCircle)
- Suporte (icon: MessageSquare)
```

### Header (topo)
- Breadcrumb da pagina atual
- Notificacoes (icon: Bell)
- Avatar do usuario + dropdown (nome, email, logout)

---

## TELAS A CRIAR

### 1. DASHBOARD (`/dashboard`)

**Layout:** Grid de cards + tabela

**Cards superiores (4 colunas):**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Leads  │ │ Convites     │ │ Convites     │ │ Status       │
│              │ │ Enviados     │ │ Aceitos      │ │ Pipeline     │
│    1.247     │ │    892       │ │   456 (51%)  │ │  78 relac.   │
│              │ │              │ │              │ │  45 agend.   │
│ 15 campanhas │ │ 12 pendentes │ │ 234 aguard.  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**Filtros:** Periodo (Hoje, 7d, 30d, 3m) + Campanha (dropdown)

**Tabela "Campanhas de Conexao":**
| Nome | Leads | Enviados | Aceitos | Conv. | Status |
|------|-------|----------|---------|-------|--------|
| Camp. Dez | 30 | 30 | 19 | 63% | Badge verde |

**Cards inferiores (2 colunas):**
- Performance da Equipe (grafico donut)
- Cota de Leads (progress bar: X de Y)

---

### 2. CAMPANHAS (`/campanhas`)

**Header:** Titulo + Botao "Nova Campanha"

**Tabs:** Todas | Conexao | Aquecimento | Autoridade | Relacionamento | Instagram

**Lista de campanhas (cards):**
```
┌─────────────────────────────────────────────────────────────────┐
│ ● Autoridade V3 - 9 perfis - 25/08              [Autoridade]   │
│   👤 Rodrigo Santos                                     Ativa  │
│                                                                │
│   14 Perfis    237 Posts    234 Curtidas    253 Comentarios   │
│                                                  [Detalhes >] │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. CRIAR CAMPANHA (`/campanhas/nova`) - WIZARD

**Stepper:** Rede > Leads > Opcao > Agente > Mensagens > Cadencia > Config > Revisar

**Step 2 - Selecionar Leads:**
- Info: "Selecione ate 300 leads"
- Campo busca + Botao Filtros
- Checkbox "Selecionar todos"
- Selecao rapida: [-] [0] [+] [Selecionar]
- Tabela com checkbox, Nome, Cargo, Empresa, Status

**Step 4 - Escolher Agente:**
- Grid de cards com agentes disponiveis
- Card: Nome, preview do prompt, botoes Editar/Testar

**Step 5 - Gerar Mensagens:**
- Botao "Gerar Mensagens"
- Lista de leads com mensagem gerada
- Cada item: checkbox, avatar, nome, cargo, mensagem editavel

**Step 6 - Cadencia Follow-up:**
- Botao "+ Adicionar Step"
- Lista de steps: Delay (dias) + Mensagem template
- Botao "Salvar como Template"

**Step 8 - Resumo:**
- Cards com resumo de cada configuracao
- Botao "Criar Campanha"

---

### 4. LEADS (`/leads`)

**Header:** Titulo + Botoes "Importar Leads" e "Busca LinkedIn" e "Busca Instagram"

**Tabs:** Leads | Historico de Leads

**Tabela:**
| ☐ | Nome | Cargo | Empresa | Email | Campanha |
|---|------|-------|---------|-------|----------|
| ☐ | Mateus Nobre | Fellow | Jumpstart | - | Em Campanha |
| ☐ | Sarah Almachar | CEO | eviloslu | - | Disponivel |

**Filtros:** Busca + Dropdown "Filtrar por lista"

**Paginacao:** "Mostrando 1-20 de 1.247" + navegacao

---

### 5. BUSCA INSTAGRAM (`/leads/busca-instagram`)

**Card principal:**
```
Tipo de Busca:
○ Por Segmento/Profissao (ex: endocrinologista)
○ Por Hashtag (ex: #marketingdigital)
○ Por Localizacao (ex: Sao Paulo)
○ Seguidores de Perfil (ex: @influencer)

Input: [                              ]
Regiao: [Dropdown]    Limite: [Dropdown perfis]

Filtros avancados:
☑ Apenas contas comerciais
☑ Com email na bio
☑ Com link na bio
☐ Minimo de seguidores: [input]

[Iniciar Busca]
```

**Alert:** "A busca pode levar alguns minutos..."

---

### 6. AGENTES IA (`/agentes`)

**Header:** Titulo + Botoes "Criar Todos Agentes" e "Criar Agente"

**Tabs:** Mensagem Conexao | Caixa Entrada | Comentarios | Conteudo

**Grid de cards (3 colunas):**
```
┌─────────────────────┐
│ Agente Conexao V4   │
│                     │
│ Criado: 9/10/2025   │
│ 🇧🇷 Portugues       │
│                     │
│ "Crie uma msg       │
│ icebreak de no      │
│ max 200 carac..."   │
│                     │
│ [Editar] [Editar IA]│
│ [Testar]            │
└─────────────────────┘
```

---

### 7. EDITOR DE AGENTE (Modal ou pagina)

**Campos:**
- Nome (input)
- Tipo (dropdown)
- Idioma (dropdown)
- Modelo (dropdown: Claude, GPT-4)
- Temperatura (slider 0-1)
- Prompt (textarea grande com markdown)

**Botoes:** Editar com IA | Testar Agente

**Area de teste:**
- Input: Lead de exemplo
- Output: Mensagem gerada (preview)

---

### 8. KANBAN (`/kanban`)

**Toggle:** [Lista] [Kanban]

**Filtro:** Dropdown de contas

**4 Colunas draggable:**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│    NOVO     │ │RELACIONAM.  │ │  AGENDADO   │ │ CONVERTIDO  │
│     45      │ │     23      │ │     12      │ │      8      │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │
│ │ Card    │ │ │ │ Card    │ │ │ │ Card    │ │ │ │ Card    │ │
│ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

**Card:**
- Avatar + Nome
- Cargo
- Empresa
- Info contextual (msgs, data reuniao, valor)

---

### 9. CAIXA DE ENTRADA (`/inbox`)

**Layout 2 colunas:**

**Coluna esquerda (lista conversas):**
- Filtro: Dropdown de contas
- Tabs: Nao lidas | Todas | Arquivadas
- Lista de conversas (avatar, nome, preview, horario)
- Indicador de nao lido (bolinha azul)

**Coluna direita (conversa):**
- Header: Nome + Empresa
- Mensagens (bolhas alinhadas esquerda/direita)
- Input de mensagem + Botoes (IA, Anexo, Enviar)

---

### 10. CONTEUDO (`/conteudo`)

**Tabs:** Conteudos | Calendario

**Grid de cards:**
```
┌─────────────────────┐
│ Titulo do post...   │
│                     │
│ 📅 22/08/2025       │
│ 👤 Rodrigo          │
│    LinkedIn         │
│                     │
│ Preview do texto... │
│                     │
│ Status: Postado     │
│ 🕐 10/08 09:00      │
│                     │
│ [Ver Detalhes]      │
└─────────────────────┘
```

---

### 11. CRIAR CONTEUDO (Modal ou pagina)

**Campos:**
- Conta (dropdown)
- Fonte: URL ou Descrever tema
- Input de URL ou textarea
- Agente (dropdown)
- Data/hora agendamento

**Botao:** Gerar Post

**Preview:**
- Textarea com post gerado
- Botoes: Editar | Editar com IA
- Upload de imagem
- Botao: Criar Projeto

---

### 12. RELATORIOS (`/relatorios`)

**Grid de cards (tipos de relatorio):**
```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ Performance Camp. │ │ Performance Camp. │ │ Cronograma de     │
│ de Conexao    📊  │ │ de Aquecimento📈  │ │ Conteudo      📅  │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

**Configuracao:**
- Seletor de periodo (calendario)
- Botao: Gerar Relatorio
- Botao: Exportar PDF

---

### 13. CONFIGURACOES (`/configuracoes`)

**Tabs verticais:**
- Perfil
- Equipe
- Integracoes
- Base de Conhecimento
- Plano
- Notificacoes

**Aba Integracoes:**
- Tabela de webhooks (nome, evento, URL, status)
- Botao: Novo Webhook
- Cards de integracoes nativas (GHL, n8n, Zapier)

---

## COMPONENTES REUTILIZAVEIS

### shadcn/ui a usar:
- Button
- Card
- Table
- Tabs
- Badge
- Avatar
- Input
- Textarea
- Select
- Checkbox
- Switch
- Dialog (modais)
- Sheet (paineis laterais)
- DropdownMenu
- Progress
- Calendar
- Toast

### Componentes customizados:
- `<MetricCard>` - Card de metrica com titulo, valor, subtexto
- `<CampaignCard>` - Card de campanha com metricas
- `<LeadTable>` - Tabela de leads com selecao
- `<AgentCard>` - Card de agente IA
- `<KanbanColumn>` - Coluna do kanban
- `<KanbanCard>` - Card de lead no kanban
- `<ConversationList>` - Lista de conversas
- `<MessageBubble>` - Bolha de mensagem
- `<WizardStepper>` - Indicador de steps
- `<DateRangeFilter>` - Filtro de periodo

---

## CORES E ESTILO

**Paleta principal:**
- Primary: #3B82F6 (azul)
- Success: #22C55E (verde)
- Warning: #F59E0B (amarelo)
- Error: #EF4444 (vermelho)
- Background: #FFFFFF (light) / #0F172A (dark)
- Muted: #64748B

**Badges de status:**
- Ativa: verde
- Pausada: amarelo
- Concluida: cinza
- Em Campanha: azul
- Disponivel: verde

**Dark mode:** Suportar toggle

---

## ESTRUTURA DE PASTAS

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx (sidebar + header)
│   ├── dashboard/page.tsx
│   ├── campanhas/
│   │   ├── page.tsx
│   │   └── nova/page.tsx
│   ├── leads/
│   │   ├── page.tsx
│   │   └── busca-instagram/page.tsx
│   ├── agentes/page.tsx
│   ├── kanban/page.tsx
│   ├── inbox/page.tsx
│   ├── conteudo/page.tsx
│   ├── relatorios/page.tsx
│   └── configuracoes/page.tsx
components/
├── ui/ (shadcn)
├── dashboard/
├── campaigns/
├── leads/
├── agents/
├── kanban/
├── inbox/
└── shared/
lib/
├── utils.ts
└── types.ts
```

---

## TIPOS TYPESCRIPT PRINCIPAIS

```typescript
// Lead
interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  instagramUsername?: string;
  icpScore: number;
  status: 'disponivel' | 'em_campanha' | 'conectado' | 'respondeu' | 'agendado' | 'convertido';
}

// Campaign
interface Campaign {
  id: string;
  name: string;
  type: 'conexao' | 'aquecimento' | 'autoridade' | 'relacionamento' | 'instagram';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  leadsCount: number;
  sentCount: number;
  acceptedCount: number;
  conversionRate: number;
}

// Agent
interface AIAgent {
  id: string;
  name: string;
  type: 'connection' | 'inbox' | 'comment' | 'content';
  prompt: string;
  model: string;
  language: string;
}

// KanbanCard
interface KanbanCard {
  id: string;
  leadId: string;
  name: string;
  title: string;
  company: string;
  stage: 'novo' | 'relacionamento' | 'agendado' | 'convertido';
  lastActivity: Date;
}

// Conversation
interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  lastMessage: string;
  lastMessageAt: Date;
  isRead: boolean;
  platform: 'linkedin' | 'instagram';
}

// Message
interface Message {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  isAiGenerated: boolean;
  sentAt: Date;
}
```

---

## DADOS MOCK PARA PROTOTIPO

Use dados ficticios realistas em portugues brasileiro:
- Nomes: Joao Silva, Maria Santos, Pedro Costa, Ana Lima
- Empresas: TechCorp, StartupXYZ, FinanceCo, HealthTech
- Cargos: CEO, CMO, Head of Sales, Diretor de Marketing

---

## INSTRUCOES FINAIS

1. Crie todas as telas listadas
2. Use shadcn/ui para componentes base
3. Implemente dark mode
4. Faca responsivo (mobile-first)
5. Use dados mock para visualizacao
6. Siga a referencia visual do Vencefy
7. Mantenha consistencia de espacamento e tipografia
8. Adicione loading states e empty states

**Prioridade de desenvolvimento:**
1. Layout (sidebar + header)
2. Dashboard
3. Leads + Tabela
4. Campanhas + Lista
5. Agentes IA
6. Kanban
7. Inbox
8. Wizard de campanha
9. Conteudo
10. Relatorios
11. Configuracoes

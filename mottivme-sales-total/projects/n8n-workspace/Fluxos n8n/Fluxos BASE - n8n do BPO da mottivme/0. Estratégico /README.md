# MOTTIVME AI ECOSYSTEM

Sistema completo de automacao e IA para operacao interna da Mottivme Sales.

---

## ARQUITETURA DO ECOSSISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                        CEO (MARCOS)                             │
│                             │                                   │
│                        WhatsApp                                 │
│                             │                                   │
│                      ┌──────▼──────┐                            │
│                      │   COPILOT   │                            │
│                      │  (Assistente)│                            │
│                      └──────┬──────┘                            │
│                             │                                   │
│              ┌──────────────┼──────────────┐                    │
│              │              │              │                    │
│       ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐               │
│       │ ORCHESTRATOR│ │  CONTEXT  │ │   IDEAS   │               │
│       │(Distribuidor)│ │ ENGINEER  │ │  BACKLOG  │               │
│       └──────┬──────┘ └─────┬─────┘ └───────────┘               │
│              │              │                                   │
│              │              │                                   │
│     ┌────────┼────────┐     │                                   │
│     │        │        │     │                                   │
│  ┌──▼──┐ ┌──▼──┐ ┌──▼──┐  ┌▼────────┐                          │
│  │Artur│ │Maria│ │Isabe│  │ PROMPTS │                          │
│  │Traf.│ │Soc. │ │SDR  │  │VERSIONS │                          │
│  └─────┘ └─────┘ └─────┘  └─────────┘                          │
│                                                                 │
│                    ┌─────────────┐                              │
│                    │ GAMIFICACAO │                              │
│                    │  (Pontos)   │                              │
│                    └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPONENTES

### 1. COPILOT (CEO Assistant)
- **Prompt:** `prompts/copilot-ceo.md`
- **Workflow n8n:** `n8n-workflows/copilot-whatsapp.json`
- **Funcao:** Assistente pessoal do CEO via WhatsApp

**Comandos:**
| Comando | Descricao |
|---------|-----------|
| `/copilot` | Conversa livre |
| `/spec [titulo]` | Criar especificacao tecnica |
| `/ideia [descricao]` | Registrar ideia |
| `/priorizar` | Priorizar ideias pendentes |
| `/status` | Ver status geral |
| `/bug [descricao]` | Reportar bug |
| `/delegar [pessoa] [tarefa]` | Criar tarefa para membro |
| `/brainstorm [topico]` | Gerar ideias |

---

### 2. ORCHESTRATOR (Task Distributor)
- **Workflow n8n:** `n8n-workflows/orchestrator-contract-tasks.json`
- **Funcao:** Quando contrato e assinado, distribui tarefas automaticamente

**Fluxo:**
1. Contrato assinado (webhook ou trigger DB)
2. Busca templates de tarefas do produto
3. Encontra membro responsavel por cargo
4. Cria tarefa no DB
5. Personaliza mensagem baseada no DISC
6. Envia via WhatsApp (GHL)
7. Cria tarefa no Monday.com
8. Registra log

**Templates por Produto:**
- Foundation Sprint: 5 tarefas
- Demand Stack: 5 tarefas
- Show-Rate Machine: 3 tarefas
- Creative Engine: 3 tarefas
- Revenue Partner: 6 tarefas

---

### 3. CONTEXT ENGINEER (Bug Analyzer)
- **Prompt:** `prompts/context-engineer.md`
- **Funcao:** Analisa bugs reportados e melhora prompts automaticamente

**Tipos de Bug:**
- `prompt_missing_rule` - Regra faltando
- `prompt_ambiguous` - Regra ambigua
- `prompt_conflict` - Regras conflitantes
- `prompt_outdated` - Info desatualizada
- `logic_error` - Erro de codigo
- `integration_error` - Falha de API
- `edge_case` - Caso nao previsto

---

### 4. GAMIFICACAO (Team Motivation)
- **Schema:** `supabase/mottivme-ecosystem-schema.sql`
- **Funcao:** Sistema de pontos, niveis e bonus para o time

**Estrutura de Pontos:**
| Acao | Pontos | Bonus R$ |
|------|--------|----------|
| Tarefa concluida | 10-40 | R$ 2/ponto |
| Antes do prazo | +5-15 | Incluido |
| Meta batida | +50 | R$ 100 |
| Streak 7 dias | +20 | R$ 40 |
| Level up | - | Badge |

**Niveis:**
1. Novato (0-99)
2. Aprendiz (100-499)
3. Profissional (500-999)
4. Senior (1000-1499)
5. Expert (1500-2499)
6. Especialista (2500-3499)
7. Master (3500-4999)
8. Elite (5000-7499)
9. Legend (7500-9999)
10. MVP (10000+)

---

## INSTALACAO

### Pre-requisitos
- n8n self-hosted
- Supabase (projeto)
- GoHighLevel (conta + API key)
- Monday.com (conta + API key)
- Anthropic API (para Copilot)

### Passo 1: Database (Supabase)

```bash
# Acessar SQL Editor do Supabase e executar:
cat supabase/mottivme-ecosystem-schema.sql
```

Isso cria:
- 13 tabelas
- Functions de gamificacao
- Triggers automaticos
- Views uteis
- Dados iniciais (time + templates)

### Passo 2: Variaveis de Ambiente (n8n)

Configurar no n8n:
```env
GHL_API_KEY=seu_token_ghl
GHL_LOCATION_ID=sua_location
MONDAY_API_KEY=seu_token_monday
MONDAY_BOARD_ID=id_do_board
ANTHROPIC_API_KEY=sua_api_key
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_service_key
```

### Passo 3: Credenciais (n8n)

1. **Supabase Postgres:**
   - Host: db.xxx.supabase.co
   - Database: postgres
   - User: postgres
   - Password: [sua senha]
   - SSL: true

2. **Anthropic API:**
   - API Key: [sua key]

### Passo 4: Importar Workflows

No n8n:
1. Ir em Workflows > Import
2. Importar `copilot-whatsapp.json`
3. Importar `orchestrator-contract-tasks.json`
4. Ajustar credentials em cada node

### Passo 5: Configurar Webhook GHL

No GoHighLevel:
1. Ir em Settings > Webhooks
2. Criar webhook para "Inbound Message"
3. URL: `https://seu-n8n.com/webhook/copilot/message`

### Passo 6: Testar

1. Enviar mensagem WhatsApp: `/status`
2. Deve retornar status do sistema
3. Criar contrato de teste
4. Verificar se tarefas foram distribuidas

---

## ESTRUTURA DE ARQUIVOS

```
07-AI-Ecosystem/
├── README.md                           # Este arquivo
├── prompts/
│   ├── copilot-ceo.md                  # Prompt do Copilot
│   └── context-engineer.md             # Prompt do Context Engineer
├── supabase/
│   └── mottivme-ecosystem-schema.sql   # Schema completo
└── n8n-workflows/
    ├── copilot-whatsapp.json           # Workflow Copilot
    └── orchestrator-contract-tasks.json # Workflow Orchestrator
```

---

## TABELAS DO DATABASE

| Tabela | Descricao |
|--------|-----------|
| `team_members` | Membros do time + perfil DISC |
| `team_gamification` | Pontos e nivel de cada membro |
| `team_gamification_history` | Historico de pontos |
| `team_tasks` | Tarefas atribuidas |
| `service_contracts` | Contratos de clientes |
| `contract_tasks_template` | Templates por produto |
| `copilot_memory` | Memoria do Copilot |
| `ideas_backlog` | Banco de ideias |
| `specs` | Especificacoes tecnicas |
| `bug_reports` | Bugs reportados |
| `prompt_versions` | Versoes dos prompts |
| `orchestrator_logs` | Logs do Orchestrator |
| `client_metrics` | Metricas dos clientes |

---

## VIEWS DISPONIVEIS

```sql
-- Ranking do time
SELECT * FROM v_team_ranking;

-- Tarefas pendentes
SELECT * FROM v_tarefas_pendentes;

-- Bugs abertos
SELECT * FROM v_bugs_abertos;

-- Ideias por quadrante
SELECT * FROM v_ideias_matriz;
```

---

## API ENDPOINTS (n8n Webhooks)

| Endpoint | Metodo | Descricao |
|----------|--------|-----------|
| `/copilot/message` | POST | Recebe mensagem WhatsApp |
| `/orchestrator/contract-signed` | POST | Trigger de contrato |

---

## PERSONALIZACAO

### Ajustar Perfis DISC

Editar em `team_members`:
```sql
UPDATE team_members SET
  disc_primario = 'dominante',
  disc_secundario = 'influente',
  tom_preferido = 'direto'
WHERE nome = 'Nome do Membro';
```

### Adicionar Templates de Tarefas

```sql
INSERT INTO contract_tasks_template (
  produto, titulo, descricao, cargo_responsavel,
  dias_apos_inicio, prazo_dias, prioridade, pontos, ordem
) VALUES (
  'demand_stack',
  'Nova tarefa {{cliente_nome}}',
  'Descricao da tarefa',
  'SDR',
  0, 3, 'alta', 20, 10
);
```

### Customizar Mensagens DISC

Editar no node "Personalizar Mensagem DISC" do workflow Orchestrator.

---

## TROUBLESHOOTING

### Copilot nao responde
1. Verificar webhook GHL esta ativo
2. Verificar credenciais Anthropic
3. Verificar logs do n8n

### Tarefas nao sao criadas
1. Verificar trigger do contrato
2. Verificar se existe membro para o cargo
3. Verificar logs em `orchestrator_logs`

### Gamificacao nao atualiza
1. Verificar function `add_team_points`
2. Verificar se tarefa foi marcada como concluida corretamente

---

## PROXIMOS PASSOS (Roadmap)

- [ ] Dashboard web para CEO
- [ ] Integracao com Slack
- [ ] Reports automaticos semanais
- [ ] IA de previsao de churn
- [ ] Analise automatica de calls

---

## CONTATO

Duvidas ou problemas: Marcos Daniels (CEO)

---

**Versao:** 1.0
**Data:** 05 Dezembro 2025
**Autor:** Claude + Marcos

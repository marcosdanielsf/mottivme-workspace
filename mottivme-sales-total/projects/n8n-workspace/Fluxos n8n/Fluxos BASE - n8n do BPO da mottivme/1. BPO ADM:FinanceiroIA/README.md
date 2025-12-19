# BPO Financeiro IA - Mottivme Sales

Sistema de gestao financeira automatizada com IA, workflows n8n e dashboard Next.js.

---

## Infraestrutura

### Supabase (Banco de Dados)
- **Projeto**: `bfumywvwubvernvhjehk`
- **URL**: `https://bfumywvwubvernvhjehk.supabase.co`
- **Tabelas principais** (prefixo `fin_`):
  - `fin_movimentacoes` - Receitas e despesas
  - `fin_categorias` - Categorias financeiras
  - `fin_clientes_fornecedores` - Clientes e fornecedores
  - `fin_contas_bancarias` - Contas bancarias
  - `fin_centros_custo` - Centros de custo
  - `fin_inadimplencias` - Controle de inadimplencia
  - `fin_recorrencias` - Lancamentos recorrentes
  - `fin_contratos_pendentes` - Contratos em andamento
  - `fin_cobrancas_automaticas` - Sistema de cobranca
  - `fin_templates_contrato` - Templates de contrato

### Views de Compatibilidade (Dashboard)
- `movimentacoes_financeiras` - View principal
- `contas_bancarias` - View de contas
- `centros_custo` - View de centros
- `vw_dashboard_fluxo_caixa_mensal` - Fluxo de caixa
- `vw_dre_mensal` - DRE mensal
- `vw_orcamento_realizado` - Orcamento vs realizado

### n8n (Workflows)
- **Credencial Postgres**: `Postgres Marcos Daniels`
- **Projeto**: BPO Financeiro (pasta no n8n)

### Dashboard Next.js
- **Vercel**: `dashboard-nextjs-jo65gdjsr-marcosdanielsfs-projects.vercel.app`
- **Repositorio local**: `/dashboard/nextjs/`
- **Variaveis de ambiente**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Workflows n8n

### Workflows Principais
| Arquivo | Descricao | Status |
|---------|-----------|--------|
| `1-agente-financeiro-principal.json` | Agente IA para processamento de entradas | OK |
| `2-sistema-cobranca-automatica.json` | Sistema de lembretes e cobrancas | OK |
| `3-processador-comprovantes.json` | OCR de comprovantes com GPT-4 Vision | OK |
| `4-sincronizar-ghl-contratos.json` | Sincronizacao com GoHighLevel | OK |
| `5-alertas-contas-pagar.json` | Alertas de vencimentos | OK |
| `6-relatorio-semanal.json` | Relatorio semanal automatico | OK |
| `7-gerar-recorrencias-mensais.json` | Geracao de lancamentos recorrentes | OK |
| `8-consolidar-custos-ia.json` | Consolidacao de custos de LLM | OK |

### Tools (Sub-workflows)
| Arquivo | Descricao |
|---------|-----------|
| `tool-cadastrar-cliente.json` | Cadastro de cliente/fornecedor |
| `tool-cadastrar-movimentacao.json` | Cadastro de movimentacao |
| `tool-consultar-inadimplentes.json` | Consulta inadimplentes |
| `tool-consultar-saldo.json` | Consulta saldo das contas |
| `tool-criar-parcelamento.json` | Criacao de parcelamento |
| `tool-orcamento-realizado.json` | Orcamento vs realizado |
| `tool-registrar-custo-llm.json` | Registro de custos de LLM |

---

## Estrutura de Pastas

```
BPO FinanceiroIA/
├── README.md                          <- Este arquivo
├── INSTRUCOES.md                      <- Guia de instalacao
├── PROGRESSO-CONTRATOS.md             <- Progresso do sistema de contratos
├── GUIA-IMPLEMENTACAO-COBRANCA.md     <- Guia do sistema de cobranca
│
├── workflows/
│   ├── agente-financeiro/             <- Workflows principais
│   │   ├── 1-agente-financeiro-principal.json
│   │   ├── 2-sistema-cobranca-automatica.json
│   │   ├── 3-processador-comprovantes.json
│   │   ├── 4-sincronizar-ghl-contratos.json
│   │   ├── 5-alertas-contas-pagar.json
│   │   ├── 6-relatorio-semanal.json
│   │   ├── 7-gerar-recorrencias-mensais.json
│   │   └── 8-consolidar-custos-ia.json
│   │
│   ├── tools/                         <- Sub-workflows (tools)
│   │   ├── tool-cadastrar-cliente.json
│   │   ├── tool-cadastrar-movimentacao.json
│   │   ├── tool-consultar-inadimplentes.json
│   │   ├── tool-consultar-saldo.json
│   │   ├── tool-criar-parcelamento.json
│   │   ├── tool-orcamento-realizado.json
│   │   └── tool-registrar-custo-llm.json
│   │
│   └── examples/                      <- Exemplos
│       └── exemplo-agente-tracking-via-webhook.json
│
├── sql/                               <- Scripts SQL
│   └── (diversos scripts)
│
├── docs/                              <- Documentacao adicional
│   └── langchain-cost-tracking.md
│
└── templates/                         <- Templates de contrato
```

---

## Configuracao de Credenciais

### Postgres (Supabase)
```
Nome: Postgres Marcos Daniels
Host: db.bfumywvwubvernvhjehk.supabase.co
Database: postgres
User: postgres
Password: [senha do supabase]
Port: 5432
SSL: Require
```

### OpenAI
```
Nome: OpenAi - Marcos
API Key: [sua api key]
```

---

## Dashboard Next.js

### URLs
- **Producao**: https://dashboard-nextjs-jo65gdjsr-marcosdanielsfs-projects.vercel.app
- **Local**: http://localhost:3000

### Paginas
- `/` - Home
- `/overview` - Visao geral financeira
- `/faturamento` - Receitas e faturamento
- `/despesas` - Controle de despesas
- `/inadimplencia` - Gestao de inadimplentes
- `/dre` - DRE mensal
- `/orcamento` - Orcamento vs realizado
- `/centros-custo` - Analise por centro de custo
- `/simulador` - Simulador de fluxo de caixa
- `/conciliacao` - Conciliacao bancaria

### Variaveis de Ambiente (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://bfumywvwubvernvhjehk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Scripts SQL Importantes

### Criacao das Tabelas
```
/SUPABASE_BACKUP_2025-12-11/create_financeiro_tables.sql
```

### Views do Dashboard
```
/SUPABASE_BACKUP_2025-12-11/create_dashboard_views.sql
```

### Tabela de Custos LLM
```
/SUPABASE_BACKUP_2025-12-11/create_llm_costs.sql
```

---

## Historico de Migracoes

### 2025-12-11: Consolidacao Supabase
- Migrado de `xbqxivqzetaoptuyykmx` para `bfumywvwubvernvhjehk`
- Criadas tabelas com prefixo `fin_`
- Criadas views de compatibilidade para o dashboard
- Atualizados workflows n8n para usar nova credencial
- Atualizado dashboard na Vercel

### Tabelas Migradas
- `movimentacoes_financeiras` -> `fin_movimentacoes`
- `categorias` -> `fin_categorias`
- `clientes_fornecedores` -> `fin_clientes_fornecedores`
- `contas_bancarias` -> `fin_contas_bancarias`
- `centros_custo` -> `fin_centros_custo`
- `inadimplencias` -> `fin_inadimplencias`
- `recorrencias` -> `fin_recorrencias`
- `contratos_pendentes` -> `fin_contratos_pendentes`
- `cobrancas_automaticas` -> `fin_cobrancas_automaticas`
- `templates_contrato` -> `fin_templates_contrato`

---

## Contato

- **Projeto**: Mottivme Sales
- **Responsavel**: Marcos Daniels

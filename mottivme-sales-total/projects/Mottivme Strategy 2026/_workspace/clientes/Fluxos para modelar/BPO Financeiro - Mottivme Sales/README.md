# Sistema BPO Financeiro Automatizado - Mottivme Sales

Sistema completo de gestão financeira automatizada usando n8n + Supabase + GoHighLevel.

## Estrutura do Projeto

```
BPO Financeiro - Mottivme Sales/
├── README.md                    # Este arquivo
│
├── docs/                        # Documentação
│   ├── GUIA-AGENTE-FINANCEIRO.md
│   ├── AGENTE-SECRETARIA-IA.md
│   ├── INTEGRACAO-COMPLETA.md
│   ├── INTEGRACAO-1PASSWORD.md
│   ├── DASHBOARD-RETOOL.md
│   └── RESUMO-RAPIDO.md
│
├── sql/                         # Scripts SQL (executar em ordem)
│   ├── 00-schema-base.sql       # Schema inicial
│   ├── 01-novas-tabelas.sql     # Tabelas adicionais (recorrencias, parcelamentos, etc)
│   ├── 02-recursos-avancados.sql # Centros de custo, orçamentos, conciliação
│   ├── 03-schema-completo.sql   # Schema consolidado
│   ├── ...                      # Scripts de migração e correções
│   └── diagnostico-dados.sql    # Queries de diagnóstico
│
├── n8n-workflows/               # Workflows n8n
│   ├── README.md                # Instruções de importação
│   ├── INSTRUCOES.md            # Guia detalhado
│   │
│   │ # AGENTES PRINCIPAIS
│   ├── 1-agente-financeiro-principal.json
│   ├── 2-sistema-cobranca-automatica.json
│   ├── 3-processador-comprovantes.json
│   ├── 4-agente-financeiro-ia.json      # Agente IA com 14 tools
│   ├── 5-alertas-contas-pagar.json
│   ├── 6-relatorio-semanal.json
│   ├── 7-gerar-recorrencias-mensais.json
│   ├── 8-agente-contratos.json
│   │
│   │ # TOOLS DO AGENTE IA
│   ├── tool-buscar-cliente.json
│   ├── tool-buscar-cliente-contato.json
│   ├── tool-criar-cliente.json
│   ├── tool-atualizar-cliente.json
│   ├── tool-buscar-movimentacoes.json
│   ├── tool-salvar-movimentacao.json
│   ├── tool-listar-categorias.json
│   ├── tool-fluxo-caixa.json
│   ├── tool-inadimplencia.json
│   ├── tool-criar-parcelamento.json
│   ├── tool-criar-recorrencia.json
│   ├── tool-dashboard-kpis.json
│   ├── tool-centros-custo.json
│   ├── tool-orcamento-realizado.json
│   ├── tool-dre.json
│   ├── tool-conciliacao.json
│   ├── tool-gerar-contrato.json
│   └── tool-listar-contratos.json
│
├── scripts/                     # Scripts de migração
│   ├── .env.example
│   ├── requirements.txt
│   ├── migrar-dados-supabase.py
│   └── migrar-dados-supabase-safe.py
│
├── dashboard/                   # Dashboard e relatórios
│   ├── dashboard-queries.sql
│   ├── dashboard-queries-completas.sql
│   ├── dashboard-retool-config.json
│   ├── queries-retool.sql
│   ├── nextjs/                  # Dashboard Next.js
│   └── power-bi/                # Templates Power BI
│
└── arquivos/                    # Arquivos do cliente
    ├── Artes graficas/
    ├── Bancarios/
    ├── Certificado/
    ├── Comprovantes/
    ├── Contratos/
    ├── Extratos/
    ├── RH/
    ├── Relatórios/
    └── Reuniões/
```

## Instalação

### 1. Banco de Dados (Supabase)

Execute os scripts SQL em ordem no Supabase SQL Editor:

```sql
-- 1. Schema base
sql/00-schema-base.sql

-- 2. Novas tabelas
sql/01-novas-tabelas.sql

-- 3. Recursos avançados
sql/02-recursos-avancados.sql
```

### 2. Workflows n8n

1. Importe os workflows na ordem:
   - Primeiro as tools (`tool-*.json`)
   - Depois os agentes (`1-agente-*.json`, etc)

2. Configure as credenciais:
   - **Supabase PostgreSQL**: Conexão com banco de dados
   - **GoHighLevel**: Para envio de mensagens WhatsApp
   - **OpenAI**: Para o agente IA

3. Ative os workflows:
   - Agentes principais (1-8)
   - Workflows agendados (5, 6, 7)

### 3. Scripts Python (opcional)

```bash
cd scripts/
cp .env.example .env
# Edite .env com suas credenciais

pip install -r requirements.txt
python migrar-dados-supabase-safe.py
```

## Funcionalidades

### Agente Financeiro IA (14 tools)
- Consultar e salvar movimentações
- Gestão de clientes/fornecedores
- Fluxo de caixa e inadimplência
- Parcelamentos e recorrências
- Dashboard KPIs
- Centro de custos
- Orçamento vs Realizado
- DRE simplificado
- Conciliação bancária

### Automações
- Alertas de contas a pagar (diário)
- Relatório semanal automático
- Geração de recorrências mensais
- Cobrança automática de inadimplentes
- Processamento de comprovantes com OCR

### Relatórios
- Dashboard de KPIs executivos
- DRE mensal simplificado
- Fluxo de caixa projetado
- Análise de inadimplência
- Orçamento vs Realizado

## Credenciais

Configurar no Supabase e n8n:

```env
SUPABASE_URL=https://xbqxivqzetaoptuyykmx.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key
GHL_API_KEY=sua-api-key
OPENAI_API_KEY=sua-api-key
```

## Suporte

- Documentação: `docs/`
- Instruções n8n: `n8n-workflows/README.md`
- Queries SQL: `dashboard/`

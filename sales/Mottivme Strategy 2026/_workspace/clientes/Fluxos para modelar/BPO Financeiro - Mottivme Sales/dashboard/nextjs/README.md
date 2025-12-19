# Dashboard Financeiro Mottivme Sales

Dashboard completo de gestão financeira construído com Next.js 14, TypeScript, Tailwind CSS, e Supabase.

## Características

- **6 Páginas Completas:**
  - Home: Página inicial com navegação
  - Overview: Visão geral com KPIs e gráficos
  - Faturamento: Análise detalhada de receitas
  - Despesas: Controle de despesas PF e PJ
  - Simulador: Simulação de fluxo de caixa
  - Inadimplência: Gestão de cobranças

- **Tecnologias:**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - Recharts
  - Supabase

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm start
```

## Configuração do Supabase

1. Acesse o Supabase e execute o schema SQL: `../schema-supabase-financeiro.sql`
2. Execute as views do dashboard: `../schema-views-dashboard.sql`
3. (Opcional) Migre os dados do Excel: `python ../migrar-dados-supabase.py`
4. Copie as credenciais para `.env.local`

## Deploy no Vercel

Veja o guia completo em `DEPLOY.md`

## Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js 14
│   ├── page.tsx           # Home
│   ├── overview/          # Overview
│   ├── faturamento/       # Faturamento
│   ├── despesas/          # Despesas
│   ├── simulador/         # Simulador
│   └── inadimplencia/     # Inadimplência
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes Shadcn/ui
│   ├── charts/           # Gráficos Recharts
│   └── tables/           # Tabelas de dados
└── lib/                   # Utilitários
    ├── supabase.ts       # Cliente Supabase
    └── utils.ts          # Funções auxiliares
```

## Licença

Privado - Mottivme Sales

# Início Rápido - Dashboard Mottivme Sales

Guia rápido para rodar o dashboard em 5 minutos!

## 1. Configurar Supabase

Execute estes scripts SQL no seu Supabase (SQL Editor):

```bash
# 1. Schema principal
# Cole o conteúdo de: ../schema-supabase-financeiro.sql

# 2. Views do dashboard
# Cole o conteúdo de: ../schema-views-dashboard.sql
```

## 2. Configurar Variáveis de Ambiente

```bash
cd dashboard-nextjs

# Copiar exemplo
cp .env.local.example .env.local

# Editar .env.local
# Adicione suas credenciais do Supabase:
# - NEXT_PUBLIC_SUPABASE_URL (já preenchido)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (você precisa pegar no Supabase)
```

### Onde encontrar suas credenciais:

1. Acesse [supabase.com](https://supabase.com)
2. Abra seu projeto
3. Vá em "Settings" > "API"
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Instalar e Rodar

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador!

## 4. (Opcional) Migrar Dados do Excel

Se você tem os arquivos Excel:

```bash
cd ..
python migrar-dados-supabase.py
```

## 5. Deploy no Vercel

Quando estiver pronto para colocar online:

```bash
# Opção fácil: instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Ou siga o guia completo em [DEPLOY.md](DEPLOY.md)

## Estrutura das Páginas

- **/** - Home com cards de navegação
- **/overview** - Dashboard principal com KPIs e gráficos
- **/faturamento** - Análise de receitas
- **/despesas** - Controle de despesas PF/PJ
- **/simulador** - Simulação de fluxo de caixa
- **/inadimplencia** - Gestão de inadimplentes

## Próximos Passos

1. ✅ Personalize as cores em `tailwind.config.ts`
2. ✅ Adicione mais gráficos conforme necessário
3. ✅ Configure autenticação (opcional)
4. ✅ Conecte com n8n para automações (opcional)

## Problemas Comuns

**Erro de conexão com Supabase:**
- Verifique se copiou as credenciais corretas
- Certifique-se de usar a chave `anon`, não `service_role`

**Página em branco:**
- Verifique se executou os scripts SQL no Supabase
- Abra o console do navegador (F12) para ver erros

**npm install falha:**
- Use Node.js v18 ou superior
- Tente `npm cache clean --force` e instale novamente

## Suporte

Precisa de ajuda? Veja:
- [README.md](README.md) - Documentação completa
- [DEPLOY.md](DEPLOY.md) - Guia de deploy detalhado

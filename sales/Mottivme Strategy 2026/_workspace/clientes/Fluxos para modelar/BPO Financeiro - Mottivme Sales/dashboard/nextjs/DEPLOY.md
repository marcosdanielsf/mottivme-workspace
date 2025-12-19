# Guia de Deploy no Vercel

Este guia detalha como fazer o deploy do Dashboard Financeiro Mottivme Sales no Vercel.

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Conta no [GitHub](https://github.com) (recomendado)
3. Supabase configurado com schema e views

## Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Criar Repositório no GitHub

```bash
cd dashboard-nextjs

# Inicializar git (se ainda não foi feito)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit: Dashboard Financeiro Mottivme Sales"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/seu-usuario/mottivme-dashboard.git

# Push para GitHub
git push -u origin main
```

### Passo 2: Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (ou o caminho correto)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)

### Passo 3: Configurar Variáveis de Ambiente

No painel do Vercel, vá em "Settings" > "Environment Variables" e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=https://xbqxivqzetaoptuyykmax.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key_aqui
```

**IMPORTANTE:** Use a chave `anon` (pública), não a `service_role` (secreta).

### Passo 4: Deploy

1. Clique em "Deploy"
2. Aguarde o build terminar (2-3 minutos)
3. Acesse seu dashboard no domínio fornecido pelo Vercel (ex: `mottivme-dashboard.vercel.app`)

## Opção 2: Deploy via CLI do Vercel

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Login no Vercel

```bash
vercel login
```

### Passo 3: Deploy

```bash
cd dashboard-nextjs

# Deploy de produção
vercel --prod

# Ou apenas para preview
vercel
```

### Passo 4: Configurar Variáveis de Ambiente

```bash
# Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Cole o valor: https://xbqxivqzetaoptuyykmax.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Cole seu anon key
```

## Opção 3: Deploy Manual (Drag & Drop)

### Passo 1: Build Local

```bash
cd dashboard-nextjs
npm install
npm run build
```

### Passo 2: Upload no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste a pasta `dashboard-nextjs` para a área de drop
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

## Configurações Pós-Deploy

### Domínio Customizado

1. No painel do Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio (ex: `dashboard.mottivme.com.br`)
3. Configure os DNS conforme instruções do Vercel

### Performance

O dashboard já está otimizado para Vercel:
- ✅ Server-Side Rendering (SSR)
- ✅ Automatic Code Splitting
- ✅ Image Optimization
- ✅ Edge Caching

### Monitoramento

1. Acesse "Analytics" no painel do Vercel
2. Visualize métricas de performance e uso
3. Configure alertas se necessário

## Atualizações

### Deploy Automático (GitHub)

Toda vez que você fizer push para o branch `main`, o Vercel automaticamente:
1. Detecta mudanças
2. Faz build do projeto
3. Deploy em produção

### Deploy Manual

```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição das mudanças"
git push

# Ou via Vercel CLI
vercel --prod
```

## Troubleshooting

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Environment variables not defined"
- Verifique se as variáveis estão configuradas no Vercel
- Certifique-se de usar `NEXT_PUBLIC_` prefix para variáveis client-side

### Erro: "Supabase connection failed"
- Verifique se as credenciais estão corretas
- Teste a conexão localmente primeiro
- Confirme que o Supabase permite conexões do domínio Vercel

### Build muito lento
- O primeiro build demora mais (cold start)
- Builds subsequentes são mais rápidos (cache)

## Segurança

1. **NUNCA** commite `.env.local` no GitHub
2. Use apenas `anon key` nas variáveis de ambiente públicas
3. Configure RLS (Row Level Security) no Supabase
4. Ative autenticação se necessário

## Suporte

Em caso de problemas:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Supabase](https://supabase.com/docs)

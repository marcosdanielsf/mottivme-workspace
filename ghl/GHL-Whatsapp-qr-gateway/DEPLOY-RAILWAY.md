# 🚂 Deploy no Railway - GHL WhatsApp Gateway

## ⚠️ PROBLEMA IDENTIFICADO

O projeto **não conseguia fazer deploy no Railway** pelos seguintes motivos:

1. **Faltava `railway.json`** - Arquivo de configuração específico do Railway
2. **Scripts inadequados** - Não havia build automático no Railway
3. **Conflito com Vercel** - O `vercel.json` estava interferindo
4. **Redis não configurado** - Railway precisa de Redis como serviço separado

## ✅ SOLUÇÕES IMPLEMENTADAS

### 1. Criado `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:railway",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Scripts atualizados no `package.json`
- `start:railway`: Build + Start automático
- `postinstall`: Build automático após instalação

### 3. Removido `vercel.json` conflitante

---

## 🚀 PASSOS PARA DEPLOY NO RAILWAY

### 1. Acesse Railway
```bash
# No navegador: https://railway.app
```

### 2. Conecte o Repositório
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha: `marcosdanielsf/GHL-Whatsapp-qr-gateway`

### 3. Adicione Redis PRIMEIRO
```
⚠️ IMPORTANTE: Redis deve ser criado ANTES do app principal

1. No painel Railway → "New"
2. Database → "Add Redis"
3. Railway cria automaticamente: REDIS_URL
```

### 4. Configure Variáveis de Ambiente

No serviço principal (não no Redis), vá em "Variables" e adicione:

```bash
# Redis (copiado do Redis que você criou)
REDIS_URL=redis://default:xxxxx@containers-us-west-xxx.railway.app:xxxx

# GHL Configuration
GHL_CLIENT_ID=674b8def93a5ee7af05f1bda-upd5eqzf
GHL_CLIENT_SECRET=3f37419d-ee34-403c-a1c8-e35febe6c625
GHL_REDIRECT_URI=https://[seu-app].railway.app/api/auth/callback
GHL_INBOUND_URL=https://[seu-app].railway.app/api/webhook/inbound

# Supabase (se usar)
SUPABASE_URL=https://bfumywvwubvernvhjehk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdW15d3Z3dWJ2ZXJudmhqZWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MDM3OTksImV4cCI6MjA2Njk3OTc5OX0.60VyeZ8XaD6kz7Eh5Ov_nEeDtu5woMwMJYgUM-Sruao

# App Configuration
PORT=8080
SESSION_DIR=/tmp/baileys_sessions
LOG_LEVEL=info
NODE_ENV=production

# Rate Limiting
TEXT_DELAY_MS=3500
MEDIA_DELAY_MS_MIN=6000
MEDIA_DELAY_MS_MAX=9000
```

### 5. Deploy Automático
```
✅ Railway detecta mudanças no GitHub automaticamente
✅ Build com NIXPACKS
✅ Start com script otimizado
✅ Healthcheck configurado
```

---

## 🔧 CONFIGURAÇÃO DO REDIS NO RAILWAY

### Método 1: Redis Integrado (Recomendado)
1. No Railway Dashboard → "New" → "Database" → "Add Redis"
2. Copie a `REDIS_URL` gerada automaticamente
3. Cole nas variáveis do app principal

### Método 2: Redis Externo (se preferir)
```bash
# Usar Redis Cloud, Upstash, etc.
REDIS_URL=redis://username:password@host:port
```

---

## 📊 MONITORAMENTO

### Logs em Tempo Real
```bash
# No Railway Dashboard → Services → [seu-app] → Logs
```

### Health Check
- **Path**: `/`
- **Timeout**: 300s
- **Auto-restart**: ON_FAILURE (máx. 10 tentativas)

### Métricas
- CPU/Memory usage
- Request count
- Error rates

---

## 🚨 POSSÍVEIS ERROS E SOLUÇÕES

### ❌ "Build failed"
**Solução**: Verificar se `npm run build` funciona localmente
```bash
npm install
npm run build
```

### ❌ "Redis connection failed"
**Solução**: Verificar se Redis foi criado ANTES do app
```bash
# Verificar REDIS_URL
echo $REDIS_URL
```

### ❌ "Port already in use"
**Solução**: Railway usa PORT automaticamente
```bash
# Não definir PORT manualmente, deixar Railway gerenciar
```

### ❌ "Health check timeout"
**Solução**: Aumentar timeout ou verificar se app responde em `/`
```bash
curl https://[seu-app].railway.app/
```

---

## 🔄 ATUALIZAÇÕES AUTOMÁTICAS

### GitHub Integration
```
✅ Push para main → Deploy automático
✅ Pull Request → Preview deploy
✅ Commits → Histórico completo
```

### Rollback
```bash
# No Railway Dashboard → Deployments → Select version → Rollback
```

---

## 💡 DICAS PARA SUCESSO

1. **Ordem correta**: Redis primeiro, depois app
2. **Variáveis**: Sempre usar Railway variables (não .env)
3. **Logs**: Monitorar logs durante primeiro deploy
4. **Health check**: Garantir que `/` responda rapidamente
5. **Redis URL**: Copiar exatamente como Railway gera

---

## 📞 SUPORTE

- **Railway Docs**: https://docs.railway.app/
- **Logs**: Railway Dashboard → Services → [app] → Logs
- **Variables**: Railway Dashboard → Services → [app] → Variables

**Agora o deploy deve funcionar perfeitamente!** 🎉
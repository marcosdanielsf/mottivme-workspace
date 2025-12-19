# 🔒 Configurar Acesso Público ao Dashboard

## ⚠️ Status Atual

O dashboard foi deployado com sucesso, mas está protegido por **Vercel SSO (Single Sign-On)**.

Atualmente, apenas usuários autenticados da sua conta Vercel podem acessar:
- **URL:** https://dashboard-nextjs-m7dhzh8j6-marcosdanielsfs-projects.vercel.app
- **Status:** 401 Unauthorized (Requer Login)

## 🔓 Como Tornar o Dashboard Público

### Opção 1: Desabilitar Vercel SSO (Recomendado para Produção)

1. **Acesse as Configurações do Projeto:**
   https://vercel.com/marcosdanielsfs-projects/dashboard-nextjs/settings/deployment-protection

2. **Desabilite "Vercel Authentication"**
   - Procure por "Deployment Protection" ou "Vercel Authentication"
   - Desmarque ou desabilite a opção
   - Salve as alterações

3. **Faça Redeploy:**
   ```bash
   cd "/Users/marcosdaniels/n8n-mcp/Fluxos para modelar/BPO Financeiro - Mottivme Sales/dashboard-nextjs"
   vercel --prod
   ```

### Opção 2: Adicionar Proteção Personalizada

Se você quer manter alguma proteção, mas não o SSO do Vercel:

#### A. Usando Middleware do Next.js

Crie o arquivo `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar Basic Auth
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    // Usuário e senha de exemplo - ALTERE ISSO!
    if (user === 'admin' && pwd === 'senha123') {
      return NextResponse.next()
    }
  }

  url.pathname = '/api/auth'

  return NextResponse.rewrite(url)
}
```

#### B. Usando Variáveis de Ambiente para Senha

1. Adicione variável no Vercel:
   ```bash
   echo "sua-senha-secreta" | vercel env add DASHBOARD_PASSWORD production
   ```

2. Implemente verificação no middleware

### Opção 3: Manter SSO do Vercel (Para Uso Interno)

Se este dashboard é apenas para uso interno da sua equipe:

1. **Adicionar Membros da Equipe:**
   https://vercel.com/marcosdanielsfs-projects/dashboard-nextjs/settings/team

2. **Compartilhar Acesso:**
   - Convide membros por email
   - Eles terão acesso após login no Vercel

## 🔍 Verificar Status Atual

Execute este comando para verificar se o site está acessível:

```bash
curl -I https://dashboard-nextjs-m7dhzh8j6-marcosdanielsfs-projects.vercel.app
```

### Resposta Esperada Após Desabilitar SSO:
```
HTTP/2 200 OK
content-type: text/html
```

### Resposta Atual (Com SSO Ativo):
```
HTTP/2 401 Unauthorized
set-cookie: _vercel_sso_nonce=...
```

## 📱 Alternativa: Acessar via Vercel Dashboard

Enquanto isso, você pode visualizar o dashboard através do painel do Vercel:

1. Acesse: https://vercel.com/marcosdanielsfs-projects/dashboard-nextjs
2. Clique em "Visit" no último deployment
3. Você será redirecionado e autenticado automaticamente

## 🚀 Depois de Configurar

Após desabilitar o SSO ou configurar autenticação personalizada:

1. **Teste o Acesso:**
   Abra em um navegador anônimo/privado

2. **Compartilhe o Link:**
   O dashboard estará acessível publicamente (ou com a proteção que você configurou)

3. **Configure um Domínio Customizado (Opcional):**
   https://vercel.com/marcosdanielsfs-projects/dashboard-nextjs/settings/domains

## 📞 Precisa de Ajuda?

- **Documentação Vercel SSO:** https://vercel.com/docs/security/deployment-protection
- **Suporte Vercel:** https://vercel.com/support

---

**Nota:** A proteção SSO é uma funcionalidade de segurança útil para projetos em desenvolvimento ou internos. Para produção pública, você pode desabilitá-la ou implementar sua própria autenticação.

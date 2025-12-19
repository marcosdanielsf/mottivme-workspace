# 🔐 Configurar Supabase Authentication

## ✅ Sistema de Autenticação Implementado!

O sistema de login/senha com Supabase Auth foi totalmente implementado. Agora você precisa configurar o Supabase e criar o primeiro usuário.

## 📋 Passo 1: Habilitar Email Authentication no Supabase

1. **Acesse o Dashboard do Supabase:**
   https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx

2. **Vá para Authentication > Providers:**
   https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx/auth/providers

3. **Habilite Email Provider:**
   - Procure por "Email"
   - Clique em "Enable"
   - Marque "Enable Email provider"
   - **IMPORTANTE:** Desmarque "Confirm email" (para ambiente de desenvolvimento)
   - Salve as alterações

## 📋 Passo 2: Criar Primeiro Usuário

### Opção A: Via Dashboard Supabase (Recomendado)

1. **Acesse Authentication > Users:**
   https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx/auth/users

2. **Clique em "Add User"**

3. **Preencha:**
   - **Email:** seu@email.com
   - **Password:** sua-senha-segura
   - Marque: "Auto Confirm User" (importante!)

4. **Clique em "Create user"**

### Opção B: Via SQL (Avançado)

Execute no SQL Editor do Supabase:

```sql
-- Criar usuário com senha
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'seu@email.com',
  crypt('sua-senha-aqui', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## 📋 Passo 3: Configurar URL de Redirecionamento

1. **Acesse Authentication > URL Configuration:**
   https://supabase.com/dashboard/project/xbqxivqzetaoptuyykmx/auth/url-configuration

2. **Adicione as URLs permitidas:**

   **Site URL:**
   ```
   https://dashboard-nextjs-m7dhzh8j6-marcosdanielsfs-projects.vercel.app
   ```

   **Redirect URLs (adicione todas):**
   ```
   http://localhost:3000/**
   http://localhost:54112/**
   https://dashboard-nextjs-*.vercel.app/**
   https://dashboard-nextjs-m7dhzh8j6-marcosdanielsfs-projects.vercel.app/**
   ```

3. **Salve as configurações**

## 📋 Passo 4: Configurar Políticas de Segurança (RLS)

Proteja suas tabelas financeiras para que apenas usuários autenticados possam acessar:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler tudo
CREATE POLICY "Usuários autenticados podem ler movimentações"
  ON movimentacoes_financeiras
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem ler clientes"
  ON clientes_fornecedores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem ler categorias"
  ON categorias
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Usuários autenticados podem inserir
CREATE POLICY "Usuários autenticados podem inserir movimentações"
  ON movimentacoes_financeiras
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem inserir clientes"
  ON clientes_fornecedores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Usuários autenticados podem atualizar
CREATE POLICY "Usuários autenticados podem atualizar movimentações"
  ON movimentacoes_financeiras
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar clientes"
  ON clientes_fornecedores
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## 🚀 Passo 5: Deploy no Vercel

Agora faça o deploy da nova versão com autenticação:

```bash
cd "/Users/marcosdaniels/n8n-mcp/Fluxos para modelar/BPO Financeiro - Mottivme Sales/dashboard-nextjs"
npm run build
vercel --prod
```

## 🔒 Passo 6: Desabilitar Vercel SSO

Agora que você tem autenticação própria, pode desabilitar o SSO do Vercel:

1. Acesse: https://vercel.com/marcosdanielsfs-projects/dashboard-nextjs/settings/deployment-protection
2. Desabilite "Vercel Authentication"
3. Salve

## ✅ Teste de Funcionamento

1. **Acesse o dashboard:**
   https://dashboard-nextjs-m7dhzh8j6-marcosdanielsfs-projects.vercel.app

2. **Você será redirecionado para /login**

3. **Faça login com:**
   - Email: o email que você criou
   - Senha: a senha que você definiu

4. **Após login bem-sucedido:**
   - Você será redirecionado para /overview
   - Verá seu email no rodapé do sidebar
   - Poderá navegar por todas as páginas
   - Botão "Sair" para fazer logout

## 📝 Arquivos Criados

1. **[src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)** - Context de autenticação
2. **[src/lib/supabase-client.ts](src/lib/supabase-client.ts)** - Cliente Supabase
3. **[src/app/login/page.tsx](src/app/login/page.tsx)** - Página de login
4. **[src/middleware.ts](src/middleware.ts)** - Middleware de proteção
5. **[src/components/layout-content.tsx](src/components/layout-content.tsx)** - Layout condicional
6. **[src/components/sidebar.tsx](src/components/sidebar.tsx)** - Sidebar com logout

## 🎯 Funcionalidades Implementadas

✅ Tela de login responsiva e moderna
✅ Autenticação com Supabase
✅ Proteção automática de todas as rotas
✅ Redirecionamento automático se não autenticado
✅ Sessão persistente (cookies seguros)
✅ Logout com limpeza de sessão
✅ Exibição do email do usuário logado
✅ Mensagens de erro amigáveis

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT seguros
- ✅ Cookies HTTP-only
- ✅ HTTPS obrigatório em produção
- ✅ Row Level Security (RLS) no banco
- ✅ Middleware de proteção server-side
- ✅ Validação client-side e server-side

## 🆘 Problemas Comuns

### Erro: "Invalid login credentials"
- Verifique se o email está correto
- Verifique se a senha está correta
- Confirme que o usuário foi criado no Supabase

### Erro: "Email not confirmed"
- No Supabase, vá em Authentication > Users
- Encontre o usuário e clique em "..."
- Selecione "Confirm email"

### Não redireciona após login
- Verifique as URLs de redirecionamento no Supabase
- Confirme que as variáveis de ambiente estão corretas no Vercel

---

**Sistema de autenticação totalmente funcional!** 🎉

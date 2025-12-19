# 🚀 Próximos Passos - Assembly Line SaaS

## ✅ O que já está pronto

1. **Estrutura Completa do Projeto**
   - Next.js 14 configurado
   - TypeScript com tipagem forte
   - TailwindCSS configurado
   - Estrutura de pastas organizada

2. **Types TypeScript Completos**
   - `/types/enums.ts` - Enums do sistema
   - `/types/database.ts` - Types do Supabase
   - `/types/briefing.ts` - Estrutura do briefing
   - `/types/project.ts` - Tipos de projeto
   - `/types/phase.ts` - Configuração de fases
   - `/types/asset.ts` - Estruturas de assets
   - `/types/user.ts` - User e planos

3. **Supabase Configurado**
   - Schema SQL completo em `/supabase/schema.sql`
   - Clients configurados (browser e server)
   - Middleware de autenticação
   - RLS Policies implementadas

4. **Integrações**
   - Cliente n8n em `/lib/n8n.ts`
   - Webhook receiver em `/app/api/webhooks/n8n/route.ts` ⚡
   - Utilit ários em `/lib/utils.ts`

5. **Base do Frontend**
   - Layout raiz configurado
   - Providers (React Query)
   - Página inicial básica
   - CSS global com variáveis de tema

## 🎯 Próximos Passos (Em Ordem de Prioridade)

### FASE 1: Setup do Supabase (30 min)

1. **Criar conta no Supabase**
   - Acesse https://supabase.com
   - Crie um novo projeto
   - Escolha região (South America - São Paulo recomendado)

2. **Executar Schema SQL**
   ```bash
   # 1. Abra SQL Editor no Supabase Dashboard
   # 2. Cole o conteúdo de supabase/schema.sql
   # 3. Execute (Run)
   ```

3. **Configurar Autenticação**
   - No Dashboard: Authentication > Providers
   - Habilite Email/Password
   - Configure Email Templates (opcional)
   - Copie as credenciais (URL + Keys)

4. **Criar `.env.local`**
   ```bash
   cp .env.local.example .env.local
   # Edite e preencha as variáveis do Supabase
   ```

### FASE 2: Instalar shadcn/ui (15 min)

```bash
# 1. Inicializar shadcn/ui
npx shadcn-ui@latest init

# Escolha:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# 2. Adicionar componentes essenciais
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add scroll-area
```

### FASE 3: Autenticação (1 hora)

1. **Criar páginas de auth**
   - `app/(auth)/sign-in/page.tsx`
   - `app/(auth)/sign-up/page.tsx`
   - `app/(auth)/layout.tsx`

2. **Criar componentes de auth**
   - `components/auth/SignInForm.tsx`
   - `components/auth/SignUpForm.tsx`

3. **Exemplo de SignInForm:**
```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={email}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

### FASE 4: API Routes (1 hora)

Criar os endpoints principais:

1. **`app/api/projects/route.ts`** - CRUD de projetos
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, briefing } = body

  // 1. Criar projeto
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description,
      status: 'draft'
    })
    .select()
    .single()

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 })
  }

  // 2. Salvar briefing
  const { error: briefingError } = await supabase
    .from('briefings')
    .insert({
      project_id: project.id,
      answers: briefing
    })

  if (briefingError) {
    return NextResponse.json({ error: briefingError.message }, { status: 500 })
  }

  return NextResponse.json({ project })
}
```

2. **`app/api/projects/[id]/execute/route.ts`** - Executar fase
```typescript
import { createClient } from '@/lib/supabase/server'
import { triggerN8nPhase } from '@/lib/n8n'
import { PHASES_CONFIG } from '@/types/phase'
import { PhaseKey, PhaseStatus } from '@/types/enums'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phaseKey } = await req.json()
  const phaseConfig = PHASES_CONFIG[phaseKey as PhaseKey]

  if (!phaseConfig) {
    return NextResponse.json({ error: 'Invalid phase' }, { status: 400 })
  }

  // Buscar projeto e briefing
  const { data: project } = await supabase
    .from('projects')
    .select('*, briefings(*)')
    .eq('id', params.id)
    .single()

  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  // Verificar créditos
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.credits < phaseConfig.creditsCost) {
    return NextResponse.json(
      { error: 'Insufficient credits' },
      { status: 402 }
    )
  }

  // Criar execution record
  const { data: execution } = await supabase
    .from('executions')
    .insert({
      project_id: params.id,
      phase_key: phaseKey,
      status: PhaseStatus.QUEUED
    })
    .select()
    .single()

  // Disparar n8n
  try {
    const n8nResponse = await triggerN8nPhase(phaseConfig, {
      projectId: params.id,
      contactId: params.id,
      briefing: project.briefings.answers
    })

    // Atualizar execution com ID do n8n
    await supabase
      .from('executions')
      .update({
        n8n_execution_id: n8nResponse.executionId,
        status: PhaseStatus.RUNNING
      })
      .eq('id', execution.id)

    // Deduzir créditos
    await supabase
      .from('profiles')
      .update({
        credits: profile.credits - phaseConfig.creditsCost,
        credits_used_this_month: (profile.credits_used_this_month || 0) + phaseConfig.creditsCost
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      executionId: n8nResponse.executionId
    })

  } catch (error) {
    await supabase
      .from('executions')
      .update({ status: PhaseStatus.ERROR })
      .eq('id', execution.id)

    return NextResponse.json(
      { error: 'Failed to trigger n8n' },
      { status: 500 }
    )
  }
}
```

### FASE 5: Dashboard Básico (2 horas)

1. **Criar layout do dashboard**
   - `app/(dashboard)/layout.tsx`
   - `components/layout/Sidebar.tsx`
   - `components/layout/Header.tsx`

2. **Página principal do dashboard**
   - `app/(dashboard)/page.tsx`
   - Mostrar lista de projetos
   - Botão "Novo Projeto"

3. **Hook personalizado**
```typescript
// hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useProjects() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      return data || []
    }
  })
}
```

### FASE 6: Wizard de Briefing (3 horas)

1. **Estrutura multi-step**
   - `components/briefing/BriefingWizard.tsx`
   - `components/briefing/steps/Step1Nicho.tsx`
   - `components/briefing/steps/Step2Avatar.tsx`
   - etc...

2. **State management com Zustand**
```typescript
// stores/briefingStore.ts
import { create } from 'zustand'
import { Briefing } from '@/types/briefing'

interface BriefingStore {
  currentStep: number
  briefing: Partial<Briefing>
  setStep: (step: number) => void
  updateBriefing: (data: Partial<Briefing>) => void
  reset: () => void
}

export const useBriefingStore = create<BriefingStore>((set) => ({
  currentStep: 1,
  briefing: {},
  setStep: (step) => set({ currentStep: step }),
  updateBriefing: (data) => set((state) => ({
    briefing: { ...state.briefing, ...data }
  })),
  reset: () => set({ currentStep: 1, briefing: {} })
}))
```

### FASE 7: Visualizadores de Assets (2 horas)

Criar componentes para cada tipo de output:
- `components/outputs/CloneViewer.tsx`
- `components/outputs/PositioningViewer.tsx`
- `components/outputs/ContentCalendarViewer.tsx`

### FASE 8: Deploy (30 min)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar env vars no Vercel Dashboard
# 4. Configurar domínio customizado
```

## 📝 Checklist Final

- [ ] Supabase configurado
- [ ] Schema SQL executado
- [ ] shadcn/ui instalado
- [ ] Autenticação funcionando
- [ ] API Routes criadas
- [ ] Dashboard básico
- [ ] Wizard de briefing
- [ ] Webhook n8n testado
- [ ] Visualizadores de assets
- [ ] Deploy na Vercel
- [ ] Testar fluxo completo

## 🆘 Precisa de Ajuda?

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com
- **React Query:** https://tanstack.com/query/latest

## 🎉 Quando Estiver Pronto

Teste o fluxo completo:
1. Criar conta
2. Criar projeto
3. Preencher briefing
4. Executar fase 1
5. n8n processar e enviar callback
6. Ver outputs no dashboard

**BOA SORTE! 🚀**

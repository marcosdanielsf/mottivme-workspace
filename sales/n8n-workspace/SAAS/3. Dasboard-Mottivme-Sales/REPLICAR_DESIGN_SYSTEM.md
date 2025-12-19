# 🔄 Como Replicar o Mottivme Design System em Outros Projetos

Guia rápido para aplicar a identidade visual Mottivme em qualquer projeto.

---

## 📋 Checklist Rápido

- [ ] Copiar `lib/mottivme-theme.ts` para o novo projeto
- [ ] Atualizar `tailwind.config.ts` com import do tema
- [ ] Adicionar variáveis CSS no `globals.css`
- [ ] Baixar e adicionar logo Mottivme em `/public`
- [ ] Testar cores em componentes principais

---

## 🚀 Passo a Passo

### 1️⃣ Copiar Arquivo de Tema

```bash
# Do projeto base (Dashboard Mottivme Sales)
cp lib/mottivme-theme.ts /caminho/do/novo/projeto/lib/

# Ou clonar do GitHub
curl -o lib/mottivme-theme.ts https://raw.githubusercontent.com/marcosdanielsf/Dasboard-Mottivme-Sales/main/lib/mottivme-theme.ts
```

### 2️⃣ Atualizar Tailwind Config

No seu `tailwind.config.ts`, adicione:

```typescript
import { mottivmeTheme } from "./lib/mottivme-theme"

export default {
  // ... resto da config
  theme: {
    extend: {
      colors: {
        'mottivme': {
          'dark': mottivmeTheme.colors.background.dark,
          'darker': mottivmeTheme.colors.background.darker,
          'blue': mottivmeTheme.colors.primary[500],
          'blue-dark': mottivmeTheme.colors.primary[700],
        },
        primary: {
          // Mapear cores Mottivme para 'primary'
          500: mottivmeTheme.colors.primary[500],
          600: mottivmeTheme.colors.primary[600],
          700: mottivmeTheme.colors.primary[700],
        },
      },
    },
  },
}
```

### 3️⃣ Adicionar Variáveis CSS

No seu `app/globals.css` ou `styles/globals.css`:

```css
@layer base {
  :root {
    /* Backgrounds Mottivme */
    --mottivme-dark: #0B0F19;
    --mottivme-darker: #0a0e17;
    --mottivme-card: #1a1f2e;

    /* Azul Mottivme */
    --mottivme-blue: #3B82F6;
    --mottivme-blue-dark: #2563EB;
    --mottivme-blue-darker: #1D4ED8;

    /* Textos */
    --mottivme-text-primary: #FFFFFF;
    --mottivme-text-secondary: #D1D5DB;
    --mottivme-text-muted: #9CA3AF;

    /* Gradientes */
    --mottivme-gradient-overlay: linear-gradient(180deg, rgba(11, 15, 25, 0.5) 0%, rgba(11, 15, 25, 0.9) 50%, rgba(11, 15, 25, 1) 100%);
  }
}

@layer base {
  body {
    @apply bg-[#0B0F19] text-white;
  }
}
```

### 4️⃣ Adicionar Logo Mottivme

```bash
# Criar pasta para assets
mkdir -p public/images

# Baixar logo (substitua com URL correta)
curl -o public/images/mottivme-logo.webp https://mottivme.com.br/wp-content/uploads/2023/11/company-7-1.webp
```

Usar no código:

```tsx
import Image from 'next/image'

<Image
  src="/images/mottivme-logo.webp"
  alt="Mottivme"
  width={150}
  height={40}
  priority
/>
```

### 5️⃣ Aplicar em Componentes

#### Header/Navbar

```tsx
export default function Header() {
  return (
    <header className="bg-[#0B0F19] border-b border-[#2d3748]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/mottivme-logo.webp" alt="Mottivme" width={120} height={32} />
          <span className="text-xl font-bold text-white">Mottivme Sales</span>
        </div>

        <nav className="flex gap-6 text-[#D1D5DB]">
          <a href="#" className="hover:text-[#3B82F6] transition">Como Funciona</a>
          <a href="#" className="hover:text-[#3B82F6] transition">Planos</a>
          <a href="#" className="hover:text-[#3B82F6] transition">Sobre</a>
        </nav>

        <button className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg transition">
          Quero Implantar
        </button>
      </div>
    </header>
  )
}
```

#### Hero Section

```tsx
export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0B0F19] flex items-center">
      {/* Gradiente Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/50 to-[#0B0F19]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Implantamos sua{' '}
          <span className="text-[#3B82F6]">Máquina de Vendas</span>
          {' '}em até 90 Dias
        </h1>

        <p className="text-xl text-[#D1D5DB] mb-12">
          Com rotina validada, CRM plug & play, Social Selling que gera caixa,
          e scripts testados.
        </p>

        <button className="
          px-8 py-4
          bg-[#2563EB] hover:bg-[#1D4ED8]
          text-white font-semibold text-lg
          rounded-lg
          shadow-[0_0_30px_rgba(37,99,235,0.6)]
          hover:shadow-[0_0_40px_rgba(37,99,235,0.8)]
          transition-all
        ">
          Quero Implantar Minha Máquina de Vendas →
        </button>
      </div>
    </section>
  )
}
```

#### Card de Dashboard

```tsx
export default function Card({ title, value, icon }: Props) {
  return (
    <div className="
      bg-[#1a1f2e]
      border border-[#2d3748]
      rounded-xl
      p-6
      hover:bg-[#242937]
      hover:border-[#3B82F6]
      transition-all
    ">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#9CA3AF] text-sm font-medium">{title}</h3>
        <span className="text-[#3B82F6]">{icon}</span>
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  )
}
```

---

## 🎨 Classes CSS Mais Usadas

### Backgrounds

```css
bg-[#0B0F19]      /* Background principal */
bg-[#1a1f2e]      /* Cards e containers */
bg-[#242937]      /* Hover states */
```

### Textos

```css
text-white        /* Texto principal */
text-[#D1D5DB]    /* Texto secundário */
text-[#9CA3AF]    /* Texto muted */
text-[#3B82F6]    /* Texto com destaque */
```

### Botões

```css
bg-[#2563EB] hover:bg-[#1D4ED8]              /* Botão primário */
border-2 border-[#3B82F6] hover:bg-[#3B82F6]/10  /* Botão outline */
```

### Bordas

```css
border-[#2d3748]     /* Borda padrão */
border-[#3B82F6]     /* Borda com accent */
```

---

## 🔍 Validação

Após aplicar o design system, verifique:

1. **Background principal é `#0B0F19`** ✓
2. **Textos principais são brancos** ✓
3. **CTAs usam `#2563EB` com hover `#1D4ED8`** ✓
4. **Destaques usam `#3B82F6`** ✓
5. **Logo Mottivme está visível no header** ✓

---

## 📦 Projetos para Replicar

- [ ] Dashboard Comercial (v0-comercial-dashboard-metrics)
- [ ] Dashboard Financeiro BPO (dashboard-nextjs-nu-five)
- [ ] Admin Dashboard (admin-dashboard-zeta-umber)
- [ ] Landing Pages (mottivme-landing-pages)
- [ ] Scripts de Vendas (assembly-line-script-app)
- [ ] Novos projetos

---

## 🆘 Troubleshooting

### Cores não aparecem no Tailwind

```bash
# Limpar cache do Tailwind
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar e rebuildar
pnpm install
pnpm run build
```

### Logo não carrega

```tsx
// Use next/image com priority
import Image from 'next/image'

<Image
  src="/images/mottivme-logo.webp"
  alt="Mottivme"
  width={150}
  height={40}
  priority
/>
```

### Variáveis CSS não funcionam

Verifique se o arquivo `globals.css` está sendo importado no `layout.tsx`:

```tsx
import './globals.css'
```

---

## 📞 Suporte

Dúvidas? Entre em contato com a equipe de desenvolvimento Mottivme.

**Arquivo de referência:** [MOTTIVME_DESIGN_SYSTEM.md](./MOTTIVME_DESIGN_SYSTEM.md)

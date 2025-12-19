# 🏭 Assembly Line

> AI-Powered Funnel Builder by MOTTIVME

Uma plataforma completa para criar estratégias de marketing com 16 agentes de IA trabalhando para você.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
assembly-line/
├── app/                      # Next.js App Router
│   ├── globals.css          # Estilos globais + Design System
│   ├── layout.tsx           # Layout raiz
│   └── page.tsx             # Página principal
│
├── components/
│   ├── ui/                  # Componentes base (Button, Card, Input, etc.)
│   │   ├── index.tsx        # Componentes UI
│   │   └── icons.tsx        # Ícones (Lucide)
│   │
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx      # Navegação lateral
│   │   └── Header.tsx       # Header com ações
│   │
│   ├── dashboard/           # Dashboard page
│   │   ├── DashboardContent.tsx
│   │   └── NewProjectModal.tsx
│   │
│   ├── briefing/           # Briefing/Onboarding (TODO)
│   ├── generation/         # Generation pipeline (TODO)
│   ├── vortex/             # Canvas editor (TODO)
│   ├── content/            # Content hub (TODO)
│   ├── ads/                # Competitive intel (TODO)
│   ├── clone/              # Clone expert (TODO)
│   ├── export/             # Export center (TODO)
│   └── settings/           # Settings (TODO)
│
├── lib/
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── hooks/              # Custom hooks
│
└── public/                 # Static assets
```

## 🎨 Design System

### Cores
- **Brand**: `#8b5cf6` (Roxo)
- **Secondary**: `#3b82f6` (Azul)
- **Success**: `#22c55e` (Verde)
- **Warning**: `#f59e0b` (Amarelo)
- **Danger**: `#ef4444` (Vermelho)
- **Background**: `#0a0a0f`

### Componentes
- `Button` - Botões com variantes (primary, secondary, ghost, danger, success)
- `Card` - Cards com efeito glass
- `Badge` - Badges de status
- `Input` / `Textarea` - Campos de entrada
- `Progress` - Barras de progresso
- `Avatar` - Avatares com iniciais
- `Skeleton` - Loading states
- `Tooltip` - Tooltips informativos

### Animações
- `animate-slide-up` - Entrada de baixo
- `animate-fade-in` - Fade in
- `animate-scale-in` - Scale in
- `animate-pulse-glow` - Glow pulsante

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **State**: Zustand
- **Animações**: Framer Motion (em breve)
- **Canvas**: React Flow (em breve)
- **Ícones**: Lucide React
- **UI**: Radix UI primitives

## 📋 Roadmap

### ✅ Fase 1 - Base (Concluído)
- [x] Setup do projeto
- [x] Design System
- [x] Componentes UI base
- [x] Layout (Sidebar + Header)
- [x] Dashboard

### 🔄 Fase 2 - Em Progresso
- [ ] Briefing (Chat conversacional)
- [ ] Generation (Pipeline visual)
- [ ] Content Hub

### 📅 Fase 3 - Próximo
- [ ] Editor Vortex (Canvas)
- [ ] Competitive Intelligence
- [ ] Clone Expert
- [ ] Export Center
- [ ] Settings

## 👨‍💻 Desenvolvido por

**MOTTIVME** - Marcos Aurélio

---

*Assembly Line - Transformando experts em máquinas de conteúdo* 🚀

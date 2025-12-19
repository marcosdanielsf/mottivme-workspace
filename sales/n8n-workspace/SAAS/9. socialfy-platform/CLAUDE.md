# Socialfy Platform - Contexto do Projeto

## Status Atual: ✅ Estável em Produção

**Última atualização:** 12/12/2024
**Versão:** 1.0.0 (Dark Mode + i18n)

---

## O que é o Socialfy?

Plataforma de Sales Intelligence com IA para prospecção B2B multicanal (LinkedIn, Instagram, WhatsApp, Email, Telefone).

## Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4.1.18 (com `@tailwindcss/vite` plugin)
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Deploy:** Vercel (conectado ao GitHub)
- **IA:** Gemini API (para geração de mensagens e qualificação)

## URLs Importantes

- **Produção:** https://socialfy-platform.vercel.app
- **GitHub:** https://github.com/marcosdanielsf/socialfy-platform
- **Vercel Dashboard:** https://vercel.com/marcosdanielsfs-projects/socialfy-platform

---

## Estrutura de Branches

| Branch | Propósito | Deploy |
|--------|-----------|--------|
| `main` | Produção estável | Automático para produção |
| `develop` | Desenvolvimento ativo | Preview deploy |
| `feature/*` | Novas funcionalidades | Preview por PR |

### Fluxo de trabalho:
1. Criar branch a partir de `develop`
2. Desenvolver e testar
3. PR para `develop` → testar no preview
4. PR de `develop` para `main` → produção

---

## Funcionalidades Implementadas

### ✅ Concluídas
- [x] Dark Mode (toggle light/dark com classe `.dark`)
- [x] Internacionalização PT/EN (LanguageContext)
- [x] Tailwind CSS v4 configurado corretamente
- [x] Sidebar com navegação completa
- [x] Views: Dashboard, Leads, Accounts, Pipeline, Inbox, etc.
- [x] Supabase Edge Functions (qualify-lead, generate-message, etc.)
- [x] Git + GitHub + Vercel CI/CD configurado

### 🔄 Em Progresso / Próximos Passos
- [ ] Conectar frontend com Supabase real (atualmente usa mock data)
- [ ] Implementar autenticação (Supabase Auth)
- [ ] Integrar APIs reais (LinkedIn, Instagram, etc.)
- [ ] Configurar n8n para automações

---

## Arquivos Importantes

```
socialfy-platform/
├── App.tsx                    # Componente principal com todas as views
├── index.css                  # Tailwind v4 + dark mode config
├── vite.config.ts             # Vite + Tailwind plugin
├── contexts/
│   ├── ThemeContext.tsx       # Gerenciamento de tema (light/dark)
│   └── LanguageContext.tsx    # Internacionalização (pt/en)
├── components/
│   └── UI.tsx                 # Componentes reutilizáveis (Button, Card, etc.)
├── hooks/
│   └── useSupabaseData.ts     # Hook para dados do Supabase
├── supabase/
│   ├── schema.sql             # Schema do banco
│   └── functions/             # Edge Functions
└── vercel.json                # Config de deploy
```

---

## Configurações Especiais

### Tailwind CSS v4
- Usa `@tailwindcss/vite` plugin (não PostCSS)
- Dark mode via `@custom-variant dark (&:where(.dark, .dark *))`
- Não precisa de `tailwind.config.js` (configuração no CSS)

### Variáveis de Ambiente (Vercel)
- `GEMINI_API_KEY` - API do Google Gemini
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anon do Supabase

---

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build
npm run build

# Deploy manual para produção
npx vercel --prod

# Criar nova feature
git checkout develop
git checkout -b feature/nome-da-feature

# Commitar
git add . && git commit -m "feat: descrição"

# Push
git push origin feature/nome-da-feature
```

---

## Notas para Continuação

Quando retomar o desenvolvimento:

1. **Verificar branch atual:** `git branch`
2. **Atualizar do remote:** `git pull origin main`
3. **Verificar status:** `git status`
4. **Rodar local:** `npm run dev`

Se houver problemas com dependências:
```bash
rm -rf node_modules && npm install
```

---

## Contato

Projeto desenvolvido para **Marcos Daniel** (MottivMe Sales)

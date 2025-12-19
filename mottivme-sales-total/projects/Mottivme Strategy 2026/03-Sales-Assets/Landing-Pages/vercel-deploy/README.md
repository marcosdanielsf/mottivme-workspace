# 🚀 Deploy Vercel - Proposta Carol & Luiz

Esta pasta contém tudo pronto para fazer deploy no Vercel.

---

## 📁 ARQUIVOS

```
vercel-deploy/
├── index.html         (Landing page v4 - proposta clara)
├── vercel.json        (Configuração Vercel)
└── README.md          (Este arquivo)
```

---

## 🚀 COMO FAZER DEPLOY (3 MINUTOS)

### **OPÇÃO 1: Drag & Drop (MAIS FÁCIL)**

1. Acesse: https://vercel.com/new
2. Faça login (GitHub, GitLab ou email)
3. Arraste a **PASTA `vercel-deploy`** inteira pra área de upload
4. Clique em "Deploy"
5. **PRONTO!** Em 30 segundos você tem o link

**Exemplo de URL gerada:**
```
https://proposta-carol-luiz-abc123.vercel.app
```

---

### **OPÇÃO 2: Vercel CLI (Linha de Comando)**

```bash
# 1. Instalar Vercel CLI (só primeira vez)
npm install -g vercel

# 2. Entrar na pasta
cd vercel-deploy

# 3. Fazer deploy
vercel

# 4. Seguir instruções na tela
# Vai perguntar:
# - Login (conecta com GitHub)
# - Nome do projeto (sugestão: proposta-carol-luiz)
# - Configurações (só dar ENTER em tudo)

# PRONTO! Link gerado
```

---

## ⚙️ CONFIGURAÇÕES DO VERCEL.JSON

O arquivo `vercel.json` já está configurado com:

- ✅ **Roteamento:** Qualquer URL redireciona pra `index.html`
- ✅ **Cache:** 1 hora (browser) + 24 horas (CDN)
- ✅ **Build:** Static HTML (sem build step)

---

## 🔧 CUSTOMIZAR DOMÍNIO (OPCIONAL)

Depois do deploy, você pode adicionar domínio custom:

1. No dashboard Vercel, clique no projeto
2. Vá em "Settings" → "Domains"
3. Adicione seu domínio:
   - `proposta.mottivme.com`
   - `carol-luiz.mottivme.com`
4. Siga instruções pra configurar DNS

---

## 📝 EDITAR ANTES DE FAZER DEPLOY

**Antes de fazer deploy, edite os CTAs no `index.html`:**

**Calendly (linha ~583):**
```html
<a href="https://calendly.com/mottivme/15min"
```

**Email (já tá correto):**
```html
marcos@mottivme.com
```

**WhatsApp (procure por "[Seu número]"):**
```html
📱 WhatsApp: [Seu número]
```

Você pode abrir `index.html` em qualquer editor de texto e fazer CTRL+F pra achar essas linhas.

---

## 🔄 ATUALIZAR DEPOIS DO DEPLOY

Se precisar fazer mudanças depois:

1. Edite o arquivo `index.html`
2. Rode `vercel --prod` (via CLI)
   OU
3. Arraste novamente a pasta no dashboard Vercel

Vercel faz re-deploy automático em ~30 segundos.

---

## 💡 DICAS

**Teste local antes:**
```bash
# Abrir no navegador
open index.html

# Ou servidor local (Python)
python3 -m http.server 8000
# Acesse: http://localhost:8000
```

**Compartilhar link:**
- Link vai ficar tipo: `https://proposta-carol-luiz-abc123.vercel.app`
- Você pode customizar: Settings → Domains → Add

**Analytics (opcional):**
- Vercel tem analytics nativo (gratuito)
- Settings → Analytics → Enable

---

## ✅ CHECKLIST PRÉ-DEPLOY

- [ ] Editei Calendly link
- [ ] Editei WhatsApp (se necessário)
- [ ] Testei localmente (abri index.html)
- [ ] Tudo funcionando (scroll, botões, etc)
- [ ] Pronto pra fazer deploy!

---

**Qualquer dúvida, só chamar!**

*Criado em: 05/12/2025*
*Proposta v4 - Carol & Luiz*

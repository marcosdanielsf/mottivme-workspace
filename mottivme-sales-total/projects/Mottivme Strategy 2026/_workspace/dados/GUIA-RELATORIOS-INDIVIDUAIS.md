# Guia: Relatórios Individuais por Cliente

## 📋 Visão Geral

Foram criados **2 workflows** para enviar relatórios individualizados de Facebook Ads para cada cliente via WhatsApp:

1. **notification-ads-individual-clients.json** - Versão com Airtable
2. **notification-ads-simple-config.json** - Versão com Config Simples

---

## 🔍 Comparação entre Versões

| Característica | Versão Airtable | Versão Config Simples |
|----------------|-----------------|----------------------|
| **Facilidade de Setup** | ⚠️ Média (requer tabela extra) | ✅ Fácil (editar um nó) |
| **Gerenciamento** | ✅ Interface gráfica do Airtable | ⚠️ Editar código do workflow |
| **Histórico de Dados** | ✅ Salva métricas no Airtable | ❌ Apenas envia, não salva |
| **Performance** | ⚠️ Mais queries (mais lento) | ✅ Menos queries (mais rápido) |
| **Escalabilidade** | ✅ Excelente (muitos clientes) | ⚠️ Boa (até ~20 clientes) |
| **Manutenção** | ✅ Sem editar workflow | ⚠️ Precisa editar workflow |
| **Análise de Dados** | ✅ Dashboards no Airtable | ❌ Não disponível |

### Quando usar cada versão?

**Use Versão Airtable se:**
- Você tem **5+ clientes**
- Quer **analisar histórico** de métricas
- Precisa de **dashboards** e relatórios avançados
- Quer gerenciar contatos sem editar o workflow

**Use Versão Config Simples se:**
- Você tem **poucos clientes** (1-5)
- Quer **setup rápido**
- Não precisa de histórico
- Prefere configuração direta no workflow

---

## 🚀 Setup - Versão Config Simples

### Passo 1: Importar Workflow

1. Abra o n8n
2. Clique em "Import from File"
3. Selecione `notification-ads-simple-config.json`

### Passo 2: Configurar Contatos

1. Abra o nó **"⚙️ CONFIGURAR CONTATOS AQUI"**
2. Edite o objeto `clientContacts`:

```javascript
const clientContacts = {
  // Nome EXATO da conta no Facebook Ads
  "Marketing Agency Inc": {
    contactId: "zW9CbEIUzNXr9XV8q43V",  // ID do LeadConnector
    telefone: "+5511999999999",          // Com código do país
    ativo: true                          // true = recebe relatórios
  },

  "E-commerce Store": {
    contactId: "ABC123DEF456GHI789",
    telefone: "+5511988888888",
    ativo: true
  },

  "Cliente de Teste": {
    contactId: "TEST123",
    telefone: "+5511977777777",
    ativo: false  // false = NÃO recebe relatórios
  }
};
```

**Como descobrir o Contact ID do LeadConnector:**
1. Acesse LeadConnector → Contacts
2. Abra o contato
3. O ID está na URL: `...conversations/[CONTACT_ID]`

### Passo 3: Configurar Credenciais

#### Facebook Graph API
1. Vá em **Settings → Credentials**
2. Crie credencial **"Facebook Graph API"**
3. Faça login com conta de admin do Facebook Business
4. Configure nos nós: 1, 4, 6, 8, 11

#### LeadConnector API
1. Vá em **Settings → Credentials**
2. Crie credencial **"HTTP Header Auth"**
3. Configure:
   - **Name**: `Authorization`
   - **Value**: `Bearer SEU_TOKEN_AQUI`
4. Configure no nó **16. ✅ Enviar WhatsApp**

**Como obter o token LeadConnector:**
1. Acesse LeadConnector → Settings → API
2. Copie o "API Key" ou gere um novo

### Passo 4: Testar

1. Clique em **"Execute Workflow"**
2. Verifique no console:
   - ✅ Clientes que receberam relatório
   - ⚠️ Clientes ignorados (inativos ou sem config)
3. Confira se as mensagens chegaram no WhatsApp

### Passo 5: Ativar Schedule

1. Abra o nó **"Executar Diariamente 8h"**
2. Ajuste o horário se necessário
3. Clique em **"Activate"** no canto superior

---

## 🏢 Setup - Versão Airtable

### Passo 1: Criar Tabela de Contatos no Airtable

1. Acesse sua base **"AI VSL Demo"** no Airtable
2. Crie uma nova tabela chamada **"Clientes - Contatos"**
3. Adicione os campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Account Name** | Single line text | Nome EXATO da conta Facebook |
| **Contact ID** | Single line text | ID do contato no LeadConnector |
| **Telefone** | Phone number | Telefone com código do país |
| **Ativo** | Checkbox | Se deve receber relatórios |

4. Preencha com seus clientes:

| Account Name | Contact ID | Telefone | Ativo |
|--------------|------------|----------|-------|
| Marketing Agency Inc | zW9CbEIUzNXr9XV8q43V | +5511999999999 | ✓ |
| E-commerce Store | ABC123DEF456 | +5511988888888 | ✓ |

### Passo 2: Importar Workflow

1. Abra o n8n
2. Import `notification-ads-individual-clients.json`

### Passo 3: Configurar IDs

1. Abra o nó **"17. Buscar Dados de Contato"**
2. No campo **Table**, selecione **"Clientes - Contatos"**
3. Se o ID não aparecer, copie da URL do Airtable:
   - Abra a tabela no navegador
   - URL: `https://airtable.com/appXXX/tblYYY`
   - `tblYYY` é o ID da tabela

### Passo 4: Configurar Credenciais

#### Facebook Graph API
- Mesmo processo da versão simples
- Configure nos nós: 1, 4, 6, 8, 11

#### Airtable OAuth2 API
1. Settings → Credentials → New
2. Tipo: **"Airtable OAuth2 API"**
3. Faça login no Airtable
4. Configure nos nós: 13, 14, 17

#### LeadConnector API
- Mesmo processo da versão simples
- Configure no nó **20. Enviar WhatsApp**

### Passo 5: Testar e Ativar

- Mesmo processo da versão simples

---

## 📊 O que os Workflows Fazem?

### Fluxo Completo:

```
1. Schedule Trigger (8h)
   ↓
2. Buscar Contas Facebook
   ↓
3-10. Buscar Campanhas → Ad Sets → Anúncios → Métricas
   ↓
11-12. Formatar Dados
   ↓
13. Salvar no Airtable (só versão Airtable)
   ↓
14. Buscar Dados de Ontem
   ↓
15. **Agrupar por Cliente** ← CHAVE AQUI!
   ↓
16. Formatar Mensagem Individual
   ↓
17. Buscar Contato do Cliente
   ↓
18. Validar Dados
   ↓
19. **Enviar WhatsApp Individual** ← Um por cliente!
```

### Formato da Mensagem:

```
🚀 *RELATÓRIO DIÁRIO DE TRÁFEGO*
━━━━━━━━━━━━━━━━━━━━

👤 *Cliente:* Marketing Agency Inc
📅 *Data:* 2025-01-18

📊 *MÉTRICAS GERAIS*
━━━━━━━━━━━━━━━━━━━━
💰 Investimento: $ 245.67
👁️ Impressões: 12,450
🖱️ Cliques: 385
💬 Conversas Iniciadas: 42
📱 Primeira Resposta: 28
🔄 Mensagens Depth 2: 15

📈 *PERFORMANCE*
━━━━━━━━━━━━━━━━━━━━
💵 Custo/Conversa: $ 5.85
📊 CPM: $ 19.73
📍 CTR: 3.09%
✅ Taxa Conversão: 10.91%

🏆 *TOP 3 ANÚNCIOS*
━━━━━━━━━━━━━━━━━━━━

1. *Anúncio Vídeo VSL*
   💰 Gasto: $ 120.50
   💬 Conversões: 25
   📊 Custo/Conv: $ 4.82

2. *Anúncio Carrossel Produto*
   💰 Gasto: $ 78.30
   💬 Conversões: 12
   📊 Custo/Conv: $ 6.53

3. *Anúncio Imagem Estática*
   💰 Gasto: $ 46.87
   💬 Conversões: 5
   📊 Custo/Conv: $ 9.37

━━━━━━━━━━━━━━━━━━━━
📅 Gerado em: 19/01/2025 08:15
```

---

## 🔧 Troubleshooting

### Problema: "Cliente não recebeu relatório"

**Verificar:**
1. Nome da conta no Facebook é **EXATAMENTE** igual ao configurado?
2. Cliente está marcado como `ativo: true`?
3. Contact ID e telefone estão corretos?
4. Credencial LeadConnector está configurada?

**Como debugar:**
- Execute o workflow manualmente
- Verifique os logs no console
- Procure por `❌ ENVIO IGNORADO` no console

### Problema: "Erro na API do Facebook"

**Causas comuns:**
1. Token expirado → Refazer login no Facebook
2. Permissões insuficientes → Verificar scopes da app
3. Rate limit → Adicionar delay entre requests

### Problema: "Dados não salvam no Airtable"

**Versão Airtable apenas:**
1. Credencial Airtable configurada?
2. IDs de base/tabela corretos?
3. Campos da tabela criados?

### Problema: "Mensagem não formata corretamente"

**Verificar:**
1. LeadConnector aceita markdown? (WhatsApp sim, SMS limitado)
2. Telefone com código do país correto?
3. Tipo de mensagem configurado (SMS vs WhatsApp)?

---

## 🎯 Próximos Passos Recomendados

### Melhorias Futuras:

1. **Adicionar Error Notification**
   - Enviar email/Slack se workflow falhar
   - Nó: Slack/Email após validações

2. **Relatório Semanal Agregado**
   - Modificar filtro de data para 7 dias
   - Adicionar comparação semana anterior

3. **Dashboard no Airtable** (versão Airtable)
   - Criar views por cliente
   - Gráficos de tendência
   - Alerts automáticos

4. **A/B Testing Insights**
   - Comparar performance de criativos
   - Sugestões automáticas de otimização

5. **Multi-idioma**
   - Detectar idioma do cliente
   - Enviar relatório traduzido

---

## 📞 Suporte

**Dúvidas sobre:**
- **n8n**: https://community.n8n.io
- **Facebook Graph API**: https://developers.facebook.com
- **Airtable**: https://support.airtable.com
- **LeadConnector**: https://support.leadconnector.com

---

## 📝 Changelog

### v2.0 - Relatórios Individualizados
- ✅ Agrupa dados por cliente
- ✅ Envia relatório individual para cada cliente
- ✅ Validação de contatos ativos
- ✅ Logs de envios ignorados
- ✅ 2 versões (Airtable e Config Simples)
- ✅ Error handling robusto
- ✅ Credenciais seguras (sem hardcode)
- ✅ Rate limiting no envio

### v1.0 - Workflow Original
- ❌ Relatório único agregado
- ❌ Envia para um único contato
- ❌ Sem separação por cliente

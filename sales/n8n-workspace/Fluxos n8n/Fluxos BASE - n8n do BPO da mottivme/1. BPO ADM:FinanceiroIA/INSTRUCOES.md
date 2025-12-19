# 📋 Instruções de Instalação dos Workflows

## 🎯 Visão Geral

Estes workflows automatizam completamente a gestão financeira da Mottivme Sales:

1. **Agente Financeiro Principal** - Secretária virtual que processa entradas manuais e arquivos
2. **Sistema de Cobrança Automática** - Envia lembretes e cobranças automaticamente
3. **Processador de Comprovantes** - Dá baixa automática quando cliente envia comprovante

---

## 🛠️ Pré-requisitos

### 1. Credenciais n8n

Você precisará configurar as seguintes credenciais no n8n:

#### PostgreSQL (Supabase)
- **Nome**: `Supabase - BPO Financeiro`
- **Host**: `db.xbqxivqzetaoptuyykmax.supabase.co`
- **Database**: `postgres`
- **User**: Seu usuário Supabase
- **Password**: Sua senha Supabase
- **Port**: `5432`
- **SSL**: Habilitado

#### OpenAI API
- **Nome**: `OpenAI - BPO`
- **API Key**: Sua chave da OpenAI
- **Organization ID**: (opcional)

#### WhatsApp/Evolution API
- **Nome**: `Evolution API - Mottivme`
- **URL**: URL da sua instância Evolution API
- **API Key**: Sua chave da Evolution API

### 2. Extensões n8n Necessárias

Instale as seguintes extensões no seu n8n:

```bash
npm install @n8n/n8n-nodes-langchain
```

---

## 📥 Importação dos Workflows

### Passo 1: Importar Workflows

1. Acesse seu n8n
2. Clique em **"Workflows"** > **"Add workflow"** > **"Import from file"**
3. Importe os arquivos na seguinte ordem:
   - `1-agente-financeiro-principal.json`
   - `2-sistema-cobranca-automatica.json`
   - `3-processador-comprovantes.json`

### Passo 2: Configurar Credenciais

Em cada workflow importado:

1. Abra cada nó que tenha um **ícone de alerta ⚠️**
2. Selecione a credencial correta (criadas no pré-requisito)
3. Salve o workflow

### Passo 3: Ativar Webhooks

Para o **Agente Financeiro Principal**:

1. Abra o nó **"Webhook Evolution"**
2. Copie a URL do webhook gerada
3. Configure no Evolution API:
   ```json
   {
     "webhook": "SUA_URL_WEBHOOK_AQUI",
     "webhook_by_events": true,
     "events": [
       "QRCODE_UPDATED",
       "MESSAGES_UPSERT",
       "MESSAGES_UPDATE",
       "SEND_MESSAGE"
     ]
   }
   ```

---

## ⚙️ Configuração do Banco de Dados

### Tabelas Necessárias

Certifique-se que essas tabelas existem no Supabase (já devem estar criadas):

```sql
-- Movimentações Financeiras
CREATE TABLE movimentacoes_financeiras (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'receita' ou 'despesa'
  valor_previsto DECIMAL(10,2),
  valor_realizado DECIMAL(10,2),
  descricao TEXT,
  data_vencimento DATE NOT NULL,
  data_realizado DATE,
  quitado BOOLEAN DEFAULT FALSE,
  tipo_pessoa TEXT, -- 'PF' ou 'PJ'
  observacoes TEXT,
  data_competencia DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clientes/Fornecedores
CREATE TABLE clientes_fornecedores (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  tipo TEXT, -- 'cliente' ou 'fornecedor'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cobranças (para controle do sistema automático)
CREATE TABLE cobrancas_automaticas (
  id BIGSERIAL PRIMARY KEY,
  movimentacao_id BIGINT REFERENCES movimentacoes_financeiras(id),
  telefone TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pendente', 'lembrete_enviado', 'cobranca_enviada', 'pago'
  lembrete_enviado_em TIMESTAMP,
  cobranca_enviada_em TIMESTAMP,
  pago_em TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Testando os Workflows

### Teste 1: Entrada Manual

Envie uma mensagem WhatsApp para o número configurado:

```
Paguei R$ 350 de conta de luz da Mottivme em 25/10/2025
```

**Resultado esperado:**
- Agente responde confirmando os dados extraídos
- Solicita confirmação
- Ao responder "Sim", insere no banco

### Teste 2: Upload de Comprovante

Envie uma foto de boleto/comprovante via WhatsApp

**Resultado esperado:**
- Agente processa com GPT-4 Vision
- Extrai dados do comprovante
- Mostra resumo e solicita confirmação
- Ao confirmar, salva no banco

### Teste 3: Sistema de Cobrança (Automático)

O workflow **Sistema de Cobrança Automática** roda a cada 6 horas e:

1. Busca cobranças com vencimento em 5 dias
2. Envia lembrete automático via WhatsApp
3. No dia do vencimento, envia cobrança
4. Marca como enviado no banco

**Não requer ação manual!**

### Teste 4: Dar Baixa com Comprovante

Quando cliente envia comprovante de pagamento:

1. Agente reconhece que é um comprovante
2. Identifica a movimentação relacionada
3. Marca como `quitado = true`
4. Atualiza `data_realizado`
5. Confirma ao cliente

---

## 📊 Monitoramento

### Logs do Sistema

Para ver as execuções dos workflows:

1. Acesse **n8n > Executions**
2. Filtre por workflow
3. Veja detalhes de cada execução

### Verificar Dados no Supabase

```sql
-- Ver últimas movimentações
SELECT * FROM movimentacoes_financeiras
ORDER BY created_at DESC
LIMIT 10;

-- Ver cobranças pendentes
SELECT * FROM cobrancas_automaticas
WHERE status IN ('pendente', 'lembrete_enviado')
ORDER BY created_at DESC;

-- Estatísticas do dia
SELECT
  tipo,
  COUNT(*) as quantidade,
  SUM(COALESCE(valor_realizado, valor_previsto)) as total
FROM movimentacoes_financeiras
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY tipo;
```

---

## 🔧 Personalização

### Ajustar Prompts da IA

No workflow **Agente Financeiro Principal**:

1. Abra o nó **"Preparar Prompts"**
2. Edite os campos `system_prompt` e `extraction_prompt`
3. Salve e teste

### Modificar Horários de Cobrança

No workflow **Sistema de Cobrança Automática**:

1. Abra o nó **"Schedule Trigger"**
2. Ajuste o cron expression
3. Padrão: `0 */6 * * *` (a cada 6 horas)

### Alterar Dias de Lembrete

No workflow **Sistema de Cobrança Automática**:

1. Abra o nó **"Buscar Vencimentos"**
2. Modifique a query SQL:
   ```sql
   -- Mudar de 5 dias para 7 dias
   WHERE data_vencimento = CURRENT_DATE + INTERVAL '7 days'
   ```

---

## ❓ Troubleshooting

### Erro: "Credencial não encontrada"

**Solução**: Reconfigure as credenciais em cada nó com o ícone ⚠️

### Erro: "Webhook não responde"

**Solução**:
1. Verifique se o workflow está **ativado** (toggle no topo)
2. Teste o webhook com cURL:
   ```bash
   curl -X POST <SUA_URL_WEBHOOK> \
     -H "Content-Type: application/json" \
     -d '{"message": "teste"}'
   ```

### IA não extrai dados corretamente

**Solução**:
1. Verifique se tem créditos na OpenAI
2. Ajuste a `temperature` no nó OpenAI (padrão: 0.3)
3. Refine os prompts no nó "Preparar Prompts"

### Comprovantes não são reconhecidos

**Solução**:
1. Certifique-se que usa GPT-4 Vision (não GPT-3.5)
2. Verifique qualidade da imagem (mínimo 300x300px)
3. PDFs devem ser convertidos para imagem primeiro

---

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique os logs de execução no n8n
2. Consulte a documentação do n8n: https://docs.n8n.io
3. Revise o arquivo `AGENTE-SECRETARIA-IA.md` para detalhes técnicos

---

**Desenvolvido com ❤️ por Claude Code**

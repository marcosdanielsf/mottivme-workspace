# 🚀 Guia de Implementação - Sistema de Cobrança Automática

## Visão Geral

Este sistema automatiza a cobrança de clientes com contratos ativos:

1. **Sincroniza** contratos do dashboard → sistema financeiro
2. **Gera automaticamente** as mensalidades de cada mês
3. **Envia lembretes** 5 dias antes do vencimento
4. **Envia cobranças** no dia do vencimento
5. **Registra** tudo para auditoria

---

## 📋 Passo a Passo

### PASSO 1: Executar SQL no Supabase

Acesse o **Supabase SQL Editor** e execute os scripts na ordem:

```
1. sql/22a-preparar-constraint-email.sql  (preparação)
2. sql/22-sincronizar-contratos-sistema-financeiro.sql  (sincronização)
```

**O que vai acontecer:**
- ✅ Clientes ativos serão criados na tabela `clientes_fornecedores`
- ✅ Recorrências serão criadas para cada contrato ativo
- ✅ Movimentações do mês atual serão geradas
- ✅ Tabelas de suporte serão criadas (`cobrancas_automaticas`, `logs_financeiros`)

---

### PASSO 2: Configurar Credenciais no n8n

No n8n, crie as seguintes credenciais:

#### 2.1 Supabase (Postgres)
- **Nome:** `Supabase - BPO Financeiro`
- **Host:** `db.xbqxivqzetaoptuyykmx.supabase.co`
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** (sua senha do Supabase)
- **Port:** `5432`
- **SSL:** `require`

#### 2.2 GoHighLevel API (se usar)
- **Nome:** `GHL API`
- **API Key:** sua chave do GHL

---

### PASSO 3: Importar Workflows no n8n

Importe os seguintes workflows (Menu → Import → From File):

| Arquivo | Função |
|---------|--------|
| `7-gerar-recorrencias-mensais.json` | Gera cobranças todo dia 1 |
| `2-sistema-cobranca-automatica.json` | Envia lembretes e cobranças |

---

### PASSO 4: Ativar Workflows

1. Abra cada workflow importado
2. Clique em **"Active"** (toggle no canto superior direito)
3. Confirme a ativação

**Horários de execução:**
- `7-gerar-recorrencias-mensais`: Dia 1 de cada mês às 6h
- `2-sistema-cobranca-automatica`: A cada 6 horas

---

### PASSO 5: Testar Manualmente

Para testar sem esperar o agendamento:

1. Abra o workflow
2. Clique em **"Execute Workflow"**
3. Verifique os resultados em cada nó

---

## 📊 Verificação Pós-Instalação

Execute este SQL para verificar se tudo está OK:

```sql
-- Verificar recorrências criadas
SELECT
    r.descricao,
    r.valor,
    r.dia_vencimento,
    cf.nome as cliente,
    cf.email,
    cf.telefone
FROM recorrencias r
LEFT JOIN clientes_fornecedores cf ON r.cliente_fornecedor_id = cf.id
WHERE r.ativo = true
ORDER BY r.dia_vencimento;

-- Verificar movimentações do mês
SELECT
    m.descricao,
    m.valor_previsto,
    m.data_vencimento,
    m.quitado,
    cf.nome as cliente
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
AND DATE_TRUNC('month', m.data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY m.data_vencimento;
```

---

## 🔄 Fluxo do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Next.js)                       │
│                                                              │
│  Contratos Pendentes → status = 'ativo' → valor_mensal      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (SQL Sync)
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                                │
│                                                              │
│  contratos_pendentes                                         │
│         ↓                                                    │
│  clientes_fornecedores ←──── recorrencias                   │
│         ↓                         ↓                          │
│  movimentacoes_financeiras ←── (dia 1 do mês)               │
│         ↓                                                    │
│  cobrancas_automaticas                                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (n8n Workflows)
┌─────────────────────────────────────────────────────────────┐
│                         n8n                                  │
│                                                              │
│  [Workflow 7] Dia 1 → Gera movimentações do mês             │
│                                                              │
│  [Workflow 2] A cada 6h:                                     │
│     - Busca vencimentos em 5 dias → envia lembrete          │
│     - Busca vencimentos hoje → envia cobrança               │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (GoHighLevel API)
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (WhatsApp)                        │
│                                                              │
│  📱 "Olá! Lembrete: sua fatura de R$ 550 vence em 5 dias"  │
│  📱 "⚠️ VENCIMENTO HOJE! Fatura de R$ 550..."              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📅 Clientes Ativos (Exemplo)

| Cliente | Produto | Valor | Vencimento |
|---------|---------|-------|------------|
| Luiz Augusto | BPOSS | R$ 550 | Dia 10 |
| Thauan Oliveira | BPOSS | R$ 460 | Dia 17 |
| Heloise Silvestre | BPOSS | R$ 460 | Dia 17 |
| Milton de Abreu | BPOSS | $300 | Dia 24 |
| Gustavo Couto | BPOSS | $1000 | Dia 4 |
| Marina Couto | BPOSS | $800 | Dia 4 |
| Andrey Medeiros | Impact | $500 | Dia 22 |
| Alberto Souza | BPOSS | R$ 850 | Dia 12 |
| Fernanda | Tráfego | $600 | Dia 25 |
| André Rosa | Tráfego | $500 | Dia 10 |

---

## ❓ Problemas Comuns

### "Contato não encontrado no GHL"
- Verifique se o email do cliente está cadastrado no GoHighLevel
- O sistema busca por email, então deve bater exatamente

### "Recorrência não foi gerada"
- Verifique se o contrato está com status = 'ativo'
- Verifique se o valor_mensal está preenchido
- Verifique se o email está preenchido

### "Movimentação duplicada"
- O sistema já previne duplicatas
- Se ocorrer, verifique a lógica do `NOT EXISTS` no SQL

---

## 🔧 Manutenção

### Adicionar novo cliente
1. Adicione no dashboard com status = 'ativo'
2. Execute o SQL de sincronização novamente
3. Ou aguarde o próximo dia 1 do mês

### Desativar cobrança de um cliente
1. Mude o status do contrato para 'churn' ou 'cancelado'
2. Execute:
```sql
UPDATE recorrencias SET ativo = false
WHERE cliente_fornecedor_id = (
    SELECT id FROM clientes_fornecedores WHERE email = 'email@cliente.com'
);
```

### Marcar como pago
```sql
UPDATE movimentacoes_financeiras
SET quitado = true, data_realizado = CURRENT_DATE
WHERE id = 'uuid-da-movimentacao';
```

---

## 📞 Suporte

Em caso de dúvidas, verifique:
1. Logs do n8n (Executions)
2. Logs do Supabase (Database → Logs)
3. Tabela `logs_financeiros` para auditoria

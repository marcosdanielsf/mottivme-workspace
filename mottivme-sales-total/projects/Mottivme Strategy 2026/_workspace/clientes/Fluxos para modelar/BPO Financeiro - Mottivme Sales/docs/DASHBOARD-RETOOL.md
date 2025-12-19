# 📊 Dashboard Financeiro Mottivme Sales - Retool

Guia completo para criar o dashboard financeiro no Retool conectado ao Supabase.

## 🚀 PASSO 1: Configurar Retool (5 min)

### 1.1 Criar Conta
1. Acesse: https://retool.com/
2. Clique em "Start building for free"
3. Use seu email corporativo
4. Escolha "Cloud" (não precisa self-hosted)

### 1.2 Conectar ao Supabase
1. No Retool, vá em **Resources** (menu lateral)
2. Clique em **Create New** > **PostgreSQL**
3. Preencha com os dados do Supabase:

```
Nome: Supabase Mottivme Sales
Host: db.xbqxivqzetaoptuyykmx.supabase.co
Port: 5432
Database name: postgres
Username: postgres
Password: [sua senha do Supabase]
```

4. Marque **✓ Connect using SSL**
5. Clique em **Test Connection**
6. Se funcionar, clique em **Create resource**

---

## 📱 PASSO 2: Criar App (3 min)

1. Clique em **Apps** > **Create New** > **App**
2. Nome: `Dashboard Financeiro Mottivme`
3. Template: **Blank app**
4. Clique em **Create**

---

## 🎨 PASSO 3: Página 1 - Visão Geral

### Layout Sugerido:
```
┌─────────────────────────────────────────┐
│  [Logo]   Dashboard Financeiro Mottivme │
├───────────┬───────────┬─────────────────┤
│ 💰 Saldo  │ 📈 Receitas│ 📉 Despesas    │
│ R$ XXX    │ R$ XXX     │ R$ XXX         │
├───────────┴───────────┴─────────────────┤
│  Gráfico: Receitas vs Despesas (6 meses)│
│                                          │
├──────────────────────────────────────────┤
│  Tabela: Próximos Vencimentos (7 dias)  │
└──────────────────────────────────────────┘
```

### 3.1 Criar Queries

**Query 1: Saldo Total das Contas**
```sql
-- Nome: query_saldo_total
SELECT
  SUM(saldo_atual) as saldo_total
FROM contas_bancarias
WHERE ativo = true;
```

**Query 2: Receitas do Mês**
```sql
-- Nome: query_receitas_mes
SELECT
  COALESCE(SUM(valor), 0) as total_receitas
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND status = 'pago'
  AND DATE_TRUNC('month', data_pagamento) = DATE_TRUNC('month', CURRENT_DATE);
```

**Query 3: Despesas do Mês**
```sql
-- Nome: query_despesas_mes
SELECT
  COALESCE(SUM(valor), 0) as total_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND status = 'pago'
  AND DATE_TRUNC('month', data_pagamento) = DATE_TRUNC('month', CURRENT_DATE);
```

**Query 4: Tendência Mensal (6 meses)**
```sql
-- Nome: query_tendencia_6meses
SELECT
  DATE_TRUNC('month', data_pagamento) as mes,
  tipo,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE status = 'pago'
  AND data_pagamento >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', data_pagamento), tipo
ORDER BY mes;
```

**Query 5: Próximos Vencimentos (7 dias)**
```sql
-- Nome: query_proximos_vencimentos
SELECT
  mf.descricao,
  cf.nome as cliente_fornecedor,
  mf.data_vencimento,
  mf.valor,
  mf.tipo,
  EXTRACT(DAY FROM mf.data_vencimento - CURRENT_DATE) as dias_restantes
FROM movimentacoes_financeiras mf
LEFT JOIN clientes_fornecedores cf ON mf.cliente_fornecedor_id = cf.id
WHERE mf.status = 'pendente'
  AND mf.data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY mf.data_vencimento;
```

### 3.2 Adicionar Componentes

#### Cards de Resumo (Topo)

**Card 1: Saldo Total**
1. Arraste **Statistic** do menu de componentes
2. Configure:
   - Label: "Saldo Total"
   - Value: `{{ query_saldo_total.data[0].saldo_total }}`
   - Format: Currency (BRL)
   - Prefix: "💰"

**Card 2: Receitas do Mês**
1. Arraste outro **Statistic**
2. Configure:
   - Label: "Receitas (Mês Atual)"
   - Value: `{{ query_receitas_mes.data[0].total_receitas }}`
   - Format: Currency (BRL)
   - Color: Green
   - Prefix: "📈"

**Card 3: Despesas do Mês**
1. Arraste outro **Statistic**
2. Configure:
   - Label: "Despesas (Mês Atual)"
   - Value: `{{ query_despesas_mes.data[0].total_despesas }}`
   - Format: Currency (BRL)
   - Color: Red
   - Prefix: "📉"

#### Gráfico de Tendência

1. Arraste **Chart** do menu
2. Configure:
   - Chart type: **Line Chart**
   - Data source: `{{ query_tendencia_6meses.data }}`
   - X-axis: `mes`
   - Y-axis: `total`
   - Group by: `tipo`
   - Title: "Receitas vs Despesas - Últimos 6 Meses"
   - Colors:
     - receita: Green
     - despesa: Red

#### Tabela de Vencimentos

1. Arraste **Table** do menu
2. Configure:
   - Data source: `{{ query_proximos_vencimentos.data }}`
   - Columns:
     - descricao (Descrição)
     - cliente_fornecedor (Cliente/Fornecedor)
     - data_vencimento (Vencimento) - format: Date
     - valor (Valor) - format: Currency (BRL)
     - dias_restantes (Dias) - format: Number
   - Title: "Próximos Vencimentos (7 dias)"
   - Row colors:
     - Vermelho se `dias_restantes < 3`
     - Amarelo se `dias_restantes >= 3 && dias_restantes <= 5`

---

## 🎨 PASSO 4: Página 2 - Fluxo de Caixa

### 4.1 Criar Nova Página
1. Clique em **Pages** (menu superior direito)
2. **Add Page** > Nome: "Fluxo de Caixa"

### 4.2 Queries para Fluxo de Caixa

**Query 6: Receitas por Categoria**
```sql
-- Nome: query_receitas_categoria
SELECT
  c.nome as categoria,
  COUNT(*) as qtd_movimentacoes,
  SUM(mf.valor) as total
FROM movimentacoes_financeiras mf
JOIN categorias c ON mf.categoria_id = c.id
WHERE mf.tipo = 'receita'
  AND mf.status = 'pago'
  AND DATE_TRUNC('month', mf.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC;
```

**Query 7: Despesas por Categoria**
```sql
-- Nome: query_despesas_categoria
SELECT
  c.nome as categoria,
  COUNT(*) as qtd_movimentacoes,
  SUM(mf.valor) as total
FROM movimentacoes_financeiras mf
JOIN categorias c ON mf.categoria_id = c.id
WHERE mf.tipo = 'despesa'
  AND mf.status = 'pago'
  AND DATE_TRUNC('month', mf.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC;
```

**Query 8: Previsão 30 Dias**
```sql
-- Nome: query_previsao_30dias
SELECT
  tipo,
  status,
  COUNT(*) as quantidade,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY tipo, status
ORDER BY tipo, status;
```

**Query 9: Contas a Receber vs Contas a Pagar**
```sql
-- Nome: query_contas_receber_pagar
SELECT
  DATE(data_vencimento) as data,
  tipo,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE status = 'pendente'
  AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY DATE(data_vencimento), tipo
ORDER BY data;
```

### 4.3 Componentes Página 2

**Gráfico Pizza: Receitas por Categoria**
- Component: **Chart**
- Type: **Pie Chart**
- Data: `{{ query_receitas_categoria.data }}`
- Labels: `categoria`
- Values: `total`
- Title: "Receitas por Categoria (Mês Atual)"

**Gráfico Pizza: Despesas por Categoria**
- Component: **Chart**
- Type: **Pie Chart**
- Data: `{{ query_despesas_categoria.data }}`
- Labels: `categoria`
- Values: `total`
- Title: "Despesas por Categoria (Mês Atual)"

**Gráfico Linha: Contas a Receber vs Pagar**
- Component: **Chart**
- Type: **Line Chart**
- Data: `{{ query_contas_receber_pagar.data }}`
- X-axis: `data`
- Y-axis: `total`
- Group by: `tipo`
- Title: "Previsão: Contas a Receber vs Contas a Pagar (30 dias)"

**Tabela: Previsão Resumida**
- Component: **Table**
- Data: `{{ query_previsao_30dias.data }}`
- Title: "Resumo Previsão 30 Dias"

---

## 🚨 PASSO 5: Página 3 - Alertas

### 5.1 Criar Nova Página
1. **Add Page** > Nome: "Alertas"

### 5.2 Queries de Alertas

**Query 10: Títulos Vencidos**
```sql
-- Nome: query_titulos_vencidos
SELECT
  mf.descricao,
  cf.nome as cliente_fornecedor,
  mf.data_vencimento,
  mf.valor,
  mf.tipo,
  EXTRACT(DAY FROM CURRENT_DATE - mf.data_vencimento) as dias_atraso
FROM movimentacoes_financeiras mf
LEFT JOIN clientes_fornecedores cf ON mf.cliente_fornecedor_id = cf.id
WHERE mf.status = 'pendente'
  AND mf.data_vencimento < CURRENT_DATE
ORDER BY mf.data_vencimento;
```

**Query 11: Inadimplência por Cliente**
```sql
-- Nome: query_inadimplencia_cliente
SELECT
  cf.nome as cliente,
  COUNT(*) as qtd_titulos_vencidos,
  SUM(mf.valor) as total_inadimplente,
  MIN(mf.data_vencimento) as vencimento_mais_antigo,
  EXTRACT(DAY FROM CURRENT_DATE - MIN(mf.data_vencimento)) as dias_max_atraso
FROM movimentacoes_financeiras mf
JOIN clientes_fornecedores cf ON mf.cliente_fornecedor_id = cf.id
WHERE mf.tipo = 'receita'
  AND mf.status = 'pendente'
  AND mf.data_vencimento < CURRENT_DATE
GROUP BY cf.nome
ORDER BY total_inadimplente DESC
LIMIT 10;
```

**Query 12: Taxa de Inadimplência**
```sql
-- Nome: query_taxa_inadimplencia
SELECT
  COUNT(*) FILTER (WHERE data_vencimento < CURRENT_DATE AND status = 'pendente') as vencidos,
  COUNT(*) FILTER (WHERE status = 'pendente') as pendentes_total,
  SUM(valor) FILTER (WHERE data_vencimento < CURRENT_DATE AND status = 'pendente') as valor_vencido,
  SUM(valor) FILTER (WHERE status = 'pendente') as valor_pendente_total,
  ROUND(
    COUNT(*) FILTER (WHERE data_vencimento < CURRENT_DATE AND status = 'pendente')::numeric * 100 /
    NULLIF(COUNT(*) FILTER (WHERE status = 'pendente'), 0),
    2
  ) as taxa_inadimplencia_pct
FROM movimentacoes_financeiras
WHERE tipo = 'receita';
```

### 5.3 Componentes Página 3

**Card: Taxa de Inadimplência**
- Component: **Statistic**
- Value: `{{ query_taxa_inadimplencia.data[0].taxa_inadimplencia_pct }}%`
- Label: "Taxa de Inadimplência"
- Color: Red se > 10%, Yellow se 5-10%, Green se < 5%

**Tabela: Títulos Vencidos**
- Component: **Table**
- Data: `{{ query_titulos_vencidos.data }}`
- Row color: Red
- Sortable: Yes
- Filterable: Yes

**Tabela: Top 10 Clientes Inadimplentes**
- Component: **Table**
- Data: `{{ query_inadimplencia_cliente.data }}`
- Title: "Top 10 Clientes Inadimplentes"
- Highlight: Total > R$ 1.000 em vermelho forte

---

## 🎨 PASSO 6: Customização Visual

### 6.1 Tema
1. Vá em **Settings** (engrenagem no topo)
2. **Appearance** > **Primary color**: `#1E40AF` (azul corporativo)
3. **Success color**: `#059669` (verde)
4. **Error color**: `#DC2626` (vermelho)

### 6.2 Logo
1. Adicione **Image** no header
2. URL: [sua logo da Mottivme]
3. Tamanho: 150x50px

### 6.3 Navegação
1. Adicione **Tabs** component no topo
2. Tabs:
   - Visão Geral
   - Fluxo de Caixa
   - Alertas

---

## 🔄 PASSO 7: Auto-Refresh (Opcional)

Para atualizar dados automaticamente:

1. Selecione cada query
2. Em **Advanced** > **Run this query periodically**
3. Interval: `300000` (5 minutos)

---

## 📤 PASSO 8: Compartilhar

### 8.1 Publicar App
1. Clique em **Release** (topo direito)
2. Escreva: "Versão 1.0 - Dashboard inicial"
3. Clique em **Release to production**

### 8.2 Dar Acesso
1. Clique em **Share** (topo direito)
2. Adicione emails da equipe
3. Permissões:
   - View only (só visualizar)
   - Edit (pode editar dashboard)

### 8.3 Criar Link Público (Opcional)
1. **Share** > **Public link**
2. Marque **Enable public access**
3. Copie o link

---

## 🎯 PRÓXIMOS PASSOS

Após criar o dashboard básico:

1. **Adicionar Filtros**
   - Por período (últimos 7 dias, 30 dias, 6 meses)
   - Por conta bancária
   - Por categoria

2. **Adicionar Ações**
   - Botão para marcar como pago
   - Botão para enviar lembrete (integra com n8n)
   - Download de relatórios em PDF/Excel

3. **Alertas Automáticos**
   - Integrar com n8n para enviar WhatsApp/Email
   - Notificações quando inadimplência > 10%

---

## 🆘 PROBLEMAS COMUNS

### Erro de Conexão Supabase
- Verifique se o IP do Retool está na whitelist do Supabase
- Vá em Supabase > Settings > Database > Connection pooling
- Adicione: `retool.com` na lista de IPs permitidos

### Queries Lentas
- Adicione índices no Supabase:
```sql
CREATE INDEX idx_mov_data_vencimento ON movimentacoes_financeiras(data_vencimento);
CREATE INDEX idx_mov_status ON movimentacoes_financeiras(status);
CREATE INDEX idx_mov_tipo ON movimentacoes_financeiras(tipo);
```

### Dados Não Aparecem
- Verifique se as queries retornam dados no console SQL
- Execute manualmente no Supabase SQL Editor

---

## 📞 SUPORTE

- Retool Docs: https://docs.retool.com/
- Supabase Docs: https://supabase.com/docs
- Comunidade: https://community.retool.com/

---

**Tempo estimado total: 30-40 minutos**

Boa sorte! 🚀

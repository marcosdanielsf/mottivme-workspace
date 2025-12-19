-- ========================================
-- QUERIES PARA DASHBOARD RETOOL
-- Mottivme Sales - Dashboard Financeiro
-- ========================================

-- ========================================
-- PÁGINA 1: VISÃO GERAL
-- ========================================

-- Query 1: Saldo Total das Contas
-- Nome no Retool: query_saldo_total
SELECT
  SUM(saldo_atual) as saldo_total
FROM contas_bancarias
WHERE ativo = true;


-- Query 2: Receitas do Mês
-- Nome no Retool: query_receitas_mes
SELECT
  COALESCE(SUM(valor), 0) as total_receitas
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND status = 'pago'
  AND DATE_TRUNC('month', data_pagamento) = DATE_TRUNC('month', CURRENT_DATE);


-- Query 3: Despesas do Mês
-- Nome no Retool: query_despesas_mes
SELECT
  COALESCE(SUM(valor), 0) as total_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND status = 'pago'
  AND DATE_TRUNC('month', data_pagamento) = DATE_TRUNC('month', CURRENT_DATE);


-- Query 4: Tendência Mensal (6 meses)
-- Nome no Retool: query_tendencia_6meses
SELECT
  DATE_TRUNC('month', data_pagamento) as mes,
  tipo,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE status = 'pago'
  AND data_pagamento >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', data_pagamento), tipo
ORDER BY mes;


-- Query 5: Próximos Vencimentos (7 dias)
-- Nome no Retool: query_proximos_vencimentos
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


-- ========================================
-- PÁGINA 2: FLUXO DE CAIXA
-- ========================================

-- Query 6: Receitas por Categoria
-- Nome no Retool: query_receitas_categoria
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


-- Query 7: Despesas por Categoria
-- Nome no Retool: query_despesas_categoria
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


-- Query 8: Previsão 30 Dias
-- Nome no Retool: query_previsao_30dias
SELECT
  tipo,
  status,
  COUNT(*) as quantidade,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY tipo, status
ORDER BY tipo, status;


-- Query 9: Contas a Receber vs Contas a Pagar
-- Nome no Retool: query_contas_receber_pagar
SELECT
  DATE(data_vencimento) as data,
  tipo,
  SUM(valor) as total
FROM movimentacoes_financeiras
WHERE status = 'pendente'
  AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY DATE(data_vencimento), tipo
ORDER BY data;


-- ========================================
-- PÁGINA 3: ALERTAS
-- ========================================

-- Query 10: Títulos Vencidos
-- Nome no Retool: query_titulos_vencidos
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


-- Query 11: Inadimplência por Cliente
-- Nome no Retool: query_inadimplencia_cliente
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


-- Query 12: Taxa de Inadimplência
-- Nome no Retool: query_taxa_inadimplencia
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


-- ========================================
-- ÍNDICES RECOMENDADOS PARA PERFORMANCE
-- ========================================
-- Execute estas queries no Supabase SQL Editor
-- para melhorar a performance do dashboard

CREATE INDEX IF NOT EXISTS idx_mov_data_vencimento
  ON movimentacoes_financeiras(data_vencimento);

CREATE INDEX IF NOT EXISTS idx_mov_data_pagamento
  ON movimentacoes_financeiras(data_pagamento);

CREATE INDEX IF NOT EXISTS idx_mov_status
  ON movimentacoes_financeiras(status);

CREATE INDEX IF NOT EXISTS idx_mov_tipo
  ON movimentacoes_financeiras(tipo);

CREATE INDEX IF NOT EXISTS idx_mov_categoria
  ON movimentacoes_financeiras(categoria_id);

CREATE INDEX IF NOT EXISTS idx_mov_cliente_fornecedor
  ON movimentacoes_financeiras(cliente_fornecedor_id);

CREATE INDEX IF NOT EXISTS idx_contas_ativo
  ON contas_bancarias(ativo);


-- ========================================
-- QUERIES EXTRAS (OPCIONAL)
-- ========================================

-- Query Extra 1: Movimentações Recentes
-- Nome no Retool: query_movimentacoes_recentes
SELECT
  mf.descricao,
  cf.nome as cliente_fornecedor,
  c.nome as categoria,
  cb.nome as conta,
  mf.data_vencimento,
  mf.valor,
  mf.tipo,
  mf.status
FROM movimentacoes_financeiras mf
LEFT JOIN clientes_fornecedores cf ON mf.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON mf.categoria_id = c.id
LEFT JOIN contas_bancarias cb ON mf.conta_bancaria_id = cb.id
ORDER BY mf.created_at DESC
LIMIT 50;


-- Query Extra 2: Resumo por Conta Bancária
-- Nome no Retool: query_resumo_por_conta
SELECT
  cb.nome as conta,
  cb.banco,
  cb.saldo_atual,
  COUNT(mf.id) as qtd_movimentacoes,
  SUM(CASE WHEN mf.tipo = 'receita' THEN mf.valor ELSE 0 END) as total_receitas,
  SUM(CASE WHEN mf.tipo = 'despesa' THEN mf.valor ELSE 0 END) as total_despesas
FROM contas_bancarias cb
LEFT JOIN movimentacoes_financeiras mf ON cb.id = mf.conta_bancaria_id
WHERE cb.ativo = true
  AND (mf.data_pagamento IS NULL OR DATE_TRUNC('month', mf.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE))
GROUP BY cb.id, cb.nome, cb.banco, cb.saldo_atual
ORDER BY cb.saldo_atual DESC;


-- Query Extra 3: Top 10 Categorias de Despesa
-- Nome no Retool: query_top_categorias_despesa
SELECT
  c.nome as categoria,
  COUNT(*) as quantidade,
  SUM(mf.valor) as total,
  AVG(mf.valor) as media
FROM movimentacoes_financeiras mf
JOIN categorias c ON mf.categoria_id = c.id
WHERE mf.tipo = 'despesa'
  AND mf.status = 'pago'
  AND DATE_TRUNC('month', mf.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC
LIMIT 10;

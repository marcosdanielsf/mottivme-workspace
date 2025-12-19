-- ========================================
-- VIEWS FALTANTES PARA O DASHBOARD
-- Execute este SQL no Supabase para corrigir os KPIs
-- ========================================

-- Primeiro, deletar as views se existirem (para evitar conflitos de estrutura)
DROP VIEW IF EXISTS vw_dashboard_vencimentos_proximos CASCADE;
DROP VIEW IF EXISTS vw_dashboard_faturamento_detalhado CASCADE;
DROP VIEW IF EXISTS vw_dashboard_despesas_detalhado CASCADE;
DROP VIEW IF EXISTS vw_dashboard_despesas_pf_pj CASCADE;
DROP VIEW IF EXISTS vw_dashboard_inadimplencia_status CASCADE;

-- 1. VENCIMENTOS PRÓXIMOS (7 dias)
-- Usado em: Overview page (linha 23)
CREATE OR REPLACE VIEW vw_dashboard_vencimentos_proximos AS
SELECT
    m.id,
    m.descricao,
    COALESCE(m.valor_realizado, m.valor_previsto) as valor,
    m.data_vencimento,
    CASE
        WHEN m.quitado = true THEN 'pago'
        WHEN m.data_vencimento < CURRENT_DATE THEN 'vencido'
        ELSE 'pendente'
    END as status_pagamento,
    m.tipo as tipo_movimentacao,
    cf.nome as cliente_fornecedor,
    c.nome as categoria,
    (m.data_vencimento - CURRENT_DATE)::INTEGER as dias_ate_vencimento
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.quitado = false
    AND m.data_vencimento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
ORDER BY m.data_vencimento ASC;

-- 2. FATURAMENTO DETALHADO
-- Usado em: Faturamento page (linha 27)
CREATE OR REPLACE VIEW vw_dashboard_faturamento_detalhado AS
SELECT
    m.id,
    m.descricao,
    COALESCE(m.valor_realizado, m.valor_previsto) as valor,
    m.data_vencimento,
    m.data_realizado as data_pagamento,
    CASE
        WHEN m.quitado = true THEN 'pago'
        WHEN m.data_vencimento < CURRENT_DATE THEN 'vencido'
        ELSE 'pendente'
    END as status_pagamento,
    cf.nome as cliente,
    c.nome as categoria,
    cb.nome as conta_bancaria,
    CASE
        WHEN m.quitado = true THEN 'Realizado'
        WHEN m.data_vencimento < CURRENT_DATE THEN 'Vencido'
        ELSE 'Pendente'
    END as situacao
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
LEFT JOIN contas_bancarias cb ON m.conta_bancaria_id = cb.id
WHERE m.tipo = 'receita'
ORDER BY m.data_vencimento DESC;

-- 3. DESPESAS DETALHADO
-- Usado em: Despesas page (linha 26)
CREATE OR REPLACE VIEW vw_dashboard_despesas_detalhado AS
SELECT
    m.id,
    m.descricao,
    COALESCE(m.valor_realizado, m.valor_previsto) as valor,
    m.data_vencimento,
    m.data_realizado as data_pagamento,
    CASE
        WHEN m.quitado = true THEN 'pago'
        WHEN m.data_vencimento < CURRENT_DATE THEN 'vencido'
        ELSE 'pendente'
    END as status_pagamento,
    m.tipo_entidade as tipo_pf_pj,
    cf.nome as fornecedor,
    c.nome as categoria,
    cb.nome as conta_bancaria,
    CASE
        WHEN m.quitado = true THEN 'Pago'
        WHEN m.data_vencimento < CURRENT_DATE THEN 'Vencido'
        ELSE 'Pendente'
    END as situacao
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
LEFT JOIN contas_bancarias cb ON m.conta_bancaria_id = cb.id
WHERE m.tipo = 'despesa'
ORDER BY m.data_vencimento DESC;

-- 4. DESPESAS PF vs PJ
-- Usado em: Despesas page (linha 22)
CREATE OR REPLACE VIEW vw_dashboard_despesas_pf_pj AS
SELECT
    COALESCE(m.tipo_entidade, 'NÃO INFORMADO') as tipo,
    SUM(COALESCE(m.valor_realizado, m.valor_previsto)) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
WHERE m.tipo = 'despesa'
    AND EXTRACT(MONTH FROM m.data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM m.data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY m.tipo_entidade;

-- 5. INADIMPLÊNCIA POR STATUS
-- Usado em: Inadimplência page (linha 16)
CREATE OR REPLACE VIEW vw_dashboard_inadimplencia_status AS
SELECT
    COALESCE(i.status_cobranca, 'inadimplente') as status_cobranca,
    COUNT(DISTINCT m.id) as quantidade,
    SUM(COALESCE(m.valor_realizado, m.valor_previsto)) as total,
    AVG(i.dias_atraso)::INTEGER as media_dias_atraso
FROM movimentacoes_financeiras m
LEFT JOIN inadimplencias i ON m.id = i.movimentacao_id
WHERE m.quitado = false
    AND m.data_vencimento < CURRENT_DATE
GROUP BY i.status_cobranca
ORDER BY total DESC;

-- ========================================
-- VERIFICAÇÃO DAS VIEWS
-- ========================================

-- Teste rápido para verificar se as views estão funcionando
-- Descomente as linhas abaixo para testar cada view:

-- SELECT COUNT(*) as total_vencimentos_proximos FROM vw_dashboard_vencimentos_proximos;
-- SELECT COUNT(*) as total_receitas FROM vw_dashboard_faturamento_detalhado;
-- SELECT COUNT(*) as total_despesas FROM vw_dashboard_despesas_detalhado;
-- SELECT * FROM vw_dashboard_despesas_pf_pj;
-- SELECT * FROM vw_dashboard_inadimplencia_status;

-- ========================================
-- FIM
-- ========================================

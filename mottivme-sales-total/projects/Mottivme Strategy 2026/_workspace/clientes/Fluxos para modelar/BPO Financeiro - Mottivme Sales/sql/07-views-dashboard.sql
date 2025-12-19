-- ===================================
-- VIEWS PARA DASHBOARD - SQL PURO
-- Sem templates, apenas PostgreSQL
-- ===================================

-- ===================================
-- VIEWS - OVERVIEW
-- ===================================

-- View: KPIs Overview
CREATE OR REPLACE VIEW vw_dashboard_overview_kpis AS
WITH receitas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
despesas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
saldo AS (
    SELECT COALESCE(SUM(saldo_atual), 0) as total
    FROM contas_bancarias
    WHERE ativo = true
)
SELECT
    r.total as faturamento_total,
    d.total as despesas_total,
    (r.total - d.total) as lucro_total,
    CASE
        WHEN r.total = 0 THEN 0
        ELSE ROUND(((r.total - d.total) / r.total * 100)::numeric, 2)
    END as percentual_lucro,
    s.total as saldo_atual
FROM receitas r, despesas d, saldo s;

-- View: Faturamento X Despesas Por Mês
CREATE OR REPLACE VIEW vw_dashboard_fluxo_caixa_mensal AS
WITH meses AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        tipo,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
      AND data_competencia <= CURRENT_DATE
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia), tipo
)
SELECT
    mes,
    mes_num,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) as faturamento,
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as despesa,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) -
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as lucro
FROM meses
GROUP BY mes, mes_num
ORDER BY mes_num;

-- View: Faturamento por Categoria
CREATE OR REPLACE VIEW vw_dashboard_faturamento_categoria AS
SELECT
    COALESCE(c.nome, 'Sem Categoria') as categoria,
    SUM(m.valor_previsto) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'receita'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC
LIMIT 10;

-- View: Faturamento por Cliente
CREATE OR REPLACE VIEW vw_dashboard_faturamento_cliente AS
SELECT
    COALESCE(cf.nome, 'Sem Cliente') as cliente,
    SUM(m.valor_previsto) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY cf.nome
ORDER BY total DESC
LIMIT 20;

-- View: Despesas por Categoria
CREATE OR REPLACE VIEW vw_dashboard_despesas_categoria AS
SELECT
    COALESCE(c.nome, 'Sem Categoria') as categoria,
    SUM(m.valor_previsto) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC
LIMIT 15;

-- ===================================
-- VIEWS - FATURAMENTO
-- ===================================

-- View: KPIs Faturamento
CREATE OR REPLACE VIEW vw_dashboard_faturamento_kpis AS
WITH faturamento AS (
    SELECT
        COALESCE(SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END), 0) as total,
        COUNT(*) FILTER (WHERE quitado = true) as qtd_recebimentos,
        COUNT(DISTINCT cliente_fornecedor_id) as qtd_clientes
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
media_mensal AS (
    SELECT
        ROUND(AVG(total_mes)::numeric, 2) as media_faturamento
    FROM (
        SELECT
            TO_CHAR(data_competencia, 'YYYY-MM') as mes,
            SUM(valor_previsto) as total_mes
        FROM movimentacoes_financeiras
        WHERE tipo = 'receita'
          AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
        GROUP BY TO_CHAR(data_competencia, 'YYYY-MM')
    ) meses
)
SELECT
    f.total as faturamento_total,
    f.qtd_recebimentos,
    f.qtd_clientes,
    CASE
        WHEN f.qtd_recebimentos = 0 THEN 0
        ELSE ROUND((f.total / f.qtd_recebimentos)::numeric, 2)
    END as ticket_medio,
    m.media_faturamento as media_mensal
FROM faturamento f, media_mensal m;

-- View: Faturamento por Mês
CREATE OR REPLACE VIEW vw_dashboard_faturamento_mensal AS
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total_faturamento
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- View: Crescimento de Faturamento
CREATE OR REPLACE VIEW vw_dashboard_faturamento_crescimento AS
WITH faturamento_mensal AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
),
crescimento AS (
    SELECT
        mes,
        mes_num,
        total,
        LAG(total) OVER (ORDER BY mes_num) as mes_anterior
    FROM faturamento_mensal
)
SELECT
    mes,
    mes_num,
    total,
    CASE
        WHEN mes_anterior IS NULL OR mes_anterior = 0 THEN 0
        ELSE ROUND(((total - mes_anterior) / mes_anterior * 100)::numeric, 2)
    END as percentual_crescimento
FROM crescimento
ORDER BY mes_num;

-- View: Clientes por Mês
CREATE OR REPLACE VIEW vw_dashboard_clientes_mensal AS
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    COUNT(DISTINCT cliente_fornecedor_id) as quantidade_clientes
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- ===================================
-- VIEWS - DESPESAS
-- ===================================

-- View: KPIs Despesas
CREATE OR REPLACE VIEW vw_dashboard_despesas_kpis AS
WITH despesas AS (
    SELECT
        COALESCE(SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END), 0) as total,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
receitas AS (
    SELECT COALESCE(SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
)
SELECT
    d.total as despesas_total,
    d.quantidade as qtd_despesas,
    CASE
        WHEN d.quantidade = 0 THEN 0
        ELSE ROUND((d.total / d.quantidade)::numeric, 2)
    END as media_despesas,
    (r.total - d.total) as lucro_total,
    CASE
        WHEN r.total = 0 THEN 0
        ELSE ROUND(((r.total - d.total) / r.total * 100)::numeric, 2)
    END as percentual_lucro
FROM despesas d, receitas r;

-- View: Despesas por Mês
CREATE OR REPLACE VIEW vw_dashboard_despesas_mensal AS
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- View: Variação de Despesas
CREATE OR REPLACE VIEW vw_dashboard_despesas_variacao AS
WITH despesas_mensal AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
),
variacao AS (
    SELECT
        mes,
        mes_num,
        total,
        LAG(total) OVER (ORDER BY mes_num) as mes_anterior
    FROM despesas_mensal
)
SELECT
    mes,
    mes_num,
    total,
    CASE
        WHEN mes_anterior IS NULL OR mes_anterior = 0 THEN 0
        ELSE ROUND(((total - mes_anterior) / mes_anterior * 100)::numeric, 2)
    END as percentual_variacao
FROM variacao
ORDER BY mes_num;

-- View: Despesas por Centro de Custo
CREATE OR REPLACE VIEW vw_dashboard_despesas_centro_custo AS
SELECT
    COALESCE(departamento, '(Em branco)') as centro_custo,
    SUM(valor_previsto) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY departamento
ORDER BY total DESC;

-- View: Despesas por Fornecedor
CREATE OR REPLACE VIEW vw_dashboard_despesas_fornecedor AS
SELECT
    COALESCE(cf.nome, 'Sem Fornecedor') as fornecedor,
    SUM(m.valor_previsto) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY cf.nome
ORDER BY total DESC
LIMIT 20;

-- ===================================
-- VIEWS - INADIMPLÊNCIA
-- ===================================

-- View: KPIs Inadimplência
CREATE OR REPLACE VIEW vw_dashboard_inadimplencia_kpis AS
WITH inadimplencia AS (
    SELECT
        COUNT(*) as faturas_em_aberto,
        COALESCE(SUM(valor_previsto), 0) as valor_em_aberto,
        COUNT(DISTINCT cliente_fornecedor_id) as qtd_clientes
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND quitado = false
      AND data_vencimento < CURRENT_DATE
),
faturamento_anual AS (
    SELECT COALESCE(SUM(valor_previsto), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
)
SELECT
    i.faturas_em_aberto,
    i.valor_em_aberto,
    i.qtd_clientes,
    CASE
        WHEN f.total = 0 THEN 0
        ELSE ROUND((i.valor_em_aberto / f.total * 100)::numeric, 2)
    END as percentual_inadimplencia
FROM inadimplencia i, faturamento_anual f;

-- View: Débitos em Aberto por Mês
CREATE OR REPLACE VIEW vw_dashboard_inadimplencia_debitos_mes AS
SELECT
    TO_CHAR(data_vencimento, 'Mon') as mes,
    EXTRACT(MONTH FROM data_vencimento) as mes_num,
    SUM(valor_previsto) as total_debitos,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = false
  AND data_vencimento < CURRENT_DATE
GROUP BY TO_CHAR(data_vencimento, 'Mon'), EXTRACT(MONTH FROM data_vencimento)
ORDER BY mes_num;

-- View: Clientes Inadimplentes Detalhado
CREATE OR REPLACE VIEW vw_dashboard_inadimplentes_detalhado AS
SELECT
    cf.nome as cliente,
    m.data_vencimento,
    (CURRENT_DATE - m.data_vencimento)::INTEGER as dias_atraso,
    m.parcela_numero as parcela_atraso,
    m.parcelas_total as total_parcelas,
    m.valor_previsto as valor_pagar,
    COALESCE((
        SELECT SUM(valor_realizado)
        FROM movimentacoes_financeiras m2
        WHERE m2.cliente_fornecedor_id = m.cliente_fornecedor_id
          AND m2.quitado = true
          AND m2.tipo = 'receita'
    ), 0) as ja_pago
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
  AND m.quitado = false
  AND m.data_vencimento < CURRENT_DATE
ORDER BY dias_atraso DESC, valor_pagar DESC;

-- ===================================
-- FUNÇÕES AUXILIARES PARA API
-- ===================================

-- Função: Simular Faturamento/Despesa
CREATE OR REPLACE FUNCTION fn_simular_fluxo_caixa(
    p_percentual_faturamento DECIMAL DEFAULT 0,
    p_percentual_despesa DECIMAL DEFAULT 0,
    p_meses_futuro INTEGER DEFAULT 6
)
RETURNS TABLE (
    mes TEXT,
    mes_num INTEGER,
    faturamento_original DECIMAL,
    despesa_original DECIMAL,
    faturamento_simulado DECIMAL,
    despesa_simulada DECIMAL,
    lucro_original DECIMAL,
    lucro_simulado DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH meses_futuros AS (
        SELECT
            TO_CHAR(data_competencia, 'Mon') as mes,
            EXTRACT(MONTH FROM data_competencia)::INTEGER as mes_num,
            tipo,
            SUM(valor_previsto) as total
        FROM movimentacoes_financeiras
        WHERE data_competencia >= CURRENT_DATE
          AND data_competencia <= CURRENT_DATE + (p_meses_futuro || ' months')::INTERVAL
        GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia), tipo
    )
    SELECT
        mf.mes,
        mf.mes_num,
        COALESCE(MAX(CASE WHEN mf.tipo = 'receita' THEN mf.total END), 0) as faturamento_original,
        COALESCE(MAX(CASE WHEN mf.tipo = 'despesa' THEN mf.total END), 0) as despesa_original,
        COALESCE(MAX(CASE WHEN mf.tipo = 'receita' THEN mf.total END), 0) * (1 + p_percentual_faturamento / 100) as faturamento_simulado,
        COALESCE(MAX(CASE WHEN mf.tipo = 'despesa' THEN mf.total END), 0) * (1 + p_percentual_despesa / 100) as despesa_simulada,
        COALESCE(MAX(CASE WHEN mf.tipo = 'receita' THEN mf.total END), 0) -
        COALESCE(MAX(CASE WHEN mf.tipo = 'despesa' THEN mf.total END), 0) as lucro_original,
        (COALESCE(MAX(CASE WHEN mf.tipo = 'receita' THEN mf.total END), 0) * (1 + p_percentual_faturamento / 100)) -
        (COALESCE(MAX(CASE WHEN mf.tipo = 'despesa' THEN mf.total END), 0) * (1 + p_percentual_despesa / 100)) as lucro_simulado
    FROM meses_futuros mf
    GROUP BY mf.mes, mf.mes_num
    ORDER BY mf.mes_num;
END;
$$ LANGUAGE plpgsql;

-- Comentários nas views
COMMENT ON VIEW vw_dashboard_overview_kpis IS 'KPIs principais do dashboard (Overview)';
COMMENT ON VIEW vw_dashboard_fluxo_caixa_mensal IS 'Fluxo de caixa mensal (receitas vs despesas)';
COMMENT ON VIEW vw_dashboard_faturamento_categoria IS 'Faturamento agrupado por categoria';
COMMENT ON VIEW vw_dashboard_faturamento_cliente IS 'Top 20 clientes por faturamento';
COMMENT ON VIEW vw_dashboard_despesas_categoria IS 'Top 15 categorias de despesas';
COMMENT ON VIEW vw_dashboard_faturamento_kpis IS 'KPIs da página de faturamento';
COMMENT ON VIEW vw_dashboard_faturamento_mensal IS 'Faturamento mês a mês';
COMMENT ON VIEW vw_dashboard_faturamento_crescimento IS 'Crescimento percentual de faturamento';
COMMENT ON VIEW vw_dashboard_clientes_mensal IS 'Quantidade de clientes por mês';
COMMENT ON VIEW vw_dashboard_despesas_kpis IS 'KPIs da página de despesas';
COMMENT ON VIEW vw_dashboard_despesas_mensal IS 'Despesas mês a mês';
COMMENT ON VIEW vw_dashboard_despesas_variacao IS 'Variação percentual de despesas';
COMMENT ON VIEW vw_dashboard_despesas_centro_custo IS 'Despesas por centro de custo';
COMMENT ON VIEW vw_dashboard_despesas_fornecedor IS 'Top 20 fornecedores';
COMMENT ON VIEW vw_dashboard_inadimplencia_kpis IS 'KPIs de inadimplência';
COMMENT ON VIEW vw_dashboard_inadimplencia_debitos_mes IS 'Débitos em aberto por mês';
COMMENT ON VIEW vw_dashboard_inadimplentes_detalhado IS 'Lista detalhada de inadimplentes';

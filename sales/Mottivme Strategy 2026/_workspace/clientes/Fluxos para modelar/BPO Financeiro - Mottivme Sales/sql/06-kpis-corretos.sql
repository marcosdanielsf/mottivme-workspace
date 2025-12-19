-- ========================================
-- VIEWS DE KPIs CORRIGIDAS
-- Estas views retornam as colunas exatas que o dashboard Next.js espera
-- ========================================

-- Deletar views antigas de KPIs
DROP VIEW IF EXISTS vw_dashboard_overview_kpis CASCADE;
DROP VIEW IF EXISTS vw_dashboard_faturamento_kpis CASCADE;
DROP VIEW IF EXISTS vw_dashboard_despesas_kpis CASCADE;
DROP VIEW IF EXISTS vw_dashboard_inadimplencia_kpis CASCADE;

-- ========================================
-- 1. OVERVIEW KPIs
-- ========================================
-- Colunas esperadas: saldo_total, receitas_mes, despesas_mes, lucro_mes,
--                    inadimplencia_total, inadimplencia_quantidade,
--                    vencimentos_proximos_total, vencimentos_proximos_quantidade

CREATE OR REPLACE VIEW vw_dashboard_overview_kpis AS
WITH saldo AS (
    SELECT COALESCE(SUM(saldo_atual), 0) as total
    FROM contas_bancarias
    WHERE ativo = true
),
receitas_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
despesas_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
inadimplencia AS (
    SELECT
        COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE quitado = false
      AND data_vencimento < CURRENT_DATE
),
vencimentos_proximos AS (
    SELECT
        COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE quitado = false
      AND data_vencimento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
)
SELECT
    s.total as saldo_total,
    r.total as receitas_mes,
    d.total as despesas_mes,
    (r.total - d.total) as lucro_mes,
    i.total as inadimplencia_total,
    i.quantidade as inadimplencia_quantidade,
    v.total as vencimentos_proximos_total,
    v.quantidade as vencimentos_proximos_quantidade
FROM saldo s, receitas_mes r, despesas_mes d, inadimplencia i, vencimentos_proximos v;

-- ========================================
-- 2. FATURAMENTO KPIs
-- ========================================
-- Colunas esperadas: faturamento_mes, faturamento_realizado, a_receber, quantidade_pendentes

CREATE OR REPLACE VIEW vw_dashboard_faturamento_kpis AS
WITH faturamento_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
faturamento_realizado AS (
    SELECT COALESCE(SUM(valor_realizado), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND quitado = true
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
a_receber AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as total,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND quitado = false
)
SELECT
    fm.total as faturamento_mes,
    fr.total as faturamento_realizado,
    ar.total as a_receber,
    ar.quantidade as quantidade_pendentes
FROM faturamento_mes fm, faturamento_realizado fr, a_receber ar;

-- ========================================
-- 3. DESPESAS KPIs
-- ========================================
-- Colunas esperadas: despesas_mes, despesas_pagas, a_pagar, quantidade_pendentes

CREATE OR REPLACE VIEW vw_dashboard_despesas_kpis AS
WITH despesas_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
despesas_pagas AS (
    SELECT COALESCE(SUM(valor_realizado), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND quitado = true
      AND EXTRACT(MONTH FROM data_vencimento) = 10
      AND EXTRACT(YEAR FROM data_vencimento) = 2025
),
a_pagar AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as total,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND quitado = false
)
SELECT
    dm.total as despesas_mes,
    dp.total as despesas_pagas,
    ap.total as a_pagar,
    ap.quantidade as quantidade_pendentes
FROM despesas_mes dm, despesas_pagas dp, a_pagar ap;

-- ========================================
-- 4. INADIMPLÊNCIA KPIs
-- ========================================
-- Colunas esperadas: total_inadimplente, quantidade_inadimplentes,
--                    media_dias_atraso, maior_inadimplencia

CREATE OR REPLACE VIEW vw_dashboard_inadimplencia_kpis AS
WITH inadimplentes AS (
    SELECT
        m.id,
        COALESCE(m.valor_realizado, m.valor_previsto) as valor,
        COALESCE(i.dias_atraso, (CURRENT_DATE - m.data_vencimento)::INTEGER) as dias_atraso
    FROM movimentacoes_financeiras m
    LEFT JOIN inadimplencias i ON m.id = i.movimentacao_id
    WHERE m.quitado = false
      AND m.data_vencimento < CURRENT_DATE
)
SELECT
    COALESCE(SUM(valor), 0) as total_inadimplente,
    COUNT(*) as quantidade_inadimplentes,
    COALESCE(AVG(dias_atraso), 0)::INTEGER as media_dias_atraso,
    COALESCE(MAX(valor), 0) as maior_inadimplencia
FROM inadimplentes;

-- ========================================
-- VERIFICAÇÃO RÁPIDA
-- ========================================

-- Teste as views (descomente para testar):
-- SELECT * FROM vw_dashboard_overview_kpis;
-- SELECT * FROM vw_dashboard_faturamento_kpis;
-- SELECT * FROM vw_dashboard_despesas_kpis;
-- SELECT * FROM vw_dashboard_inadimplencia_kpis;

-- ========================================
-- FIM
-- ========================================

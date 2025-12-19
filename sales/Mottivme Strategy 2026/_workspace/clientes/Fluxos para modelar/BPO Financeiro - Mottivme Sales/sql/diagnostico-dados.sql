-- ========================================
-- DIAGNÓSTICO DE DADOS
-- Verifica onde estão os dados no banco
-- ========================================

-- 1. Verificar se há movimentações e em quais meses
SELECT
    TO_CHAR(data_competencia, 'YYYY-MM') as mes_competencia,
    TO_CHAR(data_vencimento, 'YYYY-MM') as mes_vencimento,
    tipo,
    COUNT(*) as quantidade,
    SUM(COALESCE(valor_realizado, valor_previsto)) as total
FROM movimentacoes_financeiras
GROUP BY TO_CHAR(data_competencia, 'YYYY-MM'), TO_CHAR(data_vencimento, 'YYYY-MM'), tipo
ORDER BY mes_competencia DESC, tipo;

-- 2. Verificar mês atual específico
SELECT
    'data_competencia' as campo_data,
    COUNT(*) as quantidade,
    SUM(COALESCE(valor_realizado, valor_previsto)) as total
FROM movimentacoes_financeiras
WHERE EXTRACT(MONTH FROM data_competencia) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM data_competencia) = EXTRACT(YEAR FROM CURRENT_DATE)
UNION ALL
SELECT
    'data_vencimento' as campo_data,
    COUNT(*) as quantidade,
    SUM(COALESCE(valor_realizado, valor_previsto)) as total
FROM movimentacoes_financeiras
WHERE EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE);

-- 3. Verificar qual coluna de data tem mais dados
SELECT
    'Tem data_competencia' as tipo,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras
WHERE data_competencia IS NOT NULL
UNION ALL
SELECT
    'Tem data_vencimento' as tipo,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras
WHERE data_vencimento IS NOT NULL;

-- ============================================
-- PASSO 6: VERIFICAÇÃO FINAL
-- Execute APÓS importar todas as movimentações
-- ============================================

-- 1. RESUMO GERAL
SELECT '=== RESUMO GERAL ===' as info;

SELECT
    tipo,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto,
    SUM(CASE WHEN quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as total_realizado,
    COUNT(CASE WHEN quitado THEN 1 END) as quitados,
    COUNT(CASE WHEN NOT quitado THEN 1 END) as pendentes
FROM movimentacoes_financeiras
GROUP BY tipo;


-- 2. DRE MENSAL (comparar com sua planilha)
SELECT '=== DRE MENSAL ===' as info;

SELECT
    EXTRACT(YEAR FROM data_vencimento)::int as ano,
    EXTRACT(MONTH FROM data_vencimento)::int as mes,
    SUM(CASE WHEN tipo = 'receita' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as receitas,
    SUM(CASE WHEN tipo = 'despesa' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as despesas,
    SUM(CASE WHEN tipo = 'receita' AND quitado THEN COALESCE(valor_realizado, valor_previsto)
             WHEN tipo = 'despesa' AND quitado THEN -COALESCE(valor_realizado, valor_previsto)
             ELSE 0 END) as resultado
FROM movimentacoes_financeiras
GROUP BY ano, mes
ORDER BY ano, mes;


-- 3. TOTAIS POR ANO
SELECT '=== TOTAIS POR ANO ===' as info;

SELECT
    EXTRACT(YEAR FROM data_vencimento)::int as ano,
    SUM(CASE WHEN tipo = 'receita' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as receitas,
    SUM(CASE WHEN tipo = 'despesa' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as despesas,
    SUM(CASE WHEN tipo = 'receita' AND quitado THEN COALESCE(valor_realizado, valor_previsto)
             WHEN tipo = 'despesa' AND quitado THEN -COALESCE(valor_realizado, valor_previsto)
             ELSE 0 END) as resultado
FROM movimentacoes_financeiras
GROUP BY ano
ORDER BY ano;


-- 4. CONTAGEM DE CLIENTES
SELECT '=== CLIENTES ===' as info;

SELECT
    COUNT(*) as total_clientes,
    COUNT(CASE WHEN tipo = 'pf' THEN 1 END) as pessoa_fisica,
    COUNT(CASE WHEN tipo = 'pj' THEN 1 END) as pessoa_juridica
FROM clientes_fornecedores
WHERE ativo = true;


-- 5. VALORES A RECEBER (INADIMPLÊNCIA)
SELECT '=== A RECEBER (PENDENTES) ===' as info;

SELECT
    c.nome as cliente,
    COUNT(m.id) as qtd_titulos,
    SUM(m.valor_previsto) as valor_total,
    MIN(m.data_vencimento) as vencimento_mais_antigo
FROM movimentacoes_financeiras m
JOIN clientes_fornecedores c ON m.cliente_fornecedor_id = c.id
WHERE m.tipo = 'receita'
AND m.quitado = false
GROUP BY c.nome
ORDER BY valor_total DESC
LIMIT 10;


-- 6. TESTAR VIEW DE DASHBOARD
SELECT '=== DASHBOARD KPIs ===' as info;

SELECT * FROM vw_dashboard_kpis;


-- 7. TESTAR VIEW DE DRE
SELECT '=== DRE VIEW ===' as info;

SELECT * FROM vw_dre_mensal ORDER BY ano DESC, mes DESC LIMIT 12;


-- 8. COMPARAÇÃO COM PLANILHA ORIGINAL
SELECT '=== COMPARAÇÃO COM PLANILHA (2025) ===' as info;

WITH dados_banco AS (
    SELECT
        EXTRACT(MONTH FROM data_vencimento)::int as mes,
        SUM(CASE WHEN tipo = 'receita' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as receitas_banco,
        SUM(CASE WHEN tipo = 'despesa' AND quitado THEN COALESCE(valor_realizado, valor_previsto) ELSE 0 END) as despesas_banco
    FROM movimentacoes_financeiras
    WHERE EXTRACT(YEAR FROM data_vencimento) = 2025
    GROUP BY mes
),
dados_planilha AS (
    SELECT * FROM (VALUES
        (1, 55857.63, 25993.56),
        (2, 39753.79, 21564.74),
        (3, 63420.72, 35258.88),
        (4, 38927.72, 29451.37),
        (5, 37516.23, 16211.02),
        (6, 45981.57, 17071.57)
    ) AS t(mes, receitas_planilha, despesas_planilha)
)
SELECT
    COALESCE(b.mes, p.mes) as mes,
    ROUND(p.receitas_planilha::numeric, 2) as receita_planilha,
    ROUND(b.receitas_banco::numeric, 2) as receita_banco,
    ROUND(p.despesas_planilha::numeric, 2) as despesa_planilha,
    ROUND(b.despesas_banco::numeric, 2) as despesa_banco
FROM dados_banco b
FULL OUTER JOIN dados_planilha p ON b.mes = p.mes
ORDER BY mes;

-- =====================================================
-- POPULAR CENTRO DE CUSTO NAS DESPESAS
-- Atribui centros de custo aleatoriamente às despesas
-- =====================================================

-- Atribuir centro de custo ADM para despesas sem centro de custo (primeiros 30%)
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'ADM' LIMIT 1)
WHERE tipo = 'despesa'
AND centro_custo_id IS NULL
AND id IN (
    SELECT id FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND centro_custo_id IS NULL
    ORDER BY random()
    LIMIT (SELECT COUNT(*) * 0.3 FROM movimentacoes_financeiras WHERE tipo = 'despesa' AND centro_custo_id IS NULL)::INTEGER
);

-- Atribuir centro de custo COM para outros 25%
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'COM' LIMIT 1)
WHERE tipo = 'despesa'
AND centro_custo_id IS NULL
AND id IN (
    SELECT id FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND centro_custo_id IS NULL
    ORDER BY random()
    LIMIT (SELECT COUNT(*) * 0.35 FROM movimentacoes_financeiras WHERE tipo = 'despesa' AND centro_custo_id IS NULL)::INTEGER
);

-- Atribuir centro de custo MKT para outros 20%
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'MKT' LIMIT 1)
WHERE tipo = 'despesa'
AND centro_custo_id IS NULL
AND id IN (
    SELECT id FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND centro_custo_id IS NULL
    ORDER BY random()
    LIMIT (SELECT COUNT(*) * 0.4 FROM movimentacoes_financeiras WHERE tipo = 'despesa' AND centro_custo_id IS NULL)::INTEGER
);

-- Atribuir centro de custo OPE para outros 15%
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'OPE' LIMIT 1)
WHERE tipo = 'despesa'
AND centro_custo_id IS NULL
AND id IN (
    SELECT id FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND centro_custo_id IS NULL
    ORDER BY random()
    LIMIT (SELECT COUNT(*) * 0.5 FROM movimentacoes_financeiras WHERE tipo = 'despesa' AND centro_custo_id IS NULL)::INTEGER
);

-- Atribuir centro de custo TEC para o restante
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'TEC' LIMIT 1)
WHERE tipo = 'despesa'
AND centro_custo_id IS NULL;

-- Verificar resultado
SELECT
    cc.nome as centro_custo,
    COUNT(*) as quantidade,
    SUM(COALESCE(m.valor_realizado, m.valor_previsto)) as total
FROM movimentacoes_financeiras m
JOIN centros_custo cc ON m.centro_custo_id = cc.id
WHERE m.tipo = 'despesa'
GROUP BY cc.nome
ORDER BY total DESC;

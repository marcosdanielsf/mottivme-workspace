-- =====================================================
-- CORREÇÃO: Atualizar datas para 2025
-- =====================================================

-- Atualizar movimentações de dezembro para 2025
UPDATE movimentacoes_financeiras
SET
    data_competencia = '2025-12-01'::date,
    data_vencimento = ('2025-12-' || LPAD(EXTRACT(DAY FROM data_vencimento)::TEXT, 2, '0'))::date,
    descricao = REPLACE(descricao, 'Dez/2024', 'Dez/2025')
WHERE data_competencia = '2024-12-01'
AND descricao LIKE '[REC]%';

SELECT 'Datas atualizadas para 2025' as info;

-- Verificar resultado
SELECT
    cf.nome as cliente,
    cf.telefone,
    m.valor_previsto as valor,
    m.data_vencimento as vencimento,
    CASE
        WHEN m.data_vencimento < CURRENT_DATE THEN '🔴 Vencido'
        WHEN m.data_vencimento = CURRENT_DATE THEN '🟡 Hoje'
        WHEN m.data_vencimento <= CURRENT_DATE + 5 THEN '🟠 Próximo'
        ELSE '🟢 Em dia'
    END as status
FROM movimentacoes_financeiras m
INNER JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
AND m.data_competencia = '2025-12-01'
ORDER BY m.data_vencimento ASC;

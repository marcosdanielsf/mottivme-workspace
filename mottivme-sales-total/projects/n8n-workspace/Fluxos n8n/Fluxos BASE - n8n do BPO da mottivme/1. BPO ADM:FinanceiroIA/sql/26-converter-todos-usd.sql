-- =====================================================
-- CORREÇÃO: TODOS os valores são USD → converter para BRL
-- Cotação: R$ 5,48
-- =====================================================

-- Converter TODAS as movimentações que ainda não foram convertidas
UPDATE movimentacoes_financeiras m
SET
    moeda_estrangeira = 'USD',
    valor_moeda_estrangeira = CASE
        WHEN m.moeda_estrangeira IS NULL THEN m.valor_previsto  -- guarda valor original
        ELSE m.valor_moeda_estrangeira  -- mantém se já tinha
    END,
    cotacao = 5.48,
    valor_previsto = CASE
        WHEN m.moeda_estrangeira IS NULL THEN m.valor_previsto * 5.48  -- converte
        ELSE m.valor_previsto  -- mantém se já converteu
    END
WHERE m.descricao LIKE '[REC]%'
AND m.moeda_estrangeira IS NULL;

SELECT 'Todos os valores convertidos USD → BRL (cotação 5.48)' as info;

-- Verificar resultado final
SELECT '📋 COBRANÇAS DE DEZEMBRO 2025 (CORRIGIDO):' as titulo;

SELECT
    cf.nome as cliente,
    cf.telefone,
    m.valor_moeda_estrangeira as valor_usd,
    m.cotacao,
    m.valor_previsto as valor_brl,
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
AND m.descricao LIKE '[REC]%'
ORDER BY m.data_vencimento ASC;

-- =====================================================
-- CORREÇÃO: Converter valores USD para BRL
-- Cotação: R$ 5,48
-- =====================================================

-- Primeiro, identificar quais clientes são USD
-- Baseado na tabela contratos_pendentes (moeda = 'USD')

-- Atualizar movimentações para clientes com contrato em USD
UPDATE movimentacoes_financeiras m
SET
    moeda_estrangeira = 'USD',
    valor_moeda_estrangeira = m.valor_previsto,  -- guarda valor original em USD
    cotacao = 5.48,
    valor_previsto = m.valor_previsto * 5.48     -- converte para BRL
FROM clientes_fornecedores cf
INNER JOIN contratos_pendentes cp ON cp.email = cf.email
WHERE m.cliente_fornecedor_id = cf.id
AND m.descricao LIKE '[REC]%'
AND cp.moeda = 'USD'
AND m.moeda_estrangeira IS NULL;  -- só atualiza se ainda não foi convertido

SELECT 'Valores USD convertidos para BRL (cotação 5.48)' as info;

-- Também corrigir as datas para 2025
UPDATE movimentacoes_financeiras
SET
    data_competencia = '2025-12-01'::date,
    data_vencimento = ('2025-12-' || LPAD(EXTRACT(DAY FROM data_vencimento)::TEXT, 2, '0'))::date,
    descricao = REPLACE(descricao, 'Dez/2024', 'Dez/2025')
WHERE descricao LIKE '[REC]%'
AND (data_competencia = '2024-12-01' OR descricao LIKE '%Dez/2024%');

SELECT 'Datas atualizadas para 2025' as info;

-- Verificar resultado final
SELECT '📋 COBRANÇAS DE DEZEMBRO 2025:' as titulo;

SELECT
    cf.nome as cliente,
    cf.telefone,
    m.valor_previsto as valor_brl,
    m.moeda_estrangeira as moeda_original,
    m.valor_moeda_estrangeira as valor_usd,
    m.cotacao,
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

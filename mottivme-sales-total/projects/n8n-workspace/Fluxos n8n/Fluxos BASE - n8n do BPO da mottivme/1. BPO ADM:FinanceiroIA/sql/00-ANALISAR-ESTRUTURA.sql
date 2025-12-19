-- =====================================================
-- ANÁLISE COMPLETA DA ESTRUTURA DO BANCO
-- Execute e me envie TODOS os resultados
-- =====================================================

-- 1. Estrutura da tabela clientes_fornecedores
SELECT '=== CLIENTES_FORNECEDORES ===' as tabela;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes_fornecedores'
ORDER BY ordinal_position;

-- 2. Estrutura da tabela recorrencias
SELECT '=== RECORRENCIAS ===' as tabela;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'recorrencias'
ORDER BY ordinal_position;

-- 3. Estrutura da tabela movimentacoes_financeiras
SELECT '=== MOVIMENTACOES_FINANCEIRAS ===' as tabela;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'movimentacoes_financeiras'
ORDER BY ordinal_position;

-- 4. Estrutura da tabela categorias_financeiras
SELECT '=== CATEGORIAS_FINANCEIRAS ===' as tabela;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'categorias_financeiras'
ORDER BY ordinal_position;

-- 5. Verificar CHECK constraints
SELECT '=== CHECK CONSTRAINTS ===' as info;
SELECT
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name IN ('clientes_fornecedores', 'recorrencias', 'movimentacoes_financeiras', 'categorias_financeiras')
AND tc.constraint_type = 'CHECK';

-- 6. Ver um registro existente de movimentação para entender o formato
SELECT '=== EXEMPLO MOVIMENTACAO ===' as info;
SELECT * FROM movimentacoes_financeiras LIMIT 1;

-- 7. Ver um registro existente de recorrência
SELECT '=== EXEMPLO RECORRENCIA ===' as info;
SELECT * FROM recorrencias LIMIT 1;

-- 8. Contratos pendentes ativos (fonte dos dados)
SELECT '=== CONTRATOS ATIVOS ===' as info;
SELECT nome, email, valor_mensal, dia_vencimento, produto, moeda
FROM contratos_pendentes
WHERE status = 'ativo'
AND email IS NOT NULL
LIMIT 5;

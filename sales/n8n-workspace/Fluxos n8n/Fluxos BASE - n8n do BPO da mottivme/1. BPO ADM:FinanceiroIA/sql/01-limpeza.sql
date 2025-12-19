-- ============================================
-- PASSO 1: LIMPEZA DO BANCO
-- Execute este script PRIMEIRO
-- ============================================

-- Desabilitar verificações de FK temporariamente
SET session_replication_role = 'replica';

-- 1. Limpar movimentações financeiras
DELETE FROM movimentacoes_financeiras;

-- 2. Limpar extrato bancário
DELETE FROM extrato_bancario;

-- 3. Limpar parcelamentos
DELETE FROM parcelamentos;

-- 4. Limpar recorrências
DELETE FROM recorrencias;

-- 5. Limpar contratos
DELETE FROM contratos;

-- 6. Limpar orçamentos
DELETE FROM orcamentos;

-- 7. Limpar clientes/fornecedores (vamos recriar)
DELETE FROM clientes_fornecedores;

-- Reabilitar verificações de FK
SET session_replication_role = 'origin';

-- Verificar limpeza
SELECT 'movimentacoes_financeiras' as tabela, COUNT(*) as registros FROM movimentacoes_financeiras
UNION ALL SELECT 'extrato_bancario', COUNT(*) FROM extrato_bancario
UNION ALL SELECT 'parcelamentos', COUNT(*) FROM parcelamentos
UNION ALL SELECT 'recorrencias', COUNT(*) FROM recorrencias
UNION ALL SELECT 'contratos', COUNT(*) FROM contratos
UNION ALL SELECT 'orcamentos', COUNT(*) FROM orcamentos
UNION ALL SELECT 'clientes_fornecedores', COUNT(*) FROM clientes_fornecedores
ORDER BY tabela;

-- Deve retornar tudo com 0 registros

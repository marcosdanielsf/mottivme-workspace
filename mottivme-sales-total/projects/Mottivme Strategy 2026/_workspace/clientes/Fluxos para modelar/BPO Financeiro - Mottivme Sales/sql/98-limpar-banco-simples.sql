-- ===================================
-- SCRIPT DE LIMPEZA - Remover Duplicatas
-- ===================================
-- Execute no SQL Editor do Supabase ANTES de rodar a migração novamente

-- Desabilitar triggers temporariamente
ALTER TABLE movimentacoes_financeiras DISABLE TRIGGER ALL;
ALTER TABLE inadimplencias DISABLE TRIGGER ALL;

-- Limpar dados (mantém estrutura)
TRUNCATE TABLE historico_cobrancas CASCADE;
TRUNCATE TABLE inadimplencias CASCADE;
TRUNCATE TABLE documentos_financeiros CASCADE;
TRUNCATE TABLE extratos_bancarios CASCADE;
TRUNCATE TABLE movimentacoes_financeiras CASCADE;
TRUNCATE TABLE clientes_fornecedores CASCADE;
TRUNCATE TABLE categorias CASCADE;
TRUNCATE TABLE contas_bancarias CASCADE;

-- Reabilitar triggers
ALTER TABLE movimentacoes_financeiras ENABLE TRIGGER ALL;
ALTER TABLE inadimplencias ENABLE TRIGGER ALL;

-- Reset sequences (IDs)
-- (UUIDs não precisam de reset, mas se tivesse seria aqui)

-- Verificar limpeza
SELECT
    'movimentacoes_financeiras' as tabela,
    COUNT(*) as registros
FROM movimentacoes_financeiras
UNION ALL
SELECT 'clientes_fornecedores', COUNT(*) FROM clientes_fornecedores
UNION ALL
SELECT 'categorias', COUNT(*) FROM categorias
UNION ALL
SELECT 'contas_bancarias', COUNT(*) FROM contas_bancarias
UNION ALL
SELECT 'extratos_bancarios', COUNT(*) FROM extratos_bancarios
UNION ALL
SELECT 'inadimplencias', COUNT(*) FROM inadimplencias
UNION ALL
SELECT 'documentos_financeiros', COUNT(*) FROM documentos_financeiros
UNION ALL
SELECT 'historico_cobrancas', COUNT(*) FROM historico_cobrancas;

-- Resultado esperado: Todas as tabelas com 0 registros

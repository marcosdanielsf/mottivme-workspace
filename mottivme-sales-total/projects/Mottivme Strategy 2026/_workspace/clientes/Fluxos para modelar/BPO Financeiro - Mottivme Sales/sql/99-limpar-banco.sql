-- ============================================================================
-- SCRIPT DE LIMPEZA - USE COM CUIDADO!
-- ============================================================================
-- Este script APAGA todas as tabelas do sistema BPO Financeiro
-- USE APENAS se quiser recomeçar do zero
-- ⚠️ ATENÇÃO: TODOS OS DADOS SERÃO PERDIDOS!
-- ============================================================================

-- Desabilitar verificações de chave estrangeira temporariamente
SET session_replication_role = replica;

-- Dropar views primeiro
DROP VIEW IF EXISTS vw_resumo_mensal CASCADE;
DROP VIEW IF EXISTS vw_inadimplentes CASCADE;
DROP VIEW IF EXISTS vw_fluxo_caixa_projetado CASCADE;

-- Dropar tabelas (ordem reversa de dependências)
DROP TABLE IF EXISTS logs_automacao CASCADE;
DROP TABLE IF EXISTS comprovantes_nao_identificados CASCADE;
DROP TABLE IF EXISTS dados_pendentes_confirmacao CASCADE;
DROP TABLE IF EXISTS cobrancas_automaticas CASCADE;
DROP TABLE IF EXISTS movimentacoes_financeiras CASCADE;
DROP TABLE IF EXISTS contas_bancarias CASCADE;
DROP TABLE IF EXISTS categorias_financeiras CASCADE;
DROP TABLE IF EXISTS clientes_fornecedores CASCADE;

-- Dropar functions e triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS atualizar_saldo_conta() CASCADE;

-- Reabilitar verificações de chave estrangeira
SET session_replication_role = DEFAULT;

-- Verificar que as tabelas foram removidas
SELECT
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'clientes_fornecedores',
    'categorias_financeiras',
    'contas_bancarias',
    'movimentacoes_financeiras',
    'cobrancas_automaticas',
    'dados_pendentes_confirmacao',
    'comprovantes_nao_identificados',
    'logs_automacao'
  );

-- Se o resultado acima estiver vazio, está tudo limpo!
-- Agora você pode executar o schema-supabase-bpo-completo.sql

-- =====================================================
-- CORREÇÃO: Adicionar constraint UNIQUE em movimentacao_id
-- Necessário para o ON CONFLICT funcionar
-- =====================================================

-- Adicionar constraint única na coluna movimentacao_id
ALTER TABLE cobrancas_automaticas
ADD CONSTRAINT cobrancas_automaticas_movimentacao_id_unique
UNIQUE (movimentacao_id);

-- Verificar se foi criada
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'cobrancas_automaticas';

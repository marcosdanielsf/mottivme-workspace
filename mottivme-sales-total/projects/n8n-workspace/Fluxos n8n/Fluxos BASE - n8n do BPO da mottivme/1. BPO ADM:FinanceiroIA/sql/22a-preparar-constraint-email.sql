-- =====================================================
-- PREPARAÇÃO: Adicionar UNIQUE constraint no email
-- Execute ANTES do script 22-sincronizar
-- =====================================================

-- Verificar se existe a constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'clientes_fornecedores'
AND constraint_type = 'UNIQUE';

-- Adicionar constraint única no email (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'clientes_fornecedores'
        AND constraint_name = 'clientes_fornecedores_email_key'
    ) THEN
        -- Primeiro, limpar emails duplicados (manter o mais recente)
        DELETE FROM clientes_fornecedores a
        USING clientes_fornecedores b
        WHERE a.email = b.email
        AND a.email IS NOT NULL
        AND a.created_at < b.created_at;

        -- Agora adicionar a constraint
        ALTER TABLE clientes_fornecedores
        ADD CONSTRAINT clientes_fornecedores_email_key UNIQUE (email);

        RAISE NOTICE 'Constraint de email única adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Constraint já existe.';
    END IF;
END $$;

-- Verificar resultado
SELECT 'Constraint verificada:' as info;
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'clientes_fornecedores'
AND constraint_type = 'UNIQUE';

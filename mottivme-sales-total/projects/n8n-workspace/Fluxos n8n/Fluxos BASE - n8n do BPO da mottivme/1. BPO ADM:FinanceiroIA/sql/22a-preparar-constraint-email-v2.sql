-- =====================================================
-- PREPARAÇÃO: Adicionar UNIQUE constraint no email
-- VERSÃO 2 - Corrigido para não deletar clientes com FK
-- =====================================================

-- Verificar se existe a constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'clientes_fornecedores'
AND constraint_type = 'UNIQUE';

-- Em vez de deletar duplicatas, vamos apenas ignorar e não adicionar a constraint
-- se já existirem duplicatas. O INSERT usará ON CONFLICT DO UPDATE em vez de unique.

-- Verificar duplicatas de email
SELECT email, COUNT(*) as qtd
FROM clientes_fornecedores
WHERE email IS NOT NULL AND email != ''
GROUP BY email
HAVING COUNT(*) > 1;

-- Se não houver duplicatas, adicionar a constraint
DO $$
BEGIN
    -- Verificar se há duplicatas
    IF EXISTS (
        SELECT email FROM clientes_fornecedores
        WHERE email IS NOT NULL AND email != ''
        GROUP BY email HAVING COUNT(*) > 1
    ) THEN
        RAISE NOTICE 'Existem emails duplicados. A constraint não será adicionada.';
        RAISE NOTICE 'O script de sincronização usará outra estratégia.';
    ELSE
        -- Adicionar constraint se não existir
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'clientes_fornecedores'
            AND constraint_name = 'clientes_fornecedores_email_key'
        ) THEN
            ALTER TABLE clientes_fornecedores
            ADD CONSTRAINT clientes_fornecedores_email_key UNIQUE (email);
            RAISE NOTICE 'Constraint de email única adicionada com sucesso!';
        ELSE
            RAISE NOTICE 'Constraint já existe.';
        END IF;
    END IF;
END $$;

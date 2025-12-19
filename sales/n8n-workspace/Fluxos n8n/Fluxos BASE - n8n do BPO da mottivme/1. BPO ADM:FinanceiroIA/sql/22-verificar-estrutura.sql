-- Verificar estrutura da tabela clientes_fornecedores
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'clientes_fornecedores'
ORDER BY ordinal_position;

-- Verificar constraints
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%clientes%' OR constraint_name LIKE '%tipo%';

-- Ver valores distintos do campo tipo
SELECT DISTINCT tipo FROM clientes_fornecedores;

-- Ver um registro para entender a estrutura
SELECT * FROM clientes_fornecedores LIMIT 1;

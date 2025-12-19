-- Verificar os dois registros duplicados
SELECT id, nome, email, tipo, created_at
FROM clientes_fornecedores
WHERE email = 'riquezanaamerica@gmail.com';

-- Ver qual tem movimentações vinculadas
SELECT cf.id, cf.nome, COUNT(m.id) as movimentacoes
FROM clientes_fornecedores cf
LEFT JOIN movimentacoes_financeiras m ON m.cliente_fornecedor_id = cf.id
WHERE cf.email = 'riquezanaamerica@gmail.com'
GROUP BY cf.id, cf.nome;

-- Para resolver: Atualizar o email do registro mais antigo (sem movimentações)
-- para um valor único, permitindo que a constraint funcione
-- DESCOMENTE E AJUSTE O ID CORRETO APÓS VERIFICAR:

-- UPDATE clientes_fornecedores
-- SET email = email || '_old'
-- WHERE email = 'riquezanaamerica@gmail.com'
-- AND id = 'ID_DO_REGISTRO_SEM_MOVIMENTACOES';

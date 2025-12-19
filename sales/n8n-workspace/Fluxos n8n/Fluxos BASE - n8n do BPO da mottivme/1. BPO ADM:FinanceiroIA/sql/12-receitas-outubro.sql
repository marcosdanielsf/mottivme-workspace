-- ============================================
-- PASSO 13: ADICIONAR RECEITAS OUTUBRO 2025
-- Total esperado: R$ 31.674,00
-- ============================================

-- Primeiro adicionar clientes novos que faltam
INSERT INTO clientes_fornecedores (nome, tipo, documento, ativo) VALUES
('Fernanda Leal', 'pessoa_fisica', '00000000040', true),
('Enon', 'pessoa_fisica', '00000000041', true),
('Andrei', 'pessoa_fisica', '00000000042', true),
('Vinicius e Gabi', 'pessoa_fisica', '00000000043', true),
('Vivian Osório', 'pessoa_fisica', '00000000044', true),
('Gustavo', 'pessoa_fisica', '00000000045', true);

-- Receitas de Outubro 2025
INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    valor_realizado,
    data_competencia,
    data_vencimento,
    quitado,
    categoria_id,
    cliente_fornecedor_id
)
SELECT
    'receita',
    c.nome || ' - ' || produto,
    valor,
    valor,
    '2025-10-01'::date,
    '2025-10-25'::date,
    true,
    '9b3f7381-eb5f-4eed-9451-fa6eb734942a'::uuid, -- BPOSS
    c.id
FROM (VALUES
    -- Marketing (Brasil)
    ('Fernanda Lappe', 3120.00, 'Marketing'),
    ('Renata Vieira', 2120.00, 'Marketing'),
    -- CRM (Brasil)
    ('Fernanda Leal', 270.00, 'CRM'),
    ('Enon', 540.00, 'CRM'),
    ('Andrei', 7800.00, 'CRM'),
    -- EUA
    ('Renata Vieira', 1664.00, 'BPOSS'),
    ('Fernanda Lappe', 4240.00, 'BPOSS'),
    ('Vivian Osório', 500.00, 'BPOSS'),
    ('Julia Supa', 2000.00, 'BPOSS'),
    ('Milton de Abreu', 1620.00, 'BPOSS'),
    ('Gustavo', 5300.00, 'BPOSS'),
    -- Brasil
    ('Vinicius e Gabi', 5000.00, 'BPOSS')
) AS dados(cliente_nome, valor, produto)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome;

-- Verificar receitas de Outubro
SELECT
    'Outubro 2025' as mes,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND EXTRACT(MONTH FROM data_vencimento) = 10
AND EXTRACT(YEAR FROM data_vencimento) = 2025;

-- Total esperado: ~R$ 34.174,00 (Marketing 13.850 + EUA/Brasil 20.324)

-- ============================================
-- PASSO 8: ADICIONAR REGISTROS JANEIRO 2025
-- ============================================

-- Primeiro adicionar clientes que faltam
INSERT INTO clientes_fornecedores (nome, tipo, documento, ativo) VALUES
('Guilherme e Suelyn', 'pessoa_fisica', '00000000037', true),
('Victor', 'pessoa_fisica', '00000000038', true),
('Samara', 'pessoa_fisica', '00000000039', true);

-- Adicionar receitas de Janeiro 2025
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
    c.nome || ' - BPOSS',
    valor,
    valor,
    '2025-01-01'::date,
    '2025-01-25'::date,
    true,
    '9b3f7381-eb5f-4eed-9451-fa6eb734942a'::uuid,
    c.id
FROM (VALUES
    ('Gladson Almeida Lopes Jr', 3080.00),
    ('André Rosa', 2859.00),
    ('Guilherme e Suelyn', 2664.00),
    ('Camila Poutre e Aline Morais', 3480.00),
    ('Fernanda Lappe', 4570.32),
    ('Kamilla Cavalcanti', 3045.53),
    ('Theodore Lewis', 20844.00),
    ('Taciana Cury e Marcos Alves', 6026.00),
    ('Andrea Saraiva', 3660.00),
    ('Ana Benotti', 2098.78),
    ('Pablo', 1530.00),
    ('Victor', 2000.00),
    ('Samara', 2000.00)
) AS dados(cliente_nome, valor)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome;

-- Verificar novo total de Janeiro
SELECT
    'Janeiro 2025' as mes,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE 0 END) as total_realizado
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND EXTRACT(MONTH FROM data_vencimento) = 1
AND EXTRACT(YEAR FROM data_vencimento) = 2025;

-- Total esperado: 57.857,63 (planilha diz 55.857,63)

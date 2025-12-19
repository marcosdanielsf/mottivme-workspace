-- ============================================
-- PASSO 7: ADICIONAR REGISTROS FALTANTES
-- Fevereiro 2025
-- ============================================

-- Primeiro adicionar cliente que falta
INSERT INTO clientes_fornecedores (nome, tipo, documento, ativo) VALUES
('Ana Benotti', 'pessoa_fisica', '00000000036', true);

-- Adicionar receitas faltantes de Fevereiro 2025
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
    valor, -- assumindo que foram pagos
    '2025-02-01'::date,
    data_venc::date,
    true,
    '9b3f7381-eb5f-4eed-9451-fa6eb734942a'::uuid, -- BPOSS
    c.id
FROM (VALUES
    ('Pablo', 1530.00, '2025-02-25'::date),
    ('Camila Poutre e Aline Morais', 3420.00, '2025-02-25'::date),
    ('Fernanda Lappe', 4512.64, '2025-02-26'::date),
    ('Kamilla Cavalcanti', 3045.53, '2025-02-27'::date),
    ('Taciana Cury e Marcos Alves', 5614.00, '2025-02-28'::date)
) AS dados(cliente_nome, valor, data_venc)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome;

-- Andrea Saraiva e Ana Benotti também são de Fevereiro
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
    '2025-02-01'::date,
    data_venc::date,
    true,
    '9b3f7381-eb5f-4eed-9451-fa6eb734942a'::uuid,
    c.id
FROM (VALUES
    ('Andrea Saraiva', 3660.00, '2025-02-25'::date),
    ('Ana Benotti', 2544.00, '2025-02-25'::date)
) AS dados(cliente_nome, valor, data_venc)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome;

-- Verificar novo total de Fevereiro
SELECT
    'Fevereiro 2025' as mes,
    SUM(valor_previsto) as total_previsto,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE 0 END) as total_realizado
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND EXTRACT(MONTH FROM data_vencimento) = 2
AND EXTRACT(YEAR FROM data_vencimento) = 2025;

-- Total esperado Fevereiro: 18.473 + 18.122 + 6.204 = ~42.799

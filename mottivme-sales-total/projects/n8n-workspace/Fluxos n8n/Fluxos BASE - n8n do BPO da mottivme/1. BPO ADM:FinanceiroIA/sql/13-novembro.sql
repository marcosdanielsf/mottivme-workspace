-- ============================================
-- PASSO 14: NOVEMBRO 2025 (RECEITAS + DESPESAS)
-- Receitas: R$ 20.080,00
-- Despesas: R$ 11.601,04
-- ============================================

-- Primeiro adicionar clientes novos
INSERT INTO clientes_fornecedores (nome, tipo, documento, ativo) VALUES
('Gustavo e Marina', 'pessoa_fisica', '00000000046', true),
('Alberto e Eline', 'pessoa_fisica', '00000000047', true),
('Thauan e Heloíse', 'pessoa_fisica', '00000000048', true)
ON CONFLICT DO NOTHING;

-- RECEITAS NOVEMBRO 2025
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
    CASE WHEN status = 'PAGO' THEN valor ELSE NULL END,
    '2025-11-01'::date,
    '2025-11-25'::date,
    status = 'PAGO',
    CASE
        WHEN produto = 'BPOSS' THEN '9b3f7381-eb5f-4eed-9451-fa6eb734942a'
        WHEN produto = 'BPOLG' THEN 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'
        WHEN produto = 'Manutenção CRM' THEN '642b1ce7-1696-4c65-bbe6-6192c6151be1'
        WHEN produto = 'IA' THEN '97b6d64c-4e8b-4c88-9346-5206fac7d22a'
        ELSE '9b3f7381-eb5f-4eed-9451-fa6eb734942a'
    END::uuid,
    c.id
FROM (VALUES
    -- Marketing Brasil
    ('Fernanda Lappe', 3120.00, 'BPOSS', 'PAGO'),
    ('Fernanda Leal', 270.00, 'CRM', 'PAGO'),
    ('Enon', 540.00, 'CRM', 'PAGO'),
    -- EUA
    ('Fernanda Lappe', 4240.00, 'BPOSS', 'PAGO'),
    ('Milton de Abreu', 1620.00, 'BPOSS', 'FALTA'),
    ('Gustavo e Marina', 5300.00, 'BPOSS', 'FALTA'),
    -- Brasil
    ('Alberto e Eline', 5000.00, 'IA', 'FALTA')
) AS dados(cliente_nome, valor, produto, status)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome
WHERE valor > 0;

-- DESPESAS NOVEMBRO 2025
INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    valor_realizado,
    data_competencia,
    data_vencimento,
    quitado,
    categoria_id
)
VALUES
('despesa', 'endereço fiscal', 231.90, 231.90, '2025-11-01', '2025-11-25', true, 'c25ffda1-eff8-4bd2-a03c-34cd516fbe19'),
('despesa', 'INSS', 167.00, 167.00, '2025-11-01', '2025-11-25', true, '629fb19f-24e5-4a9e-b589-c6979ade64d9'),
('despesa', 'honorários contador', 447.00, 447.00, '2025-11-01', '2025-11-25', true, 'a9e604ab-597b-460a-ac4e-a18f395c1c6d'),
('despesa', 'Funcionários', 7280.00, 7280.00, '2025-11-01', '2025-11-25', true, '79312d39-e686-4453-8d6a-9a0100a4212b'),
('despesa', 'Sistemas', 3236.18, 3236.18, '2025-11-01', '2025-11-25', true, '8dd1c822-c815-4f0e-9c29-4063f4b01f21'),
('despesa', 'vivo internet', 99.00, 99.00, '2025-11-01', '2025-11-25', true, '32fd17a7-c801-436e-9d4a-aa05de500b85'),
('despesa', 'vivo celular', 139.96, 139.96, '2025-11-01', '2025-11-25', true, '36489132-099b-4c42-b582-0929778aac7c');

-- Verificar Novembro
SELECT
    'Novembro 2025' as mes,
    tipo,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto
FROM movimentacoes_financeiras
WHERE EXTRACT(MONTH FROM data_vencimento) = 11
AND EXTRACT(YEAR FROM data_vencimento) = 2025
GROUP BY tipo;

-- Receitas esperado: ~R$ 20.090
-- Despesas esperado: R$ 11.601,04

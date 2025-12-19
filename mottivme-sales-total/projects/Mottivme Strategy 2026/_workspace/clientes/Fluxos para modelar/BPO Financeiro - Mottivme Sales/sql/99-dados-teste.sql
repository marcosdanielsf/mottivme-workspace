-- =====================================================
-- DADOS DE TESTE - BPO FINANCEIRO
-- Usa tabelas e dados existentes no banco
-- =====================================================

-- 1. MOVIMENTAÇÕES DE TESTE - Receitas pagas
INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto, valor_realizado,
    data_competencia, data_vencimento, data_realizado, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'receita',
    'pj',
    'TESTE - Consultoria Mensal',
    5000.00,
    5000.00,
    CURRENT_DATE - 30,
    CURRENT_DATE - 30,
    CURRENT_DATE - 28,
    true,
    (SELECT id FROM categorias WHERE nome ILIKE '%consultoria%' OR nome ILIKE '%serviço%' LIMIT 1),
    (SELECT id FROM clientes_fornecedores LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Consultoria Mensal');

INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto, valor_realizado,
    data_competencia, data_vencimento, data_realizado, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'receita',
    'pj',
    'TESTE - Projeto Marketing',
    8500.00,
    8500.00,
    CURRENT_DATE - 15,
    CURRENT_DATE - 15,
    CURRENT_DATE - 14,
    true,
    (SELECT id FROM categorias WHERE nome ILIKE '%marketing%' OR nome ILIKE '%serviço%' LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 1 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Projeto Marketing');

-- 2. MOVIMENTAÇÕES DE TESTE - Receitas pendentes (a receber)
INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'receita',
    'pj',
    'TESTE - Fatura a Receber',
    3500.00,
    CURRENT_DATE + 10,
    CURRENT_DATE + 10,
    false,
    (SELECT id FROM categorias LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 2 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Fatura a Receber');

-- 3. MOVIMENTAÇÕES DE TESTE - Inadimplência (receitas vencidas não pagas)
INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'receita',
    'pf',
    'TESTE - Parcela Vencida 1',
    2500.00,
    CURRENT_DATE - 25,
    CURRENT_DATE - 25,
    false,
    (SELECT id FROM categorias LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 3 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Parcela Vencida 1');

INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'receita',
    'pf',
    'TESTE - Parcela Vencida 2',
    1800.00,
    CURRENT_DATE - 40,
    CURRENT_DATE - 40,
    false,
    (SELECT id FROM categorias LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 4 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Parcela Vencida 2');

-- 4. MOVIMENTAÇÕES DE TESTE - Despesas pagas
INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto, valor_realizado,
    data_competencia, data_vencimento, data_realizado, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'despesa',
    'pj',
    'TESTE - Aluguel Dezembro',
    4500.00,
    4500.00,
    CURRENT_DATE - 20,
    CURRENT_DATE - 20,
    CURRENT_DATE - 18,
    true,
    (SELECT id FROM categorias WHERE nome ILIKE '%aluguel%' LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 5 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Aluguel Dezembro');

INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto, valor_realizado,
    data_competencia, data_vencimento, data_realizado, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'despesa',
    'pj',
    'TESTE - Internet/Telefone',
    380.00,
    380.00,
    CURRENT_DATE - 5,
    CURRENT_DATE - 5,
    CURRENT_DATE - 5,
    true,
    (SELECT id FROM categorias WHERE nome ILIKE '%assinatura%' OR nome ILIKE '%telefone%' LIMIT 1),
    (SELECT id FROM clientes_fornecedores WHERE nome ILIKE '%vivo%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Internet/Telefone');

-- 5. MOVIMENTAÇÕES DE TESTE - Despesas futuras
INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id, cliente_fornecedor_id
)
SELECT
    'despesa',
    'pj',
    'TESTE - Aluguel Janeiro/2025',
    4500.00,
    '2025-01-10',
    '2025-01-10',
    false,
    (SELECT id FROM categorias WHERE nome ILIKE '%aluguel%' LIMIT 1),
    (SELECT id FROM clientes_fornecedores OFFSET 6 LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Aluguel Janeiro/2025');

INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id
)
SELECT
    'despesa',
    'pj',
    'TESTE - IPTU 1a Parcela',
    850.00,
    '2025-01-15',
    '2025-01-15',
    false,
    (SELECT id FROM categorias WHERE nome ILIKE '%imposto%' OR nome ILIKE '%das%' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - IPTU 1a Parcela');

INSERT INTO movimentacoes_financeiras (
    tipo, tipo_entidade, descricao, valor_previsto,
    data_competencia, data_vencimento, quitado,
    categoria_id
)
SELECT
    'despesa',
    'pj',
    'TESTE - Marketing Janeiro',
    2500.00,
    '2025-01-20',
    '2025-01-20',
    false,
    (SELECT id FROM categorias WHERE nome ILIKE '%marketing%' OR nome = 'A identificar' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM movimentacoes_financeiras WHERE descricao = 'TESTE - Marketing Janeiro');

-- 6. RESUMO
SELECT 'Dados de teste inseridos!' as status;

SELECT
    'Total Movimentações' as info,
    COUNT(*) as total,
    SUM(CASE WHEN tipo = 'receita' THEN 1 ELSE 0 END) as receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN 1 ELSE 0 END) as despesas,
    SUM(CASE WHEN quitado = false AND tipo = 'receita' AND data_vencimento < CURRENT_DATE THEN 1 ELSE 0 END) as inadimplentes
FROM movimentacoes_financeiras;

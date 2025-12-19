-- =====================================================
-- DADOS DE TESTE COMPLEMENTARES - BPO FINANCEIRO
-- Este script complementa os dados de teste existentes
-- =====================================================

-- 1. CORRIGIR VIEW vw_orcamento_realizado
-- A tabela orcamentos usa categorias_financeiras
-- Mas movimentacoes_financeiras usa categorias - precisa fazer match por nome
DROP VIEW IF EXISTS vw_orcamento_realizado CASCADE;
CREATE VIEW vw_orcamento_realizado AS
SELECT
    o.ano,
    o.mes,
    o.tipo,
    cf.nome as categoria,
    cc.nome as centro_custo,
    o.valor_planejado,
    COALESCE(SUM(m.valor_realizado), COALESCE(SUM(m.valor_previsto), 0)) as valor_realizado,
    o.valor_planejado - COALESCE(SUM(m.valor_realizado), COALESCE(SUM(m.valor_previsto), 0)) as diferenca,
    CASE
        WHEN o.valor_planejado > 0
        THEN ROUND((COALESCE(SUM(m.valor_realizado), COALESCE(SUM(m.valor_previsto), 0)) / o.valor_planejado) * 100, 2)
        ELSE 0
    END as percentual_realizado
FROM orcamentos o
LEFT JOIN categorias_financeiras cf ON o.categoria_id = cf.id
LEFT JOIN centros_custo cc ON o.centro_custo_id = cc.id
LEFT JOIN categorias cat ON LOWER(cat.nome) = LOWER(cf.nome)
LEFT JOIN movimentacoes_financeiras m ON
    m.categoria_id = cat.id
    AND EXTRACT(YEAR FROM m.data_vencimento) = o.ano
    AND EXTRACT(MONTH FROM m.data_vencimento) = o.mes
    AND m.tipo = o.tipo
GROUP BY o.ano, o.mes, o.tipo, cf.nome, cc.nome, o.valor_planejado
ORDER BY o.ano DESC, mes DESC, o.tipo, cf.nome;

-- 2. CORRIGIR VIEW vw_dre_mensal para usar 'categorias' em vez de 'categorias_financeiras'
DROP VIEW IF EXISTS vw_dre_mensal CASCADE;
CREATE VIEW vw_dre_mensal AS
WITH receitas AS (
    SELECT
        EXTRACT(YEAR FROM data_vencimento)::INTEGER as ano,
        EXTRACT(MONTH FROM data_vencimento)::INTEGER as mes,
        SUM(COALESCE(valor_realizado, valor_previsto)) as total_receitas
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita' AND quitado = true
    GROUP BY EXTRACT(YEAR FROM data_vencimento), EXTRACT(MONTH FROM data_vencimento)
),
despesas AS (
    SELECT
        EXTRACT(YEAR FROM data_vencimento)::INTEGER as ano,
        EXTRACT(MONTH FROM data_vencimento)::INTEGER as mes,
        SUM(COALESCE(valor_realizado, valor_previsto)) as total_despesas
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND quitado = true
    GROUP BY EXTRACT(YEAR FROM data_vencimento), EXTRACT(MONTH FROM data_vencimento)
)
SELECT
    COALESCE(r.ano, d.ano) as ano,
    COALESCE(r.mes, d.mes) as mes,
    COALESCE(r.total_receitas, 0) as receita_bruta,
    COALESCE(d.total_despesas, 0) as despesas_totais,
    COALESCE(r.total_receitas, 0) - COALESCE(d.total_despesas, 0) as resultado_liquido,
    CASE
        WHEN COALESCE(r.total_receitas, 0) > 0
        THEN ROUND(((COALESCE(r.total_receitas, 0) - COALESCE(d.total_despesas, 0)) / r.total_receitas) * 100, 2)
        ELSE 0
    END as margem_liquida_percentual
FROM receitas r
FULL OUTER JOIN despesas d ON r.ano = d.ano AND r.mes = d.mes
ORDER BY ano DESC, mes DESC;

-- 3. ADICIONAR ORCAMENTOS DE TESTE
-- A tabela orcamentos usa categorias_financeiras (não categorias!)
INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'receita',
    id,
    15000.00
FROM categorias_financeiras
WHERE nome ILIKE '%consultoria%' OR nome ILIKE '%servico%' OR nome ILIKE '%serviço%'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'receita',
    id,
    10000.00
FROM categorias_financeiras
WHERE nome ILIKE '%servico%' OR nome ILIKE '%serviço%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Para despesas, precisamos criar categorias_financeiras de despesa primeiro
INSERT INTO categorias_financeiras (nome, tipo, ativo)
SELECT 'Aluguel e Condominio', 'despesa', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financeiras WHERE nome = 'Aluguel e Condominio');

INSERT INTO categorias_financeiras (nome, tipo, ativo)
SELECT 'Marketing e Publicidade', 'despesa', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financeiras WHERE nome = 'Marketing e Publicidade');

INSERT INTO categorias_financeiras (nome, tipo, ativo)
SELECT 'Impostos e Taxas', 'despesa', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financeiras WHERE nome = 'Impostos e Taxas');

INSERT INTO categorias_financeiras (nome, tipo, ativo)
SELECT 'Telecomunicacoes', 'despesa', true
WHERE NOT EXISTS (SELECT 1 FROM categorias_financeiras WHERE nome = 'Telecomunicacoes');

-- Agora inserir orcamentos de despesa
INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'despesa',
    id,
    5000.00
FROM categorias_financeiras
WHERE nome = 'Aluguel e Condominio'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'despesa',
    id,
    2500.00
FROM categorias_financeiras
WHERE nome = 'Marketing e Publicidade'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'despesa',
    id,
    1500.00
FROM categorias_financeiras
WHERE nome = 'Impostos e Taxas'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO orcamentos (ano, mes, tipo, categoria_id, valor_planejado)
SELECT
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'despesa',
    id,
    500.00
FROM categorias_financeiras
WHERE nome = 'Telecomunicacoes'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 4. ATUALIZAR MOVIMENTACOES COM CENTRO DE CUSTO
-- Primeiro, garantir que existe um centro de custo ADM
INSERT INTO centros_custo (codigo, nome, descricao, ativo)
SELECT 'ADM', 'Administrativo', 'Despesas administrativas gerais', true
WHERE NOT EXISTS (SELECT 1 FROM centros_custo WHERE codigo = 'ADM');

INSERT INTO centros_custo (codigo, nome, descricao, ativo)
SELECT 'COM', 'Comercial', 'Despesas comerciais e vendas', true
WHERE NOT EXISTS (SELECT 1 FROM centros_custo WHERE codigo = 'COM');

INSERT INTO centros_custo (codigo, nome, descricao, ativo)
SELECT 'MKT', 'Marketing', 'Despesas de marketing e publicidade', true
WHERE NOT EXISTS (SELECT 1 FROM centros_custo WHERE codigo = 'MKT');

INSERT INTO centros_custo (codigo, nome, descricao, ativo)
SELECT 'OPE', 'Operacional', 'Despesas operacionais', true
WHERE NOT EXISTS (SELECT 1 FROM centros_custo WHERE codigo = 'OPE');

-- Atualizar algumas despesas com centro de custo
UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'ADM' LIMIT 1)
WHERE tipo = 'despesa'
AND descricao ILIKE '%aluguel%'
AND centro_custo_id IS NULL;

UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'MKT' LIMIT 1)
WHERE tipo = 'despesa'
AND descricao ILIKE '%marketing%'
AND centro_custo_id IS NULL;

UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'ADM' LIMIT 1)
WHERE tipo = 'despesa'
AND (descricao ILIKE '%internet%' OR descricao ILIKE '%telefone%')
AND centro_custo_id IS NULL;

UPDATE movimentacoes_financeiras
SET centro_custo_id = (SELECT id FROM centros_custo WHERE codigo = 'ADM' LIMIT 1)
WHERE tipo = 'despesa'
AND (descricao ILIKE '%iptu%' OR descricao ILIKE '%imposto%')
AND centro_custo_id IS NULL;

-- 5. CRIAR EXTRATO BANCARIO DE TESTE
-- Primeiro verificar se existe conta bancaria (tipo_conta deve ser 'pj' ou 'pf')
INSERT INTO contas_bancarias (nome, banco, agencia, numero_conta, tipo_conta, saldo_inicial, saldo_atual, ativo)
SELECT 'Conta Principal', 'Banco do Brasil', '1234-5', '12345-6', 'pj', 10000.00, 15000.00, true
WHERE NOT EXISTS (SELECT 1 FROM contas_bancarias WHERE nome = 'Conta Principal');

-- Inserir extrato bancario de teste (nao conciliados)
INSERT INTO extrato_bancario (conta_bancaria_id, data_transacao, descricao, valor, tipo, conciliado)
SELECT
    (SELECT id FROM contas_bancarias LIMIT 1),
    CURRENT_DATE - 5,
    'TED RECEBIDA - CLIENTE ABC',
    5000.00,
    'credito',
    false
WHERE NOT EXISTS (SELECT 1 FROM extrato_bancario WHERE descricao = 'TED RECEBIDA - CLIENTE ABC');

INSERT INTO extrato_bancario (conta_bancaria_id, data_transacao, descricao, valor, tipo, conciliado)
SELECT
    (SELECT id FROM contas_bancarias LIMIT 1),
    CURRENT_DATE - 3,
    'PIX ENVIADO - ALUGUEL',
    4500.00,
    'debito',
    false
WHERE NOT EXISTS (SELECT 1 FROM extrato_bancario WHERE descricao = 'PIX ENVIADO - ALUGUEL');

INSERT INTO extrato_bancario (conta_bancaria_id, data_transacao, descricao, valor, tipo, conciliado)
SELECT
    (SELECT id FROM contas_bancarias LIMIT 1),
    CURRENT_DATE - 2,
    'TED RECEBIDA - PROJETO XYZ',
    8500.00,
    'credito',
    false
WHERE NOT EXISTS (SELECT 1 FROM extrato_bancario WHERE descricao = 'TED RECEBIDA - PROJETO XYZ');

INSERT INTO extrato_bancario (conta_bancaria_id, data_transacao, descricao, valor, tipo, conciliado)
SELECT
    (SELECT id FROM contas_bancarias LIMIT 1),
    CURRENT_DATE - 1,
    'DEBITO AUTOMATICO - VIVO',
    380.00,
    'debito',
    false
WHERE NOT EXISTS (SELECT 1 FROM extrato_bancario WHERE descricao = 'DEBITO AUTOMATICO - VIVO');

-- 6. VERIFICAR DADOS
SELECT 'Views atualizadas e dados de teste inseridos!' as status;

-- Resumo
SELECT 'Orcamentos' as tabela, COUNT(*) as total FROM orcamentos
UNION ALL
SELECT 'Centros de Custo', COUNT(*) FROM centros_custo WHERE ativo = true
UNION ALL
SELECT 'Extrato Bancario (nao conciliado)', COUNT(*) FROM extrato_bancario WHERE conciliado = false
UNION ALL
SELECT 'Movimentacoes com Centro Custo', COUNT(*) FROM movimentacoes_financeiras WHERE centro_custo_id IS NOT NULL;

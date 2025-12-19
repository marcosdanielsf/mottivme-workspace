-- =====================================================
-- RECURSOS AVANÇADOS - BPO FINANCEIRO
-- Execute no Supabase SQL Editor APÓS o script 01
-- =====================================================

-- 1. TABELA DE CENTROS DE CUSTO
-- Classificação de despesas por área da empresa
CREATE TABLE IF NOT EXISTS centros_custo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    codigo VARCHAR(20) UNIQUE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir centros de custo padrão
INSERT INTO centros_custo (nome, descricao, codigo) VALUES
    ('Administrativo', 'Despesas administrativas gerais', 'ADM'),
    ('Comercial', 'Despesas de vendas e marketing', 'COM'),
    ('Operacional', 'Despesas operacionais e produção', 'OPE'),
    ('Recursos Humanos', 'Folha de pagamento e benefícios', 'RH'),
    ('Tecnologia', 'Software, hardware e infraestrutura', 'TEC'),
    ('Financeiro', 'Taxas bancárias, juros, impostos', 'FIN')
ON CONFLICT (codigo) DO NOTHING;

-- 2. ADICIONAR CENTRO DE CUSTO NAS MOVIMENTAÇÕES
ALTER TABLE movimentacoes_financeiras
ADD COLUMN IF NOT EXISTS centro_custo_id UUID REFERENCES centros_custo(id);

-- Índice para centro de custo
CREATE INDEX IF NOT EXISTS idx_movimentacoes_centro_custo ON movimentacoes_financeiras(centro_custo_id);

-- 3. TABELA DE ORÇAMENTOS/METAS
-- Planejamento financeiro mensal por categoria
CREATE TABLE IF NOT EXISTS orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    categoria_id UUID REFERENCES categorias_financeiras(id),
    centro_custo_id UUID REFERENCES centros_custo(id),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    valor_planejado DECIMAL(15,2) NOT NULL,
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ano, mes, categoria_id, centro_custo_id, tipo)
);

-- Índices para orçamentos
CREATE INDEX IF NOT EXISTS idx_orcamentos_periodo ON orcamentos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_orcamentos_categoria ON orcamentos(categoria_id);

-- 4. TABELA DE CONTAS BANCÁRIAS (adicionar colunas se não existirem)
-- A tabela pode já existir do schema anterior, então adicionamos colunas faltantes
DO $$
BEGIN
    -- Criar tabela se não existir
    CREATE TABLE IF NOT EXISTS contas_bancarias (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(100) NOT NULL,
        banco VARCHAR(100),
        agencia VARCHAR(20),
        conta VARCHAR(30),
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Adicionar coluna tipo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contas_bancarias' AND column_name = 'tipo'
    ) THEN
        ALTER TABLE contas_bancarias ADD COLUMN tipo VARCHAR(20) DEFAULT 'corrente';
    END IF;

    -- Adicionar coluna saldo_inicial se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contas_bancarias' AND column_name = 'saldo_inicial'
    ) THEN
        ALTER TABLE contas_bancarias ADD COLUMN saldo_inicial DECIMAL(15,2) DEFAULT 0;
    END IF;
END $$;

-- Inserir conta padrão (usando apenas coluna nome que certamente existe)
INSERT INTO contas_bancarias (nome)
SELECT 'Caixa Geral'
WHERE NOT EXISTS (SELECT 1 FROM contas_bancarias WHERE nome = 'Caixa Geral');

-- 5. TABELA DE EXTRATO BANCÁRIO (para conciliação)
CREATE TABLE IF NOT EXISTS extrato_bancario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_bancaria_id UUID REFERENCES contas_bancarias(id),
    data_transacao DATE NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('credito', 'debito')),
    documento VARCHAR(100),
    -- Conciliação
    conciliado BOOLEAN DEFAULT false,
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    conciliado_em TIMESTAMP WITH TIME ZONE,
    -- Importação
    hash_transacao VARCHAR(64), -- Para evitar duplicatas na importação
    importado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conta_bancaria_id, hash_transacao)
);

-- Índices para extrato
CREATE INDEX IF NOT EXISTS idx_extrato_data ON extrato_bancario(data_transacao);
CREATE INDEX IF NOT EXISTS idx_extrato_conciliado ON extrato_bancario(conciliado);
CREATE INDEX IF NOT EXISTS idx_extrato_conta ON extrato_bancario(conta_bancaria_id);

-- 6. VIEW: ORÇAMENTO VS REALIZADO
DROP VIEW IF EXISTS vw_orcamento_realizado CASCADE;
CREATE VIEW vw_orcamento_realizado AS
SELECT
    o.ano,
    o.mes,
    o.tipo,
    cat.nome as categoria,
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
LEFT JOIN categorias_financeiras cat ON o.categoria_id = cat.id
LEFT JOIN centros_custo cc ON o.centro_custo_id = cc.id
LEFT JOIN movimentacoes_financeiras m ON
    m.categoria_id = o.categoria_id
    AND EXTRACT(YEAR FROM m.data_vencimento) = o.ano
    AND EXTRACT(MONTH FROM m.data_vencimento) = o.mes
    AND m.tipo = o.tipo
GROUP BY o.ano, o.mes, o.tipo, cat.nome, cc.nome, o.valor_planejado
ORDER BY o.ano DESC, o.mes DESC, o.tipo, cat.nome;

-- 7. VIEW: DRE SIMPLIFICADO MENSAL
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
),
despesas_categoria AS (
    SELECT
        EXTRACT(YEAR FROM m.data_vencimento)::INTEGER as ano,
        EXTRACT(MONTH FROM m.data_vencimento)::INTEGER as mes,
        cat.nome as categoria,
        SUM(COALESCE(m.valor_realizado, m.valor_previsto)) as valor
    FROM movimentacoes_financeiras m
    LEFT JOIN categorias_financeiras cat ON m.categoria_id = cat.id
    WHERE m.tipo = 'despesa' AND m.quitado = true
    GROUP BY EXTRACT(YEAR FROM m.data_vencimento), EXTRACT(MONTH FROM m.data_vencimento), cat.nome
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

-- 8. VIEW: DASHBOARD KPIs
DROP VIEW IF EXISTS vw_dashboard_kpis CASCADE;
CREATE VIEW vw_dashboard_kpis AS
WITH mes_atual AS (
    SELECT
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER as ano,
        EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER as mes
),
receitas_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as valor
    FROM movimentacoes_financeiras, mes_atual
    WHERE tipo = 'receita'
    AND quitado = true
    AND EXTRACT(YEAR FROM data_vencimento) = mes_atual.ano
    AND EXTRACT(MONTH FROM data_vencimento) = mes_atual.mes
),
despesas_mes AS (
    SELECT COALESCE(SUM(COALESCE(valor_realizado, valor_previsto)), 0) as valor
    FROM movimentacoes_financeiras, mes_atual
    WHERE tipo = 'despesa'
    AND quitado = true
    AND EXTRACT(YEAR FROM data_vencimento) = mes_atual.ano
    AND EXTRACT(MONTH FROM data_vencimento) = mes_atual.mes
),
a_receber AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as valor,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita' AND quitado = false
),
a_pagar AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as valor,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa' AND quitado = false
),
inadimplencia AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as valor,
        COUNT(*) as quantidade,
        COUNT(DISTINCT cliente_fornecedor_id) as clientes
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
    AND quitado = false
    AND data_vencimento < CURRENT_DATE
),
vencendo_7dias AS (
    SELECT
        COALESCE(SUM(valor_previsto), 0) as valor,
        COUNT(*) as quantidade
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
    AND quitado = false
    AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
)
SELECT
    -- Resultado do mês
    (SELECT valor FROM receitas_mes) as receitas_mes_atual,
    (SELECT valor FROM despesas_mes) as despesas_mes_atual,
    (SELECT valor FROM receitas_mes) - (SELECT valor FROM despesas_mes) as resultado_mes,
    -- Contas a receber
    (SELECT valor FROM a_receber) as total_a_receber,
    (SELECT quantidade FROM a_receber) as qtd_a_receber,
    -- Contas a pagar
    (SELECT valor FROM a_pagar) as total_a_pagar,
    (SELECT quantidade FROM a_pagar) as qtd_a_pagar,
    -- Inadimplência
    (SELECT valor FROM inadimplencia) as valor_inadimplente,
    (SELECT quantidade FROM inadimplencia) as qtd_titulos_vencidos,
    (SELECT clientes FROM inadimplencia) as clientes_inadimplentes,
    -- Taxa de inadimplência
    CASE
        WHEN (SELECT valor FROM a_receber) + (SELECT valor FROM inadimplencia) > 0
        THEN ROUND(((SELECT valor FROM inadimplencia) / ((SELECT valor FROM a_receber) + (SELECT valor FROM inadimplencia))) * 100, 2)
        ELSE 0
    END as taxa_inadimplencia,
    -- Próximos 7 dias
    (SELECT valor FROM vencendo_7dias) as a_pagar_7dias,
    (SELECT quantidade FROM vencendo_7dias) as qtd_vencendo_7dias,
    -- Saldo projetado 30 dias
    (SELECT valor FROM a_receber) - (SELECT valor FROM a_pagar) as saldo_projetado;

-- 9. VIEW: CONCILIAÇÃO PENDENTE
DROP VIEW IF EXISTS vw_conciliacao_pendente CASCADE;
CREATE VIEW vw_conciliacao_pendente AS
SELECT
    e.id as extrato_id,
    e.data_transacao,
    e.descricao as descricao_extrato,
    e.valor as valor_extrato,
    e.tipo as tipo_extrato,
    cb.nome as conta_bancaria,
    -- Possíveis matches
    m.id as movimentacao_id,
    m.descricao as descricao_movimentacao,
    COALESCE(m.valor_realizado, m.valor_previsto) as valor_movimentacao,
    m.tipo as tipo_movimentacao,
    ABS(e.valor - COALESCE(m.valor_realizado, m.valor_previsto)) as diferenca_valor
FROM extrato_bancario e
JOIN contas_bancarias cb ON e.conta_bancaria_id = cb.id
LEFT JOIN movimentacoes_financeiras m ON
    m.quitado = true
    AND ABS(e.data_transacao - m.data_vencimento) <= 3 -- 3 dias de tolerância
    AND ABS(e.valor - COALESCE(m.valor_realizado, m.valor_previsto)) < 0.01 -- Valor igual
    AND (
        (e.tipo = 'credito' AND m.tipo = 'receita')
        OR (e.tipo = 'debito' AND m.tipo = 'despesa')
    )
WHERE e.conciliado = false
ORDER BY e.data_transacao DESC, diferenca_valor;

-- 10. FUNÇÃO: Calcular saldo da conta bancária
CREATE OR REPLACE FUNCTION calcular_saldo_conta(p_conta_id UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
    v_saldo_inicial DECIMAL(15,2);
    v_creditos DECIMAL(15,2);
    v_debitos DECIMAL(15,2);
BEGIN
    SELECT saldo_inicial INTO v_saldo_inicial
    FROM contas_bancarias WHERE id = p_conta_id;

    SELECT COALESCE(SUM(valor), 0) INTO v_creditos
    FROM extrato_bancario
    WHERE conta_bancaria_id = p_conta_id AND tipo = 'credito';

    SELECT COALESCE(SUM(valor), 0) INTO v_debitos
    FROM extrato_bancario
    WHERE conta_bancaria_id = p_conta_id AND tipo = 'debito';

    RETURN v_saldo_inicial + v_creditos - v_debitos;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- ============================================
-- SCHEMA COMPLETO DO BANCO DE DADOS
-- BPO Financeiro IA - Mottivme Sales
-- ============================================
-- Execute este script no Supabase SQL Editor
-- Gerado automaticamente baseado nas tools do n8n
-- ============================================

-- IMPORTANTE: Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABELA: clientes_fornecedores
-- ============================================
-- Usada por: tool-buscar-cliente, tool-criar-cliente, tool-buscar-cliente-contato
--            tool-atualizar-cliente, tool-gerar-contrato, tool-inadimplencia

CREATE TABLE IF NOT EXISTS clientes_fornecedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    documento VARCHAR(20),                    -- CPF ou CNPJ
    tipo VARCHAR(20) DEFAULT 'pj',            -- 'pf' ou 'pj'
    razao_social VARCHAR(255),                -- Para PJ
    nacionalidade VARCHAR(100),
    profissao VARCHAR(100),
    estado_civil VARCHAR(50),
    data_nascimento DATE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco TEXT,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    ghl_contact_id VARCHAR(100),              -- ID do GoHighLevel
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clientes_fornecedores
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes_fornecedores(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes_fornecedores(documento);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes_fornecedores(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_ghl ON clientes_fornecedores(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes_fornecedores(ativo);


-- ============================================
-- 2. TABELA: categorias_financeiras
-- ============================================
-- Usada por: tool-listar-categorias, tool-buscar-movimentacoes, tool-dre

CREATE TABLE IF NOT EXISTS categorias_financeiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,                -- 'receita' ou 'despesa'
    descricao TEXT,
    cor VARCHAR(7),                           -- Cor hex (#FFFFFF)
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON categorias_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias_financeiras(ativo);


-- ============================================
-- 3. TABELA: centros_custo
-- ============================================
-- Usada por: tool-centros-custo

CREATE TABLE IF NOT EXISTS centros_custo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(20),
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para centros de custo
CREATE INDEX IF NOT EXISTS idx_centros_custo_ativo ON centros_custo(ativo);
CREATE INDEX IF NOT EXISTS idx_centros_custo_codigo ON centros_custo(codigo);


-- ============================================
-- 4. TABELA: movimentacoes_financeiras
-- ============================================
-- Usada por: tool-buscar-movimentacoes, tool-salvar-movimentacao, tool-fluxo-caixa
--            tool-inadimplencia, tool-dre, tool-centros-custo

CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(20) NOT NULL,                -- 'receita' ou 'despesa'
    descricao VARCHAR(255) NOT NULL,
    valor_previsto DECIMAL(15,2) NOT NULL,
    valor_realizado DECIMAL(15,2),
    data_vencimento DATE NOT NULL,
    data_realizado DATE,
    quitado BOOLEAN DEFAULT false,
    tipo_entidade VARCHAR(10) DEFAULT 'pj',   -- 'pf' ou 'pj'
    categoria_id UUID REFERENCES categorias_financeiras(id),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    centro_custo_id UUID REFERENCES centros_custo(id),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para movimentacoes_financeiras
CREATE INDEX IF NOT EXISTS idx_mov_tipo ON movimentacoes_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_mov_quitado ON movimentacoes_financeiras(quitado);
CREATE INDEX IF NOT EXISTS idx_mov_data_vencimento ON movimentacoes_financeiras(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_mov_cliente ON movimentacoes_financeiras(cliente_fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_mov_categoria ON movimentacoes_financeiras(categoria_id);
CREATE INDEX IF NOT EXISTS idx_mov_centro_custo ON movimentacoes_financeiras(centro_custo_id);


-- ============================================
-- 5. TABELA: parcelamentos
-- ============================================
-- Usada por: tool-criar-parcelamento

CREATE TABLE IF NOT EXISTS parcelamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(20) NOT NULL,                -- 'receita' ou 'despesa'
    descricao VARCHAR(255) NOT NULL,
    valor_total DECIMAL(15,2) NOT NULL,
    num_parcelas INTEGER NOT NULL,
    valor_parcela DECIMAL(15,2) NOT NULL,
    data_primeira_parcela DATE NOT NULL,
    tipo_entidade VARCHAR(10) DEFAULT 'pj',
    categoria_id UUID REFERENCES categorias_financeiras(id),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- 6. TABELA: recorrencias
-- ============================================
-- Usada por: tool-criar-recorrencia

CREATE TABLE IF NOT EXISTS recorrencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(20) NOT NULL,                -- 'receita' ou 'despesa'
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    tipo_entidade VARCHAR(10) DEFAULT 'pj',
    categoria_id UUID REFERENCES categorias_financeiras(id),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    observacao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para recorrencias
CREATE INDEX IF NOT EXISTS idx_recorrencias_ativo ON recorrencias(ativo);
CREATE INDEX IF NOT EXISTS idx_recorrencias_tipo ON recorrencias(tipo);


-- ============================================
-- 7. TABELA: contas_bancarias
-- ============================================
-- Usada por: tool-conciliacao

CREATE TABLE IF NOT EXISTS contas_bancarias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    banco VARCHAR(100),
    agencia VARCHAR(20),
    conta VARCHAR(30),
    tipo VARCHAR(30),                         -- 'corrente', 'poupanca', etc.
    saldo_atual DECIMAL(15,2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- 8. TABELA: extrato_bancario
-- ============================================
-- Usada por: tool-conciliacao

CREATE TABLE IF NOT EXISTS extrato_bancario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conta_bancaria_id UUID REFERENCES contas_bancarias(id),
    data_transacao DATE NOT NULL,
    descricao VARCHAR(255),
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(20),                         -- 'credito' ou 'debito'
    conciliado BOOLEAN DEFAULT false,
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    conciliado_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para extrato_bancario
CREATE INDEX IF NOT EXISTS idx_extrato_conciliado ON extrato_bancario(conciliado);
CREATE INDEX IF NOT EXISTS idx_extrato_data ON extrato_bancario(data_transacao);
CREATE INDEX IF NOT EXISTS idx_extrato_conta ON extrato_bancario(conta_bancaria_id);


-- ============================================
-- 9. TABELA: contratos
-- ============================================
-- Usada por: tool-gerar-contrato, tool-listar-contratos

CREATE TABLE IF NOT EXISTS contratos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    numero_contrato VARCHAR(50) NOT NULL UNIQUE,
    valor_mensal DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',           -- 'BRL' ou 'USD'
    num_parcelas INTEGER NOT NULL,
    valor_entrada DECIMAL(15,2) DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    conteudo_contrato TEXT,
    status VARCHAR(30) DEFAULT 'rascunho',    -- rascunho, enviado, assinado, ativo, encerrado, cancelado
    assinado_em TIMESTAMP WITH TIME ZONE,
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para contratos
CREATE INDEX IF NOT EXISTS idx_contratos_cliente ON contratos(cliente_fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_numero ON contratos(numero_contrato);


-- ============================================
-- 10. TABELA: orcamentos
-- ============================================
-- Usada por: tool-orcamento-realizado (via view)

CREATE TABLE IF NOT EXISTS orcamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    tipo VARCHAR(20) NOT NULL,                -- 'receita' ou 'despesa'
    categoria_id UUID REFERENCES categorias_financeiras(id),
    centro_custo_id UUID REFERENCES centros_custo(id),
    valor_planejado DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ano, mes, tipo, categoria_id, centro_custo_id)
);

-- Índices para orcamentos
CREATE INDEX IF NOT EXISTS idx_orcamentos_periodo ON orcamentos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_orcamentos_tipo ON orcamentos(tipo);


-- ============================================
-- VIEWS
-- ============================================

-- ============================================
-- VIEW: vw_dashboard_kpis
-- ============================================
-- Usada por: tool-dashboard-kpis

CREATE OR REPLACE VIEW vw_dashboard_kpis AS
SELECT
    -- Receitas do mês atual
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = true
        AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
        THEN COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as receitas_mes_atual,

    -- Despesas do mês atual
    COALESCE(SUM(CASE
        WHEN tipo = 'despesa' AND quitado = true
        AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
        THEN COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as despesas_mes_atual,

    -- Resultado do mês
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = true
        AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
        THEN COALESCE(valor_realizado, valor_previsto)
        WHEN tipo = 'despesa' AND quitado = true
        AND EXTRACT(YEAR FROM data_vencimento) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM data_vencimento) = EXTRACT(MONTH FROM CURRENT_DATE)
        THEN -COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as resultado_mes,

    -- Total a receber (não quitado)
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento >= CURRENT_DATE
        THEN valor_previsto
        ELSE 0
    END), 0) as total_a_receber,

    -- Quantidade a receber
    COUNT(CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento >= CURRENT_DATE
        THEN 1
    END) as qtd_a_receber,

    -- Total a pagar (não quitado)
    COALESCE(SUM(CASE
        WHEN tipo = 'despesa' AND quitado = false
        AND data_vencimento >= CURRENT_DATE
        THEN valor_previsto
        ELSE 0
    END), 0) as total_a_pagar,

    -- Quantidade a pagar
    COUNT(CASE
        WHEN tipo = 'despesa' AND quitado = false
        AND data_vencimento >= CURRENT_DATE
        THEN 1
    END) as qtd_a_pagar,

    -- A pagar nos próximos 7 dias
    COALESCE(SUM(CASE
        WHEN tipo = 'despesa' AND quitado = false
        AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
        THEN valor_previsto
        ELSE 0
    END), 0) as a_pagar_7dias,

    -- Quantidade vencendo em 7 dias
    COUNT(CASE
        WHEN tipo = 'despesa' AND quitado = false
        AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
        THEN 1
    END) as qtd_vencendo_7dias,

    -- Valor inadimplente (receitas vencidas não quitadas)
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento < CURRENT_DATE
        THEN valor_previsto
        ELSE 0
    END), 0) as valor_inadimplente,

    -- Títulos vencidos
    COUNT(CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento < CURRENT_DATE
        THEN 1
    END) as qtd_titulos_vencidos,

    -- Clientes inadimplentes
    COUNT(DISTINCT CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento < CURRENT_DATE
        THEN cliente_fornecedor_id
    END) as clientes_inadimplentes,

    -- Taxa de inadimplência
    CASE
        WHEN COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE 0 END), 0) > 0
        THEN ROUND(
            COALESCE(SUM(CASE
                WHEN tipo = 'receita' AND quitado = false AND data_vencimento < CURRENT_DATE
                THEN valor_previsto
                ELSE 0
            END), 0) * 100.0 /
            NULLIF(SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE 0 END), 0)
        , 2)
        ELSE 0
    END as taxa_inadimplencia,

    -- Saldo projetado (30 dias)
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = false
        AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        THEN valor_previsto
        WHEN tipo = 'despesa' AND quitado = false
        AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        THEN -valor_previsto
        ELSE 0
    END), 0) as saldo_projetado

FROM movimentacoes_financeiras;


-- ============================================
-- VIEW: vw_dre_mensal
-- ============================================
-- Usada por: tool-dre

CREATE OR REPLACE VIEW vw_dre_mensal AS
SELECT
    EXTRACT(YEAR FROM data_vencimento)::INTEGER as ano,
    EXTRACT(MONTH FROM data_vencimento)::INTEGER as mes,

    -- Receita Bruta
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = true
        THEN COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as receita_bruta,

    -- Despesas Totais
    COALESCE(SUM(CASE
        WHEN tipo = 'despesa' AND quitado = true
        THEN COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as despesas_totais,

    -- Resultado Líquido
    COALESCE(SUM(CASE
        WHEN tipo = 'receita' AND quitado = true
        THEN COALESCE(valor_realizado, valor_previsto)
        WHEN tipo = 'despesa' AND quitado = true
        THEN -COALESCE(valor_realizado, valor_previsto)
        ELSE 0
    END), 0) as resultado_liquido,

    -- Margem Líquida %
    CASE
        WHEN COALESCE(SUM(CASE
            WHEN tipo = 'receita' AND quitado = true
            THEN COALESCE(valor_realizado, valor_previsto)
            ELSE 0
        END), 0) > 0
        THEN ROUND(
            COALESCE(SUM(CASE
                WHEN tipo = 'receita' AND quitado = true
                THEN COALESCE(valor_realizado, valor_previsto)
                WHEN tipo = 'despesa' AND quitado = true
                THEN -COALESCE(valor_realizado, valor_previsto)
                ELSE 0
            END), 0) * 100.0 /
            NULLIF(SUM(CASE
                WHEN tipo = 'receita' AND quitado = true
                THEN COALESCE(valor_realizado, valor_previsto)
                ELSE 0
            END), 0)
        , 2)
        ELSE 0
    END as margem_liquida_percentual

FROM movimentacoes_financeiras
WHERE quitado = true
GROUP BY
    EXTRACT(YEAR FROM data_vencimento),
    EXTRACT(MONTH FROM data_vencimento)
ORDER BY ano DESC, mes DESC;


-- ============================================
-- VIEW: vw_orcamento_realizado
-- ============================================
-- Usada por: tool-orcamento-realizado

CREATE OR REPLACE VIEW vw_orcamento_realizado AS
SELECT
    o.ano,
    o.mes,
    o.tipo,
    COALESCE(cat.nome, 'Sem Categoria') as categoria,
    COALESCE(cc.nome, '-') as centro_custo,
    o.valor_planejado,
    COALESCE(SUM(CASE
        WHEN m.quitado = true
        THEN COALESCE(m.valor_realizado, m.valor_previsto)
        ELSE 0
    END), 0) as valor_realizado,
    o.valor_planejado - COALESCE(SUM(CASE
        WHEN m.quitado = true
        THEN COALESCE(m.valor_realizado, m.valor_previsto)
        ELSE 0
    END), 0) as diferenca,
    CASE
        WHEN o.valor_planejado > 0
        THEN ROUND(
            COALESCE(SUM(CASE
                WHEN m.quitado = true
                THEN COALESCE(m.valor_realizado, m.valor_previsto)
                ELSE 0
            END), 0) * 100.0 / o.valor_planejado
        , 2)
        ELSE 0
    END as percentual_realizado
FROM orcamentos o
LEFT JOIN categorias_financeiras cat ON o.categoria_id = cat.id
LEFT JOIN centros_custo cc ON o.centro_custo_id = cc.id
LEFT JOIN movimentacoes_financeiras m ON
    m.categoria_id = o.categoria_id
    AND (m.centro_custo_id = o.centro_custo_id OR (m.centro_custo_id IS NULL AND o.centro_custo_id IS NULL))
    AND m.tipo = o.tipo
    AND EXTRACT(YEAR FROM m.data_vencimento) = o.ano
    AND EXTRACT(MONTH FROM m.data_vencimento) = o.mes
GROUP BY
    o.ano, o.mes, o.tipo, cat.nome, cc.nome, o.valor_planejado;


-- ============================================
-- FUNÇÕES
-- ============================================

-- ============================================
-- FUNÇÃO: gerar_numero_contrato
-- ============================================
-- Usada por: tool-gerar-contrato

CREATE OR REPLACE FUNCTION gerar_numero_contrato()
RETURNS VARCHAR AS $$
DECLARE
    ano_atual VARCHAR(4);
    sequencial INTEGER;
    numero_final VARCHAR(50);
BEGIN
    ano_atual := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Buscar último sequencial do ano
    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(numero_contrato, '-', 2) AS INTEGER)
    ), 0) + 1
    INTO sequencial
    FROM contratos
    WHERE numero_contrato LIKE 'MOTT-' || ano_atual || '%';

    numero_final := 'MOTT-' || ano_atual || '-' || LPAD(sequencial::TEXT, 5, '0');

    RETURN numero_final;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- TRIGGER: updated_at automático
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas que precisam
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes_fornecedores;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes_fornecedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_movimentacoes_updated_at ON movimentacoes_financeiras;
CREATE TRIGGER update_movimentacoes_updated_at
    BEFORE UPDATE ON movimentacoes_financeiras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contratos_updated_at ON contratos;
CREATE TRIGGER update_contratos_updated_at
    BEFORE UPDATE ON contratos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Categorias de Receita
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor) VALUES
    ('Consultoria', 'receita', 'Serviços de consultoria comercial', '#22c55e'),
    ('Honorários', 'receita', 'Honorários por serviços prestados', '#10b981'),
    ('Comissões', 'receita', 'Comissões sobre vendas', '#34d399'),
    ('Treinamentos', 'receita', 'Receitas de treinamentos', '#6ee7b7'),
    ('Outras Receitas', 'receita', 'Outras receitas diversas', '#a7f3d0')
ON CONFLICT DO NOTHING;

-- Categorias de Despesa
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor) VALUES
    ('Pessoal', 'despesa', 'Salários, encargos e benefícios', '#ef4444'),
    ('Marketing', 'despesa', 'Gastos com marketing e publicidade', '#f97316'),
    ('Tecnologia', 'despesa', 'Software, hardware e infraestrutura', '#eab308'),
    ('Escritório', 'despesa', 'Aluguel, utilities, materiais', '#84cc16'),
    ('Impostos', 'despesa', 'Impostos e taxas', '#dc2626'),
    ('Viagens', 'despesa', 'Passagens, hospedagem, alimentação', '#f59e0b'),
    ('Serviços de Terceiros', 'despesa', 'Contratações externas', '#8b5cf6'),
    ('Outras Despesas', 'despesa', 'Despesas diversas', '#a3a3a3')
ON CONFLICT DO NOTHING;

-- Centros de Custo padrão
INSERT INTO centros_custo (nome, codigo, descricao) VALUES
    ('Administrativo', 'ADM', 'Despesas administrativas gerais'),
    ('Comercial', 'COM', 'Despesas da área comercial'),
    ('Operacional', 'OPE', 'Despesas operacionais'),
    ('Marketing', 'MKT', 'Despesas de marketing'),
    ('Tecnologia', 'TEC', 'Despesas de TI e sistemas')
ON CONFLICT DO NOTHING;

-- Conta Bancária padrão
INSERT INTO contas_bancarias (nome, banco, tipo) VALUES
    ('Conta Principal', 'Banco Principal', 'corrente')
ON CONFLICT DO NOTHING;


-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar se todas as tabelas foram criadas
SELECT
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ OK' ELSE '❌ FALTANDO' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'clientes_fornecedores',
    'categorias_financeiras',
    'centros_custo',
    'movimentacoes_financeiras',
    'parcelamentos',
    'recorrencias',
    'contas_bancarias',
    'extrato_bancario',
    'contratos',
    'orcamentos'
)
ORDER BY table_name;

-- Verificar se todas as views foram criadas
SELECT
    table_name as view_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ OK' ELSE '❌ FALTANDO' END as status
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN (
    'vw_dashboard_kpis',
    'vw_dre_mensal',
    'vw_orcamento_realizado'
)
ORDER BY table_name;

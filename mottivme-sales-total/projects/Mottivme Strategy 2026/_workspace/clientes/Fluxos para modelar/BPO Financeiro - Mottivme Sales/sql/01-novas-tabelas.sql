-- =====================================================
-- NOVAS TABELAS PARA BPO FINANCEIRO COMPLETO
-- Execute no Supabase SQL Editor
-- =====================================================

-- 1. TABELA DE RECORRÊNCIAS
-- Despesas/receitas que repetem todo mês (aluguel, salários, assinaturas)
CREATE TABLE IF NOT EXISTS recorrencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    tipo_entidade VARCHAR(2) DEFAULT 'pj' CHECK (tipo_entidade IN ('pf', 'pj')),
    categoria_id UUID REFERENCES categorias_financeiras(id),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    observacao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE PARCELAMENTOS
-- Compras/vendas parceladas
CREATE TABLE IF NOT EXISTS parcelamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    descricao VARCHAR(255) NOT NULL,
    valor_total DECIMAL(15,2) NOT NULL,
    num_parcelas INTEGER NOT NULL,
    valor_parcela DECIMAL(15,2) NOT NULL,
    data_primeira_parcela DATE NOT NULL,
    parcelas_pagas INTEGER DEFAULT 0,
    tipo_entidade VARCHAR(2) DEFAULT 'pj' CHECK (tipo_entidade IN ('pf', 'pj')),
    categoria_id UUID REFERENCES categorias_financeiras(id),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE LOGS/AUDITORIA
-- Registro de todas as ações do sistema
CREATE TABLE IF NOT EXISTS logs_financeiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(50),
    entidade_id UUID,
    descricao TEXT,
    dados_antes JSONB,
    dados_depois JSONB,
    usuario VARCHAR(100),
    telefone VARCHAR(20),
    contact_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE RELATÓRIOS ENVIADOS
-- Histórico de relatórios gerados
CREATE TABLE IF NOT EXISTS relatorios_enviados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL,
    periodo_inicio DATE,
    periodo_fim DATE,
    dados JSONB,
    enviado_para VARCHAR(255),
    canal VARCHAR(20) DEFAULT 'whatsapp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EXPANDIR TABELA CLIENTES_FORNECEDORES
-- Adicionar campos do formulário de contrato
ALTER TABLE clientes_fornecedores
ADD COLUMN IF NOT EXISTS razao_social VARCHAR(255),
ADD COLUMN IF NOT EXISTS nacionalidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS profissao VARCHAR(100),
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(50),
ADD COLUMN IF NOT EXISTS cep VARCHAR(10),
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS estado VARCHAR(2),
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS foto_url TEXT,
ADD COLUMN IF NOT EXISTS ghl_contact_id VARCHAR(100);

-- 6. TABELA DE CONTRATOS
-- Gestão de contratos gerados
CREATE TABLE IF NOT EXISTS contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    numero_contrato VARCHAR(50) UNIQUE,

    -- Dados do contrato
    valor_mensal DECIMAL(15,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'USD',
    num_parcelas INTEGER NOT NULL,
    valor_entrada DECIMAL(15,2) DEFAULT 0,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    dia_vencimento INTEGER CHECK (dia_vencimento BETWEEN 1 AND 31),

    -- Status
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviado', 'assinado', 'ativo', 'encerrado', 'cancelado')),

    -- Documento
    conteudo_contrato TEXT,
    pdf_url TEXT,

    -- Assinatura
    assinado_em TIMESTAMP WITH TIME ZONE,
    ip_assinatura VARCHAR(50),

    -- Metadados
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_recorrencias_ativo ON recorrencias(ativo);
CREATE INDEX IF NOT EXISTS idx_recorrencias_dia ON recorrencias(dia_vencimento);
CREATE INDEX IF NOT EXISTS idx_parcelamentos_data ON parcelamentos(data_primeira_parcela);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs_financeiros(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_tipo ON logs_financeiros(tipo_acao);
CREATE INDEX IF NOT EXISTS idx_contratos_cliente ON contratos(cliente_fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);
CREATE INDEX IF NOT EXISTS idx_clientes_ghl ON clientes_fornecedores(ghl_contact_id);

-- 8. VIEW: FLUXO DE CAIXA PROJETADO (próximos 30 dias)
-- Primeiro remove a view existente para evitar conflitos de colunas
DROP VIEW IF EXISTS vw_fluxo_caixa_30dias CASCADE;
CREATE VIEW vw_fluxo_caixa_30dias AS
SELECT
    data_vencimento,
    tipo,
    SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE 0 END) as entradas,
    SUM(CASE WHEN tipo = 'despesa' THEN valor_previsto ELSE 0 END) as saidas,
    SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE -valor_previsto END) as saldo_dia
FROM movimentacoes_financeiras
WHERE
    quitado = false
    AND data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
GROUP BY data_vencimento, tipo
ORDER BY data_vencimento;

-- 9. VIEW: RESUMO DE INADIMPLÊNCIA
-- Primeiro remove a view existente para evitar conflitos de colunas
DROP VIEW IF EXISTS vw_inadimplencia_resumo CASCADE;
CREATE VIEW vw_inadimplencia_resumo AS
SELECT
    c.id as cliente_id,
    c.nome as cliente_nome,
    c.telefone,
    c.email,
    COUNT(m.id) as qtd_titulos_abertos,
    SUM(m.valor_previsto) as valor_total_devido,
    MIN(m.data_vencimento) as vencimento_mais_antigo,
    MAX(CURRENT_DATE - m.data_vencimento) as dias_atraso_max,
    CASE
        WHEN MAX(CURRENT_DATE - m.data_vencimento) <= 7 THEN 'leve'
        WHEN MAX(CURRENT_DATE - m.data_vencimento) <= 30 THEN 'moderado'
        WHEN MAX(CURRENT_DATE - m.data_vencimento) <= 90 THEN 'grave'
        ELSE 'critico'
    END as nivel_risco
FROM movimentacoes_financeiras m
JOIN clientes_fornecedores c ON m.cliente_fornecedor_id = c.id
WHERE
    m.tipo = 'receita'
    AND m.quitado = false
    AND m.data_vencimento < CURRENT_DATE
GROUP BY c.id, c.nome, c.telefone, c.email
ORDER BY valor_total_devido DESC;

-- 10. FUNÇÃO: Gerar número de contrato
CREATE OR REPLACE FUNCTION gerar_numero_contrato()
RETURNS TEXT AS $$
DECLARE
    ano TEXT;
    sequencia INTEGER;
    numero TEXT;
BEGIN
    ano := TO_CHAR(NOW(), 'YYYY');

    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_contrato FROM 5 FOR 4) AS INTEGER)), 0) + 1
    INTO sequencia
    FROM contratos
    WHERE numero_contrato LIKE ano || '-%';

    numero := ano || '-' || LPAD(sequencia::TEXT, 4, '0');

    RETURN numero;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

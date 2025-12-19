-- ===================================
-- SCHEMA FINANCEIRO MOTTIVME SALES
-- Versão: 1.0 - Corrigida
-- ===================================

-- ===================================
-- TABELAS MESTRAS
-- ===================================

-- Clientes e Fornecedores
CREATE TABLE IF NOT EXISTS clientes_fornecedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(20) CHECK (tipo IN ('pessoa_fisica', 'pessoa_juridica')),
    documento VARCHAR(20) UNIQUE NOT NULL, -- CPF ou CNPJ
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco JSONB, -- Flexível para dados de endereço
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorias (hierárquicas: Categoria / Subcategoria)
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    categoria_pai_id UUID REFERENCES categorias(id),
    tipo VARCHAR(20) CHECK (tipo IN ('receita', 'despesa')),
    descricao TEXT,
    cor VARCHAR(7), -- Hex color para dashboard
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contas Bancárias
CREATE TABLE IF NOT EXISTS contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL, -- ex: "BTG MOTTIVME", "BTG HALLEN PF"
    banco VARCHAR(100),
    tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('pj', 'pf')),
    agencia VARCHAR(10),
    numero_conta VARCHAR(20),
    saldo_atual DECIMAL(15,2) DEFAULT 0,
    saldo_atualizado_em TIMESTAMP,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================
-- MOVIMENTAÇÕES FINANCEIRAS
-- ===================================

CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Informações Básicas
    tipo VARCHAR(10) CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
    tipo_entidade VARCHAR(5) CHECK (tipo_entidade IN ('pf', 'pj', 'ambos')),

    -- Datas
    data_competencia DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_realizado DATE,
    data_conciliacao DATE,

    -- Valores
    valor_previsto DECIMAL(15,2) NOT NULL,
    valor_realizado DECIMAL(15,2),
    valor_rateio DECIMAL(15,2),

    -- Impostos e Retenções
    valor_pis DECIMAL(15,2) DEFAULT 0,
    valor_cofins DECIMAL(15,2) DEFAULT 0,
    valor_csll DECIMAL(15,2) DEFAULT 0,
    valor_irrf DECIMAL(15,2) DEFAULT 0,
    valor_inss DECIMAL(15,2) DEFAULT 0,
    valor_iss DECIMAL(15,2) DEFAULT 0,
    valor_retencao DECIMAL(15,2) DEFAULT 0,

    -- Relacionamentos
    cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
    categoria_id UUID REFERENCES categorias(id),
    conta_bancaria_id UUID REFERENCES contas_bancarias(id),

    -- Parcelamento
    tipo_repeticao VARCHAR(20) CHECK (tipo_repeticao IN ('unica', 'mensal', 'customizada')),
    parcela_numero INTEGER,
    parcelas_total INTEGER,

    -- Status
    quitado BOOLEAN DEFAULT false,
    quitado_parcialmente BOOLEAN DEFAULT false,
    conciliado BOOLEAN DEFAULT false,
    boleto_gerado BOOLEAN DEFAULT false,

    -- Pagamento
    forma_pagamento_parcela VARCHAR(100),
    forma_pagamento_quitacao VARCHAR(100),
    taxa_pagamento_percentual DECIMAL(5,2),
    valor_taxa_pagamento DECIMAL(15,2),

    -- Documentação
    numero_nota_fiscal VARCHAR(50),
    numero_documento VARCHAR(50),
    observacao TEXT,
    descricao TEXT,

    -- Tags e Etiquetas
    etiquetas TEXT[], -- Array de tags
    departamento VARCHAR(100),
    vendedor VARCHAR(255),

    -- Moeda estrangeira (para pagamentos em dólar)
    moeda_estrangeira VARCHAR(3), -- USD, EUR, etc
    valor_moeda_estrangeira DECIMAL(15,2),
    cotacao DECIMAL(10,4),

    -- Origem e Renegociação
    origem_renegociacao UUID REFERENCES movimentacoes_financeiras(id),
    transferencia_relacionada_id UUID REFERENCES movimentacoes_financeiras(id),

    -- Metadados
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255),

    -- Índices para performance
    CONSTRAINT valor_positivo CHECK (valor_previsto > 0)
);

-- ===================================
-- DOCUMENTOS E COMPROVANTES
-- ===================================

CREATE TABLE IF NOT EXISTS documentos_financeiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    tipo_documento VARCHAR(50) CHECK (tipo_documento IN (
        'comprovante_pagamento',
        'nota_fiscal',
        'extrato_bancario',
        'contrato',
        'boleto',
        'recibo',
        'outro'
    )),
    nome_arquivo VARCHAR(255) NOT NULL,
    url_storage TEXT NOT NULL, -- URL do Supabase Storage
    tamanho_bytes BIGINT,
    mime_type VARCHAR(100),
    metadata JSONB, -- OCR data, extracted info, etc
    processado BOOLEAN DEFAULT false,
    data_processamento TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================
-- EXTRATOS BANCÁRIOS
-- ===================================

CREATE TABLE IF NOT EXISTS extratos_bancarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conta_bancaria_id UUID REFERENCES contas_bancarias(id),
    data_transacao DATE NOT NULL,
    descricao TEXT,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) CHECK (tipo IN ('credito', 'debito')),
    saldo DECIMAL(15,2),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id), -- Conciliação
    conciliado BOOLEAN DEFAULT false,
    hash_linha TEXT UNIQUE, -- Para evitar duplicatas
    metadata JSONB, -- Dados extras do PDF
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===================================
-- INADIMPLÊNCIA E COBRANÇAS
-- ===================================

CREATE TABLE IF NOT EXISTS inadimplencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    dias_atraso INTEGER DEFAULT 0,
    valor_multa DECIMAL(15,2) DEFAULT 0,
    valor_juros DECIMAL(15,2) DEFAULT 0,
    valor_total DECIMAL(15,2),

    -- Controle de Cobranças
    tentativas_cobranca INTEGER DEFAULT 0,
    ultima_cobranca TIMESTAMP,
    proxima_cobranca TIMESTAMP,
    status_cobranca VARCHAR(50) CHECK (status_cobranca IN (
        'pendente',
        'em_cobranca',
        'negociacao',
        'inadimplente',
        'recuperado',
        'irrecuperavel'
    )) DEFAULT 'pendente',

    -- Negociação
    em_negociacao BOOLEAN DEFAULT false,
    proposta_negociacao JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===================================
-- HISTÓRICO DE COBRANÇAS
-- ===================================

CREATE TABLE IF NOT EXISTS historico_cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inadimplencia_id UUID REFERENCES inadimplencias(id),
    tipo_acao VARCHAR(50) CHECK (tipo_acao IN (
        'email',
        'whatsapp',
        'sms',
        'ligacao',
        'boleto_enviado',
        'negociacao_iniciada',
        'acordo_fechado'
    )),
    mensagem_enviada TEXT,
    resposta_cliente TEXT,
    sucesso BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255)
);

-- ===================================
-- ÍNDICES PARA PERFORMANCE
-- ===================================

CREATE INDEX IF NOT EXISTS idx_movimentacoes_vencimento ON movimentacoes_financeiras(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON movimentacoes_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_quitado ON movimentacoes_financeiras(quitado);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_cliente ON movimentacoes_financeiras(cliente_fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_categoria ON movimentacoes_financeiras(categoria_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_conta ON movimentacoes_financeiras(conta_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_extratos_conciliado ON extratos_bancarios(conciliado);
CREATE INDEX IF NOT EXISTS idx_inadimplencias_status ON inadimplencias(status_cobranca);

-- ===================================
-- VIEWS PARA DASHBOARD
-- ===================================

-- View: Receitas vs Despesas Mensal
CREATE OR REPLACE VIEW vw_fluxo_caixa_mensal AS
SELECT
    TO_CHAR(data_competencia, 'YYYY-MM') as mes_ano,
    tipo_entidade,
    tipo,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras
GROUP BY TO_CHAR(data_competencia, 'YYYY-MM'), tipo_entidade, tipo
ORDER BY mes_ano DESC;

-- View: Inadimplência Resumo
CREATE OR REPLACE VIEW vw_inadimplencia_resumo AS
SELECT
    i.status_cobranca,
    COUNT(*) as quantidade,
    SUM(i.valor_total) as valor_total,
    AVG(i.dias_atraso) as media_dias_atraso
FROM inadimplencias i
WHERE i.status_cobranca != 'recuperado'
GROUP BY i.status_cobranca;

-- View: Top Categorias Despesas
CREATE OR REPLACE VIEW vw_top_categorias_despesas AS
SELECT
    c.nome as categoria,
    m.tipo_entidade,
    SUM(m.valor_previsto) as total_previsto,
    SUM(m.valor_realizado) as total_realizado,
    COUNT(*) as quantidade
FROM movimentacoes_financeiras m
JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY c.nome, m.tipo_entidade
ORDER BY total_previsto DESC
LIMIT 20;

-- View: Movimentações Vencidas (para inadimplência)
CREATE OR REPLACE VIEW vw_movimentacoes_vencidas AS
SELECT
    m.id,
    m.tipo,
    m.data_vencimento,
    m.valor_previsto,
    m.quitado,
    cf.nome as cliente_fornecedor,
    cf.documento,
    cf.telefone,
    cf.email,
    EXTRACT(DAY FROM NOW() - m.data_vencimento)::INTEGER as dias_atraso
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.data_vencimento < CURRENT_DATE
  AND m.quitado = false
  AND m.tipo = 'receita'
ORDER BY m.data_vencimento ASC;

-- ===================================
-- TRIGGERS PARA AUTOMAÇÃO
-- ===================================

-- Trigger: Atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_movimentacoes_updated_at ON movimentacoes_financeiras;
CREATE TRIGGER update_movimentacoes_updated_at
    BEFORE UPDATE ON movimentacoes_financeiras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes_fornecedores;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes_fornecedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inadimplencias_updated_at ON inadimplencias;
CREATE TRIGGER update_inadimplencias_updated_at
    BEFORE UPDATE ON inadimplencias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Criar inadimplência automaticamente
CREATE OR REPLACE FUNCTION criar_inadimplencia_automatica()
RETURNS TRIGGER AS $$
DECLARE
    dias_atraso_calc INTEGER;
BEGIN
    -- Apenas para receitas vencidas e não quitadas
    IF NEW.data_vencimento < CURRENT_DATE
       AND NEW.quitado = false
       AND NEW.tipo = 'receita' THEN

        dias_atraso_calc := EXTRACT(DAY FROM NOW() - NEW.data_vencimento)::INTEGER;

        -- Inserir ou atualizar inadimplência
        INSERT INTO inadimplencias (
            movimentacao_id,
            dias_atraso,
            valor_total,
            status_cobranca
        ) VALUES (
            NEW.id,
            dias_atraso_calc,
            NEW.valor_previsto,
            CASE
                WHEN dias_atraso_calc <= 7 THEN 'pendente'
                WHEN dias_atraso_calc <= 30 THEN 'em_cobranca'
                ELSE 'inadimplente'
            END
        )
        ON CONFLICT (movimentacao_id)
        DO UPDATE SET
            dias_atraso = EXCLUDED.dias_atraso,
            valor_total = EXCLUDED.valor_total,
            status_cobranca = EXCLUDED.status_cobranca,
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar constraint única para evitar duplicatas
ALTER TABLE inadimplencias
DROP CONSTRAINT IF EXISTS inadimplencias_movimentacao_id_key;

ALTER TABLE inadimplencias
ADD CONSTRAINT inadimplencias_movimentacao_id_key
UNIQUE (movimentacao_id);

DROP TRIGGER IF EXISTS trigger_criar_inadimplencia ON movimentacoes_financeiras;
CREATE TRIGGER trigger_criar_inadimplencia
    AFTER INSERT OR UPDATE ON movimentacoes_financeiras
    FOR EACH ROW
    EXECUTE FUNCTION criar_inadimplencia_automatica();

-- ===================================
-- FUNÇÃO: Atualizar dias de atraso
-- ===================================

CREATE OR REPLACE FUNCTION atualizar_dias_atraso()
RETURNS void AS $$
BEGIN
    UPDATE inadimplencias i
    SET dias_atraso = EXTRACT(DAY FROM NOW() - m.data_vencimento)::INTEGER,
        updated_at = NOW()
    FROM movimentacoes_financeiras m
    WHERE i.movimentacao_id = m.id
      AND m.quitado = false;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- COMENTÁRIOS NAS TABELAS
-- ===================================

COMMENT ON TABLE clientes_fornecedores IS 'Cadastro de clientes e fornecedores (PF e PJ)';
COMMENT ON TABLE categorias IS 'Categorias hierárquicas para receitas e despesas';
COMMENT ON TABLE contas_bancarias IS 'Contas bancárias da empresa (PJ e PF dos sócios)';
COMMENT ON TABLE movimentacoes_financeiras IS 'Todas as movimentações financeiras (receitas, despesas, transferências)';
COMMENT ON TABLE documentos_financeiros IS 'Documentos e comprovantes anexados às movimentações';
COMMENT ON TABLE extratos_bancarios IS 'Transações importadas dos extratos bancários';
COMMENT ON TABLE inadimplencias IS 'Controle de inadimplência e cobranças';
COMMENT ON TABLE historico_cobrancas IS 'Histórico de tentativas de cobrança';

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

ALTER TABLE movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_financeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE extratos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inadimplencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_cobrancas ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme autenticação)
-- Por enquanto, permitir tudo para authenticated users

CREATE POLICY "Permitir tudo para usuários autenticados" ON movimentacoes_financeiras
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON clientes_fornecedores
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON documentos_financeiros
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON categorias
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON contas_bancarias
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON extratos_bancarios
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON inadimplencias
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir tudo para usuários autenticados" ON historico_cobrancas
    FOR ALL USING (true) WITH CHECK (true);

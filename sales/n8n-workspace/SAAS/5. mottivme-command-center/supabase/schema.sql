-- ============================================
-- MOTTIVME COMMAND CENTER - SCHEMA SUPABASE
-- ============================================
-- Este schema cobre:
-- 1. Sistema de memória de conversas (substitui Zep)
-- 2. Gestão de produtos e planejamentos
-- 3. Dados reais para dashboard META vs REALIZADO
-- 4. Sistema de aprendizado (taxas históricas)
-- ============================================

-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensão para busca vetorial (opcional, para busca semântica futura)
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 1. SISTEMA DE MEMÓRIA DE CONVERSAS
-- ============================================

-- Tabela de sessões de conversa
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL, -- ID externo (ex: WhatsApp number, user ID)
    user_name TEXT,
    user_email TEXT,
    user_phone TEXT,
    channel TEXT DEFAULT 'web', -- 'web', 'whatsapp', 'instagram', 'telegram'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    model TEXT, -- 'claude-3-opus', 'gpt-4', etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por sessão
CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON chat_messages(created_at DESC);

-- Função para atualizar timestamp de última mensagem
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions
    SET last_message_at = NOW(), updated_at = NOW()
    WHERE session_id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar automaticamente
DROP TRIGGER IF EXISTS trigger_update_last_message ON chat_messages;
CREATE TRIGGER trigger_update_last_message
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_message();

-- ============================================
-- 2. GESTÃO DE EMPRESAS E PRODUTOS
-- ============================================

-- Tabela de empresas (multi-tenancy)
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    email TEXT,
    telefone TEXT,
    logo_url TEXT,
    configuracoes JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    tipo TEXT DEFAULT 'user' CHECK (tipo IN ('admin', 'manager', 'sdr', 'closer', 'user')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    ticket_medio DECIMAL(12,2) DEFAULT 0,
    ciclo_vendas_dias INTEGER DEFAULT 30,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. PLANEJAMENTOS DE VENDAS
-- ============================================

-- Tabela de planejamentos
CREATE TABLE IF NOT EXISTS planejamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),

    -- Período
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    ano INTEGER NOT NULL,
    dia_inicio INTEGER DEFAULT 1,
    dia_fim INTEGER DEFAULT 31,

    -- Modo de cálculo
    modo_calculo TEXT DEFAULT 'forward' CHECK (modo_calculo IN ('forward', 'reverse')),

    -- Inputs principais
    meta_faturamento DECIMAL(12,2), -- Usado no modo reverse
    investimento_diario DECIMAL(12,2), -- Usado no modo forward

    -- Origem das taxas
    origem_taxas TEXT DEFAULT 'estimado' CHECK (origem_taxas IN ('estimado', 'historico', 'blend')),

    -- Taxas de conversão (%)
    cpl DECIMAL(8,2) DEFAULT 8.00, -- Custo por lead
    taxa_qualificacao DECIMAL(5,2) DEFAULT 50.00,
    taxa_agendamento_sdr DECIMAL(5,2) DEFAULT 40.00,
    taxa_comparecimento DECIMAL(5,2) DEFAULT 70.00,
    taxa_conversao_closer DECIMAL(5,2) DEFAULT 20.00,
    ticket_medio DECIMAL(12,2) DEFAULT 2500.00,

    -- Custos operacionais
    custo_sdr DECIMAL(12,2) DEFAULT 3500.00,
    custo_closer DECIMAL(12,2) DEFAULT 6000.00,
    comissao_closer DECIMAL(12,2) DEFAULT 300.00,
    custo_ferramentas DECIMAL(12,2) DEFAULT 800.00,
    outros_custos DECIMAL(12,2) DEFAULT 1500.00,

    -- Capacidades
    mqls_por_sdr INTEGER DEFAULT 150,
    calls_por_closer INTEGER DEFAULT 60,

    -- Resultados calculados
    total_dias INTEGER,
    investimento_total DECIMAL(12,2),
    leads_necessarios INTEGER,
    mqls_necessarios INTEGER,
    calls_agendadas INTEGER,
    calls_realizadas INTEGER,
    vendas_esperadas INTEGER,
    faturamento_esperado DECIMAL(12,2),
    sdrs_necessarios INTEGER,
    closers_necessarios INTEGER,
    cac DECIMAL(12,2),
    roas DECIMAL(8,2),
    lucro_liquido DECIMAL(12,2),
    margem DECIMAL(5,2),

    -- Metadados
    nome_planejamento TEXT,
    descricao TEXT,
    status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativo', 'finalizado', 'arquivado')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_planejamentos_empresa ON planejamentos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_planejamentos_produto ON planejamentos(produto_id);
CREATE INDEX IF NOT EXISTS idx_planejamentos_periodo ON planejamentos(ano, mes);

-- ============================================
-- 4. RESULTADOS REAIS (ALIMENTADO VIA N8N)
-- ============================================

-- Tabela de resultados reais diários
CREATE TABLE IF NOT EXISTS resultados_diarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planejamento_id UUID REFERENCES planejamentos(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,

    data DATE NOT NULL,

    -- Métricas reais do dia
    investimento_dia DECIMAL(12,2) DEFAULT 0,
    leads_gerados INTEGER DEFAULT 0,
    mqls_gerados INTEGER DEFAULT 0,
    calls_agendadas INTEGER DEFAULT 0,
    calls_realizadas INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    vendas_fechadas INTEGER DEFAULT 0,
    faturamento_dia DECIMAL(12,2) DEFAULT 0,

    -- Custos do dia
    custo_equipe DECIMAL(12,2) DEFAULT 0,
    custo_ferramentas DECIMAL(12,2) DEFAULT 0,
    outros_custos DECIMAL(12,2) DEFAULT 0,

    -- Origem dos dados
    fonte TEXT DEFAULT 'manual', -- 'gohighlevel', 'manual', 'n8n', 'api'
    sincronizado_em TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Garantir um registro por dia por planejamento
    UNIQUE(planejamento_id, data)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_resultados_data ON resultados_diarios(data);
CREATE INDEX IF NOT EXISTS idx_resultados_planejamento ON resultados_diarios(planejamento_id);

-- ============================================
-- 5. TAXAS HISTÓRICAS (PARA APRENDIZADO)
-- ============================================

-- Tabela de taxas históricas calculadas mensalmente
CREATE TABLE IF NOT EXISTS taxas_historicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,

    -- Período
    mes INTEGER NOT NULL,
    ano INTEGER NOT NULL,

    -- Taxas calculadas do histórico real
    cpl_real DECIMAL(8,2),
    taxa_qualificacao_real DECIMAL(5,2),
    taxa_agendamento_real DECIMAL(5,2),
    taxa_comparecimento_real DECIMAL(5,2),
    taxa_conversao_real DECIMAL(5,2),
    ticket_medio_real DECIMAL(12,2),

    -- Volumes totais do período
    total_investimento DECIMAL(12,2),
    total_leads INTEGER,
    total_mqls INTEGER,
    total_calls_agendadas INTEGER,
    total_calls_realizadas INTEGER,
    total_vendas INTEGER,
    total_faturamento DECIMAL(12,2),

    -- Métricas calculadas
    cac_real DECIMAL(12,2),
    roas_real DECIMAL(8,2),

    -- Metadados
    dias_com_dados INTEGER, -- Quantos dias tiveram dados reais
    confiabilidade TEXT DEFAULT 'baixa' CHECK (confiabilidade IN ('baixa', 'media', 'alta')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(empresa_id, produto_id, ano, mes)
);

-- ============================================
-- 6. VIEWS ÚTEIS
-- ============================================

-- View: Resumo do planejamento com dados reais
CREATE OR REPLACE VIEW vw_planejamento_vs_real AS
SELECT
    p.id AS planejamento_id,
    p.empresa_id,
    p.produto_id,
    p.mes,
    p.ano,
    p.nome_planejamento,

    -- Metas
    p.faturamento_esperado AS meta_faturamento,
    p.vendas_esperadas AS meta_vendas,
    p.leads_necessarios AS meta_leads,
    p.calls_realizadas AS meta_calls,

    -- Realizado
    COALESCE(SUM(r.faturamento_dia), 0) AS realizado_faturamento,
    COALESCE(SUM(r.vendas_fechadas), 0) AS realizado_vendas,
    COALESCE(SUM(r.leads_gerados), 0) AS realizado_leads,
    COALESCE(SUM(r.calls_realizadas), 0) AS realizado_calls,
    COALESCE(SUM(r.investimento_dia), 0) AS realizado_investimento,

    -- Percentuais
    CASE WHEN p.faturamento_esperado > 0
        THEN ROUND((COALESCE(SUM(r.faturamento_dia), 0) / p.faturamento_esperado) * 100, 1)
        ELSE 0
    END AS pct_faturamento,

    CASE WHEN p.vendas_esperadas > 0
        THEN ROUND((COALESCE(SUM(r.vendas_fechadas), 0)::DECIMAL / p.vendas_esperadas) * 100, 1)
        ELSE 0
    END AS pct_vendas,

    -- Dias
    COUNT(DISTINCT r.data) AS dias_com_dados,
    p.total_dias AS dias_planejados

FROM planejamentos p
LEFT JOIN resultados_diarios r ON r.planejamento_id = p.id
GROUP BY p.id;

-- View: Últimas mensagens por sessão (para contexto)
CREATE OR REPLACE VIEW vw_ultimas_mensagens AS
SELECT DISTINCT ON (session_id)
    session_id,
    content AS ultima_mensagem,
    role AS ultimo_role,
    created_at AS ultima_interacao
FROM chat_messages
ORDER BY session_id, created_at DESC;

-- ============================================
-- 7. FUNÇÕES ÚTEIS
-- ============================================

-- Função: Buscar histórico de conversa (últimas N mensagens)
CREATE OR REPLACE FUNCTION get_chat_history(
    p_session_id TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    role TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.role, m.content, m.created_at
    FROM chat_messages m
    WHERE m.session_id = p_session_id
    ORDER BY m.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Função: Calcular taxas históricas de um produto
CREATE OR REPLACE FUNCTION calcular_taxas_historicas(
    p_empresa_id UUID,
    p_produto_id UUID,
    p_mes INTEGER,
    p_ano INTEGER
)
RETURNS VOID AS $$
DECLARE
    v_dados RECORD;
BEGIN
    -- Buscar totais do período
    SELECT
        COALESCE(SUM(investimento_dia), 0) AS total_inv,
        COALESCE(SUM(leads_gerados), 0) AS total_leads,
        COALESCE(SUM(mqls_gerados), 0) AS total_mqls,
        COALESCE(SUM(calls_agendadas), 0) AS total_agendadas,
        COALESCE(SUM(calls_realizadas), 0) AS total_realizadas,
        COALESCE(SUM(vendas_fechadas), 0) AS total_vendas,
        COALESCE(SUM(faturamento_dia), 0) AS total_fat,
        COUNT(DISTINCT data) AS dias
    INTO v_dados
    FROM resultados_diarios
    WHERE empresa_id = p_empresa_id
      AND produto_id = p_produto_id
      AND EXTRACT(MONTH FROM data) = p_mes
      AND EXTRACT(YEAR FROM data) = p_ano;

    -- Inserir ou atualizar taxas
    INSERT INTO taxas_historicas (
        empresa_id, produto_id, mes, ano,
        cpl_real,
        taxa_qualificacao_real,
        taxa_agendamento_real,
        taxa_comparecimento_real,
        taxa_conversao_real,
        ticket_medio_real,
        total_investimento, total_leads, total_mqls,
        total_calls_agendadas, total_calls_realizadas,
        total_vendas, total_faturamento,
        cac_real, roas_real,
        dias_com_dados,
        confiabilidade
    )
    VALUES (
        p_empresa_id, p_produto_id, p_mes, p_ano,
        CASE WHEN v_dados.total_leads > 0 THEN v_dados.total_inv / v_dados.total_leads ELSE NULL END,
        CASE WHEN v_dados.total_leads > 0 THEN (v_dados.total_mqls::DECIMAL / v_dados.total_leads) * 100 ELSE NULL END,
        CASE WHEN v_dados.total_mqls > 0 THEN (v_dados.total_agendadas::DECIMAL / v_dados.total_mqls) * 100 ELSE NULL END,
        CASE WHEN v_dados.total_agendadas > 0 THEN (v_dados.total_realizadas::DECIMAL / v_dados.total_agendadas) * 100 ELSE NULL END,
        CASE WHEN v_dados.total_realizadas > 0 THEN (v_dados.total_vendas::DECIMAL / v_dados.total_realizadas) * 100 ELSE NULL END,
        CASE WHEN v_dados.total_vendas > 0 THEN v_dados.total_fat / v_dados.total_vendas ELSE NULL END,
        v_dados.total_inv, v_dados.total_leads, v_dados.total_mqls,
        v_dados.total_agendadas, v_dados.total_realizadas,
        v_dados.total_vendas, v_dados.total_fat,
        CASE WHEN v_dados.total_vendas > 0 THEN v_dados.total_inv / v_dados.total_vendas ELSE NULL END,
        CASE WHEN v_dados.total_inv > 0 THEN v_dados.total_fat / v_dados.total_inv ELSE NULL END,
        v_dados.dias,
        CASE
            WHEN v_dados.dias >= 20 THEN 'alta'
            WHEN v_dados.dias >= 10 THEN 'media'
            ELSE 'baixa'
        END
    )
    ON CONFLICT (empresa_id, produto_id, ano, mes)
    DO UPDATE SET
        cpl_real = EXCLUDED.cpl_real,
        taxa_qualificacao_real = EXCLUDED.taxa_qualificacao_real,
        taxa_agendamento_real = EXCLUDED.taxa_agendamento_real,
        taxa_comparecimento_real = EXCLUDED.taxa_comparecimento_real,
        taxa_conversao_real = EXCLUDED.taxa_conversao_real,
        ticket_medio_real = EXCLUDED.ticket_medio_real,
        total_investimento = EXCLUDED.total_investimento,
        total_leads = EXCLUDED.total_leads,
        total_mqls = EXCLUDED.total_mqls,
        total_calls_agendadas = EXCLUDED.total_calls_agendadas,
        total_calls_realizadas = EXCLUDED.total_calls_realizadas,
        total_vendas = EXCLUDED.total_vendas,
        total_faturamento = EXCLUDED.total_faturamento,
        cac_real = EXCLUDED.cac_real,
        roas_real = EXCLUDED.roas_real,
        dias_com_dados = EXCLUDED.dias_com_dados,
        confiabilidade = EXCLUDED.confiabilidade;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE planejamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_diarios ENABLE ROW LEVEL SECURITY;

-- Políticas serão adicionadas quando implementar autenticação

-- ============================================
-- 9. DADOS INICIAIS (SEED)
-- ============================================

-- Inserir empresa de exemplo
INSERT INTO empresas (id, nome, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Mottivme', 'contato@mottivme.com')
ON CONFLICT DO NOTHING;

-- Inserir produto de exemplo
INSERT INTO produtos (id, empresa_id, nome, ticket_medio)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Consultoria BPO', 2500.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Criação das tabelas para o Dashboard Comercial Mottivme Sales
-- Executar este script para criar toda a estrutura do banco de dados

-- 1. Tabela de Usuários/Colaboradores
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    tipo_usuario VARCHAR(50) NOT NULL CHECK (tipo_usuario IN ('SDR', 'CLOSER', 'ADMIN')),
    equipe VARCHAR(50) NOT NULL CHECK (equipe IN ('equipe-a', 'equipe-b')),
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Dados Históricos Mensais
CREATE TABLE IF NOT EXISTS dados_historicos (
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes VARCHAR(20) NOT NULL,
    equipe VARCHAR(50) NOT NULL CHECK (equipe IN ('equipe-a', 'equipe-b')),
    
    -- Investimentos
    inv_trafego DECIMAL(12,2) NOT NULL,
    inv_bpo DECIMAL(12,2) NOT NULL,
    sal DECIMAL(12,2) NOT NULL,
    
    -- Métricas de Performance
    pct_agd DECIMAL(5,2) NOT NULL,
    leads_agd INTEGER NOT NULL,
    tt_calls INTEGER NOT NULL,
    pct_ganhos DECIMAL(5,2) NOT NULL,
    tt_ganhos INTEGER NOT NULL,
    
    -- Detalhamento por Canal
    tl_agd_traf INTEGER NOT NULL,
    tl_agd_bpo INTEGER NOT NULL,
    calls_traf INTEGER NOT NULL,
    calls_bpo INTEGER NOT NULL,
    ganhos_traf INTEGER NOT NULL,
    ganhos_bpo INTEGER NOT NULL,
    
    -- Custos por Canal
    cpl_traf DECIMAL(10,2) NOT NULL,
    cpl_bpo DECIMAL(10,2) NOT NULL,
    cpra_traf DECIMAL(10,2) NOT NULL,
    cpra_bpo DECIMAL(10,2) NOT NULL,
    cpa_traf DECIMAL(10,2) NOT NULL,
    cpa_bpo DECIMAL(10,2) NOT NULL,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(ano, mes, equipe)
);

-- 3. Tabela de Leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50),
    
    -- Classificação do Lead
    fonte_lead VARCHAR(100) NOT NULL,
    canal_chat VARCHAR(50) CHECK (canal_chat IN ('instagram', 'whatsapp')),
    tem_permissao_trabalho BOOLEAN DEFAULT false,
    
    -- Status do Lead
    status VARCHAR(50) NOT NULL DEFAULT 'prospectado' 
        CHECK (status IN ('prospectado', 'lead', 'qualificado', 'agendado', 'no_show', 'call_realizada', 'ganho', 'perdido')),
    
    -- Relacionamentos
    usuario_responsavel_id INTEGER REFERENCES usuarios(id),
    equipe VARCHAR(50) NOT NULL CHECK (equipe IN ('equipe-a', 'equipe-b')),
    
    -- Datas importantes
    data_prospeccao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_qualificacao TIMESTAMP,
    data_agendamento TIMESTAMP,
    data_call TIMESTAMP,
    data_fechamento TIMESTAMP,
    
    -- Valores
    ticket_medio DECIMAL(10,2),
    valor_fechamento DECIMAL(10,2),
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Fontes de Lead BPOSS
CREATE TABLE IF NOT EXISTS fontes_lead_bposs (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    total_leads INTEGER DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Funil de Vendas (dados agregados por período)
CREATE TABLE IF NOT EXISTS funil_vendas (
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes VARCHAR(20) NOT NULL,
    canal VARCHAR(50) NOT NULL CHECK (canal IN ('trafego', 'bpo', 'total')),
    
    -- Métricas do Funil
    prospec INTEGER NOT NULL DEFAULT 0,
    lead INTEGER NOT NULL DEFAULT 0,
    qualif INTEGER NOT NULL DEFAULT 0,
    agend INTEGER NOT NULL DEFAULT 0,
    no_show INTEGER NOT NULL DEFAULT 0,
    calls INTEGER NOT NULL DEFAULT 0,
    ganho INTEGER NOT NULL DEFAULT 0,
    perdido INTEGER NOT NULL DEFAULT 0,
    tx_conv DECIMAL(5,2) NOT NULL DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(ano, mes, canal)
);

-- 6. Tabela de Ranking SDRs (Motivados)
CREATE TABLE IF NOT EXISTS ranking_sdrs (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ano INTEGER NOT NULL,
    mes VARCHAR(20) NOT NULL,
    
    -- Métricas de Performance
    leads_agendados INTEGER NOT NULL DEFAULT 0,
    total_calls INTEGER NOT NULL DEFAULT 0,
    taxa_conversao DECIMAL(5,2) NOT NULL DEFAULT 0,
    
    -- Ranking
    posicao_ranking INTEGER,
    pontuacao DECIMAL(10,2) DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(usuario_id, ano, mes)
);

-- 7. Tabela de Ranking Closers (Clientes)
CREATE TABLE IF NOT EXISTS ranking_closers (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ano INTEGER NOT NULL,
    mes VARCHAR(20) NOT NULL,
    
    -- Métricas de Performance
    tt_lead INTEGER NOT NULL DEFAULT 0,
    tx_qualif_agd DECIMAL(5,2) NOT NULL DEFAULT 0,
    leads_agend INTEGER NOT NULL DEFAULT 0,
    ticket_medio DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_vendas DECIMAL(12,2) NOT NULL DEFAULT 0,
    
    -- Ranking
    posicao_ranking INTEGER,
    pontuacao DECIMAL(10,2) DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(usuario_id, ano, mes)
);

-- 8. Tabela de Métricas de Evolução
CREATE TABLE IF NOT EXISTS metricas_evolucao (
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes VARCHAR(20) NOT NULL,
    
    -- Leads vs Reuniões
    total_leads INTEGER NOT NULL DEFAULT 0,
    reunioes_agendadas INTEGER NOT NULL DEFAULT 0,
    
    -- Custo por Reunião
    custo_por_reuniao DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Leads por Tipo
    leads_agend_otb INTEGER NOT NULL DEFAULT 0,
    leads_agend_traf INTEGER NOT NULL DEFAULT 0,
    
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(ano, mes)
);

-- 9. Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabela de Logs de Atividades
CREATE TABLE IF NOT EXISTS logs_atividades (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    acao VARCHAR(100) NOT NULL,
    tabela_afetada VARCHAR(100),
    registro_id INTEGER,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dados_historicos_ano_mes ON dados_historicos(ano, mes);
CREATE INDEX IF NOT EXISTS idx_dados_historicos_equipe ON dados_historicos(equipe);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_fonte ON leads(fonte_lead);
CREATE INDEX IF NOT EXISTS idx_leads_usuario ON leads(usuario_responsavel_id);
CREATE INDEX IF NOT EXISTS idx_leads_data_criacao ON leads(data_criacao);
CREATE INDEX IF NOT EXISTS idx_funil_vendas_ano_mes ON funil_vendas(ano, mes);
CREATE INDEX IF NOT EXISTS idx_ranking_sdrs_ano_mes ON ranking_sdrs(ano, mes);
CREATE INDEX IF NOT EXISTS idx_ranking_closers_ano_mes ON ranking_closers(ano, mes);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarios_equipe ON usuarios(equipe);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_atividades(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_data ON logs_atividades(data_criacao);

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema (SDRs, Closers, Admins)';
COMMENT ON TABLE dados_historicos IS 'Dados históricos mensais de performance por equipe';
COMMENT ON TABLE leads IS 'Tabela principal de leads e seu status no funil';
COMMENT ON TABLE fontes_lead_bposs IS 'Fontes de leads do sistema BPOSS';
COMMENT ON TABLE funil_vendas IS 'Dados agregados do funil de vendas por período';
COMMENT ON TABLE ranking_sdrs IS 'Ranking mensal dos SDRs por performance';
COMMENT ON TABLE ranking_closers IS 'Ranking mensal dos Closers por performance';
COMMENT ON TABLE metricas_evolucao IS 'Métricas de evolução temporal do negócio';
COMMENT ON TABLE configuracoes IS 'Configurações gerais do sistema';
COMMENT ON TABLE logs_atividades IS 'Log de todas as atividades do sistema';

-- Criar função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger de atualização automática em todas as tabelas relevantes
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dados_historicos_updated_at BEFORE UPDATE ON dados_historicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funil_vendas_updated_at BEFORE UPDATE ON funil_vendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ranking_sdrs_updated_at BEFORE UPDATE ON ranking_sdrs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ranking_closers_updated_at BEFORE UPDATE ON ranking_closers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metricas_evolucao_updated_at BEFORE UPDATE ON metricas_evolucao FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

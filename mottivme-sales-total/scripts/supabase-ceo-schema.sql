-- =============================================================================
-- SCHEMA MOTTIVME CEO - Supabase (bfumywvwubvernvhjehk)
-- Criado em: 2025-12-16
-- Descricao: Tabelas para sistema de agentes IA e analise de calls
-- =============================================================================

-- Habilitar extensao UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. TABELA: clients
-- Descricao: Clientes da Mottivme
-- =============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ghl_contact_id TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT,
  email TEXT,
  vertical TEXT CHECK (vertical IN ('clinicas', 'financeiro', 'servicos', 'mentores', 'outros')),
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'cliente', 'churned', 'reativado')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para clients
CREATE INDEX IF NOT EXISTS idx_clients_ghl_contact_id ON clients(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_vertical ON clients(vertical);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

COMMENT ON TABLE clients IS 'Clientes da Mottivme - sincronizado com GHL';
COMMENT ON COLUMN clients.ghl_contact_id IS 'ID do contato no GoHighLevel';
COMMENT ON COLUMN clients.vertical IS 'Vertical de negocio: clinicas, financeiro, servicos, mentores';
COMMENT ON COLUMN clients.status IS 'Status do cliente: prospect, cliente, churned, reativado';

-- =============================================================================
-- 2. TABELA: agent_versions
-- Descricao: Versoes dos agentes IA gerados para cada cliente
-- =============================================================================
CREATE TABLE IF NOT EXISTS agent_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  versao TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  tools_config JSONB DEFAULT '{}',
  compliance_rules JSONB DEFAULT '{}',
  personality_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT FALSE,
  created_from_call_id TEXT,
  deployment_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,

  CONSTRAINT unique_client_version UNIQUE(client_id, versao)
);

-- Indices para agent_versions
CREATE INDEX IF NOT EXISTS idx_agent_versions_client_id ON agent_versions(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_versions_is_active ON agent_versions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_agent_versions_created_at ON agent_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_versions_created_from_call ON agent_versions(created_from_call_id);

COMMENT ON TABLE agent_versions IS 'Versoes dos agentes IA - cada cliente pode ter multiplas versoes';
COMMENT ON COLUMN agent_versions.versao IS 'Versao semantica: v1.0, v1.1, v2.0, etc.';
COMMENT ON COLUMN agent_versions.system_prompt IS 'Prompt principal do agente';
COMMENT ON COLUMN agent_versions.tools_config IS 'Configuracao das tools disponiveis';
COMMENT ON COLUMN agent_versions.compliance_rules IS 'Regras de compliance e limitacoes';
COMMENT ON COLUMN agent_versions.personality_config IS 'Configuracao de personalidade e tom';
COMMENT ON COLUMN agent_versions.created_from_call_id IS 'ID da Analise de Call no GHL que originou esta versao';

-- =============================================================================
-- 3. TABELA: agent_metrics
-- Descricao: Metricas diarias de performance dos agentes
-- =============================================================================
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_version_id UUID REFERENCES agent_versions(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  total_conversas INT DEFAULT 0,
  conversas_resolvidas INT DEFAULT 0,
  escalations INT DEFAULT 0,
  tempo_medio_resposta_seg INT,
  satisfacao_media DECIMAL(3,2) CHECK (satisfacao_media >= 0 AND satisfacao_media <= 5),
  tokens_consumidos INT DEFAULT 0,
  custo_estimado DECIMAL(10,4) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_agent_date UNIQUE(agent_version_id, data)
);

-- Indices para agent_metrics
CREATE INDEX IF NOT EXISTS idx_agent_metrics_version_id ON agent_metrics(agent_version_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_data ON agent_metrics(data DESC);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_version_date ON agent_metrics(agent_version_id, data DESC);

COMMENT ON TABLE agent_metrics IS 'Metricas diarias agregadas por versao de agente';
COMMENT ON COLUMN agent_metrics.satisfacao_media IS 'Score de satisfacao 0.00 a 5.00';
COMMENT ON COLUMN agent_metrics.tempo_medio_resposta_seg IS 'Tempo medio de resposta em segundos';

-- =============================================================================
-- 4. TABELA: call_recordings
-- Descricao: Gravacoes de calls e suas analises
-- =============================================================================
CREATE TABLE IF NOT EXISTS call_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('diagnostico', 'kickoff', 'acompanhamento', 'suporte', 'alinhamento', 'outro')),
  titulo TEXT,
  gdrive_file_id TEXT,
  gdrive_url TEXT,
  transcricao TEXT,
  analise_json JSONB DEFAULT '{}',
  ghl_call_analysis_id TEXT,
  duracao_minutos INT,
  participantes TEXT[],
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'analisado', 'erro')),
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para call_recordings
CREATE INDEX IF NOT EXISTS idx_call_recordings_client_id ON call_recordings(client_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_tipo ON call_recordings(tipo);
CREATE INDEX IF NOT EXISTS idx_call_recordings_status ON call_recordings(status);
CREATE INDEX IF NOT EXISTS idx_call_recordings_created_at ON call_recordings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_recordings_ghl_id ON call_recordings(ghl_call_analysis_id);
CREATE INDEX IF NOT EXISTS idx_call_recordings_gdrive_id ON call_recordings(gdrive_file_id);

COMMENT ON TABLE call_recordings IS 'Gravacoes de calls de vendas, onboarding, revisao, etc.';
COMMENT ON COLUMN call_recordings.tipo IS 'Tipo da call: diagnostico, kickoff, acompanhamento, suporte, alinhamento';
COMMENT ON COLUMN call_recordings.analise_json IS 'Output completo do workflow de analise (scores, objecoes, etc.)';
COMMENT ON COLUMN call_recordings.ghl_call_analysis_id IS 'ID do Custom Object Analises de Call no GHL';

-- =============================================================================
-- 5. TABELA: churn_reasons
-- Descricao: Motivos de churn extraidos de calls de alinhamento
-- =============================================================================
CREATE TABLE IF NOT EXISTS churn_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  call_recording_id UUID REFERENCES call_recordings(id) ON DELETE SET NULL,
  motivo_principal TEXT NOT NULL,
  motivos_secundarios TEXT[] DEFAULT '{}',
  categoria TEXT CHECK (categoria IN ('preco', 'resultado', 'atendimento', 'produto', 'concorrencia', 'interno', 'outro')),
  valor_contrato DECIMAL(10,2),
  meses_ativo INT,
  recuperavel BOOLEAN DEFAULT FALSE,
  probabilidade_recuperacao INT CHECK (probabilidade_recuperacao >= 0 AND probabilidade_recuperacao <= 100),
  acao_sugerida TEXT,
  acao_tomada TEXT,
  resultado_acao TEXT CHECK (resultado_acao IN ('recuperado', 'perdido_definitivo', 'em_andamento', NULL)),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para churn_reasons
CREATE INDEX IF NOT EXISTS idx_churn_reasons_client_id ON churn_reasons(client_id);
CREATE INDEX IF NOT EXISTS idx_churn_reasons_categoria ON churn_reasons(categoria);
CREATE INDEX IF NOT EXISTS idx_churn_reasons_recuperavel ON churn_reasons(recuperavel) WHERE recuperavel = TRUE;
CREATE INDEX IF NOT EXISTS idx_churn_reasons_created_at ON churn_reasons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_churn_reasons_resultado ON churn_reasons(resultado_acao);

COMMENT ON TABLE churn_reasons IS 'Analise de motivos de churn para inteligencia de produto';
COMMENT ON COLUMN churn_reasons.categoria IS 'Categoria: preco, resultado, atendimento, produto, concorrencia, interno, outro';
COMMENT ON COLUMN churn_reasons.recuperavel IS 'Se o cliente e potencialmente recuperavel';

-- =============================================================================
-- 6. FUNCOES E TRIGGERS
-- =============================================================================

-- Funcao para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para clients
DROP TRIGGER IF EXISTS trigger_clients_updated_at ON clients;
CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para churn_reasons
DROP TRIGGER IF EXISTS trigger_churn_reasons_updated_at ON churn_reasons;
CREATE TRIGGER trigger_churn_reasons_updated_at
  BEFORE UPDATE ON churn_reasons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 7. FUNCAO PARA DESATIVAR VERSOES ANTERIORES AO ATIVAR NOVA
-- =============================================================================

CREATE OR REPLACE FUNCTION deactivate_previous_agent_versions()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a nova versao esta sendo ativada
  IF NEW.is_active = TRUE AND (OLD.is_active IS NULL OR OLD.is_active = FALSE) THEN
    -- Desativa todas as outras versoes do mesmo cliente
    UPDATE agent_versions
    SET
      is_active = FALSE,
      deprecated_at = CASE WHEN deprecated_at IS NULL THEN NOW() ELSE deprecated_at END
    WHERE client_id = NEW.client_id
      AND id != NEW.id
      AND is_active = TRUE;

    -- Define deployed_at se ainda nao foi definido
    IF NEW.deployed_at IS NULL THEN
      NEW.deployed_at = NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deactivate_previous_versions ON agent_versions;
CREATE TRIGGER trigger_deactivate_previous_versions
  BEFORE UPDATE ON agent_versions
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_previous_agent_versions();

-- =============================================================================
-- 8. VIEWS UTEIS
-- =============================================================================

-- View: Agentes ativos por cliente
CREATE OR REPLACE VIEW v_active_agents AS
SELECT
  c.id AS client_id,
  c.nome AS client_nome,
  c.empresa,
  c.vertical,
  av.id AS agent_version_id,
  av.versao,
  av.deployed_at,
  av.created_from_call_id
FROM clients c
LEFT JOIN agent_versions av ON c.id = av.client_id AND av.is_active = TRUE
WHERE c.status = 'cliente';

COMMENT ON VIEW v_active_agents IS 'Agentes ativos por cliente';

-- View: Metricas agregadas dos ultimos 30 dias por cliente
CREATE OR REPLACE VIEW v_agent_performance_30d AS
SELECT
  c.id AS client_id,
  c.nome AS client_nome,
  av.versao,
  COUNT(am.id) AS dias_com_dados,
  SUM(am.total_conversas) AS total_conversas,
  SUM(am.conversas_resolvidas) AS total_resolvidas,
  SUM(am.escalations) AS total_escalations,
  ROUND(AVG(am.satisfacao_media), 2) AS satisfacao_media,
  ROUND(AVG(am.tempo_medio_resposta_seg), 0) AS tempo_medio_resposta,
  SUM(am.tokens_consumidos) AS total_tokens,
  SUM(am.custo_estimado) AS custo_total
FROM clients c
JOIN agent_versions av ON c.id = av.client_id AND av.is_active = TRUE
LEFT JOIN agent_metrics am ON av.id = am.agent_version_id
  AND am.data >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.id, c.nome, av.versao;

COMMENT ON VIEW v_agent_performance_30d IS 'Performance dos agentes nos ultimos 30 dias';

-- View: Resumo de churn por categoria
CREATE OR REPLACE VIEW v_churn_summary AS
SELECT
  categoria,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE recuperavel = TRUE) AS recuperaveis,
  COUNT(*) FILTER (WHERE resultado_acao = 'recuperado') AS recuperados,
  ROUND(AVG(valor_contrato), 2) AS ticket_medio,
  ROUND(AVG(meses_ativo), 1) AS meses_ativos_medio
FROM churn_reasons
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY categoria
ORDER BY total DESC;

COMMENT ON VIEW v_churn_summary IS 'Resumo de churn por categoria (ultimos 90 dias)';

-- =============================================================================
-- 9. RLS (Row Level Security) - Desabilitado por enquanto
-- =============================================================================
-- Para habilitar RLS no futuro, descomentar as linhas abaixo e criar policies

-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agent_versions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE call_recordings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE churn_reasons ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FIM DO SCRIPT
-- =============================================================================

-- Verificacao final
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('clients', 'agent_versions', 'agent_metrics', 'call_recordings', 'churn_reasons')
ORDER BY table_name;

-- =====================================================
-- TABELAS DO ECOSSISTEMA DE VENDAS MOTTIVME
-- Integracao GHL + Supabase + n8n + AI Agents
-- Dezembro 2025
-- =====================================================

BEGIN;

-- =====================================================
-- sales_leads - Lead centralizado com dados do GHL
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificadores externos
  ghl_contact_id VARCHAR(100) UNIQUE,
  ghl_location_id VARCHAR(100),

  -- Dados basicos
  nome VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(50),
  empresa VARCHAR(255),

  -- Classificacao (sync com Custom Fields GHL)
  vertical VARCHAR(50), -- clinica, financeiro, mentor, servico
  source_channel VARCHAR(50), -- ads_meta, ads_google, organico, indicacao, whatsapp, instagram, linkedin, email, site
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),

  -- Status do funil
  etapa_funil VARCHAR(50), -- novo, contato_feito, qualificado, agendado, proposta_enviada, negociacao, fechado, perdido
  current_agent VARCHAR(50), -- none, secretaria, sdr, qualifier, scheduler, closer, onboarder

  -- Metadados
  tags TEXT[],
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  primeiro_contato_at TIMESTAMPTZ,
  ultimo_contato_at TIMESTAMPTZ,
  qualificado_at TIMESTAMPTZ,
  fechado_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- sales_propostas - Propostas enviadas (Propostal)
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamentos
  lead_id UUID REFERENCES sales_leads(id) ON DELETE CASCADE,
  ghl_contact_id VARCHAR(100),

  -- Dados da proposta
  proposal_url TEXT,
  proposal_code VARCHAR(50) UNIQUE, -- codigo unico para acesso
  titulo VARCHAR(255),
  valor_total DECIMAL(15,2),

  -- Tracking de engajamento (sync com Custom Fields GHL)
  proposal_score INTEGER DEFAULT 0 CHECK (proposal_score >= 0 AND proposal_score <= 100),
  proposal_status VARCHAR(50) DEFAULT 'nao_enviada', -- nao_enviada, enviada, vista, quente, aceita, recusada

  -- Metricas de engajamento
  tempo_total_segundos INTEGER DEFAULT 0,
  visualizacoes INTEGER DEFAULT 0,
  secoes_vistas TEXT[],
  scroll_max_percent INTEGER DEFAULT 0,
  cliques_cta INTEGER DEFAULT 0,

  -- Luna Chat
  chat_messages INTEGER DEFAULT 0,
  chat_sentiment VARCHAR(20), -- positive, neutral, negative

  -- Timestamps
  enviada_at TIMESTAMPTZ,
  primeira_visualizacao_at TIMESTAMPTZ,
  ultima_visualizacao_at TIMESTAMPTZ,
  aceita_at TIMESTAMPTZ,
  recusada_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- sales_agent_interactions - Log de acoes dos agentes IA
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamentos
  lead_id UUID REFERENCES sales_leads(id) ON DELETE CASCADE,
  ghl_contact_id VARCHAR(100),
  proposta_id UUID REFERENCES sales_propostas(id) ON DELETE SET NULL,

  -- Identificacao do agente
  agent_name VARCHAR(50) NOT NULL, -- secretaria, sdr, qualifier, scheduler, closer, onboarder, luna
  agent_version VARCHAR(20),

  -- Tipo de acao
  action_type VARCHAR(50) NOT NULL, -- message_sent, message_received, call_made, schedule_created, qualify_updated, escalation, error
  action_subtype VARCHAR(50), -- follow_up, initial_contact, reminder, etc

  -- Conteudo
  input_data JSONB, -- o que o agente recebeu
  output_data JSONB, -- o que o agente produziu
  message_content TEXT, -- mensagem enviada/recebida

  -- Resultado
  success BOOLEAN DEFAULT true,
  error_message TEXT,

  -- Metricas
  duration_ms INTEGER,
  tokens_used INTEGER,
  model_used VARCHAR(50),
  cost_usd DECIMAL(10,6),

  -- Contexto
  channel VARCHAR(50), -- whatsapp, email, chat, phone
  vertical VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- sales_metrics - Metricas agregadas por periodo
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Periodo
  period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly
  period_date DATE NOT NULL,

  -- Dimensoes
  vertical VARCHAR(50), -- NULL = todas
  agent_name VARCHAR(50), -- NULL = todos
  source_channel VARCHAR(50), -- NULL = todos

  -- Metricas de volume
  leads_novos INTEGER DEFAULT 0,
  leads_qualificados INTEGER DEFAULT 0,
  agendamentos INTEGER DEFAULT 0,
  propostas_enviadas INTEGER DEFAULT 0,
  propostas_aceitas INTEGER DEFAULT 0,
  fechamentos INTEGER DEFAULT 0,

  -- Metricas de valor
  valor_pipeline DECIMAL(15,2) DEFAULT 0,
  valor_fechado DECIMAL(15,2) DEFAULT 0,
  ticket_medio DECIMAL(15,2) DEFAULT 0,

  -- Metricas de conversao
  taxa_qualificacao DECIMAL(5,2),
  taxa_agendamento DECIMAL(5,2),
  taxa_fechamento DECIMAL(5,2),

  -- Metricas de engajamento (Propostal)
  avg_proposal_score DECIMAL(5,2),
  avg_time_on_proposal INTEGER, -- segundos

  -- Metricas de agentes
  total_interactions INTEGER DEFAULT 0,
  successful_interactions INTEGER DEFAULT 0,
  avg_response_time_seconds INTEGER,

  -- Custos
  custo_llm_total DECIMAL(10,2) DEFAULT 0,
  custo_por_lead DECIMAL(10,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint para evitar duplicatas
  UNIQUE(period_type, period_date, vertical, agent_name, source_channel)
);

-- =====================================================
-- sales_alerts - Alertas do sistema (Sentinel)
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relacionamentos opcionais
  lead_id UUID REFERENCES sales_leads(id) ON DELETE SET NULL,
  proposta_id UUID REFERENCES sales_propostas(id) ON DELETE SET NULL,

  -- Tipo de alerta
  alert_type VARCHAR(50) NOT NULL, -- hot_lead, proposal_viewed, score_threshold, agent_error, sla_breach, anomaly
  severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical

  -- Conteudo
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB,

  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, notified, acknowledged, resolved

  -- Notificacao
  notified_via TEXT[], -- whatsapp, email, slack
  notified_at TIMESTAMPTZ,
  acknowledged_by VARCHAR(100),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- sales_pipelines - Configuracao de pipelines por vertical
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  vertical VARCHAR(50) NOT NULL UNIQUE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,

  -- Configuracao GHL
  ghl_pipeline_id VARCHAR(100),
  ghl_location_id VARCHAR(100),

  -- Etapas do funil (ordem de exibicao)
  etapas JSONB DEFAULT '[]', -- [{nome, cor, ordem, sla_horas, agente_responsavel}]

  -- Configuracoes de agentes
  agentes_config JSONB DEFAULT '{}', -- {secretaria: {prompt_id, enabled}, sdr: {...}}

  -- SLAs
  sla_primeiro_contato_minutos INTEGER DEFAULT 5,
  sla_qualificacao_horas INTEGER DEFAULT 24,
  sla_proposta_horas INTEGER DEFAULT 48,

  -- Status
  ativo BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- sales_prompts - Prompts dos agentes (versionados)
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  agent_name VARCHAR(50) NOT NULL,
  vertical VARCHAR(50), -- NULL = prompt base
  version VARCHAR(20) NOT NULL,

  -- Conteudo
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT,
  tools_config JSONB,

  -- Metadados
  nome VARCHAR(255),
  descricao TEXT,
  framework_usado VARCHAR(50), -- critics, nepq, sexy_canvas

  -- Versionamento
  is_active BOOLEAN DEFAULT false,
  is_base BOOLEAN DEFAULT false, -- true = prompt base que outros herdam
  parent_prompt_id UUID REFERENCES sales_prompts(id),

  -- Performance
  total_uses INTEGER DEFAULT 0,
  avg_success_rate DECIMAL(5,2),
  avg_response_time_ms INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,

  -- Unique para versao ativa por agente+vertical
  UNIQUE(agent_name, vertical, version)
);

-- =====================================================
-- INDICES PARA PERFORMANCE
-- =====================================================

-- sales_leads
CREATE INDEX IF NOT EXISTS idx_sales_leads_ghl_contact ON sales_leads(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_vertical ON sales_leads(vertical);
CREATE INDEX IF NOT EXISTS idx_sales_leads_etapa ON sales_leads(etapa_funil);
CREATE INDEX IF NOT EXISTS idx_sales_leads_score ON sales_leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_sales_leads_created ON sales_leads(created_at);

-- sales_propostas
CREATE INDEX IF NOT EXISTS idx_sales_propostas_lead ON sales_propostas(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_propostas_ghl ON sales_propostas(ghl_contact_id);
CREATE INDEX IF NOT EXISTS idx_sales_propostas_status ON sales_propostas(proposal_status);
CREATE INDEX IF NOT EXISTS idx_sales_propostas_score ON sales_propostas(proposal_score);

-- sales_agent_interactions
CREATE INDEX IF NOT EXISTS idx_sales_interactions_lead ON sales_agent_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_interactions_agent ON sales_agent_interactions(agent_name);
CREATE INDEX IF NOT EXISTS idx_sales_interactions_type ON sales_agent_interactions(action_type);
CREATE INDEX IF NOT EXISTS idx_sales_interactions_created ON sales_agent_interactions(created_at);

-- sales_metrics
CREATE INDEX IF NOT EXISTS idx_sales_metrics_period ON sales_metrics(period_type, period_date);
CREATE INDEX IF NOT EXISTS idx_sales_metrics_vertical ON sales_metrics(vertical);

-- sales_alerts
CREATE INDEX IF NOT EXISTS idx_sales_alerts_type ON sales_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_sales_alerts_status ON sales_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sales_alerts_severity ON sales_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_sales_alerts_created ON sales_alerts(created_at);

-- sales_prompts
CREATE INDEX IF NOT EXISTS idx_sales_prompts_agent ON sales_prompts(agent_name);
CREATE INDEX IF NOT EXISTS idx_sales_prompts_active ON sales_prompts(is_active);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_leads_updated_at
    BEFORE UPDATE ON sales_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_propostas_updated_at
    BEFORE UPDATE ON sales_propostas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_metrics_updated_at
    BEFORE UPDATE ON sales_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_pipelines_updated_at
    BEFORE UPDATE ON sales_pipelines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_prompts_updated_at
    BEFORE UPDATE ON sales_prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- =====================================================
-- INSERTS INICIAIS - Pipelines por Vertical
-- =====================================================

INSERT INTO sales_pipelines (vertical, nome, descricao, etapas, agentes_config) VALUES
('clinica', 'Pipeline Clinicas Medicas', 'Funil para clinicas e consultorios medicos',
 '[
   {"nome": "Novo Lead", "cor": "#6B7280", "ordem": 1, "sla_horas": 0.5, "agente": "secretaria"},
   {"nome": "Contato Feito", "cor": "#3B82F6", "ordem": 2, "sla_horas": 24, "agente": "secretaria"},
   {"nome": "Qualificado", "cor": "#10B981", "ordem": 3, "sla_horas": 48, "agente": "qualifier"},
   {"nome": "Agendado", "cor": "#8B5CF6", "ordem": 4, "sla_horas": 72, "agente": "scheduler"},
   {"nome": "Proposta Enviada", "cor": "#F59E0B", "ordem": 5, "sla_horas": 48, "agente": "closer"},
   {"nome": "Negociacao", "cor": "#EF4444", "ordem": 6, "sla_horas": 72, "agente": "closer"},
   {"nome": "Fechado", "cor": "#22C55E", "ordem": 7, "sla_horas": null, "agente": "onboarder"},
   {"nome": "Perdido", "cor": "#9CA3AF", "ordem": 8, "sla_horas": null, "agente": null}
 ]'::jsonb,
 '{
   "secretaria": {"enabled": true, "modelo": "gpt-4o", "framework": "critics"},
   "qualifier": {"enabled": true, "modelo": "gpt-4o", "framework": "bant_nepq"},
   "scheduler": {"enabled": true, "modelo": "gpt-4o-mini", "framework": "critics"},
   "closer": {"enabled": false, "modelo": "gpt-4o", "framework": "nepq_nogo"},
   "onboarder": {"enabled": false, "modelo": "gpt-4o-mini", "framework": "critics"}
 }'::jsonb
),
('financeiro', 'Pipeline Financeiro', 'Funil para assessorias financeiras e seguros',
 '[
   {"nome": "Novo Lead", "cor": "#6B7280", "ordem": 1, "sla_horas": 0.5, "agente": "sdr"},
   {"nome": "Contato Feito", "cor": "#3B82F6", "ordem": 2, "sla_horas": 24, "agente": "sdr"},
   {"nome": "Qualificado", "cor": "#10B981", "ordem": 3, "sla_horas": 48, "agente": "qualifier"},
   {"nome": "Agendado", "cor": "#8B5CF6", "ordem": 4, "sla_horas": 72, "agente": "scheduler"},
   {"nome": "Proposta Enviada", "cor": "#F59E0B", "ordem": 5, "sla_horas": 48, "agente": "closer"},
   {"nome": "Negociacao", "cor": "#EF4444", "ordem": 6, "sla_horas": 72, "agente": "closer"},
   {"nome": "Fechado", "cor": "#22C55E", "ordem": 7, "sla_horas": null, "agente": "onboarder"},
   {"nome": "Perdido", "cor": "#9CA3AF", "ordem": 8, "sla_horas": null, "agente": null}
 ]'::jsonb,
 '{
   "sdr": {"enabled": true, "modelo": "gpt-4o", "framework": "critics_nepq"},
   "qualifier": {"enabled": true, "modelo": "gpt-4o", "framework": "bant_nepq"},
   "scheduler": {"enabled": true, "modelo": "gpt-4o-mini", "framework": "critics"},
   "closer": {"enabled": false, "modelo": "gpt-4o", "framework": "nepq_nogo"},
   "onboarder": {"enabled": false, "modelo": "gpt-4o-mini", "framework": "critics"}
 }'::jsonb
),
('mentor', 'Pipeline Mentores', 'Funil para mentores e infoprodutores',
 '[
   {"nome": "Novo Lead", "cor": "#6B7280", "ordem": 1, "sla_horas": 0.5, "agente": "secretaria"},
   {"nome": "Contato Feito", "cor": "#3B82F6", "ordem": 2, "sla_horas": 24, "agente": "secretaria"},
   {"nome": "Qualificado", "cor": "#10B981", "ordem": 3, "sla_horas": 48, "agente": "qualifier"},
   {"nome": "Agendado", "cor": "#8B5CF6", "ordem": 4, "sla_horas": 72, "agente": "scheduler"},
   {"nome": "Proposta Enviada", "cor": "#F59E0B", "ordem": 5, "sla_horas": 48, "agente": "closer"},
   {"nome": "Negociacao", "cor": "#EF4444", "ordem": 6, "sla_horas": 72, "agente": "closer"},
   {"nome": "Fechado", "cor": "#22C55E", "ordem": 7, "sla_horas": null, "agente": "onboarder"},
   {"nome": "Perdido", "cor": "#9CA3AF", "ordem": 8, "sla_horas": null, "agente": null}
 ]'::jsonb,
 '{
   "secretaria": {"enabled": true, "modelo": "gpt-4o", "framework": "critics"},
   "qualifier": {"enabled": true, "modelo": "gpt-4o", "framework": "bant_nepq"},
   "scheduler": {"enabled": true, "modelo": "gpt-4o-mini", "framework": "critics"},
   "closer": {"enabled": false, "modelo": "gpt-4o", "framework": "sexy_canvas_nepq"},
   "onboarder": {"enabled": false, "modelo": "gpt-4o-mini", "framework": "critics"}
 }'::jsonb
),
('servico', 'Pipeline Servicos', 'Funil generico para prestadores de servico',
 '[
   {"nome": "Novo Lead", "cor": "#6B7280", "ordem": 1, "sla_horas": 0.5, "agente": "secretaria"},
   {"nome": "Contato Feito", "cor": "#3B82F6", "ordem": 2, "sla_horas": 24, "agente": "secretaria"},
   {"nome": "Qualificado", "cor": "#10B981", "ordem": 3, "sla_horas": 48, "agente": "qualifier"},
   {"nome": "Agendado", "cor": "#8B5CF6", "ordem": 4, "sla_horas": 72, "agente": "scheduler"},
   {"nome": "Proposta Enviada", "cor": "#F59E0B", "ordem": 5, "sla_horas": 48, "agente": "closer"},
   {"nome": "Negociacao", "cor": "#EF4444", "ordem": 6, "sla_horas": 72, "agente": "closer"},
   {"nome": "Fechado", "cor": "#22C55E", "ordem": 7, "sla_horas": null, "agente": "onboarder"},
   {"nome": "Perdido", "cor": "#9CA3AF", "ordem": 8, "sla_horas": null, "agente": null}
 ]'::jsonb,
 '{
   "secretaria": {"enabled": true, "modelo": "gpt-4o-mini", "framework": "critics"},
   "qualifier": {"enabled": true, "modelo": "gpt-4o", "framework": "bant"},
   "scheduler": {"enabled": true, "modelo": "gpt-4o-mini", "framework": "critics"},
   "closer": {"enabled": false, "modelo": "gpt-4o", "framework": "nepq"},
   "onboarder": {"enabled": false, "modelo": "gpt-4o-mini", "framework": "critics"}
 }'::jsonb
)
ON CONFLICT (vertical) DO NOTHING;

-- =====================================================
-- VIEWS UTEIS
-- =====================================================

-- View de leads com proposta
CREATE OR REPLACE VIEW vw_leads_com_proposta AS
SELECT
  l.*,
  p.proposal_url,
  p.proposal_score,
  p.proposal_status,
  p.tempo_total_segundos as proposta_tempo_visualizacao,
  p.chat_messages as proposta_chat_messages
FROM sales_leads l
LEFT JOIN sales_propostas p ON l.id = p.lead_id
WHERE p.id IS NOT NULL OR l.etapa_funil IN ('proposta_enviada', 'negociacao', 'fechado');

-- View de metricas diarias
CREATE OR REPLACE VIEW vw_metrics_daily AS
SELECT
  period_date,
  vertical,
  SUM(leads_novos) as leads_novos,
  SUM(leads_qualificados) as leads_qualificados,
  SUM(propostas_enviadas) as propostas_enviadas,
  SUM(fechamentos) as fechamentos,
  SUM(valor_fechado) as valor_fechado,
  AVG(taxa_fechamento) as taxa_fechamento_media
FROM sales_metrics
WHERE period_type = 'daily'
GROUP BY period_date, vertical
ORDER BY period_date DESC;

-- View de alertas pendentes
CREATE OR REPLACE VIEW vw_alertas_pendentes AS
SELECT
  a.*,
  l.nome as lead_nome,
  l.vertical as lead_vertical,
  l.lead_score
FROM sales_alerts a
LEFT JOIN sales_leads l ON a.lead_id = l.id
WHERE a.status IN ('pending', 'notified')
ORDER BY
  CASE a.severity
    WHEN 'critical' THEN 1
    WHEN 'warning' THEN 2
    ELSE 3
  END,
  a.created_at DESC;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

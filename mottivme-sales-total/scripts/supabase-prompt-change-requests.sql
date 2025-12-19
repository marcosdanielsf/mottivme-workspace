-- =============================================================================
-- TABELA: prompt_change_requests
-- Criado em: 2025-12-18
-- Descricao: Registra todas as solicitacoes de mudanca em prompts de agentes
--            Origem: Call Analyzer Revisao ou Engenheiro de Prompt
-- =============================================================================

-- =============================================================================
-- 1. TABELA PRINCIPAL
-- =============================================================================
CREATE TABLE IF NOT EXISTS prompt_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Referencia para a versao criada (pending_approval)
  agent_version_id UUID REFERENCES agent_versions(id) ON DELETE CASCADE,

  -- Versao anterior (para diff)
  previous_version_id UUID REFERENCES agent_versions(id) ON DELETE SET NULL,

  -- Quem solicitou a mudanca
  requested_by VARCHAR(255) NOT NULL,

  -- Tipo de solicitacao
  request_type VARCHAR(50) NOT NULL CHECK (request_type IN (
    'revisao',      -- Vem do Call Analyzer Revisao (PDCA de call de acompanhamento)
    'suporte',      -- Vem do Engenheiro de Prompt (ajuste pontual)
    'hotfix',       -- Correcao urgente
    'rollback',     -- Rollback para versao anterior
    'novo'          -- Nova versao completa (onboarding)
  )),

  -- Fonte da solicitacao
  request_source VARCHAR(50) NOT NULL CHECK (request_source IN (
    'call_analyzer_revisao',   -- Workflow Call-Analyzer-Revisao
    'call_analyzer_onboarding', -- Workflow Call-Analyzer-Onboarding
    'engenheiro_webhook',      -- Webhook do Engenheiro de Prompt
    'engenheiro_interface',    -- Interface web do Engenheiro
    'manual'                   -- Mudanca manual via SQL/Admin
  )),

  -- Resumo das mudancas (texto legivel)
  changes_summary TEXT NOT NULL,

  -- Diff detalhado em JSON
  -- Estrutura: {
  --   "system_prompt": { "before": "...", "after": "...", "diff": "..." },
  --   "tools_config": { "added": [...], "removed": [...] },
  --   "compliance_rules": { ... },
  --   "personality_config": { ... }
  -- }
  changes_json JSONB DEFAULT '{}',

  -- Analise do PDCA (se vier do Call Analyzer Revisao)
  -- Estrutura: {
  --   "plan": { "problemas_identificados": [...], "melhorias_propostas": [...] },
  --   "do": { "acoes_implementadas": [...] },
  --   "check": { "metricas_atuais": {...}, "gaps_identificados": [...] },
  --   "act": { "ajustes_necessarios": [...], "proximos_passos": [...] }
  -- }
  pdca_analysis JSONB DEFAULT NULL,

  -- Impacto estimado da mudanca
  impact_level VARCHAR(20) DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),

  -- Status do fluxo de aprovacao
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
    'pending',           -- Aguardando revisao
    'approved',          -- Aprovado e aplicado
    'rejected',          -- Rejeitado
    'expired',           -- Expirou sem acao (ex: 7 dias)
    'cancelled'          -- Cancelado pelo solicitante
  )),

  -- Quem revisou (CS ou Admin)
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,

  -- Motivo da rejeicao (se aplicavel)
  rejection_reason TEXT,

  -- Notas adicionais
  notes TEXT,

  -- Referencia a call de acompanhamento (se vier do Revisao)
  call_recording_id UUID REFERENCES call_recordings(id) ON DELETE SET NULL,

  -- GHL IDs para sincronizacao
  ghl_revision_object_id TEXT,  -- ID do Custom Object "Revisoes de Agente" no GHL

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. INDICES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_pcr_agent_version_id ON prompt_change_requests(agent_version_id);
CREATE INDEX IF NOT EXISTS idx_pcr_previous_version_id ON prompt_change_requests(previous_version_id);
CREATE INDEX IF NOT EXISTS idx_pcr_status ON prompt_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_pcr_request_type ON prompt_change_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_pcr_request_source ON prompt_change_requests(request_source);
CREATE INDEX IF NOT EXISTS idx_pcr_created_at ON prompt_change_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pcr_pending ON prompt_change_requests(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_pcr_call_recording ON prompt_change_requests(call_recording_id);
CREATE INDEX IF NOT EXISTS idx_pcr_ghl_revision ON prompt_change_requests(ghl_revision_object_id);

-- =============================================================================
-- 3. TRIGGER PARA UPDATED_AT
-- =============================================================================
DROP TRIGGER IF EXISTS trigger_pcr_updated_at ON prompt_change_requests;
CREATE TRIGGER trigger_pcr_updated_at
  BEFORE UPDATE ON prompt_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. FUNCAO: Aprovar mudanca de prompt
-- Atualiza status, ativa a versao e desativa anteriores
-- =============================================================================
CREATE OR REPLACE FUNCTION approve_prompt_change(
  p_request_id UUID,
  p_reviewed_by VARCHAR(255)
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  version_id UUID,
  versao TEXT
) AS $$
DECLARE
  v_agent_version_id UUID;
  v_client_id UUID;
  v_versao TEXT;
BEGIN
  -- Buscar a versao do agente associada
  SELECT pcr.agent_version_id, av.client_id, av.versao
  INTO v_agent_version_id, v_client_id, v_versao
  FROM prompt_change_requests pcr
  JOIN agent_versions av ON pcr.agent_version_id = av.id
  WHERE pcr.id = p_request_id AND pcr.status = 'pending';

  IF v_agent_version_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Request nao encontrado ou ja processado'::TEXT, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Desativar versoes anteriores do cliente
  UPDATE agent_versions
  SET
    is_active = FALSE,
    deprecated_at = COALESCE(deprecated_at, NOW())
  WHERE client_id = v_client_id
    AND is_active = TRUE
    AND id != v_agent_version_id;

  -- Ativar a nova versao
  UPDATE agent_versions
  SET
    is_active = TRUE,
    status = 'active',
    deployed_at = NOW()
  WHERE id = v_agent_version_id;

  -- Atualizar o request
  UPDATE prompt_change_requests
  SET
    status = 'approved',
    reviewed_by = p_reviewed_by,
    reviewed_at = NOW()
  WHERE id = p_request_id;

  RETURN QUERY SELECT TRUE, 'Aprovado com sucesso'::TEXT, v_agent_version_id, v_versao;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 5. FUNCAO: Rejeitar mudanca de prompt
-- =============================================================================
CREATE OR REPLACE FUNCTION reject_prompt_change(
  p_request_id UUID,
  p_reviewed_by VARCHAR(255),
  p_reason TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_agent_version_id UUID;
BEGIN
  -- Buscar e validar
  SELECT agent_version_id INTO v_agent_version_id
  FROM prompt_change_requests
  WHERE id = p_request_id AND status = 'pending';

  IF v_agent_version_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Request nao encontrado ou ja processado'::TEXT;
    RETURN;
  END IF;

  -- Atualizar a versao para rejected
  UPDATE agent_versions
  SET status = 'rejected'
  WHERE id = v_agent_version_id;

  -- Atualizar o request
  UPDATE prompt_change_requests
  SET
    status = 'rejected',
    reviewed_by = p_reviewed_by,
    reviewed_at = NOW(),
    rejection_reason = p_reason
  WHERE id = p_request_id;

  RETURN QUERY SELECT TRUE, 'Rejeitado com sucesso'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 6. VIEW: Requests pendentes com detalhes
-- Nota: Usar COALESCE para campos que podem nao existir em todas as versoes do schema
-- =============================================================================
CREATE OR REPLACE VIEW v_pending_prompt_changes AS
SELECT
  pcr.id AS request_id,
  pcr.request_type,
  pcr.request_source,
  pcr.requested_by,
  pcr.changes_summary,
  pcr.impact_level,
  pcr.created_at,

  -- Dados do cliente
  c.id AS client_id,
  c.nome AS client_nome,
  c.empresa,

  -- Versao nova (pending) - usa COALESCE para compatibilidade
  av_new.id AS new_version_id,
  COALESCE(av_new.versao, 'v1.0') AS new_versao,

  -- Versao anterior (ativa)
  av_prev.id AS prev_version_id,
  COALESCE(av_prev.versao, '') AS prev_versao,

  -- Tempo aguardando aprovacao
  EXTRACT(EPOCH FROM (NOW() - pcr.created_at))/3600 AS hours_pending

FROM prompt_change_requests pcr
JOIN agent_versions av_new ON pcr.agent_version_id = av_new.id
LEFT JOIN agent_versions av_prev ON pcr.previous_version_id = av_prev.id
JOIN clients c ON av_new.client_id = c.id
WHERE pcr.status = 'pending'
ORDER BY pcr.created_at ASC;

COMMENT ON VIEW v_pending_prompt_changes IS 'Solicitacoes de mudanca pendentes de aprovacao';

-- =============================================================================
-- 7. VIEW: Historico de mudancas por cliente
-- =============================================================================
CREATE OR REPLACE VIEW v_prompt_change_history AS
SELECT
  pcr.id AS request_id,
  c.id AS client_id,
  c.nome AS client_nome,
  pcr.request_type,
  pcr.request_source,
  pcr.requested_by,
  pcr.changes_summary,
  pcr.impact_level,
  pcr.status,
  pcr.reviewed_by,
  pcr.reviewed_at,
  COALESCE(av.versao, 'v1.0') AS versao,
  pcr.created_at
FROM prompt_change_requests pcr
JOIN agent_versions av ON pcr.agent_version_id = av.id
JOIN clients c ON av.client_id = c.id
ORDER BY pcr.created_at DESC;

COMMENT ON VIEW v_prompt_change_history IS 'Historico completo de mudancas de prompt por cliente';

-- =============================================================================
-- 8. COMENTARIOS
-- =============================================================================
COMMENT ON TABLE prompt_change_requests IS 'Registra todas as solicitacoes de mudanca em prompts (Revisao + Engenheiro)';
COMMENT ON COLUMN prompt_change_requests.request_type IS 'Tipo: revisao (PDCA), suporte (ajuste), hotfix, rollback, novo';
COMMENT ON COLUMN prompt_change_requests.request_source IS 'Origem: call_analyzer_revisao, engenheiro_webhook, engenheiro_interface, manual';
COMMENT ON COLUMN prompt_change_requests.pdca_analysis IS 'Analise PDCA completa (se vier do Call Analyzer Revisao)';
COMMENT ON COLUMN prompt_change_requests.impact_level IS 'Impacto estimado: low, medium, high, critical';
COMMENT ON COLUMN prompt_change_requests.ghl_revision_object_id IS 'ID do Custom Object Revisoes de Agente no GHL';

-- =============================================================================
-- 9. ADICIONAR COLUNA STATUS EM AGENT_VERSIONS (se nao existir)
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'status'
  ) THEN
    ALTER TABLE agent_versions
    ADD COLUMN status VARCHAR(50) DEFAULT 'active'
    CHECK (status IN ('pending_approval', 'active', 'deprecated', 'rejected'));

    COMMENT ON COLUMN agent_versions.status IS 'Status: pending_approval, active, deprecated, rejected';

    -- Atualizar versoes existentes
    UPDATE agent_versions SET status = 'active' WHERE is_active = TRUE;
    UPDATE agent_versions SET status = 'deprecated' WHERE is_active = FALSE AND status IS NULL;
  END IF;
END $$;

-- =============================================================================
-- 10. ADICIONAR COLUNAS EXTRAS EM AGENT_VERSIONS (multi-tenant)
-- =============================================================================
DO $$
BEGIN
  -- contact_id para referencia direta ao contato GHL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'contact_id'
  ) THEN
    ALTER TABLE agent_versions ADD COLUMN contact_id TEXT;
    COMMENT ON COLUMN agent_versions.contact_id IS 'ID do contato no GHL (redundante, mas util para queries)';
  END IF;

  -- location_id para multi-tenant
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'location_id'
  ) THEN
    ALTER TABLE agent_versions ADD COLUMN location_id TEXT;
    COMMENT ON COLUMN agent_versions.location_id IS 'Location ID do GHL para multi-tenant';
  END IF;

  -- approved_by para rastreabilidade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE agent_versions ADD COLUMN approved_by VARCHAR(255);
    ALTER TABLE agent_versions ADD COLUMN approved_at TIMESTAMPTZ;
    COMMENT ON COLUMN agent_versions.approved_by IS 'Quem aprovou esta versao';
    COMMENT ON COLUMN agent_versions.approved_at IS 'Quando foi aprovada';
  END IF;

  -- previous_version_id para historico
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'previous_version_id'
  ) THEN
    ALTER TABLE agent_versions ADD COLUMN previous_version_id UUID REFERENCES agent_versions(id) ON DELETE SET NULL;
    COMMENT ON COLUMN agent_versions.previous_version_id IS 'Versao anterior para tracking de historico';
  END IF;
END $$;

-- Indices para novas colunas
CREATE INDEX IF NOT EXISTS idx_agent_versions_contact_id ON agent_versions(contact_id);
CREATE INDEX IF NOT EXISTS idx_agent_versions_location_id ON agent_versions(location_id);
CREATE INDEX IF NOT EXISTS idx_agent_versions_status ON agent_versions(status);

-- =============================================================================
-- FIM DO SCRIPT
-- =============================================================================

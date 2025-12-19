-- =============================================
-- ASSEMBLY LINE - FUNÇÃO RPC GET_EXPERT_DATA
-- Execute no SQL Editor do Supabase
-- =============================================

-- Função para buscar todos os dados do expert para o n8n
CREATE OR REPLACE FUNCTION get_expert_data(p_project_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'project', (
      SELECT row_to_json(p.*)
      FROM projects p
      WHERE p.id = p_project_id
    ),
    'briefing', (
      SELECT row_to_json(b.*)
      FROM briefings b
      WHERE b.project_id = p_project_id
    ),
    'clone', (
      SELECT row_to_json(c.*)
      FROM clone_experts c
      WHERE c.project_id = p_project_id
    ),
    'offers', (
      SELECT row_to_json(o.*)
      FROM offers o
      WHERE o.project_id = p_project_id
    ),
    'contents_count', (
      SELECT COUNT(*)::integer
      FROM contents
      WHERE project_id = p_project_id
    ),
    'funnels_count', (
      SELECT COUNT(*)::integer
      FROM funnels
      WHERE project_id = p_project_id
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar progresso do agente (chamada pelo callback n8n)
CREATE OR REPLACE FUNCTION update_agent_progress(
  p_generation_id UUID,
  p_agent_number INTEGER,
  p_status TEXT,
  p_progress INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE generations
  SET
    status = p_status,
    agent_number = COALESCE(p_agent_number, agent_number)
  WHERE id = p_generation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para calcular progresso total de um projeto
CREATE OR REPLACE FUNCTION calculate_project_progress(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_phases INTEGER := 4;
  completed_phases INTEGER := 0;
  clone_status TEXT;
  offers_status TEXT;
  has_contents BOOLEAN;
  has_funnels BOOLEAN;
BEGIN
  -- Check clone
  SELECT status INTO clone_status
  FROM clone_experts
  WHERE project_id = p_project_id;

  IF clone_status = 'ready' THEN
    completed_phases := completed_phases + 2; -- Clone + Posicionamento
  END IF;

  -- Check offers
  SELECT status INTO offers_status
  FROM offers
  WHERE project_id = p_project_id;

  IF offers_status = 'ready' THEN
    completed_phases := completed_phases + 1;
  END IF;

  -- Check contents
  SELECT EXISTS(
    SELECT 1 FROM contents WHERE project_id = p_project_id LIMIT 1
  ) INTO has_contents;

  IF has_contents THEN
    completed_phases := completed_phases + 1;
  END IF;

  RETURN (completed_phases * 100) / total_phases;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_expert_data(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_agent_progress(UUID, INTEGER, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION calculate_project_progress(UUID) TO anon, authenticated;

-- Migration: Add Hyperpersonalization Support
-- Description: Adiciona colunas e indices para suporte a hiperpersonalizacao de agentes
-- Author: AI Factory System
-- Date: 2025-12-19
-- Version: v3.0-hyperpersonalized

-- ============================================
-- 1. ADICIONAR COLUNA hyperpersonalization NA TABELA agent_versions
-- ============================================

ALTER TABLE agent_versions
ADD COLUMN IF NOT EXISTS hyperpersonalization JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN agent_versions.hyperpersonalization IS 'Configuracoes de hiperpersonalizacao do agente (ddd, setor, porte, cargo_decisor)';

-- ============================================
-- 2. ADICIONAR COLUNAS DE HIPERPERSONALIZACAO NA TABELA call_recordings
-- ============================================

ALTER TABLE call_recordings
ADD COLUMN IF NOT EXISTS hyperpersonalization_extracted JSONB DEFAULT NULL;

COMMENT ON COLUMN call_recordings.hyperpersonalization_extracted IS 'Dados de hiperpersonalizacao extraidos da call de onboarding';

-- ============================================
-- 3. CRIAR INDICES PARA BUSCA EFICIENTE
-- ============================================

-- Indice para buscar agentes por setor (hiperpersonalizacao)
CREATE INDEX IF NOT EXISTS idx_agent_versions_hp_setor
ON agent_versions ((hyperpersonalization->>'setor'))
WHERE hyperpersonalization IS NOT NULL;

-- Indice para buscar agentes por DDD (regiao)
CREATE INDEX IF NOT EXISTS idx_agent_versions_hp_ddd
ON agent_versions ((hyperpersonalization->>'ddd'))
WHERE hyperpersonalization IS NOT NULL;

-- Indice para buscar agentes por porte
CREATE INDEX IF NOT EXISTS idx_agent_versions_hp_porte
ON agent_versions ((hyperpersonalization->>'porte'))
WHERE hyperpersonalization IS NOT NULL;

-- ============================================
-- 4. CRIAR TABELA DE METRICAS DE HIPERPERSONALIZACAO (OPCIONAL)
-- ============================================

CREATE TABLE IF NOT EXISTS hyperpersonalization_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id VARCHAR(100) NOT NULL,
  agent_version_id UUID REFERENCES agent_versions(id),

  -- Configuracoes usadas
  ddd VARCHAR(10),
  setor VARCHAR(50),
  porte VARCHAR(20),
  cargo_decisor VARCHAR(50),

  -- Metricas de performance
  conversations_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_response_sentiment DECIMAL(3,2) DEFAULT 0.00,
  avg_conversation_length INTEGER DEFAULT 0,

  -- Timestamps
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE hyperpersonalization_metrics IS 'Metricas agregadas de performance por configuracao de hiperpersonalizacao';

-- Indice para buscar metricas por periodo
CREATE INDEX IF NOT EXISTS idx_hp_metrics_period
ON hyperpersonalization_metrics (location_id, period_start, period_end);

-- Indice para buscar metricas por configuracao
CREATE INDEX IF NOT EXISTS idx_hp_metrics_config
ON hyperpersonalization_metrics (setor, porte, ddd);

-- ============================================
-- 5. CRIAR FUNCAO PARA ATUALIZAR METRICAS
-- ============================================

CREATE OR REPLACE FUNCTION update_hyperpersonalization_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar timestamp de updated_at
  NEW.updated_at = NOW();

  -- Calcular conversion_rate
  IF NEW.conversations_count > 0 THEN
    NEW.conversion_rate = (NEW.conversions_count::decimal / NEW.conversations_count::decimal) * 100;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar metricas automaticamente
DROP TRIGGER IF EXISTS trg_update_hp_metrics ON hyperpersonalization_metrics;
CREATE TRIGGER trg_update_hp_metrics
  BEFORE UPDATE ON hyperpersonalization_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_hyperpersonalization_metrics();

-- ============================================
-- 6. VIEWS UTEIS PARA ANALISE
-- ============================================

-- View: Performance por setor
CREATE OR REPLACE VIEW vw_hp_performance_por_setor AS
SELECT
  setor,
  COUNT(DISTINCT location_id) as locations_count,
  SUM(conversations_count) as total_conversations,
  SUM(conversions_count) as total_conversions,
  AVG(conversion_rate) as avg_conversion_rate,
  AVG(avg_response_sentiment) as avg_sentiment
FROM hyperpersonalization_metrics
WHERE setor IS NOT NULL
GROUP BY setor
ORDER BY avg_conversion_rate DESC;

-- View: Performance por regiao (DDD)
CREATE OR REPLACE VIEW vw_hp_performance_por_regiao AS
SELECT
  ddd,
  COUNT(DISTINCT location_id) as locations_count,
  SUM(conversations_count) as total_conversations,
  SUM(conversions_count) as total_conversions,
  AVG(conversion_rate) as avg_conversion_rate
FROM hyperpersonalization_metrics
WHERE ddd IS NOT NULL
GROUP BY ddd
ORDER BY avg_conversion_rate DESC;

-- View: Performance por porte
CREATE OR REPLACE VIEW vw_hp_performance_por_porte AS
SELECT
  porte,
  COUNT(DISTINCT location_id) as locations_count,
  SUM(conversations_count) as total_conversations,
  SUM(conversions_count) as total_conversions,
  AVG(conversion_rate) as avg_conversion_rate
FROM hyperpersonalization_metrics
WHERE porte IS NOT NULL
GROUP BY porte
ORDER BY avg_conversion_rate DESC;

-- ============================================
-- 7. DADOS DE EXEMPLO (COMENTADO - USAR SE NECESSARIO)
-- ============================================

/*
-- Exemplo de insert de configuracao de hiperpersonalizacao
UPDATE agent_versions
SET hyperpersonalization = '{
  "ddd": "11",
  "setor": "odontologia",
  "porte": "micro",
  "cargo_decisor": "socio",
  "empresas_similares": [],
  "pistas": {
    "numero_funcionarios_estimado": "3",
    "tempo_mercado": "5 anos"
  }
}'::jsonb
WHERE id = 'AGENT_VERSION_ID_AQUI';
*/

-- ============================================
-- VERIFICACAO
-- ============================================

-- Verificar se as colunas foram adicionadas
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_versions' AND column_name = 'hyperpersonalization'
  ) THEN
    RAISE NOTICE 'SUCCESS: Coluna hyperpersonalization adicionada em agent_versions';
  ELSE
    RAISE WARNING 'FAILED: Coluna hyperpersonalization NAO foi adicionada';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'hyperpersonalization_metrics'
  ) THEN
    RAISE NOTICE 'SUCCESS: Tabela hyperpersonalization_metrics criada';
  ELSE
    RAISE WARNING 'FAILED: Tabela hyperpersonalization_metrics NAO foi criada';
  END IF;
END $$;

-- FIM DA MIGRATION

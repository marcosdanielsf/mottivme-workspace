-- =====================================================
-- ADICIONAR COLUNAS PARA FOLLOW-UP DE CONTRATOS
-- Execute no Supabase SQL Editor
-- =====================================================

-- Coluna para registrar quando o contrato foi visualizado
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS visualizado_em TIMESTAMP WITH TIME ZONE;

-- Coluna para marcar se follow-up já foi enviado
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS followup_enviado BOOLEAN DEFAULT FALSE;

-- Coluna para registrar quando o follow-up foi enviado
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS followup_enviado_em TIMESTAMP WITH TIME ZONE;

-- Coluna para o ID do contato no GHL (se ainda não existir)
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT;

-- Coluna para o autentique_doc_id (se ainda não existir)
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS autentique_doc_id TEXT;

-- Criar índice para busca por autentique_doc_id
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_autentique_doc_id
ON contratos_pendentes(autentique_doc_id);

-- Verificar colunas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contratos_pendentes'
  AND column_name IN ('visualizado_em', 'followup_enviado', 'followup_enviado_em', 'ghl_contact_id', 'autentique_doc_id')
ORDER BY column_name;

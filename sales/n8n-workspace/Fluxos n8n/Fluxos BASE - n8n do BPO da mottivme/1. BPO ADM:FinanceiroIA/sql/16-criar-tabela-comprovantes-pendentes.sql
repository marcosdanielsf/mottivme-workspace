-- =====================================================
-- TABELA: comprovantes_pendentes
-- Armazena comprovantes que não encontraram match automático
-- =====================================================

CREATE TABLE IF NOT EXISTS comprovantes_pendentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dados extraídos do comprovante
  tipo_comprovante VARCHAR(50),
  valor DECIMAL(15,2),
  data_pagamento DATE,
  nome_pagador VARCHAR(255),
  nome_recebedor VARCHAR(255),
  codigo_transacao VARCHAR(255),
  descricao TEXT,
  confianca INTEGER,

  -- Dados do remetente (quem enviou o comprovante)
  telefone_remetente VARCHAR(50),
  contact_id VARCHAR(255),
  nome_remetente VARCHAR(255),

  -- Arquivo
  url_comprovante TEXT,

  -- Status do processamento
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, vinculado, descartado
  movimentacao_vinculada_id UUID REFERENCES movimentacoes_financeiras(id),

  -- Auditoria
  analisado_por VARCHAR(255),
  analisado_em TIMESTAMP,
  observacoes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para busca
CREATE INDEX idx_comprovantes_pendentes_status ON comprovantes_pendentes(status);
CREATE INDEX idx_comprovantes_pendentes_data ON comprovantes_pendentes(data_pagamento);
CREATE INDEX idx_comprovantes_pendentes_valor ON comprovantes_pendentes(valor);
CREATE INDEX idx_comprovantes_pendentes_codigo ON comprovantes_pendentes(codigo_transacao);

-- Comentários
COMMENT ON TABLE comprovantes_pendentes IS 'Comprovantes de pagamento que não encontraram match automático com movimentações';
COMMENT ON COLUMN comprovantes_pendentes.status IS 'pendente = aguardando análise, vinculado = associado a movimentação, descartado = ignorado';
COMMENT ON COLUMN comprovantes_pendentes.confianca IS 'Nível de confiança da extração (0-100) retornado pelo Claude';

-- Verificar criação
SELECT 'Tabela comprovantes_pendentes criada com sucesso!' as resultado;

-- =====================================================
-- TABELA: contratos_pendentes
-- Armazena dados de clientes que preencheram o formulário
-- aguardando os termos da negociação para gerar contrato
-- =====================================================

CREATE TABLE IF NOT EXISTS contratos_pendentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dados do cliente (vindos do Monday Forms)
  nome VARCHAR(255) NOT NULL,
  nome_completo_razao_social VARCHAR(255),
  email VARCHAR(255),
  telefone VARCHAR(50),
  nacionalidade VARCHAR(100),
  profissao VARCHAR(100),
  estado_civil VARCHAR(50),
  endereco TEXT,
  cep VARCHAR(20),
  documento VARCHAR(50), -- SSN ou CPF
  documento_alternativo VARCHAR(50), -- CNPJ se não tiver SSN
  data_nascimento DATE,
  foto_url TEXT,

  -- Referência ao cliente no sistema
  cliente_id UUID REFERENCES clientes_fornecedores(id),

  -- Dados da negociação (preenchidos depois)
  valor_mensal DECIMAL(15,2),
  num_parcelas INTEGER,
  valor_entrada DECIMAL(15,2) DEFAULT 0,
  data_inicio DATE,
  dia_vencimento INTEGER,

  -- Controle
  status VARCHAR(50) DEFAULT 'aguardando_termos',
  -- aguardando_termos, termos_informados, contrato_gerado, cancelado

  monday_item_id VARCHAR(100), -- ID do item no Monday
  contrato_id UUID REFERENCES contratos(id), -- Depois de gerar

  -- Auditoria
  notificado_em TIMESTAMP,
  termos_recebidos_em TIMESTAMP,
  contrato_gerado_em TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices (IF NOT EXISTS para evitar erro se já existir)
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_status ON contratos_pendentes(status);
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_cliente ON contratos_pendentes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_monday ON contratos_pendentes(monday_item_id);

-- Comentários
COMMENT ON TABLE contratos_pendentes IS 'Formulários de contrato aguardando termos da negociação';
COMMENT ON COLUMN contratos_pendentes.status IS 'aguardando_termos = aguardando Marcos informar valores, termos_informados = pronto para gerar, contrato_gerado = finalizado';

-- Verificar criação
SELECT 'Tabela contratos_pendentes criada com sucesso!' as resultado;

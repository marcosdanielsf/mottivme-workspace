-- ============================================================================
-- SCRIPT DE MIGRAÇÃO - ADICIONA APENAS TABELAS NOVAS
-- ============================================================================
-- Este script adiciona apenas as tabelas que estão faltando
-- Não remove nem altera tabelas existentes
-- SEGURO para executar em banco com dados
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA: categorias_financeiras (se não existir)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT,
  cor TEXT,
  icone TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON categorias_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias_financeiras(ativo);

-- ============================================================================
-- TABELA: contas_bancarias (se não existir)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contas_bancarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  banco TEXT NOT NULL,
  agencia TEXT,
  conta TEXT,
  tipo TEXT CHECK (tipo IN ('corrente', 'poupanca', 'investimento')),
  saldo_inicial DECIMAL(12,2) DEFAULT 0,
  saldo_atual DECIMAL(12,2) DEFAULT 0,
  tipo_pessoa TEXT CHECK (tipo_pessoa IN ('PF', 'PJ')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contas_tipo ON contas_bancarias(tipo);
CREATE INDEX IF NOT EXISTS idx_contas_ativo ON contas_bancarias(ativo);

-- ============================================================================
-- ADICIONAR COLUNAS FALTANTES NAS TABELAS EXISTENTES
-- ============================================================================

-- Adicionar colunas em clientes_fornecedores (se não existirem)
DO $$
BEGIN
  -- Adicionar id UUID se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='id' AND data_type='uuid') THEN
    -- Se a tabela usa BIGSERIAL, vamos manter
    NULL;
  END IF;

  -- Adicionar colunas faltantes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='endereco') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN endereco TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='cidade') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN cidade TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='estado') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN estado TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='cep') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN cep TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='observacoes') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN observacoes TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='ativo') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN ativo BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='clientes_fornecedores' AND column_name='updated_at') THEN
    ALTER TABLE clientes_fornecedores ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Adicionar colunas em movimentacoes_financeiras (se não existirem)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='categoria_id') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN categoria_id UUID REFERENCES categorias_financeiras(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='cliente_fornecedor_id') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN cliente_fornecedor_id BIGINT REFERENCES clientes_fornecedores(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='conta_bancaria_id') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN conta_bancaria_id UUID REFERENCES contas_bancarias(id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='forma_pagamento') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN forma_pagamento TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='numero_documento') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN numero_documento TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='codigo_barras') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN codigo_barras TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='pix_chave') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN pix_chave TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='recorrente') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN recorrente BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='frequencia_recorrencia') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN frequencia_recorrencia TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='origem') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN origem TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='arquivo_comprovante') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN arquivo_comprovante TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='movimentacoes_financeiras' AND column_name='updated_at') THEN
    ALTER TABLE movimentacoes_financeiras ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Adicionar colunas em cobrancas_automaticas (se não existirem)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='cobrancas_automaticas' AND column_name='tentativas_lembrete') THEN
    ALTER TABLE cobrancas_automaticas ADD COLUMN tentativas_lembrete INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='cobrancas_automaticas' AND column_name='tentativas_cobranca') THEN
    ALTER TABLE cobrancas_automaticas ADD COLUMN tentativas_cobranca INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='cobrancas_automaticas' AND column_name='observacoes') THEN
    ALTER TABLE cobrancas_automaticas ADD COLUMN observacoes TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='cobrancas_automaticas' AND column_name='updated_at') THEN
    ALTER TABLE cobrancas_automaticas ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- ============================================================================
-- TABELA: dados_pendentes_confirmacao (NOVA)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dados_pendentes_confirmacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone TEXT NOT NULL,
  dados_extraidos JSONB NOT NULL,
  mensagem_confirmacao TEXT NOT NULL,
  confirmado BOOLEAN DEFAULT NULL,
  resposta_usuario TEXT,
  confirmado_em TIMESTAMP WITH TIME ZONE,
  expira_em TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pendentes_telefone ON dados_pendentes_confirmacao(telefone);
CREATE INDEX IF NOT EXISTS idx_pendentes_confirmado ON dados_pendentes_confirmacao(confirmado);
CREATE INDEX IF NOT EXISTS idx_pendentes_expira_em ON dados_pendentes_confirmacao(expira_em);
CREATE INDEX IF NOT EXISTS idx_pendentes_created_at ON dados_pendentes_confirmacao(created_at);

-- ============================================================================
-- TABELA: comprovantes_nao_identificados (NOVA)
-- ============================================================================
CREATE TABLE IF NOT EXISTS comprovantes_nao_identificados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone TEXT NOT NULL,
  dados_comprovante JSONB NOT NULL,
  processado BOOLEAN DEFAULT false,
  processado_por TEXT,
  processado_em TIMESTAMP WITH TIME ZONE,
  movimentacao_id BIGINT REFERENCES movimentacoes_financeiras(id),
  observacoes_processamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comprov_telefone ON comprovantes_nao_identificados(telefone);
CREATE INDEX IF NOT EXISTS idx_comprov_processado ON comprovantes_nao_identificados(processado);
CREATE INDEX IF NOT EXISTS idx_comprov_movimentacao ON comprovantes_nao_identificados(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_comprov_created_at ON comprovantes_nao_identificados(created_at);

-- ============================================================================
-- TABELA: logs_automacao (NOVA)
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs_automacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_workflow TEXT NOT NULL,
  execution_id TEXT,
  telefone TEXT,
  movimentacao_id BIGINT REFERENCES movimentacoes_financeiras(id),
  status TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'em_andamento')),
  mensagem TEXT,
  dados_entrada JSONB,
  dados_saida JSONB,
  erro_detalhes TEXT,
  tempo_execucao_ms INTEGER,
  tokens_usados INTEGER,
  custo_estimado DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_tipo_workflow ON logs_automacao(tipo_workflow);
CREATE INDEX IF NOT EXISTS idx_logs_status ON logs_automacao(status);
CREATE INDEX IF NOT EXISTS idx_logs_telefone ON logs_automacao(telefone);
CREATE INDEX IF NOT EXISTS idx_logs_movimentacao ON logs_automacao(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_automacao(created_at);

-- ============================================================================
-- CRIAR ÍNDICES ADICIONAIS (se não existirem)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes_fornecedores(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes_fornecedores(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes_fornecedores(email);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes_fornecedores(tipo);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes_fornecedores(ativo);

CREATE INDEX IF NOT EXISTS idx_mov_tipo ON movimentacoes_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_mov_quitado ON movimentacoes_financeiras(quitado);
CREATE INDEX IF NOT EXISTS idx_mov_data_vencimento ON movimentacoes_financeiras(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_mov_data_realizado ON movimentacoes_financeiras(data_realizado);
CREATE INDEX IF NOT EXISTS idx_mov_data_competencia ON movimentacoes_financeiras(data_competencia);
CREATE INDEX IF NOT EXISTS idx_mov_cliente ON movimentacoes_financeiras(cliente_fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_mov_categoria ON movimentacoes_financeiras(categoria_id);
CREATE INDEX IF NOT EXISTS idx_mov_conta ON movimentacoes_financeiras(conta_bancaria_id);
CREATE INDEX IF NOT EXISTS idx_mov_tipo_pessoa ON movimentacoes_financeiras(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_mov_created_at ON movimentacoes_financeiras(created_at);

CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas_automaticas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_movimentacao ON cobrancas_automaticas(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_telefone ON cobrancas_automaticas(telefone);
CREATE INDEX IF NOT EXISTS idx_cobrancas_created_at ON cobrancas_automaticas(created_at);

-- ============================================================================
-- VIEWS ÚTEIS
-- ============================================================================

-- View: Resumo financeiro por mês
CREATE OR REPLACE VIEW vw_resumo_mensal AS
SELECT
  DATE_TRUNC('month', data_competencia) as mes,
  tipo_pessoa,
  SUM(CASE WHEN tipo = 'receita' AND quitado = true THEN valor_realizado ELSE 0 END) as receitas_realizadas,
  SUM(CASE WHEN tipo = 'despesa' AND quitado = true THEN valor_realizado ELSE 0 END) as despesas_realizadas,
  SUM(CASE WHEN tipo = 'receita' AND quitado = false THEN valor_previsto ELSE 0 END) as receitas_previstas,
  SUM(CASE WHEN tipo = 'despesa' AND quitado = false THEN valor_previsto ELSE 0 END) as despesas_previstas,
  COUNT(CASE WHEN tipo = 'receita' AND quitado = false THEN 1 END) as receitas_pendentes_count,
  COUNT(CASE WHEN tipo = 'despesa' AND quitado = false THEN 1 END) as despesas_pendentes_count
FROM movimentacoes_financeiras
WHERE data_competencia IS NOT NULL
GROUP BY DATE_TRUNC('month', data_competencia), tipo_pessoa
ORDER BY mes DESC, tipo_pessoa;

-- View: Inadimplentes
CREATE OR REPLACE VIEW vw_inadimplentes AS
SELECT
  m.id,
  c.nome as cliente,
  c.telefone,
  c.email,
  m.descricao,
  m.valor_previsto,
  m.data_vencimento,
  (CURRENT_DATE - m.data_vencimento) as dias_atraso,
  ca.status as status_cobranca,
  ca.lembrete_enviado_em,
  ca.cobranca_enviada_em
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores c ON m.cliente_fornecedor_id = c.id
LEFT JOIN cobrancas_automaticas ca ON ca.movimentacao_id = m.id
WHERE
  m.tipo = 'receita'
  AND m.quitado = false
  AND m.data_vencimento < CURRENT_DATE
ORDER BY m.data_vencimento ASC;

-- View: Fluxo de caixa projetado
CREATE OR REPLACE VIEW vw_fluxo_caixa_projetado AS
SELECT
  data_vencimento as data,
  SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE -valor_previsto END) as saldo_dia,
  SUM(SUM(CASE WHEN tipo = 'receita' THEN valor_previsto ELSE -valor_previsto END))
    OVER (ORDER BY data_vencimento) as saldo_acumulado
FROM movimentacoes_financeiras
WHERE
  quitado = false
  AND data_vencimento >= CURRENT_DATE
GROUP BY data_vencimento
ORDER BY data_vencimento;

-- ============================================================================
-- TRIGGERS E FUNCTIONS
-- ============================================================================

-- Function: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers apenas se não existirem
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_clientes_fornecedores_updated_at') THEN
    CREATE TRIGGER update_clientes_fornecedores_updated_at
      BEFORE UPDATE ON clientes_fornecedores
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contas_bancarias_updated_at') THEN
    CREATE TRIGGER update_contas_bancarias_updated_at
      BEFORE UPDATE ON contas_bancarias
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_movimentacoes_updated_at') THEN
    CREATE TRIGGER update_movimentacoes_updated_at
      BEFORE UPDATE ON movimentacoes_financeiras
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cobrancas_updated_at') THEN
    CREATE TRIGGER update_cobrancas_updated_at
      BEFORE UPDATE ON cobrancas_automaticas
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pendentes_updated_at') THEN
    CREATE TRIGGER update_pendentes_updated_at
      BEFORE UPDATE ON dados_pendentes_confirmacao
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_comprovantes_updated_at') THEN
    CREATE TRIGGER update_comprovantes_updated_at
      BEFORE UPDATE ON comprovantes_nao_identificados
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- DADOS INICIAIS (SEED) - Apenas se não existirem
-- ============================================================================

-- Inserir categorias padrão apenas se a tabela estiver vazia
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor, icone)
SELECT * FROM (VALUES
  ('Serviços', 'receita', 'Receita de prestação de serviços', '#10b981', 'briefcase'),
  ('Produtos', 'receita', 'Venda de produtos', '#3b82f6', 'shopping-cart'),
  ('Consultorias', 'receita', 'Serviços de consultoria', '#8b5cf6', 'users'),
  ('Mensalidades', 'receita', 'Receitas recorrentes de mensalidades', '#06b6d4', 'repeat'),
  ('Outras Receitas', 'receita', 'Outras fontes de receita', '#6b7280', 'dollar-sign'),
  ('Folha de Pagamento', 'despesa', 'Salários e encargos', '#ef4444', 'users'),
  ('Utilities', 'despesa', 'Água, luz, internet, telefone', '#f59e0b', 'zap'),
  ('Marketing', 'despesa', 'Investimentos em marketing e publicidade', '#ec4899', 'megaphone'),
  ('Infraestrutura', 'despesa', 'Aluguel, condomínio, manutenção', '#6366f1', 'building'),
  ('Softwares e Ferramentas', 'despesa', 'Assinaturas de softwares', '#8b5cf6', 'laptop'),
  ('Impostos e Taxas', 'despesa', 'Impostos, taxas e contribuições', '#dc2626', 'file-text'),
  ('Fornecedores', 'despesa', 'Pagamentos a fornecedores', '#059669', 'truck'),
  ('Outras Despesas', 'despesa', 'Despesas diversas', '#6b7280', 'more-horizontal')
) AS v(nome, tipo, descricao, cor, icone)
WHERE NOT EXISTS (SELECT 1 FROM categorias_financeiras LIMIT 1);

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Mostrar tabelas criadas
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'clientes_fornecedores',
    'categorias_financeiras',
    'contas_bancarias',
    'movimentacoes_financeiras',
    'cobrancas_automaticas',
    'dados_pendentes_confirmacao',
    'comprovantes_nao_identificados',
    'logs_automacao'
  )
ORDER BY tablename;

-- Mostrar contagem de registros
SELECT 'clientes_fornecedores' as tabela, COUNT(*) as registros FROM clientes_fornecedores
UNION ALL
SELECT 'categorias_financeiras', COUNT(*) FROM categorias_financeiras
UNION ALL
SELECT 'contas_bancarias', COUNT(*) FROM contas_bancarias
UNION ALL
SELECT 'movimentacoes_financeiras', COUNT(*) FROM movimentacoes_financeiras
UNION ALL
SELECT 'cobrancas_automaticas', COUNT(*) FROM cobrancas_automaticas
UNION ALL
SELECT 'dados_pendentes_confirmacao', COUNT(*) FROM dados_pendentes_confirmacao
UNION ALL
SELECT 'comprovantes_nao_identificados', COUNT(*) FROM comprovantes_nao_identificados
UNION ALL
SELECT 'logs_automacao', COUNT(*) FROM logs_automacao;

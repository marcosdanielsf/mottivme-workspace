-- ============================================================================
-- SCHEMA COMPLETO - SISTEMA BPO FINANCEIRO AUTOMATIZADO
-- ============================================================================
-- Versão: 1.0.0
-- Data: 2025-11-30
-- Descrição: Estrutura completa do banco de dados para o sistema de
--            automação financeira com IA
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABELA: clientes_fornecedores
-- Descrição: Armazena informações de clientes e fornecedores
-- ============================================================================
CREATE TABLE IF NOT EXISTS clientes_fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cpf_cnpj TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  tipo TEXT CHECK (tipo IN ('cliente', 'fornecedor', 'ambos')),
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clientes_fornecedores
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON clientes_fornecedores(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes_fornecedores(telefone);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes_fornecedores(email);
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes_fornecedores(tipo);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes_fornecedores(ativo);

-- ============================================================================
-- TABELA: categorias_financeiras
-- Descrição: Categorias para classificação de receitas e despesas
-- ============================================================================
CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT,
  cor TEXT, -- Código hex da cor para UI
  icone TEXT, -- Nome do ícone para UI
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para categorias_financeiras
CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON categorias_financeiras(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias_financeiras(ativo);

-- ============================================================================
-- TABELA: contas_bancarias
-- Descrição: Contas bancárias da empresa
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

-- Índices para contas_bancarias
CREATE INDEX IF NOT EXISTS idx_contas_tipo ON contas_bancarias(tipo);
CREATE INDEX IF NOT EXISTS idx_contas_ativo ON contas_bancarias(ativo);

-- ============================================================================
-- TABELA: movimentacoes_financeiras
-- Descrição: Todas as movimentações financeiras (receitas e despesas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT NOT NULL,

  -- Valores
  valor_previsto DECIMAL(12,2),
  valor_realizado DECIMAL(12,2),

  -- Datas
  data_vencimento DATE NOT NULL,
  data_realizado DATE,
  data_competencia DATE,

  -- Status
  quitado BOOLEAN DEFAULT false,

  -- Classificação
  tipo_pessoa TEXT CHECK (tipo_pessoa IN ('PF', 'PJ')),
  categoria_id UUID REFERENCES categorias_financeiras(id),
  cliente_fornecedor_id UUID REFERENCES clientes_fornecedores(id),
  conta_bancaria_id UUID REFERENCES contas_bancarias(id),

  -- Informações adicionais
  forma_pagamento TEXT, -- pix, boleto, cartao, dinheiro, ted, doc
  numero_documento TEXT,
  codigo_barras TEXT,
  pix_chave TEXT,
  observacoes TEXT,

  -- Recorrência
  recorrente BOOLEAN DEFAULT false,
  frequencia_recorrencia TEXT, -- mensal, trimestral, semestral, anual

  -- Metadados
  origem TEXT, -- manual, importacao, automatico
  arquivo_comprovante TEXT, -- URL do arquivo no storage

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para movimentacoes_financeiras
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

-- ============================================================================
-- TABELA: cobrancas_automaticas
-- Descrição: Controle do sistema de cobrança automática
-- ============================================================================
CREATE TABLE IF NOT EXISTS cobrancas_automaticas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movimentacao_id UUID UNIQUE REFERENCES movimentacoes_financeiras(id) ON DELETE CASCADE,
  telefone TEXT NOT NULL,

  -- Status do processo de cobrança
  status TEXT NOT NULL CHECK (status IN (
    'pendente',
    'lembrete_enviado',
    'cobranca_enviada',
    'pago',
    'cancelado'
  )) DEFAULT 'pendente',

  -- Timestamps dos eventos
  lembrete_enviado_em TIMESTAMP WITH TIME ZONE,
  cobranca_enviada_em TIMESTAMP WITH TIME ZONE,
  pago_em TIMESTAMP WITH TIME ZONE,

  -- Contadores
  tentativas_lembrete INTEGER DEFAULT 0,
  tentativas_cobranca INTEGER DEFAULT 0,

  -- Observações
  observacoes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para cobrancas_automaticas
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas_automaticas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_movimentacao ON cobrancas_automaticas(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_telefone ON cobrancas_automaticas(telefone);
CREATE INDEX IF NOT EXISTS idx_cobrancas_created_at ON cobrancas_automaticas(created_at);

-- ============================================================================
-- TABELA: dados_pendentes_confirmacao
-- Descrição: Dados extraídos pela IA aguardando confirmação do usuário
-- ============================================================================
CREATE TABLE IF NOT EXISTS dados_pendentes_confirmacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone TEXT NOT NULL,

  -- Dados extraídos pela IA
  dados_extraidos JSONB NOT NULL,

  -- Mensagem de confirmação enviada
  mensagem_confirmacao TEXT NOT NULL,

  -- Status da confirmação
  confirmado BOOLEAN DEFAULT NULL, -- NULL = aguardando, true = confirmado, false = rejeitado
  resposta_usuario TEXT,

  -- Timestamps
  confirmado_em TIMESTAMP WITH TIME ZONE,
  expira_em TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para dados_pendentes_confirmacao
CREATE INDEX IF NOT EXISTS idx_pendentes_telefone ON dados_pendentes_confirmacao(telefone);
CREATE INDEX IF NOT EXISTS idx_pendentes_confirmado ON dados_pendentes_confirmacao(confirmado);
CREATE INDEX IF NOT EXISTS idx_pendentes_expira_em ON dados_pendentes_confirmacao(expira_em);
CREATE INDEX IF NOT EXISTS idx_pendentes_created_at ON dados_pendentes_confirmacao(created_at);

-- ============================================================================
-- TABELA: comprovantes_nao_identificados
-- Descrição: Comprovantes que não puderam ser automaticamente identificados
-- ============================================================================
CREATE TABLE IF NOT EXISTS comprovantes_nao_identificados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone TEXT NOT NULL,

  -- Dados extraídos do comprovante
  dados_comprovante JSONB NOT NULL,

  -- Status de processamento manual
  processado BOOLEAN DEFAULT false,
  processado_por TEXT,
  processado_em TIMESTAMP WITH TIME ZONE,

  -- Movimentação associada (se identificada manualmente)
  movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),

  -- Observações do processamento manual
  observacoes_processamento TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para comprovantes_nao_identificados
CREATE INDEX IF NOT EXISTS idx_comprov_telefone ON comprovantes_nao_identificados(telefone);
CREATE INDEX IF NOT EXISTS idx_comprov_processado ON comprovantes_nao_identificados(processado);
CREATE INDEX IF NOT EXISTS idx_comprov_movimentacao ON comprovantes_nao_identificados(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_comprov_created_at ON comprovantes_nao_identificados(created_at);

-- ============================================================================
-- TABELA: logs_automacao
-- Descrição: Logs de todas as execuções dos workflows de automação
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs_automacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_workflow TEXT NOT NULL, -- agente_principal, cobranca_automatica, processador_comprovantes

  -- Identificadores
  execution_id TEXT, -- ID da execução no n8n
  telefone TEXT,
  movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),

  -- Status
  status TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'em_andamento')),

  -- Detalhes
  mensagem TEXT,
  dados_entrada JSONB,
  dados_saida JSONB,
  erro_detalhes TEXT,

  -- Métricas
  tempo_execucao_ms INTEGER,
  tokens_usados INTEGER,
  custo_estimado DECIMAL(10,4),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para logs_automacao
CREATE INDEX IF NOT EXISTS idx_logs_tipo_workflow ON logs_automacao(tipo_workflow);
CREATE INDEX IF NOT EXISTS idx_logs_status ON logs_automacao(status);
CREATE INDEX IF NOT EXISTS idx_logs_telefone ON logs_automacao(telefone);
CREATE INDEX IF NOT EXISTS idx_logs_movimentacao ON logs_automacao(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_automacao(created_at);

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

-- Triggers para updated_at
CREATE TRIGGER update_clientes_fornecedores_updated_at
  BEFORE UPDATE ON clientes_fornecedores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contas_bancarias_updated_at
  BEFORE UPDATE ON contas_bancarias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movimentacoes_updated_at
  BEFORE UPDATE ON movimentacoes_financeiras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cobrancas_updated_at
  BEFORE UPDATE ON cobrancas_automaticas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pendentes_updated_at
  BEFORE UPDATE ON dados_pendentes_confirmacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comprovantes_updated_at
  BEFORE UPDATE ON comprovantes_nao_identificados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Atualizar saldo da conta bancária
CREATE OR REPLACE FUNCTION atualizar_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é uma movimentação quitada e tem conta associada
  IF NEW.quitado = true AND NEW.conta_bancaria_id IS NOT NULL THEN
    -- Atualiza saldo da conta
    UPDATE contas_bancarias
    SET saldo_atual = saldo_atual +
      CASE
        WHEN NEW.tipo = 'receita' THEN NEW.valor_realizado
        WHEN NEW.tipo = 'despesa' THEN -NEW.valor_realizado
      END
    WHERE id = NEW.conta_bancaria_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar saldo automaticamente
CREATE TRIGGER trigger_atualizar_saldo
  AFTER INSERT OR UPDATE ON movimentacoes_financeiras
  FOR EACH ROW
  WHEN (NEW.quitado = true AND OLD.quitado IS DISTINCT FROM true)
  EXECUTE FUNCTION atualizar_saldo_conta();

-- ============================================================================
-- POLICIES DE SEGURANÇA (Row Level Security - RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE clientes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas_automaticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE dados_pendentes_confirmacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprovantes_nao_identificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_automacao ENABLE ROW LEVEL SECURITY;

-- Policies permissivas para service_role (usado pelo n8n)
-- IMPORTANTE: Ajuste conforme suas necessidades de segurança

CREATE POLICY "Service role tem acesso total" ON clientes_fornecedores
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON categorias_financeiras
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON contas_bancarias
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON movimentacoes_financeiras
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON cobrancas_automaticas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON dados_pendentes_confirmacao
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON comprovantes_nao_identificados
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role tem acesso total" ON logs_automacao
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- DADOS INICIAIS (SEED DATA)
-- ============================================================================

-- Categorias padrão de receitas
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor, icone) VALUES
  ('Serviços', 'receita', 'Receita de prestação de serviços', '#10b981', 'briefcase'),
  ('Produtos', 'receita', 'Venda de produtos', '#3b82f6', 'shopping-cart'),
  ('Consultorias', 'receita', 'Serviços de consultoria', '#8b5cf6', 'users'),
  ('Mensalidades', 'receita', 'Receitas recorrentes de mensalidades', '#06b6d4', 'repeat'),
  ('Outras Receitas', 'receita', 'Outras fontes de receita', '#6b7280', 'dollar-sign')
ON CONFLICT DO NOTHING;

-- Categorias padrão de despesas
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor, icone) VALUES
  ('Folha de Pagamento', 'despesa', 'Salários e encargos', '#ef4444', 'users'),
  ('Utilities', 'despesa', 'Água, luz, internet, telefone', '#f59e0b', 'zap'),
  ('Marketing', 'despesa', 'Investimentos em marketing e publicidade', '#ec4899', 'megaphone'),
  ('Infraestrutura', 'despesa', 'Aluguel, condomínio, manutenção', '#6366f1', 'building'),
  ('Softwares e Ferramentas', 'despesa', 'Assinaturas de softwares', '#8b5cf6', 'laptop'),
  ('Impostos e Taxas', 'despesa', 'Impostos, taxas e contribuições', '#dc2626', 'file-text'),
  ('Fornecedores', 'despesa', 'Pagamentos a fornecedores', '#059669', 'truck'),
  ('Outras Despesas', 'despesa', 'Despesas diversas', '#6b7280', 'more-horizontal')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE clientes_fornecedores IS 'Cadastro de clientes e fornecedores da empresa';
COMMENT ON TABLE categorias_financeiras IS 'Categorias para classificação de movimentações financeiras';
COMMENT ON TABLE contas_bancarias IS 'Contas bancárias da empresa para controle de saldo';
COMMENT ON TABLE movimentacoes_financeiras IS 'Todas as movimentações financeiras (receitas e despesas)';
COMMENT ON TABLE cobrancas_automaticas IS 'Controle de cobranças automáticas via WhatsApp';
COMMENT ON TABLE dados_pendentes_confirmacao IS 'Dados extraídos pela IA aguardando confirmação do usuário';
COMMENT ON TABLE comprovantes_nao_identificados IS 'Comprovantes que necessitam processamento manual';
COMMENT ON TABLE logs_automacao IS 'Logs de execução dos workflows de automação';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Verificar criação das tabelas
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

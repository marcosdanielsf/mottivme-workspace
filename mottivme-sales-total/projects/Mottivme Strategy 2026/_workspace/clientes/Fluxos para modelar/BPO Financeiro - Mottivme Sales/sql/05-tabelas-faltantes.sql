-- ============================================================================
-- SCRIPT SIMPLIFICADO - ADICIONA APENAS TABELAS FALTANTES
-- ============================================================================
-- Este script adiciona APENAS as tabelas que faltam no banco
-- NÃO modifica clientes_fornecedores e movimentacoes_financeiras (já existem)
-- 100% SEGURO - não perde dados
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CRIAR TABELAS NOVAS
-- ============================================================================

-- Tabela: categorias_financeiras
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

-- Tabela: contas_bancarias
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

-- Tabela: cobrancas_automaticas
CREATE TABLE IF NOT EXISTS cobrancas_automaticas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
  telefone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'lembrete_enviado', 'cobranca_enviada', 'pago', 'cancelado')),
  lembrete_enviado_em TIMESTAMP WITH TIME ZONE,
  cobranca_enviada_em TIMESTAMP WITH TIME ZONE,
  tentativas_lembrete INTEGER DEFAULT 0,
  tentativas_cobranca INTEGER DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: dados_pendentes_confirmacao
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

-- Tabela: comprovantes_nao_identificados
CREATE TABLE IF NOT EXISTS comprovantes_nao_identificados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefone TEXT NOT NULL,
  dados_comprovante JSONB NOT NULL,
  processado BOOLEAN DEFAULT false,
  processado_por TEXT,
  processado_em TIMESTAMP WITH TIME ZONE,
  movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
  observacoes_processamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: logs_automacao
CREATE TABLE IF NOT EXISTS logs_automacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo_workflow TEXT NOT NULL,
  execution_id TEXT,
  telefone TEXT,
  movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
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

-- ============================================================================
-- CRIAR ÍNDICES
-- ============================================================================

-- Índices para categorias_financeiras (com verificação de existência de colunas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='categorias_financeiras' AND column_name='tipo') THEN
    CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON categorias_financeiras(tipo);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='categorias_financeiras' AND column_name='ativo') THEN
    CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON categorias_financeiras(ativo);
  END IF;
END $$;

-- Índices para contas_bancarias (com verificação de existência de colunas)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='contas_bancarias' AND column_name='tipo') THEN
    CREATE INDEX IF NOT EXISTS idx_contas_tipo ON contas_bancarias(tipo);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='contas_bancarias' AND column_name='ativo') THEN
    CREATE INDEX IF NOT EXISTS idx_contas_ativo ON contas_bancarias(ativo);
  END IF;
END $$;

-- Índices para cobrancas_automaticas (sempre criados pois tabela é nova)
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas_automaticas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_movimentacao ON cobrancas_automaticas(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_telefone ON cobrancas_automaticas(telefone);
CREATE INDEX IF NOT EXISTS idx_cobrancas_created_at ON cobrancas_automaticas(created_at);

-- Índices para dados_pendentes_confirmacao (sempre criados pois tabela é nova)
CREATE INDEX IF NOT EXISTS idx_pendentes_telefone ON dados_pendentes_confirmacao(telefone);
CREATE INDEX IF NOT EXISTS idx_pendentes_confirmado ON dados_pendentes_confirmacao(confirmado);
CREATE INDEX IF NOT EXISTS idx_pendentes_expira_em ON dados_pendentes_confirmacao(expira_em);
CREATE INDEX IF NOT EXISTS idx_pendentes_created_at ON dados_pendentes_confirmacao(created_at);

-- Índices para comprovantes_nao_identificados (sempre criados pois tabela é nova)
CREATE INDEX IF NOT EXISTS idx_comprov_telefone ON comprovantes_nao_identificados(telefone);
CREATE INDEX IF NOT EXISTS idx_comprov_processado ON comprovantes_nao_identificados(processado);
CREATE INDEX IF NOT EXISTS idx_comprov_movimentacao ON comprovantes_nao_identificados(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_comprov_created_at ON comprovantes_nao_identificados(created_at);

-- Índices para logs_automacao (sempre criados pois tabela é nova)
CREATE INDEX IF NOT EXISTS idx_logs_tipo_workflow ON logs_automacao(tipo_workflow);
CREATE INDEX IF NOT EXISTS idx_logs_status ON logs_automacao(status);
CREATE INDEX IF NOT EXISTS idx_logs_telefone ON logs_automacao(telefone);
CREATE INDEX IF NOT EXISTS idx_logs_movimentacao ON logs_automacao(movimentacao_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs_automacao(created_at);

-- ============================================================================
-- CRIAR VIEWS (adaptadas ao schema existente)
-- ============================================================================

-- View: Resumo financeiro por mês (usa tipo_entidade ao invés de tipo_pessoa)
CREATE OR REPLACE VIEW vw_resumo_mensal AS
SELECT
  DATE_TRUNC('month', m.data_competencia) as mes,
  m.tipo_entidade,
  SUM(CASE WHEN m.tipo = 'receita' AND m.quitado = true THEN m.valor_realizado ELSE 0 END) as receitas_realizadas,
  SUM(CASE WHEN m.tipo = 'despesa' AND m.quitado = true THEN m.valor_realizado ELSE 0 END) as despesas_realizadas,
  SUM(CASE WHEN m.tipo = 'receita' AND m.quitado = false THEN m.valor_previsto ELSE 0 END) as receitas_previstas,
  SUM(CASE WHEN m.tipo = 'despesa' AND m.quitado = false THEN m.valor_previsto ELSE 0 END) as despesas_previstas,
  COUNT(CASE WHEN m.tipo = 'receita' AND m.quitado = false THEN 1 END) as receitas_pendentes_count,
  COUNT(CASE WHEN m.tipo = 'despesa' AND m.quitado = false THEN 1 END) as despesas_pendentes_count
FROM movimentacoes_financeiras m
WHERE m.data_competencia IS NOT NULL
GROUP BY DATE_TRUNC('month', m.data_competencia), m.tipo_entidade
ORDER BY mes DESC, m.tipo_entidade;

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
  m.data_vencimento as data,
  SUM(CASE WHEN m.tipo = 'receita' THEN m.valor_previsto ELSE -m.valor_previsto END) as saldo_dia,
  SUM(SUM(CASE WHEN m.tipo = 'receita' THEN m.valor_previsto ELSE -m.valor_previsto END))
    OVER (ORDER BY m.data_vencimento) as saldo_acumulado
FROM movimentacoes_financeiras m
WHERE
  m.quitado = false
  AND m.data_vencimento >= CURRENT_DATE
GROUP BY m.data_vencimento
ORDER BY m.data_vencimento;

-- ============================================================================
-- CRIAR TRIGGERS E FUNCTIONS
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
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contas_bancarias_updated_at') THEN
    CREATE TRIGGER update_contas_bancarias_updated_at
      BEFORE UPDATE ON contas_bancarias
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
-- INSERIR CATEGORIAS PADRÃO (se tabela vazia)
-- ============================================================================

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

DO $$
DECLARE
  rec RECORD;
BEGIN
  RAISE NOTICE '=== TABELAS CRIADAS ===';
  FOR rec IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'categorias_financeiras',
        'contas_bancarias',
        'cobrancas_automaticas',
        'dados_pendentes_confirmacao',
        'comprovantes_nao_identificados',
        'logs_automacao'
      )
    ORDER BY tablename
  LOOP
    RAISE NOTICE '  ✓ %', rec.tablename;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '=== TABELAS EXISTENTES (não modificadas) ===';
  RAISE NOTICE '  ✓ clientes_fornecedores (mantida como está)';
  RAISE NOTICE '  ✓ movimentacoes_financeiras (mantida como está)';
END $$;

-- Contagem final
SELECT
  'categorias_financeiras' as tabela,
  COUNT(*) as registros
FROM categorias_financeiras
UNION ALL
SELECT 'contas_bancarias', COUNT(*) FROM contas_bancarias
UNION ALL
SELECT 'cobrancas_automaticas', COUNT(*) FROM cobrancas_automaticas
UNION ALL
SELECT 'dados_pendentes_confirmacao', COUNT(*) FROM dados_pendentes_confirmacao
UNION ALL
SELECT 'comprovantes_nao_identificados', COUNT(*) FROM comprovantes_nao_identificados
UNION ALL
SELECT 'logs_automacao', COUNT(*) FROM logs_automacao
ORDER BY tabela;

-- ============================================================================
-- ✅ CONCLUÍDO! Sistema pronto para uso.
-- ============================================================================

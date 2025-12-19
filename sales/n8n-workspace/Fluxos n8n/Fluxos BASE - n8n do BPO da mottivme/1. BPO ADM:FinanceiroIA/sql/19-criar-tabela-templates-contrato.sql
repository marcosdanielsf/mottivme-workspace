-- =====================================================
-- TABELA: templates_contrato
-- Registra os templates de contrato do Google Docs
-- por produto, pais e nicho
-- =====================================================

CREATE TABLE IF NOT EXISTS templates_contrato (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identificacao do template
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,

  -- Criterios de selecao
  produto VARCHAR(100) NOT NULL,        -- BPOSS, BPOSS Evolution, BPOLG, etc
  pais VARCHAR(50) NOT NULL,            -- Brasil, EUA
  nicho VARCHAR(100),                   -- Clinicas, Agente Financeiro, Mentor (NULL = generico)
  moeda VARCHAR(3) NOT NULL,            -- BRL, USD

  -- Google Docs
  google_doc_id VARCHAR(255) NOT NULL,  -- ID do documento template no Google Docs
  google_doc_url TEXT,                  -- URL direta do documento
  google_folder_id VARCHAR(255),        -- Pasta onde gerar copias

  -- Entregas padrao por produto (usado no ANEXO I)
  entregas_padrao TEXT,                 -- Lista de entregas incluidas
  nao_incluso_padrao TEXT,              -- Lista do que nao esta incluido

  -- Metas padrao
  meta_abordagens_dia_min INTEGER DEFAULT 10,
  meta_abordagens_dia_max INTEGER DEFAULT 30,
  meta_agendamentos_mes INTEGER,

  -- Onboarding padrao
  dias_onboarding_padrao INTEGER DEFAULT 15,

  -- Controle
  ativo BOOLEAN DEFAULT true,
  versao VARCHAR(20) DEFAULT '1.0',

  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Constraint unica para evitar duplicatas
  UNIQUE(produto, pais, nicho)
);

-- Comentarios
COMMENT ON TABLE templates_contrato IS 'Templates de contrato no Google Docs por produto/pais/nicho';
COMMENT ON COLUMN templates_contrato.google_doc_id IS 'ID do documento no Google Docs (extraido da URL)';
COMMENT ON COLUMN templates_contrato.nicho IS 'Nicho especifico ou NULL para template generico do produto';

-- Indices
CREATE INDEX IF NOT EXISTS idx_templates_contrato_produto ON templates_contrato(produto);
CREATE INDEX IF NOT EXISTS idx_templates_contrato_pais ON templates_contrato(pais);
CREATE INDEX IF NOT EXISTS idx_templates_contrato_ativo ON templates_contrato(ativo);

-- =====================================================
-- DADOS INICIAIS: Templates existentes
-- =====================================================

-- Template BPOSS Clinicas Brasil (o que voce ja tem)
INSERT INTO templates_contrato (
  nome,
  descricao,
  produto,
  pais,
  nicho,
  moeda,
  google_doc_id,
  google_doc_url,
  entregas_padrao,
  nao_incluso_padrao,
  meta_abordagens_dia_min,
  meta_abordagens_dia_max,
  meta_agendamentos_mes,
  dias_onboarding_padrao
) VALUES (
  'BPOSS Clinicas Brasil',
  'Contrato de BPO Social Selling para clinicas de estetica no Brasil',
  'BPOSS',
  'Brasil',
  'Clinicas',
  'BRL',
  'SEU_GOOGLE_DOC_ID_AQUI', -- Substituir pelo ID real
  'https://docs.google.com/document/d/SEU_GOOGLE_DOC_ID_AQUI/edit',
  '- Implantacao e ajustes de CRM (Kommo)
- Segmentacao de contatos
- Processo de inteligencia de dados
- Definicao de processos de curadoria
- Estabelecimento de habitos operacionais
- Canais de comunicacao (Instagram)
- Estrategias Outbound (Social Selling)
- Infraestrutura de Outbound
- Implantacao de funis de conversao
- Qualificacao de leads
- Follow-up manual e automatizado
- Agendamento de consultas de avaliacao',
  '- Gestao de trafego pago (anuncios)
- Criacao de conteudo para redes sociais
- Producao de materiais graficos
- Consultoria de vendas presencial
- Atendimento pos-venda
- Softwares e ferramentas de terceiros (Socialfy, etc)',
  10,
  30,
  NULL,
  15
) ON CONFLICT (produto, pais, nicho) DO NOTHING;

-- Template BPOSS Clinicas EUA
INSERT INTO templates_contrato (
  nome,
  descricao,
  produto,
  pais,
  nicho,
  moeda,
  google_doc_id,
  entregas_padrao,
  nao_incluso_padrao,
  meta_abordagens_dia_min,
  meta_abordagens_dia_max,
  dias_onboarding_padrao
) VALUES (
  'BPOSS Clinicas EUA',
  'Contrato de BPO Social Selling para clinicas nos Estados Unidos',
  'BPOSS',
  'EUA',
  'Clinicas',
  'USD',
  'SEU_GOOGLE_DOC_ID_EUA_AQUI',
  '- CRM implementation and setup (Kommo)
- Contact segmentation
- Data intelligence process
- Data curation processes
- Operational habits establishment
- Communication channels (Instagram)
- Outbound strategies (Social Selling)
- Outbound infrastructure
- Conversion funnels implementation
- Lead qualification
- Manual and automated follow-up
- Evaluation appointment scheduling',
  '- Paid traffic management (ads)
- Social media content creation
- Graphic materials production
- In-person sales consulting
- After-sales service
- Third-party software and tools',
  15,
  30,
  15
) ON CONFLICT (produto, pais, nicho) DO NOTHING;

-- Template BPOSS Evolution Brasil (generico)
INSERT INTO templates_contrato (
  nome,
  descricao,
  produto,
  pais,
  nicho,
  moeda,
  google_doc_id,
  dias_onboarding_padrao
) VALUES (
  'BPOSS Evolution Brasil',
  'Contrato BPOSS Evolution para Brasil - versao avancada',
  'BPOSS Evolution',
  'Brasil',
  NULL,  -- Generico, sem nicho especifico
  'BRL',
  'SEU_GOOGLE_DOC_ID_EVOLUTION_AQUI',
  20
) ON CONFLICT (produto, pais, nicho) DO NOTHING;

-- Template Trafego Brasil
INSERT INTO templates_contrato (
  nome,
  descricao,
  produto,
  pais,
  nicho,
  moeda,
  google_doc_id,
  dias_onboarding_padrao
) VALUES (
  'Trafego Brasil',
  'Contrato de gestao de trafego pago para Brasil',
  'Trafego',
  'Brasil',
  NULL,
  'BRL',
  'SEU_GOOGLE_DOC_ID_TRAFEGO_AQUI',
  7
) ON CONFLICT (produto, pais, nicho) DO NOTHING;

-- Verificar criacao
SELECT 'Tabela templates_contrato criada com sucesso!' as resultado;

-- Listar templates cadastrados
SELECT nome, produto, pais, nicho, moeda, ativo
FROM templates_contrato
ORDER BY produto, pais, nicho;

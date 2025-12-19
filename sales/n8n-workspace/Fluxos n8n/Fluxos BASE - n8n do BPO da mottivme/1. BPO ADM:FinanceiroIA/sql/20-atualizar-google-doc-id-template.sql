-- =====================================================
-- CADASTRAR TEMPLATES DE CONTRATO - Google Docs
-- Execute no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TEMPLATE 1: BPOSS Clinicas Brasil (Sem Entrada)
-- =====================================================
INSERT INTO templates_contrato (
  nome,
  descricao,
  produto,
  pais,
  nicho,
  moeda,
  google_doc_id,
  google_folder_id,
  entregas_padrao,
  nao_incluso_padrao,
  dias_onboarding_padrao,
  ativo
) VALUES (
  'BPOSS Clinicas Brasil - Sem Entrada',
  'Contrato de BPO Social Selling para clinicas no Brasil - Modelo sem entrada com clausulas de reajuste por budget',
  'BPOSS',
  'Brasil',
  'Clinicas',
  'BRL',
  '1icw_1NnDqmkYCbNLdpJ6nQBSOx9qYGz8yae1nM-bthw',
  '1m6FWRyBlVmbrryVY_dXKRIg9jVWD909R',
  '- Implantacao e ajustes de CRM (Kommo)
- Segmentacao de contatos
- Processo de inteligencia de dados
- Estrategias Outbound (Social Selling)
- Implantacao de funis de conversao
- Qualificacao de leads
- Follow-up manual e automatizado
- Agendamento de consultas',
  '- Gestao de trafego pago (campanhas)
- Criacao de conteudo para redes sociais
- Design grafico
- Desenvolvimento de landing pages',
  15,
  true
) ON CONFLICT (produto, pais, nicho) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  google_doc_id = EXCLUDED.google_doc_id,
  google_folder_id = EXCLUDED.google_folder_id,
  entregas_padrao = EXCLUDED.entregas_padrao,
  nao_incluso_padrao = EXCLUDED.nao_incluso_padrao,
  updated_at = NOW();

-- Verificar cadastro
SELECT id, nome, produto, pais, nicho, google_doc_id, google_folder_id, ativo
FROM templates_contrato
WHERE ativo = true
ORDER BY produto, pais, nicho;

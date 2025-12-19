-- =====================================================
-- ATUALIZACAO: contratos_pendentes
-- Adiciona novos campos para produto, pais, nicho,
-- budget de trafego e condicoes especiais
-- =====================================================

-- 1. Adicionar campos de identificacao do contrato
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS produto VARCHAR(100),
ADD COLUMN IF NOT EXISTS nicho VARCHAR(100),
ADD COLUMN IF NOT EXISTS pais VARCHAR(50) DEFAULT 'Brasil';

-- 2. Adicionar campo de moeda
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS moeda VARCHAR(3) DEFAULT 'BRL';

-- 3. Adicionar campos de budget de trafego
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS budget_trafego DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS budget_trafego_moeda VARCHAR(3) DEFAULT 'BRL';

-- 4. Adicionar campo de dias de onboarding
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS dias_onboarding INTEGER DEFAULT 15;

-- 5. Adicionar campo de condicoes especiais (acordos da call)
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS condicoes_especiais TEXT;

-- 6. Adicionar campo de observacoes da negociacao
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS observacoes_negociacao TEXT;

-- 7. Adicionar campos de metas (opcionais)
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS meta_abordagens_dia INTEGER,
ADD COLUMN IF NOT EXISTS meta_agendamentos_mes INTEGER;

-- 8. Adicionar campo de entregas incluidas/nao incluidas
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS entregas_incluidas TEXT,
ADD COLUMN IF NOT EXISTS entregas_nao_incluidas TEXT;

-- 9. Adicionar campo para URL do contrato gerado
ALTER TABLE contratos_pendentes
ADD COLUMN IF NOT EXISTS url_contrato_gerado TEXT,
ADD COLUMN IF NOT EXISTS google_doc_id VARCHAR(255);

-- Comentarios
COMMENT ON COLUMN contratos_pendentes.produto IS 'Produto contratado: BPOSS, BPOSS Evolution, BPOLG, Trafego, Trafego + Social Media, Implementacao CRM';
COMMENT ON COLUMN contratos_pendentes.nicho IS 'Nicho do cliente: Clinicas, Agente Financeiro, Mentor, etc';
COMMENT ON COLUMN contratos_pendentes.pais IS 'Pais do cliente: Brasil ou EUA - define moeda e template';
COMMENT ON COLUMN contratos_pendentes.moeda IS 'Moeda do contrato: BRL ou USD';
COMMENT ON COLUMN contratos_pendentes.budget_trafego IS 'Valor mensal de investimento em midia paga acordado';
COMMENT ON COLUMN contratos_pendentes.dias_onboarding IS 'Prazo em dias uteis para setup da operacao';
COMMENT ON COLUMN contratos_pendentes.condicoes_especiais IS 'Condicoes especiais negociadas na call (descontos, carencias, etc)';
COMMENT ON COLUMN contratos_pendentes.observacoes_negociacao IS 'Anotacoes livres sobre a negociacao';
COMMENT ON COLUMN contratos_pendentes.meta_abordagens_dia IS 'Meta estimada de abordagens por dia';
COMMENT ON COLUMN contratos_pendentes.meta_agendamentos_mes IS 'Meta estimada de agendamentos por mes';
COMMENT ON COLUMN contratos_pendentes.entregas_incluidas IS 'Descricao das entregas incluidas no escopo';
COMMENT ON COLUMN contratos_pendentes.entregas_nao_incluidas IS 'Descricao do que NAO esta incluido no escopo';
COMMENT ON COLUMN contratos_pendentes.url_contrato_gerado IS 'URL do contrato PDF gerado';
COMMENT ON COLUMN contratos_pendentes.google_doc_id IS 'ID do documento no Google Docs';

-- Criar indice para busca por produto/pais
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_produto ON contratos_pendentes(produto);
CREATE INDEX IF NOT EXISTS idx_contratos_pendentes_pais ON contratos_pendentes(pais);

-- Verificar alteracoes
SELECT 'Tabela contratos_pendentes atualizada com sucesso!' as resultado;

-- Mostrar estrutura atualizada
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'contratos_pendentes'
ORDER BY ordinal_position;

-- =====================================================
-- SINCRONIZAÇÃO: Contratos Pendentes → Sistema Financeiro
-- BPO Financeiro IA - Mottivme Sales
-- =====================================================
-- Este script sincroniza os dados de contratos_pendentes
-- com o sistema financeiro (clientes, recorrências, movimentações)
-- Execute no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASSO 1: Criar/Atualizar Clientes
-- =====================================================
-- Insere novos clientes ou atualiza existentes baseado no email

INSERT INTO clientes_fornecedores (
    nome,
    documento,
    tipo,
    razao_social,
    nacionalidade,
    profissao,
    estado_civil,
    data_nascimento,
    telefone,
    email,
    endereco,
    cep,
    ativo
)
SELECT DISTINCT ON (cp.email)
    cp.nome,
    cp.documento,
    CASE
        WHEN LENGTH(COALESCE(cp.documento, '')) > 11 THEN 'pj'
        ELSE 'pf'
    END as tipo,
    cp.nome_completo_razao_social,
    cp.nacionalidade,
    cp.profissao,
    cp.estado_civil,
    cp.data_nascimento,
    cp.telefone,
    cp.email,
    cp.endereco,
    cp.cep,
    true
FROM contratos_pendentes cp
WHERE cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != ''
ON CONFLICT (email) DO UPDATE SET
    nome = EXCLUDED.nome,
    documento = COALESCE(EXCLUDED.documento, clientes_fornecedores.documento),
    razao_social = COALESCE(EXCLUDED.razao_social, clientes_fornecedores.razao_social),
    nacionalidade = COALESCE(EXCLUDED.nacionalidade, clientes_fornecedores.nacionalidade),
    profissao = COALESCE(EXCLUDED.profissao, clientes_fornecedores.profissao),
    estado_civil = COALESCE(EXCLUDED.estado_civil, clientes_fornecedores.estado_civil),
    data_nascimento = COALESCE(EXCLUDED.data_nascimento, clientes_fornecedores.data_nascimento),
    telefone = COALESCE(EXCLUDED.telefone, clientes_fornecedores.telefone),
    endereco = COALESCE(EXCLUDED.endereco, clientes_fornecedores.endereco),
    cep = COALESCE(EXCLUDED.cep, clientes_fornecedores.cep),
    ativo = true,
    updated_at = NOW();

-- Verificar clientes criados
SELECT 'Clientes sincronizados:' as info, COUNT(*) as total
FROM clientes_fornecedores
WHERE email IN (SELECT email FROM contratos_pendentes WHERE status = 'ativo' AND email IS NOT NULL);


-- =====================================================
-- PASSO 2: Criar categoria de receita para mensalidades
-- =====================================================

INSERT INTO categorias_financeiras (nome, tipo, descricao, cor)
VALUES ('Mensalidades Contratos', 'receita', 'Mensalidades recorrentes de contratos ativos', '#3b82f6')
ON CONFLICT DO NOTHING;

-- Buscar ID da categoria
DO $$
DECLARE
    v_categoria_id UUID;
BEGIN
    SELECT id INTO v_categoria_id
    FROM categorias_financeiras
    WHERE nome = 'Mensalidades Contratos' AND tipo = 'receita';

    RAISE NOTICE 'Categoria ID: %', v_categoria_id;
END $$;


-- =====================================================
-- PASSO 3: Criar Recorrências para Contratos Ativos
-- =====================================================
-- Uma recorrência por contrato ativo = cobrança automática mensal

INSERT INTO recorrencias (
    tipo,
    descricao,
    valor,
    dia_vencimento,
    tipo_entidade,
    categoria_id,
    cliente_fornecedor_id,
    observacao,
    ativo
)
SELECT
    'receita' as tipo,
    'Mensalidade ' || cp.produto || ' - ' || cp.nome as descricao,
    cp.valor_mensal as valor,
    COALESCE(cp.dia_vencimento, EXTRACT(DAY FROM cp.data_inicio)::INTEGER, 10) as dia_vencimento,
    CASE
        WHEN LENGTH(COALESCE(cp.documento, '')) > 11 THEN 'pj'
        ELSE 'pf'
    END as tipo_entidade,
    (SELECT id FROM categorias_financeiras WHERE nome = 'Mensalidades Contratos' AND tipo = 'receita' LIMIT 1) as categoria_id,
    cf.id as cliente_fornecedor_id,
    'Contrato: ' || cp.produto || ' | Parcelas: ' || COALESCE(cp.num_parcelas::TEXT, 'N/A') || ' | Moeda: ' || cp.moeda as observacao,
    true as ativo
FROM contratos_pendentes cp
LEFT JOIN clientes_fornecedores cf ON cf.email = cp.email
WHERE cp.status = 'ativo'
AND cp.valor_mensal > 0
AND cp.email IS NOT NULL
AND NOT EXISTS (
    -- Evita duplicatas: verifica se já existe recorrência para este cliente com mesma descrição
    SELECT 1 FROM recorrencias r
    WHERE r.cliente_fornecedor_id = cf.id
    AND r.descricao LIKE '%' || cp.nome || '%'
    AND r.ativo = true
);

-- Verificar recorrências criadas
SELECT 'Recorrências criadas:' as info, COUNT(*) as total FROM recorrencias WHERE ativo = true;


-- =====================================================
-- PASSO 4: Gerar Movimentações do Mês Atual
-- =====================================================
-- Cria as cobranças do mês atual para cada recorrência ativa

INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    data_vencimento,
    quitado,
    tipo_entidade,
    categoria_id,
    cliente_fornecedor_id,
    observacao
)
SELECT
    r.tipo,
    '[REC] ' || r.descricao || ' - ' || TO_CHAR(CURRENT_DATE, 'TMMonth YYYY'),
    r.valor,
    -- Calcular data de vencimento: dia do vencimento no mês atual
    CASE
        WHEN r.dia_vencimento > EXTRACT(DAY FROM (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'))
        THEN (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::date
        ELSE (DATE_TRUNC('month', CURRENT_DATE) + (r.dia_vencimento - 1) * INTERVAL '1 day')::date
    END as data_vencimento,
    false as quitado,
    r.tipo_entidade,
    r.categoria_id,
    r.cliente_fornecedor_id,
    'Gerado automaticamente de recorrência'
FROM recorrencias r
WHERE r.ativo = true
AND r.tipo = 'receita'
AND NOT EXISTS (
    -- Evita duplicatas: verifica se já existe movimentação para este mês
    SELECT 1 FROM movimentacoes_financeiras m
    WHERE m.cliente_fornecedor_id = r.cliente_fornecedor_id
    AND m.descricao LIKE '[REC]%' || r.descricao || '%'
    AND DATE_TRUNC('month', m.data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
);

-- Verificar movimentações criadas
SELECT 'Movimentações do mês:' as info, COUNT(*) as total
FROM movimentacoes_financeiras
WHERE descricao LIKE '[REC]%'
AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE);


-- =====================================================
-- PASSO 5: Criar tabela cobrancas_automaticas (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS cobrancas_automaticas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    telefone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'pendente', -- pendente, lembrete_enviado, cobranca_enviada, pago
    lembrete_enviado_em TIMESTAMP WITH TIME ZONE,
    cobranca_enviada_em TIMESTAMP WITH TIME ZONE,
    pago_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar constraint única se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'cobrancas_automaticas_movimentacao_id_unique'
    ) THEN
        ALTER TABLE cobrancas_automaticas
        ADD CONSTRAINT cobrancas_automaticas_movimentacao_id_unique
        UNIQUE (movimentacao_id);
    END IF;
END $$;

-- Índices
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas_automaticas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_movimentacao ON cobrancas_automaticas(movimentacao_id);


-- =====================================================
-- PASSO 6: Criar tabela logs_financeiros (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS logs_financeiros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(50),
    entidade_id UUID,
    descricao TEXT,
    dados_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_tipo ON logs_financeiros(tipo_acao);
CREATE INDEX IF NOT EXISTS idx_logs_entidade ON logs_financeiros(entidade);


-- =====================================================
-- RESUMO FINAL
-- =====================================================

SELECT '📊 RESUMO DA SINCRONIZAÇÃO' as titulo;

SELECT
    'Clientes ativos' as metrica,
    COUNT(*) as total
FROM clientes_fornecedores WHERE ativo = true

UNION ALL

SELECT
    'Recorrências ativas' as metrica,
    COUNT(*) as total
FROM recorrencias WHERE ativo = true

UNION ALL

SELECT
    'Movimentações a receber (mês atual)' as metrica,
    COUNT(*) as total
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND quitado = false
AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)

UNION ALL

SELECT
    'Valor total a receber (R$)' as metrica,
    COALESCE(SUM(valor_previsto), 0)::INTEGER as total
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND quitado = false
AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE);


-- =====================================================
-- LISTA DE COBRANÇAS DO MÊS
-- =====================================================

SELECT
    '📋 COBRANÇAS DO MÊS ATUAL' as titulo;

SELECT
    cf.nome as cliente,
    cf.email,
    cf.telefone,
    m.valor_previsto as valor,
    m.data_vencimento as vencimento,
    CASE
        WHEN m.data_vencimento < CURRENT_DATE THEN '🔴 Vencido'
        WHEN m.data_vencimento = CURRENT_DATE THEN '🟡 Vence Hoje'
        WHEN m.data_vencimento <= CURRENT_DATE + INTERVAL '5 days' THEN '🟠 Próximo'
        ELSE '🟢 Em dia'
    END as status
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
AND m.quitado = false
AND DATE_TRUNC('month', m.data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY m.data_vencimento ASC;

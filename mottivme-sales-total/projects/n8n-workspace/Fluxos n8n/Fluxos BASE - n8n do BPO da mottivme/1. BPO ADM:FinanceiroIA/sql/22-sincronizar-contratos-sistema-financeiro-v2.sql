-- =====================================================
-- SINCRONIZAÇÃO: Contratos Pendentes → Sistema Financeiro
-- VERSÃO 2 - Corrigido para JSONB e sem duplicatas
-- =====================================================

-- =====================================================
-- PASSO 1: Criar/Atualizar Clientes (sem ON CONFLICT)
-- =====================================================
-- Atualiza existentes pelo email, insere novos

-- Primeiro, atualizar clientes existentes
UPDATE clientes_fornecedores cf
SET
    nome = cp.nome,
    documento = COALESCE(cp.documento, cf.documento),
    tipo = CASE WHEN LENGTH(COALESCE(cp.documento, '')) > 11 THEN 'pj' ELSE 'pf' END,
    razao_social = COALESCE(cp.nome_completo_razao_social, cf.razao_social),
    nacionalidade = COALESCE(cp.nacionalidade, cf.nacionalidade),
    profissao = COALESCE(cp.profissao, cf.profissao),
    estado_civil = COALESCE(cp.estado_civil, cf.estado_civil),
    data_nascimento = COALESCE(cp.data_nascimento, cf.data_nascimento),
    telefone = COALESCE(cp.telefone, cf.telefone),
    -- endereco é JSONB, então convertemos para JSON
    endereco = CASE
        WHEN cp.endereco IS NOT NULL THEN jsonb_build_object('endereco', cp.endereco)
        ELSE cf.endereco
    END,
    cep = COALESCE(cp.cep, cf.cep),
    ativo = true,
    updated_at = NOW()
FROM contratos_pendentes cp
WHERE cf.email = cp.email
AND cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != '';

-- Agora, inserir novos clientes (que não existem pelo email)
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
    CASE WHEN LENGTH(COALESCE(cp.documento, '')) > 11 THEN 'pj' ELSE 'pf' END,
    cp.nome_completo_razao_social,
    cp.nacionalidade,
    cp.profissao,
    cp.estado_civil,
    cp.data_nascimento,
    cp.telefone,
    cp.email,
    CASE WHEN cp.endereco IS NOT NULL THEN jsonb_build_object('endereco', cp.endereco) ELSE NULL END,
    cp.cep,
    true
FROM contratos_pendentes cp
WHERE cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != ''
AND NOT EXISTS (
    SELECT 1 FROM clientes_fornecedores cf WHERE cf.email = cp.email
);

-- Verificar clientes
SELECT 'Clientes sincronizados:' as info, COUNT(*) as total
FROM clientes_fornecedores
WHERE email IN (SELECT email FROM contratos_pendentes WHERE status = 'ativo' AND email IS NOT NULL);


-- =====================================================
-- PASSO 2: Criar categoria de receita para mensalidades
-- =====================================================

INSERT INTO categorias_financeiras (nome, tipo, descricao, cor)
SELECT 'Mensalidades Contratos', 'receita', 'Mensalidades recorrentes de contratos ativos', '#3b82f6'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias_financeiras WHERE nome = 'Mensalidades Contratos' AND tipo = 'receita'
);


-- =====================================================
-- PASSO 3: Criar Recorrências para Contratos Ativos
-- =====================================================

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
    'Mensalidade ' || COALESCE(cp.produto, 'Serviço') || ' - ' || cp.nome as descricao,
    cp.valor_mensal as valor,
    COALESCE(cp.dia_vencimento, EXTRACT(DAY FROM cp.data_inicio)::INTEGER, 10) as dia_vencimento,
    CASE WHEN LENGTH(COALESCE(cp.documento, '')) > 11 THEN 'pj' ELSE 'pf' END as tipo_entidade,
    (SELECT id FROM categorias_financeiras WHERE nome = 'Mensalidades Contratos' AND tipo = 'receita' LIMIT 1) as categoria_id,
    cf.id as cliente_fornecedor_id,
    'Contrato: ' || COALESCE(cp.produto, 'N/A') || ' | Parcelas: ' || COALESCE(cp.num_parcelas::TEXT, 'N/A') || ' | Moeda: ' || COALESCE(cp.moeda, 'BRL') as observacao,
    true as ativo
FROM contratos_pendentes cp
INNER JOIN clientes_fornecedores cf ON cf.email = cp.email
WHERE cp.status = 'ativo'
AND cp.valor_mensal > 0
AND cp.email IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM recorrencias r
    WHERE r.cliente_fornecedor_id = cf.id
    AND r.ativo = true
);

-- Verificar recorrências
SELECT 'Recorrências criadas:' as info, COUNT(*) as total FROM recorrencias WHERE ativo = true;


-- =====================================================
-- PASSO 4: Gerar Movimentações do Mês Atual
-- =====================================================

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
    '[REC] ' || r.descricao || ' - Dezembro 2024',
    r.valor,
    CASE
        WHEN r.dia_vencimento > 31 THEN '2024-12-31'::date
        ELSE ('2024-12-' || LPAD(r.dia_vencimento::TEXT, 2, '0'))::date
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
    SELECT 1 FROM movimentacoes_financeiras m
    WHERE m.cliente_fornecedor_id = r.cliente_fornecedor_id
    AND m.descricao LIKE '[REC]%'
    AND DATE_TRUNC('month', m.data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
);

-- Verificar movimentações
SELECT 'Movimentações dezembro:' as info, COUNT(*) as total
FROM movimentacoes_financeiras
WHERE descricao LIKE '[REC]%'
AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE);


-- =====================================================
-- PASSO 5: Criar tabela cobrancas_automaticas
-- =====================================================

CREATE TABLE IF NOT EXISTS cobrancas_automaticas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    telefone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'pendente',
    lembrete_enviado_em TIMESTAMP WITH TIME ZONE,
    cobranca_enviada_em TIMESTAMP WITH TIME ZONE,
    pago_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Constraint única
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'cobrancas_automaticas_movimentacao_id_unique'
    ) THEN
        ALTER TABLE cobrancas_automaticas
        ADD CONSTRAINT cobrancas_automaticas_movimentacao_id_unique UNIQUE (movimentacao_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas_automaticas(status);


-- =====================================================
-- PASSO 6: Criar tabela logs_financeiros
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


-- =====================================================
-- RESUMO FINAL
-- =====================================================

SELECT '📊 RESUMO DA SINCRONIZAÇÃO' as titulo;

SELECT 'Clientes ativos' as metrica, COUNT(*)::TEXT as total FROM clientes_fornecedores WHERE ativo = true
UNION ALL
SELECT 'Recorrências ativas', COUNT(*)::TEXT FROM recorrencias WHERE ativo = true
UNION ALL
SELECT 'Cobranças dezembro', COUNT(*)::TEXT FROM movimentacoes_financeiras WHERE tipo = 'receita' AND quitado = false AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE)
UNION ALL
SELECT 'Total a receber (R$)', COALESCE(SUM(valor_previsto), 0)::TEXT FROM movimentacoes_financeiras WHERE tipo = 'receita' AND quitado = false AND DATE_TRUNC('month', data_vencimento) = DATE_TRUNC('month', CURRENT_DATE);


-- =====================================================
-- LISTA DE COBRANÇAS
-- =====================================================

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

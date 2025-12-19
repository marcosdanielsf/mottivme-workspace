-- =====================================================
-- SINCRONIZAÇÃO: Contratos Pendentes → Sistema Financeiro
-- VERSÃO 4 FINAL - Campos mínimos necessários
-- =====================================================

-- =====================================================
-- PASSO 0: Resolver email duplicado
-- =====================================================

UPDATE clientes_fornecedores
SET email = 'riquezanaamerica_old@gmail.com'
WHERE email = 'riquezanaamerica@gmail.com'
AND id = 'b78fe8ca-f9bb-43ef-8a78-850cd2ea9a11';

SELECT 'Email duplicado resolvido' as info;


-- =====================================================
-- PASSO 1: Atualizar Clientes Existentes (campos mínimos)
-- =====================================================

UPDATE clientes_fornecedores cf
SET
    nome = cp.nome,
    telefone = COALESCE(cp.telefone, cf.telefone),
    ativo = true,
    updated_at = NOW()
FROM contratos_pendentes cp
WHERE cf.email = cp.email
AND cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != '';

SELECT 'Clientes atualizados' as info;


-- =====================================================
-- PASSO 2: Inserir Novos Clientes (campos mínimos)
-- =====================================================

INSERT INTO clientes_fornecedores (
    nome,
    tipo,
    telefone,
    email,
    ativo
)
SELECT DISTINCT ON (cp.email)
    cp.nome,
    'pessoa_fisica',
    cp.telefone,
    cp.email,
    true
FROM contratos_pendentes cp
WHERE cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != ''
AND NOT EXISTS (
    SELECT 1 FROM clientes_fornecedores cf WHERE cf.email = cp.email
);

SELECT 'Novos clientes inseridos' as info;


-- =====================================================
-- PASSO 3: Criar categoria de receita
-- =====================================================

INSERT INTO categorias_financeiras (nome, tipo, descricao, cor)
SELECT 'Mensalidades Contratos', 'receita', 'Mensalidades recorrentes de contratos ativos', '#3b82f6'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias_financeiras WHERE nome = 'Mensalidades Contratos' AND tipo = 'receita'
);

SELECT 'Categoria criada' as info;


-- =====================================================
-- PASSO 4: Criar Recorrências (campos mínimos)
-- =====================================================

INSERT INTO recorrencias (
    tipo,
    descricao,
    valor,
    dia_vencimento,
    categoria_id,
    cliente_fornecedor_id,
    observacao,
    ativo
)
SELECT
    'receita',
    'Mensalidade ' || COALESCE(cp.produto, 'Serviço') || ' - ' || cp.nome,
    cp.valor_mensal,
    COALESCE(cp.dia_vencimento, EXTRACT(DAY FROM cp.data_inicio)::INTEGER, 10),
    (SELECT id FROM categorias_financeiras WHERE nome = 'Mensalidades Contratos' LIMIT 1),
    cf.id,
    'Contrato: ' || COALESCE(cp.produto, 'N/A') || ' | Moeda: ' || COALESCE(cp.moeda, 'BRL'),
    true
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

SELECT 'Recorrências criadas:' as info, COUNT(*) as total FROM recorrencias WHERE ativo = true;


-- =====================================================
-- PASSO 5: Gerar Movimentações de Dezembro
-- =====================================================

INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    data_vencimento,
    quitado,
    categoria_id,
    cliente_fornecedor_id,
    observacao
)
SELECT
    'receita',
    '[REC] ' || r.descricao || ' - Dez/2024',
    r.valor,
    CASE
        WHEN r.dia_vencimento > 31 THEN '2024-12-31'::date
        ELSE ('2024-12-' || LPAD(r.dia_vencimento::TEXT, 2, '0'))::date
    END,
    false,
    r.categoria_id,
    r.cliente_fornecedor_id,
    'Gerado automaticamente'
FROM recorrencias r
WHERE r.ativo = true
AND r.tipo = 'receita'
AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_financeiras m
    WHERE m.cliente_fornecedor_id = r.cliente_fornecedor_id
    AND m.descricao LIKE '[REC]%'
    AND m.data_vencimento >= '2024-12-01'
    AND m.data_vencimento <= '2024-12-31'
);

SELECT 'Cobranças dezembro criadas' as info;


-- =====================================================
-- PASSO 6: Tabelas de suporte
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

CREATE TABLE IF NOT EXISTS logs_financeiros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(50),
    entidade_id UUID,
    descricao TEXT,
    dados_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- =====================================================
-- ✅ RESUMO FINAL
-- =====================================================

SELECT '✅ SINCRONIZAÇÃO CONCLUÍDA!' as status;

SELECT
    'Clientes ativos' as metrica,
    COUNT(*)::TEXT as total
FROM clientes_fornecedores WHERE ativo = true

UNION ALL

SELECT 'Recorrências ativas', COUNT(*)::TEXT
FROM recorrencias WHERE ativo = true

UNION ALL

SELECT 'Cobranças dezembro', COUNT(*)::TEXT
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND quitado = false
AND data_vencimento >= '2024-12-01'
AND data_vencimento <= '2024-12-31';


-- =====================================================
-- 📋 LISTA DE COBRANÇAS
-- =====================================================

SELECT
    cf.nome as cliente,
    cf.telefone,
    m.valor_previsto as valor,
    m.data_vencimento as vencimento,
    CASE
        WHEN m.data_vencimento < CURRENT_DATE THEN '🔴 Vencido'
        WHEN m.data_vencimento = CURRENT_DATE THEN '🟡 Hoje'
        WHEN m.data_vencimento <= CURRENT_DATE + 5 THEN '🟠 Próximo'
        ELSE '🟢 Em dia'
    END as status
FROM movimentacoes_financeiras m
INNER JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
AND m.quitado = false
AND m.data_vencimento >= '2024-12-01'
AND m.data_vencimento <= '2024-12-31'
ORDER BY m.data_vencimento ASC;

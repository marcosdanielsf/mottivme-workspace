-- =====================================================
-- SINCRONIZAÇÃO: Contratos Pendentes → Sistema Financeiro
-- VERSÃO FINAL v2 - Tabela categorias corrigida
-- =====================================================

-- =====================================================
-- PASSO 0: Resolver email duplicado
-- =====================================================

UPDATE clientes_fornecedores
SET email = 'riquezanaamerica_old@gmail.com'
WHERE email = 'riquezanaamerica@gmail.com'
AND id = 'b78fe8ca-f9bb-43ef-8a78-850cd2ea9a11';

SELECT 'Passo 0: Email duplicado resolvido' as info;


-- =====================================================
-- PASSO 1: Atualizar Clientes Existentes
-- =====================================================

UPDATE clientes_fornecedores cf
SET
    nome = cp.nome,
    telefone = COALESCE(cp.telefone, cf.telefone),
    documento = COALESCE(cp.documento, cf.documento),
    ativo = true,
    updated_at = NOW()
FROM contratos_pendentes cp
WHERE cf.email = cp.email
AND cp.status = 'ativo'
AND cp.email IS NOT NULL
AND cp.email != '';

SELECT 'Passo 1: Clientes atualizados' as info;


-- =====================================================
-- PASSO 2: Inserir Novos Clientes
-- =====================================================

INSERT INTO clientes_fornecedores (
    nome,
    tipo,
    documento,
    telefone,
    email,
    ativo
)
SELECT DISTINCT ON (cp.email)
    cp.nome,
    'pessoa_fisica',
    COALESCE(cp.documento, 'PEND-' || LEFT(md5(cp.email), 8)),
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

SELECT 'Passo 2: Novos clientes inseridos' as info;


-- =====================================================
-- PASSO 3: Criar categoria na tabela CATEGORIAS
-- =====================================================

INSERT INTO categorias (nome, tipo, descricao, cor)
SELECT 'Mensalidades Contratos', 'receita', 'Mensalidades de contratos ativos', '#3b82f6'
WHERE NOT EXISTS (
    SELECT 1 FROM categorias WHERE nome = 'Mensalidades Contratos'
);

SELECT 'Passo 3: Categoria criada' as info;


-- =====================================================
-- PASSO 4: Criar Recorrências
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
    COALESCE(cp.dia_vencimento, 10),
    (SELECT id FROM categorias WHERE nome = 'Mensalidades Contratos' LIMIT 1),
    cf.id,
    'Moeda: ' || COALESCE(cp.moeda, 'BRL'),
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

SELECT 'Passo 4: Recorrências criadas - ' || COUNT(*)::TEXT as info FROM recorrencias WHERE ativo = true;


-- =====================================================
-- PASSO 5: Gerar Movimentações de Dezembro 2024
-- =====================================================

INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    data_competencia,
    data_vencimento,
    valor_previsto,
    quitado,
    categoria_id,
    cliente_fornecedor_id,
    observacao
)
SELECT
    'receita',
    '[REC] ' || r.descricao || ' - Dez/2024',
    '2024-12-01'::date,
    CASE
        WHEN r.dia_vencimento > 31 THEN '2024-12-31'::date
        ELSE ('2024-12-' || LPAD(r.dia_vencimento::TEXT, 2, '0'))::date
    END,
    r.valor,
    false,
    (SELECT id FROM categorias WHERE nome = 'Mensalidades Contratos' LIMIT 1),
    r.cliente_fornecedor_id,
    'Gerado automaticamente de recorrência'
FROM recorrencias r
WHERE r.ativo = true
AND r.tipo = 'receita'
AND NOT EXISTS (
    SELECT 1 FROM movimentacoes_financeiras m
    WHERE m.cliente_fornecedor_id = r.cliente_fornecedor_id
    AND m.descricao LIKE '[REC]%'
    AND m.data_competencia = '2024-12-01'::date
);

SELECT 'Passo 5: Cobranças dezembro criadas' as info;


-- =====================================================
-- PASSO 6: Tabelas de suporte
-- =====================================================

CREATE TABLE IF NOT EXISTS cobrancas_automaticas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movimentacao_id UUID REFERENCES movimentacoes_financeiras(id),
    telefone VARCHAR(20),
    status VARCHAR(30) DEFAULT 'pendente',
    lembrete_enviado_em TIMESTAMP WITH TIME ZONE,
    cobranca_enviada_em TIMESTAMP WITH TIME ZONE,
    pago_em TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logs_financeiros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(50),
    entidade_id UUID,
    descricao TEXT,
    dados_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

SELECT 'Passo 6: Tabelas de suporte criadas' as info;


-- =====================================================
-- ✅ RESUMO FINAL
-- =====================================================

SELECT '========================================' as separador;
SELECT '✅ SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!' as status;
SELECT '========================================' as separador;

SELECT
    'Clientes ativos' as metrica,
    COUNT(*)::TEXT as total
FROM clientes_fornecedores WHERE ativo = true

UNION ALL

SELECT 'Recorrências ativas', COUNT(*)::TEXT
FROM recorrencias WHERE ativo = true

UNION ALL

SELECT 'Cobranças dezembro 2024', COUNT(*)::TEXT
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
AND data_competencia = '2024-12-01';


-- =====================================================
-- 📋 LISTA DE COBRANÇAS DO MÊS
-- =====================================================

SELECT '📋 COBRANÇAS DE DEZEMBRO 2024:' as titulo;

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
AND m.data_competencia = '2024-12-01'
ORDER BY m.data_vencimento ASC;

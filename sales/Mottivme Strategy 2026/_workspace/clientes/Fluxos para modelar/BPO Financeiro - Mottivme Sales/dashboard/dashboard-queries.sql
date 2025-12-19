-- ===================================
-- QUERIES DO DASHBOARD FINANCEIRO
-- Copie e cole cada query no Retool
-- ===================================

-- ===================================
-- 1. OVERVIEW PAGE
-- ===================================

-- query_saldo_total
SELECT
    COALESCE(SUM(saldo_atual), 0) as saldo_total
FROM contas_bancarias
WHERE ativo = true;

-- query_receitas_mes
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total_receitas
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
  AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- query_despesas_mes
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
  AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- query_lucro_mes
WITH receitas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
      AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
),
despesas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
      AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
)
SELECT
    (receitas.total - despesas.total) as lucro_liquido
FROM receitas, despesas;

-- query_inadimplencia_total
SELECT
    COALESCE(SUM(valor_total), 0) as total_inadimplente
FROM inadimplencias
WHERE status_cobranca IN ('em_cobranca', 'inadimplente', 'negociacao');

-- query_inadimplencia_count
SELECT
    COUNT(*) as quantidade_inadimplentes
FROM inadimplencias
WHERE status_cobranca IN ('em_cobranca', 'inadimplente', 'negociacao');

-- query_vencimentos_proximos
SELECT
    COALESCE(SUM(valor_previsto), 0) as total_vencendo
FROM movimentacoes_financeiras
WHERE data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND quitado = false;

-- query_vencimentos_count
SELECT
    COUNT(*) as quantidade_vencendo
FROM movimentacoes_financeiras
WHERE data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND quitado = false;

-- query_fluxo_caixa_mensal (últimos 6 meses)
WITH meses AS (
    SELECT
        TO_CHAR(data_competencia, 'YYYY-MM') as mes_ano,
        tipo,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
    GROUP BY TO_CHAR(data_competencia, 'YYYY-MM'), tipo
)
SELECT
    mes_ano,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) as receitas,
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as despesas,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) -
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as lucro
FROM meses
GROUP BY mes_ano
ORDER BY mes_ano DESC
LIMIT 6;

-- query_receitas_despesas_mes
WITH totais AS (
    SELECT
        tipo,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
      AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY tipo
)
SELECT
    CASE
        WHEN tipo = 'receita' THEN 'Receitas'
        WHEN tipo = 'despesa' THEN 'Despesas'
    END as tipo,
    total
FROM totais;

-- query_vencimentos_proximos_detalhes
SELECT
    m.data_vencimento,
    cf.nome as cliente_fornecedor,
    c.nome as categoria,
    m.valor_previsto,
    m.tipo
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.data_vencimento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND m.quitado = false
ORDER BY m.data_vencimento ASC
LIMIT 20;

-- ===================================
-- 2. RECEITAS PAGE
-- ===================================

-- query_receitas (com filtros dinâmicos do Retool)
SELECT
    m.id,
    m.data_vencimento,
    cf.nome as cliente_fornecedor,
    c.nome as categoria,
    m.valor_previsto,
    m.valor_realizado,
    m.quitado,
    m.observacao,
    EXTRACT(DAY FROM CURRENT_DATE - m.data_vencimento)::INTEGER as dias_vencido
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'receita'
  -- Filtro de período: {{ receitas_filters.periodo.value }}
  AND m.data_vencimento >= {{ receitas_filters.periodo.start || '1900-01-01' }}
  AND m.data_vencimento <= {{ receitas_filters.periodo.end || '2100-12-31' }}
  -- Filtro de cliente: {{ receitas_filters.cliente.value }}
  {% if receitas_filters.cliente.value.length > 0 %}
    AND m.cliente_fornecedor_id = ANY({{ receitas_filters.cliente.value }})
  {% endif %}
  -- Filtro de categoria: {{ receitas_filters.categoria.value }}
  {% if receitas_filters.categoria.value.length > 0 %}
    AND m.categoria_id = ANY({{ receitas_filters.categoria.value }})
  {% endif %}
  -- Filtro de quitado: {{ receitas_filters.quitado.value }}
  {% if receitas_filters.quitado.value %}
    AND m.quitado = true
  {% endif %}
ORDER BY m.data_vencimento DESC;

-- query_clientes_list
SELECT
    id,
    nome
FROM clientes_fornecedores
WHERE ativo = true
ORDER BY nome;

-- query_categorias_receitas
SELECT
    id,
    nome
FROM categorias
WHERE tipo = 'receita'
  AND ativo = true
ORDER BY nome;

-- query_receitas_por_categoria
SELECT
    c.nome as categoria,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'receita'
  AND m.data_competencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY c.nome
ORDER BY total DESC
LIMIT 10;

-- ===================================
-- 3. DESPESAS PAGE
-- ===================================

-- query_despesas (com filtros dinâmicos)
SELECT
    m.id,
    m.data_vencimento,
    cf.nome as cliente_fornecedor,
    c.nome as categoria,
    m.tipo_entidade,
    m.valor_previsto,
    m.valor_realizado,
    m.quitado
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'despesa'
  -- Filtro de tipo_entidade (tabs): {{ despesas_tabs.selected }}
  {% if despesas_tabs.selected !== 'todas' %}
    AND m.tipo_entidade = {{ despesas_tabs.selected }}
  {% endif %}
  -- Filtro de período: {{ despesas_filters.periodo.value }}
  AND m.data_vencimento >= {{ despesas_filters.periodo.start || '1900-01-01' }}
  AND m.data_vencimento <= {{ despesas_filters.periodo.end || '2100-12-31' }}
  -- Filtro de fornecedor: {{ despesas_filters.fornecedor.value }}
  {% if despesas_filters.fornecedor.value.length > 0 %}
    AND m.cliente_fornecedor_id = ANY({{ despesas_filters.fornecedor.value }})
  {% endif %}
  -- Filtro de categoria: {{ despesas_filters.categoria.value }}
  {% if despesas_filters.categoria.value.length > 0 %}
    AND m.categoria_id = ANY({{ despesas_filters.categoria.value }})
  {% endif %}
ORDER BY m.data_vencimento DESC;

-- query_fornecedores_list
SELECT
    id,
    nome
FROM clientes_fornecedores
WHERE ativo = true
ORDER BY nome;

-- query_categorias_despesas
SELECT
    id,
    nome
FROM categorias
WHERE tipo = 'despesa'
  AND ativo = true
ORDER BY nome;

-- query_top_despesas_categorias
SELECT
    c.nome as categoria,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY c.nome
ORDER BY total DESC
LIMIT 10;

-- query_despesas_pf_pj
SELECT
    CASE
        WHEN tipo_entidade = 'pf' THEN 'Pessoa Física'
        WHEN tipo_entidade = 'pj' THEN 'Pessoa Jurídica'
    END as tipo_entidade,
    SUM(valor_previsto) as total
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('month', CURRENT_DATE)
  AND data_competencia < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
GROUP BY tipo_entidade;

-- ===================================
-- 4. INADIMPLÊNCIA PAGE
-- ===================================

-- query_inadimplencia_por_status
SELECT
    status_cobranca,
    COUNT(*) as quantidade
FROM inadimplencias
WHERE status_cobranca != 'recuperado'
GROUP BY status_cobranca;

-- query_media_dias_atraso
SELECT
    ROUND(AVG(dias_atraso)) as media_dias
FROM inadimplencias
WHERE status_cobranca IN ('em_cobranca', 'inadimplente', 'negociacao');

-- query_inadimplentes
SELECT
    m.id as movimentacao_id,
    cf.nome as cliente_fornecedor,
    cf.telefone,
    cf.email,
    m.data_vencimento,
    i.dias_atraso,
    i.valor_total,
    i.status_cobranca,
    i.tentativas_cobranca,
    i.ultima_cobranca
FROM inadimplencias i
JOIN movimentacoes_financeiras m ON i.movimentacao_id = m.id
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE i.status_cobranca != 'recuperado'
ORDER BY i.dias_atraso DESC, i.valor_total DESC;

-- ===================================
-- 5. CONCILIAÇÃO PAGE
-- ===================================

-- query_contas_bancarias
SELECT
    id,
    nome
FROM contas_bancarias
WHERE ativo = true
ORDER BY nome;

-- query_extratos_bancarios (com filtros)
SELECT
    id,
    data_transacao,
    descricao,
    valor,
    tipo,
    saldo,
    conciliado
FROM extratos_bancarios
WHERE 1=1
  -- Filtro de período
  AND data_transacao >= {{ conciliacao_filters.periodo.start || '1900-01-01' }}
  AND data_transacao <= {{ conciliacao_filters.periodo.end || '2100-12-31' }}
  -- Filtro de conta
  {% if conciliacao_filters.conta.value %}
    AND conta_bancaria_id = {{ conciliacao_filters.conta.value }}
  {% endif %}
  -- Filtro de pendentes
  {% if conciliacao_filters.apenas_pendentes.value %}
    AND conciliado = false
  {% endif %}
ORDER BY data_transacao DESC;

-- query_movimentacoes_nao_conciliadas
SELECT
    m.id,
    m.data_vencimento,
    cf.nome as cliente_fornecedor,
    m.valor_previsto,
    c.nome as categoria
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.conciliado = false
  AND m.quitado = true
ORDER BY m.data_vencimento DESC;

-- ===================================
-- 6. RELATÓRIOS PAGE
-- ===================================

-- query_dre (DRE Simplificado)
WITH receitas AS (
    SELECT
        'RECEITAS OPERACIONAIS' as item,
        1 as nivel,
        1 as ordem,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as valor
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= {{ relatorios_filters.periodo.start || DATE_TRUNC('month', CURRENT_DATE) }}
      AND data_competencia <= {{ relatorios_filters.periodo.end || DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' }}
),
despesas AS (
    SELECT
        'DESPESAS OPERACIONAIS' as item,
        1 as nivel,
        2 as ordem,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) * -1 as valor
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= {{ relatorios_filters.periodo.start || DATE_TRUNC('month', CURRENT_DATE) }}
      AND data_competencia <= {{ relatorios_filters.periodo.end || DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' }}
),
resultado AS (
    SELECT
        'RESULTADO LÍQUIDO' as item,
        1 as nivel,
        3 as ordem,
        (SELECT SUM(valor) FROM receitas) + (SELECT SUM(valor) FROM despesas) as valor
)
SELECT * FROM receitas
UNION ALL SELECT * FROM despesas
UNION ALL SELECT * FROM resultado
ORDER BY ordem;

-- ===================================
-- ACTIONS (para botões do dashboard)
-- ===================================

-- marcar_quitado (UPDATE)
UPDATE movimentacoes_financeiras
SET
    quitado = true,
    valor_realizado = valor_previsto,
    data_realizado = CURRENT_DATE,
    updated_at = NOW()
WHERE id = {{ table.selectedRow.id }};

-- marcar_pago (UPDATE)
UPDATE movimentacoes_financeiras
SET
    quitado = true,
    valor_realizado = valor_previsto,
    data_realizado = CURRENT_DATE,
    updated_at = NOW()
WHERE id = {{ table.selectedRow.id }};

-- enviar_cobranca (Trigger n8n webhook)
-- Este será um HTTP request do Retool para o webhook do n8n
-- POST https://seu-n8n.com/webhook/cobranca
-- Body: { "movimentacao_id": "{{ table.selectedRow.id }}" }

-- iniciar_negociacao (UPDATE inadimplencias)
UPDATE inadimplencias
SET
    status_cobranca = 'negociacao',
    em_negociacao = true,
    updated_at = NOW()
WHERE movimentacao_id = {{ table.selectedRow.movimentacao_id }};

-- marcar_irrecuperavel (UPDATE inadimplencias)
UPDATE inadimplencias
SET
    status_cobranca = 'irrecuperavel',
    updated_at = NOW()
WHERE movimentacao_id = {{ table.selectedRow.movimentacao_id }};

-- conciliar_manual (UPDATE)
UPDATE extratos_bancarios
SET
    conciliado = true,
    movimentacao_id = {{ selected_movimentacao_id }},
    updated_at = NOW()
WHERE id = {{ selected_extrato_id }};

UPDATE movimentacoes_financeiras
SET
    conciliado = true,
    updated_at = NOW()
WHERE id = {{ selected_movimentacao_id }};

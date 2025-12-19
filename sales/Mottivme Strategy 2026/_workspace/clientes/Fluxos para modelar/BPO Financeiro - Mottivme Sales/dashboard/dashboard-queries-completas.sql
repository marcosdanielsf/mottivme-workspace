-- ===================================
-- DASHBOARD FINANCEIRO MOTTIVME SALES
-- Queries SQL completas - Replicação exata do Power BI
-- ===================================

-- ===================================
-- PÁGINA 1: HOME (Splash Screen)
-- ===================================
-- Não requer queries - apenas design

-- ===================================
-- PÁGINA 2: OVERVIEW FINANCEIRO
-- ===================================

-- KPI 1: Faturamento Total
-- query_overview_faturamento
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as faturamento_total
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
  AND data_competencia <= CURRENT_DATE;

-- KPI 2: Despesas Total
-- query_overview_despesas
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as despesas_total
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
  AND data_competencia <= CURRENT_DATE;

-- KPI 3: Lucro
-- query_overview_lucro
WITH receitas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
despesas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
)
SELECT
    (r.total - d.total) as lucro_total
FROM receitas r, despesas d;

-- KPI 4: % Lucro
-- query_overview_percentual_lucro
WITH receitas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
),
despesas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
)
SELECT
    CASE
        WHEN r.total = 0 THEN 0
        ELSE ROUND(((r.total - d.total) / r.total * 100)::numeric, 2)
    END as percentual_lucro
FROM receitas r, despesas d;

-- KPI 5: Saldo Atual
-- query_overview_saldo_atual
SELECT
    COALESCE(SUM(saldo_atual), 0) as saldo_total
FROM contas_bancarias
WHERE ativo = true;

-- Gráfico: Faturamento X Despesas Por Mês
-- query_overview_faturamento_despesas_mes
WITH meses AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        tipo,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
      AND data_competencia <= CURRENT_DATE
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia), tipo
)
SELECT
    mes,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) as faturamento,
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as despesa,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) -
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as lucro
FROM meses
GROUP BY mes, mes_num
ORDER BY mes_num;

-- Gráfico: Saldo Por Mês (BTG MOTTIVME)
-- query_overview_saldo_por_mes
WITH movimentacoes_mensais AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        SUM(CASE
            WHEN tipo = 'receita' AND quitado THEN valor_realizado
            WHEN tipo = 'despesa' AND quitado THEN -valor_realizado
            ELSE 0
        END) as saldo_mes
    FROM movimentacoes_financeiras m
    JOIN contas_bancarias c ON m.conta_bancaria_id = c.id
    WHERE c.nome LIKE '%BTG%MOTTIVME%'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
)
SELECT
    mes,
    SUM(saldo_mes) OVER (ORDER BY mes_num) as saldo_acumulado
FROM movimentacoes_mensais
ORDER BY mes_num;

-- Gráfico Pizza: Faturamento por Categoria
-- query_overview_faturamento_categoria
SELECT
    COALESCE(c.nome, 'Sem Categoria') as categoria,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'receita'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC
LIMIT 10;

-- Gráfico: Faturamento por Cliente
-- query_overview_faturamento_cliente
SELECT
    COALESCE(cf.nome, 'Sem Cliente') as cliente,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'receita'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY cf.nome
ORDER BY total DESC
LIMIT 20;

-- Gráfico: Despesas por Categoria
-- query_overview_despesas_categoria
SELECT
    COALESCE(c.nome, 'Sem Categoria') as categoria,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
LEFT JOIN categorias c ON m.categoria_id = c.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY c.nome
ORDER BY total DESC
LIMIT 15;

-- ===================================
-- PÁGINA 3: VISÃO DE FATURAMENTO
-- ===================================

-- KPI 1: Faturamento Total (mesmo do overview)
-- Reutilizar: query_overview_faturamento

-- KPI 2: Qtd Recebimentos
-- query_faturamento_qtd_recebimentos
SELECT
    COUNT(*) as quantidade_recebimentos
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = true
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE);

-- KPI 3: Qtd Clientes
-- query_faturamento_qtd_clientes
SELECT
    COUNT(DISTINCT cliente_fornecedor_id) as quantidade_clientes
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE);

-- KPI 4: Ticket Médio
-- query_faturamento_ticket_medio
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND((SUM(valor_previsto) / COUNT(*))::numeric, 2)
    END as ticket_medio
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE);

-- KPI 5: Média Faturamento
-- query_faturamento_media_mensal
WITH meses_faturamento AS (
    SELECT
        TO_CHAR(data_competencia, 'YYYY-MM') as mes,
        SUM(valor_previsto) as total_mes
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'YYYY-MM')
)
SELECT
    ROUND(AVG(total_mes)::numeric, 2) as media_faturamento_mensal
FROM meses_faturamento;

-- Gráfico: Faturamento por Mês
-- query_faturamento_por_mes
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total_faturamento
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- Gráfico: % de Crescimento de Faturamento
-- query_faturamento_crescimento_percentual
WITH faturamento_mensal AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
),
crescimento AS (
    SELECT
        mes,
        mes_num,
        total,
        LAG(total) OVER (ORDER BY mes_num) as mes_anterior
    FROM faturamento_mensal
)
SELECT
    mes,
    CASE
        WHEN mes_anterior IS NULL OR mes_anterior = 0 THEN 0
        ELSE ROUND(((total - mes_anterior) / mes_anterior * 100)::numeric, 2)
    END as percentual_crescimento
FROM crescimento
ORDER BY mes_num;

-- Gráfico: Quantidade de Clientes por Mês
-- query_faturamento_clientes_por_mes
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    COUNT(DISTINCT cliente_fornecedor_id) as quantidade_clientes
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- Gráfico Pizza: Faturamento por Categoria (reutilizar query_overview_faturamento_categoria)

-- Gráfico: Faturamento por Cliente (reutilizar query_overview_faturamento_cliente)

-- ===================================
-- PÁGINA 4: VISÃO DE DESPESAS
-- ===================================

-- KPI 1: Despesas Total
-- query_despesas_total (reutilizar query_overview_despesas)

-- KPI 2: Qtd Despesas
-- query_despesas_qtd_despesas
SELECT
    COUNT(*) as quantidade_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE);

-- KPI 3: Média Despesas
-- query_despesas_media
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND((SUM(valor_previsto) / COUNT(*))::numeric, 2)
    END as media_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE);

-- KPI 4: Lucro (reutilizar query_overview_lucro)

-- KPI 5: % Lucro (reutilizar query_overview_percentual_lucro)

-- Gráfico: Despesas e Variação % Mês a Mês
-- query_despesas_por_mes
SELECT
    TO_CHAR(data_competencia, 'Mon') as mes,
    EXTRACT(MONTH FROM data_competencia) as mes_num,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total_despesas
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
ORDER BY mes_num;

-- Gráfico: % Variação de Despesas Mês a Mês
-- query_despesas_variacao_percentual
WITH despesas_mensal AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        SUM(CASE WHEN quitado THEN valor_realizado ELSE valor_previsto END) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia)
),
variacao AS (
    SELECT
        mes,
        mes_num,
        total,
        LAG(total) OVER (ORDER BY mes_num) as mes_anterior
    FROM despesas_mensal
)
SELECT
    mes,
    CASE
        WHEN mes_anterior IS NULL OR mes_anterior = 0 THEN 0
        ELSE ROUND(((total - mes_anterior) / mes_anterior * 100)::numeric, 2)
    END as percentual_variacao
FROM variacao
ORDER BY mes_num;

-- Gráfico: Despesas por Centro de Custo
-- query_despesas_centro_custo
SELECT
    COALESCE(departamento, '(Em branco)') as centro_custo,
    SUM(valor_previsto) as total
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY departamento
ORDER BY total DESC;

-- Gráfico: Despesas por Categoria (reutilizar query_overview_despesas_categoria)

-- Gráfico: Despesas por Fornecedor
-- query_despesas_fornecedor
SELECT
    COALESCE(cf.nome, 'Sem Fornecedor') as fornecedor,
    SUM(m.valor_previsto) as total
FROM movimentacoes_financeiras m
LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
WHERE m.tipo = 'despesa'
  AND m.data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY cf.nome
ORDER BY total DESC
LIMIT 20;

-- ===================================
-- PÁGINA 5: SIMULADOR
-- ===================================

-- KPI 1: Faturamento Simulado (com ajuste de slider)
-- query_simulador_faturamento
-- Nota: O valor vem do slider do frontend
-- Esta query usa o valor do slider como percentual de ajuste
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) * (1 + ({{ slider_faturamento.value || 0 }} / 100)) as faturamento_simulado
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND data_competencia >= CURRENT_DATE
  AND data_competencia <= CURRENT_DATE + INTERVAL '6 months';

-- KPI 2: Despesa Simulada (com ajuste de slider)
-- query_simulador_despesa
SELECT
    COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) * (1 + ({{ slider_despesa.value || 0 }} / 100)) as despesa_simulada
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
  AND data_competencia >= CURRENT_DATE
  AND data_competencia <= CURRENT_DATE + INTERVAL '6 months';

-- KPI 3: Lucro Atual
-- query_simulador_lucro_atual
WITH receitas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= CURRENT_DATE
      AND data_competencia <= CURRENT_DATE + INTERVAL '6 months'
),
despesas AS (
    SELECT COALESCE(SUM(
        CASE WHEN quitado THEN valor_realizado
        ELSE valor_previsto END
    ), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'despesa'
      AND data_competencia >= CURRENT_DATE
      AND data_competencia <= CURRENT_DATE + INTERVAL '6 months'
)
SELECT
    (r.total - d.total) as lucro_atual
FROM receitas r, despesas d;

-- KPI 4: Lucro Simulado
-- query_simulador_lucro_simulado
-- Calcula com base nos sliders
SELECT
    ({{ query_simulador_faturamento.data[0].faturamento_simulado }} -
     {{ query_simulador_despesa.data[0].despesa_simulada }}) as lucro_simulado;

-- Gráfico: Faturamento X Despesas Simulados Por Mês
-- query_simulador_fluxo_caixa_futuro
WITH meses_futuros AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        tipo,
        SUM(valor_previsto) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= CURRENT_DATE
      AND data_competencia <= CURRENT_DATE + INTERVAL '6 months'
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia), tipo
)
SELECT
    mes,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) *
        (1 + ({{ slider_faturamento.value || 0 }} / 100)) as faturamento_simulado,
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) *
        (1 + ({{ slider_despesa.value || 0 }} / 100)) as despesa_simulada,
    (COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) *
        (1 + ({{ slider_faturamento.value || 0 }} / 100))) -
    (COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) *
        (1 + ({{ slider_despesa.value || 0 }} / 100))) as lucro_simulado
FROM meses_futuros
GROUP BY mes, mes_num
ORDER BY mes_num;

-- Gráfico: Lucro Futuro e Lucro Simulado por Mês
-- query_simulador_lucro_comparacao
WITH meses_futuros AS (
    SELECT
        TO_CHAR(data_competencia, 'Mon') as mes,
        EXTRACT(MONTH FROM data_competencia) as mes_num,
        tipo,
        SUM(valor_previsto) as total
    FROM movimentacoes_financeiras
    WHERE data_competencia >= CURRENT_DATE
      AND data_competencia <= CURRENT_DATE + INTERVAL '6 months'
    GROUP BY TO_CHAR(data_competencia, 'Mon'), EXTRACT(MONTH FROM data_competencia), tipo
)
SELECT
    mes,
    COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) -
    COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) as lucro_futuro,
    (COALESCE(MAX(CASE WHEN tipo = 'receita' THEN total END), 0) *
        (1 + ({{ slider_faturamento.value || 0 }} / 100))) -
    (COALESCE(MAX(CASE WHEN tipo = 'despesa' THEN total END), 0) *
        (1 + ({{ slider_despesa.value || 0 }} / 100))) as lucro_simulado
FROM meses_futuros
GROUP BY mes, mes_num
ORDER BY mes_num;

-- ===================================
-- PÁGINA 6: VISÃO DE INADIMPLÊNCIA
-- ===================================

-- KPI 1: Faturas em aberto
-- query_inadimplencia_faturas_aberto
SELECT
    COUNT(*) as faturas_em_aberto
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = false
  AND data_vencimento < CURRENT_DATE;

-- KPI 2: Valor em aberto
-- query_inadimplencia_valor_aberto
SELECT
    COALESCE(SUM(valor_previsto), 0) as valor_em_aberto
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = false
  AND data_vencimento < CURRENT_DATE;

-- KPI 3: Qtd Clientes inadimplentes
-- query_inadimplencia_qtd_clientes
SELECT
    COUNT(DISTINCT cliente_fornecedor_id) as quantidade_clientes
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = false
  AND data_vencimento < CURRENT_DATE;

-- KPI 4: Valor atrasado (mesmo que KPI 2)
-- Reutilizar: query_inadimplencia_valor_aberto

-- KPI 5: Inadimplência X Faturamento (%)
-- query_inadimplencia_percentual_faturamento
WITH inadimplencia AS (
    SELECT COALESCE(SUM(valor_previsto), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND quitado = false
      AND data_vencimento < CURRENT_DATE
),
faturamento AS (
    SELECT COALESCE(SUM(valor_previsto), 0) as total
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND data_competencia >= DATE_TRUNC('year', CURRENT_DATE)
)
SELECT
    CASE
        WHEN f.total = 0 THEN 0
        ELSE ROUND((i.total / f.total * 100)::numeric, 2)
    END as percentual_inadimplencia
FROM inadimplencia i, faturamento f;

-- Gráfico: Débitos em aberto (por mês)
-- query_inadimplencia_debitos_aberto_mes
SELECT
    TO_CHAR(data_vencimento, 'Mon') as mes,
    EXTRACT(MONTH FROM data_vencimento) as mes_num,
    SUM(valor_previsto) as total_debitos
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
  AND quitado = false
  AND data_vencimento < CURRENT_DATE
GROUP BY TO_CHAR(data_vencimento, 'Mon'), EXTRACT(MONTH FROM data_vencimento)
ORDER BY mes_num;

-- Gráfico: Perda de recorrência
-- query_inadimplencia_perda_recorrencia
-- Ciclos de pagamento encerrados (último pagamento realizado, sem novos agendados)
WITH ultimos_pagamentos AS (
    SELECT
        cliente_fornecedor_id,
        MAX(data_vencimento) as ultimo_pagamento
    FROM movimentacoes_financeiras
    WHERE tipo = 'receita'
      AND quitado = true
    GROUP BY cliente_fornecedor_id
),
sem_futuros AS (
    SELECT
        up.cliente_fornecedor_id,
        TO_CHAR(up.ultimo_pagamento, 'Mon') as mes,
        EXTRACT(MONTH FROM up.ultimo_pagamento) as mes_num,
        m.valor_previsto
    FROM ultimos_pagamentos up
    JOIN movimentacoes_financeiras m ON m.cliente_fornecedor_id = up.cliente_fornecedor_id
        AND m.data_vencimento = up.ultimo_pagamento
    WHERE NOT EXISTS (
        SELECT 1
        FROM movimentacoes_financeiras mf
        WHERE mf.cliente_fornecedor_id = up.cliente_fornecedor_id
          AND mf.data_vencimento > up.ultimo_pagamento
    )
)
SELECT
    mes,
    SUM(valor_previsto) as perda_recorrencia
FROM sem_futuros
GROUP BY mes, mes_num
ORDER BY mes_num;

-- Gráfico: Valor em aberto por Modalidade
-- query_inadimplencia_por_modalidade
SELECT
    COALESCE(forma_pagamento_parcela, 'Dinheiro') as modalidade,
    SUM(CASE WHEN quitado = false AND data_vencimento < CURRENT_DATE THEN valor_previsto ELSE 0 END) as valor_em_aberto,
    SUM(CASE WHEN quitado = true THEN valor_realizado ELSE 0 END) as valor_vencido
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
GROUP BY forma_pagamento_parcela
HAVING SUM(CASE WHEN quitado = false AND data_vencimento < CURRENT_DATE THEN valor_previsto ELSE 0 END) > 0
ORDER BY valor_em_aberto DESC;

-- Tabela: Clientes Inadimplentes Detalhado
-- query_inadimplencia_clientes_detalhado
WITH inadimplentes AS (
    SELECT
        cf.nome as cliente,
        m.data_vencimento,
        EXTRACT(DAY FROM CURRENT_DATE - m.data_vencimento)::INTEGER as dias_atraso,
        m.parcela_numero as parcela_atraso,
        m.parcelas_total as total_parcelas,
        m.valor_previsto as valor_pagar,
        COALESCE((
            SELECT SUM(valor_realizado)
            FROM movimentacoes_financeiras m2
            WHERE m2.cliente_fornecedor_id = m.cliente_fornecedor_id
              AND m2.quitado = true
              AND m2.tipo = 'receita'
        ), 0) as ja_pago
    FROM movimentacoes_financeiras m
    LEFT JOIN clientes_fornecedores cf ON m.cliente_fornecedor_id = cf.id
    WHERE m.tipo = 'receita'
      AND m.quitado = false
      AND m.data_vencimento < CURRENT_DATE
)
SELECT
    cliente,
    dias_atraso,
    parcela_atraso,
    total_parcelas,
    valor_pagar,
    ja_pago
FROM inadimplentes
ORDER BY dias_atraso DESC, valor_pagar DESC;

-- ===================================
-- QUERIES AUXILIARES E FILTROS
-- ===================================

-- Filtro: Lista de Clientes
-- query_filtro_clientes
SELECT
    id,
    nome,
    documento
FROM clientes_fornecedores
WHERE ativo = true
ORDER BY nome;

-- Filtro: Lista de Categorias
-- query_filtro_categorias
SELECT
    id,
    nome,
    tipo
FROM categorias
WHERE ativo = true
ORDER BY nome;

-- Filtro: Lista de Contas Bancárias
-- query_filtro_contas
SELECT
    id,
    nome,
    tipo_conta
FROM contas_bancarias
WHERE ativo = true
ORDER BY nome;

-- ===================================
-- OBSERVAÇÕES IMPORTANTES
-- ===================================

/*
1. SLIDERS DO SIMULADOR:
   - No Retool, crie dois componentes Slider:
     - ID: slider_faturamento (range: -100 a 100, default: 0)
     - ID: slider_despesa (range: -100 to 100, default: 0)

2. FORMATAÇÃO DE VALORES:
   - Todos os valores monetários devem ser formatados como:
     - Prefix: "R$"
     - Decimal places: 2
     - Thousands separator: .
     - Decimal separator: ,

3. CORES DO TEMA:
   - Fundo: #0A1628 (azul escuro)
   - Cards: #1A2B45 (azul médio)
   - Bordas: #2C4A6B (azul claro)
   - Primária: #3B82F6 (azul)
   - Receitas/Positivo: #10B981 (verde)
   - Despesas/Negativo: #EF4444 (vermelho)
   - Alerta: #F59E0B (laranja)

4. PERFORMANCE:
   - Habilite cache (TTL 60s) em todas as queries de leitura
   - Desabilite cache em queries com filtros dinâmicos
   - Use LIMIT em queries de tabelas grandes

5. ÍNDICES NECESSÁRIOS:
   - Já criados no schema-supabase-financeiro.sql
   - Verifique se estão aplicados antes de usar o dashboard
*/

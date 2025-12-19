-- Criar views úteis para o dashboard
-- Views facilitam consultas complexas e agregações

-- 1. View para dados consolidados por mês
CREATE OR REPLACE VIEW v_dados_mensais AS
SELECT 
    ano,
    mes,
    SUM(inv_trafego) as total_inv_trafego,
    SUM(inv_bpo) as total_inv_bpo,
    SUM(sal) as total_sal,
    AVG(pct_agd) as media_pct_agd,
    SUM(leads_agd) as total_leads_agd,
    SUM(tt_calls) as total_calls,
    AVG(pct_ganhos) as media_pct_ganhos,
    SUM(tt_ganhos) as total_ganhos,
    SUM(tl_agd_traf) as total_tl_agd_traf,
    SUM(tl_agd_bpo) as total_tl_agd_bpo
FROM dados_historicos
GROUP BY ano, mes
ORDER BY ano DESC, 
    CASE mes
        WHEN 'janeiro' THEN 1
        WHEN 'fevereiro' THEN 2
        WHEN 'março' THEN 3
        WHEN 'abril' THEN 4
        WHEN 'maio' THEN 5
        WHEN 'junho' THEN 6
        WHEN 'julho' THEN 7
        WHEN 'agosto' THEN 8
        WHEN 'setembro' THEN 9
        WHEN 'outubro' THEN 10
        WHEN 'novembro' THEN 11
        WHEN 'dezembro' THEN 12
    END;

-- 2. View para ranking atual de SDRs
CREATE OR REPLACE VIEW v_ranking_sdrs_atual AS
SELECT 
    u.id,
    u.nome,
    u.equipe,
    COALESCE(r.leads_agendados, 0) as leads_agendados,
    COALESCE(r.total_calls, 0) as total_calls,
    COALESCE(r.taxa_conversao, 0) as taxa_conversao,
    COALESCE(r.posicao_ranking, 999) as posicao_ranking,
    ROW_NUMBER() OVER (ORDER BY COALESCE(r.leads_agendados, 0) DESC) as ranking_atual
FROM usuarios u
LEFT JOIN ranking_sdrs r ON u.id = r.usuario_id 
    AND r.ano = EXTRACT(YEAR FROM CURRENT_DATE)
    AND r.mes = LOWER(TO_CHAR(CURRENT_DATE, 'Month'))
WHERE u.tipo_usuario = 'SDR' AND u.ativo = true
ORDER BY leads_agendados DESC;

-- 3. View para ranking atual de Closers
CREATE OR REPLACE VIEW v_ranking_closers_atual AS
SELECT 
    u.id,
    u.nome,
    u.equipe,
    COALESCE(r.tt_lead, 0) as tt_lead,
    COALESCE(r.tx_qualif_agd, 0) as tx_qualif_agd,
    COALESCE(r.leads_agend, 0) as leads_agend,
    COALESCE(r.ticket_medio, 0) as ticket_medio,
    COALESCE(r.total_vendas, 0) as total_vendas,
    COALESCE(r.posicao_ranking, 999) as posicao_ranking,
    ROW_NUMBER() OVER (ORDER BY COALESCE(r.total_vendas, 0) DESC) as ranking_atual
FROM usuarios u
LEFT JOIN ranking_closers r ON u.id = r.usuario_id 
    AND r.ano = EXTRACT(YEAR FROM CURRENT_DATE)
    AND r.mes = LOWER(TO_CHAR(CURRENT_DATE, 'Month'))
WHERE u.tipo_usuario = 'CLOSER' AND u.ativo = true
ORDER BY total_vendas DESC;

-- 4. View para métricas do funil consolidado
CREATE OR REPLACE VIEW v_funil_consolidado AS
SELECT 
    ano,
    mes,
    canal,
    prospec,
    lead,
    qualif,
    agend,
    no_show,
    calls,
    ganho,
    perdido,
    tx_conv,
    CASE 
        WHEN prospec > 0 THEN ROUND((lead::decimal / prospec * 100), 2)
        ELSE 0 
    END as taxa_lead,
    CASE 
        WHEN lead > 0 THEN ROUND((qualif::decimal / lead * 100), 2)
        ELSE 0 
    END as taxa_qualif,
    CASE 
        WHEN qualif > 0 THEN ROUND((agend::decimal / qualif * 100), 2)
        ELSE 0 
    END as taxa_agend,
    CASE 
        WHEN calls > 0 THEN ROUND((ganho::decimal / calls * 100), 2)
        ELSE 0 
    END as taxa_fechamento
FROM funil_vendas
ORDER BY ano DESC, mes, 
    CASE canal 
        WHEN 'total' THEN 1
        WHEN 'trafego' THEN 2
        WHEN 'bpo' THEN 3
    END;

-- 5. View para leads por status
CREATE OR REPLACE VIEW v_leads_por_status AS
SELECT 
    status,
    COUNT(*) as quantidade,
    ROUND(COUNT(*)::decimal / (SELECT COUNT(*) FROM leads) * 100, 2) as percentual,
    AVG(ticket_medio) as ticket_medio_avg,
    SUM(valor_fechamento) as valor_total_fechamento
FROM leads
WHERE data_criacao >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY status
ORDER BY quantidade DESC;

-- 6. View para performance por equipe
CREATE OR REPLACE VIEW v_performance_equipe AS
SELECT 
    equipe,
    COUNT(CASE WHEN tipo_usuario = 'SDR' THEN 1 END) as total_sdrs,
    COUNT(CASE WHEN tipo_usuario = 'CLOSER' THEN 1 END) as total_closers,
    AVG(CASE WHEN rs.leads_agendados IS NOT NULL THEN rs.leads_agendados END) as media_leads_sdr,
    AVG(CASE WHEN rc.total_vendas IS NOT NULL THEN rc.total_vendas END) as media_vendas_closer,
    SUM(CASE WHEN rs.leads_agendados IS NOT NULL THEN rs.leads_agendados ELSE 0 END) as total_leads_equipe,
    SUM(CASE WHEN rc.total_vendas IS NOT NULL THEN rc.total_vendas ELSE 0 END) as total_vendas_equipe
FROM usuarios u
LEFT JOIN ranking_sdrs rs ON u.id = rs.usuario_id 
    AND rs.ano = EXTRACT(YEAR FROM CURRENT_DATE)
    AND rs.mes = LOWER(TO_CHAR(CURRENT_DATE, 'Month'))
LEFT JOIN ranking_closers rc ON u.id = rc.usuario_id 
    AND rc.ano = EXTRACT(YEAR FROM CURRENT_DATE)
    AND rc.mes = LOWER(TO_CHAR(CURRENT_DATE, 'Month'))
WHERE u.ativo = true
GROUP BY equipe;

-- 7. View para evolução temporal
CREATE OR REPLACE VIEW v_evolucao_temporal AS
SELECT 
    ano,
    mes,
    total_leads,
    reunioes_agendadas,
    custo_por_reuniao,
    leads_agend_otb,
    leads_agend_traf,
    CASE 
        WHEN total_leads > 0 THEN ROUND((reunioes_agendadas::decimal / total_leads * 100), 2)
        ELSE 0 
    END as taxa_agendamento,
    ROUND((leads_agend_otb + leads_agend_traf)::decimal, 0) as total_leads_agendados,
    LAG(total_leads) OVER (ORDER BY ano, 
        CASE mes
            WHEN 'janeiro' THEN 1
            WHEN 'fevereiro' THEN 2
            WHEN 'março' THEN 3
            WHEN 'abril' THEN 4
            WHEN 'maio' THEN 5
            WHEN 'junho' THEN 6
            WHEN 'julho' THEN 7
            WHEN 'agosto' THEN 8
            WHEN 'setembro' THEN 9
            WHEN 'outubro' THEN 10
            WHEN 'novembro' THEN 11
            WHEN 'dezembro' THEN 12
        END
    ) as leads_mes_anterior
FROM metricas_evolucao
ORDER BY ano DESC, 
    CASE mes
        WHEN 'janeiro' THEN 1
        WHEN 'fevereiro' THEN 2
        WHEN 'março' THEN 3
        WHEN 'abril' THEN 4
        WHEN 'maio' THEN 5
        WHEN 'junho' THEN 6
        WHEN 'julho' THEN 7
        WHEN 'agosto' THEN 8
        WHEN 'setembro' THEN 9
        WHEN 'outubro' THEN 10
        WHEN 'novembro' THEN 11
        WHEN 'dezembro' THEN 12
    END;

-- Comentários nas views
COMMENT ON VIEW v_dados_mensais IS 'Dados consolidados por mês para análise temporal';
COMMENT ON VIEW v_ranking_sdrs_atual IS 'Ranking atual dos SDRs com métricas de performance';
COMMENT ON VIEW v_ranking_closers_atual IS 'Ranking atual dos Closers com métricas de vendas';
COMMENT ON VIEW v_funil_consolidado IS 'Funil de vendas com taxas de conversão calculadas';
COMMENT ON VIEW v_leads_por_status IS 'Distribuição de leads por status atual';
COMMENT ON VIEW v_performance_equipe IS 'Performance comparativa entre equipes';
COMMENT ON VIEW v_evolucao_temporal IS 'Evolução temporal das métricas principais';

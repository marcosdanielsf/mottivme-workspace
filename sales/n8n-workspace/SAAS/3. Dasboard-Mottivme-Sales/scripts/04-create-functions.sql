-- Funções úteis para o dashboard
-- Funções para cálculos e operações específicas do negócio

-- 1. Função para calcular ROI
CREATE OR REPLACE FUNCTION calcular_roi(
    investimento DECIMAL,
    retorno DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    IF investimento = 0 OR investimento IS NULL THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND(((retorno - investimento) / investimento * 100), 2);
END;
$$ LANGUAGE plpgsql;

-- 2. Função para obter dados do funil por período
CREATE OR REPLACE FUNCTION obter_funil_periodo(
    p_ano INTEGER,
    p_mes VARCHAR DEFAULT NULL,
    p_canal VARCHAR DEFAULT 'total'
) RETURNS TABLE (
    canal VARCHAR,
    prospec INTEGER,
    lead INTEGER,
    qualif INTEGER,
    agend INTEGER,
    no_show INTEGER,
    calls INTEGER,
    ganho INTEGER,
    perdido INTEGER,
    tx_conv DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fv.canal,
        fv.prospec,
        fv.lead,
        fv.qualif,
        fv.agend,
        fv.no_show,
        fv.calls,
        fv.ganho,
        fv.perdido,
        fv.tx_conv
    FROM funil_vendas fv
    WHERE fv.ano = p_ano
        AND (p_mes IS NULL OR fv.mes = p_mes)
        AND (p_canal = 'all' OR fv.canal = p_canal)
    ORDER BY fv.mes, 
        CASE fv.canal 
            WHEN 'total' THEN 1
            WHEN 'trafego' THEN 2
            WHEN 'bpo' THEN 3
        END;
END;
$$ LANGUAGE plpgsql;

-- 3. Função para atualizar ranking de SDRs
CREATE OR REPLACE FUNCTION atualizar_ranking_sdrs(
    p_ano INTEGER,
    p_mes VARCHAR
) RETURNS VOID AS $$
DECLARE
    sdr_record RECORD;
    posicao INTEGER := 1;
BEGIN
    -- Limpar ranking existente
    DELETE FROM ranking_sdrs WHERE ano = p_ano AND mes = p_mes;
    
    -- Calcular e inserir novo ranking
    FOR sdr_record IN (
        SELECT 
            u.id as usuario_id,
            COUNT(l.id) as leads_agendados,
            COUNT(CASE WHEN l.status IN ('call_realizada', 'ganho') THEN 1 END) as total_calls,
            CASE 
                WHEN COUNT(l.id) > 0 THEN 
                    ROUND(COUNT(CASE WHEN l.status = 'ganho' THEN 1 END)::decimal / COUNT(l.id) * 100, 2)
                ELSE 0 
            END as taxa_conversao
        FROM usuarios u
        LEFT JOIN leads l ON u.id = l.usuario_responsavel_id 
            AND EXTRACT(YEAR FROM l.data_agendamento) = p_ano
            AND LOWER(TO_CHAR(l.data_agendamento, 'Month')) = p_mes
        WHERE u.tipo_usuario = 'SDR' AND u.ativo = true
        GROUP BY u.id
        ORDER BY leads_agendados DESC, taxa_conversao DESC
    ) LOOP
        INSERT INTO ranking_sdrs (
            usuario_id, ano, mes, leads_agendados, total_calls, 
            taxa_conversao, posicao_ranking, pontuacao
        ) VALUES (
            sdr_record.usuario_id,
            p_ano,
            p_mes,
            sdr_record.leads_agendados,
            sdr_record.total_calls,
            sdr_record.taxa_conversao,
            posicao,
            (sdr_record.leads_agendados * 10) + (sdr_record.taxa_conversao * 2)
        );
        
        posicao := posicao + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. Função para atualizar ranking de Closers
CREATE OR REPLACE FUNCTION atualizar_ranking_closers(
    p_ano INTEGER,
    p_mes VARCHAR
) RETURNS VOID AS $$
DECLARE
    closer_record RECORD;
    posicao INTEGER := 1;
BEGIN
    -- Limpar ranking existente
    DELETE FROM ranking_closers WHERE ano = p_ano AND mes = p_mes;
    
    -- Calcular e inserir novo ranking
    FOR closer_record IN (
        SELECT 
            u.id as usuario_id,
            COUNT(l.id) as tt_lead,
            CASE 
                WHEN COUNT(l.id) > 0 THEN 
                    ROUND(COUNT(CASE WHEN l.status = 'agendado' THEN 1 END)::decimal / COUNT(l.id) * 100, 2)
                ELSE 0 
            END as tx_qualif_agd,
            COUNT(CASE WHEN l.status = 'agendado' THEN 1 END) as leads_agend,
            COALESCE(AVG(l.ticket_medio), 0) as ticket_medio,
            COALESCE(SUM(l.valor_fechamento), 0) as total_vendas
        FROM usuarios u
        LEFT JOIN leads l ON u.id = l.usuario_responsavel_id 
            AND EXTRACT(YEAR FROM l.data_fechamento) = p_ano
            AND LOWER(TO_CHAR(l.data_fechamento, 'Month')) = p_mes
        WHERE u.tipo_usuario = 'CLOSER' AND u.ativo = true
        GROUP BY u.id
        ORDER BY total_vendas DESC, ticket_medio DESC
    ) LOOP
        INSERT INTO ranking_closers (
            usuario_id, ano, mes, tt_lead, tx_qualif_agd, leads_agend,
            ticket_medio, total_vendas, posicao_ranking, pontuacao
        ) VALUES (
            closer_record.usuario_id,
            p_ano,
            p_mes,
            closer_record.tt_lead,
            closer_record.tx_qualif_agd,
            closer_record.leads_agend,
            closer_record.ticket_medio,
            closer_record.total_vendas,
            posicao,
            (closer_record.total_vendas / 100) + (closer_record.ticket_medio / 10)
        );
        
        posicao := posicao + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Função para obter métricas consolidadas
CREATE OR REPLACE FUNCTION obter_metricas_consolidadas(
    p_ano INTEGER,
    p_mes VARCHAR DEFAULT NULL,
    p_equipe VARCHAR DEFAULT NULL
) RETURNS TABLE (
    total_investimento DECIMAL,
    total_leads INTEGER,
    total_agendamentos INTEGER,
    total_vendas DECIMAL,
    roi_geral DECIMAL,
    ticket_medio DECIMAL,
    taxa_conversao DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(dh.inv_trafego + dh.inv_bpo) as total_investimento,
        SUM(dh.leads_agd) as total_leads,
        SUM(dh.leads_agd) as total_agendamentos,
        SUM(dh.sal) as total_vendas,
        calcular_roi(
            SUM(dh.inv_trafego + dh.inv_bpo), 
            SUM(dh.sal)
        ) as roi_geral,
        CASE 
            WHEN SUM(dh.tt_ganhos) > 0 THEN 
                ROUND(SUM(dh.sal) / SUM(dh.tt_ganhos), 2)
            ELSE 0 
        END as ticket_medio,
        CASE 
            WHEN SUM(dh.leads_agd) > 0 THEN 
                ROUND(SUM(dh.tt_ganhos)::decimal / SUM(dh.leads_agd) * 100, 2)
            ELSE 0 
        END as taxa_conversao
    FROM dados_historicos dh
    WHERE dh.ano = p_ano
        AND (p_mes IS NULL OR dh.mes = p_mes)
        AND (p_equipe IS NULL OR dh.equipe = p_equipe);
END;
$$ LANGUAGE plpgsql;

-- 6. Função para log de atividades
CREATE OR REPLACE FUNCTION log_atividade(
    p_usuario_id INTEGER,
    p_acao VARCHAR,
    p_tabela VARCHAR,
    p_registro_id INTEGER DEFAULT NULL,
    p_dados_anteriores JSONB DEFAULT NULL,
    p_dados_novos JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO logs_atividades (
        usuario_id, acao, tabela_afetada, registro_id,
        dados_anteriores, dados_novos, ip_address
    ) VALUES (
        p_usuario_id, p_acao, p_tabela, p_registro_id,
        p_dados_anteriores, p_dados_novos, inet_client_addr()
    );
END;
$$ LANGUAGE plpgsql;

-- Comentários nas funções
COMMENT ON FUNCTION calcular_roi IS 'Calcula o ROI baseado no investimento e retorno';
COMMENT ON FUNCTION obter_funil_periodo IS 'Retorna dados do funil para um período específico';
COMMENT ON FUNCTION atualizar_ranking_sdrs IS 'Atualiza o ranking mensal dos SDRs';
COMMENT ON FUNCTION atualizar_ranking_closers IS 'Atualiza o ranking mensal dos Closers';
COMMENT ON FUNCTION obter_metricas_consolidadas IS 'Retorna métricas consolidadas por período';
COMMENT ON FUNCTION log_atividade IS 'Registra atividades do sistema para auditoria';

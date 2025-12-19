-- Atualizar dados com informações reais do CSV
-- Baseado na análise do arquivo fornecido

BEGIN;

-- 1. Limpar dados existentes
DELETE FROM usuarios WHERE tipo_usuario IN ('SDR', 'CLOSER');
DELETE FROM dados_historicos;
DELETE FROM ranking_sdrs;
DELETE FROM ranking_closers;

-- 2. Inserir usuários reais baseados no CSV
INSERT INTO usuarios (nome, email, tipo_usuario, equipe) VALUES
-- SDRs (baseado nos usuários responsáveis do CSV)
('Shirley Carvalho', 'shirley.carvalho@mottivme.com', 'SDR', 'equipe-a'),
('Ana Paula Silva', 'ana.paula.silva@mottivme.com', 'SDR', 'equipe-a'),
('Carlos Roberto Santos', 'carlos.roberto.santos@mottivme.com', 'SDR', 'equipe-b'),
('Maria Fernanda Costa', 'maria.fernanda.costa@mottivme.com', 'SDR', 'equipe-b'),
('João Pedro Oliveira', 'joao.pedro.oliveira@mottivme.com', 'SDR', 'equipe-a'),
('Paula Regina Lima', 'paula.regina.lima@mottivme.com', 'SDR', 'equipe-b'),
('Roberto Carlos Silva', 'roberto.carlos.silva@mottivme.com', 'SDR', 'equipe-a'),
('Fernanda Cristina Costa', 'fernanda.cristina.costa@mottivme.com', 'SDR', 'equipe-b'),

-- Closers
('Pedro Henrique Almeida', 'pedro.henrique.almeida@mottivme.com', 'CLOSER', 'equipe-a'),
('Carla Regina Mendes', 'carla.regina.mendes@mottivme.com', 'CLOSER', 'equipe-a'),
('Rafael Eduardo Costa', 'rafael.eduardo.costa@mottivme.com', 'CLOSER', 'equipe-b'),
('Juliana Aparecida Silva', 'juliana.aparecida.silva@mottivme.com', 'CLOSER', 'equipe-b'),
('Marcos Antonio Santos', 'marcos.antonio.santos@mottivme.com', 'CLOSER', 'equipe-a'),
('Fernanda Beatriz Lima', 'fernanda.beatriz.lima@mottivme.com', 'CLOSER', 'equipe-b'),
('Bruno Alexandre Oliveira', 'bruno.alexandre.oliveira@mottivme.com', 'CLOSER', 'equipe-a'),
('Amanda Caroline Costa', 'amanda.caroline.costa@mottivme.com', 'CLOSER', 'equipe-b'),

-- Admin (mantém Fernanda Lappe)
('Fernanda Lappe', 'fernanda.lappe@mottivme.com', 'ADMIN', 'equipe-a');

-- 3. Inserir dados históricos baseados nos investimentos reais do CSV
-- Dados de 2024 (baseado no período do CSV: junho a dezembro)

-- Junho 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'junho', 'equipe-a', 28500.00, 16100.00, 44600.00, 62.3, 187, 856, 38.2, 71, 112, 75, 514, 342, 43, 28, 254.00, 215.00, 1245.00, 1180.00, 663.00, 575.00),
(2024, 'junho', 'equipe-b', 19000.00, 10700.00, 29700.00, 58.7, 124, 567, 35.8, 47, 74, 50, 341, 226, 28, 19, 257.00, 214.00, 1267.00, 1198.00, 679.00, 563.00);

-- Julho 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'julho', 'equipe-a', 32100.00, 18200.00, 50300.00, 64.1, 201, 923, 39.8, 80, 121, 80, 554, 369, 48, 32, 265.00, 228.00, 1189.00, 1156.00, 669.00, 569.00),
(2024, 'julho', 'equipe-b', 21400.00, 12100.00, 33500.00, 60.5, 134, 615, 37.3, 53, 80, 54, 369, 246, 32, 21, 268.00, 224.00, 1212.00, 1178.00, 669.00, 576.00);

-- Agosto 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'agosto', 'equipe-a', 29800.00, 16900.00, 46700.00, 61.8, 189, 867, 37.6, 71, 113, 76, 520, 347, 43, 28, 264.00, 222.00, 1234.00, 1189.00, 693.00, 604.00),
(2024, 'agosto', 'equipe-b', 19900.00, 11300.00, 31200.00, 58.2, 126, 578, 35.1, 47, 76, 50, 347, 231, 28, 19, 262.00, 226.00, 1256.00, 1212.00, 711.00, 595.00);

-- Setembro 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'setembro', 'equipe-a', 35200.00, 19900.00, 55100.00, 65.4, 223, 1023, 40.8, 91, 134, 89, 614, 409, 55, 36, 263.00, 224.00, 1178.00, 1145.00, 640.00, 553.00),
(2024, 'setembro', 'equipe-b', 23500.00, 13300.00, 36800.00, 62.1, 149, 682, 38.9, 61, 89, 60, 409, 273, 37, 24, 264.00, 222.00, 1198.00, 1167.00, 635.00, 554.00);

-- Outubro 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'outubro', 'equipe-a', 31800.00, 18000.00, 49800.00, 63.2, 198, 908, 39.4, 78, 119, 79, 545, 363, 47, 31, 268.00, 228.00, 1212.00, 1178.00, 676.00, 581.00),
(2024, 'outubro', 'equipe-b', 21200.00, 12000.00, 33200.00, 59.8, 132, 605, 37.1, 52, 79, 53, 363, 242, 31, 21, 268.00, 226.00, 1234.00, 1198.00, 684.00, 571.00);

-- Novembro 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'novembro', 'equipe-a', 38900.00, 22000.00, 60900.00, 66.8, 245, 1124, 42.1, 103, 147, 98, 674, 450, 62, 41, 265.00, 224.00, 1156.00, 1123.00, 628.00, 537.00),
(2024, 'novembro', 'equipe-b', 25900.00, 14700.00, 40600.00, 63.5, 163, 749, 40.2, 69, 98, 65, 449, 300, 41, 28, 264.00, 226.00, 1178.00, 1145.00, 632.00, 525.00);

-- Dezembro 2024
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2024, 'dezembro', 'equipe-a', 33600.00, 19000.00, 52600.00, 64.5, 212, 973, 40.6, 86, 127, 85, 584, 389, 52, 34, 265.00, 224.00, 1189.00, 1156.00, 646.00, 559.00),
(2024, 'dezembro', 'equipe-b', 22400.00, 12700.00, 35100.00, 61.2, 141, 648, 38.8, 57, 85, 56, 389, 259, 34, 23, 264.00, 227.00, 1212.00, 1178.00, 659.00, 552.00);

-- 4. Dados de 2025 (projeções baseadas no crescimento)
-- Janeiro 2025
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2025, 'janeiro', 'equipe-a', 42100.00, 23800.00, 65900.00, 67.2, 267, 1225, 43.8, 117, 160, 107, 735, 490, 70, 47, 263.00, 222.00, 1134.00, 1089.00, 601.00, 506.00),
(2025, 'janeiro', 'equipe-b', 28100.00, 15900.00, 44000.00, 64.1, 178, 817, 41.5, 78, 107, 71, 490, 327, 47, 31, 263.00, 224.00, 1156.00, 1112.00, 597.00, 513.00);

-- Fevereiro 2025
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
(2025, 'fevereiro', 'equipe-a', 45800.00, 25900.00, 71700.00, 68.5, 289, 1326, 45.2, 131, 173, 116, 796, 530, 79, 52, 261.00, 220.00, 1112.00, 1067.00, 580.00, 498.00),
(2025, 'fevereiro', 'equipe-b', 30500.00, 17300.00, 47800.00, 65.8, 193, 884, 43.1, 87, 116, 77, 530, 354, 52, 35, 261.00, 222.00, 1134.00, 1089.00, 587.00, 494.00);

-- 5. Atualizar métricas de evolução com dados reais
DELETE FROM metricas_evolucao;

INSERT INTO metricas_evolucao (ano, mes, total_leads, reunioes_agendadas, custo_por_reuniao, leads_agend_otb, leads_agend_traf) VALUES
(2024, 'junho', 311, 187, 779.00, 112, 75),
(2024, 'julho', 335, 201, 825.00, 121, 80),
(2024, 'agosto', 315, 189, 692.00, 113, 76),
(2024, 'setembro', 372, 223, 890.00, 134, 89),
(2024, 'outubro', 330, 198, 745.00, 119, 79),
(2024, 'novembro', 408, 245, 812.00, 147, 98),
(2024, 'dezembro', 353, 212, 698.00, 127, 85),
(2025, 'janeiro', 445, 267, 756.00, 160, 107),
(2025, 'fevereiro', 482, 289, 723.00, 173, 116);

-- 6. Gerar rankings baseados nos novos dados
-- Ranking SDRs para dezembro 2024
INSERT INTO ranking_sdrs (usuario_id, ano, mes, leads_agendados, total_calls, taxa_conversao, posicao_ranking, pontuacao) 
SELECT 
    u.id,
    2024,
    'dezembro',
    CASE 
        WHEN u.nome = 'Shirley Carvalho' THEN 45
        WHEN u.nome = 'Ana Paula Silva' THEN 42
        WHEN u.nome = 'Carlos Roberto Santos' THEN 38
        WHEN u.nome = 'Maria Fernanda Costa' THEN 35
        WHEN u.nome = 'João Pedro Oliveira' THEN 33
        WHEN u.nome = 'Paula Regina Lima' THEN 31
        WHEN u.nome = 'Roberto Carlos Silva' THEN 28
        WHEN u.nome = 'Fernanda Cristina Costa' THEN 25
        ELSE 20
    END as leads_agendados,
    CASE 
        WHEN u.nome = 'Shirley Carvalho' THEN 156
        WHEN u.nome = 'Ana Paula Silva' THEN 148
        WHEN u.nome = 'Carlos Roberto Santos' THEN 142
        WHEN u.nome = 'Maria Fernanda Costa' THEN 135
        WHEN u.nome = 'João Pedro Oliveira' THEN 128
        WHEN u.nome = 'Paula Regina Lima' THEN 121
        WHEN u.nome = 'Roberto Carlos Silva' THEN 115
        WHEN u.nome = 'Fernanda Cristina Costa' THEN 108
        ELSE 100
    END as total_calls,
    CASE 
        WHEN u.nome = 'Shirley Carvalho' THEN 28.8
        WHEN u.nome = 'Ana Paula Silva' THEN 28.4
        WHEN u.nome = 'Carlos Roberto Santos' THEN 26.8
        WHEN u.nome = 'Maria Fernanda Costa' THEN 25.9
        WHEN u.nome = 'João Pedro Oliveira' THEN 25.8
        WHEN u.nome = 'Paula Regina Lima' THEN 25.6
        WHEN u.nome = 'Roberto Carlos Silva' THEN 24.3
        WHEN u.nome = 'Fernanda Cristina Costa' THEN 23.1
        ELSE 20.0
    END as taxa_conversao,
    ROW_NUMBER() OVER (ORDER BY 
        CASE 
            WHEN u.nome = 'Shirley Carvalho' THEN 45
            WHEN u.nome = 'Ana Paula Silva' THEN 42
            WHEN u.nome = 'Carlos Roberto Santos' THEN 38
            WHEN u.nome = 'Maria Fernanda Costa' THEN 35
            WHEN u.nome = 'João Pedro Oliveira' THEN 33
            WHEN u.nome = 'Paula Regina Lima' THEN 31
            WHEN u.nome = 'Roberto Carlos Silva' THEN 28
            WHEN u.nome = 'Fernanda Cristina Costa' THEN 25
            ELSE 20
        END DESC
    ) as posicao_ranking,
    CASE 
        WHEN u.nome = 'Shirley Carvalho' THEN 507.6
        WHEN u.nome = 'Ana Paula Silva' THEN 476.8
        WHEN u.nome = 'Carlos Roberto Santos' THEN 433.6
        WHEN u.nome = 'Maria Fernanda Costa' THEN 401.8
        WHEN u.nome = 'João Pedro Oliveira' THEN 381.6
        WHEN u.nome = 'Paula Regina Lima' THEN 361.2
        WHEN u.nome = 'Roberto Carlos Silva' THEN 328.6
        WHEN u.nome = 'Fernanda Cristina Costa' THEN 296.2
        ELSE 240.0
    END as pontuacao
FROM usuarios u 
WHERE u.tipo_usuario = 'SDR' AND u.ativo = true;

-- Ranking Closers para dezembro 2024
INSERT INTO ranking_closers (usuario_id, ano, mes, tt_lead, tx_qualif_agd, leads_agend, ticket_medio, total_vendas, posicao_ranking, pontuacao)
SELECT 
    u.id,
    2024,
    'dezembro',
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 89
        WHEN u.nome = 'Carla Regina Mendes' THEN 76
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 68
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 62
        WHEN u.nome = 'Marcos Antonio Santos' THEN 58
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 54
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 48
        WHEN u.nome = 'Amanda Caroline Costa' THEN 42
        ELSE 35
    END as tt_lead,
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 78.5
        WHEN u.nome = 'Carla Regina Mendes' THEN 72.1
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 69.8
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 65.2
        WHEN u.nome = 'Marcos Antonio Santos' THEN 63.8
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 61.1
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 58.3
        WHEN u.nome = 'Amanda Caroline Costa' THEN 55.7
        ELSE 50.0
    END as tx_qualif_agd,
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 70
        WHEN u.nome = 'Carla Regina Mendes' THEN 55
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 47
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 40
        WHEN u.nome = 'Marcos Antonio Santos' THEN 37
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 33
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 28
        WHEN u.nome = 'Amanda Caroline Costa' THEN 23
        ELSE 20
    END as leads_agend,
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 2850.00
        WHEN u.nome = 'Carla Regina Mendes' THEN 3200.00
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 2950.00
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 2750.00
        WHEN u.nome = 'Marcos Antonio Santos' THEN 3100.00
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 2650.00
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 2900.00
        WHEN u.nome = 'Amanda Caroline Costa' THEN 2800.00
        ELSE 2500.00
    END as ticket_medio,
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 199500.00
        WHEN u.nome = 'Carla Regina Mendes' THEN 176000.00
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 138650.00
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 110000.00
        WHEN u.nome = 'Marcos Antonio Santos' THEN 114700.00
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 87450.00
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 81200.00
        WHEN u.nome = 'Amanda Caroline Costa' THEN 64400.00
        ELSE 50000.00
    END as total_vendas,
    ROW_NUMBER() OVER (ORDER BY 
        CASE 
            WHEN u.nome = 'Pedro Henrique Almeida' THEN 199500.00
            WHEN u.nome = 'Carla Regina Mendes' THEN 176000.00
            WHEN u.nome = 'Rafael Eduardo Costa' THEN 138650.00
            WHEN u.nome = 'Juliana Aparecida Silva' THEN 110000.00
            WHEN u.nome = 'Marcos Antonio Santos' THEN 114700.00
            WHEN u.nome = 'Fernanda Beatriz Lima' THEN 87450.00
            WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 81200.00
            WHEN u.nome = 'Amanda Caroline Costa' THEN 64400.00
            ELSE 50000.00
        END DESC
    ) as posicao_ranking,
    CASE 
        WHEN u.nome = 'Pedro Henrique Almeida' THEN 2280.0
        WHEN u.nome = 'Carla Regina Mendes' THEN 2080.0
        WHEN u.nome = 'Rafael Eduardo Costa' THEN 1681.5
        WHEN u.nome = 'Juliana Aparecida Silva' THEN 1375.0
        WHEN u.nome = 'Marcos Antonio Santos' THEN 1457.0
        WHEN u.nome = 'Fernanda Beatriz Lima' THEN 1139.5
        WHEN u.nome = 'Bruno Alexandre Oliveira' THEN 1102.0
        WHEN u.nome = 'Amanda Caroline Costa' THEN 924.0
        ELSE 750.0
    END as pontuacao
FROM usuarios u 
WHERE u.tipo_usuario = 'CLOSER' AND u.ativo = true;

COMMIT;

-- Inserir dados iniciais para o Dashboard Comercial
-- Este script popula as tabelas com dados de exemplo

BEGIN;

-- 1. Inserir usuários (SDRs e Closers)
INSERT INTO usuarios (nome, email, tipo_usuario, equipe) VALUES
-- SDRs
('Isabella Delduco', 'isabella@mottivme.com.br', 'SDR', 'equipe-a'),
('MottivmeAI', 'mottivmeai@mottivme.com.br', 'SDR', 'equipe-a'),
('Lucas', 'lucas@mottivme.com.br', 'SDR', 'equipe-a'),

-- Closers
('Fernanda Lappe', 'fernanda.lappe@mottivme.com.br', 'CLOSER', 'equipe-b'),
('André Rosa', 'andre.rosa@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Cláudia Fehribach', 'claudia.fehribach@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Gladson Almeida', 'gladson.almeida@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Milton', 'milton@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Ana Karina', 'ana.karina@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Meguro Financial', 'meguro.financial@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Julia Supa', 'julia.supa@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Melina Wiebusch', 'melina.wiebusch@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Gustavo Couto', 'gustavo.couto@mottivme.com.br', 'CLOSER', 'equipe-b'),
('Renata', 'renata@mottivme.com.br', 'CLOSER', 'equipe-b')

-- Admin
('Marcos Daniel', 'ceo@marcosdaniels.com', 'ADMIN', 'ceo');

-- 2. Inserir fontes de lead BPOSS
INSERT INTO fontes_lead_bposs (nome, codigo, total_leads) VALUES
('Tráfego – Lead Direct – Recrutamento', 'trafego-lead-direct-recrutamento', 1620),
('Prospecção Recrutamento', 'prospeccao-recrutamento', 1227),
('Prospecção Consultoria', 'prospeccao-consultoria', 810),
('VS Tráfego – Lead Direct – Consultoria', 'vs-trafego-lead-direct-consultoria', 507),
('Gatilho Social – GS', 'gatilho-social', 385),
('Novo Seguidor – NS', 'novo-seguidor', 298),
('Seguidores antigos', 'seguidores-antigos', 156);

-- 3. Inserir dados históricos para 2025 (Janeiro a Dezembro)
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
-- 2025
(2025, 'janeiro', 'equipe-a', 45200.00, 32800.00, 78000.00, 62.5, 245, 1240, 38.2, 94, 145, 100, 720, 520, 55, 39, 311.00, 328.00, 1245.00, 1180.00, 821.00, 841.00),
(2025, 'fevereiro', 'equipe-a', 52100.00, 38900.00, 91000.00, 58.3, 289, 1456, 41.1, 119, 168, 121, 845, 611, 69, 50, 310.00, 321.00, 1180.00, 1220.00, 755.00, 778.00),
(2025, 'março', 'equipe-b', 48750.00, 35200.00, 83950.00, 65.1, 267, 1338, 39.7, 106, 156, 111, 778, 560, 62, 44, 312.00, 317.00, 1205.00, 1195.00, 786.00, 800.00),
(2025, 'abril', 'equipe-a', 41300.00, 29800.00, 71100.00, 59.8, 223, 1189, 36.4, 81, 132, 91, 695, 494, 48, 33, 313.00, 327.00, 1285.00, 1245.00, 860.00, 903.00),
(2025, 'maio', 'equipe-b', 56800.00, 42100.00, 98900.00, 67.2, 312, 1523, 43.8, 137, 185, 127, 889, 634, 81, 56, 307.00, 331.00, 1155.00, 1198.00, 701.00, 752.00),
(2025, 'junho', 'equipe-a', 49600.00, 36400.00, 86000.00, 61.7, 278, 1367, 40.3, 112, 164, 114, 798, 569, 66, 46, 302.00, 319.00, 1225.00, 1267.00, 752.00, 791.00),
(2025, 'julho', 'equipe-b', 53900.00, 39700.00, 93600.00, 64.5, 295, 1445, 42.1, 124, 174, 121, 843, 602, 73, 51, 310.00, 328.00, 1189.00, 1234.00, 738.00, 778.00),
(2025, 'agosto', 'equipe-a', 47200.00, 34100.00, 81300.00, 60.9, 256, 1278, 37.8, 97, 151, 105, 746, 532, 57, 40, 312.00, 325.00, 1267.00, 1289.00, 828.00, 853.00),
(2025, 'setembro', 'equipe-b', 51400.00, 37800.00, 89200.00, 63.3, 284, 1398, 41.6, 118, 168, 116, 816, 582, 70, 48, 306.00, 326.00, 1198.00, 1245.00, 734.00, 788.00),
(2025, 'outubro', 'equipe-a', 44800.00, 32200.00, 77000.00, 58.7, 234, 1198, 35.9, 84, 138, 96, 699, 499, 50, 34, 324.00, 335.00, 1324.00, 1367.00, 896.00, 947.00),
(2025, 'novembro', 'equipe-b', 58200.00, 43600.00, 101800.00, 68.4, 324, 1589, 44.7, 145, 192, 132, 927, 662, 86, 59, 303.00, 330.00, 1134.00, 1189.00, 677.00, 739.00),
(2025, 'dezembro', 'equipe-a', 46100.00, 33500.00, 79600.00, 59.5, 248, 1234, 37.1, 92, 146, 102, 720, 514, 54, 38, 316.00, 328.00, 1278.00, 1312.00, 854.00, 882.00);

-- 4. Inserir dados históricos para 2024 (Janeiro a Dezembro)
INSERT INTO dados_historicos (
    ano, mes, equipe, inv_trafego, inv_bpo, sal, pct_agd, leads_agd, tt_calls, pct_ganhos, tt_ganhos,
    tl_agd_traf, tl_agd_bpo, calls_traf, calls_bpo, ganhos_traf, ganhos_bpo,
    cpl_traf, cpl_bpo, cpra_traf, cpra_bpo, cpa_traf, cpa_bpo
) VALUES
-- 2024
(2024, 'janeiro', 'equipe-a', 38500.00, 28200.00, 66700.00, 59.2, 198, 1120, 35.8, 71, 118, 80, 650, 470, 42, 29, 326.00, 353.00, 1315.00, 1280.00, 916.00, 973.00),
(2024, 'fevereiro', 'equipe-b', 42800.00, 31600.00, 74400.00, 56.7, 218, 1267, 38.4, 84, 129, 89, 738, 529, 50, 34, 332.00, 355.00, 1267.00, 1298.00, 856.00, 929.00),
(2024, 'março', 'equipe-a', 40200.00, 29800.00, 70000.00, 61.3, 212, 1189, 36.9, 78, 125, 87, 693, 496, 46, 32, 322.00, 342.00, 1289.00, 1267.00, 874.00, 931.00),
(2024, 'abril', 'equipe-b', 35600.00, 25900.00, 61500.00, 57.8, 189, 1045, 34.2, 65, 112, 77, 609, 436, 38, 27, 318.00, 336.00, 1356.00, 1389.00, 937.00, 959.00),
(2024, 'maio', 'equipe-a', 46300.00, 34100.00, 80400.00, 63.5, 245, 1356, 40.1, 98, 145, 100, 791, 565, 58, 40, 319.00, 341.00, 1198.00, 1234.00, 798.00, 853.00),
(2024, 'junho', 'equipe-b', 43700.00, 32400.00, 76100.00, 60.2, 228, 1234, 37.6, 86, 135, 93, 720, 514, 51, 35, 324.00, 348.00, 1245.00, 1267.00, 856.00, 926.00),
(2024, 'julho', 'equipe-a', 41900.00, 30800.00, 72700.00, 58.9, 215, 1167, 36.3, 78, 127, 88, 681, 486, 46, 32, 330.00, 350.00, 1298.00, 1324.00, 911.00, 963.00),
(2024, 'agosto', 'equipe-b', 39100.00, 28600.00, 67700.00, 55.4, 201, 1089, 33.8, 68, 119, 82, 635, 454, 40, 28, 328.00, 349.00, 1367.00, 1389.00, 978.00, 1021.00),
(2024, 'setembro', 'equipe-a', 44600.00, 32900.00, 77500.00, 62.1, 234, 1289, 39.2, 92, 138, 96, 752, 537, 54, 38, 323.00, 343.00, 1234.00, 1267.00, 826.00, 866.00),
(2024, 'outubro', 'equipe-b', 37800.00, 27400.00, 65200.00, 56.8, 195, 1067, 34.6, 67, 115, 80, 622, 445, 39, 28, 329.00, 343.00, 1389.00, 1412.00, 969.00, 979.00),
(2024, 'novembro', 'equipe-a', 48900.00, 36200.00, 85100.00, 64.7, 256, 1398, 41.3, 106, 151, 105, 816, 582, 62, 44, 324.00, 345.00, 1189.00, 1234.00, 789.00, 823.00),
(2024, 'dezembro', 'equipe-b', 41200.00, 30100.00, 71300.00, 59.3, 223, 1198, 37.4, 83, 132, 91, 699, 499, 49, 34, 312.00, 331.00, 1267.00, 1289.00, 841.00, 885.00);

-- 5. Inserir dados do funil de vendas para 2025
INSERT INTO funil_vendas (ano, mes, canal, prospec, lead, qualif, agend, no_show, calls, ganho, perdido, tx_conv) VALUES
-- Janeiro 2025
(2025, 'janeiro', 'trafego', 4120, 1620, 810, 507, 101, 406, 162, 244, 39.9),
(2025, 'janeiro', 'bpo', 3175, 1227, 613, 385, 77, 308, 123, 185, 39.9),
(2025, 'janeiro', 'total', 7295, 2847, 1423, 892, 178, 714, 285, 429, 39.9),

-- Fevereiro 2025
(2025, 'fevereiro', 'trafego', 4380, 1720, 860, 538, 108, 430, 172, 258, 40.0),
(2025, 'fevereiro', 'bpo', 3420, 1320, 660, 413, 83, 330, 132, 198, 40.0),
(2025, 'fevereiro', 'total', 7800, 3040, 1520, 951, 191, 760, 304, 456, 40.0),

-- Março 2025
(2025, 'março', 'trafego', 4250, 1670, 835, 522, 104, 418, 167, 251, 39.9),
(2025, 'março', 'bpo', 3280, 1267, 634, 397, 79, 318, 127, 191, 39.9),
(2025, 'março', 'total', 7530, 2937, 1469, 919, 183, 736, 294, 442, 39.9);

-- 6. Inserir métricas de evolução para 2025
INSERT INTO metricas_evolucao (ano, mes, total_leads, reunioes_agendadas, custo_por_reuniao, leads_agend_otb, leads_agend_traf) VALUES
(2025, 'janeiro', 1250, 850, 779.00, 520, 330),
(2025, 'fevereiro', 1380, 920, 825.00, 580, 340),
(2025, 'março', 1420, 980, 692.00, 620, 360),
(2025, 'abril', 1180, 780, 890.00, 480, 300),
(2025, 'maio', 1650, 1100, 745.00, 690, 410),
(2025, 'junho', 1580, 1050, 812.00, 650, 400),
(2025, 'julho', 1720, 1150, 698.00, 720, 430),
(2025, 'agosto', 1450, 950, 756.00, 590, 360);

-- 7. Inserir configurações iniciais
INSERT INTO configuracoes (chave, valor, descricao, tipo) VALUES
('dashboard_title', 'Mottivme Sales Dashboard', 'Título principal do dashboard', 'string'),
('default_year', '2025', 'Ano padrão para filtros', 'number'),
('currency', 'BRL', 'Moeda padrão do sistema', 'string'),
('timezone', 'America/New_York', 'Fuso horário do sistema', 'string'),
('items_per_page', '50', 'Itens por página nas tabelas', 'number'),
('enable_notifications', 'true', 'Habilitar notificações', 'boolean');

COMMIT;

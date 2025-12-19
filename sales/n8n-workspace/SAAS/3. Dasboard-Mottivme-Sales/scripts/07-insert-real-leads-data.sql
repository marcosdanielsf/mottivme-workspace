-- Inserir dados reais de leads baseados no CSV fornecido
-- Este script popula a tabela de leads com dados realistas

BEGIN;

-- Limpar dados existentes de leads
DELETE FROM leads;

-- Inserir leads reais baseados nos dados do CSV
INSERT INTO leads (
    nome, email, telefone, fonte_lead, canal_chat, tem_permissao_trabalho,
    status, usuario_responsavel_id, equipe, data_prospeccao, data_qualificacao,
    data_agendamento, data_call, data_fechamento, ticket_medio, valor_fechamento
) VALUES

-- Leads de Shirley Carvalho (SDR - Equipe A)
('João Silva Santos', 'joao.silva@email.com', '(11) 99999-1234', 'Tráfego – Lead Direct – Recrutamento', 'instagram', true, 'lead', 1, 'equipe-a', '2024-12-15 10:30:00', '2024-12-16 14:20:00', NULL, NULL, NULL, 2500.00, NULL),
('Maria Fernanda Costa', 'maria.costa@empresa.com', '(21) 98888-5678', 'Prospecção Recrutamento', 'whatsapp', true, 'agendado', 1, 'equipe-a', '2024-12-10 09:15:00', '2024-12-11 16:45:00', '2024-12-20 10:00:00', NULL, NULL, 3200.00, NULL),
('Ana Beatriz Lima', 'ana.lima@hotmail.com', '(85) 96666-3456', 'Novo Seguidor – NS', 'instagram', true, 'ganho', 1, 'equipe-a', '2024-11-28 11:20:00', '2024-11-29 15:30:00', '2024-12-03 14:00:00', '2024-12-03 14:00:00', '2024-12-05 16:30:00', 4500.00, 4500.00),
('Fernanda Cristina Santos', 'fernanda.santos@yahoo.com', '(62) 94444-2345', 'Prospecção Consultoria', 'whatsapp', false, 'no_show', 1, 'equipe-a', '2024-12-08 13:45:00', '2024-12-09 10:15:00', '2024-12-14 15:00:00', NULL, NULL, 2200.00, NULL),
('Ricardo Almeida Silva', 'ricardo.almeida@gmail.com', '(11) 95555-1111', 'Gatilho Social – GS', 'instagram', true, 'call_realizada', 1, 'equipe-a', '2024-12-12 08:30:00', '2024-12-13 11:20:00', '2024-12-18 09:30:00', '2024-12-18 09:30:00', NULL, 3800.00, NULL),

-- Leads de Ana Paula Silva (SDR - Equipe A)
('Carlos Roberto Oliveira', 'carlos.oliveira@gmail.com', '(31) 97777-9012', 'Gatilho Social – GS', 'instagram', false, 'call_realizada', 2, 'equipe-a', '2024-12-05 14:20:00', '2024-12-06 16:10:00', '2024-12-12 11:00:00', '2024-12-12 11:00:00', NULL, 2800.00, NULL),
('Patrícia Souza Lima', 'patricia.souza@outlook.com', '(41) 93333-7777', 'VS Tráfego – Lead Direct – Consultoria', 'whatsapp', true, 'qualificado', 2, 'equipe-a', '2024-12-14 10:45:00', '2024-12-15 13:30:00', NULL, NULL, NULL, 3500.00, NULL),
('Marcos Antonio Costa', 'marcos.costa@empresa.net', '(51) 92222-8888', 'Prospecção Recrutamento', 'instagram', true, 'agendado', 2, 'equipe-a', '2024-12-11 15:20:00', '2024-12-12 09:40:00', '2024-12-19 14:30:00', NULL, NULL, 2900.00, NULL),
('Luciana Pereira Santos', 'luciana.pereira@hotmail.com', '(61) 91111-9999', 'Seguidores antigos', 'whatsapp', true, 'ganho', 2, 'equipe-a', '2024-11-30 12:15:00', '2024-12-01 14:50:00', '2024-12-06 10:15:00', '2024-12-06 10:15:00', '2024-12-08 17:20:00', 5200.00, 5200.00),

-- Leads de Carlos Roberto Santos (SDR - Equipe B)
('Roberto Carlos Silva', 'roberto.silva@empresa.net', '(47) 95555-7890', 'VS Tráfego – Lead Direct – Consultoria', 'whatsapp', true, 'qualificado', 3, 'equipe-b', '2024-12-12 11:30:00', '2024-12-13 15:45:00', NULL, NULL, NULL, 3500.00, NULL),
('Amanda Caroline Costa', 'amanda.costa@gmail.com', '(48) 94444-5555', 'Tráfego – Lead Direct – Recrutamento', 'instagram', true, 'lead', 3, 'equipe-b', '2024-12-16 09:20:00', '2024-12-17 13:15:00', NULL, NULL, NULL, 2600.00, NULL),
('Bruno Alexandre Oliveira', 'bruno.oliveira@yahoo.com', '(49) 93333-6666', 'Prospecção Consultoria', 'whatsapp', false, 'perdido', 3, 'equipe-b', '2024-12-02 16:40:00', '2024-12-03 10:25:00', '2024-12-08 15:30:00', '2024-12-08 15:30:00', '2024-12-10 11:45:00', 1800.00, NULL),
('Camila Rodrigues Lima', 'camila.rodrigues@outlook.com', '(84) 92222-7777', 'Novo Seguidor – NS', 'instagram', true, 'agendado', 3, 'equipe-b', '2024-12-13 14:10:00', '2024-12-14 16:30:00', '2024-12-21 09:00:00', NULL, NULL, 4100.00, NULL),

-- Leads de Maria Fernanda Costa (SDR - Equipe B)
('Lucas Pereira Costa', 'lucas.pereira@outlook.com', '(81) 93333-6789', 'Seguidores antigos', 'instagram', true, 'perdido', 4, 'equipe-b', '2024-12-01 13:25:00', '2024-12-02 15:40:00', '2024-12-07 11:20:00', '2024-12-07 11:20:00', '2024-12-09 14:15:00', 1800.00, NULL),
('Juliana Aparecida Souza', 'juliana.souza@gmail.com', '(71) 92222-4567', 'Tráfego – Lead Direct – Recrutamento', 'whatsapp', true, 'prospectado', 4, 'equipe-b', '2024-12-18 08:45:00', NULL, NULL, NULL, NULL, NULL, NULL),
('Diego Santos Oliveira', 'diego.santos@empresa.com', '(85) 91111-3333', 'Prospecção Recrutamento', 'instagram', true, 'call_realizada', 4, 'equipe-b', '2024-12-09 10:30:00', '2024-12-10 14:20:00', '2024-12-15 16:00:00', '2024-12-15 16:00:00', NULL, 3300.00, NULL),
('Renata Silva Costa', 'renata.silva@hotmail.com', '(87) 90000-4444', 'Gatilho Social – GS', 'whatsapp', false, 'no_show', 4, 'equipe-b', '2024-12-06 12:50:00', '2024-12-07 09:35:00', '2024-12-13 13:45:00', NULL, NULL, 2400.00, NULL),

-- Leads dos Closers (Pedro Henrique Almeida - Equipe A)
('Gustavo Henrique Lima', 'gustavo.lima@empresa.net', '(11) 98888-1111', 'VS Tráfego – Lead Direct – Consultoria', 'whatsapp', true, 'ganho', 5, 'equipe-a', '2024-11-25 09:15:00', '2024-11-26 11:30:00', '2024-11-30 14:00:00', '2024-11-30 14:00:00', '2024-12-02 16:45:00', 6800.00, 6800.00),
('Isabela Santos Pereira', 'isabela.santos@gmail.com', '(21) 97777-2222', 'Prospecção Consultoria', 'instagram', true, 'ganho', 5, 'equipe-a', '2024-11-28 13:20:00', '2024-11-29 15:45:00', '2024-12-04 10:30:00', '2024-12-04 10:30:00', '2024-12-06 14:20:00', 8500.00, 8500.00),
('Thiago Rodrigues Silva', 'thiago.rodrigues@outlook.com', '(31) 96666-3333', 'Tráfego – Lead Direct – Recrutamento', 'whatsapp', true, 'call_realizada', 5, 'equipe-a', '2024-12-10 11:40:00', '2024-12-11 14:15:00', '2024-12-16 15:30:00', '2024-12-16 15:30:00', NULL, 7200.00, NULL),

-- Leads de Carla Regina Mendes (Closer - Equipe A)
('Vanessa Costa Lima', 'vanessa.costa@empresa.com', '(41) 95555-4444', 'Novo Seguidor – NS', 'instagram', true, 'ganho', 6, 'equipe-a', '2024-11-26 10:25:00', '2024-11-27 13:50:00', '2024-12-01 09:15:00', '2024-12-01 09:15:00', '2024-12-03 11:30:00', 5900.00, 5900.00),
('Eduardo Almeida Santos', 'eduardo.almeida@yahoo.com', '(51) 94444-5555', 'Prospecção Recrutamento', 'whatsapp', false, 'perdido', 6, 'equipe-a', '2024-12-03 14:30:00', '2024-12-04 16:20:00', '2024-12-09 13:00:00', '2024-12-09 13:00:00', '2024-12-11 15:45:00', 4200.00, NULL),

-- Leads de Rafael Eduardo Costa (Closer - Equipe B)
('Priscila Oliveira Silva', 'priscila.oliveira@gmail.com', '(61) 93333-6666', 'Gatilho Social – GS', 'instagram', true, 'ganho', 7, 'equipe-b', '2024-11-29 12:10:00', '2024-11-30 14:35:00', '2024-12-05 11:20:00', '2024-12-05 11:20:00', '2024-12-07 16:15:00', 7800.00, 7800.00),
('Felipe Santos Costa', 'felipe.santos@empresa.net', '(71) 92222-7777', 'VS Tráfego – Lead Direct – Consultoria', 'whatsapp', true, 'call_realizada', 7, 'equipe-b', '2024-12-08 15:45:00', '2024-12-09 10:20:00', '2024-12-14 14:30:00', '2024-12-14 14:30:00', NULL, 6500.00, NULL),

-- Leads de Juliana Aparecida Silva (Closer - Equipe B)
('Rodrigo Lima Pereira', 'rodrigo.lima@hotmail.com', '(81) 91111-8888', 'Seguidores antigos', 'instagram', true, 'ganho', 8, 'equipe-b', '2024-11-27 09:30:00', '2024-11-28 12:45:00', '2024-12-02 15:00:00', '2024-12-02 15:00:00', '2024-12-04 17:30:00', 5600.00, 5600.00),
('Natália Costa Santos', 'natalia.costa@outlook.com', '(85) 90000-9999', 'Prospecção Consultoria', 'whatsapp', false, 'no_show', 8, 'equipe-b', '2024-12-07 11:15:00', '2024-12-08 13:40:00', '2024-12-12 10:45:00', NULL, NULL, 3700.00, NULL),

-- Leads adicionais para completar o dataset
('Adriana Silva Oliveira', 'adriana.silva@gmail.com', '(11) 99999-0000', 'Tráfego – Lead Direct – Recrutamento', 'instagram', true, 'lead', 1, 'equipe-a', '2024-12-17 10:20:00', '2024-12-18 14:30:00', NULL, NULL, NULL, 2800.00, NULL),
('Márcio Pereira Lima', 'marcio.pereira@empresa.com', '(21) 98888-1111', 'Prospecção Recrutamento', 'whatsapp', true, 'qualificado', 2, 'equipe-a', '2024-12-15 13:45:00', '2024-12-16 16:20:00', NULL, NULL, NULL, 3100.00, NULL),
('Cristiane Santos Costa', 'cristiane.santos@yahoo.com', '(31) 97777-2222', 'Novo Seguidor – NS', 'instagram', false, 'prospectado', 3, 'equipe-b', '2024-12-19 09:10:00', NULL, NULL, NULL, NULL, NULL, NULL),
('Alexandre Costa Silva', 'alexandre.costa@hotmail.com', '(41) 96666-3333', 'Gatilho Social – GS', 'whatsapp', true, 'agendado', 4, 'equipe-b', '2024-12-14 12:30:00', '2024-12-15 15:15:00', '2024-12-22 11:00:00', NULL, NULL, 4200.00, NULL),
('Beatriz Lima Santos', 'beatriz.lima@outlook.com', '(51) 95555-4444', 'VS Tráfego – Lead Direct – Consultoria', 'instagram', true, 'call_realizada', 5, 'equipe-a', '2024-12-11 14:50:00', '2024-12-12 17:25:00', '2024-12-17 13:15:00', '2024-12-17 13:15:00', NULL, 7500.00, NULL),
('Daniel Oliveira Costa', 'daniel.oliveira@empresa.net', '(61) 94444-5555', 'Prospecção Consultoria', 'whatsapp', true, 'perdido', 6, 'equipe-a', '2024-12-04 11:40:00', '2024-12-05 14:55:00', '2024-12-10 16:20:00', '2024-12-10 16:20:00', '2024-12-12 18:10:00', 3900.00, NULL),
('Larissa Santos Lima', 'larissa.santos@gmail.com', '(71) 93333-6666', 'Seguidores antigos', 'instagram', false, 'no_show', 7, 'equipe-b', '2024-12-09 08:25:00', '2024-12-10 11:50:00', '2024-12-15 14:40:00', NULL, NULL, 2700.00, NULL),
('Vinícius Costa Pereira', 'vinicius.costa@yahoo.com', '(81) 92222-7777', 'Tráfego – Lead Direct – Recrutamento', 'whatsapp', true, 'ganho', 8, 'equipe-b', '2024-11-24 15:30:00', '2024-11-25 17:45:00', '2024-11-29 12:30:00', '2024-11-29 12:30:00', '2024-12-01 14:50:00', 6200.00, 6200.00);

-- Atualizar contadores nas fontes de lead
UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Tráfego – Lead Direct – Recrutamento'
) WHERE codigo = 'trafego-lead-direct-recrutamento';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Prospecção Recrutamento'
) WHERE codigo = 'prospeccao-recrutamento';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Prospecção Consultoria'
) WHERE codigo = 'prospeccao-consultoria';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'VS Tráfego – Lead Direct – Consultoria'
) WHERE codigo = 'vs-trafego-lead-direct-consultoria';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Gatilho Social – GS'
) WHERE codigo = 'gatilho-social';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Novo Seguidor – NS'
) WHERE codigo = 'novo-seguidor';

UPDATE fontes_lead_bposs SET total_leads = (
    SELECT COUNT(*) FROM leads WHERE fonte_lead = 'Seguidores antigos'
) WHERE codigo = 'seguidores-antigos';

COMMIT;

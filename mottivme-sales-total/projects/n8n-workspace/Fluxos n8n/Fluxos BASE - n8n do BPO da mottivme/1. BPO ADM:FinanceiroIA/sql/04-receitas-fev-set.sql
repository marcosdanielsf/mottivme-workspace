-- ============================================
-- PASSO 4: IMPORTAR ENTRADAS (RECEITAS) - V4
-- Sem coluna data_pagamento (não existe)
-- ============================================

INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    valor_realizado,
    data_competencia,
    data_vencimento,
    quitado,
    categoria_id,
    cliente_fornecedor_id
)
SELECT
    'receita',
    c.nome || ' - ' ||
    CASE
        WHEN cat_id = '9b3f7381-eb5f-4eed-9451-fa6eb734942a' THEN 'BPOSS'
        WHEN cat_id = 'fa6ce660-759f-47d1-943c-8beb0c51a1a5' THEN 'BPOLG'
        WHEN cat_id = '4f7ce6d4-f7db-4e54-adc6-04b6d08221d9' THEN 'Gestão de Tráfego'
        WHEN cat_id = '642b1ce7-1696-4c65-bbe6-6192c6151be1' THEN 'Manutenção CRM'
        WHEN cat_id = '97b6d64c-4e8b-4c88-9346-5206fac7d22a' THEN 'IA'
        ELSE 'Receita'
    END,
    valor,
    CASE WHEN status = 'PAGO' THEN valor ELSE NULL END,
    DATE_TRUNC('month', data_cobranca)::date,
    data_cobranca::date,
    status = 'PAGO',
    cat_id::uuid,
    c.id
FROM (VALUES
    -- Setembro 2025
    ('Julia Supa', 1855.00, '2025-09-25'::date, 'FALTA', '4f7ce6d4-f7db-4e54-adc6-04b6d08221d9'),
    ('Luciana Garcia', 1984.50, '2025-09-25'::date, 'FALTA', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    ('Fernanda Lappe', 3180.00, '2025-09-25'::date, 'FALTA', '4f7ce6d4-f7db-4e54-adc6-04b6d08221d9'),
    ('Julia Supa', 2120.00, '2025-09-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Renata Vieira', 2120.00, '2025-09-25'::date, 'FALTA', '4f7ce6d4-f7db-4e54-adc6-04b6d08221d9'),
    ('Renata Vieira', 3120.00, '2025-09-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Vivian Fernandes de Araujo Osorio', 2430.00, '2025-09-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fernanda Lappe', 4480.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Thiago', 850.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fabiana', 1000.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Vinicius Moraes', 5440.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Kamilla Cavalcanti', 3045.53, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gladson Almeida Lopes Jr', 3164.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Camila Poutre e Aline Morais', 3264.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Shirley', 3264.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Juliana Costa', 3360.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Pablo', 1530.00, '2025-09-22'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    -- Agosto 2025
    ('Renata Vieira', 3640.00, '2025-08-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fernanda Lappe', 4198.00, '2025-08-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Denilson Meguro', 3400.00, '2025-08-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gustavo Couto', 15804.00, '2025-08-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 1984.50, '2025-08-25'::date, 'FALTA', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    ('Vivian Fernandes de Araujo Osorio', 2430.00, '2025-08-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Janeidy', 1611.06, '2025-08-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('André Rosa', 3120.00, '2025-08-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Sales Hub', 1500.00, '2025-08-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    -- Julho 2025
    ('Janeide e Janilson', 2200.00, '2025-07-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Luciana Garcia', 1984.50, '2025-07-25'::date, 'FALTA', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    ('Denilson Meguro', 4231.86, '2025-07-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Renata Vieira', 9742.00, '2025-07-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fernanda Lappe', 6480.00, '2025-07-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('André Rosa', 3400.00, '2025-07-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 3400.00, '2025-07-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gustavo Couto', 16400.00, '2025-07-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    -- Junho 2025
    ('Julia Supa', 6201.21, '2025-06-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Cláudia Fehribach', 10080.00, '2025-06-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('André Rosa', 9450.00, '2025-06-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Greg', 6474.00, '2025-06-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Denilson Meguro', 4231.86, '2025-06-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fernanda Lappe', 4160.00, '2025-06-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 3400.00, '2025-06-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Luciana Garcia', 1984.50, '2025-06-25'::date, 'FALTA', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    -- Maio 2025
    ('Distrato Bruno Mesquita', 3314.00, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 5701.90, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gladson Almeida Lopes Jr', 3080.00, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Jean', 4500.00, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Denilson Meguro', 4231.86, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Rodrigo Ramos e Ana Karina', 5555.10, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Luciana Garcia', 1984.50, '2025-05-25'::date, 'PAGO', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    ('Fernanda Lappe', 4487.04, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Janeide e Janilson', 4661.83, '2025-05-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    -- Abril 2025
    ('Luciana Garcia', 1984.50, '2025-04-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Bruno Mesquita', 5600.00, '2025-04-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Janeide e Janilson', 7840.00, '2025-04-25'::date, 'PAGO', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    ('Fernanda Lappe', 4570.32, '2025-04-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Jean', 4500.00, '2025-04-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Rodrigo Ramos e Ana Karina', 5651.00, '2025-04-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gladson Almeida Lopes Jr', 3080.00, '2025-04-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 5701.90, '2025-04-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    -- Março 2025
    ('André Rosa', 2815.00, '2025-03-25'::date, 'PAGO', '642b1ce7-1696-4c65-bbe6-6192c6151be1'),
    ('Matheus Henrique Dias', 3395.00, '2025-03-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Andrea Saraiva', 3378.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('LaBluh Esthetics Institute', 2860.00, '2025-03-25'::date, 'PAGO', '97b6d64c-4e8b-4c88-9346-5206fac7d22a'),
    ('Gladson Almeida Lopes Jr', 3080.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Jean Pierre', 4500.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Pablo', 1530.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 5701.90, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Taciana Cury e Marcos Alves', 5614.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Bruno Mesquita', 5600.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Priscilla Lacerda', 5890.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Rodrigo Ramos e Ana Karina', 5651.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Fernanda Lappe', 4570.32, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Cláudia Fehribach', 3431.00, '2025-03-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Camila Poutre e Aline Morais', 3420.00, '2025-03-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Luciana Garcia', 1984.50, '2025-03-25'::date, 'PAGO', 'fa6ce660-759f-47d1-943c-8beb0c51a1a5'),
    -- Fevereiro 2025
    ('André Rosa', 2859.00, '2025-02-25'::date, 'PAGO', '642b1ce7-1696-4c65-bbe6-6192c6151be1'),
    ('Matheus Henrique Dias', 3401.25, '2025-02-25'::date, 'FALTA', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Gladson Almeida Lopes Jr', 3080.00, '2025-02-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Milton de Abreu', 5701.90, '2025-02-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a'),
    ('Cláudia Fehribach', 3431.00, '2025-02-25'::date, 'PAGO', '9b3f7381-eb5f-4eed-9451-fa6eb734942a')
) AS dados(cliente_nome, valor, data_cobranca, status, cat_id)
JOIN clientes_fornecedores c ON c.nome = dados.cliente_nome
WHERE dados.valor > 0;

-- Verificar receitas importadas
SELECT
    EXTRACT(YEAR FROM data_vencimento)::int as ano,
    EXTRACT(MONTH FROM data_vencimento)::int as mes,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto,
    SUM(CASE WHEN quitado THEN valor_realizado ELSE 0 END) as total_realizado
FROM movimentacoes_financeiras
WHERE tipo = 'receita'
GROUP BY ano, mes
ORDER BY ano DESC, mes DESC;

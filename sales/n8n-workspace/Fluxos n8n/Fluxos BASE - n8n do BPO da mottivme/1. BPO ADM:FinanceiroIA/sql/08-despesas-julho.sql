-- ============================================
-- PASSO 9: ADICIONAR DESPESAS JULHO 2025
-- Total esperado: R$ 13.992,04
-- ============================================

INSERT INTO movimentacoes_financeiras (
    tipo,
    descricao,
    valor_previsto,
    valor_realizado,
    data_competencia,
    data_vencimento,
    quitado,
    categoria_id
)
VALUES
('despesa', 'endereço fiscal', 231.90, 231.90, '2025-07-01', '2025-07-25', true, 'c25ffda1-eff8-4bd2-a03c-34cd516fbe19'),
('despesa', 'INSS', 1200.00, 1200.00, '2025-07-01', '2025-07-25', true, '629fb19f-24e5-4a9e-b589-c6979ade64d9'),
('despesa', 'honorários contador', 347.00, 347.00, '2025-07-01', '2025-07-25', true, 'a9e604ab-597b-460a-ac4e-a18f395c1c6d'),
('despesa', 'Funcionários', 8838.00, 8838.00, '2025-07-01', '2025-07-25', true, '79312d39-e686-4453-8d6a-9a0100a4212b'),
('despesa', 'Sistemas', 1636.18, 1636.18, '2025-07-01', '2025-07-25', true, '8dd1c822-c815-4f0e-9c29-4063f4b01f21'),
('despesa', 'vivo internet', 99.00, 99.00, '2025-07-01', '2025-07-25', true, '32fd17a7-c801-436e-9d4a-aa05de500b85'),
('despesa', 'vivo celular', 139.96, 139.96, '2025-07-01', '2025-07-25', true, '36489132-099b-4c42-b582-0929778aac7c'),
('despesa', 'Anturio', 1500.00, 1500.00, '2025-07-01', '2025-07-25', true, '7625295c-c5a7-4958-be47-9bd8e9f093f8');

-- Verificar despesas de Julho
SELECT
    'Julho 2025' as mes,
    COUNT(*) as quantidade,
    SUM(valor_previsto) as total_previsto
FROM movimentacoes_financeiras
WHERE tipo = 'despesa'
AND EXTRACT(MONTH FROM data_vencimento) = 7
AND EXTRACT(YEAR FROM data_vencimento) = 2025;

-- Total esperado: R$ 13.992,04

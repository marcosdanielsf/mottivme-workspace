-- Verificar moeda de cada contrato ativo
SELECT
    nome,
    email,
    valor_mensal,
    moeda,
    pais
FROM contratos_pendentes
WHERE status = 'ativo'
ORDER BY nome;

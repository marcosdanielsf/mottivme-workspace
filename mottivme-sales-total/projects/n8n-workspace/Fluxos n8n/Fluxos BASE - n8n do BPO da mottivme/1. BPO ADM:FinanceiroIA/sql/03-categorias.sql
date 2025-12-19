-- ============================================
-- PASSO 3: VERIFICAR/AJUSTAR CATEGORIAS
-- Execute para garantir que as categorias existem
-- ============================================

-- Verificar categorias existentes
SELECT id, nome, tipo FROM categorias_financeiras WHERE ativo = true ORDER BY tipo, nome;

-- Se precisar adicionar categorias que faltam, descomente e execute:

-- Categorias de RECEITA (produtos/serviços)
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor, ativo)
SELECT * FROM (VALUES
    ('BPOSS', 'receita', 'BPO Sales - Serviço principal', '#22c55e', true),
    ('BPOLG', 'receita', 'BPO Lead Generation', '#10b981', true),
    ('Gestão de Tráfego', 'receita', 'Serviço de gestão de tráfego pago', '#34d399', true),
    ('Manutenção CRM', 'receita', 'Manutenção de sistemas CRM', '#6ee7b7', true),
    ('IA', 'receita', 'Serviços de Inteligência Artificial', '#a7f3d0', true),
    ('Consultoria', 'receita', 'Consultoria geral', '#059669', true)
) AS v(nome, tipo, descricao, cor, ativo)
WHERE NOT EXISTS (
    SELECT 1 FROM categorias_financeiras cf
    WHERE cf.nome = v.nome AND cf.tipo = v.tipo
);

-- Categorias de DESPESA
INSERT INTO categorias_financeiras (nome, tipo, descricao, cor, ativo)
SELECT * FROM (VALUES
    ('Funcionários', 'despesa', 'Salários e encargos', '#ef4444', true),
    ('Sistemas', 'despesa', 'Software e ferramentas', '#f97316', true),
    ('Impostos', 'despesa', 'Impostos e taxas', '#dc2626', true),
    ('DARF/DAS/FGTS', 'despesa', 'Impostos trabalhistas', '#b91c1c', true),
    ('Advogado', 'despesa', 'Honorários advocatícios', '#8b5cf6', true),
    ('Jurídico', 'despesa', 'Despesas jurídicas gerais', '#7c3aed', true),
    ('Contador', 'despesa', 'Honorários contábeis', '#6366f1', true),
    ('Social Midia', 'despesa', 'Marketing em redes sociais', '#f59e0b', true),
    ('Endereço Digital', 'despesa', 'Endereço fiscal/virtual', '#84cc16', true),
    ('Endereço Fiscal', 'despesa', 'Endereço fiscal', '#65a30d', true),
    ('Internet/Telefone', 'despesa', 'Vivo e outros', '#0ea5e9', true),
    ('BPO', 'despesa', 'Serviços terceirizados BPO', '#14b8a6', true),
    ('BI', 'despesa', 'Business Intelligence', '#06b6d4', true),
    ('Filmaker', 'despesa', 'Produção de vídeo', '#ec4899', true),
    ('Comissões', 'despesa', 'Comissões pagas', '#f43f5e', true),
    ('Eventos', 'despesa', 'Participação em eventos', '#d946ef', true),
    ('Curso', 'despesa', 'Treinamentos e cursos', '#a855f7', true),
    ('Extras', 'despesa', 'Despesas diversas', '#a3a3a3', true),
    ('Recisão', 'despesa', 'Rescisões trabalhistas', '#991b1b', true),
    ('Correios', 'despesa', 'Envios e correspondências', '#78716c', true)
) AS v(nome, tipo, descricao, cor, ativo)
WHERE NOT EXISTS (
    SELECT 1 FROM categorias_financeiras cf
    WHERE cf.nome = v.nome AND cf.tipo = v.tipo
);

-- Verificar resultado
SELECT tipo, COUNT(*) as quantidade FROM categorias_financeiras WHERE ativo = true GROUP BY tipo;

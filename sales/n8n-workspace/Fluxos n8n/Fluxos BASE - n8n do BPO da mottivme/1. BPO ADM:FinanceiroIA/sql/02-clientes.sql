-- ============================================
-- PASSO 2: CRIAR CLIENTES (VERSÃO CORRIGIDA)
-- tipo: pessoa_fisica ou pessoa_juridica
-- ============================================

INSERT INTO clientes_fornecedores (nome, tipo, documento, ativo) VALUES
-- Clientes do CSV de entradas
('Julia Supa', 'pessoa_fisica', '00000000001', true),
('Luciana Garcia', 'pessoa_fisica', '00000000002', true),
('Fernanda Lappe', 'pessoa_fisica', '00000000003', true),
('Renata Vieira', 'pessoa_fisica', '00000000004', true),
('Vivian Fernandes de Araujo Osorio', 'pessoa_fisica', '00000000005', true),
('Thiago', 'pessoa_fisica', '00000000006', true),
('Fabiana', 'pessoa_fisica', '00000000007', true),
('Vinicius Moraes', 'pessoa_fisica', '00000000008', true),
('Kamilla Cavalcanti', 'pessoa_fisica', '00000000009', true),
('Gladson Almeida Lopes Jr', 'pessoa_fisica', '00000000010', true),
('Camila Poutre e Aline Morais', 'pessoa_fisica', '00000000011', true),
('Shirley', 'pessoa_fisica', '00000000012', true),
('Andre', 'pessoa_fisica', '00000000013', true),
('Juliana Costa', 'pessoa_fisica', '00000000014', true),
('Pablo', 'pessoa_fisica', '00000000015', true),
('Matheus Henrique Dias', 'pessoa_fisica', '00000000016', true),
('Denilson Meguro', 'pessoa_fisica', '00000000017', true),
('Gustavo Couto', 'pessoa_fisica', '00000000018', true),
('Milton de Abreu', 'pessoa_fisica', '00000000019', true),
('Janeidy', 'pessoa_fisica', '00000000020', true),
('André Rosa', 'pessoa_fisica', '00000000021', true),
('Sales Hub', 'pessoa_juridica', '00000000000022', true),
('Janeide e Janilson', 'pessoa_fisica', '00000000023', true),
('Cláudia Fehribach', 'pessoa_fisica', '00000000024', true),
('Greg', 'pessoa_fisica', '00000000025', true),
('Bruno Mesquita', 'pessoa_fisica', '00000000026', true),
('Jean', 'pessoa_fisica', '00000000027', true),
('Rodrigo Ramos e Ana Karina', 'pessoa_fisica', '00000000028', true),
('Priscilla Lacerda', 'pessoa_fisica', '00000000029', true),
('Theodore Lewis', 'pessoa_fisica', '00000000030', true),
('Andrea Saraiva', 'pessoa_fisica', '00000000031', true),
('LaBluh Esthetics Institute', 'pessoa_juridica', '00000000000032', true),
('Jean Pierre', 'pessoa_fisica', '00000000033', true),
('Taciana Cury e Marcos Alves', 'pessoa_fisica', '00000000034', true),
('Distrato Bruno Mesquita', 'pessoa_fisica', '00000000035', true);

-- Verificar clientes criados
SELECT COUNT(*) as total_clientes,
       COUNT(CASE WHEN tipo = 'pessoa_fisica' THEN 1 END) as pf,
       COUNT(CASE WHEN tipo = 'pessoa_juridica' THEN 1 END) as pj
FROM clientes_fornecedores;

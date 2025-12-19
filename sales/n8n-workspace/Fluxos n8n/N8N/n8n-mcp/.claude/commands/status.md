# Comando: Status do Workspace

Mostre um resumo do estado atual do workspace.

## Informações a mostrar:

### 1. Visão geral
- Total de workflows em `_workspace/workflows/`
- Total de projetos em `_workspace/clientes/`
- Arquivos soltos na raiz (que precisam organização)

### 2. Por projeto/cliente
Para cada pasta em `_workspace/clientes/`:
- Nome do projeto
- Quantidade de workflows
- Último arquivo modificado
- Status (se tiver README.md)

### 3. Workflows recentes
- Listar os 5 workflows modificados mais recentemente
- Mostrar data de modificação

### 4. Alertas
- Arquivos soltos que precisam organização
- Projetos sem README.md
- Workflows fora da pasta correta

## Formato de saída:
Usar tabelas markdown para facilitar leitura.

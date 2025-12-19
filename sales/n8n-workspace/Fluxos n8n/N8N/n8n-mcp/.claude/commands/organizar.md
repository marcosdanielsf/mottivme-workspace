# Comando: Organizar Workspace

Analise a pasta `_workspace/` e organize os arquivos de acordo com a estrutura padrão:

## Estrutura esperada:
```
_workspace/
├── workflows/          # Workflows n8n (arquivos .json de workflows)
├── clientes/           # Projetos organizados por cliente
│   ├── [nome-cliente]/
│   └── ...
├── dados/              # CSVs, planilhas, relatórios
├── prompts/            # Prompts e templates de texto
├── scripts/            # Scripts Python, JS, etc.
└── archive/            # Arquivos antigos ou não utilizados
```

## Tarefas:

1. **Listar arquivos soltos** na raiz de `_workspace/` que deveriam estar em subpastas
2. **Identificar workflows n8n** (JSONs com estrutura de workflow) e mover para `workflows/`
3. **Identificar dados** (CSVs, XLS, DOCX, TXT com dados) e mover para `dados/`
4. **Sugerir organização** para arquivos que não se encaixam nas categorias
5. **Perguntar antes de mover** arquivos importantes

## Regras:
- Sempre perguntar antes de mover arquivos
- Mostrar preview das mudanças antes de executar
- Criar pastas de cliente quando identificar padrão de projeto
- Manter histórico do que foi movido

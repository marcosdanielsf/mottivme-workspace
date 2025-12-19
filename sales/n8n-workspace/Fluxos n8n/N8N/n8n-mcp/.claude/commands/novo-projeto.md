# Comando: Novo Projeto

Crie uma nova pasta de projeto em `_workspace/clientes/`.

## Pergunte ao usuário:
1. Nome do projeto/cliente
2. Tipo de projeto (SDR, automação, integração, etc.)
3. Descrição breve

## Estrutura a criar:
```
_workspace/clientes/[nome-projeto]/
├── workflows/          # Workflows n8n deste projeto
├── dados/              # Dados específicos do projeto
├── docs/               # Documentação e notas
└── README.md           # Descrição do projeto
```

## README.md template:
```markdown
# [Nome do Projeto]

## Descrição
[Descrição breve]

## Tipo
[Tipo de projeto]

## Workflows
- [ ] Listar workflows aqui

## Status
- Criado em: [data]
- Status: Em desenvolvimento
```

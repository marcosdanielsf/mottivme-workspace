# Memória de Sessão e Índice de Projeto

Este módulo adiciona:
- Memória de sessão (JSON) para registrar eventos importantes da conversa/projeto.
- Índice TF-IDF simples dos arquivos do projeto para busca rápida.

## Memória de Sessão

Arquivo: `memoria/sessao.py`

Uso rápido (exemplo):

```python
from memoria import MemoriaSessao

mem = MemoriaSessao(storage_path=".trae_memoria_sessao.json")
mem.add_event(
    type="session",
    title="Decisão: usar youtube-transcript-api",
    summary="Ferramenta escolhida para extrair transcrições no projeto",
    tags=["tooling","decision"],
    source_path="extrair_transcricoes.py",
    importance="high",
    pinned=True,
)

for item in mem.list(limit=10):
    print(item.title, item.summary)
```

Principais métodos:
- `add_event(...)`: adiciona um item de memória.
- `list(limit=50, include_pinned=True)`: lista itens (ordenados por fixo/recência).
- `search(query, limit=20)`: busca simples por texto/tags.
- `pin(title)`: fixa um item pelo título.
- `purge_expired()`: remove itens expirados por TTL.

## Índice de Projeto (TF-IDF)

Script: `indice_projeto.py`

Construir índice:

```bash
python indice_projeto.py build --root . --out .trae_indice.json
```

Buscar no índice:

```bash
python indice_projeto.py search "transcrições youtube" --out .trae_indice.json --top 5
```

Parâmetros:
- `--root`: diretório raiz para varredura.
- `--out`: arquivo JSON do índice.
- `--top`: quantidade de resultados.

## Notas
- O índice considera arquivos `.py`, `.md`, `.json`, `.txt`.
- O TF-IDF é implementado sem dependências externas (adequado para projetos leves).
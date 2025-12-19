from typing import TYPE_CHECKING

# Para satisfazer analisadores estáticos sem depender de import em tempo de execução
if TYPE_CHECKING:  # pragma: no cover
    from .sessao import MemoriaSessao as MemoriaSessao
    from .sessao import MemoryItem as MemoryItem

# Reexport em tempo de execução, evitando erro de "nome não encontrado" do linter
from . import sessao as _sessao

MemoriaSessao = _sessao.MemoriaSessao
MemoryItem = _sessao.MemoryItem

__all__ = ["MemoriaSessao", "MemoryItem"]
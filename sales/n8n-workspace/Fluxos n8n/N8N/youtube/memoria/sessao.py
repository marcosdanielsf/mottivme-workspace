import json
import os
import time
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any


@dataclass
class MemoryItem:
    type: str  # 'session' | 'project' | 'user'
    title: str
    summary: str
    tags: List[str]
    source_path: Optional[str]
    timestamp: float
    importance: str  # 'low' | 'medium' | 'high'
    ttl_days: Optional[int] = None
    pinned: bool = False


class MemoriaSessao:
    def __init__(self, storage_path: str = ".trae_memoria_sessao.json") -> None:
        self.storage_path = storage_path
        self._mem: List[MemoryItem] = []
        self._load()

    def _load(self) -> None:
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self._mem = [MemoryItem(**item) for item in data]
            except Exception:
                self._mem = []

    def _save(self) -> None:
        data = [asdict(item) for item in self._mem]
        with open(self.storage_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def add_event(
        self,
        *,
        type: str,
        title: str,
        summary: str,
        tags: Optional[List[str]] = None,
        source_path: Optional[str] = None,
        importance: str = "medium",
        ttl_days: Optional[int] = None,
        pinned: bool = False,
    ) -> MemoryItem:
        item = MemoryItem(
            type=type,
            title=title,
            summary=summary,
            tags=tags or [],
            source_path=source_path,
            timestamp=time.time(),
            importance=importance,
            ttl_days=ttl_days,
            pinned=pinned,
        )
        self._mem.append(item)
        self._save()
        return item

    def pin(self, title: str) -> bool:
        for item in self._mem:
            if item.title == title:
                item.pinned = True
                self._save()
                return True
        return False

    def list(self, *, limit: int = 50, include_pinned: bool = True) -> List[MemoryItem]:
        items = sorted(self._mem, key=lambda i: (not i.pinned, -i.timestamp))
        if not include_pinned:
            items = [i for i in items if not i.pinned]
        return items[:limit]

    def search(self, query: str, *, limit: int = 20) -> List[MemoryItem]:
        q = query.lower()
        scored: List[Dict[str, Any]] = []
        for item in self._mem:
            text = " ".join([item.title, item.summary, " ".join(item.tags)]).lower()
            score = (2 * text.count(q)) + (1 if any(t in q for t in item.tags) else 0)
            if q in text:
                scored.append({"item": item, "score": score + (3 if item.pinned else 0)})
        scored.sort(key=lambda x: x["score"], reverse=True)
        return [s["item"] for s in scored[:limit]]

    def purge_expired(self) -> int:
        now = time.time()
        kept: List[MemoryItem] = []
        removed = 0
        for item in self._mem:
            if item.ttl_days is None:
                kept.append(item)
                continue
            ttl_seconds = item.ttl_days * 86400
            if now - item.timestamp <= ttl_seconds or item.pinned:
                kept.append(item)
            else:
                removed += 1
        self._mem = kept
        self._save()
        return removed
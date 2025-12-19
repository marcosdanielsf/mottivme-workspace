#!/usr/bin/env python3
import os
import math
import json
import re
from typing import Dict, List, Tuple


def tokenize(text: str) -> List[str]:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9_\-\u00C0-\u00FF]+", " ", text)
    tokens = [t for t in text.split() if len(t) > 1]
    return tokens


class TFIDFIndex:
    def __init__(self) -> None:
        self.doc_tokens: Dict[str, List[str]] = {}
        self.df: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.vectors: Dict[str, Dict[str, float]] = {}

    def add_document(self, path: str, text: str) -> None:
        tokens = tokenize(text)
        self.doc_tokens[path] = tokens

    def build(self) -> None:
        # Document frequency
        for tokens in self.doc_tokens.values():
            seen = set(tokens)
            for t in seen:
                self.df[t] = self.df.get(t, 0) + 1
        n_docs = max(1, len(self.doc_tokens))
        # IDF
        for term, df in self.df.items():
            self.idf[term] = math.log((n_docs + 1) / (df + 1)) + 1.0
        # Vectors (tf * idf)
        for path, tokens in self.doc_tokens.items():
            tf: Dict[str, float] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0.0) + 1.0
            # normalize tf
            length = max(1.0, sum(tf.values()))
            for t in list(tf.keys()):
                tf[t] = tf[t] / length
            vec: Dict[str, float] = {t: tf[t] * self.idf.get(t, 0.0) for t in tf}
            self.vectors[path] = vec

    def search(self, query: str, k: int = 10) -> List[Tuple[str, float]]:
        q_tokens = tokenize(query)
        q_tf: Dict[str, float] = {}
        for t in q_tokens:
            q_tf[t] = q_tf.get(t, 0.0) + 1.0
        length = max(1.0, sum(q_tf.values()))
        for t in list(q_tf.keys()):
            q_tf[t] = q_tf[t] / length
        q_vec: Dict[str, float] = {t: q_tf[t] * self.idf.get(t, 0.0) for t in q_tf}

        results: List[Tuple[str, float]] = []
        for path, vec in self.vectors.items():
            # cosine similarity without normalization of doc vector (approx)
            score = 0.0
            for term, qw in q_vec.items():
                score += qw * vec.get(term, 0.0)
            if score > 0:
                results.append((path, score))
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:k]


def scan_directory(root: str) -> List[str]:
    allowed_ext = {".py", ".md", ".json", ".txt"}
    files: List[str] = []
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            ext = os.path.splitext(fn)[1].lower()
            if ext in allowed_ext:
                files.append(os.path.join(dirpath, fn))
    return files


def build_index(root: str, out_path: str = ".trae_indice.json") -> None:
    index = TFIDFIndex()
    for path in scan_directory(root):
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            index.add_document(path, content)
        except Exception:
            continue
    index.build()
    payload = {
        "idf": index.idf,
        "vectors": index.vectors,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)


def load_index(path: str = ".trae_indice.json") -> TFIDFIndex:
    idx = TFIDFIndex()
    if not os.path.exists(path):
        return idx
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    idx.idf = data.get("idf", {})
    idx.vectors = data.get("vectors", {})
    return idx


def cli():
    import argparse
    parser = argparse.ArgumentParser(description="Índice TF-IDF simples do projeto")
    parser.add_argument("action", choices=["build", "search"], help="ação a executar")
    parser.add_argument("query", nargs="?", help="consulta para busca")
    parser.add_argument("--root", default=".", help="diretório raiz")
    parser.add_argument("--out", default=".trae_indice.json", help="arquivo do índice")
    parser.add_argument("--top", type=int, default=10, help="número de resultados")
    args = parser.parse_args()

    if args.action == "build":
        build_index(args.root, args.out)
        print(f"Índice criado em {args.out}")
    elif args.action == "search":
        if not args.query:
            print("Forneça uma consulta para busca")
            return
        idx = load_index(args.out)
        results = idx.search(args.query, k=args.top)
        for path, score in results:
            print(f"{score:.4f}  {path}")


if __name__ == "__main__":
    cli()
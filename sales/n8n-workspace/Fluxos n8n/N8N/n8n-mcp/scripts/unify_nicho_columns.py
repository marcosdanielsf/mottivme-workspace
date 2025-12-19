#!/usr/bin/env python3
"""
Script para unificar duas colunas de nicho/público-alvo sem sobrepor linhas.
Remove duplicatas e mantém o valor mais completo quando houver divergência.
"""

import csv
import sys
from pathlib import Path


def normalize_text(text: str) -> str:
    """Normaliza texto para comparação (remove espaços extras, lowercase)."""
    if not text:
        return ""
    return " ".join(text.strip().lower().split())


def choose_best_value(val1: str, val2: str) -> str:
    """
    Escolhe o melhor valor entre duas opções.
    Regras:
    - Se ambos vazios, retorna vazio
    - Se apenas um tem valor, retorna esse
    - Se são iguais (ignorando case/espaços), retorna o primeiro
    - Se diferentes, retorna o mais longo/completo
    """
    val1 = val1.strip() if val1 else ""
    val2 = val2.strip() if val2 else ""

    # Se ambos vazios
    if not val1 and not val2:
        return ""

    # Se apenas um tem valor
    if not val1:
        return val2
    if not val2:
        return val1

    # Se são iguais (ignorando case/espaços)
    if normalize_text(val1) == normalize_text(val2):
        return val1

    # Se diferentes, retorna o mais longo
    return val1 if len(val1) >= len(val2) else val2


def unify_columns(input_file: Path, output_file: Path):
    """Unifica as duas colunas de nicho em uma só."""

    print(f"Lendo arquivo: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)

        # Lê o cabeçalho
        header = next(reader)
        print(f"Colunas encontradas: {len(header)}")
        print(f"  Coluna 1: {header[0][:80]}...")
        if len(header) > 1:
            print(f"  Coluna 2: {header[1][:80]}...")

        # Processa as linhas
        unified_data = []
        stats = {
            'total': 0,
            'both_empty': 0,
            'only_col1': 0,
            'only_col2': 0,
            'both_equal': 0,
            'both_different': 0
        }

        for row in reader:
            stats['total'] += 1

            # Garante que temos pelo menos 2 colunas
            while len(row) < 2:
                row.append("")

            col1 = row[0].strip() if row[0] else ""
            col2 = row[1].strip() if row[1] else ""

            # Estatísticas
            if not col1 and not col2:
                stats['both_empty'] += 1
            elif col1 and not col2:
                stats['only_col1'] += 1
            elif col2 and not col1:
                stats['only_col2'] += 1
            elif normalize_text(col1) == normalize_text(col2):
                stats['both_equal'] += 1
            else:
                stats['both_different'] += 1

            # Escolhe o melhor valor
            unified_value = choose_best_value(col1, col2)
            unified_data.append(unified_value)

    # Escreve o arquivo de saída
    print(f"\nEscrevendo arquivo unificado: {output_file}")
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)

        # Cabeçalho unificado
        writer.writerow(["Nicho ou Público Alvo"])

        # Dados
        for value in unified_data:
            writer.writerow([value])

    # Mostra estatísticas
    print("\n=== Estatísticas ===")
    print(f"Total de linhas processadas: {stats['total']}")
    print(f"  - Ambas vazias: {stats['both_empty']}")
    print(f"  - Apenas coluna 1: {stats['only_col1']}")
    print(f"  - Apenas coluna 2: {stats['only_col2']}")
    print(f"  - Ambas iguais: {stats['both_equal']}")
    print(f"  - Ambas diferentes: {stats['both_different']}")
    print(f"\nArquivo salvo com sucesso!")

    # Se houve casos diferentes, lista alguns exemplos
    if stats['both_different'] > 0:
        print("\n=== Exemplos de valores diferentes (primeiros 5) ===")
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header

            count = 0
            for row in reader:
                if len(row) >= 2:
                    col1 = row[0].strip() if row[0] else ""
                    col2 = row[1].strip() if row[1] else ""

                    if col1 and col2 and normalize_text(col1) != normalize_text(col2):
                        chosen = choose_best_value(col1, col2)
                        print(f"\nLinha {count + 2}:")
                        print(f"  Coluna 1: {col1}")
                        print(f"  Coluna 2: {col2}")
                        print(f"  Escolhido: {chosen}")
                        count += 1

                        if count >= 5:
                            break


if __name__ == "__main__":
    input_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/kommo_export_leads_2025-08-13 - Página1.csv")
    output_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/kommo_export_leads_2025-08-13 - UNIFICADO.csv")

    if not input_file.exists():
        print(f"Erro: Arquivo não encontrado: {input_file}")
        sys.exit(1)

    unify_columns(input_file, output_file)

#!/usr/bin/env python3
"""
Script para remover linhas duplicadas de arquivo CSV.
Considera como duplicadas linhas com os mesmos valores em campos-chave.
"""

import csv
from pathlib import Path
from typing import List, Dict, Set, Tuple


def get_duplicate_key(row: Dict, key_fields: List[str]) -> str:
    """
    Gera uma chave única para identificar duplicatas.
    Usa os campos especificados para criar a chave.
    """
    # Normaliza os valores: remove espaços, converte para minúsculas
    values = []
    for field in key_fields:
        value = row.get(field, '').strip().lower()
        values.append(value)

    return '|'.join(values)


def remove_duplicates(
    input_file: Path,
    output_file: Path,
    key_fields: List[str] = None,
    keep_first: bool = True
):
    """
    Remove linhas duplicadas do arquivo CSV.

    Args:
        input_file: Arquivo de entrada
        output_file: Arquivo de saída
        key_fields: Campos usados para identificar duplicatas.
                   Se None, usa firstName, lastName, emailAddress
        keep_first: Se True, mantém a primeira ocorrência. Se False, mantém a última.
    """

    if key_fields is None:
        key_fields = ['firstName', 'lastName', 'emailAddress', 'contactPhone']

    print(f"Lendo arquivo: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

        # Lê todas as linhas
        rows = list(reader)

    print(f"Total de linhas: {len(rows)}")
    print(f"Campos usados para identificar duplicatas: {key_fields}")

    # Identifica e remove duplicatas
    seen_keys: Set[str] = set()
    unique_rows: List[Dict] = []
    duplicate_rows: List[Dict] = []

    # Estatísticas
    stats = {
        'total': len(rows),
        'unique': 0,
        'duplicates': 0,
        'empty_key': 0
    }

    for i, row in enumerate(rows):
        # Gera chave de duplicação
        key = get_duplicate_key(row, key_fields)

        # Se a chave está vazia (todos os campos são vazios), sempre mantém
        if not key or key == '|||' or key.replace('|', '') == '':
            stats['empty_key'] += 1
            unique_rows.append(row)
            continue

        # Verifica se já vimos essa chave
        if key in seen_keys:
            stats['duplicates'] += 1
            duplicate_rows.append(row)
            if not keep_first:
                # Se quiser manter a última, remove a anterior e adiciona a nova
                for j, unique_row in enumerate(unique_rows):
                    if get_duplicate_key(unique_row, key_fields) == key:
                        unique_rows[j] = row
                        break
        else:
            stats['unique'] += 1
            seen_keys.add(key)
            unique_rows.append(row)

    # Escreve arquivo de saída
    print(f"\nEscrevendo arquivo sem duplicatas: {output_file}")

    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique_rows)

    # Opcionalmente, salva arquivo com as duplicatas removidas
    duplicates_file = output_file.parent / f"{output_file.stem}.DUPLICATAS{output_file.suffix}"
    if duplicate_rows:
        print(f"Salvando duplicatas removidas: {duplicates_file}")
        with open(duplicates_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(duplicate_rows)

    # Mostra estatísticas
    print("\n=== Estatísticas ===")
    print(f"Total de linhas lidas: {stats['total']}")
    print(f"  - Linhas únicas: {stats['unique']}")
    print(f"  - Linhas duplicadas removidas: {stats['duplicates']}")
    print(f"  - Linhas com campos-chave vazios (mantidas): {stats['empty_key']}")
    print(f"  - Total de linhas no arquivo final: {len(unique_rows)}")
    print(f"\nArquivo salvo com sucesso!")

    # Mostra alguns exemplos de duplicatas
    if duplicate_rows:
        print("\n=== Exemplos de duplicatas removidas (primeiras 10) ===")
        for i, row in enumerate(duplicate_rows[:10]):
            key = get_duplicate_key(row, key_fields)
            print(f"{i+1}. {row.get('firstName', '')} {row.get('lastName', '')} - {row.get('emailAddress', '')} - {row.get('contactPhone', '')}")
            print(f"   Chave: {key}")


def analyze_duplicates(input_file: Path, key_fields: List[str] = None):
    """Analisa o arquivo para encontrar duplicatas sem removê-las."""

    if key_fields is None:
        key_fields = ['firstName', 'lastName', 'emailAddress', 'contactPhone']

    print(f"Analisando duplicatas em: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # Encontra duplicatas
    key_counts: Dict[str, List[Tuple[int, Dict]]] = {}

    for i, row in enumerate(rows):
        key = get_duplicate_key(row, key_fields)

        if not key or key == '|||' or key.replace('|', '') == '':
            continue

        if key not in key_counts:
            key_counts[key] = []
        key_counts[key].append((i + 2, row))  # +2 porque linha 1 é cabeçalho

    # Filtra apenas as que têm duplicatas
    duplicates = {k: v for k, v in key_counts.items() if len(v) > 1}

    print(f"\nTotal de linhas: {len(rows)}")
    print(f"Grupos com duplicatas: {len(duplicates)}")
    print(f"Total de linhas duplicadas: {sum(len(v) - 1 for v in duplicates.values())}")

    if duplicates:
        print("\n=== Exemplos de grupos duplicados (primeiros 5) ===")
        for i, (key, occurrences) in enumerate(list(duplicates.items())[:5]):
            print(f"\nGrupo {i+1}: {len(occurrences)} ocorrências")
            for line_num, row in occurrences:
                print(f"  Linha {line_num}: {row.get('firstName', '')} {row.get('lastName', '')} - {row.get('emailAddress', '')} - {row.get('contactPhone', '')}")


if __name__ == "__main__":
    input_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/Listas  - Página2 (1).csv")
    output_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/Listas  - Página2 (1).SEM_DUPLICATAS.csv")

    if not input_file.exists():
        print(f"Erro: Arquivo não encontrado: {input_file}")
        exit(1)

    # Primeiro, analisa para mostrar o que será removido
    print("="*60)
    print("ANÁLISE DE DUPLICATAS")
    print("="*60)
    analyze_duplicates(input_file)

    print("\n" + "="*60)
    print("REMOÇÃO DE DUPLICATAS")
    print("="*60)

    # Remove duplicatas (mantém a primeira ocorrência)
    remove_duplicates(input_file, output_file, keep_first=True)

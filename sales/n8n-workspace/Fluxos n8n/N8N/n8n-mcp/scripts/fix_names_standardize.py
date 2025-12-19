#!/usr/bin/env python3
"""
Script para padronizar nomes e ajustar cabeçalhos de colunas.
- Normaliza capitalização (Title Case)
- Remove emojis e caracteres especiais
- Separa nome e sobrenome
- Ajusta nomes das colunas
"""

import csv
import re
import unicodedata
from pathlib import Path


def remove_emojis_and_special_chars(text: str) -> str:
    """Remove emojis e caracteres especiais, mantendo apenas letras e espaços."""
    # Remove emojis
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "\U0001F900-\U0001F9FF"  # supplemental symbols
        "\U0001FA00-\U0001FAFF"  # chess symbols
        "]+",
        flags=re.UNICODE
    )
    text = emoji_pattern.sub('', text)

    # Remove caracteres matemáticos especiais (como 𝘔𝘈𝘙𝘊𝘌𝘓𝘖)
    normalized = unicodedata.normalize('NFKD', text)
    text = ''.join([c for c in normalized if not unicodedata.combining(c)])

    # Remove caracteres especiais, mantendo apenas letras, números, espaços e hífens
    text = re.sub(r'[^\w\s\-\']', '', text, flags=re.UNICODE)

    # Remove espaços múltiplos
    text = ' '.join(text.split())

    return text.strip()


def remove_titles_and_descriptions(text: str) -> str:
    """Remove títulos profissionais e descrições."""
    # Remove tudo após | (pipe) - sempre pega apenas o que está antes
    if '|' in text:
        text = text.split('|')[0].strip()

    # Se houver "-", verifica se o que vem depois parece ser um nome próprio
    if '-' in text:
        # Busca padrão "Nome Sobrenome" após o hífen
        match = re.search(r'-\s*([A-ZÀÁÂÃÉÊÍÓÔÕÚ][a-zàáâãéêíóôõúç]+(?:\s+[A-ZÀÁÂÃÉÊÍÓÔÕÚ][a-zàáâãéêíóôõúç]+)+)', text)
        if match:
            # Se encontrou um nome após o hífen, usa apenas esse nome
            text = match.group(1)
        else:
            # Caso contrário, remove tudo após o hífen
            text = text.split('-')[0].strip()

    # Remove títulos profissionais do início
    titles = [
        r'^Dra?\.\s*', r'^Dra\s+', r'^Dr\s+',
        r'^Prof\.?\s*', r'^Professor\s+', r'^Professora\s+',
        r'^Sr\.?\s*', r'^Sra\.?\s*',
    ]

    for title in titles:
        text = re.sub(title, '', text, flags=re.IGNORECASE)

    # Remove palavras descritivas comuns
    descriptive_words = [
        r'\s+Terapeuta.*$',
        r'\s+Hipnoterapeuta.*$',
        r'\s+Coach.*$',
        r'\s+Consultoria.*$',
        r'\s+Cosmeticos.*$',
    ]

    for desc in descriptive_words:
        text = re.sub(desc, '', text, flags=re.IGNORECASE)

    return text.strip()


def capitalize_name(text: str) -> str:
    """
    Capitaliza nomes corretamente.
    - Primeira letra de cada palavra em maiúscula
    - Exceções: de, da, do, das, dos, e mantém minúsculas
    """
    if not text:
        return ""

    words = text.split()
    capitalized = []

    # Preposições que devem ficar em minúscula (exceto se forem a primeira palavra)
    lowercase_words = {'de', 'da', 'do', 'das', 'dos', 'e'}

    for i, word in enumerate(words):
        word = word.lower()
        # Se for a primeira palavra ou não for uma preposição, capitaliza
        if i == 0 or word not in lowercase_words:
            capitalized.append(word.capitalize())
        else:
            capitalized.append(word)

    return ' '.join(capitalized)


def split_name(full_name: str) -> tuple[str, str]:
    """
    Divide nome completo em nome e sobrenome.
    Retorna (nome, sobrenome).
    """
    if not full_name:
        return ("", "")

    # Remove emojis primeiro
    full_name = remove_emojis_and_special_chars(full_name)

    # Remove títulos e descrições
    full_name = remove_titles_and_descriptions(full_name)

    if not full_name:
        return ("", "")

    # Remove espaços extras que podem ter ficado
    full_name = ' '.join(full_name.split())

    # Verifica se ainda há palavras em CAPS ou descritivas no final
    # Remove palavras suspeitas (como O, Segredo, Esta, Na, Mente)
    words = full_name.split()
    # Mantém apenas as primeiras palavras que parecem nomes
    clean_words = []
    for i, word in enumerate(words):
        # Se a palavra é muito curta (1 letra) e não é a primeira, para
        if len(word) == 1 and i > 0 and word.upper() == word:
            break
        # Se encontrou palavra comum (artigos, etc) em posição estranha, para
        if i > 2 and word.lower() in ['o', 'a', 'e', 'da', 'do', 'na', 'no']:
            break
        clean_words.append(word)

    full_name = ' '.join(clean_words)

    if not full_name:
        return ("", "")

    # Capitaliza após limpeza
    full_name = capitalize_name(full_name)

    # Separa em palavras
    parts = full_name.split()

    if len(parts) == 0:
        return ("", "")
    elif len(parts) == 1:
        return (parts[0], "")
    elif len(parts) == 2:
        # Caso ideal: nome e sobrenome
        return (parts[0], parts[1])
    else:
        # Mais de 2 partes: primeiro nome + resto como sobrenome
        # Mas se for algo como "V I V E R", pega apenas as 2 primeiras letras
        if all(len(p) == 1 for p in parts[:3]):
            # Nomes de uma letra cada (provavelmente não é nome real)
            # Pega primeiro e segundo
            return (parts[0], parts[1])
        else:
            nome = parts[0]
            sobrenome = ' '.join(parts[1:])
            return (nome, sobrenome)


def standardize_names(input_file: Path, output_file: Path):
    """Padroniza os nomes e ajusta as colunas."""

    print(f"Lendo arquivo: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        # Lê todas as linhas
        rows = list(reader)
        original_fieldnames = reader.fieldnames

    print(f"Total de linhas: {len(rows)}")
    print(f"Colunas originais: {original_fieldnames}")

    # Processa as linhas
    processed_rows = []
    stats = {
        'total': 0,
        'processed': 0,
        'empty': 0,
        'errors': 0
    }

    for row in rows:
        stats['total'] += 1

        try:
            # Pega o nome completo da coluna "1Nome"
            full_name = row.get('1Nome', '').strip()

            if not full_name:
                stats['empty'] += 1
                nome = ""
                sobrenome = ""
            else:
                stats['processed'] += 1
                nome, sobrenome = split_name(full_name)

            # Cria nova linha com colunas ajustadas
            new_row = {
                'nome': nome,
                'sobrenome': sobrenome,
                'nome_completo': full_name,  # Mantém o original para referência
                'Email': row.get('Email', ''),
                'Telefone': row.get('Telefone', '')
            }

            processed_rows.append(new_row)

        except Exception as e:
            stats['errors'] += 1
            print(f"Erro ao processar linha {stats['total']}: {e}")
            print(f"  Dados: {row}")
            # Adiciona linha vazia em caso de erro
            processed_rows.append({
                'nome': '',
                'sobrenome': '',
                'nome_completo': '',
                'Email': row.get('Email', ''),
                'Telefone': row.get('Telefone', '')
            })

    # Escreve o arquivo de saída
    print(f"\nEscrevendo arquivo padronizado: {output_file}")

    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        fieldnames = ['nome', 'sobrenome', 'nome_completo', 'Email', 'Telefone']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(processed_rows)

    # Mostra estatísticas
    print("\n=== Estatísticas ===")
    print(f"Total de linhas processadas: {stats['total']}")
    print(f"  - Nomes processados: {stats['processed']}")
    print(f"  - Nomes vazios: {stats['empty']}")
    print(f"  - Erros: {stats['errors']}")
    print(f"\nArquivo salvo com sucesso!")

    # Mostra alguns exemplos
    print("\n=== Exemplos de nomes processados (primeiros 20) ===")
    for i, row in enumerate(processed_rows[:20]):
        if row['nome'] or row['sobrenome']:
            print(f"{i+1}. Original: {row['nome_completo']}")
            print(f"   → Nome: {row['nome']}, Sobrenome: {row['sobrenome']}")


if __name__ == "__main__":
    input_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/1. TERAPEUTA - 2. HIPNO TOTAL.xlsx - Página1.cleaned.csv")
    output_file = Path("/Users/marcosdaniels/Downloads/Lead Generation/1. TERAPEUTA - 2. HIPNO TOTAL.xlsx - Página1.PADRONIZADO.csv")

    if not input_file.exists():
        print(f"Erro: Arquivo não encontrado: {input_file}")
        exit(1)

    standardize_names(input_file, output_file)

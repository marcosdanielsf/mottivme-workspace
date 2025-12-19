#!/usr/bin/env python3
import json
import csv
import re


def clean_phone(phone):
    """Remove ':' and anything after it from phone numbers."""
    if not phone:
        return None

    # Remove ':' and anything after it
    phone = phone.split(':')[0]

    # Basic validation - must be digits and reasonable length
    if not phone.isdigit() or len(phone) < 10:
        return None

    return phone


def clean_name(name):
    """Clean and standardize name by removing special characters and usernames."""
    if not name:
        return None

    # Remove @ mentions and usernames (e.g., "@resouza")
    name = re.sub(r'@\w+', '', name)

    # Remove special characters but keep spaces and hyphens
    name = re.sub(r'[^a-zA-ZÀ-ÿ\s\-]', '', name)

    # Remove extra spaces
    name = ' '.join(name.split())

    # Trim whitespace
    name = name.strip()

    return name if name else None


def is_generic_commercial_name(name):
    """Check if name is a generic commercial/business name."""
    if not name:
        return True

    name_lower = name.lower()

    # List of generic commercial terms and patterns
    commercial_terms = [
        'comercial', 'vendas', 'atendimento', 'suporte',
        'service', 'serviço', 'empresa', 'company',
        'negócio', 'business', 'loja', 'store',
        'delivery', 'entrega', 'oficina', 'workshop',
        'cleaning', 'claenig', 'bem estar',
        'salao', 'salon', 'beauty', 'beleza',
        'painting', 'remodeling', 'reform', 'construção',
        'pintura', 'engenharia', 'arquitetura',
        'equipe', 'team', 'corretora', 'corretor',
        'realtor', 'agente', 'agent',
        'pilates', 'yoga', 'fitness', 'academia',
        'delicious', 'food', 'restaurant', 'restaurante',
        'cafe', 'coffee', 'bar', 'grill',
        'doula', 'terapeuta', 'therapist', 'clinica',
        'clinic', 'studio', 'estudio', 'amor', 'love',
        'transforma', 'transform', 'vida', 'life'
    ]

    # Check if name contains any commercial term
    for term in commercial_terms:
        if term in name_lower:
            return True

    # Check if name is too short (likely not a real person name)
    if len(name.split()) == 1 and len(name) < 3:
        return True

    # Check for patterns like "JKC" (all uppercase abbreviations)
    words = name.split()
    if len(words) > 0 and words[0].isupper() and len(words[0]) <= 4:
        return True

    return False


def split_name(full_name):
    """Split full name into first name and last name."""
    if not full_name:
        return None, None

    # Title case the name
    full_name = full_name.title()

    parts = full_name.split()

    if len(parts) == 0:
        return None, None
    elif len(parts) == 1:
        return parts[0], ""
    else:
        primeiro_nome = parts[0]
        sobrenome = ' '.join(parts[1:])
        return primeiro_nome, sobrenome


def organize_contacts(input_file, output_file):
    """Read JSON contacts, clean data, and export to CSV."""

    # Read JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        contacts = json.load(f)

    # Process contacts
    organized_contacts = []

    for contact in contacts:
        # Use PushName as source (FullName is empty)
        push_name = contact.get('PushName', '').strip()
        phone = contact.get('Phone', '').strip()

        # Clean phone
        clean_phone_num = clean_phone(phone)
        if not clean_phone_num:
            continue

        # Clean name
        cleaned_name = clean_name(push_name)
        if not cleaned_name:
            continue

        # Skip generic commercial names
        if is_generic_commercial_name(cleaned_name):
            continue

        # Split into first and last name
        primeiro_nome, sobrenome = split_name(cleaned_name)
        if not primeiro_nome:
            continue

        # Build full name
        nome_completo = f"{primeiro_nome} {sobrenome}".strip()

        # Add to organized list
        organized_contacts.append({
            'primeiro_nome': primeiro_nome,
            'sobrenome': sobrenome,
            'nome_completo': nome_completo,
            'telefone': clean_phone_num
        })

    # Remove duplicates based on phone number (keep first occurrence)
    seen_phones = set()
    unique_contacts = []
    for contact in organized_contacts:
        if contact['telefone'] not in seen_phones:
            seen_phones.add(contact['telefone'])
            unique_contacts.append(contact)

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['primeiro_nome', 'sobrenome', 'nome_completo', 'telefone']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(unique_contacts)

    print(f"Processed {len(contacts)} contacts")
    print(f"Exported {len(unique_contacts)} valid contacts to {output_file}")


if __name__ == '__main__':
    input_file = '/Users/marcosdaniels/n8n-mcp/contacts.json'
    output_file = '/Users/marcosdaniels/n8n-mcp/contacts_organized.csv'

    organize_contacts(input_file, output_file)

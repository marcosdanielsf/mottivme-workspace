#!/usr/bin/env python3
"""
Lead Enrichment - Descobrir LinkedIn e Instagram a partir de Email/Nome

✅ MÉTODOS LEGAIS:
1. APIs de enriquecimento (Apollo.io, Hunter.io, Clearbit)
2. Google Search programático (SerpAPI, ScraperAPI)
3. Apify (como no seu workflow)
4. Busca reversa de email

FERRAMENTAS RECOMENDADAS:
- Apollo.io: Melhor para LinkedIn ($49/mês)
- Hunter.io: Melhor para email ($49/mês)
- SerpAPI: Google search ($50/mês)
- Apify: Scraping gerenciado (pay-per-use)
- Clearbit: Enriquecimento completo ($99/mês)
"""

import requests
import csv
import json
from pathlib import Path
from typing import Dict, List, Optional
import time


class LeadEnricher:
    """Enriquece leads com LinkedIn e Instagram usando APIs legais."""

    def __init__(self):
        """Inicializa o enriquecedor com suas chaves de API."""
        # Configure suas chaves de API aqui
        self.apollo_key = None
        self.hunter_key = None
        self.serpapi_key = None
        self.apify_key = None
        self.clearbit_key = None

    # ==================== APOLLO.IO ====================
    # Melhor para encontrar LinkedIn profiles

    def find_linkedin_apollo(self, email: str = None, name: str = None) -> Optional[Dict]:
        """
        Busca LinkedIn usando Apollo.io (RECOMENDADO).

        Preço: $49/mês (10k créditos)
        Precisão: ~90%

        Args:
            email: Email do lead
            name: Nome completo do lead

        Returns:
            Dict com LinkedIn URL e outros dados
        """
        if not self.apollo_key:
            print("⚠️  Configure APOLLO_API_KEY")
            return None

        url = "https://api.apollo.io/v1/people/match"

        headers = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
            'X-Api-Key': self.apollo_key
        }

        # Monta payload baseado nos dados disponíveis
        data = {}
        if email:
            data['email'] = email
        if name:
            # Separa nome e sobrenome
            parts = name.split(maxsplit=1)
            data['first_name'] = parts[0] if len(parts) > 0 else ''
            data['last_name'] = parts[1] if len(parts) > 1 else ''

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()

            result = response.json()

            if result.get('person'):
                person = result['person']
                return {
                    'linkedin_url': person.get('linkedin_url'),
                    'name': person.get('name'),
                    'title': person.get('title'),
                    'company': person.get('organization', {}).get('name'),
                    'email': person.get('email'),
                    'phone': person.get('phone_numbers', [{}])[0].get('raw_number'),
                    'twitter': person.get('twitter_url'),
                    'facebook': person.get('facebook_url')
                }

            return None

        except Exception as e:
            print(f"❌ Erro Apollo: {e}")
            return None

    # ==================== HUNTER.IO ====================
    # Melhor para verificação de email e descobrir domínio

    def find_linkedin_hunter(self, email: str) -> Optional[Dict]:
        """
        Busca informações usando Hunter.io.

        Preço: $49/mês (1k buscas)
        Precisão: ~85%

        Args:
            email: Email do lead

        Returns:
            Dict com dados do lead
        """
        if not self.hunter_key:
            print("⚠️  Configure HUNTER_API_KEY")
            return None

        url = f"https://api.hunter.io/v2/email-finder"

        params = {
            'email': email,
            'api_key': self.hunter_key
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()

            result = response.json()

            if result.get('data'):
                data = result['data']
                return {
                    'first_name': data.get('first_name'),
                    'last_name': data.get('last_name'),
                    'position': data.get('position'),
                    'company': data.get('company'),
                    'linkedin': data.get('linkedin'),  # Às vezes retorna
                    'twitter': data.get('twitter'),
                    'phone': data.get('phone_number')
                }

            return None

        except Exception as e:
            print(f"❌ Erro Hunter: {e}")
            return None

    # ==================== SERPAPI ====================
    # Google Search programático para encontrar profiles

    def find_social_serpapi(self, name: str, email: str = None) -> Dict:
        """
        Busca LinkedIn e Instagram via Google Search (SerpAPI).

        Preço: $50/mês (5k buscas)
        Precisão: ~70-80%

        Args:
            name: Nome da pessoa
            email: Email (opcional, melhora precisão)

        Returns:
            Dict com URLs encontradas
        """
        if not self.serpapi_key:
            print("⚠️  Configure SERPAPI_KEY")
            return {}

        results = {
            'linkedin': None,
            'instagram': None,
            'facebook': None,
            'twitter': None
        }

        # Busca LinkedIn
        linkedin_query = f"{name} site:linkedin.com/in/"
        if email:
            linkedin_query += f" {email}"

        linkedin_results = self._serpapi_search(linkedin_query)
        if linkedin_results:
            results['linkedin'] = linkedin_results[0].get('link')

        # Busca Instagram
        instagram_query = f"{name} site:instagram.com"
        if email:
            # Remove domínio do email para buscar username
            username = email.split('@')[0]
            instagram_query = f"{name} OR {username} site:instagram.com"

        instagram_results = self._serpapi_search(instagram_query)
        if instagram_results:
            results['instagram'] = instagram_results[0].get('link')

        return results

    def _serpapi_search(self, query: str, num_results: int = 3) -> List[Dict]:
        """Executa busca no Google via SerpAPI."""
        url = "https://serpapi.com/search"

        params = {
            'q': query,
            'api_key': self.serpapi_key,
            'num': num_results
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()

            result = response.json()
            return result.get('organic_results', [])

        except Exception as e:
            print(f"❌ Erro SerpAPI: {e}")
            return []

    # ==================== APIFY ====================
    # Igual ao seu workflow n8n

    def find_linkedin_apify(self, profile_url: str) -> Optional[Dict]:
        """
        Scrape perfil LinkedIn usando Apify (como no seu workflow).

        Preço: $10 per 1k profiles
        Precisão: ~95%

        Args:
            profile_url: URL do perfil LinkedIn

        Returns:
            Dict com dados completos do perfil
        """
        if not self.apify_key:
            print("⚠️  Configure APIFY_KEY")
            return None

        url = f"https://api.apify.com/v2/acts/dev_fusion~linkedin-profile-scraper/run-sync-get-dataset-items?token={self.apify_key}"

        payload = {
            "profileUrls": [profile_url]
        }

        try:
            response = requests.post(
                url,
                json=payload,
                timeout=300  # 5 minutos
            )
            response.raise_for_status()

            results = response.json()

            if results and len(results) > 0:
                return results[0]

            return None

        except Exception as e:
            print(f"❌ Erro Apify: {e}")
            return None

    # ==================== CLEARBIT ====================
    # Enriquecimento completo

    def enrich_clearbit(self, email: str) -> Optional[Dict]:
        """
        Enriquecimento completo usando Clearbit.

        Preço: $99/mês (2.5k pesquisas)
        Precisão: ~90%

        Args:
            email: Email do lead

        Returns:
            Dict com todos os dados sociais
        """
        if not self.clearbit_key:
            print("⚠️  Configure CLEARBIT_KEY")
            return None

        url = f"https://person.clearbit.com/v2/combined/find?email={email}"

        headers = {
            'Authorization': f'Bearer {self.clearbit_key}'
        }

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()
            person = data.get('person', {})

            return {
                'linkedin': person.get('linkedin', {}).get('handle'),
                'twitter': person.get('twitter', {}).get('handle'),
                'facebook': person.get('facebook', {}).get('handle'),
                'github': person.get('github', {}).get('handle'),
                'name': person.get('name', {}).get('fullName'),
                'title': person.get('employment', {}).get('title'),
                'company': person.get('employment', {}).get('name')
            }

        except Exception as e:
            print(f"❌ Erro Clearbit: {e}")
            return None

    # ==================== MÉTODO SIMPLES ====================
    # Busca reversa de email gratuita

    def find_instagram_by_email_simple(self, email: str) -> Optional[str]:
        """
        Tenta encontrar Instagram usando busca reversa simples.

        GRÁTIS mas menos preciso (~30-40%)

        Estratégia:
        1. Tenta username do email
        2. Verifica se perfil existe
        """
        # Extrai username do email
        username = email.split('@')[0]

        # Tenta variações comuns
        possible_usernames = [
            username,
            username.replace('.', ''),
            username.replace('_', ''),
            f"{username}_oficial",
            f"{username}oficial"
        ]

        for user in possible_usernames:
            instagram_url = f"https://www.instagram.com/{user}/"

            try:
                # Faz HEAD request para verificar se existe
                response = requests.head(instagram_url, timeout=5)

                if response.status_code == 200:
                    print(f"✅ Instagram encontrado: {instagram_url}")
                    return instagram_url

            except:
                continue

        return None

    # ==================== PROCESSAMENTO EM LOTE ====================

    def enrich_csv(
        self,
        input_file: Path,
        output_file: Path,
        method: str = 'apollo'
    ):
        """
        Enriquece arquivo CSV com LinkedIn e Instagram.

        Args:
            input_file: CSV com colunas: name, email, phone
            output_file: CSV enriquecido
            method: 'apollo', 'hunter', 'serpapi', 'clearbit', 'all'
        """
        print(f"\n📊 Processando: {input_file}")
        print(f"Método: {method}\n")

        # Lê CSV
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            leads = list(reader)

        print(f"Total de leads: {len(leads)}")

        # Processa cada lead
        enriched_leads = []
        for i, lead in enumerate(leads, 1):
            print(f"\n[{i}/{len(leads)}] Processando: {lead.get('name', 'N/A')}")

            enriched_data = lead.copy()

            # Busca LinkedIn
            if method == 'apollo':
                data = self.find_linkedin_apollo(
                    email=lead.get('email'),
                    name=lead.get('name')
                )
                if data:
                    enriched_data['linkedin_url'] = data.get('linkedin_url')

            elif method == 'serpapi':
                data = self.find_social_serpapi(
                    name=lead.get('name'),
                    email=lead.get('email')
                )
                enriched_data['linkedin_url'] = data.get('linkedin')
                enriched_data['instagram_url'] = data.get('instagram')

            elif method == 'clearbit':
                data = self.enrich_clearbit(lead.get('email'))
                if data:
                    enriched_data['linkedin_url'] = data.get('linkedin')
                    enriched_data['twitter_url'] = data.get('twitter')
                    enriched_data['facebook_url'] = data.get('facebook')

            # Busca Instagram (método simples)
            if not enriched_data.get('instagram_url'):
                instagram = self.find_instagram_by_email_simple(lead.get('email'))
                if instagram:
                    enriched_data['instagram_url'] = instagram

            enriched_leads.append(enriched_data)

            # Rate limiting
            time.sleep(1)

        # Salva CSV enriquecido
        if enriched_leads:
            fieldnames = enriched_leads[0].keys()
            with open(output_file, 'w', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(enriched_leads)

            print(f"\n✅ {len(enriched_leads)} leads enriquecidos salvos em: {output_file}")


def main():
    """Exemplo de uso."""

    print("="*70)
    print("LEAD ENRICHMENT - LinkedIn & Instagram")
    print("="*70)
    print()

    # Configuração
    enricher = LeadEnricher()

    # Configure suas chaves de API
    print("Configure suas chaves de API:")
    print("1. Apollo.io: https://www.apollo.io/")
    print("2. Hunter.io: https://hunter.io/")
    print("3. SerpAPI: https://serpapi.com/")
    print("4. Clearbit: https://clearbit.com/")
    print()

    # Para testar com um único lead
    test_email = input("Email para testar (ou Enter para pular): ")

    if test_email:
        print("\n🔍 Buscando informações...")

        # Método simples (gratuito)
        instagram = enricher.find_instagram_by_email_simple(test_email)
        if instagram:
            print(f"Instagram: {instagram}")

        print("\n⚠️  Para buscar LinkedIn, configure as chaves de API acima")

    # Para processar CSV em lote
    process_csv = input("\nProcessar arquivo CSV? (s/n): ")

    if process_csv.lower() == 's':
        input_file = Path(input("Caminho do CSV de entrada: "))
        output_file = Path(input("Caminho do CSV de saída: "))

        enricher.enrich_csv(input_file, output_file, method='apollo')


if __name__ == "__main__":
    main()

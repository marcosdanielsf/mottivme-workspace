#!/usr/bin/env python3
"""
✅ LinkedIn API - Forma LEGAL e OFICIAL

Este script mostra como usar a API oficial do LinkedIn de forma correta e legal.

VANTAGENS:
✅ 100% legal e aprovado pelo LinkedIn
✅ Sem risco de bloqueio de conta
✅ Dados confiáveis e estruturados
✅ Suporte oficial

REQUISITOS:
1. Criar um App no LinkedIn Developers
2. Obter Client ID e Client Secret
3. Configurar OAuth 2.0
4. Respeitar rate limits

LINKS:
- Criar App: https://www.linkedin.com/developers/apps
- Documentação: https://learn.microsoft.com/en-us/linkedin/
- Rate Limits: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits
"""

import requests
import json
from typing import Dict, List, Optional
from pathlib import Path
import webbrowser
from urllib.parse import urlencode


class LinkedInAPIClient:
    """
    Cliente oficial para LinkedIn API v2.

    Documentação: https://learn.microsoft.com/en-us/linkedin/
    """

    def __init__(self, client_id: str, client_secret: str, redirect_uri: str):
        """
        Inicializa o cliente da API.

        Args:
            client_id: Client ID do seu app LinkedIn
            client_secret: Client Secret do seu app
            redirect_uri: URL de redirecionamento configurada
        """
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.access_token = None

        # Endpoints oficiais
        self.auth_url = 'https://www.linkedin.com/oauth/v2/authorization'
        self.token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
        self.api_base = 'https://api.linkedin.com/v2'

    def get_authorization_url(self, scopes: List[str]) -> str:
        """
        Gera URL para autorização OAuth 2.0.

        Args:
            scopes: Lista de permissões necessárias
                   Ex: ['r_liteprofile', 'r_emailaddress', 'w_member_social']

        Returns:
            URL para autorização
        """
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'scope': ' '.join(scopes),
            'state': 'random_string_for_security'  # Use um valor aleatório real
        }

        auth_url = f"{self.auth_url}?{urlencode(params)}"
        print(f"\n✅ Abra esta URL no navegador para autorizar:")
        print(auth_url)
        print()

        return auth_url

    def exchange_code_for_token(self, authorization_code: str) -> bool:
        """
        Troca o código de autorização por um access token.

        Args:
            authorization_code: Código recebido após autorização

        Returns:
            True se bem-sucedido
        """
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': self.redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        }

        try:
            response = requests.post(self.token_url, data=data)
            response.raise_for_status()

            token_data = response.json()
            self.access_token = token_data['access_token']

            print("✅ Access token obtido com sucesso!")
            print(f"Expira em: {token_data.get('expires_in', 'N/A')} segundos")

            return True

        except Exception as e:
            print(f"❌ Erro ao obter token: {e}")
            return False

    def get_profile(self) -> Optional[Dict]:
        """
        Obtém perfil do usuário autenticado.

        Returns:
            Dados do perfil ou None
        """
        if not self.access_token:
            print("❌ Faça login primeiro!")
            return None

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'cache-control': 'no-cache',
            'X-Restli-Protocol-Version': '2.0.0'
        }

        try:
            # Endpoint para perfil básico
            response = requests.get(
                f"{self.api_base}/me",
                headers=headers
            )
            response.raise_for_status()

            profile = response.json()
            print(f"✅ Perfil obtido: {profile.get('localizedFirstName', 'N/A')}")

            return profile

        except Exception as e:
            print(f"❌ Erro ao obter perfil: {e}")
            return None

    def search_companies(self, keywords: str) -> List[Dict]:
        """
        Busca empresas (requer permissões adequadas).

        Args:
            keywords: Palavras-chave para busca

        Returns:
            Lista de empresas encontradas
        """
        if not self.access_token:
            print("❌ Faça login primeiro!")
            return []

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'X-Restli-Protocol-Version': '2.0.0'
        }

        try:
            # Nota: Este endpoint pode requerer permissões especiais
            response = requests.get(
                f"{self.api_base}/organizations",
                headers=headers,
                params={'q': 'search', 'keywords': keywords}
            )
            response.raise_for_status()

            companies = response.json().get('elements', [])
            print(f"✅ Encontradas {len(companies)} empresas")

            return companies

        except Exception as e:
            print(f"❌ Erro na busca: {e}")
            return []

    def share_post(self, text: str, visibility: str = 'PUBLIC') -> bool:
        """
        Compartilha um post no LinkedIn.

        Args:
            text: Texto do post
            visibility: 'PUBLIC' ou 'CONNECTIONS'

        Returns:
            True se bem-sucedido
        """
        if not self.access_token:
            print("❌ Faça login primeiro!")
            return False

        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }

        # Primeiro, obter o ID do perfil
        profile = self.get_profile()
        if not profile:
            return False

        person_urn = f"urn:li:person:{profile['id']}"

        # Dados do post
        post_data = {
            'author': person_urn,
            'lifecycleState': 'PUBLISHED',
            'specificContent': {
                'com.linkedin.ugc.ShareContent': {
                    'shareCommentary': {
                        'text': text
                    },
                    'shareMediaCategory': 'NONE'
                }
            },
            'visibility': {
                'com.linkedin.ugc.MemberNetworkVisibility': visibility
            }
        }

        try:
            response = requests.post(
                f"{self.api_base}/ugcPosts",
                headers=headers,
                json=post_data
            )
            response.raise_for_status()

            print("✅ Post compartilhado com sucesso!")
            return True

        except Exception as e:
            print(f"❌ Erro ao compartilhar post: {e}")
            return False


def setup_linkedin_app():
    """
    Guia para configurar um app LinkedIn.
    """
    print("="*70)
    print("CONFIGURAÇÃO DE APP LINKEDIN")
    print("="*70)
    print()
    print("Passo 1: Criar App")
    print("  1. Acesse: https://www.linkedin.com/developers/apps")
    print("  2. Clique em 'Create app'")
    print("  3. Preencha os dados da aplicação")
    print()
    print("Passo 2: Configurar OAuth 2.0")
    print("  1. Na aba 'Auth', adicione 'Redirect URLs'")
    print("  2. Exemplo: http://localhost:8000/callback")
    print("  3. Copie o 'Client ID' e 'Client Secret'")
    print()
    print("Passo 3: Selecionar Produtos")
    print("  1. Na aba 'Products', solicite acesso aos produtos:")
    print("     - Sign In with LinkedIn")
    print("     - Share on LinkedIn")
    print("     - Marketing Developer Platform (para anúncios)")
    print()
    print("Passo 4: Aguardar Aprovação")
    print("  - Pode levar alguns dias")
    print("  - Você receberá email de confirmação")
    print()
    print("="*70)


def example_usage():
    """
    Exemplo de uso da API oficial.
    """
    print("\n" + "="*70)
    print("EXEMPLO DE USO - LINKEDIN API OFICIAL")
    print("="*70)
    print()

    # Configurações (SUBSTITUA com seus valores reais)
    CLIENT_ID = 'seu_client_id_aqui'
    CLIENT_SECRET = 'seu_client_secret_aqui'
    REDIRECT_URI = 'http://localhost:8000/callback'

    # Verificar se as credenciais foram configuradas
    if CLIENT_ID == 'seu_client_id_aqui':
        print("⚠️  Configure suas credenciais primeiro!")
        print()
        setup_linkedin_app()
        return

    # Inicializar cliente
    client = LinkedInAPIClient(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

    # Passo 1: Obter URL de autorização
    scopes = ['r_liteprofile', 'r_emailaddress', 'w_member_social']
    auth_url = client.get_authorization_url(scopes)

    # Passo 2: Usuário autoriza no navegador
    print("Após autorizar, você será redirecionado para:")
    print(f"{REDIRECT_URI}?code=AUTHORIZATION_CODE&state=...")
    print()
    authorization_code = input("Cole o código de autorização aqui: ")

    # Passo 3: Trocar código por token
    if not client.exchange_code_for_token(authorization_code):
        print("❌ Falha na autenticação")
        return

    # Passo 4: Usar a API
    print("\n" + "-"*70)
    print("EXEMPLOS DE USO")
    print("-"*70)

    # Obter perfil
    profile = client.get_profile()
    if profile:
        print(f"\n👤 Perfil: {profile.get('localizedFirstName', '')} "
              f"{profile.get('localizedLastName', '')}")

    # Compartilhar post
    post_text = "Testando a API oficial do LinkedIn! 🚀"
    client.share_post(post_text)


def alternative_tools():
    """
    Lista de ferramentas alternativas legais.
    """
    print("\n" + "="*70)
    print("ALTERNATIVAS LEGAIS PARA LEAD GENERATION")
    print("="*70)
    print()

    alternatives = [
        {
            'name': 'Apollo.io',
            'url': 'https://www.apollo.io/',
            'price': 'Gratuito (50 créditos) ou $49/mês',
            'features': ['250M+ contatos', 'Verificação de email', 'API completa']
        },
        {
            'name': 'Hunter.io',
            'url': 'https://hunter.io/',
            'price': 'Gratuito (25 buscas) ou $49/mês',
            'features': ['Email finder', 'Email verifier', 'Domain search']
        },
        {
            'name': 'Lusha',
            'url': 'https://www.lusha.com/',
            'price': 'Gratuito (5 créditos) ou $29/mês',
            'features': ['Telefones diretos', 'Emails B2B', 'Chrome extension']
        },
        {
            'name': 'LinkedIn Sales Navigator',
            'url': 'https://business.linkedin.com/sales-solutions',
            'price': '$79-$135/mês',
            'features': ['Ferramenta oficial', 'Filtros avançados', 'InMail']
        }
    ]

    for alt in alternatives:
        print(f"\n📌 {alt['name']}")
        print(f"   URL: {alt['url']}")
        print(f"   Preço: {alt['price']}")
        print(f"   Recursos:")
        for feature in alt['features']:
            print(f"   - {feature}")

    print("\n" + "="*70)


if __name__ == "__main__":
    print("\n🎯 LinkedIn API - Guia de Uso Legal\n")

    choice = input(
        "Escolha uma opção:\n"
        "1 - Ver guia de configuração\n"
        "2 - Exemplo de uso da API\n"
        "3 - Ver alternativas legais\n"
        "\nOpção: "
    )

    if choice == '1':
        setup_linkedin_app()
    elif choice == '2':
        example_usage()
    elif choice == '3':
        alternative_tools()
    else:
        print("Opção inválida!")

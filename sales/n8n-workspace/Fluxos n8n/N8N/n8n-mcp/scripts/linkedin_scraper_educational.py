#!/usr/bin/env python3
"""
⚠️ AVISO LEGAL E ÉTICO IMPORTANTE ⚠️

Este script é fornecido APENAS para fins EDUCACIONAIS.

RISCOS E CONSEQUÊNCIAS:
1. Viola os Termos de Serviço do LinkedIn
2. Pode resultar em BLOQUEIO PERMANENTE da sua conta
3. Pode resultar em AÇÕES LEGAIS do LinkedIn
4. Viola leis de proteção de dados (GDPR, LGPD)
5. É considerado acesso não autorizado a sistemas

ALTERNATIVAS LEGAIS RECOMENDADAS:
1. LinkedIn API Oficial: https://developer.linkedin.com/
2. LinkedIn Sales Navigator (ferramenta oficial paga)
3. Serviços legais de dados: Apollo.io, Hunter.io, Lusha, ZoomInfo
4. Phantombuster, Dux-Soup (com limitações e riscos)

USO POR SUA CONTA E RISCO!
O autor não se responsabiliza por qualquer uso deste código.
"""

import time
import random
import csv
from pathlib import Path
from typing import List, Dict, Optional
import json

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.keys import Keys
except ImportError:
    print("❌ Erro: Selenium não instalado!")
    print("Execute: pip install selenium")
    print("Também precisa instalar o ChromeDriver: brew install chromedriver (Mac)")
    exit(1)


class LinkedInScraper:
    """
    Classe para scraping do LinkedIn (APENAS EDUCACIONAL).

    ⚠️ NÃO USE EM PRODUÇÃO - VIOLA OS TERMOS DE SERVIÇO
    """

    def __init__(self, headless: bool = False):
        """
        Inicializa o scraper.

        Args:
            headless: Se True, roda o navegador em modo invisível
        """
        self.driver = None
        self.headless = headless
        self.wait_time = 10  # Tempo máximo de espera

        # Delays para evitar detecção (ainda assim, será detectado!)
        self.min_delay = 3
        self.max_delay = 7

    def setup_driver(self):
        """Configura o navegador Chrome com Selenium."""
        chrome_options = Options()

        if self.headless:
            chrome_options.add_argument('--headless')

        # Configurações para parecer mais humano (mas o LinkedIn ainda detecta!)
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)

        # User Agent para parecer navegador real
        chrome_options.add_argument(
            'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/120.0.0.0 Safari/537.36'
        )

        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
            )
            print("✅ Navegador configurado")
        except Exception as e:
            print(f"❌ Erro ao configurar navegador: {e}")
            print("Certifique-se de ter o ChromeDriver instalado")
            raise

    def human_delay(self):
        """Simula delay humano entre ações."""
        delay = random.uniform(self.min_delay, self.max_delay)
        time.sleep(delay)

    def login(self, email: str, password: str) -> bool:
        """
        Faz login no LinkedIn.

        ⚠️ AVISO: Isto pode resultar em bloqueio da sua conta!

        Args:
            email: Email do LinkedIn
            password: Senha do LinkedIn

        Returns:
            True se login bem-sucedido, False caso contrário
        """
        print("\n⚠️  TENTANDO LOGIN - Isso pode bloquear sua conta!")
        print("⚠️  Use por sua conta e risco!")

        try:
            self.driver.get('https://www.linkedin.com/login')
            self.human_delay()

            # Preenche email
            email_field = WebDriverWait(self.driver, self.wait_time).until(
                EC.presence_of_element_located((By.ID, 'username'))
            )
            email_field.send_keys(email)
            self.human_delay()

            # Preenche senha
            password_field = self.driver.find_element(By.ID, 'password')
            password_field.send_keys(password)
            self.human_delay()

            # Clica no botão de login
            login_button = self.driver.find_element(
                By.XPATH,
                '//button[@type="submit"]'
            )
            login_button.click()

            # Aguarda carregar
            time.sleep(5)

            # Verifica se login foi bem-sucedido
            if 'feed' in self.driver.current_url or 'mynetwork' in self.driver.current_url:
                print("✅ Login bem-sucedido")
                return True
            else:
                print("❌ Login falhou - Possível CAPTCHA ou bloqueio")
                return False

        except Exception as e:
            print(f"❌ Erro no login: {e}")
            return False

    def search_people(self, query: str, filters: Optional[Dict] = None) -> List[str]:
        """
        Busca pessoas no LinkedIn.

        Args:
            query: Termo de busca
            filters: Filtros adicionais (localização, empresa, etc.)

        Returns:
            Lista de URLs de perfis encontrados
        """
        print(f"\n🔍 Buscando: {query}")

        try:
            # Monta URL de busca
            search_url = f'https://www.linkedin.com/search/results/people/?keywords={query}'
            self.driver.get(search_url)
            self.human_delay()

            # Rola a página para carregar mais resultados
            self._scroll_page()

            # Extrai URLs dos perfis
            profile_links = self.driver.find_elements(
                By.XPATH,
                '//a[contains(@href, "/in/")]'
            )

            # Limpa e remove duplicatas
            profile_urls = list(set([
                link.get_attribute('href').split('?')[0]
                for link in profile_links
                if '/in/' in link.get_attribute('href')
            ]))

            print(f"✅ Encontrados {len(profile_urls)} perfis")
            return profile_urls

        except Exception as e:
            print(f"❌ Erro na busca: {e}")
            return []

    def scrape_profile(self, profile_url: str) -> Dict:
        """
        Extrai dados de um perfil do LinkedIn.

        ⚠️ AVISO: Isto é DETECTADO pelo LinkedIn e resultará em bloqueio!

        Args:
            profile_url: URL do perfil

        Returns:
            Dicionário com dados do perfil
        """
        print(f"\n👤 Raspando perfil: {profile_url}")

        profile_data = {
            'url': profile_url,
            'name': '',
            'headline': '',
            'location': '',
            'about': '',
            'experience': [],
            'education': [],
            'skills': []
        }

        try:
            self.driver.get(profile_url)
            self.human_delay()

            # Nome
            try:
                name = WebDriverWait(self.driver, self.wait_time).until(
                    EC.presence_of_element_located((
                        By.XPATH,
                        '//h1[contains(@class, "text-heading-xlarge")]'
                    ))
                )
                profile_data['name'] = name.text
            except:
                print("⚠️  Não foi possível extrair nome")

            # Headline (título profissional)
            try:
                headline = self.driver.find_element(
                    By.XPATH,
                    '//div[contains(@class, "text-body-medium")]'
                )
                profile_data['headline'] = headline.text
            except:
                pass

            # Localização
            try:
                location = self.driver.find_element(
                    By.XPATH,
                    '//span[contains(@class, "text-body-small")]'
                )
                profile_data['location'] = location.text
            except:
                pass

            # Sobre (About)
            try:
                about_section = self.driver.find_element(
                    By.XPATH,
                    '//section[contains(@class, "summary")]//div[contains(@class, "display-flex")]'
                )
                profile_data['about'] = about_section.text
            except:
                pass

            print(f"✅ Perfil raspado: {profile_data['name']}")
            self.human_delay()

            return profile_data

        except Exception as e:
            print(f"❌ Erro ao raspar perfil: {e}")
            return profile_data

    def _scroll_page(self, scrolls: int = 3):
        """Rola a página para carregar conteúdo dinâmico."""
        for i in range(scrolls):
            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);"
            )
            time.sleep(2)

    def save_to_csv(self, data: List[Dict], output_file: Path):
        """Salva dados extraídos em CSV."""
        print(f"\n💾 Salvando dados em: {output_file}")

        if not data:
            print("⚠️  Nenhum dado para salvar")
            return

        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)

        print(f"✅ {len(data)} registros salvos")

    def close(self):
        """Fecha o navegador."""
        if self.driver:
            self.driver.quit()
            print("\n✅ Navegador fechado")


def main():
    """
    Função principal - EXEMPLO DE USO EDUCACIONAL.

    ⚠️⚠️⚠️ NÃO EXECUTE ISSO COM SUA CONTA REAL! ⚠️⚠️⚠️
    """

    print("="*70)
    print("⚠️  LINKEDIN SCRAPER - APENAS EDUCACIONAL")
    print("="*70)
    print()
    print("AVISOS FINAIS:")
    print("1. Isto VIOLA os Termos de Serviço do LinkedIn")
    print("2. Sua conta SERÁ BLOQUEADA se detectado")
    print("3. Pode resultar em AÇÕES LEGAIS")
    print("4. Viola leis de proteção de dados (GDPR, LGPD)")
    print()
    print("ALTERNATIVAS LEGAIS:")
    print("- LinkedIn API Oficial: https://developer.linkedin.com/")
    print("- LinkedIn Sales Navigator")
    print("- Apollo.io, Hunter.io, Lusha, ZoomInfo")
    print()
    print("="*70)
    print()

    # Pede confirmação
    confirm = input("Você REALMENTE quer continuar? (digite 'SIM POR MINHA CONTA E RISCO'): ")

    if confirm != "SIM POR MINHA CONTA E RISCO":
        print("\n✅ Operação cancelada. Use as alternativas legais!")
        return

    # Configurações
    scraper = LinkedInScraper(headless=False)

    try:
        # Inicializa navegador
        scraper.setup_driver()

        # Login (SERÁ BLOQUEADO!)
        email = input("\nEmail do LinkedIn: ")
        password = input("Senha do LinkedIn: ")

        if not scraper.login(email, password):
            print("\n❌ Login falhou. Abortando...")
            return

        # Busca pessoas
        query = input("\nTermo de busca: ")
        profile_urls = scraper.search_people(query)

        if not profile_urls:
            print("❌ Nenhum perfil encontrado")
            return

        # Limita a um número pequeno para não ser muito detectado
        max_profiles = min(5, len(profile_urls))
        print(f"\n⚠️  Raspando apenas {max_profiles} perfis para reduzir detecção")

        # Raspa perfis
        profiles_data = []
        for url in profile_urls[:max_profiles]:
            profile_data = scraper.scrape_profile(url)
            profiles_data.append(profile_data)

        # Salva em CSV
        output_file = Path("linkedin_data_EDUCATIONAL.csv")
        scraper.save_to_csv(profiles_data, output_file)

        print("\n✅ Processo concluído")
        print(f"⚠️  LEMBRE-SE: Sua conta pode ser bloqueada a qualquer momento!")

    except Exception as e:
        print(f"\n❌ Erro: {e}")

    finally:
        scraper.close()


if __name__ == "__main__":
    main()

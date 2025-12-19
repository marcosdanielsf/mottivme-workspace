import json
import sys
import os

PT_MAP = {
    "Sticky Note4": (
        "## Busca de empresas no LinkedIn\n"
        "Esta seção inicia o fluxo e pesquisa suas empresas‑alvo no LinkedIn usando a Ghost Genius API.\n\n"
        "Você pode filtrar e refinar sua busca personalizando os campos na aba 'Settings' da Google Sheet.\n\n"
        "Observação: é possível recuperar no máximo 1000 empresas por busca (equivalente a 100 páginas do LinkedIn). Evite exceder esse número para não perder prospects.\n\n"
        "Exemplo: Quero atingir agências de Growth Marketing com 11–50 funcionários. A busca retorna 10.000 resultados. Então, refino usando localização (país por país) e recupero os 10.000 resultados em vários lotes de 500 a 1000 conforme o país.\n\n"
        "Dica: Para testar o fluxo ou ver o número de resultados, altere o parâmetro de paginação (Max Pages) no nó 'Search Companies'. O total aparecerá no topo do JSON de resposta."
    ),
    "Sticky Note5": (
        "## Pontuação por IA e armazenamento\n"
        "Esta seção pontua a empresa e salva os dados em uma Google Sheet.\n\n"
        "É essencial preencher corretamente a aba 'Settings' no início do fluxo para obter resultados relevantes ao seu caso. Você também pode ajustar manualmente o prompt do sistema.\n\n"
        "Adicionamos a empresa na aba 'Companies' desta Google Sheet (https://docs.google.com/spreadsheets/d/1j8AHiPiHEXVOkUhO2ms-lw1Ygu1eWIWW-8Qe1OoHpCo/edit?usp=sharing), da qual você pode fazer uma cópia.\n\n"
        "A funcionalidade de pontuação por IA é muito eficaz quando bem configurada; reserve tempo para testar com várias empresas e validar se atende às suas necessidades."
    ),
    "Sticky Note1": (
        "## Processamento de dados da empresa\n"
        "Esta seção processa cada empresa individualmente.\n\n"
        "Recuperamos informações completas usando Get Company Details a partir do link do LinkedIn obtido na seção anterior.\n\n"
        "Em seguida, filtramos pela quantidade de seguidores (indicador inicial de credibilidade; 200 neste exemplo) e verificamos se a página do LinkedIn possui site.\n\n"
        "Ajuste esses limites conforme o mercado‑alvo — aumentando a contagem para empresas estabelecidas ou reduzindo para mercados emergentes.\n\n"
        "Os dois últimos módulos verificam se a empresa já existe no seu banco (pelo ID do LinkedIn) para evitar duplicidades."
    ),
    "Sticky Note7": (
        "# Pesquise empresas no LinkedIn, pontue com IA e envie para seu CRM"
    ),
    "Sticky Note": (
        "## Recuperação de dados\n"
        "Aqui recuperamos as empresas da primeira automação, filtrando pela pontuação (mín. 7). Você pode remover ou ajustar esse filtro, mas o filtro de status deve permanecer.\n\n"
        "O nó 'Limit' evita atingir os limites do LinkedIn Sales Navigator, que possui limite diário de 2.500 resultados. Nesta automação, uma busca de empresa = uma requisição, podendo retornar até 25 resultados. Para manter‑se nos limites, não processe mais de 100 empresas por dia.\n\n"
        "Scraping do Sales Navigator é menos arriscado que o LinkedIn comum (reações, perfis etc.). Se ultrapassar o limite (a Ghost Genius API bloqueia automaticamente), você só ficará 24h sem usar o Sales Navigator. Recomendo usar a Ghost Genius pela funcionalidade sem cookies nos endpoints públicos e gestão automática de limites nos privados."
    ),
    "Sticky Note2": (
        "## Encontrar decisores\n"
        "Para cada empresa, localizamos os decisores (você pode customizar os cargos na Google Sheet), enriquecemos cada perfil e, por fim, buscamos o e‑mail.\n\n"
        "Para encontrar o e‑mail do prospect, usamos primeiro nome, sobrenome e o domínio da empresa (por isso, na primeira automação, filtramos empresas sem site). Utilizamos o endpoint da Ghost Genius com enriquecimento em cascata, aumentando a taxa de sucesso.\n\n"
        "Se não forem encontrados decisores, o fluxo é encerrado para aquela empresa e atualizamos o status na Google Sheet."
    ),
    "Sticky Note3": "## Saída",
    "Sticky Note12": "## Saída",
    "Sticky Note13": "## Saída",
    "Sticky Note9": (
        "## Introdução\n"
        "Bem‑vindo ao meu template! Antes da configuração, seguem algumas informações importantes:\n\n"
        "Este template é dividido em duas automações que se complementam.\n\n"
        "A primeira parte busca empresas conforme seus critérios, enriquece os dados e as avalia com um sistema de pontuação por IA.\n\n"
        "A segunda parte encontra os decisores e seus telefones nas empresas (pontuação mínima de 7) e gera um roteiro de ligação personalizado para cada empresa e perfil.\n\n"
        "Esta automação é básica. Se precisar integrar ao seu CRM, será necessário conhecimento técnico mínimo.\n\n"
        "O primeiro fluxo é iniciado manualmente; o segundo é executado diariamente.\n\n"
        "Se não estiver confortável com n8n ou tiver dúvidas, fale comigo no LinkedIn (www.linkedin.com/in/matthieu-belin83)."
    ),
    "Sticky Note10": (
        "## Configuração\n"
        "• Assista ao vídeo (https://www.youtube.com/watch?v=0EsdmETsZGE) — automação muito similar; só o final muda\n"
        "• Crie uma conta na Ghost Genius API (ghostgenius.fr) e obtenha sua chave\n"
        "• Conecte sua conta LinkedIn Sales Navigator na Ghost Genius API (https://www.youtube.com/watch?v=SH_4qN6sW7Q) e obtenha o ID da conta\n"
        "• Faça uma cópia da Google Sheet (link acima) — Arquivo ⇒ Fazer uma cópia\n"
        "• Configure a credencial da Google Sheet (docs do n8n ou vídeo)\n"
        "• Crie uma chave da OpenAI (https://platform.openai.com/docs/overview) e adicione a credencial nos nós da OpenAI (docs do n8n)\n"
        "• Preencha a aba 'Settings' e inclua sua chave da Ghost Genius API"
    ),
    "Sticky Note11": (
        "## Ferramentas\n"
        "(Você pode usar a API e o CRM de sua preferência; isto é apenas uma sugestão)\n\n"
        "• API do LinkedIn: Ghost Genius API (https://ghostgenius.fr)\n"
        "• Documentação da API: Documentation (https://ghostgenius.fr/docs)\n"
        "• CRM: Google Sheet (https://workspace.google.com/intl/pt-BR/products/sheets/)\n"
        "• IA: OpenAI (https://openai.com)\n"
        "• Localizações do LinkedIn (IDs): Ghost Genius Locations ID Finder\n"
        "• Cargos do LinkedIn (IDs): Ghost Genius Job title Finder"
    ),
    "Sticky Note14": (
        "# Encontrar decisores, obter telefone e gerar script de ligação com IA\n"
    ),
    "Sticky Note15": (
        "# Vídeo de configuração (https://www.youtube.com/watch?v=0EsdmETsZGE)\n"
    ),
    "Sticky Note16": (
        "# Fale comigo (https://www.linkedin.com/in/matthieu-belin83/)\n"
    ),
    "Sticky Note8": (
        "## Geração de script e armazenamento\n"
        "Nesta seção, geramos o script de ligação, armazenamos todas as informações na Google Sheet e, por fim, atualizamos o status da empresa.\n\n"
        "Para maior contexto e relevância, ajuste os prompts de sistema nos nós da OpenAI para personalizar ao máximo os scripts conforme seu produto/serviço."
    ),
}


def translate_file(path: str) -> bool:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    changed = False
    nodes = data.get("nodes", [])
    for node in nodes:
        if node.get("type") == "n8n-nodes-base.stickyNote":
            name = node.get("name", "")
            if name in PT_MAP:
                content = PT_MAP[name]
                node.setdefault("parameters", {})["content"] = content
                changed = True
    if changed:
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp, path)
    return changed


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: translate_stickies.py <workflow_json_path>")
        sys.exit(1)
    target = sys.argv[1]
    ok = translate_file(target)
    print("updated" if ok else "no-changes")


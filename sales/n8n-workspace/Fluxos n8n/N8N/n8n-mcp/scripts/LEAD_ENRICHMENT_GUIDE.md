# 🚀 Guia Completo: Descobrir LinkedIn e Instagram a partir de Email/Nome

## 📊 Comparação de Ferramentas (2025)

| Ferramenta | LinkedIn | Instagram | Email | Telefone | Preço/mês | Precisão | Recomendação |
|-----------|----------|-----------|--------|----------|-----------|----------|--------------|
| **Apollo.io** | ✅ | ❌ | ✅ | ✅ | $49 (10k) | 90% | ⭐⭐⭐⭐⭐ Melhor custo-benefício |
| **Hunter.io** | ⚠️ | ❌ | ✅ | ⚠️ | $49 (1k) | 85% | ⭐⭐⭐⭐ Bom para email |
| **Clearbit** | ✅ | ❌ | ✅ | ⚠️ | $99 (2.5k) | 90% | ⭐⭐⭐⭐ Dados completos |
| **SerpAPI** | ✅ | ✅ | ❌ | ❌ | $50 (5k) | 70% | ⭐⭐⭐ Flexível mas menos preciso |
| **Apify** | ✅ | ✅ | ❌ | ❌ | $10/1k | 95% | ⭐⭐⭐⭐⭐ Mais preciso |
| **Phantombuster** | ✅ | ✅ | ⚠️ | ❌ | $30-300 | 80% | ⭐⭐⭐ Zona cinzenta |

---

## 🎯 Estratégia Recomendada

### Opção 1: Máxima Precisão (Custo: ~$120/mês)

```
1. Apollo.io ($49/mês)
   └─ Descobrir LinkedIn + validar email

2. Apify ($10 per 1k)
   └─ Enriquecer perfis LinkedIn encontrados

3. SerpAPI ($50/mês)
   └─ Descobrir Instagram via Google
```

**Resultado:** 85-90% de taxa de sucesso

---

### Opção 2: Econômica (Custo: ~$50/mês)

```
1. Apollo.io ($49/mês)
   └─ Descobrir LinkedIn

2. Método gratuito
   └─ Instagram via username do email
```

**Resultado:** 70-80% de taxa de sucesso para LinkedIn, 30-40% para Instagram

---

### Opção 3: Sua Atual (Apify Only)

```
1. Apify Scraping ($10-20 per 1k)
   └─ LinkedIn Profile Scraper
   └─ Google Search Results
   └─ Instagram Scraper
```

**Resultado:** 90-95% precisão, mas requer URLs iniciais

---

## 🔧 Setup Passo-a-Passo

### 1. **Apollo.io** (RECOMENDADO para LinkedIn)

#### Cadastro:
1. Acesse: https://www.apollo.io/
2. Crie conta gratuita (50 créditos)
3. Upgrade para Pro: $49/mês (10.000 créditos)

#### Como usar:

**A) Via Interface:**
```
1. Upload CSV com emails
2. Use "Enrich" para descobrir LinkedIn
3. Export results
```

**B) Via API:**
```python
import requests

url = "https://api.apollo.io/v1/people/match"

headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': 'SUA_CHAVE_API'
}

data = {
    'email': 'exemplo@email.com'
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

linkedin_url = result['person']['linkedin_url']
```

**C) Via n8n:**
```json
{
  "name": "Apollo - Find LinkedIn",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.apollo.io/v1/people/match",
    "authentication": "genericCredentialType",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "X-Api-Key",
          "value": "={{$credentials.apolloApi.apiKey}}"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "email",
          "value": "={{$json.email}}"
        }
      ]
    }
  }
}
```

---

### 2. **Instagram via Email** (Método Gratuito)

#### Estratégia:

1. **Extrair username do email:**
   ```
   exemplo.silva@gmail.com → exemplo.silva
   ```

2. **Testar variações no Instagram:**
   ```
   instagram.com/exemplo.silva
   instagram.com/exemplosilva
   instagram.com/silva.exemplo
   instagram.com/exemplo_silva
   ```

3. **Validar existência:**
   ```python
   import requests

   def check_instagram(username):
       url = f"https://www.instagram.com/{username}/"
       try:
           response = requests.head(url, timeout=5)
           return response.status_code == 200
       except:
           return False
   ```

#### Taxa de sucesso: ~30-40%

**Melhorar precisão:**
- Use SerpAPI: `nome + site:instagram.com`
- Use Apify Instagram Scraper
- Use Phantombuster (zona cinzenta)

---

### 3. **SerpAPI** (Google Search para Sociais)

#### Cadastro:
1. Acesse: https://serpapi.com/
2. Plano: $50/mês (5.000 buscas)

#### Como buscar LinkedIn:
```python
import requests

params = {
    'q': 'João Silva site:linkedin.com/in/',
    'api_key': 'SUA_CHAVE',
    'num': 3
}

response = requests.get('https://serpapi.com/search', params=params)
results = response.json()['organic_results']

linkedin_url = results[0]['link']  # Primeiro resultado
```

#### Como buscar Instagram:
```python
# Busca por nome
params = {
    'q': 'João Silva site:instagram.com',
    'api_key': 'SUA_CHAVE',
    'num': 5
}

# Busca por email
username = email.split('@')[0]
params = {
    'q': f'"{username}" site:instagram.com',
    'api_key': 'SUA_CHAVE'
}
```

---

### 4. **Apify** (Sua Ferramenta Atual)

#### Já configurado no seu workflow!

**Scrapers úteis:**

1. **LinkedIn Profile Scraper** ($10/1k)
   ```
   https://apify.com/dev_fusion/linkedin-profile-scraper
   ```

2. **Google Search Results** ($0.50/1k)
   ```
   https://apify.com/scraperlink/google-search-results-serp-scraper
   ```

3. **Instagram Profile Scraper** ($5/1k)
   ```
   https://apify.com/apify/instagram-profile-scraper
   ```

#### Workflow:
```
1. Usar Google Search para encontrar LinkedIn URL
2. Usar LinkedIn Scraper para extrair dados completos
3. Usar Google Search para Instagram
4. Validar Instagram encontrado
```

---

## 📋 Workflow n8n Completo

### Fluxo Otimizado:

```
┌─────────────┐
│ 1. Trigger  │ (Webhook/Schedule/Manual)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ 2. Read CSV         │ (Seus leads)
│ - name              │
│ - email             │
│ - phone             │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ 3. Apollo API       │ ⭐ Passo principal
│ - Find LinkedIn     │
│ - Enrich data       │
└──────┬──────────────┘
       │
       ├─── LinkedIn Found ────┐
       │                        ▼
       │            ┌──────────────────────┐
       │            │ 4. Apify Scraper     │ (Opcional)
       │            │ - Get full profile   │
       │            └──────────┬───────────┘
       │                       │
       └─── LinkedIn NOT Found ─┘
       │
       ▼
┌─────────────────────┐
│ 5. SerpAPI Search   │ (Instagram)
│ - Google search     │
│ - Validate result   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ 6. Fallback Method  │ (Email username)
│ - Extract username  │
│ - Check Instagram   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ 7. Save Results     │
│ - Update CSV        │
│ - Send notification │
└─────────────────────┘
```

### Arquivo JSON para importar no n8n:

```json
{
  "name": "Lead Enrichment - LinkedIn & Instagram",
  "nodes": [
    {
      "parameters": {
        "path": "webhook",
        "responseMode": "responseNode",
        "responseData": "allEntries"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.apollo.io/v1/people/match",
        "authentication": "genericCredentialType",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "email",
              "value": "={{$json.email}}"
            }
          ]
        }
      },
      "name": "Apollo - Find LinkedIn",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "https://serpapi.com/search",
        "queryParameters": {
          "parameters": [
            {
              "name": "q",
              "value": "={{$json.name}} site:instagram.com"
            },
            {
              "name": "api_key",
              "value": "={{$credentials.serpApi.apiKey}}"
            }
          ]
        }
      },
      "name": "SerpAPI - Find Instagram",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [650, 300]
    }
  ]
}
```

---

## 💰 Cálculo de Custos

### Cenário: 10.000 leads/mês

| Método | LinkedIn | Instagram | Total/mês |
|--------|----------|-----------|-----------|
| **Apollo + SerpAPI** | $49 | $50 | $99 |
| **Apollo + Gratuito** | $49 | $0 | $49 |
| **Apify Only** | $100 | $50 | $150 |
| **Clearbit** | $99 | N/A | $99 |

**Recomendação:** Apollo ($49) + Método gratuito Instagram = **$49/mês**

---

## 🎓 Tutoriais Rápidos

### Tutorial 1: Enriquecer 100 leads com Apollo

```bash
# 1. Instalar dependências
pip install requests pandas

# 2. Criar script
python enrich_leads_linkedin_instagram.py

# 3. Configurar API key
export APOLLO_API_KEY="sua_chave"

# 4. Preparar CSV
# Formato: name,email,phone

# 5. Executar
python script.py --input leads.csv --output enriched.csv
```

---

### Tutorial 2: Workflow n8n Simples

1. **Importar workflow** (copie JSON acima)
2. **Configurar credenciais:**
   - Apollo API
   - SerpAPI (opcional)
3. **Ativar workflow**
4. **Testar com webhook:**
   ```bash
   curl -X POST https://seu-n8n.com/webhook/enrich \
     -H "Content-Type: application/json" \
     -d '{"name":"João Silva","email":"joao@email.com"}'
   ```

---

## 🚨 Notas Importantes

### Rate Limits:

| API | Limite | Tempo |
|-----|--------|-------|
| Apollo | 100 req | /min |
| Hunter | 50 req | /min |
| SerpAPI | 100 req | /min |
| Apify | Ilimitado | pay-per-use |

### Boas Práticas:

1. ✅ **Sempre use delay entre requests** (1-2 segundos)
2. ✅ **Implemente retry logic** (3 tentativas)
3. ✅ **Salve progresso incremental** (não perder trabalho)
4. ✅ **Valide dados antes de processar** (emails válidos)
5. ✅ **Use cache** (não buscar mesma pessoa 2x)

---

## 📊 Métricas Esperadas

### Taxa de Sucesso (com Apollo):

- **LinkedIn:** 85-90%
- **Instagram (SerpAPI):** 60-70%
- **Instagram (Gratuito):** 30-40%
- **Telefone:** 70-80%
- **Dados empresa:** 90-95%

### Tempo de Processamento:

- **1 lead:** 2-5 segundos
- **100 leads:** 3-8 minutos
- **1.000 leads:** 30-80 minutos
- **10.000 leads:** 5-13 horas

---

## 🔗 Links Úteis

- **Apollo.io:** https://www.apollo.io/
- **Hunter.io:** https://hunter.io/
- **SerpAPI:** https://serpapi.com/
- **Apify:** https://apify.com/
- **Clearbit:** https://clearbit.com/
- **n8n Docs:** https://docs.n8n.io/

---

## 💡 Dicas Extras

### 1. Melhorar taxa de sucesso Instagram:

```python
# Além do username do email, tente:
- nome.sobrenome
- nomesobrenome
- sobrenome.nome
- inicial + sobrenome (j.silva)
- nome + número (joaosilva10)
```

### 2. Validação de dados:

```python
# Sempre validar antes de salvar:
- LinkedIn URL contém "/in/"
- Instagram URL contém instagram.com/
- Email tem formato válido
- Nome tem pelo menos 2 palavras
```

### 3. Combinar múltiplas fontes:

```
1. Apollo para LinkedIn (90%)
2. Se falhar, tentar SerpAPI (70%)
3. Para Instagram, tentar ambos métodos
4. Manter melhor resultado
```

---

*Última atualização: 2025*
*Preços podem variar - confira sites oficiais*

# 🎯 SISTEMA INTEGRADO DE CRIAÇÃO DE ANÚNCIOS

## Visão Geral

Integração completa entre:
- **Fluxo novo/** (scraping de ads + geração visual)
- **Creative Modeler** (análise estratégica + modelagem de copy)
- **Assembly-line** (identidade + contexto completo)

## Arquitetura do Sistema Integrado

```
FASE 1: COLETA
┌─────────────────────────────────────┐
│ 1. Scrape Competitor Ads            │
│    (Meta Ads Library via Apify)     │
│    ↓                                 │
│ 2. Process & Save Raw Data          │
│    (Airtable: Competitor_Ads_Raw)   │
└─────────────────────────────────────┘

FASE 2: ANÁLISE ESTRATÉGICA
┌─────────────────────────────────────┐
│ 3. Get Assembly Context             │
│    (Identidade, Avatares, Big Idea) │
│    ↓                                 │
│ 4. Competitive Analysis Agent       │
│    (Analisa padrões dos ads)        │
│    ↓                                 │
│ 5. Pattern Extractor Agent          │
│    (Cria fórmulas aplicáveis)       │
└─────────────────────────────────────┘

FASE 3: CRIAÇÃO DE COPY
┌─────────────────────────────────────┐
│ 6. Creative Producer Enhanced       │
│    (Gera 20-30 criativos completos) │
│    - Copy completa                   │
│    - Scripts de vídeo               │
│    - Prompts de imagem              │
│    - Especificações técnicas        │
└─────────────────────────────────────┘

FASE 4: GERAÇÃO VISUAL
┌─────────────────────────────────────┐
│ 7a. Image Generation                │
│     (Flux/Midjourney)               │
│     ↓                                │
│ 7b. Video Generation                │
│     (Sora 2/Kling)                  │
└─────────────────────────────────────┘

FASE 5: FINALIZAÇÃO
┌─────────────────────────────────────┐
│ 8. Aggregate & Save                 │
│    (Anúncios completos no Airtable) │
└─────────────────────────────────────┘
```

## Como Integrar com o "Fluxo novo/"

### Opção 1: Integração Completa (Recomendada)

Criar um fluxo MASTER que orquestra tudo:

**Estrutura:**
```
[Webhook/Schedule Trigger]
    ↓
[1. Reference Ad Scraper] ← Do "Fluxo novo/"
    ↓
[2. Import Scraped Ads] ← Do "Fluxo novo/"
    ↓
[3. Creative Modeler - Analysis] ← Novo
    ↓
[4. Creative Modeler - Patterns] ← Novo
    ↓
[5. Creative Modeler - Copy] ← Novo
    ↓
[6. Image Generation - Fixed] ← Do "Fluxo novo/"
    ↓
[7. Video Generator] ← Do "Fluxo novo/"
    ↓
[8. Save Complete Ads]
```

### Opção 2: Modular (Mais Flexível)

Manter fluxos separados mas conectados via Airtable:

**Fluxo A: Scraping + Storage**
- Input: URLs dos concorrentes
- Output: Ads no Airtable (tabela `Competitor_Ads_Raw`)

**Fluxo B: Creative Analysis + Copy Generation**
- Input: Ads da tabela `Competitor_Ads_Raw` + Assembly Context
- Output: Copy completa na tabela `Generated_Ads_Copy`

**Fluxo C: Visual Generation**
- Input: Copy da tabela `Generated_Ads_Copy`
- Output: Assets visuais na tabela `Generated_Ads_Complete`

### Opção 3: Híbrida (Melhor para Iteração)

Usar o "Fluxo novo/" como está, e criar um **pré-processador** que alimenta ele:

```
[Creative Modeler]
    ↓ (gera copy + prompts)
[Airtable intermediária]
    ↓ (webhook trigger)
[Image Generation - Fixed] ← Usa o existente
[Video Generator] ← Usa o existente
```

## Estrutura de Dados no Airtable

### Tabela: `Competitor_Ads_Raw`
```
- id (auto)
- ad_id (text)
- page_name (text)
- ad_text (long text)
- full_transcript (long text)
- media_type (single select: image/video/carousel)
- media_urls (long text - JSON array)
- collation_count (number)
- impressions (number)
- spend (number)
- scraped_at (date)
- status (single select: new/analyzed/processed)
```

### Tabela: `Assembly_Context`
```
- expert_id (auto)
- expert_name (text)
- expert_context (long text)
- identidade_organizacional (long text)
- voz_marca (long text)
- avatares (long text - JSON)
- dores_mapeadas (long text)
- desejos_centrais (long text)
- big_idea (long text)
- mecanismo_unico (long text)
- front_end_offer (text)
- back_end_offer (text)
- brand_colors (text)
- brand_guidelines (long text)
- created_at (date)
- updated_at (date)
```

### Tabela: `Generated_Ads_Copy`
```
- id (auto)
- expert_id (link to Assembly_Context)
- competitive_analysis (long text)
- patterns_extracted (long text)
- ad_number (number)
- avatar_name (text)
- ad_title (text)
- pattern_used (text)
- copy_full (long text)
- video_script (long text)
- image_prompt (long text)
- visual_description (long text)
- format (single select: image/video/carousel)
- dimensions (text)
- duration (text - se vídeo)
- status (single select: ready_for_generation/generating/completed)
- created_at (date)
```

### Tabela: `Generated_Ads_Complete`
```
- id (auto)
- copy_id (link to Generated_Ads_Copy)
- expert_id (link to Assembly_Context)
- ad_title (text)
- copy_full (long text)
- image_url (attachment or URL)
- video_url (URL)
- format (single select)
- status (single select: draft/ready/published)
- performance_notes (long text)
- created_at (date)
```

## Pontos de Integração

### 1. Entre Scraping e Analysis
**Arquivo:** `2. Meta Ads System - 1b. Import Scraped Ads to Generated Ads (1).json`

**Modificação necessária:**
- Adicionar trigger para o Creative Modeler quando novos ads forem importados
- Webhook ou watch no Airtable

### 2. Entre Copy Generation e Visual Generation
**Arquivos:**
- `Image Generation - Fixed.json`
- `video_generator.json`

**Modificação necessária:**
- Receber prompts da tabela `Generated_Ads_Copy` ao invés de input manual
- Mapear campos: `image_prompt` → Flux/Midjourney, `video_script` → Sora

### 3. Assembly Context
**Novo componente:**
- Criar nó que busca contexto do Assembly-line
- Pode ser um sub-workflow reutilizável

## Implementação Passo a Passo

### Passo 1: Preparar Airtable
1. Criar as 4 tabelas descritas acima
2. Configurar relationships (links entre tabelas)
3. Configurar API key do Airtable no n8n

### Passo 2: Adaptar "Fluxo novo/"
1. **Reference Ad Scraper** - manter como está
2. **Import Scraped Ads** - modificar para usar nova estrutura de tabelas
3. **Image Generation** - modificar input para ler de `Generated_Ads_Copy`
4. **Video Generator** - modificar input para ler de `Generated_Ads_Copy`

### Passo 3: Criar Fluxo de Análise
1. Importar `creative-modeler-flow.json`
2. Configurar para ler de `Competitor_Ads_Raw`
3. Configurar para buscar de `Assembly_Context`
4. Configurar para salvar em `Generated_Ads_Copy`

### Passo 4: Criar Orquestrador
Criar um fluxo MASTER simples:

```javascript
// Pseudo-código do orquestrador
{
  "trigger": "Manual ou Schedule",
  "steps": [
    {
      "name": "Check for new competitor ads",
      "type": "Airtable query",
      "filter": "status = 'new'"
    },
    {
      "name": "Trigger analysis if new ads found",
      "type": "Execute Workflow",
      "workflow": "Creative Modeler"
    },
    {
      "name": "Check for copy ready for generation",
      "type": "Airtable query",
      "filter": "status = 'ready_for_generation'"
    },
    {
      "name": "Trigger visual generation",
      "type": "Execute Workflow",
      "workflows": ["Image Generation", "Video Generator"]
    },
    {
      "name": "Mark as completed",
      "type": "Airtable update",
      "status": "completed"
    }
  ]
}
```

## Fluxo de Trabalho do Usuário

### Cenário 1: Criar Campanha do Zero
```
1. Input: URLs dos concorrentes
2. Sistema scrapes ads (5-10 min)
3. Sistema analisa padrões (2-3 min)
4. Sistema gera 20-30 criativos com copy (5-10 min)
5. Sistema gera imagens (10-20 min)
6. Sistema gera vídeos (30-60 min)
7. Output: Campanha completa no Airtable
```

### Cenário 2: Refresh de Campanha
```
1. Input: Trigger manual ou schedule semanal
2. Sistema busca novos ads dos concorrentes
3. Sistema analisa apenas o que é novo
4. Sistema gera variações adicionais
5. Output: Novos criativos na biblioteca
```

### Cenário 3: A/B Testing
```
1. Input: Selecionar padrões específicos
2. Sistema gera versões A e B
3. Output: Pares de ads para teste
```

## Customizações Recomendadas

### 1. Adicionar Filtros de Qualidade
No "Reference Ad Scraper", adicionar filtros:
- Mínimo de impressions
- Mínimo de collation_count
- Apenas ads ativos nos últimos X dias

### 2. Adicionar Priorização
No Creative Modeler, adicionar scores:
- Score de efetividade do padrão
- Score de alinhamento com brand
- Score de novidade

### 3. Adicionar Feedback Loop
Criar tabela `Ads_Performance`:
- Link para `Generated_Ads_Complete`
- Métricas reais de campanha
- Usar para refinar padrões futuros

## APIs e Credenciais Necessárias

### Para Scraping:
- ✅ Apify API key (scraping de ads)
- ✅ Airtable API key

### Para AI Agents:
- ✅ Anthropic API key (Claude para análise)
- ✅ OpenAI API key (opcional, GPT-4 para algumas análises)

### Para Geração Visual:
- ✅ Together.ai API key (Flux para imagens)
- ✅ kie.ai API key (Sora 2 para vídeos)
- Alternativas: Midjourney, Runway, Kling

## Custos Estimados

### Por Campanha (50 ads concorrentes → 30 criativos gerados):

**Scraping:**
- Apify: ~$0.50-1.00 (depende do volume)

**AI Analysis:**
- Claude Sonnet: ~$0.30-0.50 (análise + extração)
- Claude Opus: ~$1.00-2.00 (creative producer)

**Visual Generation:**
- Imagens (Flux): ~$0.01-0.05 por imagem × 20 = $0.20-1.00
- Vídeos (Sora 2): ~$0.50-1.00 por vídeo × 10 = $5.00-10.00

**Total: ~$7-15 por campanha completa**

## Próximos Passos

1. **Você escolhe a opção de integração:**
   - Opção 1 (completa)
   - Opção 2 (modular)
   - Opção 3 (híbrida)

2. **Eu crio:**
   - Estrutura de tabelas do Airtable
   - Fluxo integrador
   - Documentação de setup

3. **Você testa:**
   - Com 5-10 ads de teste
   - Valida output
   - Ajusta prompts se necessário

## Perguntas para Definir Implementação

1. **Você já tem uma base Airtable configurada?**
   - Sim → Posso adaptar às suas tabelas
   - Não → Crio estrutura do zero

2. **Prefere tudo em um fluxo ou modular?**
   - Um fluxo → Mais simples, menos flexível
   - Modular → Mais complexo, mais flexível

3. **Quer começar só com copy ou já incluir visual?**
   - Só copy → Mais rápido para testar
   - Copy + visual → Sistema completo

4. **Tem preferência de modelos de imagem/vídeo?**
   - Flux + Sora (como no exemplo)
   - Midjourney + Runway
   - Outro

Me diz qual direção você prefere e eu crio o sistema integrado completo! 🚀

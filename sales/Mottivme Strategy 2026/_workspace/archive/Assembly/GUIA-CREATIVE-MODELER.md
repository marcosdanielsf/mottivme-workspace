# 🎬 Guia: Creative Modeler - Ads Baseados em Concorrentes

## O Que É Este Fluxo

O **Creative Modeler** é uma evolução do Agent 14 (Creative Producer) que permite criar anúncios de alta conversão **modelando** (não copiando) os criativos dos seus concorrentes, mantendo 100% da identidade única do expert.

### Diferença Entre Copiar e Modelar

- ❌ **Copiar**: Pegar o texto/visual igual
- ✅ **Modelar**: Pegar a estrutura/fórmula e adaptar com identidade própria

**Exemplo:**
- **Ad do Concorrente**: "Você está cometendo este erro que está sabotando seus resultados?"
- **Fórmula Extraída**: "[Você está + verbo negativo] + [consequência específica]?"
- **Nossa Versão**: "Você está ignorando o sinal que seus clientes estão enviando?"

## Como Funciona (Arquitetura)

```
1. Input: Transcrições dos Ads Concorrentes
   ↓
2. Get Assembly Context (identidade, avatares, big idea)
   ↓
3. Agent: Competitive Analysis
   - Analisa estrutura, hooks, copy, CTAs
   - Identifica padrões que funcionam
   ↓
4. Agent: Pattern Extractor
   - Transforma análise em fórmulas acionáveis
   - Cria templates adaptáveis
   ↓
5. Merge Contexts
   - Combina insights + identidade do Assembly
   ↓
6. Agent 14 ENHANCED: Creative Producer
   - Cria criativos usando padrões testados
   - Mantém identidade única
   - Indica transparentemente o que foi modelado
   ↓
7. Save to Airtable
```

## Setup Inicial

### 1. Preparar Dados de Entrada

Você precisa ter no Airtable:

**Tabela: `Transcricoes_Ads_Concorrentes`**
```
- id
- expert_id (link para o expert)
- ad_url (URL do anúncio original)
- transcricao (texto completo do ad)
- formato (imagem/video/carrossel)
- plataforma (Facebook/Instagram/YouTube)
- performance_estimada (1-10)
- data_captura
```

**Tabela: `Assembly_Context`**
```
- expert_id
- expert_name
- expert_context (texto completo do contexto)
- identidade_organizacional
- voz_marca
- avatares (JSON)
- dores_mapeadas
- desejos_centrais
- big_idea
- mecanismo_unico
- front_end_offer
- back_end_offer
```

**Tabela: `Criativos_Gerados`**
```
- id
- expert_id (link)
- creative_output (markdown completo)
- competitive_analysis (análise dos concorrentes)
- patterns_used (padrões aplicados)
- mode (competitor_modeled)
- timestamp
```

### 2. Configurar Credenciais no n8n

1. Airtable API Key
2. Credenciais dos LLMs:
   - Claude (para agents principais)
   - Gemini ou GPT-4 (opcional, para análises)

### 3. Atualizar IDs no Fluxo

Edite o arquivo `creative-modeler-flow.json`:

```json
// Substitua YOUR_AIRTABLE_APP_ID pelo seu ID real
"application": "appXXXXXXXXXXXXXX"
```

### 4. Importar no n8n

1. Copie o conteúdo de `creative-modeler-flow.json`
2. No n8n: Import from URL/File
3. Cole o JSON
4. Configure as credenciais
5. Ative o workflow

## Como Usar

### Passo 1: Coletar Transcrições dos Concorrentes

Use seu fluxo de download de ads (que você mencionou ter) para:
1. Capturar anúncios dos concorrentes
2. Transcrever (se vídeo, usar Whisper/AssemblyAI)
3. Salvar na tabela `Transcricoes_Ads_Concorrentes`

**Quantidade ideal**: 10-30 anúncios por nicho para ter padrões claros.

### Passo 2: Executar o Fluxo

1. Trigger manual ou automático (webhook/schedule)
2. O fluxo vai:
   - Buscar as transcrições
   - Pegar todo o contexto do Assembly-line
   - Analisar os padrões
   - Gerar criativos modelados

### Passo 3: Revisar Output

O output terá estrutura assim:

```markdown
# CRIATIVOS MODELADOS - [Expert Name]

## 🎯 ESTRATÉGIA DE MODELAGEM

### O que modelamos dos concorrentes
- Estrutura narrativa: Dor → Amplificação → Solução
- Hook tipo pergunta impactante
- CTA de baixa fricção

### Como nos diferenciamos
- Big Idea única: [sua big idea]
- Mecanismo proprietário: [seu mecanismo]
- Voz da marca: [seu tom]

---

## AVATAR 1: CEO Estressado

### AD 1.1: "O Erro Silencioso" - MODELADO DE Hook Tipo Pergunta

**🧬 PADRÃO BASE:** Hook tipo pergunta + amplificação da dor + CTA claro

**🎨 DIFERENCIAÇÃO:** Usamos nossa Big Idea "Sistema Anti-Caos" em vez de solução genérica

#### CAMADA 1: ATENÇÃO (0-3s)

**TEXTO NO CRIATIVO:**
"Você está ignorando o sinal que seus clientes estão enviando?"

**📊 BASEADO EM:**
- Hook Fórmula: Pergunta Impactante [Score: 9/10]
- Concorrente referência: Ad #3 da análise

#### CAMADA 2: CONSCIÊNCIA (3-10s)

**COPY:**
"Enquanto você está ocupado apagando incêndios, seus melhores clientes estão indo embora em silêncio..."

**📊 BASEADO EM:**
- Estrutura Narrativa: Amplificação da Dor [Score: 8/10]
- Progressão Emocional: Insight → Consequência

#### CAMADA 3: CTA (10-15s)

**CTA FINAL:**
"Descubra o Sistema Anti-Caos →"

**📊 BASEADO EM:**
- CTA Tipo: Descoberta [Score: 8/10]
- Fricção: Baixa

---

[... continua com 5-7 ads por avatar ...]
```

### Passo 4: Aplicar nos Seus Ads

Os criativos gerados podem ser:
1. Usados diretamente (já estão completos)
2. Refinados por um copywriter
3. Testados A/B contra suas versões atuais

## Inteligência do Fluxo

### O Que o Agent: Competitive Analysis Faz

- ✅ Identifica estruturas narrativas (como contam a história)
- ✅ Cataloga tipos de hooks (dor/desejo/curiosidade/urgência)
- ✅ Analisa progressão emocional
- ✅ Mapeia tratamento de objeções
- ✅ Identifica padrões de CTA
- ✅ Avalia nível de sofisticação do mercado (Eugene Schwartz 1-5)

**Output**: Análise completa de 10-30 páginas com insights estratégicos.

### O Que o Agent: Pattern Extractor Faz

- ✅ Transforma análise em FÓRMULAS aplicáveis
- ✅ Cria templates com variáveis
- ✅ Adapta para o contexto do expert
- ✅ Mapeia por avatar

**Output**: Biblioteca de 15-20 fórmulas de hooks, 5-7 estruturas narrativas, CTAs testados.

### O Que o Agent 14 ENHANCED Faz

- ✅ Aplica as fórmulas mantendo identidade única
- ✅ Segmenta por avatar
- ✅ Indica transparentemente o que foi modelado
- ✅ Gera 5-7 criativos COMPLETOS por avatar
- ✅ Inclui todos os formatos (imagem/carrossel/vídeo)

**Output**: 20-50 criativos prontos para produção.

## Vantagens Deste Fluxo

### 1. Data-Driven + Criativo
- Não é "inspiração" aleatória
- Usa estruturas que JÁ funcionaram
- Mantém diferenciação

### 2. Escala com Qualidade
- Gera dezenas de criativos em minutos
- Todos segmentados por avatar
- Todos com identidade consistente

### 3. Transparência
- Você sabe EXATAMENTE qual padrão foi usado
- Pode testar vs outras abordagens
- Aprende o que funciona no seu nicho

### 4. Assembly-line Powered
- Não perde nenhum contexto estratégico
- Big Idea está presente
- Voz da marca mantida

## Exemplos de Uso

### Caso 1: Lançamento de Produto

**Input**:
- 20 ads dos top 3 concorrentes
- Contexto do Assembly-line completo

**Output**:
- 30 criativos modelados
- 3 avatares segmentados
- Mix de formatos (imagem/carrossel/vídeo)

**Resultado**:
- Campanha completa pronta em 1h
- Estruturas testadas aplicadas
- Identidade única mantida

### Caso 2: Teste A/B Estratégico

**Input**:
- 10 ads de concorrente que está dominando
- Seu contexto atual

**Output**:
- Análise do que torna aqueles ads efetivos
- Versões modeladas para seu expert
- Hipóteses de teste

**Resultado**:
- Sabe EXATAMENTE o que testar
- Tem versões prontas
- Pode isolar variáveis

### Caso 3: Refresh de Campanha

**Input**:
- Ads novos dos concorrentes (últimos 30 dias)
- Contexto atualizado do expert

**Output**:
- Criativos com padrões atuais
- Adaptados para identidade
- Diferenciados da versão antiga

**Resultado**:
- Campanha atualizada com mercado
- Mantém consistência de marca
- Usa inteligência competitiva

## Próximos Passos

### 1. Testar o Fluxo
1. Prepare 5-10 transcrições de teste
2. Execute o fluxo manualmente
3. Revise os outputs
4. Ajuste prompts se necessário

### 2. Integrar com Fluxo de Download
- Conecte seu fluxo de biblioteca de ads
- Automatize a captura de transcrições
- Schedule execução semanal/mensal

### 3. Criar Dashboard de Performance
- Rastreie quais padrões convertem melhor
- Compare modelados vs originais
- Refine biblioteca de fórmulas

### 4. Expandir para Outros Canais
- Email (modelar sequences dos concorrentes)
- Landing Pages (modelar estrutura/copy)
- VSLs (modelar scripts)

## FAQ

### P: Isso não é copiar os concorrentes?
**R**: Não. É como um músico que estuda Bach para aprender estrutura de fuga, mas compõe música própria. Pegamos a FORMA, não o CONTEÚDO.

### P: Preciso ter muitas transcrições?
**R**: Mínimo 10 para ter padrões. Ideal 20-30. Mais que isso tem retorno decrescente.

### P: Posso usar ads de nichos diferentes?
**R**: Sim! Patterns de copy funcionam cross-nicho. Um hook de fitness pode ser adaptado para B2B.

### P: E se meu expert tem voz muito única?
**R**: Perfeito! O Pattern Extractor adapta ESPECIFICAMENTE para sua voz. A modelagem só melhora quando há identidade forte.

### P: Quanto custa executar (tokens)?
**R**: Depende do volume, mas exemplo:
- 20 transcrições
- 3 agents
- Output completo
= ~100-150K tokens (~$0.30-0.50 com Claude Sonnet)

### P: Posso usar modelos mais baratos?
**R**: Sim! Competitive Analysis e Pattern Extractor podem usar Haiku ou Gemini. Só o Agent 14 ENHANCED precisa ser Sonnet/Opus para qualidade.

## Suporte

Se tiver dúvidas ou precisar de ajuda para configurar:
1. Revise este guia completamente
2. Teste com dados pequenos primeiro
3. Ajuste prompts conforme necessário
4. Itere baseado nos resultados

## Changelog

**v1.0** (2025-01-24)
- Release inicial
- 3 agents principais
- Integração completa com Assembly-line
- Output estruturado com transparência

---

**Criado para**: Geração de criativos de alta conversão modelados em concorrentes
**Integra com**: Assembly-line.json (contexto completo)
**Mantém**: 100% identidade única do expert
**Diferencial**: Modelagem inteligente, não cópia

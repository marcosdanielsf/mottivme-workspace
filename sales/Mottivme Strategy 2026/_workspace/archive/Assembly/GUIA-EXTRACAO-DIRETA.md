# GUIA DE EXTRAÇÃO DIRETA PARA AIRTABLE

Esta abordagem extrai os campos diretamente de cada agent e faz o update no Airtable imediatamente após cada agent, SEM acumular dados.

## 📊 Estrutura do Workflow

```
Get Expert Record (Airtable)
    ↓
Agent 5: Identity Mapper
    ↓
[CODE] extract-agent5-para-airtable.js
    ↓
[AIRTABLE] Update Record (4 campos)
    ↓
Agent 6A: Concorrentes Internacionais
    ↓
Agent 6B: Concorrentes Brasileiros
    ↓
Agent 6C: Síntese de Mercado
    ↓
[CODE] extract-agent6abc-para-airtable.js
    ↓
[AIRTABLE] Update Record (5 campos)
    ↓
Agent 7: Avatares
    ↓
[CODE] extract-agent7-para-airtable.js
    ↓
[AIRTABLE] Update Record (4 campos)
    ↓
Agent 8: Promessa
    ↓
[CODE] extract-agent8-para-airtable.js
    ↓
[AIRTABLE] Update Record (1 campo)
    ↓
Agent 9: Big Idea
    ↓
[CODE] extract-agent9-para-airtable.js
    ↓
[AIRTABLE] Update Record (1 campo)
```

## 📁 Arquivos Criados

| Arquivo | Extrai de | Campos Extraídos |
|---------|-----------|------------------|
| `extract-agent5-para-airtable.js` | Agent 5 | 4 campos |
| `extract-agent6abc-para-airtable.js` | Agents 6A, 6B, 6C | 5 campos |
| `extract-agent7-para-airtable.js` | Agent 7 | 4 campos |
| `extract-agent8-para-airtable.js` | Agent 8 | 1 campo |
| `extract-agent9-para-airtable.js` | Agent 9 | 1 campo |

**Total:** 15 campos extraídos em 5 updates no Airtable

## 🔧 Implementação Passo a Passo

### 1. Agent 5 → Extract → Update Airtable

#### A. Adicionar Code Node
1. Após o **Agent 5**, adicione um nó **Code**
2. Nomeie: "Extract Agent 5"
3. Cole o conteúdo de `extract-agent5-para-airtable.js`

#### B. Adicionar Airtable Update
1. Adicione um nó **Airtable**
2. Operação: **Update**
3. Conecte: **Extract Agent 5** → **Airtable Update 1**

#### C. Configurar campos no Airtable Update 1:
```
Record ID: {{ $json.expert_id }}

Campos:
- identidade_organizacional: {{ $json.identidade_organizacional }}
- causa_diferenciacao: {{ $json.causa_diferenciacao }}
- mapa_linguagem: {{ $json.mapa_linguagem }}
- voz_marca: {{ $json.voz_marca }}
```

### 2. Agents 6A/6B/6C → Extract → Update Airtable

#### A. Estrutura dos Agents 6
```
Agent 6A: Concorrentes Internacionais
    ↓
Agent 6B: Concorrentes Brasileiros
    ↓
Agent 6C: Síntese de Mercado
```

⚠️ **IMPORTANTE**: Os 3 agents devem estar conectados em PARALELO ao Code node de extração.

No n8n:
1. Execute Agent 6A
2. Execute Agent 6B (após 6A)
3. Execute Agent 6C (após 6B)
4. **Conecte a saída dos 3 agents ao mesmo Code node**

#### B. Adicionar Code Node
1. Após os **Agents 6A, 6B, 6C** (os 3 conectados), adicione um nó **Code**
2. Nomeie: "Extract Agents 6"
3. Cole o conteúdo de `extract-agent6abc-para-airtable.js`

#### C. Adicionar Airtable Update
1. Adicione um nó **Airtable**
2. Operação: **Update**
3. Conecte: **Extract Agents 6** → **Airtable Update 2**

#### D. Configurar campos no Airtable Update 2:
```
Record ID: {{ $json.expert_id }}

Campos:
- concorrentes_internacionais: {{ $json.concorrentes_internacionais }}
- concorrentes_brasileiros: {{ $json.concorrentes_brasileiros }}
- analise_concorrentes: {{ $json.analise_concorrentes }}
- oportunidades_diferenciacao: {{ $json.oportunidades_diferenciacao }}
- tendencias_nicho: {{ $json.tendencias_nicho }}
```

### 3. Agent 7 → Extract → Update Airtable

#### A. Adicionar Code Node
1. Após o **Agent 7**, adicione um nó **Code**
2. Nomeie: "Extract Agent 7"
3. Cole o conteúdo de `extract-agent7-para-airtable.js`

#### B. Adicionar Airtable Update
1. Adicione um nó **Airtable**
2. Operação: **Update**
3. Conecte: **Extract Agent 7** → **Airtable Update 3**

#### C. Configurar campos no Airtable Update 3:
```
Record ID: {{ $json.expert_id }}

Campos:
- cliente_ideal_definicao: {{ $json.cliente_ideal_definicao }}
- dores_mapeadas: {{ $json.dores_mapeadas }}
- desejos_centrais: {{ $json.desejos_centrais }}
- crencas_limitantes: {{ $json.crencas_limitantes }}
```

### 4. Agent 8 → Extract → Update Airtable

#### A. Adicionar Code Node
1. Após o **Agent 8**, adicione um nó **Code**
2. Nomeie: "Extract Agent 8"
3. Cole o conteúdo de `extract-agent8-para-airtable.js`

#### B. Adicionar Airtable Update
1. Adicione um nó **Airtable**
2. Operação: **Update**
3. Conecte: **Extract Agent 8** → **Airtable Update 4**

#### C. Configurar campos no Airtable Update 4:
```
Record ID: {{ $json.expert_id }}

Campo:
- promessa_central: {{ $json.promessa_central }}
```

### 5. Agent 9 → Extract → Update Airtable

#### A. Adicionar Code Node
1. Após o **Agent 9**, adicione um nó **Code**
2. Nomeie: "Extract Agent 9"
3. Cole o conteúdo de `extract-agent9-para-airtable.js`

#### B. Adicionar Airtable Update
1. Adicione um nó **Airtable**
2. Operação: **Update**
3. Conecte: **Extract Agent 9** → **Airtable Update 5**

#### C. Configurar campos no Airtable Update 5:
```
Record ID: {{ $json.expert_id }}

Campo:
- mecanismo_unico: {{ $json.mecanismo_unico }}
```

## ✅ Vantagens desta Abordagem

1. **Mais simples**: Não precisa acumular dados
2. **Updates incrementais**: Airtable é atualizado progressivamente
3. **Mais robusto**: Se um agent falhar, os anteriores já salvaram
4. **Fácil debug**: Você vê exatamente qual agent está falhando
5. **Menos memória**: Não carrega todos os dados de uma vez

## ⚠️ Considerações

1. **5 updates no Airtable**: Cada update consome 1 operação da API
2. **Passar expert_id**: O expert_id deve estar disponível em cada agent
3. **Agents 6 paralelos**: Os 3 agents 6 precisam estar conectados ao mesmo Code

## 🧪 Como Testar

Execute o workflow e verifique no Airtable:

1. **Após Agent 5**: 4 campos preenchidos
2. **Após Agents 6**: +5 campos preenchidos (total: 9)
3. **Após Agent 7**: +4 campos preenchidos (total: 13)
4. **Após Agent 8**: +1 campo preenchido (total: 14)
5. **Após Agent 9**: +1 campo preenchido (total: 15)

## 🔍 Debug

Se algum campo não for extraído:

1. Olhe o output do Code node correspondente
2. Verifique os metadados:
   - `fields_extracted`: Quantos campos foram extraídos
   - `source_length`: Tamanho do texto do agent
3. Se `source_length` for 0, o agent não gerou output
4. Se o campo for "Seção não encontrada", os marcadores markdown não foram encontrados

## 📋 Campos do Airtable

Certifique-se de ter estes campos criados no Airtable:

**Do Agent 5:**
- identidade_organizacional
- causa_diferenciacao
- mapa_linguagem
- voz_marca

**Dos Agents 6:**
- concorrentes_internacionais
- concorrentes_brasileiros
- analise_concorrentes
- oportunidades_diferenciacao
- tendencias_nicho

**Do Agent 7:**
- cliente_ideal_definicao
- dores_mapeadas
- desejos_centrais
- crencas_limitantes

**Do Agent 8:**
- promessa_central

**Do Agent 9:**
- mecanismo_unico

## 🎯 Próximos Passos

1. Implementar os 5 Code nodes de extração
2. Configurar os 5 Airtable Update nodes
3. Testar cada etapa individualmente
4. Executar o workflow completo
5. Verificar os dados no Airtable

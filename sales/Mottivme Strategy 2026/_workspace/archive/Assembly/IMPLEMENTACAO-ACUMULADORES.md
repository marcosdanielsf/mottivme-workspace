# GUIA DE IMPLEMENTAÇÃO DOS ACUMULADORES

## ⚠️ PROBLEMA IDENTIFICADO

O erro "Dados de acumulação não encontrados" indica que o **Agent 9 não está recebendo os dados acumulados do Code8**.

## ✅ ESTRUTURA CORRETA DO WORKFLOW

O workflow DEVE seguir esta sequência exata:

```
Get Expert Record (Airtable)
    ↓
Agent 5: Identity Mapper
    ↓
[CODE5] code-accumulator-after-agent5.js
    ↓
Agent 6A: Concorrentes Internacionais
    ↓
[CODE6A] code-accumulator-after-agent6.js
    ↓
Agent 6B: Concorrentes Brasileiros
    ↓
[CODE6B] code-accumulator-after-agent6b-fixed.js
    ↓
Agent 6C: Síntese de Mercado
    ↓
[CODE6C] code-accumulator-after-agent6c-fixed.js
    ↓
Agent 7: Avatares
    ↓
[CODE7] code-accumulator-after-agent7-fixed.js
    ↓
Agent 8: Promessa
    ↓
[CODE8] code-accumulator-after-agent8-fixed.js
    ↓
Agent 9: Big Idea
    ↓
[CODE9] code-accumulator-after-agent9-fixed.js
    ↓
[CODE AIRTABLE] code-prepare-for-airtable.js
    ↓
Update Airtable Record
```

## 🔧 VERIFICAÇÕES NECESSÁRIAS

### 1. Verificar conexão do Agent 9

No n8n, certifique-se de que:

- O **Agent 9** recebe dados do **Code8** (e NÃO de outra fonte)
- O **Code9** recebe dados do **Agent 9** (e NÃO de outra fonte)

### 2. Configuração de cada nó Code

Cada nó Code deve usar o código correspondente:

| Nó Code | Arquivo | Posição no workflow |
|---------|---------|---------------------|
| Code5   | `code-accumulator-after-agent5.js` | Após Agent 5 |
| Code6A  | `code-accumulator-after-agent6.js` | Após Agent 6A |
| Code6B  | `code-accumulator-after-agent6b-fixed.js` | Após Agent 6B |
| Code6C  | `code-accumulator-after-agent6c-fixed.js` | Após Agent 6C |
| Code7   | `code-accumulator-after-agent7-fixed.js` | Após Agent 7 |
| Code8   | `code-accumulator-after-agent8-fixed.js` | Após Agent 8 |
| Code9   | `code-accumulator-after-agent9-fixed.js` | Após Agent 9 |

## 📋 PASSO A PASSO DA IMPLEMENTAÇÃO

### Passo 1: Configurar Code5 (Após Agent 5)

1. Adicione um nó **Code** após o **Agent 5**
2. Nomeie-o como "Code5 - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent5.js`
4. Conecte: **Agent 5** → **Code5** → **Agent 6A**

### Passo 2: Configurar Code6A (Após Agent 6A)

1. Adicione um nó **Code** após o **Agent 6A**
2. Nomeie-o como "Code6A - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent6.js`
4. Conecte: **Code5** → **Agent 6A** → **Code6A** → **Agent 6B**

### Passo 3: Configurar Code6B (Após Agent 6B)

1. Adicione um nó **Code** após o **Agent 6B**
2. Nomeie-o como "Code6B - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent6b-fixed.js`
4. Conecte: **Code6A** → **Agent 6B** → **Code6B** → **Agent 6C**

### Passo 4: Configurar Code6C (Após Agent 6C)

1. Adicione um nó **Code** após o **Agent 6C**
2. Nomeie-o como "Code6C - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent6c-fixed.js`
4. Conecte: **Code6B** → **Agent 6C** → **Code6C** → **Agent 7**

### Passo 5: Configurar Code7 (Após Agent 7)

1. Adicione um nó **Code** após o **Agent 7**
2. Nomeie-o como "Code7 - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent7-fixed.js`
4. Conecte: **Code6C** → **Agent 7** → **Code7** → **Agent 8**

### Passo 6: Configurar Code8 (Após Agent 8)

1. Adicione um nó **Code** após o **Agent 8**
2. Nomeie-o como "Code8 - Accumulator"
3. Cole o conteúdo de `code-accumulator-after-agent8-fixed.js`
4. Conecte: **Code7** → **Agent 8** → **Code8** → **Agent 9**

### ⚠️ Passo 7: CRÍTICO - Reconectar Agent 9

**ESTE É O PROBLEMA ATUAL:**

O Agent 9 precisa receber os dados do Code8, não de outra fonte.

1. **Desconecte** qualquer conexão existente do Agent 9
2. **Conecte**: **Code8** → **Agent 9**
3. Verifique que o Agent 9 agora recebe um objeto com `_accumulated` array

### Passo 8: Configurar Code9 (Após Agent 9)

1. Adicione um nó **Code** após o **Agent 9**
2. Nomeie-o como "Code9 - Final Extraction"
3. Cole o conteúdo de `code-accumulator-after-agent9-fixed.js`
4. Conecte: **Agent 9** → **Code9**

## 🧪 TESTE DE VALIDAÇÃO

Execute o workflow e verifique cada Code node:

### Saída esperada do Code5:
```json
{
  "agent5": { "text": "..." },
  "_accumulated": ["agent5"]
}
```

### Saída esperada do Code6A:
```json
{
  "agent5": { "text": "..." },
  "agent6a": { "text": "..." },
  "_accumulated": ["agent5", "agent6a"]
}
```

### Saída esperada do Code8:
```json
{
  "agent5": { ... },
  "agent6a": { ... },
  "agent6b": { ... },
  "agent6c": { ... },
  "agent7": { ... },
  "agent8": { "text": "..." },
  "_accumulated": ["agent5", "agent6a", "agent6b", "agent6c", "agent7", "agent8"]
}
```

### ⚠️ Se Code9 mostrar erro:
```json
{
  "error": "Dados de acumulação não encontrados",
  "received": { "expert_id": "..." }
}
```

**Significa:** O Agent 9 NÃO está recebendo os dados do Code8. Volte ao Passo 7.

### ✅ Saída esperada do Code9:
```json
{
  "identidade_organizacional": "...",
  "causa_diferenciacao": "...",
  "mapa_linguagem": "...",
  "voz_marca": "...",
  "concorrentes_internacionais": "...",
  "concorrentes_brasileiros": "...",
  "analise_concorrentes": "...",
  "oportunidades_diferenciacao": "...",
  "tendencias_nicho": "...",
  "cliente_ideal_definicao": "...",
  "dores_mapeadas": "...",
  "desejos_centrais": "...",
  "crencas_limitantes": "...",
  "promessa_central": "...",
  "mecanismo_unico": "...",
  "debug_info": { ... },
  "success": true
}
```

## 🔍 DEBUG

Se algo não funcionar, use o `code-debug-accumulation.js`:

1. Coloque este código em um Code node ANTES do Code9
2. Execute e veja exatamente o que está chegando
3. Verifique se `hasAccumulated: true` e todos os agents estão presentes

## 📊 RESUMO DO QUE CADA CODE FAZ

- **Code5-8**: Acumulam dados passando tudo adiante + adicionando novo agent
- **Code9**: Extrai as 15 seções dos dados acumulados
- **Code Airtable**: Formata para salvar no Airtable

## ❗ ERRO ATUAL

**Problema:** Agent 9 está recebendo apenas `{ expert_id: "..." }`

**Causa:** Agent 9 não está conectado ao Code8

**Solução:** Reconectar Agent 9 para receber dados do Code8 (ver Passo 7)

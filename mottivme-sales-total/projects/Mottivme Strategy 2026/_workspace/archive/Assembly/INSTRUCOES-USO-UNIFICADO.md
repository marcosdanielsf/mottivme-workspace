# Instruções de Uso do Código Unificado 789

## ❌ Problema Identificado

O código unificado está retornando:
- `id: ""` (vazio)
- Todos os campos com "Não mapeado"

## 🔍 Causa Raiz

O código está recebendo apenas a resposta do Perplexity, **sem** o `expert_id` que deveria vir junto.

## ✅ Solução: Estrutura Correta do Workflow

### Opção 1: Usar Merge Node

```
Get Expert Record (Airtable)
    ↓
[MERGE] → [Agent 7 Perplexity]
    ↓
[CODE] pass-expert-id-unified-789.js
    ↓
[AIRTABLE] Update Record
```

**Configuração do Merge:**
- Mode: `Merge By Position`
- Input 1: Get Expert Record
- Input 2: Agent 7 Output

### Opção 2: Usar Set Node ANTES do Agent

```
Get Expert Record (Airtable)
    ↓
[SET] Preparar Input
    - expert_id = {{ $json.id }}
    - prompt = {{ $json.prompt_agent7 }}
    ↓
[Agent 7 Perplexity]
    ↓
[CODE] pass-expert-id-unified-789.js
    ↓
[AIRTABLE] Update Record
```

### Opção 3: Modificar o Código para Buscar do Nó Anterior

Adicione esta linha no início do código:

```javascript
const inputData = $input.first().json;

// BUSCAR expert_id do nó "Get Expert Record"
const expertId = inputData.expert_id ||
                 inputData.id ||
                 $('Get Expert Record').first().json.id ||  // ← ADICIONAR ESTA LINHA
                 '';
```

## 📋 Checklist de Debug

Se ainda não funcionar, verifique:

1. ✅ O nó "Get Expert Record" está executando antes?
2. ✅ O campo retornado do Airtable se chama `id` ou `recordId`?
3. ✅ O Agent 7 está conectado depois do Get Expert Record?
4. ✅ Os logs do console mostram o `expert_id`?

## 🔧 Para Ver os Logs

1. No n8n, abra o DevTools (F12)
2. Vá na aba "Console"
3. Execute o workflow
4. Você verá:
   ```
   INPUT DATA: { ... }
   EXPERT_ID FOUND: rec123... ou ""
   EXTRACTED FROM PERPLEXITY ou FALLBACK
   TEXT LENGTH: 5000
   TEXT PREVIEW: ...
   ```

Envie esses logs para eu ajustar o código corretamente!

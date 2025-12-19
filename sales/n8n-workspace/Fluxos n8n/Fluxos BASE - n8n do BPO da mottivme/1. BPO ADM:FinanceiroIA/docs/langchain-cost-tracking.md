# Tracking de Custos LLM com LangChain Code Node

## Como Funciona

O LangChain Code node intercepta as chamadas de LLM e captura os **tokens reais** usando callbacks. Isso funciona com qualquer modelo (Gemini, OpenAI, Claude, Groq, etc).

## Arquitetura

```
[Trigger] → [AI Agent] ← [LangChain Code (interceptor)] ← [Language Model]
                                    ↓
                          [Tool: Registrar Custo LLM]
                                    ↓
                             [llm_costs table]
```

## Passo a Passo

### 1. Importar o workflow `[TOOL] Registrar Custo LLM`

Este workflow recebe os dados do callback e salva no banco.

### 2. Configurar o LangChain Code Node no seu agente

1. Adicione um nó **LangChain Code**
2. Em **Inputs**, adicione:
   - `ai_languageModel` (required)
   - `ai_tool` (required)
3. Em **Outputs**, adicione:
   - `ai_languageModel` (required)
4. Selecione modo **Supply Data**

### 3. Código do LangChain Code Node

```javascript
// Pega a LLM e a ferramenta conectadas
const llm = await this.getInputConnectionData('ai_languageModel', 0);
const tool = await this.getInputConnectionData('ai_tool', 0);

// Obtém os IDs do workflow e da execução
const workflowId = $workflow.id;
const executionId = $execution.id;

// Define o callback para registrar o uso de tokens
llm.callbacks = [{
  handleLLMEnd: async ({ generations }) => {
    try {
      const gen = generations[0][0];

      // Extrai usage_metadata de diferentes formatos de resposta
      const usage = gen.message?.usage_metadata
        || gen.message?.additional_kwargs?.usage_metadata
        || gen.generationInfo?.usage_metadata
        || {
            input_tokens: gen.generationInfo?.promptTokenCount || gen.generationInfo?.input_tokens || 0,
            output_tokens: gen.generationInfo?.candidatesTokenCount || gen.generationInfo?.output_tokens || 0,
            total_tokens: gen.generationInfo?.totalTokenCount || gen.generationInfo?.total_tokens || 0
        };

      const input_tokens = usage.input_tokens || 0;
      const output_tokens = usage.output_tokens || 0;
      const total_tokens = usage.total_tokens || (input_tokens + output_tokens);

      // Chama a tool para registrar o custo
      await tool.func({
        date: new Date().toISOString(),
        model: llm.modelName || llm.model || 'unknown-model',
        input_tokens,
        output_tokens,
        total_tokens,
        workflowId,
        executionId
      });
    } catch (err) {
      console.error('Erro ao registrar uso da LLM:', err);
    }
  }
}];

return llm;
```

### 4. Conectar os nós

```
[Google Gemini Chat Model]
          ↓
[LangChain Code Node] ←── [Call n8n Workflow Tool] → [TOOL] Registrar Custo LLM
          ↓
    [AI Agent]
```

### 5. Configurar a Tool "Call n8n Workflow"

1. Adicione um nó **Call n8n Workflow Tool**
2. Selecione o workflow `[TOOL] Registrar Custo LLM`
3. Conecte como Tool no LangChain Code node

## Dados Capturados

| Campo | Descrição |
|-------|-----------|
| date | Timestamp da chamada |
| model | Nome do modelo (gemini-2.0-flash, gpt-4o, etc) |
| input_tokens | Tokens do prompt |
| output_tokens | Tokens da resposta |
| total_tokens | Total de tokens |
| workflowId | ID do workflow |
| executionId | ID da execução |

## Dados Extras (opcional)

Você pode passar dados extras no código se quiser:

```javascript
await tool.func({
  date: new Date().toISOString(),
  model: llm.modelName || llm.model || 'unknown-model',
  input_tokens,
  output_tokens,
  total_tokens,
  workflowId,
  executionId,
  // Dados extras - pegue de onde precisar
  location_id: 'seu-location-id',
  location_name: 'Nome do Cliente',
  contact_id: 'contact-id',
  contact_name: 'Nome do Contato',
  canal: 'whatsapp',
  tipo_acao: 'atendimento'
});
```

## Formatos de Resposta por Provider

### Google Gemini
```json
{
  "generationInfo": {
    "promptTokenCount": 150,
    "candidatesTokenCount": 50,
    "totalTokenCount": 200
  }
}
```

### OpenAI
```json
{
  "message": {
    "usage_metadata": {
      "input_tokens": 150,
      "output_tokens": 50,
      "total_tokens": 200
    }
  }
}
```

### Anthropic Claude
```json
{
  "message": {
    "additional_kwargs": {
      "usage_metadata": {
        "input_tokens": 150,
        "output_tokens": 50
      }
    }
  }
}
```

## Calculadora de Custos

Os custos são calculados automaticamente no workflow `[TOOL] Registrar Custo LLM` baseado nos preços por 1M tokens:

| Modelo | Input ($/1M) | Output ($/1M) |
|--------|-------------|---------------|
| gemini-2.0-flash | $0.10 | $0.40 |
| gemini-1.5-flash | $0.075 | $0.30 |
| gemini-1.5-pro | $1.25 | $5.00 |
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| claude-3-sonnet | $3.00 | $15.00 |
| claude-3-haiku | $0.25 | $1.25 |

## Views para Análise

Após executar o SQL de criação da tabela `llm_costs`, você terá estas views:

- `vw_llm_costs_daily` - Custos por dia/modelo
- `vw_llm_costs_monthly` - Custos por mês/cliente
- `vw_llm_costs_by_model` - Custos por modelo (últimos 30 dias)

## Consolidação para Financeiro

O workflow `8. Consolidar Custos IA (Diário)` roda todo dia às 23h e:
1. Soma todos os custos do dia em `llm_costs`
2. Cria UMA despesa em `fin_movimentacoes` com categoria "Custos de IA"
3. Marca os registros como consolidados

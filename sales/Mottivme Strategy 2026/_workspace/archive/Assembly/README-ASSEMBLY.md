# Assembly - Sistema de Acumulação de Dados para n8n

Este diretório contém os códigos JavaScript e documentação para implementar o sistema de acumulação de dados entre múltiplos agents no n8n.

## 📁 Arquivos de Código (Implementação)

### Acumuladores Sequenciais

Estes códigos devem ser colocados em nós **Code** após cada Agent:

| Arquivo | Uso | Posição |
|---------|-----|---------|
| `code-accumulator-after-agent5.js` | CODE5 | Após Agent 5 |
| `code-accumulator-after-agent6.js` | CODE6A | Após Agent 6A |
| `code-accumulator-after-agent6b-fixed.js` | CODE6B | Após Agent 6B |
| `code-accumulator-after-agent6c-fixed.js` | CODE6C | Após Agent 6C |
| `code-accumulator-after-agent7-fixed.js` | CODE7 | Após Agent 7 |
| `code-accumulator-after-agent8-fixed.js` | CODE8 | Após Agent 8 |
| `code-accumulator-after-agent9-fixed.js` | CODE9 | Após Agent 9 (EXTRAÇÃO FINAL) |

### Preparação para Airtable

| Arquivo | Uso | Posição |
|---------|-----|---------|
| `code-prepare-for-airtable.js` | Formata dados para Airtable | Após CODE9 |

### Debug e Utilitários

| Arquivo | Uso |
|---------|-----|
| `code-debug-accumulation.js` | Debug para ver dados acumulados |

## 📖 Arquivos de Documentação

### Guias de Implementação

| Arquivo | Conteúdo |
|---------|----------|
| `SOLUCAO-RAPIDA.md` | **COMECE AQUI** - Solução rápida do erro atual |
| `IMPLEMENTACAO-ACUMULADORES.md` | Guia completo passo a passo |
| `DIAGRAMA-WORKFLOW-CORRETO.txt` | Diagrama visual do workflow |
| `README-ASSEMBLY.md` | Este arquivo - índice geral |

### Arquivos de Output (Exemplos)

Estes arquivos mostram os outputs dos agents para referência:

- `output AGENTE 5: IDENTITY MAPPER.txt`
- `output 6a - AGENTE 6A: PESQUISA DE CONCORRENTES INTERNACIONAIS.txt`
- `output 6b - AGENTE 6B: PESQUISA DE CONCORRENTES BRASILEIROS.txt`
- `output 6c - AGENTE 6C: SINTESE DE MERCADO E ANALISE ESTRATEGICA.txt`
- `output 7 - AGENTE 7: AVATAR MAPPING.txt`
- `output AGENTE 8 PROMESSA.txt`
- `output Agent 9 Mecanismo Único.txt`

### Versões Antigas (Histórico)

Arquivos mantidos para referência de evolução da solução:

- `code-javascript-fixed.js` (v1 - tentativa com nomes de nós)
- `code-javascript-fixed-v2.js` (v2 - tentativa com content detection)
- `code-javascript-fixed-v3.js` (v3 - content detection melhorado)
- `code-collector-sequential.js` (abordagem descartada)

## 🚀 Como Usar

### 1. Início Rápido (Se está com erro agora)

Leia: **`SOLUCAO-RAPIDA.md`**

### 2. Implementação Completa

Leia: **`IMPLEMENTACAO-ACUMULADORES.md`**

Siga os 8 passos para configurar todos os Code nodes.

### 3. Visualização

Abra: **`DIAGRAMA-WORKFLOW-CORRETO.txt`**

Para ver o fluxo completo visualmente.

## ❗ Problema Atual Identificado

**Erro:** "Dados de acumulação não encontrados" no Code9

**Causa:** Agent 9 não está conectado ao Code8

**Solução:** Reconectar Agent 9 para receber dados do Code8

Veja `SOLUCAO-RAPIDA.md` para detalhes.

## 🔧 O Que Cada Tipo de Code Faz

### Acumuladores (Code5-Code8)

Padrão simples:
```javascript
const inputData = $input.first().json;

if (inputData._accumulated) {
  return [{
    json: {
      ...inputData,  // Preserva tudo
      agentX: inputData.agentX || inputData,  // Adiciona novo
      _accumulated: [...inputData._accumulated, 'agentX']
    }
  }];
}

return [{
  json: {
    agentX: inputData,
    _accumulated: ['agentX']
  }
}];
```

### Extrator Final (Code9)

Recebe todos os dados acumulados e:
1. Verifica se tem `_accumulated`
2. Extrai texto de cada agent (`.text` ou `.output`)
3. Limpa tags `<think>` dos agents Perplexity
4. Usa `extractSection()` para extrair 15 seções por marcadores markdown
5. Retorna objeto formatado com as 15 seções

### Preparador Airtable

Recebe as 15 seções extraídas e formata para os campos do Airtable.

## 📊 Fluxo de Dados

```
Agent Output → Code Accumulator → Agent Input (com dados acumulados)
```

Cada agent recebe:
- Todos os outputs dos agents anteriores
- Array `_accumulated` rastreando quais agents já passaram

No final, Code9 tem acesso a todos os 7 agents (5, 6A, 6B, 6C, 7, 8, 9).

## 🧪 Testando

1. Execute o workflow
2. Verifique cada Code node
3. Confirme que `_accumulated` cresce a cada step
4. Code9 deve retornar `success: true` com 15 seções

Se Code9 retornar erro:
- Verifique conexões entre Code8 → Agent 9 → Code9
- Use `code-debug-accumulation.js` para diagnosticar

## 📦 O Que Será Extraído (15 Seções)

### Do Agent 5:
1. `identidade_organizacional`
2. `causa_diferenciacao`
3. `mapa_linguagem`
4. `voz_marca`

### Dos Agents 6A/6B/6C:
5. `concorrentes_internacionais`
6. `concorrentes_brasileiros`
7. `analise_concorrentes`
8. `oportunidades_diferenciacao`
9. `tendencias_nicho`

### Do Agent 7:
10. `cliente_ideal_definicao`
11. `dores_mapeadas`
12. `desejos_centrais`
13. `crencas_limitantes`

### Do Agent 8:
14. `promessa_central`

### Do Agent 9:
15. `mecanismo_unico`

## 🎯 Próximos Passos

Após implementar os acumuladores:

1. ✅ Verificar que Code9 extrai todas as 15 seções
2. ✅ Adicionar `code-prepare-for-airtable.js`
3. ✅ Configurar nó "Update Airtable Record"
4. ✅ Mapear os 15 campos para as colunas do Airtable
5. ✅ Testar workflow end-to-end
6. ✅ Validar dados salvos no Airtable

## 🆘 Suporte

Se algo não funcionar:

1. Verifique `SOLUCAO-RAPIDA.md` primeiro
2. Consulte `IMPLEMENTACAO-ACUMULADORES.md` para detalhes
3. Use `code-debug-accumulation.js` para diagnosticar
4. Verifique o `DIAGRAMA-WORKFLOW-CORRETO.txt` para estrutura

## 📝 Notas Técnicas

- **Por que acumular?** Em workflows sequenciais do n8n, você não pode usar `$('node-name')` para acessar nós que não estão diretamente conectados.
- **Por que Code entre cada Agent?** Para preservar os dados anteriores enquanto adiciona novos dados.
- **Por que `_accumulated`?** Para rastrear quais agents já foram processados e debugar problemas.
- **Por que `.text || .output`?** Agents diferentes retornam em propriedades diferentes.

## 🔄 Versão

Sistema de Acumulação v1.0 - Corrigido e testado até Code8
Data: 2025-11-24

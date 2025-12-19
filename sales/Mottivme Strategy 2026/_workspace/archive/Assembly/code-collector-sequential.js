// ====================================
// CODE COLLECTOR PARA WORKFLOW SEQUENCIAL
// Agent 5 → Agent 6 → Agent 7 → Agent 8 → Agent 9 → Este Code
// ====================================

// IMPORTANTE: Substitua os nomes abaixo pelos nomes EXATOS dos seus nós no n8n
const nodeNames = [
  'output AGENTE 5: IDENTITY MAPPER',
  'output 6c - AGENTE 6C: SINTESE DE MERCADO E ANALISE ESTRATEGICA',
  'output 7  AVATARES PSICOLÓGICOS',
  'output 8 - PROMESSA CENTRAL',
  'output 9  bigidea'
];

const allData = [];
const errors = [];

// Tentar coletar dados de cada nó
for (const nodeName of nodeNames) {
  try {
    // Tenta pegar o primeiro item do nó
    const nodeItem = $(nodeName).first();
    if (nodeItem && nodeItem.json) {
      allData.push(nodeItem);
    }
  } catch (e) {
    errors.push({
      nodeName,
      error: e.message
    });
  }
}

// Debug detalhado
const debugInfo = {
  nodesSearched: nodeNames.length,
  nodesFound: allData.length,
  nodesMissing: errors.length,
  errors: errors,
  dataCollected: allData.map((item, index) => {
    const text = item.json?.text || item.json?.output || '';
    let agentType = 'Desconhecido';

    const lowerText = text.toLowerCase();
    if (lowerText.includes('identidade organizacional') && lowerText.includes('princípios de vida')) {
      agentType = 'Agent 5';
    } else if (lowerText.includes('panorama competitivo') && lowerText.includes('gaps estrategicos')) {
      agentType = 'Agent 6';
    } else if (lowerText.includes('avatares') && lowerText.includes('cliente ideal')) {
      agentType = 'Agent 7';
    } else if (lowerText.includes('promessa central') && lowerText.includes('eu ajudo')) {
      agentType = 'Agent 8';
    } else if (lowerText.includes('big idea') && lowerText.includes('protocolo operador')) {
      agentType = 'Agent 9';
    }

    return {
      index,
      agentType,
      textLength: text.length,
      preview: text.substring(0, 100)
    };
  })
};

// Se encontrou todos os 5 agents, passar os dados adiante
if (allData.length === 5) {
  return [{
    json: {
      success: true,
      message: '✅ Todos os 5 agents coletados com sucesso!',
      agents: allData.map(item => item.json),
      debug: debugInfo
    }
  }];
}

// Se não encontrou todos, retornar erro com instruções
return [{
  json: {
    success: false,
    error: `❌ Apenas ${allData.length} de 5 agents foram encontrados`,
    debug: debugInfo,
    instruction: `
PROBLEMA: Não consegui acessar todos os nós.

SOLUÇÃO:
1. Verifique se os nomes dos nós no array 'nodeNames' estão EXATAMENTE iguais aos nomes no n8n
2. Os nomes no n8n são case-sensitive (maiúsculas/minúsculas importam)
3. Para ver os nomes exatos, clique em cada nó e veja o nome na parte superior

NOMES PROCURADOS:
${nodeNames.map(name => `- "${name}"`).join('\n')}

ERROS ENCONTRADOS:
${errors.map(e => `- ${e.nodeName}: ${e.error}`).join('\n')}
    `
  }
}];

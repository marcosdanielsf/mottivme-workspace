// ====================================
// CODE COLLECTOR UNIVERSAL
// Coleta TODOS os dados disponíveis no workflow
// ====================================

// Pegar todos os inputs que chegam diretamente
const allInputs = $input.all();

// Também tentar pegar de execuções anteriores se disponível
const workflowData = [];

// Adicionar os inputs diretos
workflowData.push(...allInputs);

// Tentar acessar dados do workflow completo
// Isso funciona quando o nó recebe dados de múltiplas fontes
if ($input.context && $input.context.getWorkflowStaticData) {
  const staticData = $input.context.getWorkflowStaticData('global');
  if (staticData.allAgentsData) {
    workflowData.push(...staticData.allAgentsData);
  }
}

// Debug: mostrar o que foi coletado
const debugInfo = {
  totalItemsCollected: workflowData.length,
  items: workflowData.map((item, index) => {
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

// Se coletou dados, retornar tudo
if (workflowData.length > 0) {
  return workflowData.map(item => ({
    json: {
      ...item.json,
      _collectorDebug: debugInfo
    }
  }));
}

// Se não coletou nada, retornar erro explicativo
return [{
  json: {
    error: 'Nenhum dado foi coletado',
    debug: debugInfo,
    solution: 'Este nó precisa estar conectado DEPOIS de todos os agents, ou todos os agents precisam estar conectados a um Merge antes deste nó'
  }
}];

// ====================================
// CÓDIGO DE DEBUG: Mostrar todos os inputs que estão chegando
// Use este código para descobrir quais nós estão conectados
// ====================================

const allInputs = $input.all();

// Mapear todos os inputs para ver o que está chegando
const inputsDebug = allInputs.map((input, index) => {
  const textContent = input.json?.text || input.json?.output || '';
  const preview = textContent.substring(0, 300);

  // Tentar identificar qual agent é baseado no conteúdo
  let agentType = 'Desconhecido';
  const lowerContent = textContent.toLowerCase();

  if (lowerContent.includes('identidade organizacional') && lowerContent.includes('princípios de vida')) {
    agentType = 'Agent 5 - Identity Mapper';
  } else if (lowerContent.includes('panorama competitivo') && lowerContent.includes('gaps estrategicos')) {
    agentType = 'Agent 6 - Synthesis Report';
  } else if (lowerContent.includes('avatares') && lowerContent.includes('cliente ideal')) {
    agentType = 'Agent 7 - Avatares';
  } else if (lowerContent.includes('promessa central') && lowerContent.includes('eu ajudo')) {
    agentType = 'Agent 8 - Promessa';
  } else if (lowerContent.includes('big idea') && lowerContent.includes('protocolo operador')) {
    agentType = 'Agent 9 - Big Idea';
  }

  return {
    index,
    agentType,
    hasText: !!input.json?.text,
    hasOutput: !!input.json?.output,
    contentLength: textContent.length,
    preview,
    allKeys: Object.keys(input.json || {})
  };
});

return [{
  json: {
    totalInputs: allInputs.length,
    message: allInputs.length === 1
      ? '⚠️ PROBLEMA: Apenas 1 input está chegando. Você precisa conectar TODOS os agents (5, 6, 7, 8, 9) a este nó, ou usar um nó Merge antes.'
      : `✅ ${allInputs.length} inputs chegando. Veja abaixo quais são:`,
    inputsDetalhados: inputsDebug,
    proximoPasso: allInputs.length === 1
      ? 'No n8n, verifique se os nós "output AGENTE 5", "output 6c", "output 7", "output 8" e "output 9" estão TODOS conectados ao nó Code, ou se há um nó Merge entre eles.'
      : 'Use o code-javascript-fixed-v4.js agora que todos os inputs estão chegando.'
  }
}];

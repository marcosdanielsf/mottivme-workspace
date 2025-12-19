// ====================================
// CODE APÓS AGENT 6A
// ====================================

const inputData = $input.first().json;

// Verificar se é dados acumulados ou dados novos do Agent 6A
const isAccumulated = inputData._accumulated && inputData._accumulated.length > 0;

if (isAccumulated) {
  // Já tem dados acumulados, adicionar agent6a
  return [{
    json: {
      ...inputData,
      agent6a: inputData.agent6a || inputData, // Se agent6a não existe, usar o próprio input
      _accumulated: [...inputData._accumulated, 'agent6a']
    }
  }];
} else {
  // Primeiro agent (Agent 6A vindo direto, sem acumulação anterior)
  return [{
    json: {
      agent6a: inputData,
      _accumulated: ['agent6a']
    }
  }];
}

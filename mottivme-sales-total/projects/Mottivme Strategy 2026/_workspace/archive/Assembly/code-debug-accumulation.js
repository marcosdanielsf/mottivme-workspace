// ====================================
// DEBUG: Ver o que está chegando em cada ponto
// Coloque este código ANTES do Code9 para ver o que Agent 8 está passando
// ====================================

const inputData = $input.first().json;

// Debug completo
const debug = {
  hasAccumulated: !!inputData._accumulated,
  accumulatedList: inputData._accumulated || [],
  allKeys: Object.keys(inputData),

  // Verificar se tem cada agent
  hasAgent5: !!inputData.agent5,
  hasAgent6a: !!inputData.agent6a,
  hasAgent6b: !!inputData.agent6b,
  hasAgent6c: !!inputData.agent6c,
  hasAgent7: !!inputData.agent7,
  hasAgent8: !!inputData.agent8,
  hasAgent9: !!inputData.agent9,

  // Preview de cada um
  agent5Preview: inputData.agent5 ? JSON.stringify(inputData.agent5).substring(0, 100) : 'NOT FOUND',
  agent6aPreview: inputData.agent6a ? JSON.stringify(inputData.agent6a).substring(0, 100) : 'NOT FOUND',
  agent6bPreview: inputData.agent6b ? JSON.stringify(inputData.agent6b).substring(0, 100) : 'NOT FOUND',
  agent6cPreview: inputData.agent6c ? JSON.stringify(inputData.agent6c).substring(0, 100) : 'NOT FOUND',
  agent7Preview: inputData.agent7 ? JSON.stringify(inputData.agent7).substring(0, 100) : 'NOT FOUND',
  agent8Preview: inputData.agent8 ? JSON.stringify(inputData.agent8).substring(0, 100) : 'NOT FOUND',

  // Dados brutos
  rawInputPreview: JSON.stringify(inputData).substring(0, 500)
};

return [{
  json: {
    debug,
    originalInput: inputData
  }
}];

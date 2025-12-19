// ====================================
// CODE APÓS AGENT 8
// ====================================

const inputData = $input.first().json;

// Se tem _accumulated, preservar tudo e adicionar agent8
if (inputData._accumulated) {
  return [{
    json: {
      ...inputData,
      agent8: inputData.agent8 || inputData,
      _accumulated: [...inputData._accumulated, 'agent8']
    }
  }];
}

// Se não tem, é o primeiro
return [{
  json: {
    agent8: inputData,
    _accumulated: ['agent8']
  }
}];

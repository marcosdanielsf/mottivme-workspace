// ====================================
// CODE APÓS AGENT 6B
// ====================================

const inputData = $input.first().json;

// Se tem _accumulated, preservar tudo e adicionar agent6b
if (inputData._accumulated) {
  return [{
    json: {
      ...inputData,
      agent6b: inputData.agent6b || inputData,
      _accumulated: [...inputData._accumulated, 'agent6b']
    }
  }];
}

// Se não tem, é o primeiro
return [{
  json: {
    agent6b: inputData,
    _accumulated: ['agent6b']
  }
}];

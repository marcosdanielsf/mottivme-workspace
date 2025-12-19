// ====================================
// CODE APÓS AGENT 6C
// ====================================

const inputData = $input.first().json;

// Se tem _accumulated, preservar tudo e adicionar agent6c
if (inputData._accumulated) {
  return [{
    json: {
      ...inputData,
      agent6c: inputData.agent6c || inputData,
      _accumulated: [...inputData._accumulated, 'agent6c']
    }
  }];
}

// Se não tem, é o primeiro
return [{
  json: {
    agent6c: inputData,
    _accumulated: ['agent6c']
  }
}];

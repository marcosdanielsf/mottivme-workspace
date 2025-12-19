// ====================================
// CODE APÓS AGENT 7
// ====================================

const inputData = $input.first().json;

// Se tem _accumulated, preservar tudo e adicionar agent7
if (inputData._accumulated) {
  return [{
    json: {
      ...inputData,
      agent7: inputData.agent7 || inputData,
      _accumulated: [...inputData._accumulated, 'agent7']
    }
  }];
}

// Se não tem, é o primeiro
return [{
  json: {
    agent7: inputData,
    _accumulated: ['agent7']
  }
}];

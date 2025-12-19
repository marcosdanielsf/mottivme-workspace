// ====================================
// CODE APÓS AGENT 6C
// ====================================

const previousData = $input.first().json;
const agent6cData = previousData;

const accumulated = previousData._accumulated || {};

return [{
  json: {
    ...accumulated,
    agent6c: agent6cData,
    _accumulated: [...(previousData._accumulated || []), 'agent6c']
  }
}];

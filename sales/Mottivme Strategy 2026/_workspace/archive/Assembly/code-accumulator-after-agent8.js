// ====================================
// CODE APÓS AGENT 8
// ====================================

const previousData = $input.first().json;
const agent8Data = previousData;

const accumulated = previousData._accumulated || {};

return [{
  json: {
    ...accumulated,
    agent8: agent8Data,
    _accumulated: [...(previousData._accumulated || []), 'agent8']
  }
}];

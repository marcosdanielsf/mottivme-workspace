// ====================================
// CODE APÓS AGENT 6B
// ====================================

const previousData = $input.first().json;
const agent6bData = previousData;

const accumulated = previousData._accumulated || {};

return [{
  json: {
    ...accumulated,
    agent6b: agent6bData,
    _accumulated: [...(previousData._accumulated || []), 'agent6b']
  }
}];

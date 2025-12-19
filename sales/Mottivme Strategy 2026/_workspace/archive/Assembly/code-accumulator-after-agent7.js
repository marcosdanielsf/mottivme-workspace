// ====================================
// CODE APÓS AGENT 7
// ====================================

const previousData = $input.first().json;
const agent7Data = previousData;

const accumulated = previousData._accumulated || {};

return [{
  json: {
    ...accumulated,
    agent7: agent7Data,
    _accumulated: [...(previousData._accumulated || []), 'agent7']
  }
}];

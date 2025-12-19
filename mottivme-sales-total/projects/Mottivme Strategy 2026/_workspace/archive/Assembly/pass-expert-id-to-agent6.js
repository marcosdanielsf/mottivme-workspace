// ====================================
// PASSAR EXPERT_ID PARA OS AGENTS 6A/6B/6C
// Adicione este código ANTES de CADA Agent (6A, 6B, 6C)
// ====================================

// Este código deve ser colocado em um nó Code ANTES de CADA Agent do grupo 6
// para garantir que o expert_id seja sempre passado adiante

const inputData = $input.first().json;

// Pegar o expert_id de qualquer fonte disponível
const expertId = inputData.expert_id ||
                 inputData.id ||
                 inputData.recordId ||
                 (inputData.choices && inputData.expert_id) || // Se vier do Perplexity
                 '';

// Se é uma resposta do Perplexity, extrair o conteúdo e adicionar expert_id
if (inputData.choices && inputData.choices[0]) {
  return [{
    json: {
      expert_id: expertId,
      ...inputData // Manter toda a resposta do Perplexity
    }
  }];
}

// Se é input inicial, preparar com expert_id e prompt
return [{
  json: {
    expert_id: expertId,
    prompt: inputData.prompt || inputData.text || '',
    ...inputData
  }
}];

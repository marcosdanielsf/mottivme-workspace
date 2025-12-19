// ====================================
// PASSAR EXPERT_ID PARA O AGENT 8
// Adicione este código DEPOIS do Agent 8 (entre Agent 8 e Extract 8)
// ====================================

// Este código extrai o texto do Perplexity e adiciona o expert_id

const inputData = $input.first().json;

// Pegar o expert_id de qualquer fonte disponível
const expertId = inputData.expert_id ||
                 inputData.id ||
                 inputData.recordId ||
                 '';

// Se é uma resposta do Perplexity, extrair apenas o conteúdo de texto
if (inputData.choices && inputData.choices[0] && inputData.choices[0].message) {
  return [{
    json: {
      expert_id: expertId,
      text: inputData.choices[0].message.content
    }
  }];
}

// Se não for Perplexity, passar o texto disponível
return [{
  json: {
    expert_id: expertId,
    text: inputData.text || inputData.output || inputData.content || ''
  }
}];

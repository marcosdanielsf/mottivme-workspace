// ====================================
// CÓDIGO UNIFICADO: AGENTS 7, 8 E 9
// Extrai texto do Perplexity, identifica o agent e extrai campos específicos
// ====================================

// Este código deve ser colocado DEPOIS de cada Agent (7, 8 ou 9)
// Ele detecta automaticamente qual agent gerou o output e extrai os campos

const inputData = $input.first().json;

// DEBUG: Log do input completo
console.log('INPUT DATA:', JSON.stringify(inputData, null, 2));

// Pegar o expert_id de qualquer fonte disponível
// Tenta pegar do input atual, depois do nó "Get Expert Record" ou "Airtable"
let expertId = inputData.expert_id ||
               inputData.id ||
               inputData.recordId ||
               '';

// Se não encontrou, tentar buscar de nós anteriores comuns
if (!expertId) {
  try {
    // Tentar do nó "Get Expert Record"
    const getExpertNode = $('Get Expert Record');
    if (getExpertNode && getExpertNode.first()) {
      expertId = getExpertNode.first().json.id || '';
    }
  } catch (e) {
    // Nó não existe, continuar
  }
}

// Se ainda não encontrou, tentar do primeiro item do primeiro input
if (!expertId) {
  try {
    const firstInput = $input.first();
    if (firstInput && firstInput.json) {
      expertId = firstInput.json.id || firstInput.json.recordId || '';
    }
  } catch (e) {
    // Falhou, continuar
  }
}

console.log('EXPERT_ID FOUND:', expertId);

// Extrair texto do Perplexity
let extractedText = '';

if (inputData.choices && inputData.choices[0] && inputData.choices[0].message) {
  extractedText = inputData.choices[0].message.content;
  console.log('EXTRACTED FROM PERPLEXITY');
} else {
  extractedText = inputData.text || inputData.output || inputData.content || '';
  console.log('EXTRACTED FROM FALLBACK');
}

console.log('TEXT LENGTH:', extractedText.length);
console.log('TEXT PREVIEW:', extractedText.substring(0, 200));

// Função de extração de seções
function extractSection(text, possibleMarkers, endMarker = null, maxLength = 5000) {
  if (!text) return null;

  for (let marker of possibleMarkers) {
    const lowerText = text.toLowerCase();
    const lowerMarker = marker.toLowerCase();
    const startIndex = lowerText.indexOf(lowerMarker);

    if (startIndex !== -1) {
      const searchStart = startIndex + marker.length;

      if (!endMarker) {
        const extracted = text.substring(searchStart).trim();
        return extracted.substring(0, maxLength);
      }

      const lowerEndMarker = endMarker.toLowerCase();
      const endIndex = lowerText.indexOf(lowerEndMarker, searchStart);
      const extracted = text.substring(searchStart, endIndex === -1 ? text.length : endIndex).trim();
      return extracted.substring(0, maxLength);
    }
  }

  return null;
}

// Detectar qual agent e extrair campos específicos
const lowerText = extractedText.toLowerCase();

// Agent 7: Avatar/Cliente Ideal
if (lowerText.includes('avatar') ||
    lowerText.includes('cliente ideal') ||
    lowerText.includes('dores mapeadas')) {

  const clienteIdealDefinicao = extractSection(
    extractedText,
    ['## PERFIL DO CLIENTE IDEAL', '## Cliente Ideal', '### Definição'],
    '### Dores',
    5000
  ) || 'Não mapeado';

  const doresMapeadas = extractSection(
    extractedText,
    ['### Dores Principais', '### Dores Mapeadas', '### Dores'],
    '### Desejos',
    5000
  ) || 'Não mapeado';

  const desejosCentrais = extractSection(
    extractedText,
    ['### Desejos Centrais', '### Desejos'],
    '### Crenças',
    5000
  ) || 'Não mapeado';

  const crencasLimitantes = extractSection(
    extractedText,
    ['### Crenças Limitantes'],
    '### Gatilhos',
    5000
  ) || 'Não mapeado';

  return [{
    json: {
      id: expertId,
      agent_type: 'agent7_avatar',
      'Cliente Ideal Definicao - IA': clienteIdealDefinicao,
      'Dores Mapeadas - IA': doresMapeadas,
      'Desejos Centrais - IA': desejosCentrais,
      'Crencas Limitantes - IA': crencasLimitantes
    }
  }];
}

// Agent 8: Promessa
if (lowerText.includes('promessa central') ||
    lowerText.includes('promessa final')) {

  const promessaCentral = extractSection(
    extractedText,
    ['## PROMESSA CENTRAL FINAL', '## PROMESSA CENTRAL'],
    '## PROCESSO',
    3000
  ) || 'Seção não encontrada';

  return [{
    json: {
      id: expertId,
      agent_type: 'agent8_promessa',
      'Promessa Central - IA': promessaCentral
    }
  }];
}

// Agent 9: Big Idea
if (lowerText.includes('big idea') ||
    lowerText.includes('mecanismo único') ||
    lowerText.includes('anatomia do big idea')) {

  const mecanismoUnico = extractSection(
    extractedText,
    ['## ANATOMIA DO BIG IDEA', '## BIG IDEA'],
    '## DIFERENCIAÇÃO',
    5000
  ) || 'Seção não encontrada';

  return [{
    json: {
      id: expertId,
      agent_type: 'agent9_bigidea',
      'Mecanismo Unico - IA': mecanismoUnico
    }
  }];
}

// Se não identificar nenhum agent, retornar texto bruto
return [{
  json: {
    id: expertId,
    agent_type: 'unknown',
    text: extractedText
  }
}];

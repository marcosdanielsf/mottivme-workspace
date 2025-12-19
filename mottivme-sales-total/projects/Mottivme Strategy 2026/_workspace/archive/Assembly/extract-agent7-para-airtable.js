// ====================================
// EXTRAÇÃO AGENT 7: AVATAR MAPPING
// Extrai 4 campos para Airtable
// ====================================

const inputData = $input.first().json;

// Extrair texto do formato Perplexity API (choices[0].message.content)
let agent7Text = '';

if (inputData.choices && inputData.choices[0] && inputData.choices[0].message) {
  agent7Text = inputData.choices[0].message.content;
} else {
  // Fallback para outros formatos
  agent7Text = inputData.text ||
               inputData.output ||
               inputData.response ||
               inputData.content ||
               inputData.message ||
               '';
}

// Função de extração
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

// Extrair as 4 seções do Agent 7
const clienteIdealDefinicao = extractSection(
  agent7Text,
  ['## 🎯 DEFINIÇÃO DO CLIENTE IDEAL', '## DEFINIÇÃO DO CLIENTE IDEAL'],
  '## 🎬'
) || 'Seção não encontrada';

const doresMapeadas = extractSection(
  agent7Text,
  ['### Dores (Pain Points)', '### Dores'],
  '### Desejos',
  8000
) || 'Seção não encontrada';

const desejosCentrais = extractSection(
  agent7Text,
  ['### Desejos'],
  '### Gatilhos',
  8000
) || 'Seção não encontrada';

const crencasLimitantes = extractSection(
  agent7Text,
  ['### Crenças Limitantes'],
  '### Gatilhos',
  5000
) || 'Não mapeado';

// Pegar expert_id do input data
const expertId = inputData.expert_id || inputData.id || '';

// Retornar dados formatados para Airtable (campos diretos no JSON)
return [{
  json: {
    id: expertId,
    'Cliente Ideal Definicao - IA': clienteIdealDefinicao,
    'Dores Mapeadas - IA': doresMapeadas,
    'Desejos Centrais - IA': desejosCentrais,
    'Crencas Limitantes - IA': crencasLimitantes
  }
}];

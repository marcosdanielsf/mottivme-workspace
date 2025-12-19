// ====================================
// EXTRAÇÃO AGENT 8: PROMESSA
// Extrai 1 campo para Airtable
// ====================================

const inputData = $input.first().json;

// Extrair texto do formato Perplexity API (choices[0].message.content)
let agent8Text = '';

if (inputData.choices && inputData.choices[0] && inputData.choices[0].message) {
  agent8Text = inputData.choices[0].message.content;
} else {
  // Fallback para outros formatos
  agent8Text = inputData.text ||
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

// Extrair a promessa central
const promessaCentral = extractSection(
  agent8Text,
  ['## PROMESSA CENTRAL FINAL', '## PROMESSA CENTRAL'],
  '## PROCESSO',
  3000
) || 'Seção não encontrada';

// Pegar expert_id do input data
const expertId = inputData.expert_id || inputData.id || '';

// Retornar dados formatados para Airtable (campos diretos no JSON)
return [{
  json: {
    id: expertId,
    'Promessa Central - IA': promessaCentral
  }
}];

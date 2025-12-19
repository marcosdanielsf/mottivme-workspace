// ====================================
// EXTRAÇÃO AGENT 5: IDENTITY MAPPER
// Extrai 4 campos para Airtable
// ====================================

const inputData = $input.first().json;
const agent5Text = inputData.text || inputData.output || '';

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

// Extrair as 4 seções do Agent 5
const identidadeOrganizacional = extractSection(
  agent5Text,
  ['## 3. IDENTIDADE ORGANIZACIONAL'],
  '## 4'
) || 'Seção não encontrada';

const causaDiferenciacao = extractSection(
  agent5Text,
  ['## 4. CAUSA E DIFERENCIAÇÃO'],
  '## 5'
) || 'Seção não encontrada';

const mapaLinguagem = extractSection(
  agent5Text,
  ['## 5. MAPA DE LINGUAGEM'],
  '## 6'
) || 'Seção não encontrada';

const vozMarca = extractSection(
  agent5Text,
  ['## 6. ESSÊNCIA DA MARCA'],
  null
) || 'Seção não encontrada';

// Pegar expert_id do input data
const expertId = inputData.expert_id || inputData.id || '';

// Retornar dados formatados para Airtable (campos diretos no JSON)
return [{
  json: {
    id: expertId,
    'Identidade Organizacional - IA': identidadeOrganizacional,
    'Causa Diferenciacao - IA': causaDiferenciacao,
    'Mapa Linguagem - IA': mapaLinguagem,
    'Voz Marca - IA': vozMarca
  }
}];

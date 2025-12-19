// ====================================
// EXTRAÇÃO AGENTS 6A, 6B, 6C
// Extrai 5 campos para Airtable
// ====================================

const inputData = $input.first().json;

// Extrair texto do formato Perplexity API (choices[0].message.content)
let agent6Text = '';

if (inputData.choices && inputData.choices[0] && inputData.choices[0].message) {
  agent6Text = inputData.choices[0].message.content;
} else {
  // Fallback para outros formatos
  agent6Text = inputData.text ||
               inputData.output ||
               inputData.response ||
               inputData.content ||
               inputData.message ||
               '';
}

// Limpar tags <think> do Perplexity
let agent6Cleaned = agent6Text;
if (agent6Cleaned.includes('<think>')) {
  agent6Cleaned = agent6Cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
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

// Extrair as 5 seções dos Agents 6
// Tentar extrair com marcadores, se não encontrar, usar texto completo (limitado)
const concorrentesInternacionais = extractSection(
  agent6Cleaned,
  ['## 1. CONCORRENTES INTERNACIONAIS', '## CONCORRENTES INTERNACIONAIS', '# CONCORRENTES INTERNACIONAIS'],
  '## 2',
  8000
) || agent6Cleaned.substring(0, 8000) || 'Seção não encontrada';

const concorrentesBrasileiros = extractSection(
  agent6Cleaned,
  ['## 2. CONCORRENTES BRASILEIROS', '## CONCORRENTES BRASILEIROS', '# CONCORRENTES BRASILEIROS'],
  '## 3',
  8000
) || agent6Cleaned.substring(0, 8000) || 'Seção não encontrada';

const analiseConcorrentes = extractSection(
  agent6Cleaned,
  ['## 3. PANORAMA COMPETITIVO', '# PANORAMA COMPETITIVO'],
  '## 4',
  5000
) || agent6Cleaned.substring(0, 5000) || 'Seção não encontrada';

const oportunidadesDiferenciacao = extractSection(
  agent6Cleaned,
  [
    '## 4. GAPS ESTRATEGICOS',
    '## 4. GAPS ESTRATÉGICOS',
    '# GAPS ESTRATÉGICOS',
    '### 4. GAPS ESTRATÉGICOS',
    '## 4. Strategic Gaps',
    '## 4.'
  ],
  '## 5',
  5000
) || extractSection(agent6Cleaned, ['### Gaps', '### Oportunidades'], '##', 5000) || 'Seção não encontrada';

const tendenciasNicho = extractSection(
  agent6Cleaned,
  [
    '## 5. ANALISE DE TENDENCIAS',
    '## 5. ANÁLISE DE TENDÊNCIAS',
    '# ANÁLISE DE TENDÊNCIAS',
    '### 5. ANÁLISE DE TENDÊNCIAS',
    '## 5. Trend Analysis',
    '## 5.'
  ],
  '## 6',
  5000
) || extractSection(agent6Cleaned, ['### Tendências', '### Trends'], null, 5000) || 'Seção não encontrada';

// Pegar expert_id do input data
// IMPORTANTE: O expert_id deve ser passado junto com o input do Agent 6
const expertId = inputData.expert_id ||
                 inputData.id ||
                 inputData.recordId ||
                 '';

// Retornar dados formatados para Airtable (campos diretos no JSON)
return [{
  json: {
    id: expertId,
    'Concorrentes Internacionais - IA': concorrentesInternacionais,
    'Concorrentes Brasileiros - IA': concorrentesBrasileiros,
    'Analise Concorrentes - IA': analiseConcorrentes,
    'Oportunidades Diferenciacao - IA': oportunidadesDiferenciacao,
    'Tendencias Nicho - IA': tendenciasNicho
  }
}];

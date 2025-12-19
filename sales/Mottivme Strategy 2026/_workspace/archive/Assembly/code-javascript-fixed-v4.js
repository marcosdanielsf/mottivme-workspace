// ====================================
// ESTRATÉGIA V4: Corrigir estrutura de acesso aos dados
// O problema: Os dados chegam diretamente como array de objetos com .text
// não como input.json.text
// ====================================

const allInputs = $input.all();

// Função melhorada para encontrar dados por conteúdo
function findDataByContent(inputs, mustHaveAll, mustNotHave = []) {
  for (const input of inputs) {
    // O dado pode estar em input.json.text OU diretamente em input.json
    const textContent = input.json?.text || input.json?.output || JSON.stringify(input.json);
    const jsonStr = textContent.toLowerCase();

    // Verifica se tem TODAS as palavras obrigatórias
    const hasAll = mustHaveAll.every(keyword => jsonStr.includes(keyword.toLowerCase()));

    // Verifica se NÃO tem nenhuma das palavras proibidas
    const hasNone = mustNotHave.every(keyword => !jsonStr.includes(keyword.toLowerCase()));

    if (hasAll && hasNone) {
      return input.json;
    }
  }
  return null;
}

// Extrair dados com critérios mais específicos
const agent5Data = findDataByContent(
  allInputs,
  ['identidade organizacional', 'princípios de vida'],
  ['promessa central', 'big idea']
);

const agent6Data = findDataByContent(
  allInputs,
  ['panorama competitivo', 'gaps estrategicos'],
  ['identidade', 'promessa central']
);

const agent7Data = findDataByContent(
  allInputs,
  ['avatares', 'cliente ideal', 'dores'],
  ['identidade organizacional', 'promessa central']
);

const agent8Data = findDataByContent(
  allInputs,
  ['promessa central', 'eu ajudo'],
  ['identidade organizacional', 'big idea']
);

const agent9Data = findDataByContent(
  allInputs,
  ['big idea', 'protocolo operador', 'mecanismo'],
  ['identidade organizacional', 'promessa central']
);

// Pegar o texto de cada agente - CORRIGIDO
const agent5 = agent5Data?.text || agent5Data?.output || '';
const agent6 = agent6Data?.text || agent6Data?.output || '';
const agent7 = agent7Data?.text || agent7Data?.output || '';
const agent8 = agent8Data?.text || agent8Data?.output || '';
const agent9 = agent9Data?.text || agent9Data?.output || '';

// Limpar tag <think> do Agent 6
let agent6Cleaned = agent6;
if (agent6Cleaned.includes('<think>')) {
  agent6Cleaned = agent6Cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// ====================================
// FUNÇÃO DE EXTRAÇÃO MELHORADA
// ====================================
function extractSection(text, possibleMarkers, endMarker = null, maxLength = 5000) {
  if (!text) return null;

  for (let marker of possibleMarkers) {
    // Busca case-insensitive
    const lowerText = text.toLowerCase();
    const lowerMarker = marker.toLowerCase();
    const startIndex = lowerText.indexOf(lowerMarker);

    if (startIndex !== -1) {
      const searchStart = startIndex + marker.length;

      if (!endMarker) {
        const extracted = text.substring(searchStart).trim();
        return extracted.substring(0, maxLength);
      }

      // Se tem endMarker, procura por ele
      const lowerEndMarker = endMarker.toLowerCase();
      const endIndex = lowerText.indexOf(lowerEndMarker, searchStart);
      const extracted = text.substring(searchStart, endIndex === -1 ? text.length : endIndex).trim();
      return extracted.substring(0, maxLength);
    }
  }

  return null;
}

// ====================================
// EXTRAÇÕES DO AGENT 5 (Identity Map)
// ====================================
const identidadeOrganizacional = extractSection(
  agent5,
  [
    '## 3. IDENTIDADE ORGANIZACIONAL',
    '### Propósito',
    'IDENTIDADE ORGANIZACIONAL'
  ],
  '## 4'
) || extractSection(agent5, ['### Propósito (Por que existe)'], '### Missão');

const causaDiferenciacao = extractSection(
  agent5,
  [
    '## 4. CAUSA E DIFERENCIAÇÃO',
    '### A Causa',
    'CAUSA E DIFERENCIAÇÃO'
  ],
  '## 5'
) || extractSection(agent5, ['### A Causa (O que defende)'], '### Diferenciação');

const mapaLinguagem = extractSection(
  agent5,
  [
    '## 5. MAPA DE LINGUAGEM E POSTURA',
    '### Vocabulário da Marca',
    'MAPA DE LINGUAGEM'
  ],
  '## 6'
) || extractSection(agent5, ['### Vocabulário da Marca'], '### Postura');

const vozMarca = extractSection(
  agent5,
  [
    '## 6. ESSÊNCIA DA MARCA',
    '**ESSÊNCIA:**',
    'ESSÊNCIA DA MARCA EM UMA PÁGINA'
  ],
  null
) || extractSection(agent5, ['**ESSÊNCIA:**'], '**PROMESSA');

// ====================================
// EXTRAÇÕES DO AGENT 6 (Synthesis Report)
// ====================================
const analiseConcorrentes = extractSection(
  agent6Cleaned,
  [
    '## 3. PANORAMA COMPETITIVO',
    '### Top Players Internacionais',
    'PANORAMA COMPETITIVO - CONSOLIDADO'
  ],
  '## 4'
) || extractSection(agent6Cleaned, ['### Top Players Internacionais'], '### Top Players Brasileiros');

const oportunidadesDiferenciacao = extractSection(
  agent6Cleaned,
  [
    '## 4. GAPS ESTRATEGICOS',
    '### GAP 1:',
    'GAPS ESTRATEGICOS E OPORTUNIDADES'
  ],
  '## 5'
) || extractSection(agent6Cleaned, ['### GAP 1:'], '## 5');

const tendenciasNicho = extractSection(
  agent6Cleaned,
  [
    '## 5. ANALISE DE TENDENCIAS',
    '### Tendencias Globais',
    'ANALISE DE TENDENCIAS - CONSOLIDADA'
  ],
  '## 6'
) || extractSection(agent6Cleaned, ['### Tendencias Globais'], '## 6');

// ====================================
// EXTRAÇÕES DO AGENT 7 (Avatares)
// ====================================
const clienteIdealDefinicao = extractSection(
  agent7,
  [
    '## 🎯 DEFINIÇÃO DO CLIENTE IDEAL',
    '### Cliente Ideal =',
    'DEFINIÇÃO DO CLIENTE IDEAL COMPOSTO'
  ],
  '## 🎬'
) || extractSection(agent7, ['### Cliente Ideal ='], '##');

const doresMapeadas = extractSection(
  agent7,
  [
    '### Dores (Pain Points)',
    '#### Dor Externa',
    'Pain Points'
  ],
  '### Desejos',
  8000
) || extractSection(agent7, ['#### Dor Externa'], '#### Dor Real');

const desejosCentrais = extractSection(
  agent7,
  [
    '### Desejos',
    '#### Desejo Superficial',
    'Desejos'
  ],
  '### Gatilhos',
  8000
) || extractSection(agent7, ['#### Desejo Superficial'], '#### Desejo Central');

const crencasLimitantes = extractSection(
  agent7,
  [
    '### Crenças Limitantes',
    '#### Crenças sobre Si',
    'Crenças Limitantes'
  ],
  '### Gatilhos',
  5000
) || 'Não mapeado explicitamente nos avatares';

// ====================================
// EXTRAÇÕES DO AGENT 8 (Promessa)
// ====================================
const promessaCentral = extractSection(
  agent8,
  [
    '## PROMESSA CENTRAL FINAL',
    '### Versão Principal',
    'PROMESSA CENTRAL'
  ],
  '## PROCESSO',
  3000
) || extractSection(agent8, ['### Versão Principal'], '##');

// ====================================
// EXTRAÇÕES DO AGENT 9 (Big Idea)
// ====================================
const mecanismoUnico = extractSection(
  agent9,
  [
    '## ANATOMIA DO BIG IDEA',
    '### Nome do Mecanismo',
    'BIG IDEA ESCOLHIDO'
  ],
  '## DIFERENCIAÇÃO',
  5000
) || extractSection(agent9, ['### Nome do Mecanismo'], '### Como Funciona');

// ====================================
// DEBUG MELHORADO
// ====================================
const debugInfo = {
  totalInputs: allInputs.length,
  agent5Found: !!agent5,
  agent6Found: !!agent6,
  agent7Found: !!agent7,
  agent8Found: !!agent8,
  agent9Found: !!agent9,
  agent5Length: agent5.length,
  agent6Length: agent6.length,
  agent7Length: agent7.length,
  agent8Length: agent8.length,
  agent9Length: agent9.length,
  // Adicionar preview dos textos
  agent5Preview: agent5.substring(0, 200),
  agent6Preview: agent6.substring(0, 200),
  agent7Preview: agent7.substring(0, 200),
  agent8Preview: agent8.substring(0, 200),
  agent9Preview: agent9.substring(0, 200),
  // Adicionar preview das seções extraídas
  identidadePreview: (identidadeOrganizacional || '').substring(0, 100),
  promessaPreview: (promessaCentral || '').substring(0, 100),
  mecanismoPreview: (mecanismoUnico || '').substring(0, 100)
};

// ====================================
// RETORNAR TUDO
// ====================================
return [{
  json: {
    // SEÇÕES DO AGENT 5
    'identidade_organizacional': identidadeOrganizacional || 'Seção não encontrada',
    'causa_diferenciacao': causaDiferenciacao || 'Seção não encontrada',
    'mapa_linguagem': mapaLinguagem || 'Seção não encontrada',
    'voz_marca': vozMarca || 'Seção não encontrada',

    // SEÇÕES DO AGENT 6
    'analise_concorrentes': analiseConcorrentes || 'Seção não encontrada',
    'oportunidades_diferenciacao': oportunidadesDiferenciacao || 'Seção não encontrada',
    'tendencias_nicho': tendenciasNicho || 'Seção não encontrada',

    // SEÇÕES DO AGENT 7
    'cliente_ideal_definicao': clienteIdealDefinicao || 'Seção não encontrada',
    'dores_mapeadas': doresMapeadas || 'Seção não encontrada',
    'desejos_centrais': desejosCentrais || 'Seção não encontrada',
    'crencas_limitantes': crencasLimitantes,

    // SEÇÃO DO AGENT 8
    'promessa_central': promessaCentral || 'Seção não encontrada',

    // SEÇÃO DO AGENT 9
    'mecanismo_unico': mecanismoUnico || 'Seção não encontrada',

    // METADADOS
    'extraction_timestamp': new Date().toISOString(),
    'sections_extracted': 13,
    'agent6_cleaned': !agent6Cleaned.includes('<think>'),
    'debug_info': debugInfo,
    'success': true
  }
}];

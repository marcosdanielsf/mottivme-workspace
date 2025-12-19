// ====================================
// CODE APÓS AGENT 9 (ÚLTIMO - PROCESSA TUDO)
// ====================================

const previousData = $input.first().json;
const agent9Data = previousData;

// Agora temos TODOS os agents acumulados
const agent5 = previousData.agent5?.text || previousData.agent5?.output || '';
const agent6a = previousData.agent6a?.text || previousData.agent6a?.output || '';
const agent6b = previousData.agent6b?.text || previousData.agent6b?.output || '';
const agent6c = previousData.agent6c?.text || previousData.agent6c?.output || '';
const agent7 = previousData.agent7?.text || previousData.agent7?.output || '';
const agent8 = previousData.agent8?.text || previousData.agent8?.output || '';
const agent9 = agent9Data?.text || agent9Data?.output || '';

// Limpar tag <think> dos Agents 6 (Perplexity)
let agent6aCleaned = agent6a;
if (agent6aCleaned.includes('<think>')) {
  agent6aCleaned = agent6aCleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

let agent6bCleaned = agent6b;
if (agent6bCleaned.includes('<think>')) {
  agent6bCleaned = agent6bCleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

let agent6cCleaned = agent6c;
if (agent6cCleaned.includes('<think>')) {
  agent6cCleaned = agent6cCleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// ====================================
// FUNÇÃO DE EXTRAÇÃO
// ====================================
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
// EXTRAÇÕES DO AGENT 6A (Internacional)
// ====================================
const concorrentesInternacionais = extractSection(
  agent6aCleaned,
  [
    '## ANÁLISE COMPETITIVA INTERNACIONAL',
    '### Top Players',
    'PLAYERS INTERNACIONAIS'
  ],
  null,
  8000
) || agent6aCleaned.substring(0, 8000);

// ====================================
// EXTRAÇÕES DO AGENT 6B (Brasil)
// ====================================
const concorrentesBrasileiros = extractSection(
  agent6bCleaned,
  [
    '## ANÁLISE COMPETITIVA BRASIL',
    '### Top Players',
    'PLAYERS BRASILEIROS'
  ],
  null,
  8000
) || agent6bCleaned.substring(0, 8000);

// ====================================
// EXTRAÇÕES DO AGENT 6C (Synthesis Report)
// ====================================
const analiseConcorrentes = extractSection(
  agent6cCleaned,
  [
    '## 3. PANORAMA COMPETITIVO',
    '### Top Players Internacionais',
    'PANORAMA COMPETITIVO - CONSOLIDADO'
  ],
  '## 4'
) || extractSection(agent6cCleaned, ['### Top Players Internacionais'], '### Top Players Brasileiros');

const oportunidadesDiferenciacao = extractSection(
  agent6cCleaned,
  [
    '## 4. GAPS ESTRATEGICOS',
    '### GAP 1:',
    'GAPS ESTRATEGICOS E OPORTUNIDADES'
  ],
  '## 5'
) || extractSection(agent6cCleaned, ['### GAP 1:'], '## 5');

const tendenciasNicho = extractSection(
  agent6cCleaned,
  [
    '## 5. ANALISE DE TENDENCIAS',
    '### Tendencias Globais',
    'ANALISE DE TENDENCIAS - CONSOLIDADA'
  ],
  '## 6'
) || extractSection(agent6cCleaned, ['### Tendencias Globais'], '## 6');

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
// DEBUG
// ====================================
const debugInfo = {
  agent5Found: !!agent5,
  agent6aFound: !!agent6a,
  agent6bFound: !!agent6b,
  agent6cFound: !!agent6c,
  agent7Found: !!agent7,
  agent8Found: !!agent8,
  agent9Found: !!agent9,
  agent5Length: agent5.length,
  agent6aLength: agent6a.length,
  agent6bLength: agent6b.length,
  agent6cLength: agent6c.length,
  agent7Length: agent7.length,
  agent8Length: agent8.length,
  agent9Length: agent9.length,
  accumulatedAgents: previousData._accumulated
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

    // SEÇÕES DO AGENT 6A, 6B, 6C
    'concorrentes_internacionais': concorrentesInternacionais || 'Seção não encontrada',
    'concorrentes_brasileiros': concorrentesBrasileiros || 'Seção não encontrada',
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
    'sections_extracted': 15,
    'agents_cleaned': {
      agent6a: !agent6aCleaned.includes('<think>'),
      agent6b: !agent6bCleaned.includes('<think>'),
      agent6c: !agent6cCleaned.includes('<think>')
    },
    'debug_info': debugInfo,
    'success': true
  }
}];

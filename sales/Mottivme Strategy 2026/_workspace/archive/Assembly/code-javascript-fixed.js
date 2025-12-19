// Pegar outputs dos agentes - NOMES CORRIGIDOS
const agent5 = $('output AGENTE 5: IDENTITY MAPPER').first().json.text || '';
const agent6 = $('output 6c - AGENTE 6C: SINTESE DE MERCADO E ANALISE ESTRATEGICA').first().json.output || '';
const agent7 = $('output 7  AVATARES PSICOLÓGICOS').first().json.text || '';
const agent8 = $('output 8 - PROMESSA CENTRAL').first().json.text || '';
const agent9 = $('output 9  bigidea').first().json.text || '';

// Variáveis para armazenar valores processados
let agent6Cleaned = agent6;

// ====================================
// LIMPAR TAG <think> DO AGENT 6 (PERPLEXITY)
// ====================================
if (agent6Cleaned.includes('<think>')) {
  // Remove tudo entre <think> e </think>
  agent6Cleaned = agent6Cleaned.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// ====================================
// FUNÇÃO DE EXTRAÇÃO
// ====================================
function extractSection(text, possibleMarkers, endMarker = null) {
  if (!text) return null;

  for (let marker of possibleMarkers) {
    const startIndex = text.indexOf(marker);
    if (startIndex !== -1) {
      const searchStart = startIndex + marker.length;

      if (!endMarker) {
        const extracted = text.substring(searchStart).trim();
        return extracted.substring(0, 3000);
      }

      const endIndex = text.indexOf(endMarker, searchStart);
      const extracted = text.substring(searchStart, endIndex === -1 ? text.length : endIndex).trim();
      return extracted.substring(0, 3000);
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
    '## IDENTIDADE ORGANIZACIONAL'
  ],
  '## 4.'
);

const causaDiferenciacao = extractSection(
  agent5,
  [
    '## 4. CAUSA E DIFERENCIAÇÃO',
    '## CAUSA E DIFERENCIAÇÃO'
  ],
  '## 5.'
);

const mapaLinguagem = extractSection(
  agent5,
  [
    '## 5. MAPA DE LINGUAGEM E POSTURA',
    '## MAPA DE LINGUAGEM'
  ],
  '## 6.'
);

const vozMarca = extractSection(
  agent5,
  [
    '## 6. ESSÊNCIA DA MARCA EM UMA PÁGINA',
    '## ESSÊNCIA DA MARCA'
  ],
  null
);

// ====================================
// EXTRAÇÕES DO AGENT 6 (Synthesis Report)
// USANDO ESTRUTURA DO RELATÓRIO CONSOLIDADO
// ====================================

// ANÁLISE DE CONCORRENTES (Seção 3: PANORAMA COMPETITIVO)
const analiseConcorrentes = extractSection(
  agent6Cleaned,
  [
    '## 3. PANORAMA COMPETITIVO - CONSOLIDADO',
    '## 3. PANORAMA COMPETITIVO',
    '### Top Players Internacionais'
  ],
  '## 4.'
);

// OPORTUNIDADES DE DIFERENCIAÇÃO (Seção 4: GAPS ESTRATÉGICOS)
const oportunidadesDiferenciacao = extractSection(
  agent6Cleaned,
  [
    '## 4. GAPS ESTRATEGICOS E OPORTUNIDADES',
    '## 4. GAPS ESTRATEGICOS',
    '### GAP 1:'
  ],
  '## 5.'
);

// TENDÊNCIAS DO NICHO (Seção 5: ANÁLISE DE TENDÊNCIAS)
const tendenciasNicho = extractSection(
  agent6Cleaned,
  [
    '## 5. ANALISE DE TENDENCIAS - CONSOLIDADA',
    '## 5. ANALISE DE TENDENCIAS',
    '### Tendencias Globais'
  ],
  '## 6.'
);

// ====================================
// EXTRAÇÕES DO AGENT 7 (Avatares)
// ====================================

const clienteIdealDefinicao = extractSection(
  agent7,
  [
    '## 🎯 DEFINIÇÃO DO CLIENTE IDEAL COMPOSTO',
    '## DEFINIÇÃO DO CLIENTE IDEAL COMPOSTO',
    '### Cliente Ideal ='
  ],
  '## 🎬'
);

const doresMapeadas = extractSection(
  agent7,
  [
    '### Dores (Pain Points)',
    '#### Dor Externa (Sintoma)'
  ],
  '### Desejos'
);

const desejosCentrais = extractSection(
  agent7,
  [
    '### Desejos',
    '#### Desejo Superficial'
  ],
  '### Gatilhos de Compra'
);

const crencasLimitantes = extractSection(
  agent7,
  [
    '### Crenças Limitantes',
    '#### Crenças'
  ],
  '##'
) || 'Não mapeado explicitamente nos avatares';

// ====================================
// EXTRAÇÕES DO AGENT 9 (Big Idea)
// ====================================

const mecanismoUnico = extractSection(
  agent9,
  [
    '## ANATOMIA DO BIG IDEA ESCOLHIDO',
    '### Nome do Mecanismo'
  ],
  '## DIFERENCIAÇÃO COMPETITIVA'
);

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

    // SEÇÕES DO AGENT 6 (PERPLEXITY - CORRIGIDO)
    'analise_concorrentes': analiseConcorrentes || 'Seção não encontrada',
    'oportunidades_diferenciacao': oportunidadesDiferenciacao || 'Seção não encontrada',
    'tendencias_nicho': tendenciasNicho || 'Seção não encontrada',

    // SEÇÕES DO AGENT 7
    'cliente_ideal_definicao': clienteIdealDefinicao || 'Seção não encontrada',
    'dores_mapeadas': doresMapeadas || 'Seção não encontrada',
    'desejos_centrais': desejosCentrais || 'Seção não encontrada',
    'crencas_limitantes': crencasLimitantes,

    // SEÇÕES DO AGENT 9
    'mecanismo_unico': mecanismoUnico || 'Seção não encontrada',

    // METADADOS
    'extraction_timestamp': new Date().toISOString(),
    'sections_extracted': 12,
    'agent6_cleaned': !agent6Cleaned.includes('<think>'), // Verifica se limpou o think
    'success': true
  }
}];

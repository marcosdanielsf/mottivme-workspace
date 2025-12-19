// ====================================
// ESTRATÉGIA: Usar $input.all() para pegar TODOS os dados
// que chegam neste nó, independente do nome do nó anterior
// ====================================

const allInputs = $input.all();

// Função para encontrar dados por tipo de conteúdo
function findDataByContent(inputs, keywords) {
  for (const input of inputs) {
    const jsonStr = JSON.stringify(input.json).toLowerCase();
    if (keywords.some(keyword => jsonStr.includes(keyword.toLowerCase()))) {
      return input.json;
    }
  }
  return null;
}

// Extrair dados de cada agente baseado em palavras-chave únicas
const agent5Data = findDataByContent(allInputs, ['identidade organizacional', 'princípios de vida', 'arquétipo']);
const agent6Data = findDataByContent(allInputs, ['panorama competitivo', 'gaps estrategicos', 'síntese de mercado']);
const agent7Data = findDataByContent(allInputs, ['avatares psicológicos', 'cliente ideal', 'dores pain points']);
const agent8Data = findDataByContent(allInputs, ['promessa central', 'versão principal', 'eu ajudo']);
const agent9Data = findDataByContent(allInputs, ['big idea', 'mecanismo único', 'protocolo operador']);

// Pegar o texto de cada agente
const agent5 = agent5Data?.text || '';
const agent6 = agent6Data?.output || agent6Data?.text || '';
const agent7 = agent7Data?.text || '';
const agent8 = agent8Data?.text || '';
const agent9 = agent9Data?.text || '';

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
// DEBUG: Informações sobre o que foi encontrado
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
  agent9Length: agent9.length
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
    'agent6_cleaned': !agent6Cleaned.includes('<think>'),
    'debug_info': debugInfo,
    'success': true
  }
}];

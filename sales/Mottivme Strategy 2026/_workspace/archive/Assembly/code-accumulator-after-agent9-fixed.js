// ====================================
// CODE APÓS AGENT 9 (ÚLTIMO - PROCESSA TUDO) - FIXED
// ====================================

const inputData = $input.first().json;

// Se tem _accumulated, é o fim da cadeia de acumulação
if (inputData._accumulated) {
  // Adicionar agent9 aos dados acumulados
  const previousData = {
    ...inputData,
    agent9: inputData.agent9 || inputData,
    _accumulated: [...inputData._accumulated, 'agent9']
  };

  // Agora extrair todos os agents acumulados
  const agent5 = previousData.agent5?.text || previousData.agent5?.output || '';
  const agent6a = previousData.agent6a?.text || previousData.agent6a?.output || '';
  const agent6b = previousData.agent6b?.text || previousData.agent6b?.output || '';
  const agent6c = previousData.agent6c?.text || previousData.agent6c?.output || '';
  const agent7 = previousData.agent7?.text || previousData.agent7?.output || '';
  const agent8 = previousData.agent8?.text || previousData.agent8?.output || '';
  const agent9 = previousData.agent9?.text || previousData.agent9?.output || '';

  // Limpar tags <think>
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

  // FUNÇÃO DE EXTRAÇÃO
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

  // EXTRAÇÕES...
  const identidadeOrganizacional = extractSection(agent5, ['## 3. IDENTIDADE ORGANIZACIONAL'], '## 4');
  const causaDiferenciacao = extractSection(agent5, ['## 4. CAUSA E DIFERENCIAÇÃO'], '## 5');
  const mapaLinguagem = extractSection(agent5, ['## 5. MAPA DE LINGUAGEM'], '## 6');
  const vozMarca = extractSection(agent5, ['## 6. ESSÊNCIA DA MARCA'], null);

  const concorrentesInternacionais = agent6aCleaned.substring(0, 8000);
  const concorrentesBrasileiros = agent6bCleaned.substring(0, 8000);
  const analiseConcorrentes = extractSection(agent6cCleaned, ['## 3. PANORAMA COMPETITIVO'], '## 4');
  const oportunidadesDiferenciacao = extractSection(agent6cCleaned, ['## 4. GAPS ESTRATEGICOS'], '## 5');
  const tendenciasNicho = extractSection(agent6cCleaned, ['## 5. ANALISE DE TENDENCIAS'], '## 6');

  const clienteIdealDefinicao = extractSection(agent7, ['## 🎯 DEFINIÇÃO DO CLIENTE IDEAL'], '## 🎬');
  const doresMapeadas = extractSection(agent7, ['### Dores (Pain Points)'], '### Desejos', 8000);
  const desejosCentrais = extractSection(agent7, ['### Desejos'], '### Gatilhos', 8000);
  const crencasLimitantes = extractSection(agent7, ['### Crenças Limitantes'], '### Gatilhos', 5000) || 'Não mapeado';

  const promessaCentral = extractSection(agent8, ['## PROMESSA CENTRAL FINAL'], '## PROCESSO', 3000);

  const mecanismoUnico = extractSection(agent9, ['## ANATOMIA DO BIG IDEA'], '## DIFERENCIAÇÃO', 5000);

  // DEBUG
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

  // RETORNAR
  return [{
    json: {
      identidade_organizacional: identidadeOrganizacional || 'Seção não encontrada',
      causa_diferenciacao: causaDiferenciacao || 'Seção não encontrada',
      mapa_linguagem: mapaLinguagem || 'Seção não encontrada',
      voz_marca: vozMarca || 'Seção não encontrada',

      concorrentes_internacionais: concorrentesInternacionais || 'Seção não encontrada',
      concorrentes_brasileiros: concorrentesBrasileiros || 'Seção não encontrada',
      analise_concorrentes: analiseConcorrentes || 'Seção não encontrada',
      oportunidades_diferenciacao: oportunidadesDiferenciacao || 'Seção não encontrada',
      tendencias_nicho: tendenciasNicho || 'Seção não encontrada',

      cliente_ideal_definicao: clienteIdealDefinicao || 'Seção não encontrada',
      dores_mapeadas: doresMapeadas || 'Seção não encontrada',
      desejos_centrais: desejosCentrais || 'Seção não encontrada',
      crencas_limitantes: crencasLimitantes,

      promessa_central: promessaCentral || 'Seção não encontrada',
      mecanismo_unico: mecanismoUnico || 'Seção não encontrada',

      extraction_timestamp: new Date().toISOString(),
      sections_extracted: 15,
      agents_cleaned: {
        agent6a: !agent6aCleaned.includes('<think>'),
        agent6b: !agent6bCleaned.includes('<think>'),
        agent6c: !agent6cCleaned.includes('<think>')
      },
      debug_info: debugInfo,
      success: true
    }
  }];
}

// Se NÃO tem _accumulated, significa que estamos recebendo só o expert_id
// Retornar erro explicativo
return [{
  json: {
    error: 'Dados de acumulação não encontrados',
    message: 'O Agent 9 não está recebendo os dados acumulados dos agents anteriores',
    received: inputData,
    solution: 'Verifique se o Agent 9 está conectado APÓS o Code8 no workflow',
    success: false
  }
}];

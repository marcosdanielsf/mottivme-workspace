// ====================================
// CODE: Tendências do Nicho
// ====================================
// Extrai e estrutura tendências do nicho identificadas pelos agentes

const previousData = $input.first().json;
const agentData = previousData.agent7 || previousData;

// Extrai tendências do texto do agente
const rawText = agentData.output || agentData.text || '';

// Estrutura as tendências
const tendencias_nicho = {
  tendencias_emergentes: extractEmergingTrends(rawText),
  mudancas_comportamento: extractBehaviorChanges(rawText),
  tecnologias_impactantes: extractTechnologies(rawText),
  previsoes_mercado: extractMarketPredictions(rawText),
  oportunidades_timing: extractTimingOpportunities(rawText),
  riscos_ameacas: extractThreats(rawText)
};

function extractEmergingTrends(text) {
  const section = text.match(/tendências?[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1]
    .split(/[•\-\n]/)
    .filter(s => s.trim().length > 10)
    .map(s => ({
      tendencia: s.trim(),
      relevancia: calculateRelevance(s),
      fonte: 'Análise de mercado'
    }));
}

function extractBehaviorChanges(text) {
  const keywords = ['comportamento', 'mudança', 'shift', 'transição'];
  const changes = [];

  keywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        changes.push({
          mudanca: match.trim(),
          impacto: 'Médio'
        });
      });
    }
  });

  return changes;
}

function extractTechnologies(text) {
  const techKeywords = ['ia', 'inteligência artificial', 'automação', 'digital', 'tecnologia', 'plataforma', 'app', 'software'];
  const technologies = [];

  techKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        technologies.push({
          tecnologia: match.trim(),
          maturidade: 'Em crescimento'
        });
      });
    }
  });

  return technologies.slice(0, 5);
}

function extractMarketPredictions(text) {
  const futureKeywords = ['futuro', 'próximos', 'tendência', 'previsão', 'crescimento'];
  const predictions = [];

  futureKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        predictions.push({
          previsao: match.trim(),
          horizonte: 'Curto prazo (1-2 anos)',
          confianca: 'Média'
        });
      });
    }
  });

  return predictions.slice(0, 5);
}

function extractTimingOpportunities(text) {
  const urgencyKeywords = ['agora', 'momento', 'timing', 'janela', 'oportunidade'];
  const opportunities = [];

  urgencyKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        opportunities.push({
          oportunidade: match.trim(),
          urgencia: 'Alta',
          duracao_estimada: 'Limitada'
        });
      });
    }
  });

  return opportunities.slice(0, 3);
}

function extractThreats(text) {
  const threatKeywords = ['risco', 'ameaça', 'desafio', 'problema', 'barreira'];
  const threats = [];

  threatKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        threats.push({
          ameaca: match.trim(),
          severidade: 'Média',
          mitigacao: 'Monitorar'
        });
      });
    }
  });

  return threats.slice(0, 5);
}

function calculateRelevance(text) {
  const highImpactWords = ['revolucion', 'transform', 'disrupt', 'fundamental', 'crítico'];
  const hasHighImpact = highImpactWords.some(word =>
    text.toLowerCase().includes(word)
  );
  return hasHighImpact ? 'Alta' : 'Média';
}

return [{
  json: {
    ...previousData,
    tendencias_nicho: tendencias_nicho
  }
}];

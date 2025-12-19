// ====================================
// CODE: Oportunidades de Diferenciação
// ====================================
// Identifica oportunidades de diferenciação com base na análise de concorrentes

const previousData = $input.first().json;
const analiseConcorrentes = previousData.analise_concorrentes || {};
const agentData = previousData.agent7 || previousData;

// Extrai oportunidades do texto do agente
const rawText = agentData.output || agentData.text || '';

// Identifica gaps e oportunidades
const oportunidades_diferenciacao = {
  gaps_mercado: identifyGaps(rawText, analiseConcorrentes),
  propostas_valor: extractValueProps(rawText),
  nichos_inexplorados: extractUntappedNiches(rawText),
  inovacoes_sugeridas: extractInnovations(rawText),
  estrategias_posicionamento: extractStrategies(rawText),
  prioridades: rankOpportunities(rawText)
};

function identifyGaps(text, analise) {
  const gaps = [];
  const weaknesses = analise.pontos_fracos || [];

  weaknesses.forEach(weakness => {
    gaps.push({
      gap: weakness,
      oportunidade: `Explorar lacuna: ${weakness}`,
      potencial: 'Alto'
    });
  });

  const gapSection = text.match(/gaps?[:\s]+([^#]+)/i);
  if (gapSection) {
    const extractedGaps = gapSection[1].split(/[•\-\n]/).filter(s => s.trim().length > 10);
    extractedGaps.forEach(gap => {
      gaps.push({
        gap: gap.trim(),
        oportunidade: gap.trim(),
        potencial: 'Médio'
      });
    });
  }

  return gaps;
}

function extractValueProps(text) {
  const section = text.match(/proposta[s]? de valor[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractUntappedNiches(text) {
  const section = text.match(/nichos?[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractInnovations(text) {
  const section = text.match(/inovações?[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractStrategies(text) {
  const section = text.match(/estratégias?[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function rankOpportunities(text) {
  const priorities = [];
  const keywords = ['urgente', 'prioritário', 'imediato', 'rápido ganho', 'quick win'];

  keywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[:\s]+([^\\n]+)`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        priorities.push({
          prioridade: 'Alta',
          acao: match.replace(new RegExp(keyword, 'i'), '').trim()
        });
      });
    }
  });

  return priorities.length > 0 ? priorities : [
    { prioridade: 'Alta', acao: 'Analisar gaps identificados' },
    { prioridade: 'Média', acao: 'Desenvolver propostas de valor únicas' },
    { prioridade: 'Média', acao: 'Explorar nichos inexplorados' }
  ];
}

return [{
  json: {
    ...previousData,
    oportunidades_diferenciacao: oportunidades_diferenciacao
  }
}];

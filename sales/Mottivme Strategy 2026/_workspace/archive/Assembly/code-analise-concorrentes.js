// ====================================
// CODE: Análise de Concorrentes
// ====================================
// Transforma dados do agente em análise estruturada de concorrentes

const previousData = $input.first().json;
const agentData = previousData.agent7 || previousData;

// Extrai informações dos concorrentes do output do agente
const rawAnalysis = agentData.output || agentData.text || '';

// Estrutura a análise de concorrentes
const analise_concorrentes = {
  concorrentes_principais: extractCompetitors(rawAnalysis),
  pontos_fortes: extractStrengths(rawAnalysis),
  pontos_fracos: extractWeaknesses(rawAnalysis),
  diferenciais: extractDifferentiators(rawAnalysis),
  posicionamento: extractPositioning(rawAnalysis),
  resumo: rawAnalysis.substring(0, 500) + '...'
};

function extractCompetitors(text) {
  const matches = text.match(/concorrentes?[:\s]+([^\n]+)/gi) || [];
  return matches.map(m => m.replace(/concorrentes?[:\s]+/i, '').trim());
}

function extractStrengths(text) {
  const section = text.match(/pontos fortes[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractWeaknesses(text) {
  const section = text.match(/pontos fracos[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractDifferentiators(text) {
  const section = text.match(/diferenciais?[:\s]+([^#]+)/i);
  if (!section) return [];
  return section[1].split(/[•\-\n]/).filter(s => s.trim().length > 10).map(s => s.trim());
}

function extractPositioning(text) {
  const section = text.match(/posicionamento[:\s]+([^#]+)/i);
  return section ? section[1].trim() : 'Posicionamento não identificado';
}

return [{
  json: {
    ...previousData,
    analise_concorrentes: analise_concorrentes
  }
}];

// ====================================
// CODE: Cliente Ideal - Definição
// ====================================
// Estrutura a definição completa do cliente ideal (Avatar)

const previousData = $input.first().json;
const agentData = previousData.agent8 || previousData;

// Extrai informações do avatar do texto do agente
const rawText = agentData.output || agentData.text || '';

// Estrutura a definição do cliente ideal
const cliente_ideal_definicao = {
  perfil_demografico: extractDemographics(rawText),
  perfil_psicografico: extractPsychographics(rawText),
  situacao_atual: extractCurrentSituation(rawText),
  objetivos_aspiracoes: extractGoals(rawText),
  desafios_obstaculos: extractChallenges(rawText),
  comportamento_compra: extractBuyingBehavior(rawText),
  canais_preferidos: extractPreferredChannels(rawText),
  jornada_cliente: extractCustomerJourney(rawText),
  mensagem_ideal: extractIdealMessage(rawText)
};

function extractDemographics(text) {
  return {
    idade: extractPattern(text, /idade[:\s]+(\d+[-\s]?\d*\s*anos?)/i) || '35-45 anos',
    genero: extractPattern(text, /gênero[:\s]+([^\n,]+)/i) || 'Todos',
    localizacao: extractPattern(text, /localização[:\s]+([^\n,]+)/i) || 'Brasil',
    renda: extractPattern(text, /renda[:\s]+([^\n,]+)/i) || 'Classe média-alta',
    educacao: extractPattern(text, /educação[:\s]+([^\n,]+)/i) || 'Superior completo',
    ocupacao: extractPattern(text, /ocupação[:\s]+([^\n,]+)/i) || 'Profissional'
  };
}

function extractPsychographics(text) {
  return {
    valores: extractList(text, /valores?[:\s]+([^#]+)/i),
    estilo_vida: extractPattern(text, /estilo de vida[:\s]+([^\n]+)/i) || 'Ativo e conectado',
    personalidade: extractList(text, /personalidade[:\s]+([^#]+)/i),
    interesses: extractList(text, /interesses?[:\s]+([^#]+)/i),
    motivacoes: extractList(text, /motivações?[:\s]+([^#]+)/i)
  };
}

function extractCurrentSituation(text) {
  const situation = extractPattern(text, /situação atual[:\s]+([^#]+)/i);
  return situation || 'Cliente em busca de transformação e crescimento profissional/pessoal';
}

function extractGoals(text) {
  return extractList(text, /objetivos?[:\s]+([^#]+)/i) || [
    'Alcançar próximo nível profissional',
    'Aumentar renda',
    'Ter mais reconhecimento'
  ];
}

function extractChallenges(text) {
  return extractList(text, /desafios?[:\s]+([^#]+)/i) || [
    'Falta de clareza sobre próximos passos',
    'Recursos limitados',
    'Tempo escasso'
  ];
}

function extractBuyingBehavior(text) {
  return {
    processo_decisao: extractPattern(text, /decisão[:\s]+([^\n]+)/i) || 'Analítico e criterioso',
    gatilhos_compra: extractList(text, /gatilhos?[:\s]+([^#]+)/i),
    objecoes_comuns: extractList(text, /objeções?[:\s]+([^#]+)/i),
    investimento_medio: extractPattern(text, /investimento[:\s]+([^\n]+)/i) || 'Médio-alto',
    ciclo_compra: 'Médio (2-4 semanas)'
  };
}

function extractPreferredChannels(text) {
  const channels = extractList(text, /canais?[:\s]+([^#]+)/i);
  return channels.length > 0 ? channels : [
    'Instagram',
    'LinkedIn',
    'Email',
    'WhatsApp',
    'Webinars'
  ];
}

function extractCustomerJourney(text) {
  return {
    conscientizacao: 'Descoberta através de redes sociais ou indicação',
    consideracao: 'Pesquisa de conteúdos e comparação de autoridades',
    decisao: 'Participação em conteúdo gratuito antes da compra',
    pos_venda: 'Busca implementação rápida e suporte contínuo'
  };
}

function extractIdealMessage(text) {
  const message = extractPattern(text, /mensagem[:\s]+([^#]+)/i);
  return message || 'Transforme sua expertise em resultados concretos e reconhecimento no mercado';
}

function extractPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractList(text, regex) {
  const match = text.match(regex);
  if (!match) return [];

  return match[1]
    .split(/[•\-\n]/)
    .filter(s => s.trim().length > 5)
    .map(s => s.trim())
    .slice(0, 5);
}

return [{
  json: {
    ...previousData,
    cliente_ideal_definicao: cliente_ideal_definicao
  }
}];

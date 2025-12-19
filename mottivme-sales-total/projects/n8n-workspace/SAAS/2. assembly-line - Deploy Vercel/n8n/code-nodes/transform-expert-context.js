// ====================================
// 🔄 TRANSFORM EXPERT CONTEXT
// ====================================
//
// Substitui o Code Node "Code in JavaScript" original
// Adapta o formato do Supabase para o contexto dos agentes
//
// INPUT: Resultado da função get_expert_data do Supabase
// OUTPUT: expert_context formatado para os agentes de IA
// ====================================

const data = $input.first().json;

// Dados vêm do Supabase agora (estrutura diferente do Airtable)
const project = data.project || {};
const briefing = data.briefing || {};
const clone = data.clone || {};
const offers = data.offers || {};

function getValue(obj, field) {
  if (!obj || !obj[field]) return null;
  if (obj[field] === '') return null;
  return obj[field];
}

function formatSection(title, content) {
  if (!content || (typeof content === 'string' && content.trim() === '')) return '';
  if (typeof content === 'object') content = JSON.stringify(content, null, 2);
  return `\n### ${title}\n${content}\n`;
}

// ====================================
// MONTA O CONTEXTO ESTRUTURADO
// ====================================

let context = `# 🧬 PERFIL COMPLETO DO EXPERT\n`;
context += `Este é o perfil detalhado extraído do briefing e dados do projeto.\n`;
context += `\n---\n`;

// ====================================
// SEÇÃO 1: DADOS BÁSICOS
// ====================================
context += `\n## 📋 DADOS BÁSICOS DO EXPERT\n`;
context += `\n**Nome:** ${project.name || 'Não informado'}\n`;
context += `**Nicho:** ${getValue(briefing, 'nicho') || 'Não informado'}\n`;
context += `**Produto:** ${getValue(briefing, 'produto') || 'Não informado'}\n`;

// ====================================
// SEÇÃO 2: BRIEFING
// ====================================
context += `\n---\n`;
context += `\n## 🎯 BRIEFING\n`;

context += formatSection('Avatar/Público-Alvo', getValue(briefing, 'avatar_descricao'));
context += formatSection('Dor Principal', getValue(briefing, 'dor_principal'));
context += formatSection('Desejo Principal', getValue(briefing, 'desejo_principal'));
context += formatSection('Transformação Prometida', getValue(briefing, 'transformacao'));
context += formatSection('Diferencial', getValue(briefing, 'diferencial'));
context += formatSection('Ticket Médio', getValue(briefing, 'ticket_medio'));
context += formatSection('Tipo de Funil', getValue(briefing, 'tipo_funil'));
context += formatSection('Tom de Comunicação', getValue(briefing, 'tom_comunicacao'));

// ====================================
// SEÇÃO 3: CLONE (se já existe)
// ====================================
if (clone && clone.system_prompt) {
  context += `\n---\n`;
  context += `\n## 🧬 CLONE SYSTEM PROMPT (EXISTENTE)\n`;
  context += `\n\`\`\`\n`;
  context += clone.system_prompt;
  context += `\n\`\`\`\n`;
}

if (clone && clone.dna_psicologico) {
  context += formatSection('DNA Psicológico', clone.dna_psicologico);
}

if (clone && clone.engenharia_reversa) {
  context += formatSection('Engenharia Reversa', clone.engenharia_reversa);
}

// ====================================
// SEÇÃO 4: POSICIONAMENTO (se já existe)
// ====================================
if (clone && clone.sintese_estrategica) {
  context += `\n---\n`;
  context += `\n## 📊 POSICIONAMENTO ESTRATÉGICO\n`;
  context += formatSection('Síntese Estratégica', clone.sintese_estrategica);
  context += formatSection('Análise de Concorrentes', clone.analise_concorrentes);
}

// ====================================
// SEÇÃO 5: OFERTAS (se já existe)
// ====================================
if (offers && offers.avatar) {
  context += `\n---\n`;
  context += `\n## 💰 ECOSSISTEMA DE OFERTAS\n`;
  context += formatSection('Avatar Detalhado', offers.avatar);
  context += formatSection('Promessas', offers.promessas);
  context += formatSection('Big Idea', offers.big_idea);
  context += formatSection('High Ticket', offers.high_ticket);
  context += formatSection('Frontend', offers.frontend);
}

context += `\n---\n`;
context += `\n*Contexto gerado automaticamente a partir do Supabase.*\n`;

// ====================================
// RETORNA RESULTADO
// ====================================
return [{
  json: {
    expert_context: context,
    expert_name: project.name,
    expert_id: project.id,
    project_id: project.id,
    nicho: getValue(briefing, 'nicho'),
    clone_system_prompt: clone?.system_prompt || null,
    has_clone: !!clone?.system_prompt,
    has_posicionamento: !!clone?.sintese_estrategica,
    has_ofertas: !!offers?.avatar,
    context_length: context.length,
    timestamp: new Date().toISOString(),

    // Passa dados originais para uso nos agentes
    _project: project,
    _briefing: briefing,
    _clone: clone,
    _offers: offers
  }
}];

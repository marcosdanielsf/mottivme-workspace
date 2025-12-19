// ====================================
// PREPARAR DADOS PARA AIRTABLE
// Após o Code9 (Final), prepara os dados no formato que o Airtable espera
// ====================================

const extractedData = $input.first().json;

// Pegar o expert_id do contexto anterior (se disponível)
// Você pode ajustar isso dependendo de onde vem o expert_id
const expertId = extractedData.expert_id || $('Get Expert Record')?.item?.json?.id || '';

return [{
  json: {
    // ID do expert (necessário para update)
    expert_id: expertId,

    // ===== AGENT 5 - IDENTITY MAP =====
    'identidade_organizacional': extractedData.identidade_organizacional,
    'causa_diferenciacao': extractedData.causa_diferenciacao,
    'mapa_linguagem': extractedData.mapa_linguagem,
    'voz_marca': extractedData.voz_marca,

    // ===== AGENT 6A, 6B, 6C - MARKET INTELLIGENCE =====
    'concorrentes_internacionais': extractedData.concorrentes_internacionais,
    'concorrentes_brasileiros': extractedData.concorrentes_brasileiros,
    'analise_concorrentes': extractedData.analise_concorrentes,
    'oportunidades_diferenciacao': extractedData.oportunidades_diferenciacao,
    'tendencias_nicho': extractedData.tendencias_nicho,

    // ===== AGENT 7 - AVATARES =====
    'cliente_ideal_definicao': extractedData.cliente_ideal_definicao,
    'dores_mapeadas': extractedData.dores_mapeadas,
    'desejos_centrais': extractedData.desejos_centrais,
    'crencas_limitantes': extractedData.crencas_limitantes,

    // ===== AGENT 8 - PROMESSA =====
    'promessa_central': extractedData.promessa_central,

    // ===== AGENT 9 - BIG IDEA =====
    'mecanismo_unico': extractedData.mecanismo_unico,

    // ===== METADADOS =====
    'extraction_timestamp': extractedData.extraction_timestamp,
    'sections_extracted': extractedData.sections_extracted,
    'success': extractedData.success,

    // Debug info (opcional - remover se não quiser salvar)
    'debug_info': JSON.stringify(extractedData.debug_info)
  }
}];

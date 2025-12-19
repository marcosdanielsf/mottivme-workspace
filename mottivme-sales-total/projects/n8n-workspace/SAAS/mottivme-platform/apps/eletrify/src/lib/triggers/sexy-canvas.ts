// OS 14 GATILHOS DO SEXY CANVAS
// Baseado na metodologia de André Diamand

export type TriggerCategory = "pecados" | "crianca";
export type TriggerIntensity = 1 | 2 | 3 | 4 | 5;

export interface Trigger {
  id: string;
  name: string;
  emoji: string;
  category: TriggerCategory;
  description: string;
  howToActivate: string[];
  examples: string[];
  avoidWhen: string[];
}

// BLOCO 1: 7 PECADOS CAPITAIS
export const PECADOS: Record<string, Trigger> = {
  VAIDADE: {
    id: "vaidade",
    name: "Vaidade",
    emoji: "👑",
    category: "pecados",
    description: "Desejo de se sentir SUPERIOR aos outros, ser admirado, reconhecido.",
    howToActivate: [
      "Posicione o cliente como parte de um grupo SELETO",
      "Use palavras: 'exclusivo', 'VIP', 'seleto', 'elite'",
      "Crie barreiras de entrada (login, aprovação, convite)",
      "Mostre que ele terá algo que os outros NÃO têm",
    ],
    examples: [
      "Acesso reservado para os 3% que realmente querem resultados",
      "Apenas [Nome], você foi selecionado para...",
      "Este documento NÃO será enviado para mais ninguém",
    ],
    avoidWhen: ["Público muito humilde", "Produtos de necessidade básica"],
  },
  AVAREZA: {
    id: "avareza",
    name: "Avareza/Ganância",
    emoji: "💰",
    category: "pecados",
    description: "Foco em SI MESMO, acumular riqueza, maximizar ganhos.",
    howToActivate: [
      "Mostre o RETORNO financeiro claro",
      "Use números específicos (não genéricos)",
      "Apresente economia, desconto, multiplicação",
      "Ancoragem de preço (valor real vs. valor ofertado)",
    ],
    examples: [
      "Economia de R$ 53.982 (45% de desconto)",
      "ROI de 847% nos primeiros 90 dias",
      "Cada R$ 1 investido retorna R$ 8,47",
    ],
    avoidWhen: ["Quando quer parecer premium demais", "Público que não liga para dinheiro"],
  },
  LUXURIA: {
    id: "luxuria",
    name: "Luxúria",
    emoji: "🔥",
    category: "pecados",
    description: "Desejo por coisas CARAS, ostentação, prazer material, sensorialidade.",
    howToActivate: [
      "Design premium (dourado, preto, minimalista)",
      "Experiência sensorial (sons, animações, texturas)",
      "Associe a marcas de luxo",
      "Use adjetivos sensoriais",
    ],
    examples: [
      "Experiência projetada com o mesmo cuidado de um lançamento Tesla",
      "Cores douradas + preto (premium)",
      "Descrições: 'suave', 'elegante', 'refinado'",
    ],
    avoidWhen: ["Produtos simples/baratos", "Público muito prático"],
  },
  INVEJA: {
    id: "inveja",
    name: "Inveja",
    emoji: "😈",
    category: "pecados",
    description: "Querer o que o OUTRO tem, não ficar para trás.",
    howToActivate: [
      "Mostre resultados de outros clientes",
      "Use influenciadores/autoridades",
      "Compare: 'Enquanto você pensa, [Concorrente] já fez'",
      "FOMO (Fear of Missing Out)",
    ],
    examples: [
      "Dr. João fechou 12 mentorias no primeiro mês",
      "Seus concorrentes já estão usando isso",
      "3 clínicas na sua cidade já contrataram",
    ],
    avoidWhen: ["Público que não se compara", "Quando soa arrogante"],
  },
  GULA: {
    id: "gula",
    name: "Gula",
    emoji: "🍕",
    category: "pecados",
    description: "Desejo EXCESSIVO por algo, querer mais e mais.",
    howToActivate: [
      "Ofereça MAIS do que o esperado",
      "Bônus empilhados",
      "'Tudo incluso' / 'Pacote completo'",
      "Sensação de abundância",
    ],
    examples: [
      "8 entregáveis + 3 bônus + suporte ilimitado",
      "Não é só a mentoria, é o ecossistema COMPLETO",
      "E não para por aí...",
    ],
    avoidWhen: ["Quando simplicidade é o diferencial", "Público minimalista"],
  },
  PREGUICA: {
    id: "preguica",
    name: "Preguiça",
    emoji: "😴",
    category: "pecados",
    description: "Querer FACILIDADE, mínimo esforço, atalhos.",
    howToActivate: [
      "'Feito para você' / 'Done for you'",
      "Elimine passos, simplifique",
      "'Sem você precisar fazer nada'",
      "Automação, delegação",
    ],
    examples: [
      "Nós fazemos TUDO, você só aprova",
      "Zero esforço do seu lado",
      "Copy-paste ready",
    ],
    avoidWhen: ["Quando quer vender esforço/dedicação", "Público que valoriza trabalho duro"],
  },
  IRA: {
    id: "ira",
    name: "Ira",
    emoji: "😤",
    category: "pecados",
    description: "Raiva contra um VILÃO comum, indignação.",
    howToActivate: [
      "Crie um inimigo comum (agência ruim, mercado, sistema)",
      "Diga 'chega de...' / 'nunca mais...'",
      "Transforme frustração em ação",
      "Us vs. Them (nós contra eles)",
    ],
    examples: [
      "Chega de queimar dinheiro com agências que não entregam",
      "Nunca mais dependa de indicação",
      "Enquanto gurus vendem fórmulas mágicas, nós entregamos resultado",
    ],
    avoidWhen: ["Tom muito positivo", "Quando o vilão é o próprio cliente"],
  },
};

// BLOCO 2: 7 ELEMENTOS DA CRIANÇA INTERIOR
export const CRIANCA: Record<string, Trigger> = {
  AMOR: {
    id: "amor",
    name: "Amor",
    emoji: "❤️",
    category: "crianca",
    description: "Conexão emocional, cuidado genuíno, relacionamento.",
    howToActivate: [
      "Use o nome do cliente repetidamente",
      "Mostre que você SE IMPORTA com ele",
      "Personalize tudo",
      "Conte histórias de transformação",
    ],
    examples: [
      "Esta proposta foi criada especialmente para você, [Nome]",
      "Seu sucesso é nossa missão",
      "Não queremos só clientes, queremos parceiros de longo prazo",
    ],
    avoidWhen: ["Comunicação muito fria/corporativa é necessária", "Público que quer distância"],
  },
  CURIOSIDADE: {
    id: "curiosidade",
    name: "Curiosidade",
    emoji: "🔍",
    category: "crianca",
    description: "Loops abertos, mistério, vontade de saber mais.",
    howToActivate: [
      "Crie loops abertos (prometa e entregue depois)",
      "Use '...' e reticências",
      "'Você não vai acreditar no que vem a seguir'",
      "Esconda informação estrategicamente",
    ],
    examples: [
      "Há algo que você precisa ver...",
      "O que vou revelar agora mudou tudo",
      "Antes de continuar, uma pergunta...",
    ],
    avoidWhen: ["Comunicação que precisa ser direta", "Público impaciente"],
  },
  DIVERSAO: {
    id: "diversao",
    name: "Diversão",
    emoji: "🎉",
    category: "crianca",
    description: "Prazer, entretenimento, gamificação.",
    howToActivate: [
      "Easter eggs, surpresas",
      "Gamificação (badges, níveis)",
      "Humor leve e apropriado",
      "Interatividade",
    ],
    examples: [
      "Konami Code para desconto secreto",
      "Encontre os 3 easter eggs escondidos",
      "Quiz interativo para descobrir seu perfil",
    ],
    avoidWhen: ["Comunicação muito séria", "B2B corporativo tradicional"],
  },
  LIBERDADE: {
    id: "liberdade",
    name: "Liberdade",
    emoji: "🦅",
    category: "crianca",
    description: "Autonomia, escolha, independência.",
    howToActivate: [
      "Ofereça opções (não force)",
      "'Você decide' / 'Sem compromisso'",
      "Mostre que ele terá mais tempo livre",
      "Rompa correntes (chefe, rotina, local)",
    ],
    examples: [
      "Escolha a opção que faz mais sentido pra você",
      "Sem contrato de fidelidade",
      "Trabalhe de onde quiser, quando quiser",
    ],
    avoidWhen: ["Quando há obrigações claras", "Produtos com compromisso necessário"],
  },
  PERTENCIMENTO: {
    id: "pertencimento",
    name: "Pertencimento",
    emoji: "👥",
    category: "crianca",
    description: "Comunidade, tribo, fazer parte de algo maior.",
    howToActivate: [
      "Crie senso de comunidade",
      "'Junte-se a...' / 'Faça parte de...'",
      "Mostre outros membros",
      "Use 'nós' ao invés de 'eu'",
    ],
    examples: [
      "Junte-se a +500 profissionais que já transformaram seus negócios",
      "Você fará parte de uma comunidade exclusiva",
      "Juntos, vamos construir algo extraordinário",
    ],
    avoidWhen: ["Produto individual", "Público que quer exclusividade total"],
  },
  RECOMPENSA: {
    id: "recompensa",
    name: "Recompensa",
    emoji: "🎁",
    category: "crianca",
    description: "Bônus, surpresas, ganhar algo inesperado.",
    howToActivate: [
      "Bônus surpresa",
      "'Presente especial' / 'Só pra você'",
      "Revele no final algo extra",
      "Recompense ações específicas",
    ],
    examples: [
      "E como bônus especial, você ganha...",
      "Surpresa: incluímos algo que você não estava esperando",
      "Quem fechar até sexta ganha uma hora de consultoria",
    ],
    avoidWhen: ["Quando transparência total é necessária", "Público cético"],
  },
  SEGURANCA: {
    id: "seguranca",
    name: "Segurança",
    emoji: "🛡️",
    category: "crianca",
    description: "Garantias, provas sociais, eliminação de risco.",
    howToActivate: [
      "Garantias fortes e claras",
      "Provas sociais (depoimentos, logos)",
      "Dados e números",
      "'Zero risco' / 'Garantido'",
    ],
    examples: [
      "Garantia incondicional de 30 dias",
      "+500 empresas já usam",
      "100% de reembolso se não entregar",
    ],
    avoidWhen: ["Ofertas muito arriscadas", "Quando não pode cumprir garantias"],
  },
};

// Todos os gatilhos combinados
export const ALL_TRIGGERS = { ...PECADOS, ...CRIANCA };

// Combinações recomendadas por tipo de material
export const COMBINATIONS: Record<string, string[]> = {
  "copy-instagram": ["CURIOSIDADE", "INVEJA", "IRA"],
  "copy-hook": ["CURIOSIDADE", "IRA", "VAIDADE"],
  "email-vendas": ["AVAREZA", "PREGUICA", "SEGURANCA"],
  "email-carrinho": ["AVAREZA", "INVEJA", "RECOMPENSA"],
  "email-cold": ["CURIOSIDADE", "PREGUICA", "SEGURANCA"],
  "vsl": ["IRA", "INVEJA", "AVAREZA", "PREGUICA", "SEGURANCA"],
  "proposta": ["VAIDADE", "LUXURIA", "AMOR", "SEGURANCA", "AVAREZA"],
  "pitch-deck": ["VAIDADE", "AVAREZA", "SEGURANCA", "INVEJA"],
  "landing-page": ["CURIOSIDADE", "IRA", "AVAREZA", "SEGURANCA", "PREGUICA"],
  "headline": ["CURIOSIDADE", "AVAREZA", "INVEJA"],
  "cta": ["AVAREZA", "PREGUICA", "RECOMPENSA"],
};

// Função para obter gatilhos por intensidade para cada fase
export function getTriggersByPhase(phase: string): Record<string, TriggerIntensity> {
  const phaseMap: Record<string, Record<string, TriggerIntensity>> = {
    awareness: {
      CURIOSIDADE: 5,
      IRA: 4,
      INVEJA: 3,
    },
    interest: {
      LUXURIA: 4,
      VAIDADE: 4,
      GULA: 3,
    },
    desire: {
      AVAREZA: 5,
      PREGUICA: 4,
      INVEJA: 5,
    },
    action: {
      SEGURANCA: 5,
      RECOMPENSA: 4,
      AMOR: 4,
      LIBERDADE: 3,
    },
  };
  return phaseMap[phase] || {};
}

// Função para analisar texto e identificar gatilhos usados
export function analyzeTriggers(text: string): { trigger: string; matches: string[] }[] {
  const results: { trigger: string; matches: string[] }[] = [];

  const triggerPatterns: Record<string, RegExp[]> = {
    VAIDADE: [/exclusiv[oa]/gi, /vip/gi, /selet[oa]/gi, /elite/gi, /seleciona/gi],
    AVAREZA: [/economia/gi, /desconto/gi, /roi/gi, /lucro/gi, /retorno/gi, /r\$/gi],
    LUXURIA: [/premium/gi, /luxo/gi, /elegante/gi, /sofisticad/gi],
    INVEJA: [/concorrente/gi, /outros já/gi, /não ficar para trás/gi],
    GULA: [/bônus/gi, /completo/gi, /tudo incluso/gi, /ilimitad/gi],
    PREGUICA: [/feito para você/gi, /sem esforço/gi, /automátic/gi, /fácil/gi],
    IRA: [/chega de/gi, /nunca mais/gi, /canso de/gi],
    AMOR: [/especialmente para você/gi, /importamos/gi, /cuidado/gi],
    CURIOSIDADE: [/descobr/gi, /segredo/gi, /revelar/gi, /\.\.\./gi],
    DIVERSAO: [/surpresa/gi, /diversão/gi, /jogo/gi],
    LIBERDADE: [/liberdade/gi, /você decide/gi, /sem compromisso/gi],
    PERTENCIMENTO: [/comunidade/gi, /junte-se/gi, /faça parte/gi],
    RECOMPENSA: [/presente/gi, /bônus especial/gi, /ganha/gi],
    SEGURANCA: [/garantia/gi, /reembolso/gi, /comprovad/gi, /certific/gi],
  };

  for (const [trigger, patterns] of Object.entries(triggerPatterns)) {
    const matches: string[] = [];
    for (const pattern of patterns) {
      const found = text.match(pattern);
      if (found) {
        matches.push(...found);
      }
    }
    if (matches.length > 0) {
      results.push({ trigger, matches: [...new Set(matches)] });
    }
  }

  return results;
}

// Função para calcular score de eletrificação (0-100)
export function calculateElectrificationScore(text: string): {
  score: number;
  triggers: { trigger: string; matches: string[] }[];
  suggestions: string[];
} {
  const triggers = analyzeTriggers(text);
  const uniqueTriggers = triggers.length;
  const totalMatches = triggers.reduce((acc, t) => acc + t.matches.length, 0);

  // Score baseado em quantidade e variedade de gatilhos
  let score = Math.min(
    uniqueTriggers * 10 + // 10 pontos por gatilho único
    totalMatches * 2, // 2 pontos por match
    100
  );

  const suggestions: string[] = [];

  // Sugestões baseadas em gatilhos faltantes
  const usedTriggers = triggers.map((t) => t.trigger);
  const essentialTriggers = ["CURIOSIDADE", "SEGURANCA", "AVAREZA"];

  for (const essential of essentialTriggers) {
    if (!usedTriggers.includes(essential)) {
      const trigger = ALL_TRIGGERS[essential];
      suggestions.push(`Adicione ${trigger.emoji} ${trigger.name}: ${trigger.examples[0]}`);
    }
  }

  if (score < 50) {
    suggestions.push("Adicione mais gatilhos emocionais para aumentar a conversão");
  }

  return { score, triggers, suggestions };
}

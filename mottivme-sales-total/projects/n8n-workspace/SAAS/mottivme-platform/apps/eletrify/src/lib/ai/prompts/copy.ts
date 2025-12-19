import { ALL_TRIGGERS, COMBINATIONS } from "@/lib/triggers/sexy-canvas";

export function buildCopyPrompt(input: {
  niche: string;
  audience: string;
  goal: string;
  tone: string;
  type: "instagram" | "hook" | "headline" | "cta";
  context?: string;
}) {
  const recommendedTriggers = COMBINATIONS[`copy-${input.type}`] || ["CURIOSIDADE", "AVAREZA", "SEGURANCA"];
  const triggerDetails = recommendedTriggers.map((t) => {
    const trigger = ALL_TRIGGERS[t];
    return `${trigger.emoji} ${trigger.name}: ${trigger.description}\nExemplos: ${trigger.examples.join(" | ")}`;
  }).join("\n\n");

  return `Você é um especialista em copywriting usando a metodologia SEXY CANVAS.

## SUA MISSÃO
Criar uma copy que ELETRIFICA a mente do cliente usando gatilhos emocionais específicos.

## CONTEXTO
- Nicho: ${input.niche}
- Público-alvo: ${input.audience}
- Objetivo: ${input.goal}
- Tom de voz: ${input.tone}
- Tipo: ${input.type}
${input.context ? `- Contexto adicional: ${input.context}` : ""}

## GATILHOS RECOMENDADOS PARA ESTE TIPO
${triggerDetails}

## REGRAS
1. Use PELO MENOS 3 gatilhos na copy
2. Marque quais gatilhos você usou no final [GATILHOS: ...]
3. NÃO seja genérico - seja específico e visceral
4. Crie DESEJO, não necessidade
5. Mantenha curto e impactante
6. Use linguagem do público-alvo

## FORMATO DE ENTREGA
${input.type === "instagram" ? `
- Hook forte (primeira linha que para o scroll)
- Corpo (3-5 linhas desenvolvendo)
- CTA claro
- Hashtags relevantes (opcional)
` : ""}
${input.type === "hook" ? `
- 3 versões de hooks diferentes
- Cada um usando combinação diferente de gatilhos
- Formato: "Hook: [texto] | Gatilhos: [lista]"
` : ""}
${input.type === "headline" ? `
- 5 headlines variadas
- Misture gatilhos diferentes em cada uma
- Formato: "Headline: [texto] | Gatilhos: [lista]"
` : ""}
${input.type === "cta" ? `
- 5 CTAs variados
- Do mais direto ao mais criativo
- Formato: "CTA: [texto] | Gatilhos: [lista]"
` : ""}

Agora crie a copy ELETRIFICADA:`;
}

export function buildEmailPrompt(input: {
  niche: string;
  audience: string;
  goal: string;
  type: "vendas" | "carrinho" | "cold" | "nurture";
  productName: string;
  productValue?: string;
  context?: string;
}) {
  const recommendedTriggers = COMBINATIONS[`email-${input.type}`] || ["AVAREZA", "SEGURANCA", "CURIOSIDADE"];
  const triggerDetails = recommendedTriggers.map((t) => {
    const trigger = ALL_TRIGGERS[t];
    return `${trigger.emoji} ${trigger.name}: ${trigger.description}\nExemplos: ${trigger.examples.join(" | ")}`;
  }).join("\n\n");

  return `Você é um especialista em email marketing usando a metodologia SEXY CANVAS.

## SUA MISSÃO
Criar um email que ELETRIFICA e CONVERTE usando gatilhos emocionais.

## CONTEXTO
- Nicho: ${input.niche}
- Público-alvo: ${input.audience}
- Objetivo: ${input.goal}
- Tipo de email: ${input.type}
- Produto/Serviço: ${input.productName}
${input.productValue ? `- Valor: ${input.productValue}` : ""}
${input.context ? `- Contexto adicional: ${input.context}` : ""}

## GATILHOS RECOMENDADOS
${triggerDetails}

## REGRAS
1. Assunto DEVE abrir o email (use curiosidade)
2. Primeira linha PRENDE a atenção
3. Corpo curto e escaneável
4. UM CTA claro
5. P.S. opcional (pode reforçar urgência)
6. Use PELO MENOS 4 gatilhos diferentes

## FORMATO DE ENTREGA
\`\`\`
ASSUNTO: [assunto do email]
PREVIEW: [texto de preview - 40 chars]

[corpo do email em HTML simples ou texto]

[GATILHOS USADOS: lista dos gatilhos aplicados]
\`\`\`

Agora crie o email ELETRIFICADO:`;
}

export function buildVSLPrompt(input: {
  niche: string;
  audience: string;
  problem: string;
  solution: string;
  productName: string;
  productValue: string;
  guarantee?: string;
  testimonials?: string[];
}) {
  const recommendedTriggers = COMBINATIONS["vsl"];
  const triggerDetails = recommendedTriggers.map((t) => {
    const trigger = ALL_TRIGGERS[t];
    return `${trigger.emoji} ${trigger.name}: ${trigger.description}`;
  }).join("\n");

  return `Você é um especialista em VSL (Video Sales Letter) usando a metodologia SEXY CANVAS.

## SUA MISSÃO
Criar um script de VSL de 10-15 minutos que ELETRIFICA e VENDE.

## CONTEXTO
- Nicho: ${input.niche}
- Público-alvo: ${input.audience}
- Problema principal: ${input.problem}
- Solução: ${input.solution}
- Produto: ${input.productName}
- Valor: ${input.productValue}
${input.guarantee ? `- Garantia: ${input.guarantee}` : ""}
${input.testimonials ? `- Depoimentos disponíveis: ${input.testimonials.join(", ")}` : ""}

## GATILHOS OBRIGATÓRIOS PARA VSL
${triggerDetails}

## ESTRUTURA DO VSL
1. **HOOK (30s)** - Para IMEDIATAMENTE / CURIOSIDADE + IRA
2. **PROBLEMA (2min)** - Agitação do problema / IRA + INVEJA
3. **HISTÓRIA (3min)** - Jornada de transformação / AMOR + CURIOSIDADE
4. **REVELAÇÃO (2min)** - Apresenta a solução / LUXÚRIA + VAIDADE
5. **MECANISMO (2min)** - Como funciona / PREGUIÇA + SEGURANÇA
6. **PROVA (2min)** - Resultados e depoimentos / INVEJA + SEGURANÇA
7. **OFERTA (2min)** - Stack de valor / GULA + AVAREZA
8. **URGÊNCIA (1min)** - Por que agora / INVEJA + IRA
9. **CTA (1min)** - Chamada clara / LIBERDADE + RECOMPENSA
10. **FAQ/OBJEÇÕES (2min)** - Antecipa dúvidas / SEGURANÇA

## REGRAS
1. Cada seção deve usar os gatilhos indicados
2. Mantenha transições suaves entre seções
3. Use linguagem conversacional (como se estivesse falando)
4. Inclua indicações [PAUSA], [ÊNFASE], [MOSTRAR TELA]
5. Seja específico com números e resultados

## FORMATO DE ENTREGA
Para cada seção:
\`\`\`
## [NOME DA SEÇÃO] - [Tempo estimado]
[Gatilhos: lista]

[Script conversacional]

[Indicações de produção]
\`\`\`

Agora crie o VSL ELETRIFICADO:`;
}

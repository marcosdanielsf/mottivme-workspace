# Sessao de Desenvolvimento - Concierge Isabella
> Data: Dezembro 2025
> Projeto: Mottivme Sales - Lappe Finance

---

## RESUMO EXECUTIVO

Sessao focada em criar o fluxo pos-agendamento com a "Concierge Isabella" (engagementkeeper) e ferramentas auxiliares para o GHL.

---

## 1. PROBLEMA INICIAL - ERRO INSTAGRAM/SMS

### Descricao
Quando um lead respondia via SMS apos ser abordado pelo Instagram, o sistema tentava responder via Instagram e dava erro:
```
"Can't send Instagram message as the last inbound message was earlier than 24 hours ago"
```

### Causa Raiz
O campo `source` era determinado apenas por `attributionSource.medium`, nao pelo canal real da mensagem atual.

### Solucao Proposta
Usar `message.type` para detectar o canal correto:
- type 2 = SMS
- type 15 = Instagram DM
- type 20 = outros

```javascript
// Codigo para corrigir deteccao de source
const messageType = $json.body?.message?.type;

let source;
if (messageType === 2) {
  source = "sms";
} else if (messageType === 15) {
  source = "instagram";
} else {
  source = "whatsapp";
}
```

**Status:** Pendente implementacao no fluxo principal

---

## 2. CONCEITO CONCIERGE ISABELLA

### O que e
Apos o lead ser agendado, o agente IA muda de "SDR" para "Concierge" - mesma Isabella, responsabilidade diferente.

### Fluxo
```
Lead Agendado
    ↓
GHL atualiza campo "Especialista Motive" para "engagementkeeper"
    ↓
Proxima mensagem do lead entra no fluxo
    ↓
Switch detecta agente_ia = "engagementkeeper"
    ↓
Set Concierge injeta prompt especifico
    ↓
Agente responde como Concierge (nao como SDR)
```

### Valores do campo "Especialista Motive" (agente_ia)
- `sdrcarreira` - SDR para leads de carreira
- `sdrconsultoria` - SDR para leads de consultoria
- `engagementkeeper` - Concierge pos-agendamento
- `followuper` - Follow-up automatizado
- `rescheduler` - Reagendamento

---

## 3. PROMPT DA CONCIERGE ISABELLA

```
## OBJETIVO

- Garantir o comparecimento e maximizar o valor da reuniao agendada.
- Manter o lead engajado e aquecido, reforcando a importancia do compromisso firmado.
- Gerenciar duvidas e objecoes que surjam no periodo entre o agendamento e a reuniao.
- Remarcar ou cancelar reunioes de forma eficiente e cordial, preservando o relacionamento com o lead.

---

## SOBRE O MOMENTO POS-AGENDAMENTO

### O QUE E
Esta fase comeca imediatamente apos a confirmacao do agendamento enviada pelo fluxo anterior. A IA agora assume um papel de suporte e manutencao do relacionamento, garantindo que a transicao do agendamento para a reuniao seja a mais suave possivel.

### PRINCIPAL MUDANCA DE FOCO
O objetivo muda de "agendar" para "garantir o comparecimento e preparar o lead". A comunicacao deve ser mais passiva e reativa, agindo com base nas mensagens do lead, mas sempre com o objetivo de reforcar o valor da conversa agendada.

### RECURSOS
A IA ainda tem acesso a todas as informacoes sobre Carreira de Agente Financeiro e Consultoria para tirar duvidas. As ferramentas de Busca_disponibilidade e Agendar_reuniao sao essenciais para o processo de reagendamento.

---

## SOP (Procedimento Operacional Padrao) - Pos-Agendamento

O fluxo e ativado quando um lead, que ja possui uma reuniao agendada, envia uma nova mensagem. O primeiro passo e sempre analisar a intencao da mensagem do lead.

### PASSO 1: ANALISE DE INTENCAO

A IA deve primeiro identificar o proposito da mensagem do lead, que geralmente se enquadra em um dos seguintes cenarios:

- Cenario A: O lead tem uma duvida sobre a carreira, a consultoria ou a propria reuniao.
- Cenario B: O lead precisa remarcar a reuniao.
- Cenario C: O lead deseja cancelar a reuniao.
- Cenario D: E uma mensagem aleatoria ou uma simples confirmacao (ex: "Ok, obrigado!").

### PASSO 2: TRATAMENTO POR CENARIO

#### TRATAMENTO DO CENARIO A: DUVIDA OU PERGUNTA

- Acao: Responder de forma clara e objetiva, utilizando o conhecimento das secoes sobre carreira e consultoria.
- Script de Resposta:
  "Claro, [nome]! Otima pergunta. Sobre [topico da duvida], funciona assim... [resposta clara e concisa]."
- Finalizacao e Reafirmacao: Apos esclarecer a duvida, sempre reforce o compromisso.
  "Ficou mais claro agora? Se tiver mais alguma duvida, pode me mandar. Nosso papo em [dia da reuniao], as [horario da reuniao], esta mantido, ok? Ate la!"

#### TRATAMENTO DO CENARIO B: PEDIDO DE REAGENDAMENTO

- Acao: Mostrar empatia e iniciar imediatamente o processo para encontrar um novo horario.
- Script de Acolhimento:
  "Sem problemas, [nome]! Imprevistos acontecem. Agradeco muito por avisar com antecedencia. Vamos encontrar um novo horario que funcione melhor para voce."
- Processo de Reagendamento:
  1. Utilize a ferramenta Busca_disponibilidade para encontrar novos horarios vagos.
  2. Ofereca 2 a 3 novas opcoes para o lead. Ex: "Tenho um horario na terca as 15h ou na quarta as 11h (NY). Qual fica melhor para voce?"
  3. Apos a escolha, utilize a ferramenta Agendar_reuniao com os novos dados (dia e hora).
  4. Envie a confirmacao final: "Perfeito, [nome]! Reuniao reagendada. Vou te enviar os detalhes por e-mail e WhatsApp, ok?"

#### TRATAMENTO DO CENARIO C: PEDIDO DE CANCELAMENTO

- Acao: Tentar entender o motivo de forma sutil, sem pressionar, e deixar a porta aberta.
- Script de Sondagem:
  "Entendi, [nome]. Agradeco por me comunicar. Se nao for incomodo perguntar, o cancelamento e por causa do horario ou o interesse no assunto mudou? Pergunto apenas para entender como podemos ajudar melhor no futuro."
- Logica Condicional:
  - Se a resposta for sobre o horario: Ofereca a opcao de reagendamento, retornando ao fluxo do Cenario B.
  - Se a resposta for sobre mudanca de interesse: Agradeca e finalize cordialmente. "Entendido. Respeito sua decisao. Se no futuro este tema voltar a ser uma prioridade, as portas estarao abertas. Sucesso para voce!"

#### TRATAMENTO DO CENARIO D: MENSAGEM ALEATORIA OU CONFIRMACAO

- Acao: Apenas acuse o recebimento e reforce o compromisso de forma breve.
- Script de Resposta:
  "Recebido, [nome]! Tudo certo entao. Nos falamos em [dia da reuniao], as [horario da reuniao]. Abraco!"
```

---

## 4. ESTRUTURA DO SWITCH POR AGENTE_IA

### Node Switch
```json
{
  "type": "n8n-nodes-base.switch",
  "name": "Switch",
  "parameters": {
    "rules": {
      "values": [
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $('Info').first().json.agente_ia }}",
                "rightValue": "followuper",
                "operator": { "operation": "equals" }
              }
            ]
          },
          "outputKey": "followuper"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $('Info').first().json.agente_ia }}",
                "rightValue": "sdrcarreira",
                "operator": { "operation": "equals" }
              }
            ]
          },
          "outputKey": "SDR Carreira"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $('Info').first().json.agente_ia }}",
                "rightValue": "sdrconsultoria",
                "operator": { "operation": "equals" }
              }
            ]
          },
          "outputKey": "SDR Consultoria"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $('Info').first().json.agente_ia }}",
                "rightValue": "rescheduler",
                "operator": { "operation": "equals" }
              }
            ]
          },
          "outputKey": "rescheduler"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $('Info').first().json.agente_ia }}",
                "rightValue": "engagementkeeper",
                "operator": { "operation": "equals" }
              }
            ]
          },
          "outputKey": "engagementkeeper"
        }
      ]
    }
  }
}
```

### Fluxo Visual
```
Switch (agente_ia)
  ├── followuper → [Set Followuper] → Agente
  ├── SDR Carreira → Set SDR Carreira → Agente
  ├── SDR Consultoria → [Set SDR Consultoria] → Agente
  ├── rescheduler → [Set Rescheduler] → Agente
  └── engagementkeeper → Set Concierge → Agente
```

---

## 5. TOOLS CRIADAS/PLANEJADAS

### 5.1 Tool Atualizar Last Appointment

**Proposito:** Registrar o tipo do ultimo agendamento (Carreira ou Consultoria)

**Parametros de entrada:**
```json
{
  "API_KEY": "pit-3d61b334-690f-46ad-a6be-54c5efce1f46",
  "location_id": "EKHxHl3KLPN0iRc69GNU",
  "contact_id": "[CONTACT_ID]",
  "fieldValue": "Carreira"  // ou "Consultoria"
}
```

**Campo GHL:**
- Nome: "Last Appointment"
- Tipo: SINGLE_OPTIONS
- Opcoes: ["Carreira", "Consultoria"]

**Status:** Em desenvolvimento

### 5.2 Tool Atualizar Agente IA

**Proposito:** Mudar o campo "Especialista Motive" para trocar o agente responsavel

**Uso principal:** Apos agendamento, mudar de `sdrcarreira` para `engagementkeeper`

**Decisao:** Implementar via automacao direta no GHL (mais simples que n8n)

---

## 6. CREDENCIAIS LAPPE FINANCE

```yaml
location_id: EKHxHl3KLPN0iRc69GNU
api_key: pit-3d61b334-690f-46ad-a6be-54c5efce1f46
```

---

## 7. ARQUITETURA FINAL

### Fluxo Completo
```
[Lead envia mensagem]
        ↓
[Webhook recebe]
        ↓
[Info - extrai dados incluindo agente_ia]
        ↓
[Switch por agente_ia]
        ↓
    ┌───────────────────────────────────────┐
    │                                       │
[SDR Carreira]  [SDR Consultoria]  [Concierge]  [Followuper]  [Rescheduler]
    │                  │               │            │              │
    └──────────────────┴───────────────┴────────────┴──────────────┘
                                │
                        [Agente SDR/Isabella]
                                │
                        [Resposta ao lead]
```

### Vantagens da Arquitetura
1. **Um unico agente** - Economia de nodes e manutencao
2. **Prompts modulares** - Cada Set define comportamento especifico
3. **Facil expansao** - Adicionar novo tipo = novo case no Switch + novo Set
4. **Isabella unificada** - Mesma personalidade, responsabilidades diferentes

---

## 8. PENDENCIAS

### Alta Prioridade
- [ ] Corrigir erro Instagram/SMS - source no fluxo principal
- [ ] Finalizar tool Last Appointment
- [ ] Configurar automacao GHL para mudar agente_ia apos agendamento

### Media Prioridade
- [ ] Criar Sets para followuper e rescheduler
- [ ] Testar fluxo completo Concierge

### Baixa Prioridade
- [ ] Documentar todos os prompts em arquivo separado

---

## 9. DECISOES TECNICAS

| Decisao | Opcao Escolhida | Motivo |
|---------|-----------------|--------|
| Mudar agente_ia apos agendamento | Automacao GHL | Mais simples que n8n |
| Identidade da Concierge | Mesma Isabella | Continuidade, menos confusao |
| Estrutura de prompts | Set por tipo + Agente unico | Modular e economico |
| systemMessage do Agente | Manter fixo | Prompt do Set tem prioridade |

---

## 10. ARQUIVOS RELACIONADOS

```
/n8n-workspace/Fluxos n8n/
├── Fluxos BASE - n8n do BPO da mottivme/
│   └── 2. MKT:Vendas/
│       └── 2. Pre Vendas/
│           ├── GHL - Mottivme -EUA - Versao Atual.json (fluxo principal)
│           └── Tools Agentes SDR/
│               ├── Atualizar Estado GHL (Otimizado).json
│               ├── Atualizar Work Permit GHL (Otimizado).json
│               └── [Atualizar Last Appointment - a criar]
```

---

*Documento gerado em: Dezembro 2025*
*Sessao de desenvolvimento com Claude Code*

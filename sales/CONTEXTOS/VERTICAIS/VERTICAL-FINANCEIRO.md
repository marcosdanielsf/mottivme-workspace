# VERTICAL-FINANCEIRO.md
> Contexto para trabalhar com consultores financeiros e servicos financeiros

---

## 1. VISAO GERAL DA VERTICAL

### Perfil do Cliente Ideal
- Consultores financeiros independentes
- Escritorios de investimento
- Planejadores financeiros
- Mercado: Brasil e brasileiros nos EUA

### Modelo de Atendimento
```
Lead (Trafego/Indicacao) → SDR (Qualificacao) → Consultor (Fechamento) → Onboarding
```

---

## 2. CLIENTES ATIVOS

### 2.1 Lappe Financial Group

**Dados do Cliente:**
- Nome: Lappe Financial Group
- Mercado: Consultores financeiros brasileiros nos EUA
- Modelo de Negocio Dual:
  1. Consultoria financeira direta
  2. Licenciamento de novos agentes financeiros

**Sistema Implementado:**
- SDR: Isabella Delduco
- CRM: Kommo (nao GHL)
- Workflow: `Lappe Finance.json`

**Framework de Vendas:**
- No-Go Sales (qualificacao rigorosa)
- NEPQ (Neuro-Emotional Persuasion Questions)

**Arquivos de Referencia:**
- `/n8n-workspace/Fluxos n8n/Pre Vendas/1 - SDR tools/3 - KIT SDR/Lappe Finance.json`

---

## 3. SDR ISABELLA

### Dados Profissionais
- **Nome:** Isabella Delduco
- **Email:** isabella@mottivme.com.br
- **Role:** Senior SDR / Business Operations Lead
- **Cliente Principal:** Lappe Financial Group

### Responsabilidades
1. Follow-up de leads qualificados
2. Gestao do funil de vendas
3. Agendamento de calls com consultores
4. Qualificacao usando No-Go Sales
5. Aplicacao de NEPQ nas conversas

### Metricas de Performance
- Leads contatados/dia: Meta 50+
- Taxa de qualificacao: Meta 30%
- Agendamentos/semana: Meta 15+
- Show-rate: Meta 80%+

---

## 4. FRAMEWORKS DE VENDAS

### 4.1 No-Go Sales

**Conceito:** Qualificar para DESQUALIFICAR. So avanca quem realmente tem fit.

**Criterios de Qualificacao:**
```
1. BUDGET - Tem capacidade financeira?
2. AUTHORITY - Decide sozinho?
3. NEED - Tem necessidade real?
4. TIMELINE - Quando quer resolver?
```

**Red Flags (No-Go):**
- "Preciso consultar meu socio/esposa"
- "Estou so pesquisando por enquanto"
- "Nao tenho urgencia"
- "O preco e o principal fator"

### 4.2 NEPQ (Neuro-Emotional Persuasion Questions)

**Perguntas de Conexao:**
```
- "O que te levou a buscar um consultor financeiro agora?"
- "Como voce se sente em relacao a sua situacao financeira atual?"
- "O que mudaria na sua vida se resolvesse isso?"
```

**Perguntas de Consequencia:**
```
- "O que acontece se voce nao resolver isso nos proximos 6 meses?"
- "Quanto isso ja te custou ate agora?"
- "Como isso afeta sua familia?"
```

**Perguntas de Compromisso:**
```
- "Se eu mostrar uma solucao que resolve X, voce estaria pronto para comecar?"
- "O que precisaria acontecer para voce tomar essa decisao hoje?"
```

---

## 5. WORKFLOW LAPPE FINANCE

### Estrutura do Workflow n8n
```
TRIGGER: Novo lead no Kommo
    ↓
QUALIFICACAO INICIAL (IA)
    ↓
SCORE DE FIT (1-10)
    ↓
SE score >= 7: Atribuir para SDR
SE score < 7: Nurturing automatico
    ↓
SDR FOLLOW-UP
    ↓
NEPQ QUESTIONS
    ↓
AGENDAMENTO CALL
    ↓
CONSULTOR
```

### Integracao Kommo
```javascript
// Campos customizados no Kommo
{
  "lead_score": number,      // 1-10
  "fit_financeiro": boolean,
  "timeline": string,        // "imediato", "30d", "90d", "indefinido"
  "origem": string,          // "indicacao", "ads", "organico"
  "interesse": string        // "consultoria", "licenciamento", "ambos"
}
```

---

## 6. MODELO DUAL DE SERVICO

### Servico 1: Consultoria Financeira
- Target: Brasileiros nos EUA com patrimonio
- Ticket: Fee-based ou AUM
- Ciclo: 2-4 calls ate fechamento
- Entregavel: Planejamento financeiro completo

### Servico 2: Licenciamento de Agentes
- Target: Profissionais querendo atuar como consultores
- Ticket: Investimento em certificacao + mentoria
- Ciclo: 4-6 semanas de avaliacao
- Entregavel: Licenca + treinamento + suporte

### Sinergia Entre Servicos
```
Cliente Consultoria → Satisfeito → Indica amigos
                                 → Quer virar agente

Novo Agente → Licenciado → Traz proprios clientes
                         → Expande rede Lappe
```

---

## 7. PIPELINE DE VENDAS

### Estagios Kommo
```
LEAD NOVO
    ↓
PRIMEIRO CONTATO (SDR)
    ↓
QUALIFICADO (NEPQ aplicado)
    ↓
DISCOVERY CALL AGENDADA
    ↓
DISCOVERY REALIZADA
    ↓
PROPOSTA APRESENTADA
    ↓
NEGOCIACAO
    ↓
FECHADO WON / FECHADO LOST
```

### Automacoes por Estagio
| Estagio | Automacao | Responsavel |
|---------|-----------|-------------|
| Lead Novo | Msg WhatsApp + Email | IA |
| Primeiro Contato | NEPQ inicial | SDR Isabella |
| Qualificado | Envio material | IA |
| Discovery Agendada | Lembrete | IA |
| Proposta | Follow-up D+2 | SDR |
| Negociacao | Desconto condicional | Consultor |

---

## 8. TEMPLATES DE COMUNICACAO

### Primeiro Contato (WhatsApp)
```
Ola [NOME]! 👋

Aqui e a Isabella, da Lappe Financial.

Vi que voce demonstrou interesse em consultoria financeira para brasileiros nos EUA.

Posso te fazer algumas perguntas rapidas pra entender melhor sua situacao?

Vai levar menos de 5 minutos e ja consigo te dizer se faz sentido uma conversa com nosso time.
```

### NEPQ - Abertura
```
Perfeito, [NOME]!

Antes de qualquer coisa, me conta:
- O que te levou a buscar um consultor financeiro agora?
- Voce ja tentou resolver isso de alguma forma antes?
```

### NEPQ - Aprofundamento
```
Entendi, [NOME].

E se voce nao resolver essa questao nos proximos meses, o que acontece?

Pergunto porque muita gente deixa pra depois e acaba pagando um preco alto...
```

### Agendamento
```
Ótimo, [NOME]!

Pelo que voce me contou, faz total sentido uma conversa com nosso consultor especializado.

Tenho horarios disponiveis:
- [DATA] as [HORA]
- [DATA] as [HORA]

Qual funciona melhor pra voce?
```

---

## 9. METRICAS DA VERTICAL

### KPIs SDR
- Leads contatados/dia
- Taxa de resposta
- Taxa de qualificacao
- Agendamentos/semana
- Show-rate

### KPIs Consultores
- Calls realizadas/semana
- Taxa de proposta
- Taxa de fechamento
- Ticket medio
- LTV cliente

### Dashboard
```
┌─────────────────────────────────────────┐
│  FUNIL LAPPE FINANCIAL - SEMANA        │
├─────────────────────────────────────────┤
│  Leads Novos:     [###]                │
│  Qualificados:    [###] ([##]%)        │
│  Calls Agendadas: [###] ([##]%)        │
│  Calls Realizadas:[###] ([##]%)        │
│  Propostas:       [###] ([##]%)        │
│  Fechados:        [###] ([##]%)        │
├─────────────────────────────────────────┤
│  Receita Projetada: US$ [###.###]      │
└─────────────────────────────────────────┘
```

---

## 10. INTEGRACAO TECNICA

### Stack
- CRM: Kommo (API)
- Automacao: n8n
- Comunicacao: WhatsApp (Evolution API)
- Analise: Metabase / Sheets

### Workflow n8n Principal
```
/Fluxos n8n/Pre Vendas/1 - SDR tools/3 - KIT SDR/Lappe Finance.json
```

### Conexoes API
```javascript
// Kommo API
const kommoConfig = {
  baseUrl: "https://[subdomain].kommo.com/api/v4",
  accessToken: "[TOKEN]",
  refreshToken: "[REFRESH]"
};

// Webhooks
// - Novo lead: POST /webhook/lappe/new-lead
// - Status change: POST /webhook/lappe/status-change
```

---

## 11. CHECKLIST IMPLEMENTACAO

### Novo Cliente Financeiro
- [ ] Definir modelo de servico (consultoria/licenciamento/ambos)
- [ ] Configurar CRM (Kommo ou GHL)
- [ ] Importar workflow base
- [ ] Personalizar mensagens NEPQ
- [ ] Treinar SDR no framework No-Go
- [ ] Configurar WhatsApp Business
- [ ] Definir metricas e metas
- [ ] Setup dashboard de acompanhamento
- [ ] Integrar com sistema de pagamento
- [ ] Go-live com monitoramento

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

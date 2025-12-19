# VERTICAL-SERVICOS.md
> Contexto para trabalhar com prestadores de servicos gerais
> STATUS: TEMPLATE - A completar com dados de clientes

---

## 1. VISAO GERAL DA VERTICAL

### Perfil do Cliente Ideal
- Empresas de servicos B2C ou B2B
- Servicos recorrentes ou projetos
- Ticket medio: R$500 - R$10.000
- Exemplos: Manutencao, reparos, consultoria tecnica

### Modelo de Atendimento
```
Lead (Trafego/Indicacao) → Atendente Virtual (IA) → Orcamento → Agendamento → Execucao
```

---

## 2. CLIENTES ATIVOS

### 2.1 [CLIENTE A ADICIONAR]

> **NOTA:** KA RV Repair foi mencionado mas NAO encontrado no codebase.
> Adicionar dados quando disponivel.

**Template de Dados:**
```yaml
nome: ""
segmento: ""
servicos: []
ticket_medio: ""
regiao_atuacao: ""
modelo_orcamento: ""
```

---

## 3. SISTEMA ATENDENTE VIRTUAL

### Arquitetura do Sistema
```
┌─────────────────────────────────────────┐
│         ATENDENTE VIRTUAL               │
├─────────────────────────────────────────┤
│  Input: WhatsApp / Site                 │
│  Processamento: n8n + GPT-4o            │
│  Output: WhatsApp + Orcamento + Agenda  │
├─────────────────────────────────────────┤
│  Funcoes:                               │
│  - Entender necessidade do cliente      │
│  - Coletar informacoes para orcamento   │
│  - Gerar orcamento automatico           │
│  - Agendar visita tecnica               │
│  - Follow-up de orcamentos              │
│  - Escalar casos complexos              │
└─────────────────────────────────────────┘
```

### Framework CRITICS para Servicos

```markdown
## CONSTRAINTS (Restricoes)
- NAO fechar servico sem orcamento aprovado
- NAO prometer prazos sem consultar agenda
- SEMPRE coletar informacoes completas
- Escalar servicos fora do escopo padrao

## ROLE (Papel)
Atendente virtual da [EMPRESA], especializada em [SERVICOS].
Tom: Prestativo, tecnico quando necessario, eficiente.

## INPUTS (Entradas)
- Mensagem do cliente
- Tipo de servico solicitado
- Fotos/videos do problema (se aplicavel)
- Localizacao do cliente

## TOOLS (Ferramentas)
- Calculadora de orcamento
- Agenda de tecnicos
- Base de conhecimento tecnico
- Escalacao humana

## INSTRUCTIONS (Instrucoes)
1. Identificar tipo de servico
2. Coletar informacoes necessarias
3. Verificar disponibilidade na regiao
4. Gerar orcamento estimado
5. Oferecer agendamento
6. Confirmar dados

## CONCLUSIONS (Conclusoes)
- Servico simples: Orcamento + Agendamento automatico
- Servico complexo: Agendar visita tecnica primeiro
- Fora do escopo: Indicar parceiro ou recusar educadamente

## SOLUTIONS (Solucoes)
- Objecao preco: Explicar valor, oferecer parcelamento
- Objecao urgencia: Verificar tecnicos disponiveis
- Objecao localizacao: Verificar area de cobertura
```

---

## 4. PIPELINE DE SERVICOS

### Pipeline Padrao
```
LEAD NOVO
    ↓
PRIMEIRO CONTATO
    ↓
COLETA DE INFORMACOES
    ↓
ORCAMENTO ENVIADO
    ↓
ORCAMENTO APROVADO / RECUSADO
    ↓
AGENDADO
    ↓
EM EXECUCAO
    ↓
CONCLUIDO
    ↓
AVALIACAO
```

### Automacoes Sugeridas
| Estagio | Automacao |
|---------|-----------|
| Lead Novo | Boas-vindas + Coleta inicial |
| Orcamento Enviado | Follow-up D+1 |
| Orcamento Enviado | Follow-up D+3 |
| Agendado | Lembrete 24h |
| Concluido | Pesquisa satisfacao |
| Concluido | Pedido de indicacao |

---

## 5. ORCAMENTO AUTOMATICO

### Variaveis de Calculo
```javascript
const calcularOrcamento = (servico) => {
  const base = TABELA_PRECOS[servico.tipo];
  const multiplicadores = {
    urgencia: servico.urgente ? 1.5 : 1,
    distancia: calcularDistancia(servico.local),
    complexidade: servico.complexidade || 1
  };

  return base
    * multiplicadores.urgencia
    * multiplicadores.distancia
    * multiplicadores.complexidade;
};
```

### Tabela de Precos (Template)
```yaml
servico_basico:
  min: 0
  max: 0
  unidade: ""

servico_complexo:
  min: 0
  max: 0
  unidade: ""

visita_tecnica:
  valor: 0
  desconto_se_fechar: true
```

---

## 6. METRICAS DA VERTICAL

### KPIs Principais
- **Taxa de Resposta**: Meta 95% em < 1h
- **Taxa de Orcamento**: Meta 60%+
- **Taxa de Aprovacao**: Meta 40%+
- **NPS**: Meta 70+
- **Taxa de Recompra**: Meta 30%+

### Dashboard
```
┌─────────────────────────────────────────┐
│  METRICAS SERVICOS - MES               │
├─────────────────────────────────────────┤
│  Leads:        [###]                   │
│  Orcamentos:   [###] ([##]%)           │
│  Aprovados:    [###] ([##]%)           │
│  Executados:   [###]                   │
│  Faturamento:  R$ [###.###]            │
│  NPS:          [##]                    │
└─────────────────────────────────────────┘
```

---

## 7. TEMPLATES DE MENSAGENS

### Boas-vindas
```
Ola! 👋

Bem-vindo a [EMPRESA]!

Sou o assistente virtual e vou te ajudar a resolver seu problema rapidinho.

Me conta, qual servico voce precisa?
```

### Coleta de Informacoes
```
Entendi que voce precisa de [SERVICO].

Pra eu te passar um orcamento certinho, preciso de algumas informacoes:

1. Qual o endereco do servico?
2. [PERGUNTA ESPECIFICA DO SERVICO]
3. Tem alguma urgencia? (Servicos urgentes tem acrescimo)
```

### Orcamento
```
Pronto, [NOME]! 📋

Segue o orcamento para [SERVICO]:

━━━━━━━━━━━━━━━━━━━━━
[DESCRICAO DO SERVICO]
━━━━━━━━━━━━━━━━━━━━━
Valor: R$ [VALOR]
Prazo: [PRAZO]
Validade: 7 dias
━━━━━━━━━━━━━━━━━━━━━

Posso agendar pra voce?
```

### Follow-up Orcamento
```
Oi [NOME]!

Passando pra saber se conseguiu analisar o orcamento que enviei.

Ficou alguma duvida? Posso ajustar algo?
```

---

## 8. INTEGRACAO TECNICA

### Campos Customizados GHL
```
custom_field_tipo_servico
custom_field_endereco_servico
custom_field_urgencia
custom_field_valor_orcamento
custom_field_data_agendamento
custom_field_tecnico_responsavel
custom_field_status_servico
```

### Workflows n8n (Template)
```
/Fluxos n8n/Servicos/
├── 01-recepcao-lead.json
├── 02-coleta-informacoes.json
├── 03-calculo-orcamento.json
├── 04-envio-orcamento.json
├── 05-follow-up-orcamento.json
├── 06-agendamento.json
├── 07-lembretes.json
├── 08-pos-servico.json
└── 09-metricas.json
```

---

## 9. CHECKLIST IMPLEMENTACAO

### Novo Cliente de Servicos
- [ ] Mapear tipos de servicos oferecidos
- [ ] Criar tabela de precos
- [ ] Definir areas de cobertura
- [ ] Configurar pipeline no GHL
- [ ] Criar persona do atendente
- [ ] Importar workflows n8n
- [ ] Personalizar mensagens
- [ ] Integrar com agenda de tecnicos
- [ ] Testar fluxo de orcamento
- [ ] Go-live

---

## 10. NOTAS

> Este documento e um TEMPLATE.
>
> Para completar, adicionar:
> - Dados reais de clientes (KA RV Repair quando disponivel)
> - Tabela de precos especifica
> - Workflows customizados
> - Metricas historicas

---

*Documento criado em: Dezembro 2025*
*Status: Template - A completar*

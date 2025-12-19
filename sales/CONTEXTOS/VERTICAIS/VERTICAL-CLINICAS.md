# VERTICAL-CLINICAS.md
> Contexto para trabalhar com clinicas odontologicas e medicas high ticket

---

## 1. VISAO GERAL DA VERTICAL

### Perfil do Cliente Ideal
- Clinicas odontologicas premium
- Clinicas medicas especializadas
- Ticket medio: R$5.000 - R$50.000
- Modelo: Avaliacao gratuita → Tratamento high ticket

### Modelo de Atendimento
```
Lead (Trafego) → Secretaria Virtual (IA) → Agendamento → Avaliacao → Fechamento
```

---

## 2. CLIENTES ATIVOS

### 2.1 Dr. Luiz - Clinica Odontologica

**Dados do Cliente:**
- Nome: Dr. Luiz
- Especialidade: Odontologia estetica/implantes
- Ticket medio: R$15.000+

**Sistema Implementado:**
- Secretaria Virtual: Julia (persona CRITICS)
- Pipeline GHL: Lead → Agendado → Compareceu → Fechado
- Automacoes: 14 workflows n8n

**Workflows Ativos:**
1. Recepcao de lead
2. Qualificacao inicial
3. Agendamento automatico
4. Lembrete 24h
5. Lembrete 1h
6. Confirmacao de presenca
7. No-show follow-up
8. Pos-avaliacao
9. Proposta enviada
10. Follow-up proposta
11. Fechamento
12. Onboarding paciente
13. Reativacao leads frios
14. Pesquisa satisfacao

**Persona da Secretaria:**
```
Nome: Julia
Tom: Profissional, acolhedor, eficiente
Objetivo: Agendar avaliacao gratuita
Restricoes: Nao fala de precos, nao diagnostica
```

---

### 2.2 Orthodontic Biguacu

**Dados do Cliente:**
- Nome: Orthodontic Biguacu
- Especialidade: Ortodontia
- Endereco: R. Getulio Vargas, 110 - Sala 03, Biguacu - SC
- Modelo: Avaliacao gratuita + R$125/mes manutencao

**Sistema Implementado:**
- Secretaria Virtual: Maria
- Pipeline: Lead → Agendado → Avaliacao → Manutencao

**Persona da Secretaria:**
```
Nome: Maria
Tom: Simpatica, prestativa, regional (SC)
Objetivo: Agendar avaliacao gratuita
Info que pode dar: Endereco, horarios, modelo de manutencao
```

**Arquivos de Referencia:**
- `/Mottivme Strategy 2026/_workspace/clientes/orthodontic-biguacu/MUDANCAS-ORTHODONTIC.md`
- `/Mottivme Strategy 2026/_workspace/clientes/orthodontic-biguacu/prompt-julia-clinica-CRITICS.md`

---

## 3. SISTEMA SECRETARIA BASE

### Arquitetura do Sistema
```
┌─────────────────────────────────────────┐
│           SECRETARIA VIRTUAL            │
├─────────────────────────────────────────┤
│  Input: WhatsApp (Evolution API)        │
│  Processamento: n8n + GPT-4o            │
│  Output: WhatsApp + GHL Pipeline        │
├─────────────────────────────────────────┤
│  Funcoes:                               │
│  - Responder duvidas basicas            │
│  - Qualificar lead                      │
│  - Agendar avaliacao                    │
│  - Enviar lembretes                     │
│  - Reagendar se necessario              │
│  - Escalar para humano se preciso       │
└─────────────────────────────────────────┘
```

### Framework CRITICS para Secretarias

```markdown
## CONSTRAINTS (Restricoes)
- NAO falar precos de tratamentos
- NAO fazer diagnosticos
- NAO prometer resultados
- SEMPRE oferecer agendamento
- Horario de atendimento: 8h-18h

## ROLE (Papel)
Secretaria virtual da clinica [NOME], especializada em [ESPECIALIDADE].
Tom: Profissional, acolhedor, eficiente.

## INPUTS (Entradas)
- Mensagem do paciente via WhatsApp
- Historico de conversa
- Dados do CRM (se existir)

## TOOLS (Ferramentas)
- Agenda (verificar horarios)
- CRM (consultar/atualizar dados)
- Escalar (transferir para humano)

## INSTRUCTIONS (Instrucoes)
1. Cumprimentar cordialmente
2. Identificar necessidade
3. Qualificar interesse
4. Oferecer agendamento
5. Confirmar dados
6. Enviar confirmacao

## CONCLUSIONS (Conclusoes)
- Lead qualificado: Agendar avaliacao
- Lead nao qualificado: Agradecer e encerrar
- Duvida complexa: Escalar para humano

## SOLUTIONS (Solucoes)
- Objecao "nao tenho tempo": Oferecer horarios alternativos
- Objecao "quanto custa": Explicar que avaliacao e gratuita
- Objecao "vou pensar": Usar gatilho de escassez
```

---

## 4. PIPELINES GHL

### Pipeline Padrao Clinica
```
LEAD NOVO
    ↓
PRIMEIRO CONTATO (Secretaria IA)
    ↓
QUALIFICADO
    ↓
AGENDADO
    ↓
CONFIRMADO (24h antes)
    ↓
COMPARECEU / NO-SHOW
    ↓
AVALIACAO REALIZADA
    ↓
PROPOSTA ENVIADA
    ↓
NEGOCIACAO
    ↓
FECHADO / PERDIDO
```

### Automacoes por Estagio

| Estagio | Automacao | Trigger |
|---------|-----------|---------|
| Lead Novo | Msg boas-vindas | Entrada no pipeline |
| Agendado | Lembrete 24h | 24h antes |
| Agendado | Lembrete 1h | 1h antes |
| No-Show | Reagendamento | Nao compareceu |
| Proposta Enviada | Follow-up D+1 | 1 dia apos |
| Proposta Enviada | Follow-up D+3 | 3 dias apos |
| Perdido | Reativacao 30d | 30 dias apos |

---

## 5. METRICAS DA VERTICAL

### KPIs Principais
- **Taxa de Agendamento**: Meta 40%+
- **Taxa de Comparecimento**: Meta 75%+
- **Taxa de Fechamento**: Meta 30%+
- **Ticket Medio**: Varia por clinica
- **CAC**: Meta < 10% do ticket

### Dashboard Recomendado
```
┌─────────────────────────────────────────┐
│  METRICAS SEMANAIS                      │
├─────────────────────────────────────────┤
│  Leads: [###] | Agendados: [###]        │
│  Compareceram: [###] | Fechados: [###]  │
│  Faturamento: R$ [###.###]              │
│  Taxa Conversao: [##]%                  │
└─────────────────────────────────────────┘
```

---

## 6. INTEGRACAO TECNICA

### GHL - Campos Customizados
```
custom_field_especialidade
custom_field_urgencia (1-5)
custom_field_origem_lead
custom_field_interesse_tratamento
custom_field_data_avaliacao
custom_field_valor_proposta
```

### n8n - Workflows Necessarios
```
/Fluxos n8n/Clinicas/
├── 01-recepcao-lead.json
├── 02-qualificacao.json
├── 03-agendamento.json
├── 04-lembretes.json
├── 05-pos-avaliacao.json
├── 06-follow-up-proposta.json
├── 07-reativacao.json
└── 08-metricas.json
```

### Supabase - Tabelas
```sql
-- Tabela de interacoes
CREATE TABLE clinica_interacoes (
    id UUID PRIMARY KEY,
    clinica_id TEXT,
    lead_id TEXT,
    tipo TEXT, -- 'mensagem', 'agendamento', 'comparecimento'
    dados JSONB,
    created_at TIMESTAMP
);

-- Tabela de metricas
CREATE TABLE clinica_metricas (
    id UUID PRIMARY KEY,
    clinica_id TEXT,
    periodo DATE,
    leads INT,
    agendados INT,
    compareceram INT,
    fechados INT,
    faturamento DECIMAL
);
```

---

## 7. TEMPLATES DE MENSAGENS

### Boas-vindas
```
Ola [NOME]! 👋

Sou a [SECRETARIA], assistente virtual da [CLINICA].

Vi que voce demonstrou interesse em [TRATAMENTO].
Que otimo! Posso te ajudar a agendar uma avaliacao gratuita?

Me conta, qual seria o melhor horario pra voce?
```

### Lembrete 24h
```
Oi [NOME]! 😊

Passando pra lembrar da sua avaliacao amanha as [HORA] na [CLINICA].

Endereco: [ENDERECO]

Posso confirmar sua presenca?
```

### Follow-up Proposta
```
Ola [NOME]!

Espero que esteja bem! 😊

Passando pra saber se conseguiu analisar a proposta que o Dr. [NOME] enviou.

Ficou alguma duvida? Posso ajudar com algo?
```

---

## 8. CHECKLIST IMPLEMENTACAO

### Nova Clinica
- [ ] Coletar dados da clinica (nome, endereco, especialidade)
- [ ] Definir persona da secretaria (nome, tom, restricoes)
- [ ] Configurar subconta GHL
- [ ] Criar pipeline customizado
- [ ] Importar workflows n8n base
- [ ] Personalizar mensagens
- [ ] Configurar WhatsApp (Evolution API)
- [ ] Testar fluxo completo
- [ ] Treinar equipe do cliente
- [ ] Go-live com monitoramento

---

*Documento criado em: Dezembro 2025*
*Ultima atualizacao: v1.0*

# Mudanças: Julia (Clínica Lappe) → Maria (Orthodontic Biguaçu)

## 📋 Resumo Executivo

Adaptação do workflow de secretária virtual para atender as necessidades específicas da Orthodontic Biguaçu, focando em agendamento de avaliações gratuitas e comparecimento.

---

## ✅ Principais Mudanças Implementadas

### 1. **IDENTIDADE**
| Antes (Julia) | Depois (Maria) |
|---------------|----------------|
| Clínica Lappe | Orthodontic Biguaçu |
| Múltiplas especialidades | Foco ortodontia (95%) |
| Consultas pagas | Avaliação GRATUITA |

### 2. **INFORMAÇÕES DA CLÍNICA**

#### Endereço
```
R. Getúlio Vargas, 110 - Sala 03
Centro, Biguaçu - SC
CEP: 88160-128
```

#### Telefone
```
(48) 3067-3410
```

#### Horários
```
Segunda a Sexta: 08:30-12:00, 13:30-18:30
Sábado: 08:00-12:00
Domingo: Fechado
```

### 3. **PROFISSIONAIS**

| Nome | Especialidade | CRO |
|------|---------------|-----|
| Dra. Ana Paula Silochi Figueira | Ortodontia | 8348 |
| Ane Beatris Farias | Clínico Geral | 022336/SC |
| Dra. Gilvana Helena Cordeiro | Ortodontia | 18326 |
| Dra. Dayara Kellyn Seidler | Ortodontia | 18382 |
| Dr. Adriano Cleto De Souza | Orto/Clínico | 20374 |
| Dr. Gabriel Fernandes | Clínico Geral | 19860 |

### 4. **PROPOSTA DE VALOR**

✅ **Incluído GRATUITAMENTE:**
- Avaliação completa
- Raio-X
- Limpeza
- Aparelho (não paga pelo aparelho)
- Clareamento final (valor R$ 450)

💰 **Investimento:**
- Apenas R$ 125/mês (manutenção)

### 5. **FLUXO DE AGENDAMENTO SIMPLIFICADO**

#### ❌ REMOVIDO:
- Seleção de especialidade
- Solicitação de CPF
- Geração de cobrança/PIX
- Escolha de profissional específico
- Informações sobre convênios

#### ✅ NOVO FLUXO:
1. Paciente demonstra interesse
2. Maria reforça: "Avaliação 100% gratuita"
3. Coleta: Nome + Data Nascimento
4. Busca horário disponível
5. Agenda diretamente
6. Confirma com entusiasmo

### 6. **TOM DE VOZ ADAPTADO**

#### Pitch de Vendas Ortodôntico:
```
"Que ótimo! Nossa avaliação é 100% gratuita e inclui raio-X e limpeza.
Se você optar pelo aparelho, o investimento é super acessível: R$ 125/mês.
Vamos agendar?"
```

#### Confirmação de Agendamento:
```
"Sua avaliação gratuita foi confirmada para [data] às [hora]!
Vamos avaliar a melhor opção para transformar seu sorriso.
Te aguardamos na R. Getúlio Vargas, 110 - Sala 03, Centro de Biguaçu."
```

### 7. **TRATAMENTO DE OBJEÇÕES**

| Objeção | Resposta Maria |
|---------|----------------|
| "É caro?" | "Pelo contrário! A avaliação é gratuita e o aparelho sai apenas R$ 125/mês" |
| "Demora muito?" | "De 12 a 36 meses em média. Na avaliação vamos dar um prazo pro seu caso" |
| "Dói?" | "Pode ter leve desconforto nos primeiros dias, mas nossos pacientes se adaptam super rápido" |

---

## 🔧 Alterações Técnicas no Workflow

### Ferramentas REMOVIDAS:
- ❌ `Criar_ou_buscar_cobranca` (sistema da franquia resolve)
- ❌ Solicitação de CPF
- ❌ Validação de convênios

### Ferramentas MANTIDAS:
- ✅ `Buscar_janelas_disponiveis`
- ✅ `Criar_agendamento`
- ✅ `Buscar_agendamentos_do_contato`
- ✅ `Atualizar_agendamento`
- ✅ `Cancelar_agendamento`
- ✅ `Escalar_humano`
- ✅ `Enviar_alerta_de_cancelamento`
- ✅ `Reagir_mensagem`
- ✅ `Refletir`

### Configurações do Sistema:
- **Duração da consulta**: {{ $('Info2').item.json.agendamento_duracao_minutos }} minutos
- **ID da agenda**: {{ $('Info2').item.json.calendarID }}

---

## 📊 Validações e Regras de Negócio

### ✅ Mantidas:
- Horários dentro do funcionamento
- Nunca agendar datas passadas
- Máximo 3 tentativas de busca de horário
- Nome completo mínimo 2 palavras

### ❌ Removidas:
- Validação de CPF
- Limite de 1 agendamento ativo
- Restrição de 24h para reagendamento
- Validação de convênios

### ➕ Adicionadas:
- Não solicitar CPF em nenhuma circunstância
- Mencionar pagamento apenas se perguntado: "Paciente deve estar em dia"
- Nunca negociar valores diferentes de R$ 125/mês

---

## 🎯 Objetivos Alcançados

Com base na reunião do dia 21/11, a Maria agora atende:

✅ **Agendamento de avaliações gratuitas** (simplificado)
✅ **Confirmação de presença** (com reforço de valor)
✅ **Cancelamento e reagendamento** (sempre oferece remarcar)
✅ **Follow-up de no-show** (sistema já preparado)
✅ **Humanização máxima** (voz clonada, tom casual)
✅ **Foco em comparecimento** (principal gargalo da rede)

---

## 📝 Próximos Passos

1. **Copiar o conteúdo** de `prompt-orthodontic.md`
2. **Colar no workflow** (linha 3663 do arquivo `SDR clínica`)
3. **Testar** com conversas simuladas
4. **Ajustar** conforme feedback
5. **Ativar** para uso real

---

## 🚀 Funcionalidades Futuras (Não Implementadas)

Baseado na reunião de 10/11, funcionalidades para segunda fase:

- [ ] Prospecção ativa (enviar primeira mensagem)
- [ ] Pós-venda (pedir indicações)
- [ ] Nutrição de leads que não fecharam
- [ ] Omnicanalidade (WhatsApp → Tel → SMS)
- [ ] Integração com sistema da franquia (API)

---

## 📞 Contato

**Orthodontic Biguaçu**
- Endereço: R. Getúlio Vargas, 110 - Sala 03 - Centro, Biguaçu - SC, 88160-128
- Telefone: (48) 3067-3410
- Horário: Seg-Sex 08:30-12:00/13:30-18:30 | Sáb 08:00-12:00

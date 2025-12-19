ou# GUIA COMPLETO DOS WORKFLOWS - AI FACTORY MOTTIVME

> **Documento para RAG**: Este arquivo serve como base de conhecimento para o Agente de Suporte.
> Contém explicações claras e detalhadas de cada workflow do sistema AI Factory.

---

## VISÃO GERAL DO SISTEMA

A AI Factory da Mottivme é um sistema de automação que transforma calls de vendas e onboarding em agentes de IA personalizados para clientes. O fluxo completo vai desde a análise de calls de vendas até a criação e operação de agentes conversacionais.

### Fluxo Simplificado
```
Lead chega → SDR qualifica → Call de Diagnóstico → Análise IA → Fechamento
                                                                    ↓
                                           Call de Kickoff → Análise → Cria Agente
                                                                          ↓
                                                            Agente atende leads do cliente
                                                                          ↓
                                                     30 dias → Revisão → Melhoria contínua
```

---

## 01 - ORGANIZADOR DE CALLS

**Arquivo**: `01-Organizador-Calls.json`
**Fase**: Infraestrutura (sempre ativo)

### O que faz?
Monitora a pasta `/7. Calls/` no Google Drive e organiza automaticamente os arquivos de transcrição de calls.

### Como funciona?
1. Detecta quando um novo arquivo aparece na pasta raiz `/7. Calls/`
2. Lê o nome do arquivo para identificar o tipo de call (pelo prefixo)
3. Atribui um número sequencial ao arquivo (ex: `4 - Diagnóstico - ...`)
4. Move o arquivo para a subpasta correta
5. Salva os metadados no Supabase (tabela `call_recordings`)

### Prefixos e destinos
| Prefixo no nome | Subpasta destino | Próximo workflow |
|-----------------|------------------|------------------|
| `Diagnóstico` ou `Diagnostico` | `/1. Vendas/` | 02-AI-Agent-Head-Vendas |
| `Kickoff` | `/2. Onboarding/` | 03-Call-Analyzer-Onboarding |
| `Acompanhamento` | `/3. Revisão/` | 06-Call-Analyzer-Revisao |
| `Suporte` | `/4. Suporte/` | 08-Call-Analyzer-Suporte |
| `Alinhamento` | `/5. Churn/` | 09-Call-Analyzer-Churn |
| Outros | `/6. Outros/` | Notifica CS |

### Formato esperado do nome do arquivo
```
{Número} - {Tipo} - {Nome do Contato} - {Telefone} - {LocationID} - {Data} - Anotações do Gemini - {timestamp}
```

**Exemplo real:**
```
4 - Diagnóstico - João Silva - (11) 99999-9999 - cd1uyzpJox6XPt4Vct8Y - 2025/12/17 17:00 - Anotações do Gemini - 2025-12-17_17-34
```

### Tabela Supabase
- **Tabela**: `call_recordings`
- **Campos principais**: tipo, gdrive_file_id, contact_id, location_id, nome_lead, telefone, status

### Possíveis problemas
- **Arquivo não é movido**: Nome não segue o padrão de prefixos
- **Duplicata**: Arquivo já existe com mesmo ID no Supabase
- **Permissão**: Credencial Google Drive sem acesso à pasta

---

## 02 - AI AGENT HEAD DE VENDAS

**Arquivo**: `02-AI-Agent-Head-Vendas.json`
**Fase**: Vendas

### O que faz?
Analisa transcrições de calls de diagnóstico (vendas) e fornece scores detalhados para ajudar o time comercial a priorizar leads.

### Como funciona?
1. Trigger: Monitora pasta `/7. Calls/1. Vendas/`
2. Busca os dados da call no Supabase (JOIN com `locations` para pegar API key)
3. Exporta o conteúdo do Google Doc como texto
4. Envia para IA (Groq Llama 3.3 70B) com prompt de análise BANT/SPIN
5. Processa resposta e calcula tier (A+, B, C, D)
6. Salva no Custom Object `anlises_de_call` no GHL
7. Associa a análise ao contato
8. Atualiza Custom Fields do contato
9. Atualiza status no Supabase para "analisado"

### Scores gerados (0-100)
| Score | O que avalia |
|-------|--------------|
| **BANT Score** | Budget, Authority, Need, Timeline |
| **SPIN Score** | Situation, Problem, Implication, Need-payoff |
| **Condução Score** | Qualidade da condução da call pelo vendedor |
| **Fechamento Score** | Técnicas de fechamento aplicadas |
| **Probabilidade** | Chance de fechar o negócio (0-100%) |

### Classificação por Tier
| Tier | Pontuação Geral | Significado |
|------|-----------------|-------------|
| A+ EXCELENTE | 80-100 | Lead quente, prioridade máxima |
| B BOA | 60-79 | Lead bom, seguir processo normal |
| C MEDIANA | 40-59 | Lead morno, nutrir antes de avançar |
| D FRACA | 0-39 | Lead frio, baixa prioridade |

### Custom Object no GHL
- **Object**: `anlises_de_call`
- **19 campos**: resumo, scores, sentimento, próximos passos, objeções, etc.

### Possíveis problemas
- **Call não encontrada no Supabase**: Organizador de Calls não rodou
- **Erro na API GHL**: API key inválida ou expirada
- **Análise incompleta**: Transcrição muito curta ou corrompida

---

## 03 - CALL ANALYZER ONBOARDING

**Arquivo**: `03-Call-Analyzer-Onboarding.json`
**Fase**: Onboarding (pós-fechamento)

### O que faz?
Analisa a call de Kickoff com o novo cliente e extrai todas as informações necessárias para configurar o agente de IA personalizado.

### Como funciona?
1. Trigger: Monitora pasta `/7. Calls/2. Onboarding/`
2. Busca dados da call no Supabase
3. Exporta transcrição do Google Doc
4. Envia para IA (Claude) com prompt especializado de extração
5. Gera `agent_config` com: negócio, personalidade, compliance, qualificação, integrações
6. Salva análise no Custom Object `anlises_de_call` (tipo: "kickoff")
7. Salva `agent_config` no campo `analise_json` do Supabase
8. Atualiza status para "analisado"

### Informações extraídas
| Categoria | Exemplos |
|-----------|----------|
| **Negócio** | Nome da clínica, serviços, tickets, diferenciais |
| **Personalidade** | Tom de voz, formalidade, emojis, palavras-chave |
| **Compliance** | O que o agente NÃO pode falar (preços, diagnósticos) |
| **Qualificação** | Perguntas que o agente deve fazer |
| **Integrações** | Calendário, WhatsApp, sistemas existentes |

### Próximo passo
Após análise, o **Agent Factory** (04) é acionado para criar o agente.

### Possíveis problemas
- **Call muito curta**: Kickoff incompleto, faltam informações
- **Informações contraditórias**: CS deve revisar antes de aprovar agente

---

## 04 - AGENT FACTORY

**Arquivo**: `04-Agent-Factory.json`
**Fase**: Onboarding (criação do agente)

### O que faz?
Cria o agente de IA personalizado para o cliente com base nas informações extraídas do Kickoff.

### Como funciona?
1. Poll a cada 5 minutos: Busca calls tipo "kickoff" com status "analisado"
2. Lê o `agent_config` do campo `analise_json`
3. Gera system_prompt refinado usando skill de conversational prompts
4. Cria registro em `agent_versions` no Supabase (status: pending_approval)
5. Cria Custom Object `Agentes` no GHL
6. Associa Agente ao Contato
7. Notifica CS via WhatsApp para aprovar

### Tabela agent_versions
| Campo | Descrição |
|-------|-----------|
| `client_id` | ID do cliente no Supabase |
| `versao` | v1.0, v1.1, etc. |
| `system_prompt` | Prompt completo do agente |
| `tools_config` | Ferramentas habilitadas (JSON) |
| `compliance_rules` | Regras de compliance (JSON) |
| `status` | pending_approval, active, deprecated |
| `is_active` | Se é a versão ativa |

### Fluxo de aprovação
1. Agente criado com `status = pending_approval`
2. CS recebe notificação no WhatsApp
3. CS revisa e aprova via Engenheiro de Prompt (07)
4. Status muda para `active`, `is_active = true`

### Possíveis problemas
- **agent_config incompleto**: Voltar ao Kickoff e extrair mais informações
- **Cliente duplicado**: Já existe agente ativo para esse contact_id

---

## 05 - AI AGENT CONVERSACIONAL

**Arquivo**: `05-AI-Agent-Conversacional.json`
**Fase**: Operação (atendimento de leads)

### O que faz?
É o agente que efetivamente atende os leads do cliente via WhatsApp, usando a configuração criada pelo Agent Factory.

### Como funciona?
1. Webhook recebe mensagem (GHL ou WhatsApp direto)
2. Extrai dados: contact_id, location_id, message_text
3. Valida se mensagem não está vazia
4. Busca agente ativo no Supabase por `location_id`
5. Carrega `system_prompt` dinâmico do agente
6. Busca histórico de mensagens (últimas 10)
7. Monta array de messages para OpenAI
8. Chama IA (GPT-4o-mini) com system_prompt + histórico + mensagem
9. Salva mensagem + resposta em `agent_conversation_messages`
10. Envia resposta via GHL ou WhatsApp

### Formatos de entrada suportados
| Fonte | Campos esperados |
|-------|------------------|
| **GHL** | contactId, locationId, body, conversationId |
| **WhatsApp** | data.message, key.remoteJid, pushName |
| **Genérico** | contact_id, message, phone |

### Tabelas usadas
- `agent_versions` - Busca agente ativo
- `agent_conversations` - Registra conversa
- `agent_conversation_messages` - Histórico de mensagens

### Possíveis problemas
- **Nenhum agente configurado**: Retorna "no_agent"
- **Agente não ativo**: `is_active = false`, precisa aprovar
- **Resposta não enviada**: Verificar API key do GHL

---

## 06 - CALL ANALYZER REVISÃO

**Arquivo**: `06-Call-Analyzer-Revisao.json`
**Fase**: Melhoria Contínua (30 dias)

### O que faz?
Analisa calls de acompanhamento usando framework PDCA e sugere melhorias para o agente.

### Como funciona?
1. Trigger: Monitora pasta `/7. Calls/3. Revisão/`
2. Busca agente ativo pelo contact_id no Supabase
3. Exporta transcrição da call de acompanhamento
4. Envia para IA com framework PDCA + versão atual do agente
5. Gera análise: O que funcionou? O que não funcionou? O que mudar?
6. Cria nova versão do agente (ex: v1.0 → v1.1)
7. Status: `pending_approval` (nunca aplica direto!)
8. Cria Custom Object `Revisões de Agente` no GHL
9. Notifica CS para aprovar

### Framework PDCA
| Etapa | Pergunta |
|-------|----------|
| **Plan** | O que foi planejado para o agente? |
| **Do** | O que o agente executou no período? |
| **Check** | O que funcionou? O que não funcionou? |
| **Act** | O que precisa mudar na próxima versão? |

### Campos da nova versão
- `previous_version_id`: Referência à versão anterior
- `versao`: Incrementa (v1.0 → v1.1)
- `change_summary`: Resumo das mudanças

### Possíveis problemas
- **Agente não encontrado**: Cliente não tem agente ativo
- **Feedback insuficiente**: Call de acompanhamento muito superficial

---

## 07 - ENGENHEIRO DE PROMPT

**Arquivo**: `07-Engenheiro-de-Prompt.json`
**Fase**: Melhoria Contínua (sob demanda)

### O que faz?
Permite ajustes pontuais em prompts de agentes via webhook, com 7 comandos disponíveis.

### Como funciona?
1. Webhook POST recebe comando (JSON ou texto)
2. Identifica o comando e executa ação correspondente
3. Para edições, IA (Groq) aplica mudanças de forma inteligente
4. SEMPRE cria versão `pending_approval` (nunca aplica direto!)
5. Registra solicitação em `prompt_change_requests`

### Comandos disponíveis
| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `listar` | Lista agentes do cliente | `listar location_id=xxx` |
| `ver` | Mostra prompt atual | `ver agent_id=xxx` |
| `editar` | Solicita mudança | `editar agent_id=xxx mudanca="adicionar emoji"` |
| `historico` | Histórico de versões | `historico agent_id=xxx` |
| `rollback` | Volta versão anterior | `rollback agent_id=xxx versao=v1.0` |
| `aprovar` | Aprova versão pending | `aprovar version_id=xxx` |
| `rejeitar` | Rejeita versão pending | `rejeitar version_id=xxx motivo="..."` |

### Endpoint
```
POST https://n8n.mottivme.com.br/webhook/engenheiro-prompt
```

### Formatos aceitos
**JSON:**
```json
{
  "comando": "editar",
  "agent_id": "uuid",
  "mudanca": "Adicionar mais emojis nas respostas"
}
```

**Texto (WhatsApp/Slack):**
```
editar agent_id=xxx mudanca="Adicionar mais emojis"
```

### Tabela prompt_change_requests
Registra todas as solicitações de mudança para auditoria.

---

## 08 - QA ANALYST

**Arquivo**: `08-QA-Analyst.json`
**Fase**: Operação (monitoramento contínuo)
**Status**: 🔴 P0 - A criar (prioridade máxima)

### O que faz?
Monitora automaticamente a qualidade das conversas dos agentes e detecta problemas antes que virem reclamações de clientes.

### Como funciona?
1. **Trigger Cron**: Roda a cada 1 hora
2. Busca últimas 50 conversas de todos os agentes ativos
3. Para cada conversa, IA analisa:
   - Nota de qualidade (0-10)
   - Objeções não tratadas
   - Loops detectados (mesma resposta 3x+)
   - Tempo de resposta excessivo
   - Compliance (se agente quebrou regras)
4. Se nota < 6 → Alerta WhatsApp para CS
5. Se objeção recorrente → Sugere melhoria no prompt
6. Salva análise em `agent_qa_logs`

### Critérios de avaliação (0-10)
| Critério | Peso | O que avalia |
|----------|------|--------------|
| **Resolução** | 30% | Conversa resolveu o problema do lead? |
| **Tone/Personalidade** | 20% | Manteve o tom configurado? |
| **Compliance** | 25% | Respeitou regras (não falar preço, etc.)? |
| **Eficiência** | 15% | Respostas objetivas ou muito prolixas? |
| **Engajamento** | 10% | Lead continuou conversando? |

### Tabela Supabase: agent_qa_logs
```sql
CREATE TABLE agent_qa_logs (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  agent_version_id UUID,
  nota_qualidade INTEGER, -- 0-10
  problemas_detectados JSONB, -- ["loop", "objecao_nao_tratada"]
  sugestoes_melhoria TEXT,
  alertado_cs BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tipos de alerta automático
| Problema | Threshold | Ação |
|----------|-----------|------|
| Nota < 6 | 1 conversa | WhatsApp CS imediato |
| Loop detectado | 3x mesma resposta | WhatsApp CS + escala para humano |
| Objeção recorrente | 5x em 7 dias | Sugere melhoria no prompt |
| Compliance violation | 1x | WhatsApp CS crítico + pausa agente |

### Possíveis problemas
- **Muitos falsos positivos**: Ajustar thresholds de alertas
- **IA muito rigorosa**: Calibrar critérios de avaliação
- **Sobrecarga de alertas**: Implementar agrupamento (ex: 1 alerta/dia)

---

## 09 - ASSISTENTE IA EXECUTIVA (SOFIA)

**Arquivos**:
- `09a-Assistente-Gatilhos-Ativos.json`
- `09b-Assistente-WhatsApp-Inbox.json`
- `09c-Assistente-Monday-Sync.json`

**Fase**: Gestão CEO (produtividade interna)
**Status**: 🟡 P1 - Documentado, aguardando implementação

### O que faz?
Sistema de accountability inteligente para maximizar produtividade do CEO através de gatilhos proativos e assistência reativa via WhatsApp.

### Workflows

#### 09a - Gatilhos Ativos
**Triggers**: Cron jobs em 4 horários específicos

| Horário | Nome | O que faz |
|---------|------|-----------|
| **08:00** | Morning Routine | Apresenta tarefas do Monday.com + força escolha de 3 INEGOCIÁVEIS |
| **12:00** | Noon Check-in | Status das 3 inegociáveis + lembra deadline (faltam 6h) |
| **15:00** | Afternoon Alert | Alerta de urgência (faltam 3h) + pressão se tarefa crítica pendente |
| **18:00** | Evening Review | Review do dia + calcula score (0-100) + celebra ou motiva |

**Como funciona cada gatilho:**
1. Busca tarefas do dia (`assistente_tasks`)
2. Busca objetivos de longo prazo (`assistente_objectives`)
3. Monta mensagem contextualizada
4. Envia via WhatsApp + Desktop (osascript)
5. Loga interação (`assistente_interactions`)

#### 09b - WhatsApp Inbox
**Trigger**: Webhook (Evolution API recebe mensagem do CEO)

**Comandos reconhecidos:**
```yaml
Marcar concluída:
  - "Concluí [tarefa]"
  - "Terminei [tarefa]"

Adicionar tarefa:
  - "Adiciona [título]"
  - "Preciso fazer [título]"

Status:
  - "Como estou hoje?"
  - "Qual o score?"

Motivação:
  - "Me lembra porque estou fazendo isso"
  - "Por que isso importa?"
```

**Fluxo:**
1. Recebe mensagem do CEO
2. Busca contexto (tarefas, objetivos, histórico)
3. Processa com Claude AI
4. Executa ação se necessário (ex: marcar tarefa como concluída)
5. Responde via WhatsApp
6. Loga interação

#### 09c - Monday Sync
**Trigger**: Cron diário às 07:00

**Funcionalidade:**
1. Busca todas as tarefas do Monday.com (via API)
2. Filtra: status != done
3. Sincroniza com PostgreSQL (`assistente_tasks`)
4. Atualiza estado diário (`assistente_daily_state`)
5. Prepara dados para gatilhos do dia

### Tabelas Supabase (5 tabelas)
| Tabela | Função |
|--------|--------|
| `assistente_tasks` | Tarefas sincronizadas do Monday |
| `assistente_interactions` | Histórico de todas as interações |
| `assistente_objectives` | Objetivos, missão e propósito (memória longo prazo) |
| `assistente_daily_state` | Métricas e score diário |
| `assistente_scheduled_messages` | Mensagens agendadas |

### Cálculo de Score Diário
```
Score = (critical_completed / 3) * 70 + (tasks_completed / tasks_total) * 30

Exemplo:
- 3 inegociáveis completas + 5 de 10 tarefas totais
- Score = (3/3)*70 + (5/10)*30 = 70 + 15 = 85
```

### Integrações
| Serviço | Uso |
|---------|-----|
| Monday.com | Gestão de tarefas (sync diário) |
| Claude AI (Anthropic) | Processamento conversacional |
| Evolution API | WhatsApp |
| osascript (macOS) | Notificações Desktop |

### Possíveis problemas
- **Monday.com API lenta**: Implementar cache local
- **Gatilhos não disparam**: Verificar cron jobs ativos
- **WhatsApp não responde**: Verificar Evolution API key

---

## WORKFLOWS PLANEJADOS (ROADMAP P0-P3)

### 10 - FEEDBACK LOOP OPORTUNIDADE

**Arquivo**: `10-Feedback-Loop-Oportunidade.json`
**Fase**: Vendas (feedback loop)
**Status**: 🔴 P0 - A criar (2h)
**Prioridade**: CRÍTICA - Necessário para calibração da IA

### O que vai fazer?
Quando uma oportunidade é marcada como GANHO ou PERDIDO no GHL, atualiza a análise de call original com o resultado real para calibrar previsões.

### Como vai funcionar?
1. **Trigger**: Webhook GHL (opportunity.status_change)
2. Busca análise de call associada ao contact_id
3. Atualiza campo `resultado_real` (ganho/perdido)
4. Calcula `delta_previsao` (diferença entre probabilidade_prevista vs resultado_real)
5. Registra para calibração futura da IA
6. Alimenta dashboard de acurácia

### Campos novos em anlises_de_call
- `resultado_real` (ganho/perdido)
- `data_resultado`
- `delta_previsao` (diferença entre previsão e resultado)

### Métricas geradas
- Taxa de acurácia da IA por vendedor
- Calibração: "IA previu 80%, fechou = acurácia boa"
- Identificação de viés (IA otimista/pessimista demais)

---

### 11 - CUSTOM OBJECT: OBJEÇÕES

**Tipo**: Configuração GHL (não é workflow)
**Fase**: Vendas
**Status**: 🔴 P0 - A criar (3h)
**Prioridade**: CRÍTICA - Bloqueia análises de vendas completas

### O que é?
Novo Custom Object no GHL para rastrear objeções detectadas em vendas, renovação e cancelamentos.

### Campos necessários
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tipo` | Select | texto, preço, timing, marido, medo |
| `intensidade` | Select | baixa, média, alta |
| `contexto` | Select | venda, renovacao, cancelamento |
| `status` | Select | detectada, tratada, persistente |
| `proxima_acao` | Text | Ação sugerida |
| `data_deteccao` | DateTime | Quando foi detectada |
| `data_resolucao` | DateTime | Quando foi resolvida |

### Quem alimenta?
- AI Head de Vendas (vendas)
- AI Agent Conversacional (durante atendimento)
- Call Analyzer Churn (cancelamentos)

### Uso futuro
- Dashboard de objeções agregadas (P3)
- Alimenta Assembly Line para novos criativos
- Playbooks dinâmicos por objeção

---

### 12 - SISTEMA DE ONBOARDING AUTOMATIZADO

**Arquivos**:
- `12a-Score-Implementacao.json`
- `12b-Tracker-Score.json`
- `12c-Follow-up-Niveis.json`
- `12d-Kickstart-Automatico.json`

**Fase**: Onboarding/Retenção
**Status**: 🟡 P1 - Documentado (8h total)
**Objetivo**: Reduzir churn nos primeiros 30 dias de 20% para 10%

### O que vai fazer?
Acompanha implementação do cliente com score 0-100 pontos e follow-up automatizado baseado em níveis.

### Componentes

#### 12a - Score de Implementação (0-100 pontos)
**Critérios:**
- Agente ativo: 20 pts
- Primeiro agendamento feito pelo agente: 15 pts
- 10 conversas completas: 15 pts
- Taxa de resolução > 70%: 15 pts
- Sem escalações críticas: 10 pts
- Cliente respondeu pesquisa satisfação: 10 pts
- Revisor de prompt configurado: 10 pts
- Integração calendário funcionando: 5 pts

#### 12b - Tracker de Score
- Atualiza score diariamente (cron 00:00)
- Salva em `onboarding_score_history`
- Gera alertas quando score < 50

#### 12c - Follow-up em Níveis
| Nível | Score | Ação |
|-------|-------|------|
| 1 - CRÍTICO | 0-30 | Stevo liga em 24h + call alinhamento |
| 2 - ATENÇÃO | 31-60 | WhatsApp diário + tutorial problema |
| 3 - ACOMPANHAMENTO | 61-80 | WhatsApp 2x/semana + dicas |
| 4 - EXCELÊNCIA | 81-100 | Case study + oferta upgrade |

#### 12d - Kickstart Automático
Timeline:
- Dia 0: Boas-vindas + Checklist
- Dia 1: Tutorial configuração
- Dia 3: Primeira call de acompanhamento
- Dia 7: Review de métricas
- Dia 15: Ajustes finos
- Dia 30: Call de celebração + upsell

---

### 13 - CALL ANALYZER SUPORTE

**Arquivo**: `13-Call-Analyzer-Suporte.json`
**Fase**: Suporte
**Status**: 🟡 P2 - Planejado (3h)

### O que vai fazer?
Analisar calls de suporte para categorizar issues e alimentar base de conhecimento.

### Funcionalidades planejadas
- Categorizar tipo de problema (técnico, dúvida, reclamação)
- Identificar bugs recorrentes
- Sugerir melhorias no agente
- Criar Custom Object "Análises de Call" tipo=suporte

---

### 14 - CALL ANALYZER CHURN

**Arquivo**: `14-Call-Analyzer-Churn.json`
**Fase**: Churn/Recuperação
**Status**: 🟢 P3 - Planejado (3h)

### O que vai fazer?
Analisar calls de alinhamento (quando cliente quer cancelar) e sugerir ações de recuperação.

### Funcionalidades planejadas
- Extrair motivos de cancelamento
- Classificar: recuperável vs. irrecuperável
- Sugerir oferta de retenção
- Alimentar dashboard de churn reasons
- Criar registro em tabela `churn_reasons`

---

### 15 - DASHBOARD CLIENTE (MVP)

**Tipo**: Aplicação Web (não é workflow n8n)
**Stack**: Next.js + Supabase + Recharts
**Status**: 🟡 P2 - Planejado (8h)

### O que vai fazer?
Cliente vê métricas do próprio agente em tempo real.

### Páginas
1. **Overview**: Conversas totais, taxa resolução, satisfação, agendamentos
2. **Conversas Recentes**: Últimas 20 conversas + highlights
3. **Performance**: Gráficos 30 dias + comparativo com benchmark

### Autenticação
- Clerk (email + senha por cliente)
- Deploy: Vercel

---

### 16 - ARTILHARIA NUCLEAR (Recuperação de Perdidos)

**Arquivo**: `16-Artilharia-Nuclear.json`
**Fase**: Vendas Avançado
**Status**: 🟢 P3 - Planejado (14h)

### O que vai fazer?
Recuperar oportunidades perdidas com sequências IA personalizadas.

### Fluxo
1. Oportunidade marcada como PERDIDA
2. Aguarda 7 dias (cooling period)
3. IA analisa: motivo, histórico, objeções, perfil
4. Gera estratégia personalizada:
   - Preço → Oferta limitada
   - Timing → Follow-up 30/60/90 dias
   - Marido → Conteúdo educativo
5. Dispara sequência: Email + WhatsApp + VSL customizado
6. Tracking de reconquista

### Métricas
- Taxa de recuperação
- ROI (custo IA vs. valor recuperado)

---

## GLOSSÁRIO RÁPIDO

| Termo | Significado |
|-------|-------------|
| **BANT** | Budget, Authority, Need, Timeline - framework de qualificação |
| **SPIN** | Situation, Problem, Implication, Need-payoff - framework de vendas |
| **Tier** | Classificação de lead (A+, B, C, D) |
| **Custom Object** | Objeto personalizado no GHL |
| **agent_versions** | Tabela de versões de agentes no Supabase |
| **pending_approval** | Status de versão aguardando aprovação do CS |
| **PDCA** | Plan-Do-Check-Act - ciclo de melhoria contínua |

---

## TROUBLESHOOTING RÁPIDO

| Problema | Causa provável | Solução |
|----------|----------------|---------|
| Arquivo não é movido | Nome sem prefixo correto | Renomear com Diagnóstico/Kickoff/etc |
| Análise não aparece no GHL | API key expirada | Verificar/renovar no GHL |
| Agente não responde | is_active = false | Aprovar via Engenheiro de Prompt |
| Erro "no_agent" | Não existe agente para location | Verificar se kickoff foi processado |
| Versão não é aplicada | Faltou aprovar | Usar comando `aprovar version_id=xxx` |

---

**Documento criado para RAG do Agente de Suporte Mottivme**
**Última atualização**: 2025-12-18 (v2.0)
**Changelog v2.0**:
- Adicionado Workflow 08: QA Analyst (P0)
- Adicionado Workflow 09: Assistente IA Executiva/Sofia (P1)
- Reorganizada seção de workflows planejados com roadmap P0-P3
- Detalhamento de 16 workflows totais (07 implementados + 09 planejados)
- Adicionadas estimativas de tempo e prioridades

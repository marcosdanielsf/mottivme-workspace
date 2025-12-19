# AGENTE ESTRATEGISTA CS - ARQUITETURA COMPLETA

## VISAO GERAL

Sistema de **suporte personalizado e gamificado** que transforma os outputs do Assembly Line em **ações concretas** que o cliente precisa executar.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASSEMBLY LINE                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │  Clone  │→ │Posicion.│→ │ Ofertas │→ │Conteudo │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
│       │            │            │            │                  │
│       ▼            ▼            ▼            ▼                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AGENTE ESTRATEGISTA CS                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │   │
│  │  │ Perfil  │ │ Acoes   │ │ Follow  │ │ Gamificacao     │ │   │
│  │  │ Cliente │ │ Mapping │ │  Ups    │ │ (Pontos/Rank)   │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              CANAIS DE COMUNICACAO                       │   │
│  │     WhatsApp  │  Email  │  App (Chat)  │  SMS           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMPONENTES DO SISTEMA

### 1. PERFIL COMPORTAMENTAL (client_profiles)

Armazena o **arquétipo DISC** e padrões de comunicação do cliente:

| Arquétipo | Características | Como o Agente se Adapta |
|-----------|-----------------|------------------------|
| **Dominante** | Direto, resultados, rápido | Mensagens curtas, foco em outcome |
| **Influente** | Sonhador, comunicativo, ideias | Entusiasmado mas puxa para ACAO |
| **Estável** | Paciente, seguro, previsível | Passo a passo, sem pressão |
| **Conforme** | Analítico, detalhista, técnico | Dados, métricas, documentação |

**Regra de Ouro: COMUNICACAO COMPLEMENTAR**
- Se o cliente é **Influente** (só ideias) → Agente **puxa para ação**
- Se o cliente é **Dominante** (só executa) → Agente **traz estratégia**
- Se o cliente é **Estável** (paralisa) → Agente **dá segurança**
- Se o cliente é **Conforme** (analisa demais) → Agente **simplifica**

### 2. MAPEAMENTO DE OUTPUTS → ACOES (assembly_line_outputs_map)

Cada output do Assembly Line tem uma ação associada:

| Output | Ação | Ferramenta | Pontos |
|--------|------|------------|--------|
| system_prompt | Criar GPT personalizado | ChatGPT Plus | 25 |
| big_idea | Criar landing page | Lovable/Bolt | 30 |
| avatar | Validar com clientes reais | - | 15 |
| promessas | Testar em posts | Instagram | 20 |
| high_ticket | Estruturar página de vendas | Lovable | 35 |

**Trigger Automático:**
Quando uma fase fica `ready` → Cria automaticamente as ações no `action_items`

### 3. SISTEMA DE FOLLOW-UP AUTOMATICO

**Frequência:** 3x ao dia (9h, 14h, 19h)

**Tipos de Follow-up:**
1. **Lembrete** - 1-2 dias sem ação
2. **Cobrança** - 3-5 dias sem ação
3. **Ajuda** - Quando detecta que travou
4. **Celebração** - Quando completa ação
5. **Reengajamento** - 5+ dias inativo
6. **Escalação** - Quando precisa humano

**Personalização por Arquétipo:**
```
INFLUENTE:
"E aíí João! 🔥 Lembra daquela missão top?
Bora fazer em 15 min? Tem 20 pontos te esperando!"

DOMINANTE:
"João, ação pendente: criar landing page.
Quando terminar me avisa. 30 pontos te esperando."

ESTAVEL:
"Olá João! Tudo bem? Só passando pra lembrar da ação.
Sem pressa, mas quando puder me conta como está."

CONFORME:
"João, análise da ação: 3 dias após o prazo.
Impacto no ranking: posição atual #5.
Recomendação: priorizar conclusão."
```

### 4. SISTEMA DE GAMIFICACAO

**Níveis:**
| Nível | Nome | Pontos Necessários |
|-------|------|-------------------|
| 1 | Iniciante | 0 |
| 2 | Aprendiz | 100 |
| 3 | Praticante | 500 |
| 4 | Expert | 1.000 |
| 5 | Mestre | 2.500 |
| 6 | Lenda | 5.000 |

**Como Ganhar Pontos:**
- Completar ação: +10 a +35 pontos (varia por ação)
- Completar antes do prazo: +5 pontos bonus
- Manter streak: +10 pontos por cada 7 dias consecutivos
- Subir de nível: Badge especial

**Como Perder Pontos:**
- Ação atrasada: -5 pontos por dia de atraso
- Inatividade 7+ dias: -20 pontos

**Badges:**
- `primeiro_clone` - Configurou o primeiro clone
- `landing_pronta` - Criou primeira landing page
- `streak_7_dias` - 7 dias consecutivos de ação
- `streak_30_dias` - 30 dias consecutivos
- `top_10_ranking` - Entrou no top 10

---

## FLUXO DE USO

### 1. Cliente completa Assembly Line
```
[Clone READY]
    → Trigger cria action_items da fase 'clone'
    → Agendado follow-up para D+1
```

### 2. Agente envia primeira mensagem
```
"E aíí João! 🔥
Seu clone ficou pronto!

Primeira missão: configurar ele no ChatGPT.
Leva 10 minutos e você ganha 25 pontos!

Quer que eu explique o passo a passo?"
```

### 3. Cliente responde / interage
```
Cliente: "Cara, tive umas 10 ideias do que fazer!"

Agente: "BOOOA! Adoro a energia! 🔥
De todas essas ideias, qual você consegue fazer AGORA?

Minha sugestão: configura o clone primeiro.
Faz isso e me manda o resultado. Bora? ⚡"
```

### 4. Cliente completa ação
```
→ Função complete_action_item() é chamada
→ Soma pontos
→ Atualiza streak
→ Verifica se subiu de nível
→ Cancela follow-ups pendentes
→ Envia mensagem de celebração

"BOOOOOA João! 🎉
Você acabou de ganhar 25 pontos!
Agora você está no nível APRENDIZ e na posição #12 do ranking!

Próxima missão: criar sua landing page com a Big Idea.
Bora? Essa vale 30 pontos!"
```

### 5. Se cliente não responde
```
D+1: Lembrete leve
D+3: Cobrança média + oferta de ajuda
D+5: Cobrança firme + consequências
D+7: Escalação para humano (se configurado)
```

---

## ARQUIVOS CRIADOS

```
/supabase/migrations/
  └── 003_estrategista_cs_gamification.sql  # Schema completo

/prompts/
  └── agente-estrategista-cs.md             # System prompt do agente

/n8n/
  └── workflow-follow-up-automatico.json    # Workflow de follow-ups
```

---

## COMO IMPLEMENTAR

### Passo 1: Rodar Migration no Supabase
```sql
-- Execute o arquivo 003_estrategista_cs_gamification.sql no SQL Editor do Supabase
```

### Passo 2: Adicionar mais ações no mapa de outputs
```sql
INSERT INTO assembly_line_outputs_map (
  fase, tabela_origem, campo_origem, titulo_acao,
  instrucao_padrao, ferramenta_principal, pontos_padrao
) VALUES (
  'clone', 'clone_experts', 'system_prompt',
  'Configurar Clone no ChatGPT',
  'Cole o prompt em um GPT personalizado...',
  'ChatGPT Plus',
  25
);
```

### Passo 3: Importar workflow no n8n
1. Copie o conteúdo de `workflow-follow-up-automatico.json`
2. No n8n: Import from JSON
3. Configure as credenciais (Postgres, WhatsApp, Email)
4. Ative o workflow

### Passo 4: Integrar o chat no frontend
- Usar o system prompt em `/prompts/agente-estrategista-cs.md`
- Injetar dados do cliente dinamicamente nas variáveis
- Conectar com API do Claude/GPT

---

## PROXIMOS PASSOS SUGERIDOS

1. **Frontend do Chat** - Criar interface de chat no app
2. **API do Agente** - Criar endpoint que monta o prompt com dados do cliente
3. **Detecção de Arquétipo** - Criar quiz ou IA que detecta automaticamente
4. **Dashboard de Gamificação** - Mostrar ranking, pontos, badges
5. **Integrações** - WhatsApp Business API, Twilio para SMS

---

## METRICAS A ACOMPANHAR

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Taxa de Conclusão | Ações completadas / atribuídas | >60% |
| Tempo Médio Conclusão | Dias entre criar e completar | <5 dias |
| Streak Médio | Dias consecutivos de ação | >7 dias |
| Churn de Inatividade | Clientes inativos >14 dias | <20% |
| NPS do Agente | Satisfação com suporte | >8 |

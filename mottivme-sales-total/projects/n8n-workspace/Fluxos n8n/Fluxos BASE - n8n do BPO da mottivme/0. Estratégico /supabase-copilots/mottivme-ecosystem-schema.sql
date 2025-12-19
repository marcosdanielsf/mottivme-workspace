-- =============================================
-- MOTTIVME ECOSYSTEM - SCHEMA COMPLETO
-- Sistema interno: Time, Gamificacao, Bugs, Specs, Orchestrator
-- Execute no Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TEAM MEMBERS - Membros do time Mottivme
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados basicos
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  avatar_url TEXT,

  -- Funcao
  cargo TEXT NOT NULL, -- 'CEO', 'BDR Supervisor', 'SDR', 'Gestor Trafego', 'Social Media', 'Admin', 'BDR'
  departamento TEXT, -- 'Comercial', 'Marketing', 'Operacoes', 'Financeiro'

  -- DISC Profile
  disc_primario TEXT CHECK (disc_primario IN ('dominante', 'influente', 'estavel', 'conforme')),
  disc_secundario TEXT CHECK (disc_secundario IN ('dominante', 'influente', 'estavel', 'conforme')),

  -- Comunicacao preferida
  tom_preferido TEXT CHECK (tom_preferido IN ('direto', 'detalhado', 'motivacional', 'calmo')),
  canal_preferido TEXT CHECK (canal_preferido IN ('whatsapp', 'email', 'monday', 'call')),

  -- Horarios
  horario_inicio TIME DEFAULT '09:00',
  horario_fim TIME DEFAULT '18:00',
  dias_trabalho INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 0=dom, 1=seg, etc
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'ferias', 'afastado', 'desligado')),
  data_entrada DATE DEFAULT CURRENT_DATE,
  data_saida DATE,

  -- IDs externos
  monday_user_id TEXT,
  ghl_user_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TEAM GAMIFICATION - Pontuacao do time
-- =============================================
CREATE TABLE IF NOT EXISTS team_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE UNIQUE,

  -- Pontos
  pontos_totais INTEGER DEFAULT 0,
  pontos_mes_atual INTEGER DEFAULT 0,
  pontos_semana_atual INTEGER DEFAULT 0,

  -- Nivel (1-10)
  nivel INTEGER DEFAULT 1,
  nivel_nome TEXT DEFAULT 'Novato',
  -- Niveis: 1-Novato, 2-Aprendiz, 3-Profissional, 4-Senior, 5-Expert, 6-Especialista, 7-Master, 8-Elite, 9-Legend, 10-MVP

  -- Streaks
  streak_dias_consecutivos INTEGER DEFAULT 0,
  maior_streak INTEGER DEFAULT 0,
  ultima_tarefa_em DATE,

  -- Conquistas/Badges
  badges TEXT[], -- ['primeira_tarefa', 'streak_7_dias', 'meta_batida', 'zero_bugs']

  -- Ranking
  posicao_ranking_geral INTEGER,
  posicao_ranking_departamento INTEGER,

  -- Metricas de produtividade
  tarefas_concluidas_total INTEGER DEFAULT 0,
  tarefas_concluidas_mes INTEGER DEFAULT 0,
  tarefas_no_prazo INTEGER DEFAULT 0,
  tarefas_atrasadas INTEGER DEFAULT 0,
  taxa_conclusao_prazo DECIMAL(5,2) DEFAULT 0,

  -- Bonus financeiro acumulado
  bonus_acumulado_reais DECIMAL(10,2) DEFAULT 0,
  bonus_pago_reais DECIMAL(10,2) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TEAM GAMIFICATION HISTORY - Historico de pontos
-- =============================================
CREATE TABLE IF NOT EXISTS team_gamification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,

  -- Evento
  tipo_evento TEXT NOT NULL CHECK (tipo_evento IN (
    'tarefa_concluida', 'tarefa_antecipada', 'meta_batida',
    'streak_bonus', 'badge_conquistado', 'nivel_up',
    'bonus_especial', 'penalidade_atraso', 'penalidade_bug',
    'feedback_positivo_cliente', 'indicacao'
  )),

  -- Detalhes
  descricao TEXT,
  tarefa_id UUID, -- referencia para team_tasks

  -- Pontos
  pontos INTEGER NOT NULL, -- positivo ou negativo
  pontos_antes INTEGER,
  pontos_depois INTEGER,

  -- Bonus em reais (se aplicavel)
  valor_reais DECIMAL(10,2) DEFAULT 0,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. TEAM TASKS - Tarefas do time
-- =============================================
CREATE TABLE IF NOT EXISTS team_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Atribuicao
  assignee_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES team_members(id), -- quem criou (CEO/Orchestrator)

  -- Contexto
  cliente_id TEXT, -- ID do cliente no GHL se aplicavel
  cliente_nome TEXT,
  contrato_id UUID, -- referencia para service_contracts

  -- Tarefa
  titulo TEXT NOT NULL,
  descricao TEXT,
  instrucoes TEXT, -- instrucoes detalhadas para o membro

  -- Categoria
  categoria TEXT CHECK (categoria IN (
    'setup_cliente', 'trafego', 'conteudo', 'sdr',
    'bdr', 'admin', 'financeiro', 'suporte', 'desenvolvimento', 'outro'
  )),

  -- Prioridade
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('critica', 'alta', 'media', 'baixa')),

  -- Datas
  data_inicio DATE,
  data_limite DATE,
  data_conclusao DATE,

  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'em_andamento', 'aguardando', 'bloqueada',
    'concluida', 'cancelada'
  )),
  bloqueio_motivo TEXT,

  -- Estimativa
  horas_estimadas DECIMAL(5,2),
  horas_gastas DECIMAL(5,2),

  -- Pontuacao
  pontos_conclusao INTEGER DEFAULT 10,
  bonus_antecipado INTEGER DEFAULT 5,

  -- IDs externos
  monday_item_id TEXT, -- ID no Monday.com

  -- Origem
  origem TEXT DEFAULT 'manual' CHECK (origem IN ('manual', 'orchestrator', 'copilot', 'recorrente')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. SERVICE CONTRACTS - Contratos de servico
-- =============================================
CREATE TABLE IF NOT EXISTS service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Cliente
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,
  cliente_ghl_id TEXT, -- ID no GoHighLevel
  cliente_ghl_location_id TEXT, -- Location ID no GHL

  -- Empresa
  empresa_nome TEXT,
  empresa_cnpj TEXT,
  empresa_segmento TEXT,

  -- Produto contratado
  produto TEXT NOT NULL CHECK (produto IN (
    'foundation_sprint', 'demand_stack', 'show_rate_machine',
    'creative_engine', 'revenue_partner'
  )),

  -- Valores
  valor_mensal DECIMAL(10,2),
  valor_setup DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  moeda TEXT DEFAULT 'USD',

  -- Periodo
  data_inicio DATE NOT NULL,
  data_fim DATE,
  duracao_meses INTEGER,

  -- Status
  status TEXT DEFAULT 'ativo' CHECK (status IN (
    'proposta', 'assinado', 'ativo', 'pausado', 'cancelado', 'concluido'
  )),

  -- Metas do contrato
  meta_reunioes_mes INTEGER,
  meta_show_rate DECIMAL(5,2),

  -- Responsaveis
  closer_id UUID REFERENCES team_members(id), -- quem fechou
  cs_responsavel_id UUID REFERENCES team_members(id), -- CS responsavel
  traffic_responsavel_id UUID REFERENCES team_members(id), -- Gestor de trafego

  -- Notas
  notas TEXT,
  briefing_completo BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. CONTRACT_TASKS_TEMPLATE - Templates de tarefas por produto
-- =============================================
CREATE TABLE IF NOT EXISTS contract_tasks_template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Produto
  produto TEXT NOT NULL CHECK (produto IN (
    'foundation_sprint', 'demand_stack', 'show_rate_machine',
    'creative_engine', 'revenue_partner'
  )),

  -- Tarefa template
  titulo TEXT NOT NULL,
  descricao TEXT,
  instrucoes_template TEXT, -- usa {{cliente_nome}}, {{produto}}, etc

  -- Atribuicao
  cargo_responsavel TEXT NOT NULL, -- 'Gestor Trafego', 'SDR', etc

  -- Timing
  dias_apos_inicio INTEGER DEFAULT 0, -- quando criar a tarefa (dias apos inicio contrato)
  prazo_dias INTEGER DEFAULT 3, -- prazo em dias apos criacao

  -- Prioridade
  prioridade TEXT DEFAULT 'media',

  -- Categoria
  categoria TEXT,

  -- Pontuacao
  pontos INTEGER DEFAULT 10,
  bonus_antecipado INTEGER DEFAULT 5,

  -- Ordem
  ordem INTEGER DEFAULT 1,

  -- Dependencias
  depende_de TEXT[], -- IDs de outras tarefas que precisam estar prontas

  ativo BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. COPILOT_MEMORY - Memoria do Copilot
-- =============================================
CREATE TABLE IF NOT EXISTS copilot_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sessao
  session_id TEXT,

  -- Tipo de memoria
  tipo TEXT CHECK (tipo IN (
    'conversa', 'decisao', 'ideia', 'contexto', 'preferencia'
  )),

  -- Conteudo
  topico TEXT,
  conteudo TEXT NOT NULL,
  decisao TEXT, -- se foi uma decisao
  proximos_passos TEXT[],

  -- Importancia (para retrieval)
  importancia INTEGER DEFAULT 5 CHECK (importancia >= 1 AND importancia <= 10),

  -- Tags para busca
  tags TEXT[],

  -- Expiracao
  expira_em TIMESTAMPTZ, -- NULL = nunca expira

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. IDEAS_BACKLOG - Banco de ideias
-- =============================================
CREATE TABLE IF NOT EXISTS ideas_backlog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ideia
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,

  -- Classificacao
  categoria TEXT CHECK (categoria IN (
    'produto', 'automacao', 'processo', 'marketing',
    'vendas', 'tecnologia', 'time', 'outro'
  )),

  -- Matriz Impacto x Esforco
  impacto TEXT CHECK (impacto IN ('alto', 'medio', 'baixo')),
  esforco TEXT CHECK (esforco IN ('alto', 'medio', 'baixo')),
  quadrante TEXT CHECK (quadrante IN (
    'quick_win',  -- alto impacto, baixo esforco
    'big_bet',    -- alto impacto, alto esforco
    'fill_in',    -- baixo impacto, baixo esforco
    'evitar'      -- baixo impacto, alto esforco
  )),

  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'em_analise', 'aprovada', 'em_spec',
    'em_desenvolvimento', 'concluida', 'arquivada', 'rejeitada'
  )),

  -- Spec (se virou spec)
  spec_id UUID, -- referencia para specs

  -- Origem
  origem TEXT DEFAULT 'copilot', -- 'copilot', 'reuniao', 'cliente', 'time'
  sugerido_por TEXT,

  -- Notas
  notas TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. SPECS - Especificacoes tecnicas
-- =============================================
CREATE TABLE IF NOT EXISTS specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  titulo TEXT NOT NULL,
  codigo TEXT UNIQUE, -- SPEC-001, SPEC-002, etc

  -- Conteudo
  objetivo TEXT NOT NULL,
  contexto TEXT,

  -- Requisitos
  requisitos_funcionais JSONB, -- [{id, descricao, prioridade}]
  requisitos_tecnicos JSONB,

  -- Dependencias
  dependencias TEXT[],
  bloqueia TEXT[],

  -- Estimativas
  horas_desenvolvimento INTEGER,
  horas_teste INTEGER,
  horas_deploy INTEGER,

  -- Riscos
  riscos JSONB, -- [{descricao, mitigacao, probabilidade, impacto}]

  -- Status
  status TEXT DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'em_revisao', 'aprovada', 'em_desenvolvimento',
    'em_teste', 'concluida', 'arquivada'
  )),

  -- Aprovacao
  aprovado_por TEXT,
  aprovado_em TIMESTAMPTZ,

  -- Responsaveis
  responsavel_dev TEXT,

  -- Origem
  ideia_id UUID REFERENCES ideas_backlog(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 10. BUG_REPORTS - Bugs reportados
-- =============================================
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao
  codigo TEXT UNIQUE, -- BUG-001, BUG-002, etc

  -- Descricao
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,

  -- Contexto
  sistema_afetado TEXT, -- 'SDR IA', 'Secretaria IA', 'n8n', etc
  agente_afetado TEXT, -- nome do agente especifico
  prompt_relacionado TEXT, -- qual prompt pode ter o problema

  -- Severidade
  severidade TEXT CHECK (severidade IN ('critica', 'alta', 'media', 'baixa')),

  -- Origem
  reportado_por TEXT NOT NULL, -- nome de quem reportou
  reportado_por_id UUID REFERENCES team_members(id),
  canal_report TEXT, -- 'whatsapp', 'copilot', 'email'

  -- Evidencias
  logs TEXT,
  screenshot_urls TEXT[],
  reproducao_passos TEXT,

  -- Analise (preenchido pelo Context Engineer)
  analise_causa TEXT,
  sugestao_correcao TEXT,
  prompt_sugerido TEXT, -- novo prompt corrigido

  -- Status
  status TEXT DEFAULT 'novo' CHECK (status IN (
    'novo', 'em_analise', 'identificado', 'corrigindo',
    'testando', 'resolvido', 'nao_reproduzivel', 'wont_fix'
  )),

  -- Resolucao
  resolvido_por TEXT,
  resolvido_em TIMESTAMPTZ,
  resolucao_descricao TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. PROMPT_VERSIONS - Versionamento de prompts
-- =============================================
CREATE TABLE IF NOT EXISTS prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificacao do prompt
  agente_nome TEXT NOT NULL, -- 'SDR', 'Secretaria', 'Copilot', etc
  tipo_prompt TEXT, -- 'system', 'user', 'function'

  -- Versao
  versao INTEGER NOT NULL,
  versao_label TEXT, -- 'v1.0', 'v1.1-hotfix', etc

  -- Conteudo
  prompt_content TEXT NOT NULL,

  -- Mudancas
  changelog TEXT, -- o que mudou
  bug_corrigido_id UUID REFERENCES bug_reports(id), -- se foi correcao de bug

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'testing', 'active', 'deprecated'
  )),

  -- Metricas (depois de ativo)
  taxa_sucesso DECIMAL(5,2), -- % de interacoes bem sucedidas
  total_interacoes INTEGER DEFAULT 0,
  bugs_reportados INTEGER DEFAULT 0,

  -- Criacao
  criado_por TEXT, -- 'context_engineer', 'manual'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  ativado_em TIMESTAMPTZ,
  desativado_em TIMESTAMPTZ
);

-- =============================================
-- 12. ORCHESTRATOR_LOGS - Logs do Orchestrator
-- =============================================
CREATE TABLE IF NOT EXISTS orchestrator_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Evento
  evento TEXT NOT NULL, -- 'contract_created', 'task_distributed', 'notification_sent'

  -- Contexto
  contrato_id UUID REFERENCES service_contracts(id),
  tarefa_id UUID REFERENCES team_tasks(id),
  member_id UUID REFERENCES team_members(id),

  -- Detalhes
  descricao TEXT,
  payload JSONB,

  -- Status
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. CLIENT_METRICS - Metricas dos clientes de servico
-- =============================================
CREATE TABLE IF NOT EXISTS client_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contrato_id UUID REFERENCES service_contracts(id) ON DELETE CASCADE,

  -- Periodo
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  tipo_periodo TEXT CHECK (tipo_periodo IN ('diario', 'semanal', 'mensal')),

  -- Metricas de trafego
  gasto_ads DECIMAL(10,2),
  impressoes INTEGER,
  cliques INTEGER,
  ctr DECIMAL(5,2),
  cpl DECIMAL(10,2),

  -- Metricas de conversao
  leads_gerados INTEGER,
  leads_qualificados INTEGER,
  reunioes_agendadas INTEGER,
  reunioes_realizadas INTEGER,
  show_rate DECIMAL(5,2),

  -- Metricas de vendas
  propostas_enviadas INTEGER,
  vendas_fechadas INTEGER,
  valor_vendido DECIMAL(10,2),

  -- Metricas de conteudo (se aplicavel)
  posts_publicados INTEGER,
  engajamento_total INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_team_members_cargo ON team_members(cargo);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_gamification_member ON team_gamification(member_id);
CREATE INDEX IF NOT EXISTS idx_team_gamification_ranking ON team_gamification(pontos_totais DESC);
CREATE INDEX IF NOT EXISTS idx_team_gamification_history_member ON team_gamification_history(member_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_assignee ON team_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_status ON team_tasks(status);
CREATE INDEX IF NOT EXISTS idx_team_tasks_contrato ON team_tasks(contrato_id);
CREATE INDEX IF NOT EXISTS idx_service_contracts_status ON service_contracts(status);
CREATE INDEX IF NOT EXISTS idx_service_contracts_produto ON service_contracts(produto);
CREATE INDEX IF NOT EXISTS idx_contract_tasks_template_produto ON contract_tasks_template(produto);
CREATE INDEX IF NOT EXISTS idx_copilot_memory_tipo ON copilot_memory(tipo);
CREATE INDEX IF NOT EXISTS idx_copilot_memory_tags ON copilot_memory USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_ideas_backlog_status ON ideas_backlog(status);
CREATE INDEX IF NOT EXISTS idx_ideas_backlog_quadrante ON ideas_backlog(quadrante);
CREATE INDEX IF NOT EXISTS idx_specs_status ON specs(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_severidade ON bug_reports(severidade);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_agente ON prompt_versions(agente_nome);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_status ON prompt_versions(status);
CREATE INDEX IF NOT EXISTS idx_orchestrator_logs_contrato ON orchestrator_logs(contrato_id);
CREATE INDEX IF NOT EXISTS idx_client_metrics_contrato ON client_metrics(contrato_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Funcao para adicionar pontos ao time member
CREATE OR REPLACE FUNCTION add_team_points(
  p_member_id UUID,
  p_pontos INTEGER,
  p_tipo_evento TEXT,
  p_descricao TEXT DEFAULT NULL,
  p_tarefa_id UUID DEFAULT NULL,
  p_valor_reais DECIMAL DEFAULT 0
)
RETURNS void AS $$
DECLARE
  v_pontos_antes INTEGER;
  v_pontos_depois INTEGER;
  v_nivel_antes INTEGER;
  v_nivel_depois INTEGER;
BEGIN
  -- Pega pontos atuais
  SELECT pontos_totais, nivel INTO v_pontos_antes, v_nivel_antes
  FROM team_gamification WHERE member_id = p_member_id;

  -- Se nao existe, cria
  IF v_pontos_antes IS NULL THEN
    INSERT INTO team_gamification (member_id, pontos_totais, pontos_mes_atual, pontos_semana_atual)
    VALUES (p_member_id, 0, 0, 0);
    v_pontos_antes := 0;
    v_nivel_antes := 1;
  END IF;

  v_pontos_depois := GREATEST(0, v_pontos_antes + p_pontos);

  -- Calcula novo nivel (1-10)
  v_nivel_depois := CASE
    WHEN v_pontos_depois >= 10000 THEN 10 -- MVP
    WHEN v_pontos_depois >= 7500 THEN 9  -- Legend
    WHEN v_pontos_depois >= 5000 THEN 8  -- Elite
    WHEN v_pontos_depois >= 3500 THEN 7  -- Master
    WHEN v_pontos_depois >= 2500 THEN 6  -- Especialista
    WHEN v_pontos_depois >= 1500 THEN 5  -- Expert
    WHEN v_pontos_depois >= 1000 THEN 4  -- Senior
    WHEN v_pontos_depois >= 500 THEN 3   -- Profissional
    WHEN v_pontos_depois >= 100 THEN 2   -- Aprendiz
    ELSE 1 -- Novato
  END;

  -- Atualiza pontuacao
  UPDATE team_gamification SET
    pontos_totais = v_pontos_depois,
    pontos_mes_atual = pontos_mes_atual + p_pontos,
    pontos_semana_atual = pontos_semana_atual + p_pontos,
    nivel = v_nivel_depois,
    nivel_nome = CASE v_nivel_depois
      WHEN 1 THEN 'Novato'
      WHEN 2 THEN 'Aprendiz'
      WHEN 3 THEN 'Profissional'
      WHEN 4 THEN 'Senior'
      WHEN 5 THEN 'Expert'
      WHEN 6 THEN 'Especialista'
      WHEN 7 THEN 'Master'
      WHEN 8 THEN 'Elite'
      WHEN 9 THEN 'Legend'
      WHEN 10 THEN 'MVP'
    END,
    bonus_acumulado_reais = bonus_acumulado_reais + p_valor_reais,
    updated_at = NOW()
  WHERE member_id = p_member_id;

  -- Registra no historico
  INSERT INTO team_gamification_history (
    member_id, tipo_evento, descricao, tarefa_id,
    pontos, pontos_antes, pontos_depois, valor_reais
  ) VALUES (
    p_member_id, p_tipo_evento, p_descricao, p_tarefa_id,
    p_pontos, v_pontos_antes, v_pontos_depois, p_valor_reais
  );

  -- Se subiu de nivel, registra
  IF v_nivel_depois > v_nivel_antes THEN
    INSERT INTO team_gamification_history (
      member_id, tipo_evento, descricao, pontos, pontos_antes, pontos_depois
    ) VALUES (
      p_member_id, 'nivel_up',
      'Subiu para nivel ' || v_nivel_depois || '!',
      0, v_pontos_antes, v_pontos_depois
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Funcao para concluir tarefa do time
CREATE OR REPLACE FUNCTION complete_team_task(p_task_id UUID)
RETURNS void AS $$
DECLARE
  v_member_id UUID;
  v_pontos INTEGER;
  v_bonus INTEGER;
  v_data_limite DATE;
  v_titulo TEXT;
  v_valor_bonus DECIMAL;
BEGIN
  -- Pega dados da tarefa
  SELECT assignee_id, pontos_conclusao, bonus_antecipado, data_limite, titulo
  INTO v_member_id, v_pontos, v_bonus, v_data_limite, v_titulo
  FROM team_tasks WHERE id = p_task_id;

  -- Atualiza tarefa
  UPDATE team_tasks SET
    status = 'concluida',
    data_conclusao = CURRENT_DATE,
    updated_at = NOW()
  WHERE id = p_task_id;

  -- Calcula bonus financeiro (R$ 2 por ponto)
  v_valor_bonus := 0;

  -- Se concluiu antes do prazo, ganha bonus
  IF v_data_limite IS NOT NULL AND CURRENT_DATE < v_data_limite THEN
    v_pontos := v_pontos + v_bonus;
    v_valor_bonus := (v_pontos * 2)::DECIMAL;

    PERFORM add_team_points(
      v_member_id, v_pontos, 'tarefa_antecipada',
      'Tarefa concluida antes do prazo: ' || v_titulo,
      p_task_id, v_valor_bonus
    );
  ELSE
    v_valor_bonus := (v_pontos * 2)::DECIMAL;

    PERFORM add_team_points(
      v_member_id, v_pontos, 'tarefa_concluida',
      'Tarefa concluida: ' || v_titulo,
      p_task_id, v_valor_bonus
    );
  END IF;

  -- Atualiza metricas
  UPDATE team_gamification SET
    ultima_tarefa_em = CURRENT_DATE,
    streak_dias_consecutivos = CASE
      WHEN ultima_tarefa_em = CURRENT_DATE - 1 THEN streak_dias_consecutivos + 1
      WHEN ultima_tarefa_em = CURRENT_DATE THEN streak_dias_consecutivos
      ELSE 1
    END,
    maior_streak = GREATEST(maior_streak,
      CASE
        WHEN ultima_tarefa_em = CURRENT_DATE - 1 THEN streak_dias_consecutivos + 1
        ELSE 1
      END
    ),
    tarefas_concluidas_total = tarefas_concluidas_total + 1,
    tarefas_concluidas_mes = tarefas_concluidas_mes + 1,
    tarefas_no_prazo = tarefas_no_prazo + CASE
      WHEN v_data_limite IS NULL OR CURRENT_DATE <= v_data_limite THEN 1
      ELSE 0
    END,
    tarefas_atrasadas = tarefas_atrasadas + CASE
      WHEN v_data_limite IS NOT NULL AND CURRENT_DATE > v_data_limite THEN 1
      ELSE 0
    END
  WHERE member_id = v_member_id;
END;
$$ LANGUAGE plpgsql;

-- Funcao para criar tarefas quando contrato e criado
CREATE OR REPLACE FUNCTION create_contract_tasks(p_contrato_id UUID)
RETURNS void AS $$
DECLARE
  r RECORD;
  v_contrato RECORD;
  v_member_id UUID;
  v_titulo TEXT;
  v_descricao TEXT;
  v_instrucoes TEXT;
BEGIN
  -- Pega dados do contrato
  SELECT * INTO v_contrato FROM service_contracts WHERE id = p_contrato_id;

  -- Para cada template do produto
  FOR r IN
    SELECT * FROM contract_tasks_template
    WHERE produto = v_contrato.produto AND ativo = TRUE
    ORDER BY ordem
  LOOP
    -- Encontra o membro responsavel pelo cargo
    SELECT id INTO v_member_id
    FROM team_members
    WHERE cargo = r.cargo_responsavel AND status = 'ativo'
    LIMIT 1;

    -- Se nao encontrou, pula
    IF v_member_id IS NULL THEN
      CONTINUE;
    END IF;

    -- Substitui variaveis no template
    v_titulo := REPLACE(r.titulo, '{{cliente_nome}}', v_contrato.cliente_nome);
    v_titulo := REPLACE(v_titulo, '{{produto}}', v_contrato.produto);

    v_descricao := REPLACE(COALESCE(r.descricao, ''), '{{cliente_nome}}', v_contrato.cliente_nome);
    v_instrucoes := REPLACE(COALESCE(r.instrucoes_template, ''), '{{cliente_nome}}', v_contrato.cliente_nome);

    -- Cria a tarefa
    INSERT INTO team_tasks (
      assignee_id, contrato_id, cliente_id, cliente_nome,
      titulo, descricao, instrucoes,
      categoria, prioridade,
      data_inicio, data_limite,
      pontos_conclusao, bonus_antecipado,
      origem
    ) VALUES (
      v_member_id, p_contrato_id, v_contrato.cliente_ghl_id, v_contrato.cliente_nome,
      v_titulo, v_descricao, v_instrucoes,
      r.categoria, r.prioridade,
      v_contrato.data_inicio + r.dias_apos_inicio,
      v_contrato.data_inicio + r.dias_apos_inicio + r.prazo_dias,
      r.pontos, r.bonus_antecipado,
      'orchestrator'
    );

    -- Log
    INSERT INTO orchestrator_logs (evento, contrato_id, member_id, descricao)
    VALUES ('task_distributed', p_contrato_id, v_member_id,
            'Tarefa criada: ' || v_titulo || ' para ' || (SELECT nome FROM team_members WHERE id = v_member_id));
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger: quando contrato e assinado, cria tarefas
CREATE OR REPLACE FUNCTION on_contract_signed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'assinado' AND (OLD.status IS NULL OR OLD.status != 'assinado') THEN
    PERFORM create_contract_tasks(NEW.id);

    INSERT INTO orchestrator_logs (evento, contrato_id, descricao)
    VALUES ('contract_created', NEW.id,
            'Contrato assinado: ' || NEW.cliente_nome || ' - ' || NEW.produto);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contract_signed ON service_contracts;
CREATE TRIGGER trigger_contract_signed
  AFTER INSERT OR UPDATE ON service_contracts
  FOR EACH ROW EXECUTE FUNCTION on_contract_signed();

-- Funcao para gerar proximo codigo de bug
CREATE OR REPLACE FUNCTION next_bug_code()
RETURNS TEXT AS $$
DECLARE
  v_max INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 5) AS INTEGER)), 0) + 1
  INTO v_max FROM bug_reports;
  RETURN 'BUG-' || LPAD(v_max::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Funcao para gerar proximo codigo de spec
CREATE OR REPLACE FUNCTION next_spec_code()
RETURNS TEXT AS $$
DECLARE
  v_max INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 6) AS INTEGER)), 0) + 1
  INTO v_max FROM specs;
  RETURN 'SPEC-' || LPAD(v_max::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-preencher codigo do bug
CREATE OR REPLACE FUNCTION set_bug_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL THEN
    NEW.codigo := next_bug_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_bug_code ON bug_reports;
CREATE TRIGGER trigger_set_bug_code
  BEFORE INSERT ON bug_reports
  FOR EACH ROW EXECUTE FUNCTION set_bug_code();

-- Trigger para auto-preencher codigo da spec
CREATE OR REPLACE FUNCTION set_spec_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL THEN
    NEW.codigo := next_spec_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_spec_code ON specs;
CREATE TRIGGER trigger_set_spec_code
  BEFORE INSERT ON specs
  FOR EACH ROW EXECUTE FUNCTION set_spec_code();

-- Funcao para atualizar ranking do time
CREATE OR REPLACE FUNCTION update_team_rankings()
RETURNS void AS $$
BEGIN
  -- Ranking geral
  WITH ranked AS (
    SELECT member_id, ROW_NUMBER() OVER (ORDER BY pontos_totais DESC) as pos
    FROM team_gamification
  )
  UPDATE team_gamification tg SET
    posicao_ranking_geral = r.pos
  FROM ranked r WHERE tg.member_id = r.member_id;

  -- Ranking por departamento
  WITH ranked AS (
    SELECT
      tg.member_id,
      ROW_NUMBER() OVER (
        PARTITION BY tm.departamento
        ORDER BY tg.pontos_totais DESC
      ) as pos
    FROM team_gamification tg
    JOIN team_members tm ON tg.member_id = tm.id
  )
  UPDATE team_gamification tg SET
    posicao_ranking_departamento = r.pos
  FROM ranked r WHERE tg.member_id = r.member_id;
END;
$$ LANGUAGE plpgsql;

-- Reset semanal de pontos
CREATE OR REPLACE FUNCTION reset_weekly_points()
RETURNS void AS $$
BEGIN
  UPDATE team_gamification SET pontos_semana_atual = 0;
END;
$$ LANGUAGE plpgsql;

-- Reset mensal de pontos
CREATE OR REPLACE FUNCTION reset_monthly_points()
RETURNS void AS $$
BEGIN
  UPDATE team_gamification SET pontos_mes_atual = 0, tarefas_concluidas_mes = 0;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DADOS INICIAIS - TIME MOTTIVME
-- =============================================

INSERT INTO team_members (nome, email, cargo, departamento, disc_primario, disc_secundario, tom_preferido, canal_preferido)
VALUES
  ('Marcos Daniels', 'marcos@mottivme.com', 'CEO', 'Operacoes', 'dominante', 'influente', 'direto', 'whatsapp'),
  ('Allesson', 'allesson@mottivme.com', 'BDR Supervisor', 'Comercial', 'influente', 'dominante', 'motivacional', 'whatsapp'),
  ('Isabella', 'isabella@mottivme.com', 'SDR', 'Comercial', 'estavel', 'conforme', 'calmo', 'whatsapp'),
  ('Arthur', 'arthur@mottivme.com', 'Gestor Trafego', 'Marketing', 'conforme', 'estavel', 'detalhado', 'email'),
  ('Maria', 'maria@mottivme.com', 'Social Media', 'Marketing', 'influente', 'estavel', 'motivacional', 'whatsapp'),
  ('Hallen', 'hallen@mottivme.com', 'Admin', 'Financeiro', 'estavel', 'conforme', 'calmo', 'email'),
  ('Lucas', 'lucas@mottivme.com', 'BDR', 'Comercial', 'dominante', 'influente', 'direto', 'whatsapp')
ON CONFLICT (email) DO NOTHING;

-- Cria gamification para cada membro
INSERT INTO team_gamification (member_id)
SELECT id FROM team_members
ON CONFLICT (member_id) DO NOTHING;

-- =============================================
-- DADOS INICIAIS - TEMPLATES DE TAREFAS
-- =============================================

-- Foundation Sprint
INSERT INTO contract_tasks_template (produto, titulo, descricao, cargo_responsavel, dias_apos_inicio, prazo_dias, prioridade, categoria, pontos, ordem)
VALUES
  ('foundation_sprint', 'Configurar CRM {{cliente_nome}}', 'Criar location no GHL e configurar snapshot', 'Admin', 0, 1, 'critica', 'setup_cliente', 20, 1),
  ('foundation_sprint', 'Agendar reuniao de kickoff {{cliente_nome}}', 'Agendar primeira reuniao de kickoff com o cliente', 'SDR', 0, 1, 'critica', 'setup_cliente', 15, 2),
  ('foundation_sprint', 'Coletar briefing completo {{cliente_nome}}', 'Aplicar questionario de briefing e documentar', 'SDR', 1, 3, 'alta', 'setup_cliente', 25, 3),
  ('foundation_sprint', 'Criar brand book {{cliente_nome}}', 'Desenvolver brand book completo baseado no briefing', 'Social Media', 4, 7, 'alta', 'conteudo', 30, 4),
  ('foundation_sprint', 'Criar trilha de conteudo {{cliente_nome}}', 'Planejar 90 dias de conteudo', 'Social Media', 7, 7, 'alta', 'conteudo', 30, 5)
ON CONFLICT DO NOTHING;

-- Demand Stack
INSERT INTO contract_tasks_template (produto, titulo, descricao, cargo_responsavel, dias_apos_inicio, prazo_dias, prioridade, categoria, pontos, ordem)
VALUES
  ('demand_stack', 'Configurar CRM {{cliente_nome}}', 'Criar location no GHL e configurar snapshot', 'Admin', 0, 1, 'critica', 'setup_cliente', 20, 1),
  ('demand_stack', 'Criar campanha de trafego {{cliente_nome}}', 'Configurar campanhas no Meta e Google', 'Gestor Trafego', 1, 3, 'critica', 'trafego', 30, 2),
  ('demand_stack', 'Configurar SDR IA {{cliente_nome}}', 'Ativar e personalizar agente SDR', 'SDR', 1, 2, 'critica', 'sdr', 25, 3),
  ('demand_stack', 'Criar criativos iniciais {{cliente_nome}}', 'Desenvolver primeiros criativos para ads', 'Social Media', 2, 5, 'alta', 'conteudo', 25, 4),
  ('demand_stack', 'Reuniao de alinhamento semanal {{cliente_nome}}', 'Agendar reunioes semanais recorrentes', 'SDR', 3, 2, 'media', 'setup_cliente', 10, 5)
ON CONFLICT DO NOTHING;

-- Show-Rate Machine
INSERT INTO contract_tasks_template (produto, titulo, descricao, cargo_responsavel, dias_apos_inicio, prazo_dias, prioridade, categoria, pontos, ordem)
VALUES
  ('show_rate_machine', 'Configurar Show-Rate Guard {{cliente_nome}}', 'Ativar sistema de confirmacao e follow-up', 'SDR', 0, 2, 'critica', 'setup_cliente', 25, 1),
  ('show_rate_machine', 'Criar grupo WhatsApp {{cliente_nome}}', 'Criar grupo de comunicacao com closer', 'SDR', 0, 1, 'alta', 'sdr', 10, 2),
  ('show_rate_machine', 'Treinar protocolo de 3 ligacoes', 'Treinar SDR no protocolo de confirmacao', 'BDR Supervisor', 1, 2, 'alta', 'sdr', 20, 3)
ON CONFLICT DO NOTHING;

-- Creative Engine
INSERT INTO contract_tasks_template (produto, titulo, descricao, cargo_responsavel, dias_apos_inicio, prazo_dias, prioridade, categoria, pontos, ordem)
VALUES
  ('creative_engine', 'Coletar briefing criativo {{cliente_nome}}', 'Entender estilo visual e tom do cliente', 'Social Media', 0, 2, 'critica', 'conteudo', 15, 1),
  ('creative_engine', 'Criar primeira leva de criativos {{cliente_nome}}', 'Desenvolver primeiros 12 criativos', 'Social Media', 2, 5, 'critica', 'conteudo', 30, 2),
  ('creative_engine', 'Configurar calendario editorial {{cliente_nome}}', 'Planejar primeiro mes de postagens', 'Social Media', 3, 3, 'alta', 'conteudo', 20, 3)
ON CONFLICT DO NOTHING;

-- Revenue Partner
INSERT INTO contract_tasks_template (produto, titulo, descricao, cargo_responsavel, dias_apos_inicio, prazo_dias, prioridade, categoria, pontos, ordem)
VALUES
  ('revenue_partner', 'Configurar CRM completo {{cliente_nome}}', 'Setup completo com todas as automacoes', 'Admin', 0, 2, 'critica', 'setup_cliente', 30, 1),
  ('revenue_partner', 'Criar campanha de trafego premium {{cliente_nome}}', 'Campanhas avancadas multi-canal', 'Gestor Trafego', 1, 3, 'critica', 'trafego', 40, 2),
  ('revenue_partner', 'Configurar SDR dedicado {{cliente_nome}}', 'Setup de SDR dedicado com personalizacao', 'BDR Supervisor', 1, 2, 'critica', 'sdr', 35, 3),
  ('revenue_partner', 'Configurar BDR outbound {{cliente_nome}}', 'Ativar prospecao ativa', 'BDR Supervisor', 2, 3, 'alta', 'bdr', 30, 4),
  ('revenue_partner', 'Criar Revenue Board {{cliente_nome}}', 'Dashboard executivo de metricas', 'Gestor Trafego', 3, 5, 'alta', 'trafego', 25, 5),
  ('revenue_partner', 'Agendar war room quinzenal', 'Configurar reunioes de war room', 'SDR', 5, 2, 'media', 'setup_cliente', 15, 6)
ON CONFLICT DO NOTHING;

-- =============================================
-- VIEWS UTEIS
-- =============================================

-- View de ranking atual do time
CREATE OR REPLACE VIEW v_team_ranking AS
SELECT
  tm.nome,
  tm.cargo,
  tm.departamento,
  tg.pontos_totais,
  tg.pontos_mes_atual,
  tg.nivel_nome,
  tg.streak_dias_consecutivos,
  tg.posicao_ranking_geral,
  tg.tarefas_concluidas_mes,
  tg.bonus_acumulado_reais - tg.bonus_pago_reais as bonus_pendente
FROM team_members tm
JOIN team_gamification tg ON tm.id = tg.member_id
WHERE tm.status = 'ativo'
ORDER BY tg.pontos_totais DESC;

-- View de tarefas pendentes por membro
CREATE OR REPLACE VIEW v_tarefas_pendentes AS
SELECT
  tm.nome as responsavel,
  tm.cargo,
  tt.titulo,
  tt.cliente_nome,
  tt.prioridade,
  tt.data_limite,
  CASE
    WHEN tt.data_limite < CURRENT_DATE THEN 'atrasada'
    WHEN tt.data_limite = CURRENT_DATE THEN 'vence_hoje'
    WHEN tt.data_limite = CURRENT_DATE + 1 THEN 'vence_amanha'
    ELSE 'no_prazo'
  END as urgencia
FROM team_tasks tt
JOIN team_members tm ON tt.assignee_id = tm.id
WHERE tt.status IN ('pendente', 'em_andamento')
ORDER BY tt.data_limite ASC NULLS LAST;

-- View de bugs abertos
CREATE OR REPLACE VIEW v_bugs_abertos AS
SELECT
  codigo,
  titulo,
  sistema_afetado,
  severidade,
  reportado_por,
  status,
  created_at,
  AGE(NOW(), created_at) as tempo_aberto
FROM bug_reports
WHERE status NOT IN ('resolvido', 'nao_reproduzivel', 'wont_fix')
ORDER BY
  CASE severidade
    WHEN 'critica' THEN 1
    WHEN 'alta' THEN 2
    WHEN 'media' THEN 3
    WHEN 'baixa' THEN 4
  END,
  created_at ASC;

-- View de ideias por quadrante
CREATE OR REPLACE VIEW v_ideias_matriz AS
SELECT
  quadrante,
  COUNT(*) as total,
  ARRAY_AGG(titulo ORDER BY created_at DESC) as ideias
FROM ideas_backlog
WHERE status = 'pendente'
GROUP BY quadrante;

COMMENT ON VIEW v_team_ranking IS 'Ranking atual do time com pontos e bonus';
COMMENT ON VIEW v_tarefas_pendentes IS 'Tarefas pendentes ordenadas por urgencia';
COMMENT ON VIEW v_bugs_abertos IS 'Bugs abertos ordenados por severidade';
COMMENT ON VIEW v_ideias_matriz IS 'Ideias agrupadas por quadrante da matriz';

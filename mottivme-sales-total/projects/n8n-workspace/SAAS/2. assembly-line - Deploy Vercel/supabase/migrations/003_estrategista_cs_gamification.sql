-- =============================================
-- ASSEMBLY LINE - AGENTE ESTRATEGISTA/CS + GAMIFICAÇÃO
-- Sistema de suporte personalizado pós-Assembly Line
-- =============================================

-- 1. CLIENT_PROFILES - Perfil comportamental do cliente
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

  -- ARQUÉTIPO COMPORTAMENTAL (DISC)
  arquetipo_primario TEXT CHECK (arquetipo_primario IN ('dominante', 'influente', 'estavel', 'conforme')),
  arquetipo_secundario TEXT CHECK (arquetipo_secundario IN ('dominante', 'influente', 'estavel', 'conforme')),

  -- Características do arquétipo
  -- Dominante: direto, resultados, rápido, competitivo
  -- Influente: comunicativo, entusiasmado, sociável, ideias (SONHADOR)
  -- Estável: paciente, consistente, leal, previsível
  -- Conforme: analítico, preciso, metódico, qualidade

  -- PERFIL DE COMUNICAÇÃO
  tom_preferido TEXT CHECK (tom_preferido IN ('formal', 'casual', 'motivacional', 'direto', 'acolhedor')),
  nivel_energia TEXT CHECK (nivel_energia IN ('alta', 'media', 'baixa')),
  prefere_detalhes BOOLEAN DEFAULT FALSE, -- Conforme/Analítico = TRUE
  prefere_acao_rapida BOOLEAN DEFAULT TRUE, -- Dominante/Influente = TRUE

  -- LINGUAGEM DO CLIENTE (extraída de conversas)
  termos_frequentes TEXT[], -- palavras que ele usa muito
  jargoes TEXT[], -- gírias e expressões
  metaforas TEXT[], -- analogias preferidas
  emojis_frequentes TEXT[],

  -- GATILHOS MOTIVACIONAIS
  gatilho_principal TEXT CHECK (gatilho_principal IN ('resultado', 'reconhecimento', 'seguranca', 'perfeicao')),
  motivadores TEXT[], -- o que faz ele agir
  bloqueadores TEXT[], -- o que trava ele

  -- PADRÃO DE COMPORTAMENTO
  horario_ativo_inicio TIME,
  horario_ativo_fim TIME,
  dias_mais_ativos INTEGER[], -- 0=dom, 1=seg, etc
  tempo_medio_resposta_minutos INTEGER,

  -- HISTÓRICO DE ENGAJAMENTO
  total_interacoes INTEGER DEFAULT 0,
  ultima_interacao_at TIMESTAMPTZ,

  -- ANÁLISE DE LINGUAGEM (preenchido por IA)
  analise_linguagem JSONB, -- {estilo, vocabulario, complexidade}

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACTION_ITEMS - Ações que o cliente precisa tomar
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- INFORMAÇÕES DA AÇÃO
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT CHECK (categoria IN (
    'clone', 'posicionamento', 'ofertas', 'funil',
    'conteudo', 'landing_page', 'anuncio', 'automacao', 'outro'
  )),

  -- OUTPUT DE ORIGEM
  output_origem TEXT, -- ex: 'system_prompt', 'big_idea', 'headline_principal'
  output_tabela TEXT, -- ex: 'clone_experts', 'offers'
  output_campo TEXT,  -- ex: 'system_prompt'

  -- INSTRUÇÕES PARA O CLIENTE
  instrucao_passo_a_passo TEXT,
  ferramenta_sugerida TEXT, -- ex: 'ChatGPT', 'Lovable', 'Bolt', 'Carrd'
  link_ferramenta TEXT,
  exemplo_uso TEXT,

  -- PRIORIDADE E ORDEM
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('critica', 'alta', 'media', 'baixa')),
  ordem_execucao INTEGER,

  -- PRAZO
  prazo_sugerido_dias INTEGER DEFAULT 3,
  data_limite DATE,

  -- STATUS
  status TEXT DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'em_andamento', 'aguardando_feedback',
    'concluida', 'bloqueada', 'cancelada'
  )),
  bloqueio_motivo TEXT,

  -- DATAS
  iniciada_em TIMESTAMPTZ,
  concluida_em TIMESTAMPTZ,

  -- PONTUAÇÃO
  pontos_conclusao INTEGER DEFAULT 10,
  bonus_antecipado INTEGER DEFAULT 5, -- bonus se entregar antes do prazo

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FOLLOW_UPS - Follow-ups automáticos
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_item_id UUID REFERENCES action_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- TIPO DE FOLLOW-UP
  tipo TEXT CHECK (tipo IN (
    'lembrete', 'cobranca', 'ajuda', 'celebracao',
    'reengajamento', 'checkin', 'escalacao'
  )),

  -- MENSAGEM
  mensagem TEXT NOT NULL,
  mensagem_alternativa TEXT, -- se não responder na primeira

  -- AGENDAMENTO
  agendado_para TIMESTAMPTZ NOT NULL,
  tentativa_numero INTEGER DEFAULT 1,
  max_tentativas INTEGER DEFAULT 3,

  -- CANAL
  canal TEXT CHECK (canal IN ('whatsapp', 'email', 'app', 'sms')),

  -- STATUS
  status TEXT DEFAULT 'agendado' CHECK (status IN (
    'agendado', 'enviado', 'respondido', 'ignorado', 'cancelado'
  )),
  enviado_em TIMESTAMPTZ,
  respondido_em TIMESTAMPTZ,
  resposta TEXT,

  -- AUTOMAÇÃO
  workflow_id TEXT, -- ID do workflow n8n

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GAMIFICATION_SCORES - Pontuação do cliente
CREATE TABLE IF NOT EXISTS gamification_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

  -- PONTOS
  pontos_totais INTEGER DEFAULT 0,
  pontos_mes_atual INTEGER DEFAULT 0,
  pontos_semana_atual INTEGER DEFAULT 0,

  -- NÍVEL
  nivel INTEGER DEFAULT 1,
  nivel_nome TEXT DEFAULT 'Iniciante',
  -- Níveis: 1-Iniciante, 2-Aprendiz, 3-Praticante, 4-Expert, 5-Mestre, 6-Lenda

  -- STREAKS
  streak_dias_consecutivos INTEGER DEFAULT 0,
  maior_streak INTEGER DEFAULT 0,
  ultima_acao_em DATE,

  -- BADGES/CONQUISTAS
  badges TEXT[], -- ['primeiro_clone', 'funil_completo', 'streak_7_dias']

  -- RANKING
  posicao_ranking_geral INTEGER,
  posicao_ranking_mes INTEGER,

  -- TAXA DE CONCLUSÃO
  total_acoes_atribuidas INTEGER DEFAULT 0,
  total_acoes_concluidas INTEGER DEFAULT 0,
  taxa_conclusao DECIMAL(5,2) DEFAULT 0,

  -- VELOCIDADE
  tempo_medio_conclusao_horas INTEGER,
  acoes_no_prazo INTEGER DEFAULT 0,
  acoes_atrasadas INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GAMIFICATION_HISTORY - Histórico de pontos
CREATE TABLE IF NOT EXISTS gamification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- EVENTO
  tipo_evento TEXT NOT NULL CHECK (tipo_evento IN (
    'acao_concluida', 'acao_antecipada', 'streak_bonus',
    'badge_conquistado', 'nivel_up', 'bonus_especial',
    'penalidade_atraso', 'penalidade_inatividade'
  )),

  -- DETALHES
  descricao TEXT,
  action_item_id UUID REFERENCES action_items(id),

  -- PONTOS
  pontos INTEGER NOT NULL, -- positivo ou negativo
  pontos_antes INTEGER,
  pontos_depois INTEGER,

  -- METADATA
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CS_CONVERSATIONS - Conversas com o agente estrategista
CREATE TABLE IF NOT EXISTS cs_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),

  -- STATUS DA CONVERSA
  status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'pausada', 'encerrada', 'escalada')),

  -- CONTEXTO
  contexto_atual TEXT, -- o que está sendo discutido
  ultima_acao_discutida UUID REFERENCES action_items(id),

  -- SENTIMENTO
  sentimento_cliente TEXT CHECK (sentimento_cliente IN (
    'muito_positivo', 'positivo', 'neutro', 'frustrado', 'muito_frustrado'
  )),

  -- MÉTRICAS
  total_mensagens INTEGER DEFAULT 0,
  tempo_total_conversa_minutos INTEGER DEFAULT 0,

  -- ESCALAÇÃO
  precisa_humano BOOLEAN DEFAULT FALSE,
  motivo_escalacao TEXT,
  escalado_para TEXT, -- email do humano

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CS_MESSAGES - Mensagens das conversas
CREATE TABLE IF NOT EXISTS cs_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES cs_conversations(id) ON DELETE CASCADE,

  -- REMETENTE
  remetente TEXT CHECK (remetente IN ('cliente', 'agente', 'humano')),

  -- CONTEÚDO
  conteudo TEXT NOT NULL,
  tipo_conteudo TEXT DEFAULT 'texto' CHECK (tipo_conteudo IN (
    'texto', 'audio', 'imagem', 'documento', 'link', 'acao_sugerida'
  )),

  -- SE FOR AÇÃO SUGERIDA
  acao_sugerida_id UUID REFERENCES action_items(id),

  -- ANÁLISE (preenchido por IA)
  intencao_detectada TEXT, -- 'duvida', 'reclamacao', 'pedido_ajuda', 'confirmacao'
  sentimento TEXT, -- 'positivo', 'neutro', 'negativo'
  topicos_mencionados TEXT[],

  -- STATUS
  lida BOOLEAN DEFAULT FALSE,
  lida_em TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ASSEMBLY_LINE_OUTPUTS_MAP - Mapa de outputs para ações
CREATE TABLE IF NOT EXISTS assembly_line_outputs_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- IDENTIFICAÇÃO DO OUTPUT
  fase TEXT NOT NULL, -- 'clone', 'posicionamento', 'ofertas', etc
  tabela_origem TEXT NOT NULL, -- 'clone_experts', 'offers', etc
  campo_origem TEXT NOT NULL, -- 'system_prompt', 'big_idea', etc

  -- AÇÃO PADRÃO
  titulo_acao TEXT NOT NULL,
  descricao_acao TEXT,
  categoria_acao TEXT,

  -- INSTRUÇÕES
  instrucao_padrao TEXT NOT NULL,
  ferramenta_principal TEXT,
  link_ferramenta TEXT,
  ferramentas_alternativas TEXT[],
  exemplo_uso TEXT,

  -- VIDEO/TUTORIAL
  video_tutorial_url TEXT,
  artigo_ajuda_url TEXT,

  -- PONTUAÇÃO
  pontos_padrao INTEGER DEFAULT 10,
  prioridade_padrao TEXT DEFAULT 'media',
  prazo_padrao_dias INTEGER DEFAULT 3,

  -- ORDEM NO FLUXO
  ordem_no_fluxo INTEGER,
  depende_de TEXT[], -- IDs de outros campos que precisam estar prontos

  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_client_profiles_user ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_action_items_project ON action_items(project_id);
CREATE INDEX IF NOT EXISTS idx_action_items_user ON action_items(user_id);
CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user ON follow_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_agendado ON follow_ups(agendado_para);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_gamification_scores_user ON gamification_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_scores_ranking ON gamification_scores(pontos_totais DESC);
CREATE INDEX IF NOT EXISTS idx_gamification_history_user ON gamification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_cs_conversations_user ON cs_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_cs_messages_conversation ON cs_messages(conversation_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cs_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cs_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assembly_line_outputs_map ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own client profile" ON client_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own action items" ON action_items
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own follow ups" ON follow_ups
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own gamification" ON gamification_scores
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own gamification history" ON gamification_history
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own cs conversations" ON cs_conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view cs messages in own conversations" ON cs_messages
  FOR ALL USING (
    conversation_id IN (SELECT id FROM cs_conversations WHERE user_id = auth.uid())
  );

-- Output map é público para leitura
CREATE POLICY "Anyone can read outputs map" ON assembly_line_outputs_map
  FOR SELECT USING (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Função para calcular pontos e atualizar ranking
CREATE OR REPLACE FUNCTION add_gamification_points(
  p_user_id UUID,
  p_pontos INTEGER,
  p_tipo_evento TEXT,
  p_descricao TEXT DEFAULT NULL,
  p_action_item_id UUID DEFAULT NULL
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
  FROM gamification_scores WHERE user_id = p_user_id;

  -- Se não existe, cria
  IF v_pontos_antes IS NULL THEN
    INSERT INTO gamification_scores (user_id, pontos_totais, pontos_mes_atual, pontos_semana_atual)
    VALUES (p_user_id, 0, 0, 0);
    v_pontos_antes := 0;
    v_nivel_antes := 1;
  END IF;

  v_pontos_depois := v_pontos_antes + p_pontos;
  IF v_pontos_depois < 0 THEN v_pontos_depois := 0; END IF;

  -- Calcula novo nível
  v_nivel_depois := CASE
    WHEN v_pontos_depois >= 5000 THEN 6 -- Lenda
    WHEN v_pontos_depois >= 2500 THEN 5 -- Mestre
    WHEN v_pontos_depois >= 1000 THEN 4 -- Expert
    WHEN v_pontos_depois >= 500 THEN 3  -- Praticante
    WHEN v_pontos_depois >= 100 THEN 2  -- Aprendiz
    ELSE 1 -- Iniciante
  END;

  -- Atualiza pontuação
  UPDATE gamification_scores SET
    pontos_totais = v_pontos_depois,
    pontos_mes_atual = pontos_mes_atual + p_pontos,
    pontos_semana_atual = pontos_semana_atual + p_pontos,
    nivel = v_nivel_depois,
    nivel_nome = CASE v_nivel_depois
      WHEN 1 THEN 'Iniciante'
      WHEN 2 THEN 'Aprendiz'
      WHEN 3 THEN 'Praticante'
      WHEN 4 THEN 'Expert'
      WHEN 5 THEN 'Mestre'
      WHEN 6 THEN 'Lenda'
    END,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Registra no histórico
  INSERT INTO gamification_history (
    user_id, tipo_evento, descricao, action_item_id,
    pontos, pontos_antes, pontos_depois
  ) VALUES (
    p_user_id, p_tipo_evento, p_descricao, p_action_item_id,
    p_pontos, v_pontos_antes, v_pontos_depois
  );

  -- Se subiu de nível, registra
  IF v_nivel_depois > v_nivel_antes THEN
    INSERT INTO gamification_history (
      user_id, tipo_evento, descricao, pontos, pontos_antes, pontos_depois
    ) VALUES (
      p_user_id, 'nivel_up',
      'Parabéns! Você subiu para o nível ' || v_nivel_depois,
      0, v_pontos_antes, v_pontos_depois
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar ação como concluída
CREATE OR REPLACE FUNCTION complete_action_item(
  p_action_item_id UUID
)
RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_pontos INTEGER;
  v_bonus INTEGER;
  v_data_limite DATE;
  v_titulo TEXT;
BEGIN
  -- Pega dados da ação
  SELECT user_id, pontos_conclusao, bonus_antecipado, data_limite, titulo
  INTO v_user_id, v_pontos, v_bonus, v_data_limite, v_titulo
  FROM action_items WHERE id = p_action_item_id;

  -- Atualiza ação
  UPDATE action_items SET
    status = 'concluida',
    concluida_em = NOW(),
    updated_at = NOW()
  WHERE id = p_action_item_id;

  -- Calcula pontos (com bonus se antes do prazo)
  IF v_data_limite IS NOT NULL AND CURRENT_DATE < v_data_limite THEN
    v_pontos := v_pontos + v_bonus;
    PERFORM add_gamification_points(
      v_user_id, v_pontos, 'acao_antecipada',
      'Ação concluída antes do prazo: ' || v_titulo,
      p_action_item_id
    );
  ELSE
    PERFORM add_gamification_points(
      v_user_id, v_pontos, 'acao_concluida',
      'Ação concluída: ' || v_titulo,
      p_action_item_id
    );
  END IF;

  -- Atualiza streak
  UPDATE gamification_scores SET
    ultima_acao_em = CURRENT_DATE,
    streak_dias_consecutivos = CASE
      WHEN ultima_acao_em = CURRENT_DATE - 1 THEN streak_dias_consecutivos + 1
      WHEN ultima_acao_em = CURRENT_DATE THEN streak_dias_consecutivos
      ELSE 1
    END,
    maior_streak = GREATEST(maior_streak,
      CASE
        WHEN ultima_acao_em = CURRENT_DATE - 1 THEN streak_dias_consecutivos + 1
        ELSE 1
      END
    ),
    total_acoes_concluidas = total_acoes_concluidas + 1,
    acoes_no_prazo = acoes_no_prazo + CASE
      WHEN v_data_limite IS NULL OR CURRENT_DATE <= v_data_limite THEN 1
      ELSE 0
    END,
    acoes_atrasadas = acoes_atrasadas + CASE
      WHEN v_data_limite IS NOT NULL AND CURRENT_DATE > v_data_limite THEN 1
      ELSE 0
    END,
    taxa_conclusao = (total_acoes_concluidas + 1)::DECIMAL / NULLIF(total_acoes_atribuidas, 0) * 100
  WHERE user_id = v_user_id;

  -- Cancela follow-ups pendentes
  UPDATE follow_ups SET status = 'cancelado'
  WHERE action_item_id = p_action_item_id AND status = 'agendado';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar ações baseadas no output map
CREATE OR REPLACE FUNCTION create_actions_from_output(
  p_project_id UUID,
  p_user_id UUID,
  p_fase TEXT
)
RETURNS void AS $$
DECLARE
  r RECORD;
  v_ordem INTEGER := 1;
BEGIN
  FOR r IN
    SELECT * FROM assembly_line_outputs_map
    WHERE fase = p_fase AND ativo = TRUE
    ORDER BY ordem_no_fluxo
  LOOP
    INSERT INTO action_items (
      project_id, user_id, titulo, descricao, categoria,
      output_origem, output_tabela, output_campo,
      instrucao_passo_a_passo, ferramenta_sugerida, link_ferramenta, exemplo_uso,
      prioridade, ordem_execucao, prazo_sugerido_dias,
      data_limite, pontos_conclusao
    ) VALUES (
      p_project_id, p_user_id, r.titulo_acao, r.descricao_acao, r.categoria_acao,
      r.campo_origem, r.tabela_origem, r.campo_origem,
      r.instrucao_padrao, r.ferramenta_principal, r.link_ferramenta, r.exemplo_uso,
      r.prioridade_padrao, v_ordem, r.prazo_padrao_dias,
      CURRENT_DATE + r.prazo_padrao_dias, r.pontos_padrao
    );

    v_ordem := v_ordem + 1;
  END LOOP;

  -- Atualiza total de ações atribuídas
  UPDATE gamification_scores SET
    total_acoes_atribuidas = total_acoes_atribuidas + v_ordem - 1
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar ranking
CREATE OR REPLACE FUNCTION update_rankings()
RETURNS void AS $$
BEGIN
  -- Ranking geral
  WITH ranked AS (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY pontos_totais DESC) as pos
    FROM gamification_scores
  )
  UPDATE gamification_scores gs SET
    posicao_ranking_geral = r.pos
  FROM ranked r WHERE gs.user_id = r.user_id;

  -- Ranking do mês
  WITH ranked AS (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY pontos_mes_atual DESC) as pos
    FROM gamification_scores
  )
  UPDATE gamification_scores gs SET
    posicao_ranking_mes = r.pos
  FROM ranked r WHERE gs.user_id = r.user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- DADOS INICIAIS - MAPA DE OUTPUTS
-- =============================================

INSERT INTO assembly_line_outputs_map (
  fase, tabela_origem, campo_origem, titulo_acao, descricao_acao, categoria_acao,
  instrucao_padrao, ferramenta_principal, link_ferramenta, ferramentas_alternativas,
  exemplo_uso, pontos_padrao, prioridade_padrao, prazo_padrao_dias, ordem_no_fluxo
) VALUES

-- FASE 1A - CLONE
('clone', 'clone_experts', 'system_prompt',
 'Configurar seu Clone de IA no ChatGPT',
 'Use o System Prompt gerado para criar seu assistente personalizado que escreve como você',
 'clone',
 E'1. Acesse chat.openai.com e faça login\n2. Clique em "Explorar GPTs" > "Criar"\n3. Em "Configuração", cole o System Prompt no campo "Instruções"\n4. Dê um nome ao seu GPT (ex: "Clone do [Seu Nome]")\n5. Adicione uma foto de perfil\n6. Salve e teste!',
 'ChatGPT Plus', 'https://chat.openai.com',
 ARRAY['Claude', 'Gemini', 'Poe'],
 'Exemplo: Peça ao seu clone para escrever um post sobre [seu tema principal]',
 25, 'alta', 2, 1
),

('clone', 'clone_experts', 'dna_psicologico',
 'Revisar seu DNA Psicológico',
 'Analise o DNA Psicológico extraído e valide se representa bem sua essência',
 'clone',
 E'1. Leia atentamente cada característica identificada\n2. Marque o que está preciso ✓\n3. Corrija o que precisa de ajuste\n4. Adicione características que faltaram\n5. Use isso como base para briefings futuros',
 'Notion', 'https://notion.so',
 ARRAY['Google Docs', 'Obsidian'],
 'Salve em um documento para referência em todas as criações de conteúdo',
 10, 'media', 3, 2
),

-- FASE 1B - POSICIONAMENTO
('posicionamento', 'clone_experts', 'sintese_estrategica',
 'Definir seu Posicionamento de Mercado',
 'Use a síntese estratégica para criar sua declaração de posicionamento única',
 'posicionamento',
 E'1. Leia a síntese estratégica completa\n2. Identifique os 3 principais diferenciais\n3. Crie sua frase de posicionamento:\n   "[Eu ajudo] [QUEM] [a conseguir O QUÊ] [de forma DIFERENTE]"\n4. Teste com 5 pessoas do seu público\n5. Refine baseado no feedback',
 'Notion', 'https://notion.so',
 ARRAY['Google Docs'],
 'Ex: "Eu ajudo infoprodutores a escalar para 7 dígitos usando automações de IA sem precisar de equipe"',
 20, 'alta', 3, 3
),

('posicionamento', 'clone_experts', 'analise_concorrentes',
 'Estudar seus Concorrentes',
 'Analise a pesquisa de concorrentes para identificar oportunidades únicas',
 'posicionamento',
 E'1. Liste os 5 principais concorrentes identificados\n2. Para cada um, anote: pontos fortes, pontos fracos\n3. Identifique gaps que ninguém está preenchendo\n4. Escolha 2-3 oportunidades para explorar\n5. Crie conteúdo atacando esses gaps',
 'Notion', 'https://notion.so',
 ARRAY['Miro', 'FigJam'],
 'Crie um quadro comparativo: Você vs Top 3 Concorrentes',
 15, 'media', 5, 4
),

-- FASE 2 - OFERTAS
('ofertas', 'offers', 'avatar',
 'Validar seu Avatar',
 'Confirme se o avatar gerado representa seu cliente ideal',
 'ofertas',
 E'1. Leia o perfil do avatar completo\n2. Compare com seus 5 melhores clientes reais\n3. Ajuste idade, dores, desejos se necessário\n4. Crie um "dia na vida" do avatar\n5. Use para direcionar toda comunicação',
 'Notion', 'https://notion.so',
 ARRAY['Google Docs'],
 'Dica: Dê um nome ao avatar (ex: "João Infoprodutor") para humanizar',
 15, 'alta', 2, 5
),

('ofertas', 'offers', 'big_idea',
 'Criar sua Landing Page com a Big Idea',
 'Use a Big Idea para criar uma landing page de alta conversão',
 'ofertas',
 E'1. Copie a Big Idea e Headlines geradas\n2. Acesse Lovable ou Bolt\n3. Peça: "Crie uma landing page para [produto] com essa headline: [headline]"\n4. Adicione depoimentos e CTA\n5. Publique e teste',
 'Lovable', 'https://lovable.dev',
 ARRAY['Bolt', 'Carrd', 'Framer'],
 'Prompt: "Crie uma landing page minimalista e profissional com essa copy: [cole a big idea]"',
 30, 'critica', 5, 6
),

('ofertas', 'offers', 'promessas',
 'Testar suas Promessas',
 'Valide as promessas geradas com seu público',
 'ofertas',
 E'1. Pegue as 5 principais promessas\n2. Crie 5 posts/stories, um para cada promessa\n3. Pergunte: "Qual dessas mais te atrai?"\n4. Meça engajamento de cada uma\n5. Use a vencedora como headline principal',
 'Instagram', 'https://instagram.com',
 ARRAY['LinkedIn', 'Twitter'],
 'Use enquetes nos stories para testar rapidamente',
 20, 'alta', 3, 7
),

('ofertas', 'offers', 'high_ticket',
 'Estruturar sua Oferta High Ticket',
 'Monte a página de vendas do seu produto principal',
 'ofertas',
 E'1. Use a estrutura de oferta gerada\n2. Defina: Preço, Bônus, Garantia\n3. Crie a página no Lovable/Carrd\n4. Adicione método de pagamento\n5. Faça 10 convites diretos para testar',
 'Lovable', 'https://lovable.dev',
 ARRAY['Hotmart', 'Eduzz', 'Kiwify'],
 'Comece com preço de lançamento 30% menor para validar',
 35, 'critica', 7, 8
),

-- CONTEÚDO
('conteudo', 'contents', 'body',
 'Publicar seu Primeiro Conteúdo',
 'Use os conteúdos gerados para começar a postar',
 'conteudo',
 E'1. Escolha o melhor conteúdo gerado\n2. Adapte para seu tom de voz se necessário\n3. Crie o visual (Canva/CapCut)\n4. Publique no melhor horário do seu público\n5. Responda todos os comentários',
 'Instagram', 'https://instagram.com',
 ARRAY['TikTok', 'LinkedIn'],
 'Melhor horário: teste 7h, 12h e 19h por 1 semana',
 10, 'media', 1, 9
)

ON CONFLICT DO NOTHING;

-- =============================================
-- TRIGGER PARA CRIAR AÇÕES AUTOMATICAMENTE
-- =============================================

-- Quando clone_experts fica ready, cria ações da fase clone
CREATE OR REPLACE FUNCTION on_clone_ready()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NEW.status = 'ready' AND (OLD.status IS NULL OR OLD.status != 'ready') THEN
    SELECT user_id INTO v_user_id FROM projects WHERE id = NEW.project_id;
    PERFORM create_actions_from_output(NEW.project_id, v_user_id, 'clone');
    PERFORM create_actions_from_output(NEW.project_id, v_user_id, 'posicionamento');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_clone_ready ON clone_experts;
CREATE TRIGGER trigger_clone_ready
  AFTER INSERT OR UPDATE ON clone_experts
  FOR EACH ROW EXECUTE FUNCTION on_clone_ready();

-- Quando offers fica ready, cria ações da fase ofertas
CREATE OR REPLACE FUNCTION on_offers_ready()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NEW.status = 'ready' AND (OLD.status IS NULL OR OLD.status != 'ready') THEN
    SELECT user_id INTO v_user_id FROM projects WHERE id = NEW.project_id;
    PERFORM create_actions_from_output(NEW.project_id, v_user_id, 'ofertas');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_offers_ready ON offers;
CREATE TRIGGER trigger_offers_ready
  AFTER INSERT OR UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION on_offers_ready();

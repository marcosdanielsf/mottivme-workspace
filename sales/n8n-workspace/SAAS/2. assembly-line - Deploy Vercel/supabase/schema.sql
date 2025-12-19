-- =============================================
-- ASSEMBLY LINE - SUPABASE SCHEMA
-- Execute this in Supabase SQL Editor
-- =============================================

-- 1. PROFILES (extensão do user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS (cada projeto do usuário)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'briefing' CHECK (status IN ('briefing', 'generating', 'complete', 'archived')),
  current_phase TEXT DEFAULT 'clone',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRIEFINGS (respostas do briefing conversacional)
CREATE TABLE IF NOT EXISTS briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  
  -- Perguntas do Briefing
  produto TEXT,
  avatar_descricao TEXT,
  dor_principal TEXT,
  desejo_principal TEXT,
  transformacao TEXT,
  diferencial TEXT,
  ticket_medio TEXT,
  tipo_funil TEXT,
  
  -- Dados extras coletados
  nicho TEXT,
  canais_principais TEXT[],
  tom_comunicacao TEXT,
  
  -- Metadados
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLONE_EXPERTS (dados do clone de cada projeto)
CREATE TABLE IF NOT EXISTS clone_experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  
  -- FASE 1A - Construção do Clone
  dna_psicologico JSONB,
  engenharia_reversa JSONB,
  configuracao_clone JSONB,
  system_prompt TEXT,
  
  -- FASE 1B - Pesquisa de Mercado
  analise_concorrentes JSONB,
  oportunidades_diferenciacao JSONB,
  tendencias_nicho JSONB,
  concorrentes_internacionais JSONB,
  concorrentes_brasileiros JSONB,
  sintese_estrategica JSONB,
  
  -- Metadados
  quality_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLONE_MATERIALS (arquivos de treinamento do clone)
CREATE TABLE IF NOT EXISTS clone_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clone_id UUID REFERENCES clone_experts(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('video', 'audio', 'text', 'pdf', 'transcript')),
  name TEXT NOT NULL,
  file_path TEXT, -- path no Supabase Storage
  url TEXT,
  duration_seconds INTEGER,
  size_bytes INTEGER,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  transcript TEXT,
  extracted_traits JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DNA_TRAITS (traços extraídos do clone)
CREATE TABLE IF NOT EXISTS dna_traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clone_id UUID REFERENCES clone_experts(id) ON DELETE CASCADE,
  
  category TEXT CHECK (category IN ('tom_voz', 'vocabulario', 'estrutura', 'gatilhos', 'personalidade')),
  trait TEXT NOT NULL,
  examples TEXT[],
  confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. OFFERS (ecossistema de ofertas)
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  
  -- Avatar
  avatar JSONB,
  avatar_detalhado JSONB,
  
  -- Promessas e Big Idea
  promessas JSONB,
  big_idea JSONB,
  mecanismo_unico TEXT,
  headline_principal TEXT,
  subheadlines TEXT[],
  
  -- Produtos do Ecossistema
  high_ticket JSONB,
  mid_ticket JSONB,
  low_ticket JSONB,
  backend JSONB,
  frontend JSONB,
  lead_magnet JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FUNNELS (funis criados - estrutura do Vortex)
CREATE TABLE IF NOT EXISTS funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('vsl', 'webinar', 'challenge', 'quiz', 'lead_magnet', 'direct', 'nurture')),
  description TEXT,
  
  -- React Flow structure
  nodes JSONB DEFAULT '[]',
  edges JSONB DEFAULT '[]',
  viewport JSONB,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FUNNEL_STEPS (etapas individuais do funil)
CREATE TABLE IF NOT EXISTS funnel_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('abordagem', 'ativacao', 'qualificacao', 'sondagem', 'pitch', 'rescue', 'start', 'end')),
  title TEXT,
  message TEXT,
  channel TEXT CHECK (channel IN ('instagram', 'whatsapp', 'email', 'sms')),
  delay_hours INTEGER DEFAULT 0,
  
  -- Posição no canvas
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  
  -- Configurações extras
  config JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONTENTS (conteúdos gerados)
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('post', 'reel', 'story', 'carrossel', 'email', 'ad', 'vsl_script', 'webinar_script')),
  title TEXT,
  body TEXT,
  hook TEXT,
  cta TEXT,
  
  -- Para carrosséis
  slides JSONB,
  
  -- Para emails
  subject TEXT,
  preview_text TEXT,
  sequence_name TEXT,
  sequence_day INTEGER,
  
  -- Para ads
  ad_type TEXT,
  target_audience TEXT,
  
  -- Metadados
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected', 'published')),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- AI metadata
  generated_by TEXT,
  generation_id UUID,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EDITORIAL_CALENDAR (calendário editorial)
CREATE TABLE IF NOT EXISTS editorial_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'linkedin', 'twitter', 'facebook')),
  
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
  published_at TIMESTAMPTZ,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. GENERATIONS (histórico de gerações de IA)
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  phase TEXT, -- 'clone', 'posicionamento', 'ofertas', 'marketing', 'funnels', 'scripts'
  agent_name TEXT NOT NULL,
  agent_number INTEGER,
  
  input JSONB,
  output JSONB,
  
  model TEXT, -- 'gpt-4', 'claude-3', etc
  tokens_input INTEGER,
  tokens_output INTEGER,
  duration_ms INTEGER,
  cost_usd DECIMAL(10,6),
  
  status TEXT DEFAULT 'complete' CHECK (status IN ('pending', 'running', 'complete', 'error')),
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EXPORTS (histórico de exports)
CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  
  destination TEXT NOT NULL, -- 'gohighlevel', 'n8n', 'meta', 'download', etc
  export_type TEXT, -- 'funnel', 'emails', 'contents', 'all'
  items_count INTEGER,
  
  file_url TEXT, -- se for download
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 14. INTEGRATIONS (integrações do usuário)
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  provider TEXT CHECK (provider IN ('gohighlevel', 'n8n', 'meta', 'google', 'zapier', 'airtable', 'mailchimp', 'webhook')),
  name TEXT,
  
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  
  webhook_url TEXT,
  api_key TEXT,
  
  metadata JSONB,
  
  status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'expired', 'error')),
  last_sync_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. COMPETITORS (análise de concorrentes - Ads Intel)
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  platform TEXT,
  profile_url TEXT,
  avatar_emoji TEXT,
  
  total_ads INTEGER DEFAULT 0,
  active_ads INTEGER DEFAULT 0,
  avg_duration_days INTEGER,
  
  last_scanned_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. COMPETITOR_ADS (ads dos concorrentes)
CREATE TABLE IF NOT EXISTS competitor_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('video', 'image', 'carousel')),
  thumbnail_url TEXT,
  headline TEXT,
  hook TEXT,
  cta TEXT,
  
  platform TEXT,
  status TEXT DEFAULT 'active',
  days_running INTEGER,
  engagement_level TEXT CHECK (engagement_level IN ('high', 'medium', 'low')),
  
  ad_url TEXT,
  
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PATTERNS (padrões identificados nos ads)
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  category TEXT CHECK (category IN ('ganchos', 'ctas', 'estrutura', 'visual', 'copy')),
  pattern_name TEXT NOT NULL,
  usage_percentage INTEGER,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  examples TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_briefings_project ON briefings(project_id);
CREATE INDEX IF NOT EXISTS idx_clone_experts_project ON clone_experts(project_id);
CREATE INDEX IF NOT EXISTS idx_contents_project ON contents(project_id);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_funnels_project ON funnels(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_project ON generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_competitors_project ON competitors(project_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clone_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clone_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE dna_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Projects: users can only see/edit their own
CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Briefings: users can manage briefings of their projects
CREATE POLICY "Users can manage own briefings" ON briefings
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Clone Experts: users can manage clones of their projects
CREATE POLICY "Users can manage own clones" ON clone_experts
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Clone Materials
CREATE POLICY "Users can manage own clone materials" ON clone_materials
  FOR ALL USING (
    clone_id IN (
      SELECT ce.id FROM clone_experts ce
      JOIN projects p ON ce.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- DNA Traits
CREATE POLICY "Users can manage own dna traits" ON dna_traits
  FOR ALL USING (
    clone_id IN (
      SELECT ce.id FROM clone_experts ce
      JOIN projects p ON ce.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Offers
CREATE POLICY "Users can manage own offers" ON offers
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Funnels
CREATE POLICY "Users can manage own funnels" ON funnels
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Funnel Steps
CREATE POLICY "Users can manage own funnel steps" ON funnel_steps
  FOR ALL USING (
    funnel_id IN (
      SELECT f.id FROM funnels f
      JOIN projects p ON f.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Contents
CREATE POLICY "Users can manage own contents" ON contents
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Editorial Calendar
CREATE POLICY "Users can manage own calendar" ON editorial_calendar
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Generations
CREATE POLICY "Users can view own generations" ON generations
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Exports
CREATE POLICY "Users can manage own exports" ON exports
  FOR ALL USING (user_id = auth.uid());

-- Integrations
CREATE POLICY "Users can manage own integrations" ON integrations
  FOR ALL USING (user_id = auth.uid());

-- Competitors
CREATE POLICY "Users can manage own competitors" ON competitors
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Competitor Ads
CREATE POLICY "Users can view competitor ads" ON competitor_ads
  FOR ALL USING (
    competitor_id IN (
      SELECT c.id FROM competitors c
      JOIN projects p ON c.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Patterns
CREATE POLICY "Users can manage own patterns" ON patterns
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get project progress
CREATE OR REPLACE FUNCTION get_project_progress(p_project_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_steps INTEGER := 6;
  completed_steps INTEGER := 0;
BEGIN
  -- Check briefing
  IF EXISTS (SELECT 1 FROM briefings WHERE project_id = p_project_id AND completed = true) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Check clone
  IF EXISTS (SELECT 1 FROM clone_experts WHERE project_id = p_project_id AND status = 'ready') THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Check offers
  IF EXISTS (SELECT 1 FROM offers WHERE project_id = p_project_id AND status = 'ready') THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Check funnels
  IF EXISTS (SELECT 1 FROM funnels WHERE project_id = p_project_id) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Check contents
  IF EXISTS (SELECT 1 FROM contents WHERE project_id = p_project_id) THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  -- Check exports
  IF EXISTS (SELECT 1 FROM exports WHERE project_id = p_project_id AND status = 'complete') THEN
    completed_steps := completed_steps + 1;
  END IF;
  
  RETURN (completed_steps * 100) / total_steps;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Run these in Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('clone-materials', 'clone-materials', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies (run in SQL editor)
-- CREATE POLICY "Users can upload clone materials" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'clone-materials' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can view own clone materials" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'clone-materials' AND
--     auth.uid()::text = (storage.foldername(name))[1]
--   );

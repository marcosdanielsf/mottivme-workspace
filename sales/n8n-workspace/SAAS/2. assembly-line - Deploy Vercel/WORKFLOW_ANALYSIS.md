# 🔄 ASSEMBLY LINE - ANÁLISE DO WORKFLOW N8N

## 📊 VISÃO GERAL

O workflow atual tem **6 actions principais** que disparam diferentes pipelines de agentes IA.

---

## 🎯 ACTIONS DISPONÍVEIS (Entry Points)

| Action | Descrição | Fase |
|--------|-----------|------|
| `generateCloneExpert` | Constrói o Clone do Expert | FASE 1A |
| `generatePosicionamentoEstrategico` | Posicionamento usando o Clone | FASE 1B |
| `generateEcossistemaDeOfertas` | Cria ecossistema de ofertas | FASE 2 |
| `generateMarketingeGeracaodeDemanda` | Marketing e geração de demanda | FASE 3A |
| `generateScriptsFunnels` | Scripts para funis | FASE 3B |
| `generateScriptsCalendarioeScripts` | Calendário editorial + Scripts | FASE 4 |

---

## 🤖 AGENTES IA (16 Agentes)

### **FASE 1A - Construção do Clone**
| # | Agente | Função |
|---|--------|--------|
| 1 | DNA Psicológico | Extrai DNA psicológico do expert |
| 2 | Engenheiro Reverso | Faz engenharia reversa do posicionamento |
| 3 | Configurador | Configura parâmetros do clone |
| 4 | System Prompt | Gera system prompt do clone |

### **FASE 1B - Posicionamento Estratégico**
| # | Agente | Função |
|---|--------|--------|
| 5 | Identity Mapper | Mapeia identidade e arquétipo |
| 6A | Perplexity Internacional | Pesquisa concorrentes internacionais |
| 6B | Perplexity Brasil | Pesquisa concorrentes brasileiros |
| 6C | Synthesis & Analysis | Sintetiza pesquisas |

### **FASE 2 - Ecossistema de Ofertas**
| # | Agente | Função |
|---|--------|--------|
| 7 | Avatar Creator | Cria avatar detalhado do cliente |
| 8 | Promise Generator | Gera promessas e headlines |
| 9 | Big Idea Creator | Cria big idea e mecanismo único |
| 10 | High Ticket Designer | Design de oferta high ticket |
| 11 | Back End Designer | Produtos de backend |
| 12 | Front End Designer | Produtos de frontend/isca |

### **FASE 3 - Marketing & Conteúdo**
| # | Agente | Função |
|---|--------|--------|
| 13 | Content Strategist | Estratégia de conteúdo |
| 14 | Creative Producer | Produção criativa |
| 15 | Funnel Builder | Construtor de funis |
| 16 | Email Sequences | Sequências de email |

### **GERADORES DE CONTEÚDO**
| Gerador | Output |
|---------|--------|
| Gerador Posts Reflexivos | Posts para Instagram |
| Gerador Scripts Reels | Scripts de Reels |
| Gerador Carrossel | Carrosséis |
| Gerador Stories | Stories |
| Gerador Trilha Editorial | Calendário editorial |

---

## 💾 TABELAS AIRTABLE → SUPABASE

### **Tabela Principal: Expert DNA Profile**

Campos identificados no workflow:

```
- id (PK)
- Expert Name
- contact_id
- status

# FASE 1 - Clone
- DNA Psicológico
- Engenharia Reversa
- Configuração Clone
- System Prompt

# FASE 1B - Pesquisa
- Análise Concorrentes - IA
- Oportunidades Diferenciação - IA
- Tendências Nicho - IA
- Concorrentes Internacionais - IA
- Concorrentes Brasileiros - IA

# FASE 2 - Ofertas
- Avatar
- Promessas
- Big Idea
- High Ticket Design
- Back End Design
- Front End Design

# FASE 3 - Marketing
- Content Strategy
- Creative Brief
- Funnel Structure
- Email Sequences

# CONTEÚDOS
- Posts
- Reels
- Carrosséis
- Stories
- Trilha Editorial
```

---

## 🗄️ SCHEMA SUPABASE PROPOSTO

```sql
-- =============================================
-- ASSEMBLY LINE - SUPABASE SCHEMA
-- =============================================

-- 1. USERS (já vem do Supabase Auth)
-- auth.users é gerenciado automaticamente

-- 2. PROFILES (extensão do user)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS (cada projeto do usuário)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'briefing' CHECK (status IN ('briefing', 'generating', 'complete', 'archived')),
  current_phase TEXT DEFAULT 'clone',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BRIEFINGS (respostas do briefing)
CREATE TABLE briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Perguntas do Briefing
  produto TEXT,
  avatar_descricao TEXT,
  dor_principal TEXT,
  desejo_principal TEXT,
  transformacao TEXT,
  diferencial TEXT,
  ticket_medio TEXT,
  tipo_funil TEXT,
  
  -- Metadados
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLONE_EXPERT (dados do clone)
CREATE TABLE clone_experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- FASE 1A - Clone
  dna_psicologico JSONB,
  engenharia_reversa JSONB,
  configuracao_clone JSONB,
  system_prompt TEXT,
  
  -- FASE 1B - Pesquisa
  analise_concorrentes JSONB,
  oportunidades_diferenciacao JSONB,
  tendencias_nicho JSONB,
  concorrentes_internacionais JSONB,
  concorrentes_brasileiros JSONB,
  
  -- Metadados
  quality_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLONE_MATERIALS (arquivos do clone)
CREATE TABLE clone_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clone_id UUID REFERENCES clone_experts(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('video', 'audio', 'text', 'pdf')),
  name TEXT,
  url TEXT,
  duration INTEGER, -- em segundos
  size INTEGER, -- em bytes
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error')),
  transcript TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DNA_TRAITS (traços extraídos do clone)
CREATE TABLE dna_traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clone_id UUID REFERENCES clone_experts(id) ON DELETE CASCADE,
  
  category TEXT CHECK (category IN ('tom_voz', 'vocabulario', 'estrutura', 'gatilhos')),
  trait TEXT,
  examples TEXT[],
  confidence INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OFFERS (ecossistema de ofertas)
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Avatar
  avatar JSONB,
  
  -- Promessas
  promessas JSONB,
  big_idea JSONB,
  mecanismo_unico TEXT,
  
  -- Produtos
  high_ticket JSONB,
  backend JSONB,
  frontend JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FUNNELS (funis criados)
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name TEXT,
  type TEXT CHECK (type IN ('vsl', 'webinar', 'challenge', 'quiz', 'lead_magnet')),
  structure JSONB, -- nodes e edges do React Flow
  
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FUNNEL_STEPS (etapas do funil)
CREATE TABLE funnel_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('abordagem', 'ativacao', 'qualificacao', 'sondagem', 'pitch', 'rescue')),
  title TEXT,
  message TEXT,
  channel TEXT CHECK (channel IN ('instagram', 'whatsapp', 'email')),
  delay_hours INTEGER DEFAULT 0,
  position_x FLOAT,
  position_y FLOAT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTENTS (conteúdos gerados)
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('post', 'reel', 'story', 'carrossel', 'email', 'ad')),
  title TEXT,
  body TEXT,
  hook TEXT,
  cta TEXT,
  
  -- Para carrosséis
  slides JSONB,
  
  -- Para emails
  subject TEXT,
  sequence_day INTEGER,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. EDITORIAL_CALENDAR (calendário editorial)
CREATE TABLE editorial_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE SET NULL,
  
  scheduled_date DATE,
  scheduled_time TIME,
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'linkedin')),
  status TEXT DEFAULT 'scheduled',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. GENERATIONS (histórico de gerações)
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  agent_name TEXT,
  agent_number INTEGER,
  input JSONB,
  output JSONB,
  tokens_used INTEGER,
  duration_ms INTEGER,
  status TEXT DEFAULT 'complete',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EXPORTS (histórico de exports)
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  destination TEXT,
  type TEXT,
  items_count INTEGER,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INTEGRATIONS (integrações do usuário)
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  provider TEXT CHECK (provider IN ('gohighlevel', 'n8n', 'meta', 'google', 'zapier', 'airtable', 'mailchimp')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  
  status TEXT DEFAULT 'connected',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_briefings_project ON briefings(project_id);
CREATE INDEX idx_contents_project ON contents(project_id);
CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_funnels_project ON funnels(project_id);
CREATE INDEX idx_generations_project ON generations(project_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clone_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own briefings" ON briefings
  FOR ALL USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own contents" ON contents
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

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🔗 MAPEAMENTO N8N → SUPABASE

### **Webhook Entry Point**
```
ANTES (Airtable):
GET ?action=generateCloneExpert&contact_id=xxx

DEPOIS (Supabase):
POST /api/generate
{
  "action": "generateCloneExpert",
  "project_id": "uuid",
  "user_id": "uuid"
}
```

### **Update após cada Agente**
```
ANTES:
💾 Update Airtable - FASE 1
  → Update record by ID

DEPOIS:
💾 Update Supabase
  → supabase.from('clone_experts').update({ dna_psicologico: output }).eq('project_id', projectId)
```

---

## 📡 API ROUTES NECESSÁRIAS (Next.js)

```
/api/auth/[...nextauth]     → Autenticação
/api/projects               → CRUD de projetos
/api/briefing               → Salvar briefing
/api/generate               → Disparar geração (webhook para n8n)
/api/contents               → CRUD de conteúdos
/api/funnels                → CRUD de funis
/api/clone                  → Upload de materiais
/api/export                 → Exportar para integrações
/api/webhook/n8n            → Receber updates do n8n
```

---

## 🔄 FLUXO DE INTEGRAÇÃO

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  1. User faz briefing                                           │
│  2. Clica "Gerar"                                               │
│  3. POST /api/generate { action, project_id }                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API ROUTE                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Valida user/project                                         │
│  2. Busca briefing do Supabase                                  │
│  3. Dispara webhook n8n com dados                               │
│  4. Cria registro em 'generations' com status='running'         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        N8N WORKFLOW                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Recebe webhook                                              │
│  2. Executa agentes em sequência                                │
│  3. A cada agente: POST /api/webhook/n8n { agent, output }      │
│  4. Frontend recebe via realtime subscription                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Salva output de cada agente                                 │
│  2. Atualiza status do project                                  │
│  3. Realtime broadcast para frontend                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Recebe update via Supabase Realtime                         │
│  2. Atualiza UI (progress bar, agente atual)                    │
│  3. Quando completo, mostra conteúdos gerados                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ PRÓXIMOS PASSOS

### 1. **Setup Supabase**
- [ ] Criar projeto no Supabase
- [ ] Rodar SQL do schema
- [ ] Configurar Auth (Google, Magic Link)
- [ ] Testar RLS policies

### 2. **Adaptar Frontend**
- [ ] Instalar @supabase/supabase-js
- [ ] Criar cliente Supabase
- [ ] Substituir stores locais por queries
- [ ] Implementar realtime subscriptions

### 3. **Adaptar N8N**
- [ ] Substituir nodes Airtable por HTTP Request (Supabase API)
- [ ] Ou usar node Postgres direto
- [ ] Configurar webhooks de callback

### 4. **API Routes**
- [ ] Criar endpoints de integração
- [ ] Autenticação via Supabase JWT
- [ ] Rate limiting

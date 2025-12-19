-- =============================================
-- MOTTIVME PLATFORM - INITIAL SCHEMA V2
-- =============================================
-- Run this in Supabase SQL Editor
-- Fixed: Renamed alerts table to lead_alerts to avoid VIEW conflict

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- DROP EXISTING TABLES (clean install)
-- =============================================
DROP TABLE IF EXISTS lead_alerts CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS tracking_events CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS generations CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop views if exist
DROP VIEW IF EXISTS lead_scores CASCADE;
DROP VIEW IF EXISTS online_leads CASCADE;

-- =============================================
-- PROPOSTAL TABLES
-- =============================================

-- Companies (clients of the SaaS)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
    brand_primary TEXT DEFAULT '#d4af37',
    brand_secondary TEXT DEFAULT '#0a0a0a',
    logo_url TEXT,
    stripe_customer_id TEXT,
    owner_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_company TEXT,
    content JSONB NOT NULL DEFAULT '{}',
    template TEXT DEFAULT 'default',
    expiry_date TIMESTAMPTZ,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'won', 'lost')),
    value DECIMAL(12,2),
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads (who receives the proposal)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'engaged', 'hot', 'won', 'lost')),
    last_activity TIMESTAMPTZ,
    total_time_seconds INTEGER DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking Events
CREATE TABLE tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'human')),
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Alerts/Notifications (renamed from alerts to avoid VIEW conflict)
CREATE TABLE lead_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('lead_online', 'high_score', 'chat_started', 'revisit', 'cta_click')),
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ELETRIFY TABLES
-- =============================================

-- Users (for Eletrify)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    credits INTEGER DEFAULT 5,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generations (copy, email, vsl, etc)
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('copy', 'email', 'vsl', 'proposal', 'pitch')),
    input JSONB NOT NULL,
    output TEXT NOT NULL,
    triggers_used TEXT[] DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates (saved templates)
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    niche TEXT,
    content JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_proposals_company ON proposals(company_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_leads_proposal ON leads(proposal_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_tracking_events_lead ON tracking_events(lead_id);
CREATE INDEX idx_tracking_events_created ON tracking_events(created_at DESC);
CREATE INDEX idx_lead_alerts_company ON lead_alerts(company_id);
CREATE INDEX idx_lead_alerts_read ON lead_alerts(is_read);
CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_type ON generations(type);

-- =============================================
-- RLS (Row Level Security)
-- =============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES (Allow all for now - customize later)
-- =============================================

-- Companies policies
CREATE POLICY "Allow all access to companies" ON companies FOR ALL USING (true);

-- Proposals policies
CREATE POLICY "Allow all access to proposals" ON proposals FOR ALL USING (true);

-- Leads policies
CREATE POLICY "Allow all access to leads" ON leads FOR ALL USING (true);

-- Tracking events policies
CREATE POLICY "Allow all access to tracking_events" ON tracking_events FOR ALL USING (true);

-- Chat messages policies
CREATE POLICY "Allow all access to chat_messages" ON chat_messages FOR ALL USING (true);

-- Lead alerts policies
CREATE POLICY "Allow all access to lead_alerts" ON lead_alerts FOR ALL USING (true);

-- Users policies
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);

-- Generations policies
CREATE POLICY "Allow all access to generations" ON generations FOR ALL USING (true);

-- Templates policies
CREATE POLICY "Allow all access to templates" ON templates FOR ALL USING (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if exist
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_proposals_updated_at ON proposals;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_proposals_updated_at
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- VIEWS
-- =============================================

-- View for lead scores with calculated values
CREATE OR REPLACE VIEW lead_scores AS
SELECT
    l.id,
    l.name,
    l.email,
    l.proposal_id,
    l.total_time_seconds,
    l.visit_count,
    l.score,
    l.status,
    l.last_activity,
    CASE
        WHEN l.score >= 70 THEN 'hot'
        WHEN l.score >= 40 THEN 'warm'
        ELSE 'cold'
    END as temperature,
    p.title as proposal_title,
    p.company_id
FROM leads l
JOIN proposals p ON l.proposal_id = p.id;

-- View for online leads (activity in last 5 minutes)
CREATE OR REPLACE VIEW online_leads AS
SELECT l.*
FROM leads l
WHERE l.last_activity > NOW() - INTERVAL '5 minutes';

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- Insert sample company
INSERT INTO companies (id, name, email, plan, owner_phone)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Mottivme Sales',
    'marcos@mottivme.com',
    'pro',
    '+5511999999999'
);

-- Insert sample proposal
INSERT INTO proposals (id, company_id, title, client_name, client_email, client_company, status, value, content)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Foundation Sprint - Estruturação Comercial',
    'João Silva',
    'joao@empresa.com',
    'Empresa XYZ',
    'active',
    53982.00,
    '{
        "hero": {
            "headline": "Transforme seu Negócio em uma Máquina Comercial",
            "subheadline": "Estruturação completa em 30 dias com metodologia comprovada"
        },
        "problems": [
            "Oferta que não converte como deveria",
            "Funil quebrado ou inexistente",
            "Sem scripts de vendas prontos",
            "CRM desorganizado",
            "Vendas imprevisíveis mês a mês"
        ],
        "solutions": [
            {"title": "Brand Book Completo", "description": "40 páginas de posicionamento estratégico, ICP e avatar detalhado."},
            {"title": "Offer Stack Irresistível", "description": "Estruturação de oferta usando metodologia Hormozi."},
            {"title": "3 Funis Completos", "description": "Orgânico, tráfego pago e outbound prontos para rodar."},
            {"title": "20 Scripts Prontos", "description": "Scripts de vendas, SDR, anúncios e conteúdo validados."}
        ],
        "pricing": {
            "full_price": 63000,
            "discount_price": 53982,
            "installments": 4,
            "installment_value": 15495
        }
    }'::jsonb
);

-- Insert sample lead
INSERT INTO leads (id, proposal_id, name, email, phone, company, score, status)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'João Silva',
    'joao@empresa.com',
    '+5511988888888',
    'Empresa XYZ',
    0,
    'pending'
);

-- Insert sample user for Eletrify
INSERT INTO users (id, email, name, plan, credits)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'marcos@mottivme.com',
    'Marcos Daniel',
    'pro',
    100
);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Schema created successfully! Tables: companies, proposals, leads, tracking_events, chat_messages, lead_alerts, users, generations, templates' as result;

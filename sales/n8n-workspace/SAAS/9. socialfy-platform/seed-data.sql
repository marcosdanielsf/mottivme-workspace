-- ============================================
-- SEED DATA - SOCIALFY PLATFORM
-- ============================================

-- 1. Pegar ID da organização existente
DO $$
DECLARE
    org_id UUID;
BEGIN
    SELECT id INTO org_id FROM socialfy_organizations WHERE slug = 'mottivme';
    IF org_id IS NULL THEN
        INSERT INTO socialfy_organizations (name, slug, plan, settings) 
        VALUES ('MottivMe Sales', 'mottivme', 'pro', '{"timezone": "America/Sao_Paulo"}')
        RETURNING id INTO org_id;
    END IF;
    RAISE NOTICE 'Organization ID: %', org_id;
END $$;

-- 2. Leads de teste
INSERT INTO socialfy_leads (id, organization_id, name, title, company, email, phone, linkedin_url, instagram_handle, status, icp_score, channels, source, tags) VALUES 
('11111111-1111-1111-1111-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'João Silva', 'CEO', 'TechStartup Brasil', 'joao@techstartup.com.br', '11999887766', 'https://linkedin.com/in/joaosilva', '@joaosilva', 'available', 92, ARRAY['linkedin', 'email'], 'linkedin_search', ARRAY['decisor', 'tech', 'startup']),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Maria Santos', 'Diretora Comercial', 'Vendas Pro LTDA', 'maria@vendaspro.com.br', '11988776655', 'https://linkedin.com/in/mariasantos', '@mariasantos_vendas', 'in_cadence', 88, ARRAY['linkedin', 'whatsapp'], 'referral', ARRAY['vendas', 'b2b']),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Carlos Oliveira', 'Founder', 'Inova Digital', 'carlos@inovadigital.io', '11977665544', 'https://linkedin.com/in/carlosoliveira', '@carlosinova', 'responding', 95, ARRAY['linkedin', 'instagram'], 'instagram_dm', ARRAY['tech', 'saas', 'decisor']),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Ana Paula Costa', 'Head of Growth', 'ScaleUp Ventures', 'ana@scaleupvc.com', '11966554433', 'https://linkedin.com/in/anapaulacosta', '@anacosta', 'scheduled', 90, ARRAY['linkedin', 'email', 'whatsapp'], 'linkedin_connection', ARRAY['growth', 'investment']),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Roberto Mendes', 'CTO', 'DataFlow Systems', 'roberto@dataflow.tech', '11955443322', 'https://linkedin.com/in/robertomendes', '@roberto_tech', 'converted', 85, ARRAY['linkedin'], 'cold_outreach', ARRAY['tech', 'data']),
('66666666-6666-6666-6666-666666666666', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Fernanda Lima', 'VP Sales', 'Enterprise Solutions', 'fernanda@enterprise.com.br', '11944332211', 'https://linkedin.com/in/fernandalima', '@fernanda.lima', 'available', 78, ARRAY['linkedin', 'email'], 'webinar', ARRAY['enterprise', 'vendas']),
('77777777-7777-7777-7777-777777777777', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Pedro Almeida', 'Gerente de Marketing', 'MarketPro Agency', 'pedro@marketpro.com.br', '11933221100', 'https://linkedin.com/in/pedroalmeida', '@pedromkt', 'in_cadence', 72, ARRAY['instagram', 'email'], 'instagram_dm', ARRAY['marketing', 'agencia']),
('88888888-8888-8888-8888-888888888888', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Luciana Ferreira', 'COO', 'OperaTech', 'luciana@operatech.io', '11922110099', 'https://linkedin.com/in/lucianaferreira', '@lucianaops', 'lost', 65, ARRAY['linkedin'], 'event', ARRAY['operacoes', 'tech'])
ON CONFLICT (id) DO NOTHING;

-- 3. Campanhas de teste
INSERT INTO socialfy_campaigns (id, organization_id, name, description, type, status, channels, leads_count, responses_count, meetings_count, conversion_rate) VALUES 
('aaaa1111-aaaa-1111-aaaa-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Prospecção LinkedIn Q1', 'Campanha de conexão e aquecimento no LinkedIn', 'connection', 'active', ARRAY['linkedin'], 150, 45, 12, 8.0),
('aaaa2222-aaaa-2222-aaaa-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Outbound Multicanal', 'Estratégia multicanal para empresas de tech', 'multi_channel', 'active', ARRAY['linkedin', 'email', 'whatsapp'], 80, 28, 8, 10.0),
('aaaa3333-aaaa-3333-aaaa-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Instagram DM - Agências', 'Prospecção via DM para agências de marketing', 'instagram_dm', 'paused', ARRAY['instagram'], 45, 15, 3, 6.7),
('aaaa4444-aaaa-4444-aaaa-444444444444', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Warm Up - CEOs Tech', 'Aquecimento de relacionamento com decisores', 'warm_up', 'draft', ARRAY['linkedin', 'email'], 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- 4. Cadências de teste
INSERT INTO socialfy_cadences (id, organization_id, name, code, description, channels, duration_days, touch_level, lead_source, steps, avg_response_rate, avg_meeting_rate, times_used, status, is_template) VALUES 
('bbbb1111-bbbb-1111-bbbb-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'LinkedIn Authority', 'LKD-AUTH-01', 'Sequência de autoridade no LinkedIn', ARRAY['linkedin'], 14, 'medium', 'outbound', 
 '[{"day":1,"channel":"linkedin","action":"connection_request"},{"day":3,"channel":"linkedin","action":"follow_post"},{"day":5,"channel":"linkedin","action":"message"},{"day":10,"channel":"linkedin","action":"value_message"}]'::jsonb, 
 32.5, 12.0, 45, 'active', true),
('bbbb2222-bbbb-2222-bbbb-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Multicanal Agressivo', 'MULTI-AGR-01', 'Cadência multicanal de alta frequência', ARRAY['linkedin', 'email', 'whatsapp'], 7, 'high', 'outbound',
 '[{"day":1,"channel":"linkedin","action":"connection"},{"day":1,"channel":"email","action":"cold_email"},{"day":2,"channel":"whatsapp","action":"intro_message"}]'::jsonb,
 28.0, 15.5, 23, 'active', true),
('bbbb3333-bbbb-3333-bbbb-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Instagram Engajamento', 'IG-ENG-01', 'Cadência de engajamento no Instagram', ARRAY['instagram'], 10, 'low', 'inbound',
 '[{"day":1,"channel":"instagram","action":"follow"},{"day":2,"channel":"instagram","action":"like_posts"},{"day":7,"channel":"instagram","action":"dm"}]'::jsonb,
 22.0, 8.0, 18, 'active', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Pipeline/Deals
INSERT INTO socialfy_pipeline_deals (id, organization_id, lead_id, title, value, currency, stage) VALUES 
('cccc1111-cccc-1111-cccc-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '33333333-3333-3333-3333-333333333333', 'Plano Enterprise - Inova Digital', 15000.00, 'BRL', 'proposal'),
('cccc2222-cccc-2222-cccc-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '44444444-4444-4444-4444-444444444444', 'Consultoria Growth - ScaleUp', 8500.00, 'BRL', 'scheduled'),
('cccc3333-cccc-3333-cccc-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '55555555-5555-5555-5555-555555555555', 'Implementação Full - DataFlow', 25000.00, 'BRL', 'won'),
('cccc4444-cccc-4444-cccc-444444444444', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '11111111-1111-1111-1111-111111111111', 'Plano Pro - TechStartup', 5000.00, 'BRL', 'new'),
('cccc5555-cccc-5555-cccc-555555555555', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '22222222-2222-2222-2222-222222222222', 'Mentoria Vendas B2B', 3500.00, 'BRL', 'relationship')
ON CONFLICT (id) DO NOTHING;

-- 6. Mensagens (Inbox)
INSERT INTO socialfy_messages (id, organization_id, lead_id, channel, direction, content, status, is_read, sent_at) VALUES 
('dddd1111-dddd-1111-dddd-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '33333333-3333-3333-3333-333333333333', 'linkedin', 'inbound', 'Oi! Vi sua mensagem, adorei a proposta. Podemos marcar uma call?', 'delivered', false, NOW() - INTERVAL '2 hours'),
('dddd2222-dddd-2222-dddd-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '22222222-2222-2222-2222-222222222222', 'whatsapp', 'inbound', 'Olá, recebi o material. Muito interessante! Qual o próximo passo?', 'delivered', false, NOW() - INTERVAL '4 hours'),
('dddd3333-dddd-3333-dddd-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '44444444-4444-4444-4444-444444444444', 'email', 'inbound', 'Confirmo a reunião para quinta às 14h. Obrigada!', 'delivered', true, NOW() - INTERVAL '1 day'),
('dddd4444-dddd-4444-dddd-444444444444', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '11111111-1111-1111-1111-111111111111', 'linkedin', 'outbound', 'João, parabéns pelo crescimento da TechStartup! Vi que vocês fecharam a rodada...', 'sent', true, NOW() - INTERVAL '3 hours'),
('dddd5555-dddd-5555-dddd-555555555555', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), '77777777-7777-7777-7777-777777777777', 'instagram', 'inbound', 'Opa! Curti muito o conteúdo que vocês postaram sobre prospecção B2B', 'delivered', false, NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. AI Agents
INSERT INTO socialfy_ai_agents (id, organization_id, name, type, description, language, model, is_active, total_executions) VALUES 
('99991111-9999-1111-9999-111111111111', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'SDR IA - Conexões', 'connection', 'Agente para solicitações de conexão personalizadas', 'pt-BR', 'gemini-pro', true, 1250),
('99992222-9999-2222-9999-222222222222', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Inbox Manager', 'inbox', 'Responde mensagens recebidas automaticamente', 'pt-BR', 'gemini-pro', true, 890),
('99993333-9999-3333-9999-333333333333', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Lead Qualifier', 'qualifier', 'Qualifica leads com base no ICP', 'pt-BR', 'gemini-pro', false, 450),
('99994444-9999-4444-9999-444444444444', (SELECT id FROM socialfy_organizations WHERE slug = 'mottivme'), 'Content Creator', 'content', 'Gera conteúdo para posts e mensagens', 'pt-BR', 'gemini-pro', true, 320)
ON CONFLICT (id) DO NOTHING;

SELECT 'Seed data inserido com sucesso!' as status;

-- Insert default company settings (MOTTIVME SALES LTDA)
INSERT INTO company_settings (
  name,
  tax_id,
  address,
  email,
  phone,
  bank_name,
  bank_branch,
  bank_account,
  bank_pix
) VALUES (
  'MOTTIVME SALES LTDA',
  '32.408.090/0001-40',
  'Alameda Rio Negro, 503 Conj 2005, Barueri - SP, Brazil',
  'financeiro@mottivme.com.br',
  '+55 11 1234-5678',
  'BTG Pactual',
  '0050',
  '822601-4',
  'financeiro@mottivme.com.br'
) ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO clients (name, email, company, phone, address, tax_id, country) VALUES
  ('Andrey Medeiros', 'amedeiros@karvrepair.com', 'Karv Repair', '+1 407 304 0347', '108 Edgelake Dr, DeBary, FL 32713, USA', '123-45-6789', 'USA'),
  ('Gustavo Couto', 'gus@fiveringsflorida.com', 'Dream Makers Financial', '+1 754 265 0461', '21365 Gosier Way, Boca Raton, FL 33428, USA', '987-65-4321', 'USA')
ON CONFLICT DO NOTHING;

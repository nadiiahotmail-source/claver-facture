-- KaziRelance Database Schema

-- Table profiles (gérée par Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Table des factures/relances
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  invoice_number TEXT,
  insurer TEXT,
  iban TEXT,
  amount DECIMAL(10,2),
  due_date DATE,
  days_late INT,
  debtor_type TEXT CHECK (debtor_type IN ('B2B','B2C')),
  status TEXT DEFAULT 'upload', -- upload | ocr_processing | pending_validation | validated | sent | archived
  ocr_data JSONB, -- extractions brutes de Gemini
  human_corrections JSONB, -- modifications validées par l'utilisateur
  communication_history JSONB DEFAULT '[]'::jsonb, -- traces des envois
  email_subject TEXT,
  email_body TEXT,
  email_sent_at TIMESTAMPTZ,
  is_validated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table des paramètres utilisateur (clés API, préférences)
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  gemini_api_key_enc TEXT,
  resend_api_key_enc TEXT,
  twilio_account_sid_enc TEXT,
  twilio_auth_token_enc TEXT,
  whatsapp_bridge_mode TEXT DEFAULT 'native', -- 'native' ou 'twilio' ou 'meta'
  email_signature TEXT,
  communication_tone TEXT DEFAULT 'courtois',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT now()
);

-- Table de mémoire agentique (NOUVELLE)
CREATE TABLE IF NOT EXISTS public.memory_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_name TEXT,
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_reminders_user_status ON reminders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_user_client ON memory_context(user_id, client_name);

-- --- SÉCURITÉ : Row Level Security (RLS) ---

-- Activation du RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_context ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Isolant chaque utilisateur à ses propres données)

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Reminders
CREATE POLICY "Users can manage own reminders" ON public.reminders 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Settings
CREATE POLICY "Users can manage own settings" ON public.settings 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Users can view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Memory Context
CREATE POLICY "Users can manage own memory context" ON public.memory_context 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- Migration de synchronisation pour la mise en production réelle
-- Alignement avec DBService et init_db.sql

-- 0. Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 1. Table Settings : Ajout des colonnes manquantes et renommage si nécessaire
DO $$ 
BEGIN
    -- Ajout des colonnes _enc si elles n'existent pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='gemini_api_key_enc') THEN
        ALTER TABLE public.settings ADD COLUMN gemini_api_key_enc TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='resend_api_key_enc') THEN
        ALTER TABLE public.settings ADD COLUMN resend_api_key_enc TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='twilio_account_sid_enc') THEN
        ALTER TABLE public.settings ADD COLUMN twilio_account_sid_enc TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='twilio_auth_token_enc') THEN
        ALTER TABLE public.settings ADD COLUMN twilio_auth_token_enc TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='email_signature') THEN
        ALTER TABLE public.settings ADD COLUMN email_signature TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='communication_tone') THEN
        ALTER TABLE public.settings ADD COLUMN communication_tone TEXT DEFAULT 'courtois';
    END IF;
END $$;

-- 2. Table Audit Logs : Alignement des colonnes
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='action') THEN
        ALTER TABLE public.audit_logs ADD COLUMN action TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='details') THEN
        ALTER TABLE public.audit_logs ADD COLUMN details JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='ip_address') THEN
        ALTER TABLE public.audit_logs ADD COLUMN ip_address INET;
    END IF;
END $$;

-- 3. Table Reminders : S'assurer que le schéma est complet
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reminders' AND column_name='is_validated') THEN
        ALTER TABLE public.reminders ADD COLUMN is_validated BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reminders' AND column_name='debtor_type') THEN
        ALTER TABLE public.reminders ADD COLUMN debtor_type TEXT;
    END IF;
END $$;

-- 4. Activation globale du RLS (au cas où)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_context ENABLE ROW LEVEL SECURITY;

-- 5. Recréation des politiques pour garantir l'isolation utilisateur
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage own reminders" ON public.reminders;
CREATE POLICY "Users can manage own reminders" ON public.reminders 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own settings" ON public.settings;
CREATE POLICY "Users can manage own settings" ON public.settings 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own memory context" ON public.memory_context;
CREATE POLICY "Users can manage own memory context" ON public.memory_context 
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

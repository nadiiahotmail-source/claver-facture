-- MIGRATION SQL: Améliorations KaziRelance 2026

-- 1. Recherche Vectorielle (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- Ajout de la colonne embedding à la table memory_context
-- Gemini 1.5 embeddings ont 768 dimensions (text-embedding-004)
ALTER TABLE public.memory_context 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Index HNSW pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_memory_embedding ON public.memory_context 
USING hnsw (embedding vector_cosine_ops);

-- 2. Automatisation de l'Audit (Trigger)
CREATE OR REPLACE FUNCTION public.fn_audit_reminder_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (user_id, action, details, created_at)
        VALUES (NEW.user_id, 'reminder_created', jsonb_build_object('id', NEW.id, 'status', NEW.status), now());
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.status <> NEW.status) THEN
            INSERT INTO public.audit_logs (user_id, action, details, created_at)
            VALUES (NEW.user_id, 'status_changed', jsonb_build_object('id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status), now());
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_audit_reminder ON public.reminders;
CREATE TRIGGER tr_audit_reminder
AFTER INSERT OR UPDATE ON public.reminders
FOR EACH ROW EXECUTE FUNCTION public.fn_audit_reminder_changes();

-- 3. Ajout de file_url pour l'aperçu documentaire
ALTER TABLE public.reminders 
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- 4. Ajout de la langue préférée
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';

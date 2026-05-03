-- MIGRATION SQL: Drop foreign key constraints on all tables to allow mock user testing
ALTER TABLE public.reminders DROP CONSTRAINT IF EXISTS reminders_user_id_fkey;
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE public.memory_context DROP CONSTRAINT IF EXISTS memory_context_user_id_fkey;

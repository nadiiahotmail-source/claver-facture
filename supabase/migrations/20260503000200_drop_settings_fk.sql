-- MIGRATION SQL: Drop foreign key constraint on settings(user_id) to allow mock user testing
ALTER TABLE public.settings DROP CONSTRAINT IF EXISTS settings_user_id_fkey;

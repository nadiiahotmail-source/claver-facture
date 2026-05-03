-- MIGRATION SQL: Relax constraints on Reminders table for AI-driven data entry
ALTER TABLE public.reminders ALTER COLUMN client_name DROP NOT NULL;
ALTER TABLE public.reminders ALTER COLUMN insurer DROP NOT NULL;
ALTER TABLE public.reminders ALTER COLUMN amount DROP NOT NULL;
ALTER TABLE public.reminders ALTER COLUMN due_date DROP NOT NULL;

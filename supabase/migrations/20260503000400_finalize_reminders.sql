-- MIGRATION SQL: Finalize Reminders table schema for 2026 Production
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS client_phone TEXT;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS iban TEXT;
ALTER TABLE public.reminders ADD COLUMN IF NOT EXISTS ocr_data JSONB;

-- Rename old columns if they exist and new ones are empty (Optional, but good for stability)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reminders' AND column_name='phone_number') THEN
        UPDATE public.reminders SET client_phone = phone_number WHERE client_phone IS NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reminders' AND column_name='policy_number') THEN
        UPDATE public.reminders SET invoice_number = policy_number WHERE invoice_number IS NULL;
    END IF;
END $$;

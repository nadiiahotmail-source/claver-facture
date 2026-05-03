-- MIGRATION SQL: Add missing whatsapp_bridge_mode column to settings
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS whatsapp_bridge_mode TEXT DEFAULT 'native';

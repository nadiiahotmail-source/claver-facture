-- Ajout des colonnes pour la gestion des e-mails et la validation humaine

ALTER TABLE reminders 
ADD COLUMN IF NOT EXISTS email_subject TEXT,
ADD COLUMN IF NOT EXISTS email_body TEXT,
ADD COLUMN IF NOT EXISTS is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ;

-- Mise à jour du statut possible : 'pending', 'drafted', 'validated', 'sent'
-- On ne peut pas modifier un type ENUM facilement en SQL standard sans recréer, 
-- mais comme status est un TEXT, on documente juste les nouvelles valeurs.

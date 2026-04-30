-- Ajout de la colonne user_id pour lier les rappels aux utilisateurs
ALTER TABLE reminders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Mise à jour de la politique RLS pour filtrer par utilisateur
DROP POLICY IF EXISTS "Allow all actions for demo" ON reminders;

CREATE POLICY "Users can manage their own reminders" ON reminders
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

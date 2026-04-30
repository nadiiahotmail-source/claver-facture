-- Initialisation de la base de données KaziRelance

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    insurer TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    policy_number TEXT,
    phone_number TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour accélérer les recherches par client ou assureur
CREATE INDEX IF NOT EXISTS idx_reminders_client ON reminders(client_name);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);

-- MIGRATION SQL: Relax audit_logs constraints to avoid trigger failures
ALTER TABLE public.audit_logs ALTER COLUMN message DROP NOT NULL;

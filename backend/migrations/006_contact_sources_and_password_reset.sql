DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'companies'
          AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE companies ADD COLUMN approved_at timestamptz;
        UPDATE companies SET approved_at = COALESCE(created_at, now());
    END IF;
END $$;

ALTER TABLE contact_requests ALTER COLUMN name DROP NOT NULL;
ALTER TABLE contact_requests ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE contact_requests ALTER COLUMN company_name DROP NOT NULL;
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS source varchar(32) NOT NULL DEFAULT 'contact';
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS company_id integer
    REFERENCES companies(id) ON DELETE SET NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'contact_requests_source_check'
    ) THEN
        ALTER TABLE contact_requests
            ADD CONSTRAINT contact_requests_source_check
            CHECK (source IN ('contact', 'company_registration', 'password_reset'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS contact_requests_source_created_idx
    ON contact_requests (source, created_at DESC);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id bigserial PRIMARY KEY,
    principal_type varchar(20) NOT NULL
        CHECK (principal_type IN ('root', 'company', 'collaborator')),
    principal_id integer NOT NULL,
    token_hash char(64) NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_principal_idx
    ON password_reset_tokens (principal_type, principal_id, created_at DESC);

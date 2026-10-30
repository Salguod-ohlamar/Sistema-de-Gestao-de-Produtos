CREATE TABLE IF NOT EXISTS companies (
    id serial PRIMARY KEY,
    trade_name varchar(255) NOT NULL,
    legal_name varchar(255) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    cnpj varchar(14) NOT NULL UNIQUE,
    phone varchar(11) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    segment varchar(14) CHECK (segment IN ('technology', 'retail', 'services', 'industry')) NOT NULL,
    is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan_code varchar(40);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan_started_at date;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan_term_months integer;

CREATE TABLE IF NOT EXISTS company_credentials (
    company_id integer PRIMARY KEY REFERENCES companies(id) ON DELETE CASCADE,
    password_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS collaborators (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    cpf varchar(11) NOT NULL UNIQUE,
    password_hash varchar(60) NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    phone varchar(11),
    hire_date date NOT NULL,
    termination_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    role varchar(14) CHECK (role IN ('administrator', 'manager', 'operator')) NOT NULL,
    company_id integer NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE collaborators ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS system_admins (
    id serial PRIMARY KEY,
    email varchar(100) NOT NULL UNIQUE,
    password_hash varchar(60) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collaborators_company_id_idx ON collaborators(company_id);

ALTER TABLE products ADD COLUMN IF NOT EXISTS company_id integer;
ALTER TABLE products ADD COLUMN IF NOT EXISTS legacy_company_id varchar(255);

DO $$
DECLARE
    company_id_type text;
BEGIN
    SELECT data_type INTO company_id_type
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'products'
      AND column_name = 'company_id';

    IF company_id_type = 'character varying' THEN
        UPDATE products
        SET legacy_company_id = company_id
        WHERE company_id IS NOT NULL
          AND btrim(company_id) !~ '^[0-9]+$'
          AND legacy_company_id IS NULL;

        ALTER TABLE products
            ALTER COLUMN company_id TYPE integer
            USING CASE
                WHEN btrim(company_id) ~ '^[0-9]+$' THEN btrim(company_id)::integer
                ELSE NULL
            END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'products_company_id_fkey'
          AND conrelid = 'products'::regclass
    ) THEN
        ALTER TABLE products
            ADD CONSTRAINT products_company_id_fkey
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS products_company_id_idx ON products(company_id);
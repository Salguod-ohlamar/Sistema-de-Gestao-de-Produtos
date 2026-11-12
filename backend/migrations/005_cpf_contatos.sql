-- CPF opcional do cliente na venda + pedidos de contato da tela inicial.
-- Seguro para rodar mais de uma vez.

ALTER TABLE sales ADD COLUMN IF NOT EXISTS customer_cpf varchar(11);

CREATE TABLE IF NOT EXISTS contact_requests (
    id serial PRIMARY KEY,
    name varchar(120) NOT NULL,
    phone varchar(11) NOT NULL,
    email varchar(160) NOT NULL,
    company_name varchar(160) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    handled boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS contact_requests_created_idx ON contact_requests (created_at DESC);

-- DRE: custo congelado no item vendido + lançamento de despesas.
-- Seguro para rodar mais de uma vez.

-- 1) Custo unitário no momento da venda (para o lucro não mudar quando o custo do produto mudar)
ALTER TABLE sales_items ADD COLUMN IF NOT EXISTS unit_cost numeric(10, 2);

-- 2) Vendas antigas: não existe o custo da época. Usa o custo ATUAL do produto como estimativa.
UPDATE sales_items si
SET unit_cost = p.cost_price
FROM products p
WHERE p.id = si.product_id
  AND si.unit_cost IS NULL;

-- 3) Despesas da empresa
CREATE TABLE IF NOT EXISTS expenses (
    id serial PRIMARY KEY,
    company_id integer NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category varchar(20) NOT NULL CHECK (category IN ('rent', 'utilities', 'payroll', 'marketing', 'other')),
    description varchar(255),
    amount numeric(10, 2) NOT NULL CHECK (amount > 0),
    incurred_on date NOT NULL,
    created_by integer REFERENCES collaborators(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expenses_company_date_idx ON expenses (company_id, incurred_on);

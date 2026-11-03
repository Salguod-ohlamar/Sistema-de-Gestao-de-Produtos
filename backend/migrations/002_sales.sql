CREATE TABLE sales (
    id  serial PRIMARY KEY,
    company_id integer NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    collaborator_id integer REFERENCES collaborators(id) ON DELETE RESTRICT,
    created_at  timestamp with time zone NOT NULL DEFAULT now(),
    total numeric(10, 2) NOT NULL,
    status varchar(14) CHECK (status IN ('completed', 'canceled')) NOT NULL
);

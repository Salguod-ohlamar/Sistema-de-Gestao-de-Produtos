CREATE TABLE sales_items (
    id serial PRIMARY KEY,
    sale_id integer NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id integer NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity integer  CHECK("quantity" > 0) NOT NULL,
    unit_price numeric(10, 2) CHECK("unit_price" > 0) NOT NULL 
);
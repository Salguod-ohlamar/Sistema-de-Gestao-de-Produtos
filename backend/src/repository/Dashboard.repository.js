import { sql } from '../database.js';

class DashboardRepository {
    async salesByDay(companyId, from, to) {
        return sql`
            SELECT TO_CHAR((created_at AT TIME ZONE 'America/Sao_Paulo')::date, 'YYYY-MM-DD') AS date,
                   COUNT(*)::int AS sales_count,
                   COALESCE(SUM(total), 0)::numeric(12, 2) AS revenue
            FROM sales
            WHERE company_id = ${companyId}
              AND status = 'completed'
              AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN ${from}::date AND ${to}::date
            GROUP BY (created_at AT TIME ZONE 'America/Sao_Paulo')::date
            ORDER BY (created_at AT TIME ZONE 'America/Sao_Paulo')::date;
        `;
    }

    async stockByCategory(companyId) {
        return sql`
            SELECT COALESCE(NULLIF(BTRIM(category), ''), 'Sem categoria') AS category,
                   COUNT(*)::int AS products_count,
                   COALESCE(SUM(stock_quantity), 0)::int AS stock_units
            FROM products
            WHERE company_id = ${companyId}
            GROUP BY COALESCE(NULLIF(BTRIM(category), ''), 'Sem categoria')
            ORDER BY stock_units DESC, category ASC;
        `;
    }

    // Mais vendidos no período, por quantidade
    async topProducts(companyId, from, to, limit) {
        return sql`
            SELECT p.id AS product_id, p.name, p.sku,
                   SUM(si.quantity)::int AS quantity_sold,
                   SUM(si.quantity * si.unit_price) AS revenue
            FROM sales_items si
            JOIN sales s ON s.id = si.sale_id
            JOIN products p ON p.id = si.product_id
            WHERE s.company_id = ${companyId}
              AND s.status = 'completed'
              AND (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN ${from}::date AND ${to}::date
            GROUP BY p.id, p.name, p.sku
            ORDER BY quantity_sold DESC, revenue DESC
            LIMIT ${limit};
        `;
    }

    // Parados: têm estoque e nenhuma venda concluída no período
    async stagnantProducts(companyId, from, to, limit) {
        return sql`
            SELECT p.id AS product_id, p.name, p.sku, p.stock_quantity,
                   (SELECT MAX(s2.created_at)
                      FROM sales_items si2
                      JOIN sales s2 ON s2.id = si2.sale_id
                     WHERE si2.product_id = p.id AND s2.status = 'completed') AS last_sold_at
            FROM products p
            WHERE p.company_id = ${companyId}
              AND p.stock_quantity > 0
              AND NOT EXISTS (
                  SELECT 1
                  FROM sales_items si
                  JOIN sales s ON s.id = si.sale_id
                  WHERE si.product_id = p.id
                    AND s.status = 'completed'
                    AND (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN ${from}::date AND ${to}::date
              )
            ORDER BY p.stock_quantity DESC, p.name
            LIMIT ${limit};
        `;
    }

    // Estoque no mínimo ou abaixo (inclui esgotados)
    async lowStock(companyId, limit) {
        return sql`
            SELECT id AS product_id, name, sku, stock_quantity, min_stock_quantity
            FROM products
            WHERE company_id = ${companyId}
              AND stock_quantity <= min_stock_quantity
            ORDER BY stock_quantity ASC, name
            LIMIT ${limit};
        `;
    }

    async lowStockCount(companyId) {
        const result = await sql`
            SELECT COUNT(*)::int AS total
            FROM products
            WHERE company_id = ${companyId} AND stock_quantity <= min_stock_quantity;
        `;
        return result[0].total;
    }
}

export default new DashboardRepository();

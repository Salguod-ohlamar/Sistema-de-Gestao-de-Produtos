import { sql } from '../database.js';

class DashboardRepository {
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

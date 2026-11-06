import { pool } from '../database.js'

class SaleRepository {
    async decrementStock(client, product_id, quantity, company_id) {
        const result = await client.query(
            `UPDATE products
             SET stock_quantity = stock_quantity - $1
             WHERE id = $2
               AND company_id = $3
               AND stock_quantity >= $1
             RETURNING sale_price, cost_price`,
            [quantity, product_id, company_id]
        );
        return result.rows[0] || null;
    }

    async createSale(company_id, collaborator_id, items) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // 1) para cada item: desconta o estoque
            //    se o resultado for null -> ???
            let total = 0
            const soldItems = [];
            for (const item of items) {
                const stockResult =  await this.decrementStock(client, item.product_id, item.quantity,company_id);
                if (stockResult === null) {
                    throw new Error('Estoque insuficiente ou produto não encontrado');
                }
                
                // 2) soma o total
                total += Number(stockResult.sale_price) * item.quantity;

                soldItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: stockResult.sale_price,
                    unit_cost: stockResult.cost_price
                })
            }
            // 3) insere a venda (INSERT ... RETURNING id)
            const saleResult = await client.query(
                `INSERT INTO sales (company_id, collaborator_id, total, status)
                 VALUES ($1, $2, $3, 'completed')
                 RETURNING id, created_at`,
                [company_id, collaborator_id,total]
            );
            const sale = saleResult.rows[0];

            // 4) insere cada item em sales_items
            for (const sold of soldItems) {
                await client.query(
                    `INSERT INTO sales_items (sale_id, product_id, quantity, unit_price, unit_cost)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [sale.id, sold.product_id, sold.quantity, sold.unit_price, sold.unit_cost]
                );
            }
    
            await client.query('COMMIT');
            return {
                id: sale.id,
                created_at: sale.created_at,
                total: total.toFixed(2),
                status: 'completed',
                // o custo nunca vai na resposta: o operador não deve ver
                items: soldItems.map(({ unit_cost, ...publicItem }) => publicItem)
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async listSales(company_id, limit = 100) {
        const result = await pool.query(
            `SELECT s.id,
                    s.created_at,
                    s.total,
                    s.status,
                    COALESCE(c.name, 'Empresa') AS operator_name,
                    COALESCE(SUM(si.quantity), 0)::int AS items_count
             FROM sales s
             LEFT JOIN collaborators c ON c.id = s.collaborator_id
             LEFT JOIN sales_items si ON si.sale_id = s.id
             WHERE s.company_id = $1
             GROUP BY s.id, c.name
             ORDER BY s.created_at DESC, s.id DESC
             LIMIT $2`,
            [company_id, limit]
        );
        return result.rows;
    }
}

export default new SaleRepository();

import { sql } from '../database.js';

class ExpenseRepository {
    async create(companyId, collaboratorId, { category, description, amount, incurred_on }) {
        const result = await sql`
            INSERT INTO expenses (company_id, category, description, amount, incurred_on, created_by)
            VALUES (${companyId}, ${category}, ${description ?? null}, ${amount}, ${incurred_on}, ${collaboratorId})
            RETURNING id, category, description, amount, incurred_on, created_at;
        `;
        return result[0];
    }

    async list(companyId, from, to) {
        return sql`
            SELECT id, category, description, amount, incurred_on, created_at
            FROM expenses
            WHERE company_id = ${companyId}
              AND incurred_on BETWEEN ${from}::date AND ${to}::date
            ORDER BY incurred_on DESC, id DESC;
        `;
    }

    async deleteById(id, companyId) {
        const result = await sql`
            DELETE FROM expenses WHERE id = ${id} AND company_id = ${companyId} RETURNING id;
        `;
        return result[0] || null;
    }

    async totalsByCategory(companyId, from, to) {
        return sql`
            SELECT category, COALESCE(SUM(amount), 0) AS total
            FROM expenses
            WHERE company_id = ${companyId}
              AND incurred_on BETWEEN ${from}::date AND ${to}::date
            GROUP BY category
            ORDER BY category;
        `;
    }

    // Vendas concluídas no período (fuso de São Paulo). Receita e custo congelado.
    async salesTotals(companyId, from, to) {
        const result = await sql`
            SELECT
                COUNT(DISTINCT s.id)::int AS sales_count,
                COALESCE(SUM(si.quantity * si.unit_price), 0) AS revenue,
                COALESCE(SUM(si.quantity * COALESCE(si.unit_cost, 0)), 0) AS cmv,
                COUNT(*) FILTER (WHERE si.unit_cost IS NULL)::int AS items_without_cost
            FROM sales s
            JOIN sales_items si ON si.sale_id = s.id
            WHERE s.company_id = ${companyId}
              AND s.status = 'completed'
              AND (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN ${from}::date AND ${to}::date;
        `;
        return result[0];
    }
}

export default new ExpenseRepository();

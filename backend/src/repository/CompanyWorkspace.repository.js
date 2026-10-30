import { sql } from '../database.js';

class CompanyWorkspaceRepository {
    async getOverview(companyId) {
        const rows = await sql`
            SELECT companies.id, companies.trade_name, companies.plan_code,
                   companies.plan_started_at, companies.plan_term_months,
                   companies.plan_started_at + (companies.plan_term_months * INTERVAL '1 month') AS plan_end_date,
                   COALESCE(inventory.product_count, 0)::integer AS product_count,
                   COALESCE(inventory.stock_units, 0)::numeric AS stock_units,
                   COALESCE(inventory.cost_value, 0)::numeric AS stock_cost_value,
                   COALESCE(inventory.sale_value, 0)::numeric AS stock_sale_value,
                   COALESCE(inventory.critical_count, 0)::integer AS critical_product_count,
                   COALESCE(inventory.minimum_coverage_percent, 0)::integer AS minimum_coverage_percent,
                   COALESCE(inventory.low_stock_products, '[]'::json) AS low_stock_products,
                   CASE WHEN COALESCE(inventory.product_count, 0) = 0 THEN 0
                        ELSE ROUND(100.0 * (inventory.product_count - inventory.critical_count) / inventory.product_count)::integer
                   END AS stock_health_percent,
                   COALESCE(team.active_count, 0)::integer AS active_collaborator_count,
                   COALESCE(team.total_count, 0)::integer AS collaborator_count
            FROM companies
            LEFT JOIN LATERAL (
                SELECT COUNT(*) AS product_count,
                       COALESCE(SUM(stock_quantity), 0) AS stock_units,
                       COALESCE(SUM(stock_quantity * cost_price), 0) AS cost_value,
                       COALESCE(SUM(stock_quantity * sale_price), 0) AS sale_value,
                       COUNT(*) FILTER (WHERE stock_quantity <= min_stock_quantity) AS critical_count,
                       CASE WHEN COALESCE(SUM(min_stock_quantity), 0) = 0 THEN 100
                            ELSE LEAST(100, ROUND(100.0 * SUM(stock_quantity) / SUM(min_stock_quantity)))
                       END AS minimum_coverage_percent,
                       COALESCE(
                           json_agg(json_build_object(
                               'id', id,
                               'name', name,
                               'sku', sku,
                               'stock_quantity', stock_quantity,
                               'min_stock_quantity', min_stock_quantity,
                               'sale_price', sale_price
                           ) ORDER BY stock_quantity ASC, name)
                           FILTER (WHERE stock_quantity <= min_stock_quantity), '[]'::json
                       ) AS low_stock_products
                FROM products WHERE company_id = companies.id
            ) inventory ON TRUE
            LEFT JOIN LATERAL (
                SELECT COUNT(*) FILTER (WHERE is_active) AS active_count, COUNT(*) AS total_count
                FROM collaborators WHERE company_id = companies.id
            ) team ON TRUE
            WHERE companies.id = ${companyId} AND companies.is_active = TRUE
            LIMIT 1;
        `;
        return rows[0] || null;
    }

    async listCollaborators(companyId) {
        return sql`
            SELECT id, name, email, cpf, is_admin, phone, hire_date,
                   termination_date, role, is_active, created_at
            FROM collaborators
            WHERE company_id = ${companyId}
            ORDER BY name;
        `;
    }

    async setCollaboratorActive(id, companyId, isActive) {
        return sql`
            UPDATE collaborators
            SET is_active = ${isActive}, updated_at = now()
            WHERE id = ${id} AND company_id = ${companyId}
            RETURNING id, name, is_active;
        `;
    }

    async getBilling(companyId) {
        const rows = await sql`
            SELECT companies.id, companies.trade_name, companies.plan_code,
                   companies.plan_started_at, companies.plan_term_months,
                   companies.plan_started_at + (companies.plan_term_months * INTERVAL '1 month') AS plan_end_date,
                   CASE WHEN companies.plan_started_at IS NULL THEN NULL
                        ELSE companies.plan_started_at + (
                            (EXTRACT(YEAR FROM age(CURRENT_DATE, companies.plan_started_at))::integer * 12
                             + EXTRACT(MONTH FROM age(CURRENT_DATE, companies.plan_started_at))::integer + 1)
                            * INTERVAL '1 month'
                        )
                   END AS next_due_date,
                   COUNT(collaborators.id) FILTER (WHERE collaborators.is_active)::integer AS active_collaborator_count,
                   1000::numeric AS setup_fee,
                   250::numeric AS monthly_base,
                   50::numeric AS collaborator_rate,
                   (250 + COUNT(collaborators.id) FILTER (WHERE collaborators.is_active) * 50)::numeric AS estimated_monthly_amount,
                   (1000 + (250 + COUNT(collaborators.id) FILTER (WHERE collaborators.is_active) * 50)
                       * COALESCE(companies.plan_term_months, 0))::numeric AS estimated_contract_total
            FROM companies
            LEFT JOIN collaborators ON collaborators.company_id = companies.id
            WHERE companies.id = ${companyId} AND companies.is_active = TRUE
            GROUP BY companies.id
            LIMIT 1;
        `;
        return rows[0] || null;
    }
}

export default new CompanyWorkspaceRepository();
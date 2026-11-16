import { sql } from '../database.js';

class AdminRepository {
    async listCompanies() {
        return sql`
            SELECT companies.id, companies.trade_name, companies.legal_name, companies.email,
                   companies.cnpj, companies.phone, companies.segment, companies.is_active,
                     companies.created_at, companies.approved_at, companies.plan_code, companies.plan_started_at,
                     companies.plan_term_months,
                     companies.plan_started_at + (companies.plan_term_months * INTERVAL '1 month') AS plan_end_date,
                     COUNT(collaborators.id)::integer AS collaborator_count,
                     COUNT(collaborators.id) FILTER (WHERE collaborators.is_active)::integer AS active_collaborator_count,
                   COALESCE(
                       json_agg(json_build_object(
                           'id', collaborators.id,
                           'name', collaborators.name,
                           'email', collaborators.email,
                           'role', collaborators.role,
                           'is_admin', collaborators.is_admin,
                           'is_active', collaborators.is_active
                       ) ORDER BY collaborators.name)
                       FILTER (WHERE collaborators.id IS NOT NULL), '[]'::json
                   ) AS collaborators
            FROM companies
            LEFT JOIN collaborators ON collaborators.company_id = companies.id
            GROUP BY companies.id
            ORDER BY companies.trade_name;
        `;
    }

    async setCompanyActive(id, isActive) {
        return sql`
            WITH updated_company AS (
                UPDATE companies
                SET is_active = ${isActive},
                    approved_at = CASE
                        WHEN ${isActive} THEN COALESCE(approved_at, now())
                        ELSE approved_at
                    END,
                    updated_at = now()
                WHERE id = ${id}
                RETURNING id, trade_name, is_active, approved_at
            ), handled_registration AS (
                UPDATE contact_requests
                SET handled = TRUE
                WHERE source = 'company_registration'
                  AND company_id = (SELECT id FROM updated_company)
                  AND ${isActive}
                RETURNING id
            )
            SELECT * FROM updated_company;
        `;
    }

    async setCollaboratorActive(id, isActive) {
        return sql`
            UPDATE collaborators SET is_active = ${isActive}, updated_at = now()
            WHERE id = ${id}
            RETURNING id, name, email, company_id, is_active;
        `;
    }

    async assignPlan(id, termMonths) {
        return sql`
            UPDATE companies
            SET plan_code = 'sgpr_management',
                plan_started_at = CURRENT_DATE,
                plan_term_months = ${termMonths},
                updated_at = now()
            WHERE id = ${id}
            RETURNING id, plan_code, plan_started_at, plan_term_months,
                      plan_started_at + (plan_term_months * INTERVAL '1 month') AS plan_end_date;
        `;
    }
}

export default new AdminRepository();
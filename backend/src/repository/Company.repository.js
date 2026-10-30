import { sql } from '../database.js';

class CompanyRepository {
    async create(company, passwordHash) {
        const rows = await sql`
            WITH new_company AS (
                INSERT INTO companies (trade_name, legal_name, email, cnpj, phone, segment, is_active)
                VALUES (
                    ${company.trade_name}, ${company.legal_name}, ${company.email},
                    ${company.cnpj}, ${company.phone}, ${company.segment}, TRUE
                )
                RETURNING id, trade_name, email
            ), new_credentials AS (
                INSERT INTO company_credentials (company_id, password_hash)
                SELECT id, ${passwordHash} FROM new_company
                RETURNING company_id
            )
            SELECT new_company.id, new_company.trade_name, new_company.email
            FROM new_company
            JOIN new_credentials ON new_credentials.company_id = new_company.id;
        `;
        return rows[0];
    }

    async findCredentialsByEmail(email) {
        const rows = await sql`
            SELECT companies.id, companies.trade_name, companies.email,
                     company_credentials.password_hash, companies.is_active
            FROM companies
            JOIN company_credentials ON company_credentials.company_id = companies.id
            WHERE companies.email = ${email}
            LIMIT 1;
        `;
        return rows[0] || null;
    }

    async findActiveById(id) {
        const rows = await sql`SELECT id FROM companies WHERE id = ${id} AND is_active = TRUE LIMIT 1`;
        return rows[0] || null;
    }
}

export default new CompanyRepository();
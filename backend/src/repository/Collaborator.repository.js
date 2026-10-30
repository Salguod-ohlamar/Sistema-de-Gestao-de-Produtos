import { sql } from '../database.js';

class CollaboratorRepository {
    async create(collaborator, companyId) {
        const rows = await sql`
            INSERT INTO collaborators (
                name, email, cpf, password_hash, is_admin, phone,
                hire_date, termination_date, role, company_id, is_active
            ) VALUES (
                ${collaborator.name}, ${collaborator.email}, ${collaborator.cpf},
                ${collaborator.passwordHash}, ${collaborator.is_admin}, ${collaborator.phone},
                ${collaborator.hire_date}, ${collaborator.termination_date},
                ${collaborator.role}, ${companyId}, TRUE
            )
            RETURNING id, name, email, cpf, is_admin, phone, hire_date,
                      termination_date, role, company_id, is_active;
        `;
        return rows[0];
    }
}

export default new CollaboratorRepository();
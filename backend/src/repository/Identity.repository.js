import { sql } from '../database.js';

class IdentityRepository {
    async findRootByEmail(email) {
        const rows = await sql`
            SELECT id, email, password_hash, is_active
            FROM system_admins WHERE email = ${email} LIMIT 1
        `;
        return rows[0] || null;
    }

    async findCollaboratorByEmail(email) {
        const rows = await sql`
            SELECT collaborators.id, collaborators.name, collaborators.email,
                   collaborators.company_id, collaborators.password_hash,
                   collaborators.is_active, collaborators.is_admin,
                   collaborators.role, companies.is_active AS company_is_active
            FROM collaborators
            JOIN companies ON companies.id = collaborators.company_id
            WHERE collaborators.email = ${email}
            LIMIT 1
        `;
        return rows[0] || null;
    }
}

export default new IdentityRepository();
import { sql } from '../database.js';
import { authenticateCompany } from '../auth.js';

export async function requireCompanyAccess(request, reply) {
    await authenticateCompany(request, reply);
    if (reply.sent) return;

    if (!['company', 'collaborator'].includes(request.auth.type)) {
        return reply.code(403).send({ error: 'Acesso restrito a uma empresa.' });
    }

    const company = await sql`
        SELECT id FROM companies WHERE id = ${request.companyId} AND is_active = TRUE LIMIT 1
    `;
    if (!company.length) return reply.code(403).send({ error: 'Empresa inativa ou não encontrada.' });

    if (request.auth.type === 'collaborator') {
        const collaborator = await sql`
            SELECT id FROM collaborators
            WHERE id = ${request.auth.id} AND company_id = ${request.companyId} AND is_active = TRUE
            LIMIT 1
        `;
        if (!collaborator.length) return reply.code(403).send({ error: 'Colaborador inativo ou não encontrado.' });
    }
}

export async function requireRootAccess(request, reply) {
    await authenticateCompany(request, reply);
    if (reply.sent) return;

    if (request.auth.type !== 'root') {
        return reply.code(403).send({ error: 'Acesso restrito ao administrador do sistema.' });
    }

    const admin = await sql`
        SELECT id FROM system_admins WHERE id = ${request.auth.id} AND is_active = TRUE LIMIT 1
    `;
    if (!admin.length) return reply.code(403).send({ error: 'Administrador inativo ou não encontrado.' });
}

export async function requireCompanyManager(request, reply) {
    await requireCompanyAccess(request, reply);
    if (reply.sent) return;

    const canManageTeam = request.auth.type === 'company' ||
        request.auth.isAdmin || request.auth.role === 'administrator';
    if (!canManageTeam) {
        return reply.code(403).send({ error: 'Somente administradores podem gerenciar a equipe.' });
    }
}
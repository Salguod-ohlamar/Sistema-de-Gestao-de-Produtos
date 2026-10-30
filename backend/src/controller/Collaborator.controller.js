import { hashPassword } from '../auth.js';
import CollaboratorRepository from '../repository/Collaborator.repository.js';

const allowedRoles = new Set(['administrator', 'manager', 'operator']);

async function createCollaborator(request, reply) {
    const body = request.body || {};
    const collaborator = {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        cpf: String(body.cpf || '').replace(/\D/g, ''),
        phone: String(body.phone || '').replace(/\D/g, '') || null,
        hire_date: String(body.hire_date || ''),
        termination_date: body.termination_date || null,
        role: String(body.role || ''),
        is_admin: Boolean(body.is_admin),
        password: String(body.password || '')
    };

    if (!collaborator.name || !collaborator.email || collaborator.cpf.length !== 11 ||
        !collaborator.hire_date || !allowedRoles.has(collaborator.role) ||
        collaborator.password.length < 8 ||
        (collaborator.phone && ![10, 11].includes(collaborator.phone.length))) {
        return reply.code(400).send({ error: 'Confira os dados, o CPF, a função e a senha (mínimo 8 caracteres).' });
    }

    try {
        collaborator.passwordHash = await hashPassword(collaborator.password);
        const created = await CollaboratorRepository.create(collaborator, request.companyId);
        return reply.code(201).send(created);
    } catch (error) {
        if (error.code === '23505') return reply.code(409).send({ error: 'E-mail ou CPF já cadastrado.' });
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível cadastrar o colaborador.' });
    }
}

export { createCollaborator };
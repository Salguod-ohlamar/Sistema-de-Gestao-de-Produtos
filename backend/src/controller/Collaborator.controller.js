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

async function updateCollaborator(request, reply) {
    const id = Number(request.params.id);
    const body = request.body || {};
    const data = {
        name: String(body.name || '').trim(),
        role: String(body.role || ''),
        phone: String(body.phone || '').replace(/\D/g, '') || null
    };
    if (!Number.isInteger(id) || id <= 0 || !data.name || !allowedRoles.has(data.role) ||
        (data.phone && ![10, 11].includes(data.phone.length))) {
        return reply.code(400).send({ error: 'Confira o nome, a função e o telefone.' });
    }
    // evita o administrador remover o próprio acesso de gestão sem querer
    if (request.auth.type === 'collaborator' && request.auth.id === id && data.role !== 'administrator') {
        return reply.code(409).send({ error: 'Você não pode rebaixar a sua própria função.' });
    }
    try {
        const rows = await CollaboratorRepository.update(id, request.companyId, data);
        if (!rows.length) return reply.code(404).send({ error: 'Colaborador não encontrado nesta empresa.' });
        return reply.send(rows[0]);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível atualizar o colaborador.' });
    }
}

export { createCollaborator, updateCollaborator };
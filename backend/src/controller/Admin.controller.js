import AdminRepository from '../repository/Admin.repository.js';

async function listCompanies(request, reply) {
    try {
        return reply.send(await AdminRepository.listCompanies());
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível carregar as empresas.' });
    }
}

async function setCompanyActive(request, reply) {
    if (typeof request.body?.is_active !== 'boolean') {
        return reply.code(400).send({ error: 'is_active precisa ser true ou false.' });
    }
    try {
        const rows = await AdminRepository.setCompanyActive(request.params.id, request.body.is_active);
        if (!rows.length) return reply.code(404).send({ error: 'Empresa não encontrada.' });
        return reply.send(rows[0]);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível atualizar a empresa.' });
    }
}

async function setCollaboratorActive(request, reply) {
    if (typeof request.body?.is_active !== 'boolean') {
        return reply.code(400).send({ error: 'is_active precisa ser true ou false.' });
    }
    try {
        const rows = await AdminRepository.setCollaboratorActive(request.params.id, request.body.is_active);
        if (!rows.length) return reply.code(404).send({ error: 'Colaborador não encontrado.' });
        return reply.send(rows[0]);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível atualizar o colaborador.' });
    }
}

async function assignCompanyPlan(request, reply) {
    const termMonths = Number(request.body?.term_months);
    if (!Number.isInteger(termMonths) || termMonths < 1 || termMonths > 120) {
        return reply.code(400).send({ error: 'O prazo deve ser informado em meses, entre 1 e 120.' });
    }

    try {
        const rows = await AdminRepository.assignPlan(request.params.id, termMonths);
        if (!rows.length) return reply.code(404).send({ error: 'Empresa não encontrada.' });
        return reply.send(rows[0]);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível atribuir o plano.' });
    }
}

export { assignCompanyPlan, listCompanies, setCompanyActive, setCollaboratorActive };
import CompanyWorkspaceRepository from '../repository/CompanyWorkspace.repository.js';

// Busca ou obtém get company overview e entrega o resultado ao chamador.
async function getCompanyOverview(request, reply) {
    try {
        const overview = await CompanyWorkspaceRepository.getOverview(request.companyId);
        if (!overview) return reply.code(404).send({ error: 'Empresa não encontrada ou inativa.' });
        return reply.send(overview);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível carregar o painel da empresa.' });
    }
}

// Busca ou obtém list company collaborators e entrega o resultado ao chamador.
async function listCompanyCollaborators(request, reply) {
    try {
        return reply.send(await CompanyWorkspaceRepository.listCollaborators(request.companyId));
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível carregar os colaboradores.' });
    }
}

// Atualiza ou altera set company collaborator active, aplicando os dados recebidos.
async function setCompanyCollaboratorActive(request, reply) {
    if (typeof request.body?.is_active !== 'boolean') {
        return reply.code(400).send({ error: 'is_active precisa ser true ou false.' });
    }
    try {
        const rows = await CompanyWorkspaceRepository.setCollaboratorActive(
            request.params.id,
            request.companyId,
            request.body.is_active
        );
        if (!rows.length) return reply.code(404).send({ error: 'Colaborador não encontrado nesta empresa.' });
        return reply.send(rows[0]);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível atualizar o acesso do colaborador.' });
    }
}

// Busca ou obtém get company billing e entrega o resultado ao chamador.
async function getCompanyBilling(request, reply) {
    try {
        const billing = await CompanyWorkspaceRepository.getBilling(request.companyId);
        if (!billing) return reply.code(404).send({ error: 'Empresa não encontrada ou inativa.' });
        return reply.send(billing);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível carregar o financeiro da empresa.' });
    }
}

export { getCompanyBilling, getCompanyOverview, listCompanyCollaborators, setCompanyCollaboratorActive };
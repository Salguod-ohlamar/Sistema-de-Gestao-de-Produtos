import {
    getCompanyBilling,
    getCompanyOverview,
    listCompanyCollaborators,
    setCompanyCollaboratorActive
} from '../controller/CompanyWorkspace.controller.js';
import { requireCompanyAccess, requireCompanyManager } from '../middleware/authorization.js';

// Implementa a operação relacionada a company workspace routes.
async function companyWorkspaceRoutes(fastify) {
    fastify.get('/empresa/dashboard', { preHandler: requireCompanyAccess }, getCompanyOverview);
    fastify.get('/empresa/colaboradores', { preHandler: requireCompanyAccess }, listCompanyCollaborators);
    fastify.patch('/empresa/colaboradores/:id/ativo', { preHandler: requireCompanyManager }, setCompanyCollaboratorActive);
    fastify.get('/empresa/financeiro', { preHandler: requireCompanyAccess }, getCompanyBilling);
}

export default companyWorkspaceRoutes;
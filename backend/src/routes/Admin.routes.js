import { assignCompanyPlan, listCompanies, setCollaboratorActive, setCompanyActive } from '../controller/Admin.controller.js';
import { requireRootAccess } from '../middleware/authorization.js';

async function adminRoutes(fastify) {
    fastify.addHook('preHandler', requireRootAccess);
    fastify.get('/admin/companies', listCompanies);
    fastify.patch('/admin/companies/:id/plan', assignCompanyPlan);
    fastify.patch('/admin/companies/:id/active', setCompanyActive);
    fastify.patch('/admin/collaborators/:id/active', setCollaboratorActive);
}

export default adminRoutes;
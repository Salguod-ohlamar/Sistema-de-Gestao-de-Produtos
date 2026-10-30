import { createCollaborator } from '../controller/Collaborator.controller.js';
import { requireCompanyAccess } from '../middleware/authorization.js';

async function collaboratorRoutes(fastify) {
    fastify.addHook('preHandler', async (request, reply) => {
        await requireCompanyAccess(request, reply);
        if (reply.sent) return;
        const canManageTeam = request.auth.type === 'company' ||
            request.auth.isAdmin || request.auth.role === 'administrator';
        if (!canManageTeam) return reply.code(403).send({ error: 'Somente administradores podem cadastrar colaboradores.' });
    });
    fastify.post('/colaboradores', createCollaborator);
}

export default collaboratorRoutes;
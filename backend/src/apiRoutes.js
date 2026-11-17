import adminRoutes from './routes/Admin.routes.js';
import collaboratorRoutes from './routes/Collaborator.routes.js';
import companyRoutes from './routes/Company.routes.js';
import companyWorkspaceRoutes from './routes/CompanyWorkspace.routes.js';
import contactRoutes from './routes/Contact.routes.js';
import financeRoutes from './routes/Finance.routes.js';
import productsRoutes from './routes/RegisterProduct.routes.js';
import saleRoutes from './routes/Sale.routes.js';

export const API_PREFIX = '/api';

export async function registerApiRoutes(fastify) {
    await fastify.register(companyRoutes, { prefix: API_PREFIX });
    await fastify.register(adminRoutes, { prefix: API_PREFIX });
    await fastify.register(collaboratorRoutes, { prefix: API_PREFIX });
    await fastify.register(companyWorkspaceRoutes, { prefix: API_PREFIX });
    await fastify.register(productsRoutes, { prefix: API_PREFIX });
    await fastify.register(saleRoutes, { prefix: API_PREFIX });
    await fastify.register(financeRoutes, { prefix: API_PREFIX });
    await fastify.register(contactRoutes, { prefix: API_PREFIX });
}

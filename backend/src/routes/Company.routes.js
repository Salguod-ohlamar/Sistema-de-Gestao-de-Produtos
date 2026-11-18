import { loginCompany, registerCompany } from '../controller/Company.controller.js';
import { requestPasswordReset, resetPassword } from '../controller/PasswordRecovery.controller.js';

// Implementa a operação relacionada a company routes.
async function companyRoutes(fastify) {
    fastify.post('/empresas', registerCompany);
    fastify.post('/auth/login', loginCompany);
    fastify.post('/auth/forgot-password', requestPasswordReset);
    fastify.post('/auth/reset-password', resetPassword);
}

export default companyRoutes;
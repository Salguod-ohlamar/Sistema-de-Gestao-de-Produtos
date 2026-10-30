import { loginCompany, registerCompany } from '../controller/Company.controller.js';

async function companyRoutes(fastify) {
    fastify.post('/empresas', registerCompany);
    fastify.post('/auth/login', loginCompany);
}

export default companyRoutes;
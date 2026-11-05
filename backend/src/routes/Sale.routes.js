import { createSaleController, listSalesController } from '../controller/Sale.controller.js';       
import { requireCompanyAccess } from '../middleware/authorization.js';

async function saleRouters(fastify, options) {
    fastify.addHook('preHandler', requireCompanyAccess);
    fastify.post('/vendas', createSaleController);
    fastify.get('/vendas', listSalesController);
}

export default saleRouters;
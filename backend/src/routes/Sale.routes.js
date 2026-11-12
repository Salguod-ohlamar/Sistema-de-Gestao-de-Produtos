import { createSaleController, getSaleController, listSalesController } from '../controller/Sale.controller.js';       
import { requireCompanyAccess } from '../middleware/authorization.js';

async function saleRouters(fastify, options) {
    fastify.addHook('preHandler', requireCompanyAccess);
    fastify.post('/vendas', createSaleController);
    fastify.get('/vendas', listSalesController);
    fastify.get('/vendas/:id', getSaleController);
}

export default saleRouters;
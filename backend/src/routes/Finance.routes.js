import {
    createExpenseController,
    deleteExpenseController,
    getDreController,
    listExpensesController,
} from '../controller/Finance.controller.js';
import { getDashboardController } from '../controller/Dashboard.controller.js';
import { requireFinanceAccess } from '../middleware/authorization.js';

async function financeRouters(fastify) {
    fastify.addHook('preHandler', requireFinanceAccess);
    fastify.get('/dre', getDreController);
    fastify.get('/dashboard', getDashboardController);
    fastify.post('/despesas', createExpenseController);
    fastify.get('/despesas', listExpensesController);
    fastify.delete('/despesas/:id', deleteExpenseController);
}

export default financeRouters;

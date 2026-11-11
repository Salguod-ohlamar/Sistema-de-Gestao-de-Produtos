import dashboardRepository from '../repository/Dashboard.repository.js';
import expenseRepository from '../repository/Expense.repository.js';
import { parseRange } from '../dre.js';

async function getDashboardController(req, reply) {
    const query = req.query ?? {};
    const range = parseRange(query);
    if (range.error) return reply.status(400).send({ error: range.error });

    const limit = query.limit === undefined ? 5 : Number(query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
        return reply.status(400).send({ error: 'O limite deve ser um número inteiro de 1 a 20.' });
    }

    try {
        const [totals, top, stagnant, lowStock, lowStockCount] = await Promise.all([
            expenseRepository.salesTotals(req.companyId, range.from, range.to),
            dashboardRepository.topProducts(req.companyId, range.from, range.to, limit),
            dashboardRepository.stagnantProducts(req.companyId, range.from, range.to, limit),
            dashboardRepository.lowStock(req.companyId, 50),
            dashboardRepository.lowStockCount(req.companyId),
        ]);

        const revenueCents = Math.round(Number(totals.revenue) * 100);
        const salesCount = totals.sales_count;
        return reply.send({
            period: range,
            summary: {
                sales_count: salesCount,
                revenue: (revenueCents / 100).toFixed(2),
                average_ticket: salesCount ? (revenueCents / salesCount / 100).toFixed(2) : '0.00',
                low_stock_count: lowStockCount,
            },
            top_products: top,
            stagnant_products: stagnant,
            low_stock: lowStock,
        });
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível carregar o dashboard.' });
    }
}

export { getDashboardController };

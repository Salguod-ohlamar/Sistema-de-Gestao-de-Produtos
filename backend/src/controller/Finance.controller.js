import expenseRepository from '../repository/Expense.repository.js';
import { EXPENSE_CATEGORIES, buildDre, isValidDate } from '../dre.js';

// Período padrão: mês atual (fuso de São Paulo)
function currentMonthRange() {
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const last = new Date(y, today.getMonth() + 1, 0).getDate();
    return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(last).padStart(2, '0')}` };
}

function parseRange(query) {
    const def = currentMonthRange();
    const from = query.from ?? def.from;
    const to = query.to ?? def.to;
    if (!isValidDate(from) || !isValidDate(to)) return { error: 'Datas devem estar no formato AAAA-MM-DD.' };
    if (from > to) return { error: 'A data inicial não pode ser maior que a final.' };
    return { from, to };
}

async function createExpenseController(req, reply) {
    const { category, description, amount, incurred_on } = req.body ?? {};
    if (!EXPENSE_CATEGORIES.includes(category)) {
        return reply.status(400).send({ error: `Categoria inválida. Use: ${EXPENSE_CATEGORIES.join(', ')}.` });
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || value > 99999999.99) {
        return reply.status(400).send({ error: 'O valor da despesa deve ser maior que zero.' });
    }
    if (!isValidDate(incurred_on)) {
        return reply.status(400).send({ error: 'A data da despesa deve estar no formato AAAA-MM-DD.' });
    }
    if (description != null && String(description).length > 255) {
        return reply.status(400).send({ error: 'A descrição pode ter no máximo 255 caracteres.' });
    }
    const collaboratorId = req.auth.type === 'collaborator' ? req.auth.id : null;
    try {
        const expense = await expenseRepository.create(req.companyId, collaboratorId, {
            category, description, amount: value.toFixed(2), incurred_on,
        });
        return reply.status(201).send(expense);
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível registrar a despesa.' });
    }
}

async function listExpensesController(req, reply) {
    const range = parseRange(req.query ?? {});
    if (range.error) return reply.status(400).send({ error: range.error });
    try {
        return reply.send(await expenseRepository.list(req.companyId, range.from, range.to));
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível carregar as despesas.' });
    }
}

async function deleteExpenseController(req, reply) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return reply.status(400).send({ error: 'Id inválido.' });
    try {
        const deleted = await expenseRepository.deleteById(id, req.companyId);
        if (!deleted) return reply.status(404).send({ error: 'Despesa não encontrada.' });
        return reply.status(204).send();
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível excluir a despesa.' });
    }
}

async function getDreController(req, reply) {
    const query = req.query ?? {};
    const range = parseRange(query);
    if (range.error) return reply.status(400).send({ error: range.error });

    const taxRate = query.tax_rate === undefined ? 0 : Number(query.tax_rate);
    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
        return reply.status(400).send({ error: 'A alíquota deve estar entre 0 e 100.' });
    }

    try {
        const [sales, expenses] = await Promise.all([
            expenseRepository.salesTotals(req.companyId, range.from, range.to),
            expenseRepository.totalsByCategory(req.companyId, range.from, range.to),
        ]);
        const dre = buildDre({ revenue: sales.revenue, cmv: sales.cmv, expenses, taxRate });
        const warnings = [];
        if (sales.items_without_cost > 0) {
            warnings.push(`${sales.items_without_cost} item(ns) vendido(s) sem custo registrado: o custo foi considerado zero.`);
        }
        return reply.send({
            period: range,
            tax_rate: taxRate,
            sales_count: sales.sales_count,
            ...dre,
            warnings,
        });
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível calcular o DRE.' });
    }
}

export { createExpenseController, listExpensesController, deleteExpenseController, getDreController };

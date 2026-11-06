// Cálculo do DRE em centavos (inteiros) para evitar erro de ponto flutuante.

export const EXPENSE_CATEGORIES = ['rent', 'utilities', 'payroll', 'marketing', 'other'];

export const toCents = (value) => Math.round(Number(value || 0) * 100);
export const fromCents = (cents) => (cents / 100).toFixed(2);

/**
 * @param {object} p
 * @param {number|string} p.revenue   soma de quantidade * preço de venda
 * @param {number|string} p.cmv       soma de quantidade * custo congelado
 * @param {{category:string,total:number|string}[]} p.expenses
 * @param {number} p.taxRate          percentual informado pelo usuário (0 a 100)
 */
export function buildDre({ revenue, cmv, expenses, taxRate }) {
    const grossRevenue = toCents(revenue);
    const taxes = Math.round((grossRevenue * taxRate) / 100);
    const netRevenue = grossRevenue - taxes;
    const cost = toCents(cmv);
    const grossProfit = netRevenue - cost;
    const expensesByCategory = expenses.map((e) => ({ category: e.category, total: toCents(e.total) }));
    const expensesTotal = expensesByCategory.reduce((sum, e) => sum + e.total, 0);
    const netResult = grossProfit - expensesTotal;

    return {
        gross_revenue: fromCents(grossRevenue),
        taxes: fromCents(taxes),
        net_revenue: fromCents(netRevenue),
        cmv: fromCents(cost),
        gross_profit: fromCents(grossProfit),
        gross_margin_pct: netRevenue > 0 ? Number(((grossProfit / netRevenue) * 100).toFixed(1)) : null,
        expenses: expensesByCategory.map((e) => ({ category: e.category, total: fromCents(e.total) })),
        expenses_total: fromCents(expensesTotal),
        net_result: fromCents(netResult),
    };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(value) {
    if (!DATE_RE.test(value)) return false;
    const d = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Período padrão: mês atual (fuso de São Paulo)
export function currentMonthRange(now = new Date()) {
    const sp = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const y = sp.getFullYear();
    const m = String(sp.getMonth() + 1).padStart(2, '0');
    const last = new Date(y, sp.getMonth() + 1, 0).getDate();
    return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(last).padStart(2, '0')}` };
}

export function parseRange(query) {
    const def = currentMonthRange();
    const from = query.from ?? def.from;
    const to = query.to ?? def.to;
    if (!isValidDate(from) || !isValidDate(to)) return { error: 'Datas devem estar no formato AAAA-MM-DD.' };
    if (from > to) return { error: 'A data inicial não pode ser maior que a final.' };
    return { from, to };
}

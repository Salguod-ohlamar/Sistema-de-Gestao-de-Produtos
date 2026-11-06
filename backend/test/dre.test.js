import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDre, isValidDate } from '../src/dre.js';

test('DRE: receita, imposto, CMV, despesas e resultado', () => {
    const dre = buildDre({
        revenue: '1000.00',
        cmv: '400.00',
        expenses: [{ category: 'rent', total: '150.00' }, { category: 'payroll', total: '100.50' }],
        taxRate: 6,
    });
    assert.equal(dre.gross_revenue, '1000.00');
    assert.equal(dre.taxes, '60.00');
    assert.equal(dre.net_revenue, '940.00');
    assert.equal(dre.gross_profit, '540.00');
    assert.equal(dre.expenses_total, '250.50');
    assert.equal(dre.net_result, '289.50');
    assert.equal(dre.gross_margin_pct, 57.4);
});

test('DRE: sem vendas não divide por zero e permite resultado negativo', () => {
    const dre = buildDre({ revenue: 0, cmv: 0, expenses: [{ category: 'other', total: '10.00' }], taxRate: 0 });
    assert.equal(dre.gross_margin_pct, null);
    assert.equal(dre.net_result, '-10.00');
});

test('datas: aceita só AAAA-MM-DD reais', () => {
    assert.equal(isValidDate('2026-11-06'), true);
    assert.equal(isValidDate('2026-02-30'), false);
    assert.equal(isValidDate('06/11/2026'), false);
});

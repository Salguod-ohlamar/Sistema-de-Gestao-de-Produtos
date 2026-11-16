import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeCpf } from '../src/cpf.js';
import { createRateLimiter } from '../src/rateLimit.js';

test('CPF: aceita válido com ou sem máscara, rejeita inválidos', () => {
    assert.equal(normalizeCpf('529.982.247-25'), '52998224725');
    assert.equal(normalizeCpf('52998224725'), '52998224725');
    assert.equal(normalizeCpf('529.982.247-24'), null);
    assert.equal(normalizeCpf('111.111.111-11'), null);
    assert.equal(normalizeCpf('123'), null);
    assert.equal(normalizeCpf(''), null);
});

test('limitador: bloqueia após o máximo e libera depois da janela', () => {
    const allow = createRateLimiter({ max: 2, windowMs: 1000 });
    assert.equal(allow('a', 0), true);
    assert.equal(allow('a', 10), true);
    assert.equal(allow('a', 20), false);
    assert.equal(allow('b', 20), true);
    assert.equal(allow('a', 2000), true);
});

test('contato: valida e normaliza os campos', async () => {
    process.env.DATABASE_URL ||= 'postgres://u:p@localhost/db';
    const { parseContact } = await import('../src/controller/Contact.controller.js');
    const ok = parseContact({ name: ' Ana ', phone: '(11) 91234-5678', email: 'ANA@x.com', company_name: 'Loja' });
    assert.deepEqual(ok, { name: 'Ana', phone: '11912345678', email: 'ana@x.com', company_name: 'Loja' });
    assert.equal(parseContact({ name: 'Ana', phone: '123', email: 'ana@x.com', company_name: 'Loja' }), null);
    assert.equal(parseContact({ name: 'Ana', phone: '11912345678', email: 'sem-arroba', company_name: 'Loja' }), null);
});

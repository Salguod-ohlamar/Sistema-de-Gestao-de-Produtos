import test from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
const { registerApiRoutes } = await import('../src/apiRoutes.js');

test('all API plugins are mounted below /api and not at the root', async (t) => {
    const fastify = Fastify();
    t.after(() => fastify.close());

    await registerApiRoutes(fastify);
    await fastify.ready();

    assert.equal(fastify.hasRoute({ method: 'POST', url: '/api/auth/login' }), true);
    assert.equal(fastify.hasRoute({ method: 'GET', url: '/api/produtos' }), true);
    assert.equal(fastify.hasRoute({ method: 'GET', url: '/api/admin/companies' }), true);
    assert.equal(fastify.hasRoute({ method: 'POST', url: '/auth/login' }), false);
    assert.equal(fastify.hasRoute({ method: 'GET', url: '/produtos' }), false);
});

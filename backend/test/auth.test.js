import assert from 'node:assert/strict';
import test from 'node:test';
import { authenticateCompany, createAccessToken, hashPassword, verifyPassword } from '../src/auth.js';

process.env.AUTH_TOKEN_SECRET = 'test-secret-with-more-than-thirty-two-characters';

function createReply() {
    return {
        statusCode: 200,
        body: null,
        code(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
        send(body) {
            this.body = body;
            return this;
        }
    };
}

test('hashPassword valida a senha sem armazenar o texto original', async () => {
    const password = 'senha-segura-123';
    const passwordHash = await hashPassword(password);

    assert.notEqual(passwordHash, password);
    assert.equal(await verifyPassword(password, passwordHash), true);
    assert.equal(await verifyPassword('senha-incorreta', passwordHash), false);
});

test('authenticateCompany define a empresa contida em um token válido', async () => {
    const token = createAccessToken({ id: 27 });
    const request = { headers: { authorization: `Bearer ${token}` } };
    const reply = createReply();

    await authenticateCompany(request, reply);

    assert.equal(request.companyId, 27);
    assert.equal(reply.statusCode, 200);
});

test('authenticateCompany rejeita token adulterado', async () => {
    const token = createAccessToken({ id: 27 });
    const request = { headers: { authorization: `Bearer ${token}x` } };
    const reply = createReply();

    await authenticateCompany(request, reply);

    assert.equal(reply.statusCode, 401);
});
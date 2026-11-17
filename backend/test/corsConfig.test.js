import test from 'node:test';
import assert from 'node:assert/strict';
import { createCorsOriginChecker, getCorsOrigins } from '../src/corsConfig.js';

test('CORS usa somente as origens locais conhecidas fora de produção quando não configurado', () => {
    assert.deepEqual(getCorsOrigins({ environment: 'development', configuredOrigins: '' }), [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ]);
});

test('CORS exige uma allowlist em produção', () => {
    assert.throws(
        () => getCorsOrigins({ environment: 'production', configuredOrigins: '' }),
        /CORS_ORIGINS/
    );
});

test('CORS valida origens HTTPS e remove duplicadas', () => {
    assert.deepEqual(
        getCorsOrigins({
            environment: 'production',
            configuredOrigins: 'https://app.example.com, https://app.example.com'
        }),
        ['https://app.example.com']
    );
});

test('CORS rejeita caminhos e HTTP em produção', () => {
    assert.throws(
        () => getCorsOrigins({
            environment: 'production',
            configuredOrigins: 'https://app.example.com/path'
        }),
        /apenas a origem/
    );
    assert.throws(
        () => getCorsOrigins({
            environment: 'production',
            configuredOrigins: 'http://app.example.com'
        }),
        /HTTPS/
    );
});

test('CORS só autoriza a origem configurada e aceita chamadas sem Origin', () => {
    const checkOrigin = createCorsOriginChecker(['https://app.example.com']);
    const check = (origin) => new Promise((resolve, reject) => {
        checkOrigin(origin, (error, allowed) => error ? reject(error) : resolve(allowed));
    });

    return Promise.all([
        check('https://app.example.com').then((allowed) => assert.equal(allowed, true)),
        check('https://other.example.com').then((allowed) => assert.equal(allowed, false)),
        check(undefined).then((allowed) => assert.equal(allowed, true))
    ]);
});

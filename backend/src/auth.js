import { createHmac, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import bcrypt from 'bcryptjs';

const scrypt = promisify(scryptCallback);
const TOKEN_DURATION_SECONDS = 60 * 60 * 8;

function getTokenSecret() {
    return process.env.AUTH_TOKEN_SECRET;
}

export async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, storedHash) {
    if (String(storedHash).startsWith('$2')) return bcrypt.compare(password, storedHash);

    const [algorithm, saltHex, keyHex] = String(storedHash).split('$');
    if (algorithm !== 'scrypt' || !saltHex || !keyHex) return false;

    const expectedKey = Buffer.from(keyHex, 'hex');
    const actualKey = await scrypt(password, Buffer.from(saltHex, 'hex'), expectedKey.length);
    return actualKey.length === expectedKey.length && timingSafeEqual(actualKey, expectedKey);
}

export function createAccessToken(principal) {
    const type = principal.type || 'company';
    const payload = Buffer.from(JSON.stringify({
        type,
        id: principal.id,
        companyId: type === 'company' ? principal.id : principal.companyId ?? null,
        role: principal.role || null,
        isAdmin: Boolean(principal.isAdmin),
        exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECONDS
    })).toString('base64url');
    const signature = createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
    return `${payload}.${signature}`;
}

export async function authenticateCompany(request, reply) {
    const authorization = request.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return reply.code(401).send({ error: 'Autenticação necessária.' });
    }

    try {
        const [payload, receivedSignature] = token.split('.');
        if (!payload || !receivedSignature) throw new Error('Token inválido');

        const expectedSignature = createHmac('sha256', getTokenSecret()).update(payload).digest();
        const actualSignature = Buffer.from(receivedSignature, 'base64url');
        if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) {
            throw new Error('Assinatura inválida');
        }

        const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        const validCompanyPrincipal = ['company', 'collaborator'].includes(claims.type) &&
            Number.isInteger(claims.companyId) && Number.isInteger(claims.id);
        const validRootPrincipal = claims.type === 'root' && Number.isInteger(claims.id);
        if ((!validCompanyPrincipal && !validRootPrincipal) || claims.exp <= Math.floor(Date.now() / 1000)) {
            throw new Error('Token expirado');
        }

        request.auth = claims;
        request.companyId = claims.companyId;
    } catch {
        return reply.code(401).send({ error: 'Sessão inválida ou expirada.' });
    }
}
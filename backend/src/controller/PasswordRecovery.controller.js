import { createHash, randomBytes } from 'node:crypto';
import { hashPassword } from '../auth.js';
import { isEmailConfigured, sendPasswordResetEmail } from '../email.js';
import { pool, sql } from '../database.js';
import { createRateLimiter } from '../rateLimit.js';

const allowRequest = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
const allowReset = createRateLimiter({ max: 10, windowMs: 10 * 60 * 1000 });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_RESPONSE = {
    ok: true,
    message: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.'
};

// Valida ou verifica hash token e informa se a condição é atendida.
function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

// Implementa a operação relacionada a request password reset.
export async function requestPasswordReset(request, reply) {
    const email = String(request.body?.email || '').trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 100) {
        return reply.code(400).send({ error: 'Informe um e-mail válido.' });
    }
    if (!allowRequest(request.ip)) {
        return reply.code(429).send({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' });
    }

    try {
        await sql`
            INSERT INTO contact_requests (email, source)
            VALUES (${email}, 'password_reset')
        `;

        if (!isEmailConfigured()) {
            request.log.error('SMTP não configurado para solicitações de recuperação de senha.');
            return reply.code(503).send({ error: 'O envio de e-mails está temporariamente indisponível.' });
        }

        const accounts = await sql`
            SELECT principal_type, principal_id
            FROM (
                SELECT 'root' AS principal_type, id AS principal_id, 1 AS priority
                FROM system_admins WHERE lower(email) = ${email} AND is_active = TRUE
                UNION ALL
                SELECT 'collaborator', collaborators.id, 2
                FROM collaborators
                JOIN companies ON companies.id = collaborators.company_id
                WHERE lower(collaborators.email) = ${email}
                  AND collaborators.is_active = TRUE AND companies.is_active = TRUE
                UNION ALL
                SELECT 'company', companies.id, 3
                FROM companies
                JOIN company_credentials ON company_credentials.company_id = companies.id
                WHERE lower(companies.email) = ${email} AND companies.is_active = TRUE
            ) matching_accounts
            ORDER BY priority
            LIMIT 1
        `;

        if (!accounts.length) return reply.code(202).send(GENERIC_RESPONSE);

        const token = randomBytes(32).toString('hex');
        const tokenHash = hashToken(token);
        const account = accounts[0];
        await sql`
            UPDATE password_reset_tokens
            SET used_at = now()
            WHERE principal_type = ${account.principal_type}
              AND principal_id = ${account.principal_id}
              AND used_at IS NULL
        `;
        await sql`
            INSERT INTO password_reset_tokens (principal_type, principal_id, token_hash, expires_at)
            VALUES (
                ${account.principal_type}, ${account.principal_id}, ${tokenHash},
                now() + INTERVAL '60 minutes'
            )
        `;

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = new URL('/', frontendUrl);
        resetUrl.hash = new URLSearchParams({ resetToken: token }).toString();
        try {
            await sendPasswordResetEmail(email, resetUrl.toString());
        } catch (error) {
            request.log.error({ err: error }, 'Falha ao enviar e-mail de redefinição de senha.');
            await sql`
                UPDATE password_reset_tokens SET used_at = now()
                WHERE token_hash = ${tokenHash} AND used_at IS NULL
            `;
        }

        return reply.code(202).send(GENERIC_RESPONSE);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível registrar a solicitação.' });
    }
}

// Implementa a operação relacionada a reset password.
export async function resetPassword(request, reply) {
    const token = String(request.body?.token || '');
    const password = String(request.body?.password || '');
    if (!token || password.length < 8 || password.length > 128) {
        return reply.code(400).send({ error: 'O link ou a senha informada é inválido.' });
    }
    if (!allowReset(request.ip)) {
        return reply.code(429).send({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' });
    }

    let client;
    let transactionStarted = false;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        transactionStarted = true;
        const tokenResult = await client.query(
            `SELECT id, principal_type, principal_id
             FROM password_reset_tokens
             WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
             FOR UPDATE`,
            [hashToken(token)]
        );
        if (!tokenResult.rows.length) {
            await client.query('ROLLBACK');
            transactionStarted = false;
            return reply.code(400).send({ error: 'O link expirou ou já foi utilizado. Solicite outro.' });
        }

        const reset = tokenResult.rows[0];
        const passwordHash = await hashPassword(password);
        const updateByType = {
            root: 'UPDATE system_admins SET password_hash = $1, updated_at = now() WHERE id = $2',
            company: 'UPDATE company_credentials SET password_hash = $1 WHERE company_id = $2',
            collaborator: 'UPDATE collaborators SET password_hash = $1, updated_at = now() WHERE id = $2'
        };
        const accountResult = await client.query(
            updateByType[reset.principal_type],
            [passwordHash, reset.principal_id]
        );
        if (accountResult.rowCount !== 1) {
            await client.query('ROLLBACK');
            transactionStarted = false;
            return reply.code(400).send({ error: 'O link expirou ou já foi utilizado. Solicite outro.' });
        }

        await client.query(
            `UPDATE password_reset_tokens
             SET used_at = now()
             WHERE principal_type = $1 AND principal_id = $2 AND used_at IS NULL`,
            [reset.principal_type, reset.principal_id]
        );
        await client.query('COMMIT');
        transactionStarted = false;
        return reply.send({ ok: true });
    } catch (error) {
        if (client && transactionStarted) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                request.log.error(rollbackError, 'Falha ao reverter a transação de redefinição de senha.');
            }
        }
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível redefinir a senha.' });
    } finally {
        if (client) client.release();
    }
}

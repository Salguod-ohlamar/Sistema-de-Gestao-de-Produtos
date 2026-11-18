import { sql } from '../database.js';
import { createRateLimiter } from '../rateLimit.js';

const allow = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interpreta ou normaliza parse contact para um formato interno consistente.
export function parseContact(body = {}) {
    const data = {
        name: String(body.name || '').trim(),
        phone: String(body.phone || '').replace(/\D/g, ''),
        email: String(body.email || '').trim().toLowerCase(),
        company_name: String(body.company_name || '').trim(),
    };
    const valid = data.name.length >= 2 && data.name.length <= 120 &&
        [10, 11].includes(data.phone.length) &&
        EMAIL.test(data.email) && data.email.length <= 160 &&
        data.company_name.length >= 2 && data.company_name.length <= 160;
    return valid ? data : null;
}

// Cria ou registra create contact e trata o resultado da operação.
export async function createContact(request, reply) {
    // campo isca: pessoas não veem; robôs preenchem. Responde sucesso sem gravar.
    if (request.body?.website) return reply.code(201).send({ ok: true });
    if (!allow(request.ip)) {
        return reply.code(429).send({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' });
    }
    const data = parseContact(request.body);
    if (!data) return reply.code(400).send({ error: 'Confira nome, telefone com DDD, e-mail e nome da empresa.' });
    try {
        await sql`
            INSERT INTO contact_requests (name, phone, email, company_name)
            VALUES (${data.name}, ${data.phone}, ${data.email}, ${data.company_name})
        `;
        return reply.code(201).send({ ok: true });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível enviar sua mensagem.' });
    }
}

// Busca ou obtém list contacts e entrega o resultado ao chamador.
export async function listContacts(request, reply) {
    try {
        return reply.send(await sql`
            SELECT id, name, phone, email, company_name, source, company_id,
                   created_at, handled
            FROM contact_requests ORDER BY created_at DESC
        `);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível carregar os contatos.' });
    }
}

// Atualiza ou altera set contact handled, aplicando os dados recebidos.
export async function setContactHandled(request, reply) {
    if (typeof request.body?.handled !== 'boolean') {
        return reply.code(400).send({ error: 'handled precisa ser true ou false.' });
    }
    const rows = await sql`
        UPDATE contact_requests SET handled = ${request.body.handled}
        WHERE id = ${request.params.id} RETURNING id, handled
    `;
    if (!rows.length) return reply.code(404).send({ error: 'Contato não encontrado.' });
    return reply.send(rows[0]);
}

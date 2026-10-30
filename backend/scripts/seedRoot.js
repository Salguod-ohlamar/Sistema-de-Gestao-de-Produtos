import { hashPassword } from '../src/auth.js';
import { sql } from '../src/database.js';

const email = String(process.env.ROOT_ADMIN_EMAIL || 'root@sgpr.local').trim().toLowerCase();
const password = String(process.env.ROOT_ADMIN_PASSWORD || '');

if (password.length < 16) {
    throw new Error('Defina ROOT_ADMIN_PASSWORD com pelo menos 16 caracteres antes de provisionar o root.');
}

const existing = await sql`SELECT id FROM system_admins WHERE email = ${email} LIMIT 1`;
if (existing.length) {
    console.log(`Administrador root ${email} já existe; nenhuma senha foi alterada.`);
} else {
    const passwordHash = await hashPassword(password);
    await sql`
        INSERT INTO system_admins (email, password_hash, is_active)
        VALUES (${email}, ${passwordHash}, TRUE)
    `;
    console.log(`Administrador root ${email} criado.`);
}
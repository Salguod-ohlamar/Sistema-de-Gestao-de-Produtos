import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL precisa estar configurada no ambiente do backend.');
}

export const sql = neon(process.env.DATABASE_URL);
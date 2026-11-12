// Limitador simples em memória (por chave). Suficiente para o formulário público;
// em serverless cada instância tem seu contador, então é uma proteção básica, não absoluta.
export function createRateLimiter({ max, windowMs }) {
    const hits = new Map();
    return function allow(key, now = Date.now()) {
        const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
        if (recent.length >= max) { hits.set(key, recent); return false; }
        recent.push(now);
        hits.set(key, recent);
        if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
        return true;
    };
}

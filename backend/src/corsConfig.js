const LOCAL_FRONTEND_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

export function getCorsOrigins({
    environment = process.env.NODE_ENV,
    configuredOrigins = process.env.CORS_ORIGINS
} = {}) {
    if (!configuredOrigins?.trim()) {
        if (environment === 'production') {
            throw new Error('CORS_ORIGINS precisa listar as origens do front-end em produção.');
        }
        return LOCAL_FRONTEND_ORIGINS;
    }

    const origins = configuredOrigins.split(',').map((origin) => origin.trim());
    if (origins.some((origin) => !origin)) {
        throw new Error('CORS_ORIGINS contém uma origem vazia.');
    }

    for (const origin of origins) {
        let parsed;
        try {
            parsed = new URL(origin);
        } catch {
            throw new Error(`Origem inválida em CORS_ORIGINS: ${origin}`);
        }

        if (parsed.origin !== origin || !['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error(`Informe apenas a origem (protocolo e domínio) em CORS_ORIGINS: ${origin}`);
        }
        if (environment === 'production' && parsed.protocol !== 'https:') {
            throw new Error('Origens de produção em CORS_ORIGINS precisam usar HTTPS.');
        }
    }

    return [...new Set(origins)];
}

export function createCorsOriginChecker(allowedOrigins) {
    return (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin));
    };
}

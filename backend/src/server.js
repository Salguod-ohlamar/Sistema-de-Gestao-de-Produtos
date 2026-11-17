
// instanciando o fastify
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { createCorsOriginChecker, getCorsOrigins } from './corsConfig.js'
import { registerApiRoutes } from './apiRoutes.js'


if (!process.env.AUTH_TOKEN_SECRET || process.env.AUTH_TOKEN_SECRET.length < 32) {
    throw new Error('AUTH_TOKEN_SECRET precisa ter pelo menos 32 caracteres.');
}

const fastify = Fastify({
    logger: true
})

const allowedOrigins = getCorsOrigins();

await fastify.register(cors, {
    origin: createCorsOriginChecker(allowedOrigins),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

await registerApiRoutes(fastify)

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

})

// instanciando o fastify
import Fastify from 'fastify'
import cors from '@fastify/cors'
import productsRouters from '../src/routes/RegisterProduct.routes.js'
import companyRoutes from '../src/routes/Company.routes.js'
import adminRoutes from '../src/routes/Admin.routes.js'
import collaboratorRoutes from '../src/routes/Collaborator.routes.js'
import { sql } from './database.js'


if (!process.env.AUTH_TOKEN_SECRET || process.env.AUTH_TOKEN_SECRET.length < 32) {
    throw new Error('AUTH_TOKEN_SECRET precisa ter pelo menos 32 caracteres.');
}

const fastify = Fastify({
    logger: true
})

//REGISTRA O CORS PARA PERMITIR REQUISIÇÃO DO FRONT END
await fastify.register(cors, {
    origin: true, //Permite qualquer origem em modo de desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

//REGISTRA AS ROTAS PUBLICAS E PROTEGIDAS
await fastify.register(companyRoutes)
await fastify.register(adminRoutes)
await fastify.register(collaboratorRoutes)
await fastify.register(productsRouters)


// Status code 

// informativo - 100 até 199
// tudo certo - 200 até 299
// direcionamento - 300 até 399
// erro do usuario - 400 até 499
// erro do servidor - 500 até 599



// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

})
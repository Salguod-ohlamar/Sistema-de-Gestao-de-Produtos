
// instanciando o fastify
import Fastify from 'fastify'
import cors from '@fastify/cors'
import productsRouters from '../src/routes/RegisterProduct.routes.js'
import { neon } from '@neondatabase/serverless';


export const sql = neon(`postgresql://neondb_owner:npg_acwrvh2GfI4u@ep-misty-grass-b64iimrd-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`);

const fastify = Fastify({
    logger: true
})

//REGISTRA O CORS PARA PERMITIR REQUISIÇÃO DO FRONT END
await fastify.register(cors, {
    origin: true, //Permite qualquer origem em modo de desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

//REGISTRA A ROTA DE PRODUTOS
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

// instanciando o fastify
import Fastify from 'fastify'

const fastify = Fastify({
    logger: true
})


// declarção de rota
fastify.get('/', (req, reply) => {
    return 'Servidor funcionando na porta 3000'
})



// criar uma nova rota que exiba um array de objetos 
// com dados de usuarios




fastify.get('/users', async (req, reply) => {
    return dados
})



fastify.post('/users', async (req, reply) => {
  

    return 'usuario adicionado com sucesso!'
})



fastify.delete('/users', async (req, reply) => {

    dados.splice(  1 ,    1)
    return 'usuario deletado com sucesso!'

})






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
    // Server is now listening on ${address}
})
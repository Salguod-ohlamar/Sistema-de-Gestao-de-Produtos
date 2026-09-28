
//importar as funções de controller
import { createProductController,
         findAllProductsController,
         findProductsByCodeController,
         findProductsByIdController } from "../controller/RegisterProduct.controller"

//Função principal das  rotas

async function productsRouters(fastify, options) {

    
    fastify.post('/produtos', createProductController);

    fastify.get('/produtos', findAllProductsController);

    fastify.get("/produtos/:id", findProductsByIdController);

    fastify.get('/produtos/codigo/:codigo', findProductsByCodeController)
}

export default productsRouters;
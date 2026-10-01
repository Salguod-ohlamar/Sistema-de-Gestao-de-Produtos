
//importar as funções de controller
import { createProductController,
         deleteById,
         findAllProductsController,
         findProductsByCodeController,
         findProductsByIdController, 
         updateById} from "../controller/RegisterProduct.controller.js"

//Função principal das  rotas

async function productsRouters(fastify, options) {

    
    fastify.post('/produtos', createProductController);

    fastify.get('/produtos', findAllProductsController);

    fastify.get("/produtos/:id", findProductsByIdController);

    fastify.get('/produtos/codigo/:codigo', findProductsByCodeController);

    fastify.put('/produtos/:id', updateById)

    fastify.delete('/produtos/:id', deleteById)
}

export default productsRouters;
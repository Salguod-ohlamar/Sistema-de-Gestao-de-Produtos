
//importar as funções de controller
import { createProductController,
         deleteById,
         findAllProductsController,
         findProductsByCodeController,
         findProductsByIdController, 
         updateById} from "../controller/RegisterProduct.controller.js"
import { requireCompanyAccess } from '../middleware/authorization.js';

//Função principal das  rotas

async function productsRouters(fastify, options) {

    fastify.addHook('preHandler', requireCompanyAccess);

    
    fastify.post('/produtos', createProductController);

    fastify.get('/produtos', findAllProductsController);

    fastify.get('/produtos/codigo/:codigo', findProductsByCodeController);

    fastify.get("/produtos/:id", findProductsByIdController);

    fastify.put('/produtos/:id', updateById)

    fastify.delete('/produtos/:id', deleteById)
}

export default productsRouters;
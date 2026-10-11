
import RegisterProductRepository from '../repository/RegisterProduct.repository.js';
import ProductRegister from '../repository/RegisterProduct.repository.js'

//cria um novo produto
async function createProductController(req, reply) {
    const dadosDoFormulario = req.body;

    const novoProduto = await RegisterProductRepository.create(dadosDoFormulario);

    return reply.status(201).send(novoProduto);


}

//lista todos os produtos
async function findAllProductsController(req, reply) {
    try {
        const prodcts = await RegisterProductRepository.finAll(); // chama o metodo findall do repository
        return reply.send(prodcts);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao lidar com produto' });
    }
}
//busca produtos pelo ID busca unica
async function findProductsByIdController(req, reply) {
    try {
        const id = req.params;

        const product = await RegisterProductRepository.findById(id);

        if (!product) {
            return reply.status(404).send({ message: 'Produto não encontrado' });
        }

        return reply.send(product);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao buscar produto' })


    }
}

async function findProductsByCodeController(req, reply) {
    try {
        const { codigo } = req.params;

        const product = await RegisterProductRepository.findBySkuorBarra(codigo);

        if (!product) {
            return reply.status(404).send({ message: 'Nenhum produto encontrado com este código' })
        }
        return reply.send(produto);
    } catch (erro) {
        return reply.status(500).send({ error: 'Erro ao buscar por código' });
    }
}









async function updateById(req, reply) {
    try {
        const { id } = req.params;
        const {nomeProduto, sku, codigoBarras, ncm, unidade, precoCusto, precoVenda, origemProduto, categoria} =req.body;
        const safeProductData={
          id, nomeProduto, sku, codigoBarras, ncm, unidade, precoCusto, precoVenda, origemProduto, categoria
        };

        const updateProduct = await RegisterProductRepository.updateById(id, safeProductData);


        if (!updateProduct || updateProduct.leght === 0) {
            return reply.status(404).send({ error: 'Produto nao encontrado, para atualizar' })
        }
        return reply.status(200).send(updateProduct);
    } catch (error) {
         console.error("Erro interno no controller:", error);
        return reply.status(500).send({ error: 'Erro ao atualizar produto' });
    }
}









async function deleteById(req, reply) {
    try {
        const { id } = req.params;
        const sucess = await RegisterProductRepository.deleteById(id);

        if (!sucess) {
            return reply.status(404).send({ error: 'Produto nao pode ser encontrado' })
        }
        return reply.status(204).send();
    } catch (error) {
        console.error("Erro interno no controller:", error);
        return reply.status(500).send({ error: 'Erro ao deletar produto' });

    }

}

export {
    createProductController,
    findAllProductsController,
    findProductsByIdController,
    findProductsByCodeController,
    deleteById,
    updateById
};

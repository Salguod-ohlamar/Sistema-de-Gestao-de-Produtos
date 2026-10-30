
import RegisterProductRepository from '../repository/RegisterProduct.repository.js';

//cria um novo produto
async function createProductController(req, reply) {
    const dadosDoFormulario = req.body;
    const barcode = String(dadosDoFormulario.codigoBarras ?? dadosDoFormulario.barcode ?? '').trim();
    if (barcode.length > 14) {
        return reply.status(400).send({ error: 'O código de barras aceita no máximo 14 caracteres.' });
    }

    try {
        const novoProduto = await RegisterProductRepository.create({ ...dadosDoFormulario, codigoBarras: barcode }, req.companyId);
        return reply.status(201).send(novoProduto);
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível salvar o produto.' });
    }


}

//lista todos os produtos
async function findAllProductsController(req, reply) {
    try {
        const prodcts = await RegisterProductRepository.finAll(req.companyId);
        return reply.send(prodcts);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao lidar com produto' });
    }
}
//busca produtos pelo ID busca unica
async function findProductsByIdController(req, reply) {
    try {
        const { id } = req.params;

        const product = await RegisterProductRepository.findById(id, req.companyId);

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

        const product = await RegisterProductRepository.findBySkuorBarra(codigo, req.companyId);

        if (!product) {
            return reply.status(404).send({ message: 'Nenhum produto encontrado com este código' })
        }
        return reply.send(product);
    } catch (erro) {
        return reply.status(500).send({ error: 'Erro ao buscar por código' });
    }
}









async function updateById(req, reply) {
    try {
        const { id } = req.params;
        const barcode = req.body?.codigoBarras ?? req.body?.barcode;
        if (barcode !== undefined && String(barcode).trim().length > 14) {
            return reply.status(400).send({ error: 'O código de barras aceita no máximo 14 caracteres.' });
        }
                const updateProduct = await RegisterProductRepository.updateById(id, req.companyId, req.body);


                if (!updateProduct || updateProduct.length === 0) {
            return reply.status(404).send({ error: 'Produto nao encontrado, para atualizar' })
        }
                return reply.status(200).send(updateProduct[0]);
    } catch (error) {
         console.error("Erro interno no controller:", error);
        return reply.status(500).send({ error: 'Erro ao atualizar produto' });
    }
}









async function deleteById(req, reply) {
    try {
        const { id } = req.params;
        const sucess = await RegisterProductRepository.deleteById(id, req.companyId);

        if (!sucess || sucess.length === 0) {
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

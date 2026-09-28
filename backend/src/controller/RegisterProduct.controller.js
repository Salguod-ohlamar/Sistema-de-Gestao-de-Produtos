import RegisterProductRepository from '../repository/RegisterProduct.repository.js';
import ProductRegister from '../repository/RegisterProduct.repository.js'

//cria um novo produto
async function createProductController (request, reply){
    const dadosDoFormulario = request.body;

    const novoProduto = await ProductRegister.create(dadosDoFormulario);

    return reply.status(201).send  (novoProduto);

}

//lista todos os produtos
async function findAllProductsController(req, reply) {
    try{
        const prodcts = await ProductRegister.finAll(); // chama o metodo findall do repository
        return reply.send(prodcts);
    }catch (error){
        return reply.status(500).send ({error:'Erro ao lidar com produto'});
    }
}
//busca produtos pelo ID busca unica
async function findProductsByIdController (req, reply){
    try{
        const id = request.params;

        const product = await ProductRegister.findById(id);

        if (!product){
            return reply.status(404).send ({message :'Produto não encontrado'});
        }
        
        return reply.send (product);    
    }catch(error){
        return reply.status(500).send({error:'Erro ao buscar produto'})


    }
}

async function findProductsByCodeController(){
    try{
        const {codigo} = request.params;

        const product = await ProductRegister.findBySkuorBarra(codigo);

        if (!product){
            return reply.status(404).send({message:'Nenhum produto encontrado com este código'})
        }
        return reply.send(produto);
    }catch(erro){
        return reply.status(500).send({error:'Erro ao buscar por código'});
    }
}

async function update(req,res){
    try{
        const {id} = req.params;
        const updateProduct = await RegisterProductRepository.updateById(id,req.body);


        if(!updateProduct){
            return res.status(404).json({error:'Produto nao encontrado, para atualizar'})
        }
        return res.status(200).json(updateProduct);
    }catch(error){
        return res.status(500).json({error:'Erroao atualizar produto'});
    }
}

async function del(req,res) {
    try{
        const {id}= req.params;
        const sucess = await RegisterProductRepository.delete(id);

        if(!sucesso){
            return res.status(404).json({error:'Produto nao pode ser encontrado'})
        }
        return res.status*(204).send();
    }catch(error){
        return res.status (500).json({error:'Erro ao deletar produto'});

    }
    
}

export{
    createProductController,
    findAllProductsController,
    findProductsByIdController,
    findProductsByCodeController,
    del,
    update
};

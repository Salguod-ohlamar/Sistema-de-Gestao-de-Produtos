



const registerProduct = []

class ProductRegister {


    async create(productData) {
        const newProduct = {
            id:String(registerProduct.length+1),
            nomeProduto: productData.nomeProduto ,
            sku:productData.sku,
            codigoBarras: productData.codigoBarras || 'Sem GTIN',
            ncm: productData.ncm,
            unidade: productData.unidade || "UN",
            precoVenda: productData.precoVenda || 0,
            precoCusto: productData.precoCusto || 0,
            origemProduto: productData.origemProduto || '0',
            categoria: productData.categoria,
            createdAT: new Date()
        }

        registerProduct.push (newProduct);
        return newProduct;
    }

    async finAll(){
        return registerProduct;
    }

    async findById(){
        return registerProduct.find(product => product.id === id || null);
    }

    async findBySkuorBarra(){
        return registerProduct.find(p => p.sku === codigo || p.codigoBarras === codigo)
    }

    async updateById(id, updateDate){
        const index = registerProduct.findIndex(product => product.id === id);
        if (index === -1){
            return null;
        }
        //mantem os dados antigos e sobreescreve com novos atualizando a data de modificação
        const existinProduct = registerProduct[index];
        const updateProduct ={
            ...existinProduct,
            ...updateDate,
            id:existinProduct.id, //Garabte que o Id nao seja alterado
            creatAt: existinProduct.creatAt, //Mantem a data de criação original
            updateDate: new Date() //Adiciona a data de atualização
        };
        registerProduct[index] =updateProduct;
        return updateProduct;
    }


    async deleteById(id){
        const index = registerProduct.findIndex (registerProduct => registerProduct.id === id);

        if(index ===-1){
            return false; //Produto nao encontrado
        }

        registerProduct.splice(index, 1);
        return true;

    }

}

export default new ProductRegister();
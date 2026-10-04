import {sql} from '../server.js'





class ProductRegister {


    async create(productData) {
        const result = await sql`
       INSERT INTO products (
                name,
                sku,
                category,
                brand,
                supplier,
                image_url,
                is_featured,
                barcode,
                ncm_code,
                unit,
                origin_code,
                stock_quantity,
                min_stock_quantity,
                warranty_months,
                cost_price,
                sale_price,
                final_price,
                markup,
                history
            ) VALUES (
                ${productData.nomeProduto || productData.name},
                ${productData.sku},
                ${productData.categoria || productData.category},
                ${productData.marca || productData.brand || null},
                ${productData.fornecedor || productData.supplier || null},
                ${productData.imagem || productData.image_url || null},
                ${productData.destaque ?? productData.is_featured ?? false},
                ${productData.codigoBarras || productData.barcode || 'Sem GTIN'},
                ${productData.ncm || productData.ncm_code || null},
                ${productData.unidade || productData.unit || 'UN'},
                ${productData.origemProduto || productData.origin_code || '0'},
                ${productData.em_estoque || productData.stock_quantity || 0},
                ${productData.qtda_minima || productData.min_stock_quantity || 0},
                ${productData.tempo_de_garantia || productData.warranty_months || 0},
                ${productData.precoCusto || productData.cost_price || 0},
                ${productData.precoVenda || productData.sale_price || 0},
                ${productData.preco_final || productData.final_price || productData.precoVenda || 0},
                ${productData.markup || null},
                ${productData.historico ? JSON.stringify(productData.historico) : null}
            )
            RETURNING *;
        `;
        return result[0];
        
    }

    async finAll(){

        const result = await sql `
            SELECT * FROM products ORDER BY iD DESC;
        `
        return result;
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
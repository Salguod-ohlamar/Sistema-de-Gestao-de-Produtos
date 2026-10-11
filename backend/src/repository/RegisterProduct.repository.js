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

    async updateById(id, productData){
        const result = await sql`
        UPDATE PRODUCTS
        SET
         name = ${productData.nomeProduto},
                sku = ${productData.sku},
                barcode = ${productData.codigoBarras},
                ncm_code = ${productData.ncm},
                unit = ${productData.unidade},
                cost_price = ${productData.precoCusto},
                sale_price = ${productData.precoVenda},
                origin_code = ${productData.origemProduto},
                category = ${productData.categoria}
        WHERE id = ${id}
        RETURNING *;
        `
        return result
    }


    async deleteById(id){
        
          const result = await sql `
            DELETE FROM PRODUCTS
            WHERE id= ${id}
            RETURNING *;
        `
        return result;

    }

}

export default new ProductRegister();
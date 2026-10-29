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

    



    async findById(id){
        const result = await sql`
            SELECT * FROM products WHERE id = ${id} LIMIT 1;
        `;
        return result[0] || null;
    }

    async findBySkuorBarra(codigo){
        const result = await sql`
            SELECT * FROM products
            WHERE sku = ${codigo} OR barcode = ${codigo}
            LIMIT 1;
        `;
        return result[0] || null;
    }

    async updateById(id, productData){
        const result = await sql`
        UPDATE PRODUCTS
        SET
                name = COALESCE(${productData.nomeProduto ?? productData.name ?? null}, name),
                sku = COALESCE(${productData.sku ?? null}, sku),
                barcode = COALESCE(${productData.codigoBarras ?? productData.barcode ?? null}, barcode),
                ncm_code = COALESCE(${productData.ncm ?? productData.ncm_code ?? null}, ncm_code),
                unit = COALESCE(${productData.unidade ?? productData.unit ?? null}, unit),
                cost_price = COALESCE(${productData.precoCusto ?? productData.cost_price ?? null}, cost_price),
                sale_price = COALESCE(${productData.precoVenda ?? productData.sale_price ?? null}, sale_price),
                origin_code = COALESCE(${productData.origemProduto ?? productData.origin_code ?? null}, origin_code),
                category = COALESCE(${productData.categoria ?? productData.category ?? null}, category),
                stock_quantity = COALESCE(${productData.em_estoque ?? productData.stock_quantity ?? null}, stock_quantity),
                min_stock_quantity = COALESCE(${productData.qtda_minima ?? productData.min_stock_quantity ?? null}, min_stock_quantity)
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
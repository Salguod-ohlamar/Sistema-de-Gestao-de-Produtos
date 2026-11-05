import saleRepository from '../repository/SaleRepository.js';

async function createSaleController(req, reply) {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({ error: 'A lista de itens da venda não pode estar vazia.' });
    }
    for (const item of items) {
        if (!Number.isInteger(item.product_id) || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.product_id <= 0) {
            return reply.status(400).send({ error: 'Cada item deve ter um product_id válido e uma quantidade maior que zero.' });
        }
    }
    const collaborator_id = req.auth.type === 'collaborator' ? req.auth.id : null;
    try {
        const sale = await saleRepository.createSale(req.companyId, collaborator_id, items);
        return reply.status(201).send(sale);
    } catch (error) {
        req.log.error(error);
        if (error.message === 'Estoque insuficiente ou produto não encontrado') {
            return reply.status(409).send({ error: 'Estoque insuficiente para um ou mais produtos' });
        }
        return reply.status(500).send({ error: 'Não foi possível processar a venda.' });
    }   
}

export {
    createSaleController
};
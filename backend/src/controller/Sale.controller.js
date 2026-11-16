import saleRepository from '../repository/SaleRepository.js';
import { normalizeCpf } from '../cpf.js';

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
    let customer_cpf = null;
    if (req.body.customer_cpf !== undefined && req.body.customer_cpf !== null && req.body.customer_cpf !== '') {
        customer_cpf = normalizeCpf(req.body.customer_cpf);
        if (!customer_cpf) return reply.status(400).send({ error: 'CPF do cliente inválido.' });
    }
    const collaborator_id = req.auth.type === 'collaborator' ? req.auth.id : null;
    try {
        const sale = await saleRepository.createSale(req.companyId, collaborator_id, items, customer_cpf);
        return reply.status(201).send(sale);
    } catch (error) {
        req.log.error(error);
        if (error.message === 'Estoque insuficiente ou produto não encontrado') {
            return reply.status(409).send({ error: 'Estoque insuficiente para um ou mais produtos' });
        }
        return reply.status(500).send({ error: 'Não foi possível processar a venda.' });
    }   
}

async function listSalesController(req, reply) {
    try {
        const sales = await saleRepository.listSales(req.companyId);
        return reply.send(sales);
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível carregar o histórico de vendas.' });
    }
}

async function getSaleController(req, reply) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return reply.status(400).send({ error: 'Venda inválida.' });
    try {
        const sale = await saleRepository.findSale(req.companyId, id);
        if (!sale) return reply.status(404).send({ error: 'Venda não encontrada.' });
        return reply.send(sale);
    } catch (error) {
        req.log.error(error);
        return reply.status(500).send({ error: 'Não foi possível carregar a venda.' });
    }
}

export {
    getSaleController,
    createSaleController,
    listSalesController
};
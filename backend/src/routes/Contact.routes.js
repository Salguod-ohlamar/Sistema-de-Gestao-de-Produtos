import { createContact, listContacts, setContactHandled } from '../controller/Contact.controller.js';
import { requireRootAccess } from '../middleware/authorization.js';

// Implementa a operação relacionada a contact routes.
async function contactRoutes(fastify) {
    fastify.post('/contatos', createContact); // público (tela inicial)
    fastify.get('/admin/contatos', { preHandler: requireRootAccess }, listContacts);
    fastify.patch('/admin/contatos/:id', { preHandler: requireRootAccess }, setContactHandled);
}

export default contactRoutes;

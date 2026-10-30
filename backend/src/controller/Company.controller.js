import CompanyRepository from '../repository/Company.repository.js';
import IdentityRepository from '../repository/Identity.repository.js';
import { createAccessToken, hashPassword, verifyPassword } from '../auth.js';

const allowedSegments = new Set(['technology', 'retail', 'services', 'industry']);

function publicCompany(company) {
    return { id: company.id, trade_name: company.trade_name, email: company.email };
}

async function registerCompany(request, reply) {
    const body = request.body || {};
    const company = {
        trade_name: String(body.trade_name || '').trim(),
        legal_name: String(body.legal_name || '').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        cnpj: String(body.cnpj || '').replace(/\D/g, ''),
        phone: String(body.phone || '').replace(/\D/g, ''),
        segment: String(body.segment || '')
    };
    const password = String(body.password || '');

    if (!company.trade_name || !company.legal_name || !company.email ||
        company.cnpj.length !== 14 || ![10, 11].includes(company.phone.length) ||
        !allowedSegments.has(company.segment) || password.length < 8) {
        return reply.code(400).send({ error: 'Revise os dados. CNPJ deve ter 14 dígitos, telefone 10 ou 11 e senha ao menos 8 caracteres.' });
    }

    try {
        const passwordHash = await hashPassword(password);
        const companyRecord = await CompanyRepository.create(company, passwordHash);
        return reply.code(201).send({
            company: publicCompany(companyRecord),
            principalType: 'company',
            accessToken: createAccessToken(companyRecord)
        });
    } catch (error) {
        if (error.code === '23505') {
            return reply.code(409).send({ error: 'Já existe uma empresa com este e-mail ou CNPJ.' });
        }
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível cadastrar a empresa.' });
    }
}

async function loginCompany(request, reply) {
    const email = String(request.body?.email || '').trim().toLowerCase();
    const password = String(request.body?.password || '');
    if (!email || !password) return reply.code(400).send({ error: 'Informe e-mail e senha.' });

    try {
        const root = await IdentityRepository.findRootByEmail(email);
        if (root) {
            if (!root.is_active || !(await verifyPassword(password, root.password_hash))) {
                return reply.code(root.is_active ? 401 : 403).send({ error: 'E-mail ou senha inválidos, ou acesso desativado.' });
            }
            return reply.send({
                company: { id: null, trade_name: 'Administração central', email: root.email },
                principalType: 'root',
                accessToken: createAccessToken({ id: root.id, type: 'root' })
            });
        }

        const collaborator = await IdentityRepository.findCollaboratorByEmail(email);
        if (collaborator) {
            if (!collaborator.is_active || !collaborator.company_is_active) {
                return reply.code(403).send({ error: 'Acesso desativado. Contate o administrador da empresa.' });
            }
            if (!(await verifyPassword(password, collaborator.password_hash))) {
                return reply.code(401).send({ error: 'E-mail ou senha inválidos.' });
            }
            return reply.send({
                company: publicCompany({ id: collaborator.company_id, trade_name: collaborator.name, email: collaborator.email }),
                principalType: 'collaborator',
                role: collaborator.role,
                isAdmin: collaborator.is_admin,
                accessToken: createAccessToken({
                    id: collaborator.id,
                    companyId: collaborator.company_id,
                    role: collaborator.role,
                    isAdmin: collaborator.is_admin,
                    type: 'collaborator'
                })
            });
        }

        const company = await CompanyRepository.findCredentialsByEmail(email);
        if (!company || !company.is_active || !(await verifyPassword(password, company.password_hash))) {
            return reply.code(401).send({ error: 'E-mail ou senha inválidos.' });
        }

        return reply.send({
            company: publicCompany(company),
            principalType: 'company',
            accessToken: createAccessToken(company)
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Não foi possível iniciar a sessão.' });
    }
}

export { registerCompany, loginCompany };
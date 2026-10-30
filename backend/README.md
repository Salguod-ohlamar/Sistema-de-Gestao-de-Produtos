# Backend: empresas e administração

## Configuração inicial

Configure estas variáveis no arquivo local `.env` do backend:

- `DATABASE_URL`: URL de conexão do PostgreSQL.
- `AUTH_TOKEN_SECRET`: segredo aleatório com pelo menos 32 caracteres.
- `ROOT_ADMIN_EMAIL`: opcional; usa `root@sgpr.local` quando omitido.
- `ROOT_ADMIN_PASSWORD`: obrigatório para criar o administrador root, com pelo menos 16 caracteres.

Sugestão de senha inicial para desenvolvimento: `SGPR-Root!2026-Setup`. Troque-a por uma senha aleatória antes de disponibilizar o sistema e não a reutilize em produção.

## Banco de dados

Execute `migrations/001_companies_and_product_ownership.sql` no banco antes de iniciar o servidor. A migração cria colaboradores, credenciais e administradores do sistema, adiciona status ativo e vincula produtos a uma empresa.

Produtos que já existiam permanecem com `company_id` nulo. Depois de confirmar a empresa proprietária, atribua esses registros manualmente antes de habilitar o acesso dos usuários dessa empresa.

## Administrador root

Após configurar `.env` e executar a migração, rode `npm run seed:root` uma vez. O comando cria `ROOT_ADMIN_EMAIL` com a senha de `ROOT_ADMIN_PASSWORD`; se o e-mail já existir, não altera a senha.

O root acessa `/Gerenciamento`, onde visualiza empresas e colaboradores e pode ativar ou desativar ambos. As rotas verificam o status ativo no banco a cada requisição.
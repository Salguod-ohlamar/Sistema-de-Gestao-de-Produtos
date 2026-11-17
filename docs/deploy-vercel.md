# Preparar o deploy na Vercel

## Arquitetura selecionada

O repositório usa um único projeto Vercel com dois serviços definidos em [`vercel.json`](../vercel.json):

- `backend` (Fastify) recebe os caminhos públicos `/api/*`.
- `front-end` (Vite) recebe `/` e os demais caminhos.
- `front-end-legacy` não existe neste checkout e não foi incluído.

Ambos os serviços são alcançáveis através do roteador público do mesmo domínio. O browser chama `/api` no próprio domínio; não há BFF nem service binding. O backend é público em `/api/*`, mas suas rotas empresariais e administrativas continuam protegidas por autenticação e autorização.

**Atenção ao prefixo:** a Vercel encaminha a URL original ao serviço; `/api/produtos` chega ao backend como `/api/produtos`. Por isso, todas as rotas Fastify estão registradas sob `/api`, e o proxy local do Vite preserva o prefixo.

## Preparação local

1. Confirme que todas as migrações `001`–`006` foram aplicadas no banco PostgreSQL de destino.
2. Configure `backend/.env` localmente com a URL do banco, `AUTH_TOKEN_SECRET` (mínimo 32 caracteres), SMTP e:

   ```env
   CORS_ORIGINS=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

3. Na raiz do projeto, valide o front-end:

   ```powershell
   Set-Location front-end
   npm ci
   npm test
   npm run typecheck
   npm run lint
   npm run build
   ```

4. Valide o backend:

   ```powershell
   Set-Location ..\backend
   npm ci
   npm test
   ```

Não execute seed ou migração contra produção sem confirmar o banco selecionado.

## Configuração do projeto Vercel

Conecte este repositório a **um projeto Vercel** com Root Directory na raiz do repositório; o `vercel.json` coordena os dois serviços. A configuração proposta separa `/api/*` do front-end e encaminha o restante para a interface. O Fastify pode ser detectado pelo entrypoint existente `backend/src/server.js`.

Configure as variáveis no painel do projeto Vercel (Production e Preview conforme aplicável):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL PostgreSQL do ambiente correspondente; consumida pelo backend. |
| `AUTH_TOKEN_SECRET` | Segredo aleatório de pelo menos 32 caracteres; use segredo separado por ambiente. |
| `CORS_ORIGINS` | Origem HTTPS exata do domínio do projeto, sem caminho nem barra final. |
| `FRONTEND_URL` | URL pública do projeto usada nos links de redefinição. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Credenciais do provedor de e-mail. |
| `VITE_API_URL` | `/api`, valor público compilado no front-end. |

`CORS_ORIGINS` aceita uma lista de origens separadas por vírgula. Em produção o servidor recusa iniciar se a variável estiver vazia ou se alguma origem não usar HTTPS. Não use `*`, caminhos (`/app`) nem URL do backend nessa variável.

Como o domínio do projeto só fica conhecido após vinculá-lo à Vercel, configure `CORS_ORIGINS` e `FRONTEND_URL` com esse domínio HTTPS antes ou depois do primeiro deploy e então redeploy. Para Preview, configure as origens HTTPS que pretende permitir; a allowlist é exata e não aceita curingas.

`VITE_API_URL` é incorporada ao bundle e é **pública**. O valor deve ser `/api`; não coloque segredos, tokens ou credenciais nessa variável. Não crie binding entre os serviços: a interface estática é executada no navegador e chama a rota pública `/api/*`.

## Rate limit em serverless

A aplicação limita login, cadastro, contato e recuperação por IP usando um contador em memória. Em Vercel, instâncias serverless podem ser múltiplas e efêmeras; portanto, esse contador é apenas uma camada adicional e **não garante limite global**.

Antes de liberar tráfego público, configure limites compartilhados no Vercel Firewall/planos disponíveis ou adote um armazenamento distribuído (por exemplo, Redis) para essas rotas:

- `POST /api/auth/login`
- `POST /api/empresas`
- `POST /api/contatos`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Valide também alertas/custos de envio SMTP e monitore respostas `429`.

## Checklist pós-deploy

- Login válido e inválido; root, empresa e colaboradores.
- Acesso sem token retorna `401`; token de perfil/permissão incorretos retorna `403`.
- Confirmar que empresa A não consulta nem altera dados da empresa B.
- Testar preflight CORS a partir do domínio permitido e confirmar que outra origem não recebe `Access-Control-Allow-Origin`.
- Testar cadastro pendente, aprovação root e bloqueio de login antes de aprovação.
- Testar recuperação por e-mail, expiração e uso único do link.
- Confirmar que `.env` não está rastreado no Git e que nenhuma variável secreta usa prefixo `VITE_`.
- Conferir logs Vercel, conexão do banco e limites globais de requisição.

## Referência Vercel

A documentação oficial descreve suporte sem configuração adicional para Fastify em entrypoints como `src/server.js`: [Fastify on Vercel](https://vercel.com/docs/frameworks/backend/fastify). Os [serviços Vercel](https://vercel.com/docs/services) e [roteamento entre serviços](https://vercel.com/docs/services/routing) são recursos Beta. O rewrite da API preserva o prefixo `/api`; veja o `registerApiRoutes` do backend.

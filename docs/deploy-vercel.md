# Preparar o deploy na Vercel

## Arquitetura recomendada para o código atual

Publique dois projetos Vercel independentes:

1. **Backend** com Root Directory `backend/`. A API Fastify pode ser detectada pela Vercel pelo entrypoint existente `src/server.js`.
2. **Front-end** com Root Directory `front-end/` e preset Vite. O navegador chama o backend diretamente por HTTPS; esta arquitetura não usa BFF nem associação interna entre serviços.

Como o browser chama a API, o backend é público. Suas rotas protegidas continuam exigindo token e autorização no servidor; CORS apenas controla quais origens de navegador podem ler respostas.

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

## Deploy do backend

Crie um projeto Vercel conectado ao repositório, com Root Directory `backend/`. Configure as variáveis no painel Vercel (Production e Preview conforme aplicável):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL PostgreSQL do ambiente correspondente. |
| `AUTH_TOKEN_SECRET` | Segredo aleatório de pelo menos 32 caracteres; use segredo separado por ambiente. |
| `CORS_ORIGINS` | Origem HTTPS exata do front-end, sem caminho nem barra final. |
| `FRONTEND_URL` | URL pública do front-end usada nos links de redefinição. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Credenciais do provedor de e-mail. |

`CORS_ORIGINS` aceita uma lista de origens separadas por vírgula. Em produção o servidor recusa iniciar se a variável estiver vazia ou se alguma origem não usar HTTPS. Não use `*`, caminhos (`/app`) nem URL do backend nessa variável.

Depois do primeiro deploy, copie o domínio HTTPS do projeto do front-end para `CORS_ORIGINS` e `FRONTEND_URL` no backend e faça novo deploy. Configure também os domínios de Preview necessários, preferencialmente com alias estável; a allowlist é exata e não aceita curingas.

## Deploy do front-end

Crie um segundo projeto Vercel, com Root Directory `front-end/` e framework Vite. Defina:

| Variável | Escopo | Valor |
|---|---|---|
| `VITE_API_URL` | Build/Preview/Production | URL HTTPS pública do backend, por exemplo `https://api.seudominio.com`, sem `/` final. |

`VITE_API_URL` é incorporada ao bundle e é **pública**. Não coloque nela segredos, tokens, credenciais de banco ou SMTP. Não há associação de serviço nesta arquitetura: o browser acessa a URL pública da API.

## Rate limit em serverless

A aplicação limita login, cadastro, contato e recuperação por IP usando um contador em memória. Em Vercel, instâncias serverless podem ser múltiplas e efêmeras; portanto, esse contador é apenas uma camada adicional e **não garante limite global**.

Antes de liberar tráfego público, configure limites compartilhados no Vercel Firewall/planos disponíveis ou adote um armazenamento distribuído (por exemplo, Redis) para essas rotas:

- `POST /auth/login`
- `POST /empresas`
- `POST /contatos`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

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

A documentação oficial descreve suporte sem configuração adicional para Fastify em entrypoints como `src/server.js`: [Fastify on Vercel](https://vercel.com/docs/frameworks/backend/fastify). A Vercel transforma a aplicação em Function; limites e comportamento serverless se aplicam.

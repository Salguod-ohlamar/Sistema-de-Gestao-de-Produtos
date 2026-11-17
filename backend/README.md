# Backend

API REST do SGP/Nexora, construída com Node.js e Fastify. A persistência usa PostgreSQL através do cliente Neon; as rotas, controllers e repositórios ficam em `src/`.

## Requisitos e configuração

Use Node.js 22.12+ e npm 10+. Crie a configuração local a partir do exemplo:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
```

Se `.env` já existir, não o sobrescreva; acrescente apenas as variáveis que estiverem faltando. Preencha no arquivo:

| Variável | Obrigatória | Descrição |
|---|---:|---|
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL. |
| `AUTH_TOKEN_SECRET` | Sim | Segredo aleatório de pelo menos 32 caracteres para assinar tokens. |
| `ROOT_ADMIN_EMAIL` | Para seed | E-mail do administrador root; o script usa um padrão local se omitido. |
| `ROOT_ADMIN_PASSWORD` | Para seed | Senha root de pelo menos 16 caracteres. |
| `SMTP_HOST` | Para recuperação | Host SMTP. |
| `SMTP_PORT` | Para recuperação | Porta SMTP; padrão `587`, com TLS implícito na porta `465`. |
| `SMTP_USER` / `SMTP_PASSWORD` | Para recuperação | Credenciais do provedor SMTP. |
| `SMTP_FROM` | Para recuperação | Remetente das mensagens. |
| `FRONTEND_URL` | Para recuperação | URL pública do front-end; padrão local `http://localhost:5173`. |
| `CORS_ORIGINS` | Sim em produção | Origens exatas do front-end, separadas por vírgula; produção exige HTTPS. |

Use valores locais ou gerenciados por cofre de segredos. Não copie credenciais reais para documentação ou repositório.

Em desenvolvimento, sem `CORS_ORIGINS`, o backend permite apenas `http://localhost:5173` e `http://127.0.0.1:5173`. Em produção, a API encerra a inicialização se a allowlist estiver ausente. CORS não substitui autenticação: clientes que não são navegadores ainda podem chamar endpoints públicos.

## Banco e primeiro root

O banco precisa ter a tabela base `products`. Aplique os arquivos de `migrations/` em ordem antes de usar a API. O projeto não possui runner automático de migrações; instruções e efeitos estão em [docs/banco-de-dados.md](../docs/banco-de-dados.md).

Após configurar o `.env` e migrar o banco:

```powershell
npm run seed:root
```

O seed cria o root apenas se o e-mail ainda não existir; não redefine senha de um administrador existente.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desenvolvimento com reload; carrega `.env` e escuta na porta 3000. |
| `npm start` | Inicialização sem watch; carrega `.env`. |
| `npm test` | Executa os testes com `node --test`. |
| `npm run seed:root` | Provisiona o primeiro administrador root. |

## Organização

- `src/routes/`: definição dos endpoints e middleware aplicado.
- `src/controller/`: validação de entrada, coordenação e respostas HTTP.
- `src/repository/`: consultas e gravações no PostgreSQL.
- `src/middleware/authorization.js`: controle de acesso por identidade, empresa e função.
- `src/auth.js`: hash de senhas, geração e validação de tokens.
- `src/email.js`: envio SMTP da recuperação de senha.
- `migrations/`: alterações de esquema.

O inventário completo de endpoints está em [docs/api.md](../docs/api.md); os fluxos e limites de autorização estão em [docs/arquitetura.md](../docs/arquitetura.md).

## Observações operacionais

- O servidor local escuta na porta `3000`; todas as rotas da API são prefixadas com `/api`.
- O CORS usa `CORS_ORIGINS`; em desenvolvimento, sem a variável, permite somente os domínios locais do Vite.
- O endpoint de recuperação exige SMTP configurado; sem isso retorna indisponibilidade, embora registre a solicitação na fila administrativa.
- Cadastros novos de empresa permanecem inativos até aprovação pelo root.
- O limitador de tentativas atual é em memória por instância; em Vercel/serverless complemente com limite compartilhado no Firewall ou armazenamento distribuído.

Veja o guia de [deploy na Vercel](../docs/deploy-vercel.md) para a configuração multi-service em um único projeto.

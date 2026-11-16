# SGP / Nexora

Sistema de gestão empresarial para cadastro de produtos, estoque, vendas em ponto de venda (PDV), colaboradores, despesas e indicadores financeiros.

## Módulos

- **API (`backend/`)**: Node.js, Fastify e PostgreSQL (compatível com Neon).
- **Interface (`front-end/`)**: React, TypeScript, Vite e Tailwind CSS.
- **Documentação (`docs/`)**: arquitetura, API e banco de dados.
- **Migrações (`backend/migrations/`)**: evolução do esquema PostgreSQL; devem ser executadas em ordem.

O front-end ativo do projeto é `front-end/`. A API aplica escopo por empresa às operações de produtos, vendas e despesas.

## Requisitos

- Node.js 22.12 ou superior e npm 10 ou superior.
- PostgreSQL acessível pela API (por exemplo, uma base Neon).
- Credenciais SMTP para enviar mensagens de redefinição de senha.

## Configuração local

### 1. Preparar o banco

Confirme que a tabela base `products` já existe e aplique, em ordem, as migrações `001` a `006` de [backend/migrations/](./backend/migrations/). Não há um comando de migração automatizado; veja [Banco de dados](./docs/banco-de-dados.md).

### 2. Configurar e iniciar o backend

No PowerShell, a partir da raiz:

```powershell
if (-not (Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
Set-Location backend
npm ci
```

Se `backend/.env` já existir, não o sobrescreva: edite-o somente para incluir as variáveis que estiverem faltando. Configure `DATABASE_URL`, um `AUTH_TOKEN_SECRET` aleatório com pelo menos 32 caracteres e as configurações SMTP. Não compartilhe nem versione esse arquivo.

Depois de executar as migrações, crie o primeiro administrador root:

```powershell
npm run seed:root
npm run dev
```

O servidor local escuta na porta `3000`. O seed não altera a senha se o e-mail do root já existir.

### 3. Configurar e iniciar o front-end

Em outro terminal, na raiz:

```powershell
if (-not (Test-Path front-end\.env)) { Copy-Item front-end\.env.example front-end\.env }
Set-Location front-end
npm ci
npm run dev
```

O Vite abre o front-end em `http://localhost:5173` e encaminha `/api` para `http://localhost:3000`. Para outra API, configure `VITE_API_URL` em `front-end/.env`.

## Comandos de validação

Na pasta `front-end/`:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Na pasta `backend/`:

```powershell
npm test
```

O backend usa o test runner nativo do Node (`node --test`). Veja [Desenvolvimento e operação](./backend/README.md) para detalhes de ambiente e inicialização.

## Documentação

- [Arquitetura e fluxos](./docs/arquitetura.md)
- [Referência da API](./docs/api.md)
- [Banco de dados e migrações](./docs/banco-de-dados.md)
- [Backend: configuração e execução](./backend/README.md)
- [Front-end: configuração e execução](./front-end/README.md)

## Cuidados para produção

- Use segredos fortes e exclusivos; nunca publique `.env`, `DATABASE_URL`, chaves SMTP ou `AUTH_TOKEN_SECRET`.
- Configure `FRONTEND_URL` para o domínio público correto e SMTP antes de habilitar recuperação de senha.
- Restrinja as origens CORS no backend ao domínio do front-end; a configuração atual aceita qualquer origem.
- Aplique as migrações no banco correto e mantenha backup antes de mudanças de esquema.

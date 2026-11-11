# Sistema de Gestão de Produtos (Jynx / Nexora)

Sistema para pequenos comércios pararem de depender de papel e planilhas: cadastro de produtos, PDV com baixa automática de estoque, comprovante, histórico de vendas, usuários e DRE.

## Estrutura

| Pasta | O quê |
|---|---|
| `backend/` | API Fastify 5 + Postgres (Neon). Rotas de login, produtos, vendas, DRE, despesas e dashboard |
| `front-end/` | Front **oficial** (Nexora): React + Vite + TypeScript + Tailwind + shadcn |
| `front-end-legacy/` | Front antigo, mantido só para consulta (cadastro de empresa, planos e painel de administração ainda não existem na Nexora) |
| `backend/migrations/` | SQL das tabelas. Rodar em ordem no Neon (a `004_dre.sql` cria despesas e o custo na venda) |

## Rodar localmente

**Backend** (porta 3000)

```bash
cd backend
npm install
# crie backend/.env com DATABASE_URL e AUTH_TOKEN_SECRET (mín. 32 caracteres). NUNCA commitar o .env
npm run dev
```

**Front** (porta 5173; o `/api` é redirecionado para o backend)

```bash
cd front-end
npm install
npm run dev
```

Testes: `npm test` em cada pasta. Front: `npm run build` valida tipos e gera o pacote de produção.

## Publicar na Vercel (dois projetos)

1. **Backend** — novo projeto, *Root Directory* `backend`. A Vercel detecta o Fastify (entrada `src/server.js`). Variáveis: `DATABASE_URL` e `AUTH_TOKEN_SECRET`.
2. **Front** — novo projeto, *Root Directory* `front-end`, preset Vite. Variável: `VITE_API_URL` = URL do projeto do backend, sem barra no final (ex.: `https://meu-backend.vercel.app`).

## Fluxo de trabalho

- `main` é a única branch de verdade: tudo que está validado entra nela.
- Cada tarefa vive numa branch curta, abre PR para `main`, é testada e **a branch é apagada depois do merge**.
- Branch nova sempre parte da `main` atualizada (`git pull` antes de criar).

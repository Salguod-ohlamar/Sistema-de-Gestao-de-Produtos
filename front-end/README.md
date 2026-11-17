# Front-end SGP / Nexora

Aplicação web React para empresas, colaboradores e administração central. O código de produto está em `src/features/`, e a integração HTTP está centralizada em `src/lib/api/`.

## Tecnologias

- React 19, TypeScript e Vite.
- Tailwind CSS v4 e componentes Radix UI.
- TanStack Query para estado/cache de dados remotos.
- Vitest e Testing Library para testes.
- ESLint para análise estática.

## Execução local

Requer Node.js 22.12+ e npm 10+.

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

O Vite serve a aplicação em `http://localhost:5173`. Por padrão, `VITE_API_URL=/api`; `vite.config.ts` encaminha esse prefixo para `http://localhost:3000` e o preserva, igual ao roteamento multi-service da Vercel.

Em produção na Vercel, mantenha `VITE_API_URL=/api`; o roteador multi-service encaminha essas chamadas ao Fastify.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API; padrão `/api`. |

As chamadas passam pelo cliente em `src/lib/api/client.ts`, que serializa JSON, propaga erros HTTP e inclui o token Bearer quando autenticado. O token fica somente em memória: atualizar a página encerra a sessão.

## Funcionalidades

- Login, cadastro empresarial sujeito a aprovação e contato público.
- Solicitação e redefinição de senha por token recebido por e-mail.
- Dashboard, catálogo/estoque, PDV e histórico de vendas.
- Usuários/colaboradores e espaço da empresa.
- DRE e despesas.
- Administração root de empresas, colaboradores e solicitações de contato.

`src/App.tsx` coordena as telas. Os módulos por funcionalidade ficam em `src/features/`; cada feature pode conter componentes, hooks e testes.

Na navegação da empresa, Dashboard, DRE, Usuários e Espaço da empresa ficam no submenu **Configurações**. Frente de caixa, histórico e produtos continuam na navegação principal.

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor de desenvolvimento. |
| `npm run build` | Verifica TypeScript e gera `dist/`. |
| `npm run typecheck` | Verificação de tipos. |
| `npm run lint` | ESLint. |
| `npm test` | Suíte Vitest. |
| `npm run preview` | Visualiza localmente o build. |

Consulte [arquitetura](../docs/arquitetura.md) e [API](../docs/api.md) para os fluxos e contratos.

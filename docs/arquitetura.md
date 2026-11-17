# Arquitetura e fluxos

## Visão geral

```text
Navegador (React)
  └─ features + hooks (TanStack Query)
      └─ src/lib/api/client.ts
          └─ /api (proxy do Vite em desenvolvimento)
              └─ Fastify (backend, porta 3000)
                  └─ routes → middleware → controllers → repositories
                      └─ PostgreSQL / Neon
```

O front-end e a API são aplicações independentes. Em desenvolvimento, o Vite encaminha `/api` para o backend local. Em produção, `VITE_API_URL` ou um proxy do servidor web deve apontar para a API publicada.

## Estrutura do código

### `front-end/src`

- `App.tsx`: escolhe as telas e coordena o login, cadastro, contato, recuperação, telas empresariais e administração.
- `features/auth/`: autenticação, cadastro e recuperação de senha.
- `features/admin/`: gestão root de empresas e fila de contatos.
- `features/products/`, `sales/`, `dashboard/`, `finance/`: catálogo, PDV/histórico, indicadores e DRE/despesas.
- `features/users/`, `company/`, `contact/`: colaboradores, espaço da empresa e formulário público.
- `lib/api/`: cliente HTTP e contratos tipados por domínio.

A navegação atual é coordenada por estado em `App.tsx`. React Query gerencia consultas e mutações; os hooks invalidam as chaves de cache relacionadas após alterações. O token não é persistido em `localStorage`: fica em memória e desaparece ao recarregar a página.

Na barra lateral da empresa, Dashboard, DRE, Usuários e Espaço da empresa ficam agrupados no submenu expansível **Configurações**. Frente de caixa, histórico e produtos permanecem na navegação principal; root e operador mantêm menus restritos ao próprio perfil.

### `backend/src`

- `server.js`: instancia Fastify, registra CORS e rotas, inicia na porta 3000.
- `routes/`: liga caminhos HTTP aos controllers e aplica middleware de acesso.
- `middleware/authorization.js`: autentica e confere identidade, empresa e permissões.
- `controller/`: valida dados e mapeia resultados para respostas HTTP.
- `repository/`: consultas e transações no PostgreSQL.
- `auth.js`: hash/verificação de senhas e token assinado HMAC-SHA256.
- `email.js`: envio SMTP para recuperação de senha.

## Identidades e acesso

O login diferencia três tipos de identidade:

| Tipo | Acesso |
|---|---|
| `root` | Administração central: empresas, colaboradores e contatos administrativos. Não acessa dados de uma empresa. |
| `company` | Conta principal da empresa; atua dentro da própria empresa. |
| `collaborator` | Colaborador associado a uma empresa; o token contém `companyId` e função. |

Funções de colaborador: `administrator`, `manager` e `operator`. O backend limita a equipe e o financeiro conforme o middleware. Operadores não acessam financeiro; rotas de equipe exigem conta da empresa ou administrador de equipe.

As rotas empresariais usam `companyId` obtido do token, não um identificador de empresa enviado pelo navegador. Produtos, vendas e despesas são consultados e alterados dentro desse escopo.

Os tokens são assinados com `AUTH_TOKEN_SECRET` e expiram após oito horas. Senhas são armazenadas com bcrypt; tokens de acesso são mantidos apenas em memória no front-end.

## Fluxos importantes

### Cadastro e aprovação de empresas

1. O formulário público envia os dados para `POST /empresas`.
2. A API grava a empresa como inativa, cria as credenciais e registra uma solicitação `company_registration`.
3. O root aprova pela aba de contatos ou ativa a empresa na lista administrativa.
4. A ativação grava `approved_at`, habilita o login e marca o pedido de cadastro como atendido.

Empresas inativas não conseguem acessar rotas empresariais.

### Contatos e redefinição de senha

- `POST /contatos` cria solicitações públicas do tipo `contact`.
- `POST /auth/forgot-password` registra `password_reset` e, para uma conta ativa, envia um link SMTP de uso único com validade de 60 minutos.
- A resposta de recuperação é genérica para não revelar se um e-mail existe. O token é guardado no banco como hash, não em texto claro.
- `POST /auth/reset-password` consome o token e troca a senha.
- O root vê as três origens na fila e pode marcar pedidos como atendidos.

### Venda e estoque

`POST /vendas` valida itens, confirma estoque e grava venda/itens numa transação. O estoque é decrementado por empresa. Cada item congela custo e preço na hora da venda para que mudanças futuras de custo não alterem o DRE histórico. O custo não é devolvido na resposta da venda.

### Dashboard e DRE

- `/dashboard` retorna indicadores e agregações para um período.
- `/empresa/dashboard` é outro endpoint: resume produtos, estoque, cobertura e plano da empresa.
- `/dre` combina receita, imposto informado, custo de mercadoria vendida (CMV) e despesas.
- O período padrão de dashboard, DRE e despesas é o mês atual no fuso de São Paulo.

## Pontos operacionais

- O backend lê `CORS_ORIGINS`: origens exatas separadas por vírgula; em produção só aceita HTTPS e a API falha ao iniciar se não houver configuração.
- A porta do backend está fixada em `3000`.
- SMTP precisa estar configurado para que a recuperação envie mensagens.
- A API depende das migrações aplicadas; ela não as executa ao iniciar.
- Login, cadastro e outros formulários públicos usam limitadores em memória por instância; serverless requer uma camada global adicional.
- Os testes cobrem unidades e integrações front-end simuladas; não substituem validação no banco ou no serviço SMTP publicado.

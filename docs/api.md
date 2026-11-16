# Referência da API

## Convenções

- Base local: `http://localhost:3000`; no front-end local a URL é `/api` via proxy Vite.
- Corpos e respostas usam JSON, salvo respostas `204` sem conteúdo.
- Rotas protegidas recebem `Authorization: Bearer <accessToken>`.
- Token de acesso expira em oito horas.
- Erros normalmente usam `{ "error": "mensagem" }`.
- Rotas empresariais derivam a empresa do token e não aceitam seleção arbitrária de `company_id`.

## Autenticação, cadastro e contato

| Método e caminho | Acesso | Descrição |
|---|---|---|
| `POST /auth/login` | Público | Login de root, empresa ou colaborador. Corpo: `{ "email", "password" }`. Retorna `accessToken`, `principalType` e dados de perfil. |
| `POST /empresas` | Público | Solicita cadastro. Campos: `trade_name`, `legal_name`, `email`, `cnpj` (14 dígitos), `phone` (10/11 dígitos), `segment` (`technology`, `retail`, `services`, `industry`) e `password` (mínimo 8). Retorna `202` e `pendingApproval: true`; não inicia sessão. |
| `POST /auth/forgot-password` | Público | Corpo: `{ "email" }`. Registra solicitação e, se a conta estiver ativa, envia link por SMTP. Retorna mensagem genérica `202`; limite de 5 por 10 minutos/IP; retorna `503` quando SMTP não está configurado. |
| `POST /auth/reset-password` | Público, com token | Corpo: `{ "token", "password" }`; senha de 8 a 128 caracteres. Token é de uso único e expira após 60 minutos; limite de 10 tentativas por 10 minutos/IP. |
| `POST /contatos` | Público | Campos: `name`, `phone`, `email`, `company_name` e `website`. `website` é honeypot e deve ficar vazio. Cria pedido `contact`; limite de 5 por 10 minutos/IP. |

Cadastro empresarial com e-mail ou CNPJ duplicado retorna `409`. Cadastro novo permanece inativo até aprovação root.

## Produtos

Todas as rotas abaixo exigem acesso empresarial e são limitadas à empresa autenticada.

| Método e caminho | Descrição |
|---|---|
| `GET /produtos` | Lista produtos da empresa. |
| `POST /produtos` | Cria produto. Campos usuais: `name`, `sku`, `category`, `brand`, `barcode`, `image_url`, `stock_quantity`, `min_stock_quantity`, `sale_price`, `cost_price`, `unit`. Retorna `201`. Código de barras aceita até 14 caracteres. |
| `GET /produtos/:id` | Busca produto da empresa; `404` se não existir nesse escopo. |
| `GET /produtos/codigo/:codigo` | Busca por SKU ou código de barras. |
| `PUT /produtos/:id` | Atualiza campos permitidos do produto da empresa. |
| `DELETE /produtos/:id` | Exclui produto; retorna `204`. Produto referenciado por venda retorna `409`. |

## Vendas

Todas as rotas exigem acesso empresarial.

| Método e caminho | Descrição |
|---|---|
| `POST /vendas` | Corpo: `{ "items": [{ "product_id": 1, "quantity": 2 }], "customer_cpf": "52998224725" }`. `customer_cpf` é opcional. Atualiza estoque e cria venda numa transação; retorna `201`. Estoque insuficiente ou produto ausente retorna `409`. |
| `GET /vendas` | Histórico da empresa, limitado aos 100 registros mais recentes. |
| `GET /vendas/:id` | Detalhe para reimprimir comprovante; somente venda da empresa autenticada. |

O custo interno não é incluído na resposta da venda.

## Dashboard, DRE e despesas

Estas rotas exigem acesso financeiro: conta principal, administrador ou gerente; operador recebe `403`.

| Método e caminho | Descrição |
|---|---|
| `GET /dashboard?from=AAAA-MM-DD&to=AAAA-MM-DD&limit=5` | Indicadores, vendas diárias, estoque baixo, produtos parados e mais vendidos. `limit` aceita 1–20. |
| `GET /dre?from=AAAA-MM-DD&to=AAAA-MM-DD&tax_rate=0` | DRE com receita, impostos, CMV, despesas e resultado. `tax_rate` aceita 0–100. |
| `GET /despesas?from=AAAA-MM-DD&to=AAAA-MM-DD` | Lista despesas do período. |
| `POST /despesas` | Cria despesa: `category`, `description` opcional, `amount` positivo e `incurred_on` em `AAAA-MM-DD`. Categorias: `rent`, `utilities`, `payroll`, `marketing`, `other`. Retorna `201`. |
| `DELETE /despesas/:id` | Exclui despesa da empresa; retorna `204`. |

`from` e `to` são opcionais; o padrão é o mês atual em São Paulo. Datas inválidas ou início posterior ao fim retornam `400`.

## Espaço da empresa e equipe

| Método e caminho | Acesso | Descrição |
|---|---|---|
| `GET /empresa/dashboard` | Empresa ou colaborador ativo | Resumo de estoque, produtos, plano e colaboradores da empresa. |
| `GET /empresa/financeiro` | Empresa ou colaborador ativo | Resumo do plano/vigência; não é integração de cobrança. |
| `GET /empresa/colaboradores` | Empresa ou colaborador ativo | Lista equipe da empresa. |
| `POST /colaboradores` | Conta da empresa ou administrador de equipe | Cria colaborador com `name`, `email`, `cpf`, `phone`, `hire_date`, `role`, `is_admin` e `password`. Senha mínima 8; funções: `administrator`, `manager`, `operator`. |
| `PUT /colaboradores/:id` | Conta da empresa ou administrador de equipe | Altera `name`, `role` e `phone` de colaborador da mesma empresa. |
| `PATCH /empresa/colaboradores/:id/ativo` | Conta da empresa ou administrador de equipe | Corpo `{ "is_active": true }`; ativa/desativa colaborador da mesma empresa. |

E-mail ou CPF duplicado ao criar colaborador retorna `409`. A API impede rebaixar a própria função de administrador em determinada condição.

## Administração central

Todas as rotas exigem token `root` ativo.

| Método e caminho | Corpo | Descrição |
|---|---|---|
| `GET /admin/companies` | — | Lista empresas, status de aprovação, plano e colaboradores. |
| `PATCH /admin/companies/:id/active` | `{ "is_active": true }` | Ativa/aprova ou desativa uma empresa. Aprovar também fecha o pedido de cadastro associado. |
| `PATCH /admin/companies/:id/plan` | `{ "term_months": 12 }` | Atribui plano pelo prazo de 1 a 120 meses. |
| `PATCH /admin/collaborators/:id/active` | `{ "is_active": false }` | Ativa/desativa colaborador. |
| `GET /admin/contatos` | — | Lista pedidos de todas as origens: `contact`, `company_registration` e `password_reset`. |
| `PATCH /admin/contatos/:id` | `{ "handled": true }` | Marca pedido atendido ou reabre (`false`). |

## Códigos comuns

`400` entrada inválida · `401` autenticação ausente/inválida · `403` acesso proibido/inativo · `404` registro não encontrado no escopo · `409` conflito ou estoque insuficiente · `429` limite de tentativas · `500` falha interna.

# Contrato da API — novidades (migration 005)

Base: `VITE_API_URL`. Autenticação: `Authorization: Bearer <token>`. Erros: `{ "error": "mensagem" }`.

## Contato (tela inicial, público)
`POST /contatos` — sem token.
```json
{ "name": "Ana", "phone": "11912345678", "email": "ana@loja.com", "company_name": "Loja da Ana", "website": "" }
```
- `website` é campo isca: **deixe vazio e oculto no formulário** (robôs preenchem).
- 201 `{ "ok": true }` · 400 dados inválidos · 429 muitas tentativas (5 por 10 min por IP).
- Quem lê: administrador do sistema (root) — `GET /admin/contatos`, `PATCH /admin/contatos/:id` `{ "handled": true }`.

## Venda com CPF
`POST /vendas` aceita `customer_cpf` opcional (com ou sem máscara; omitido/vazio = sem CPF).
```json
{ "items": [{ "product_id": 1, "quantity": 2 }], "customer_cpf": "529.982.247-25" }
```
- CPF inválido → 400 `CPF do cliente inválido.` Resposta traz `customer_cpf` (11 dígitos ou `null`).
- `GET /vendas` (lista) também traz `customer_cpf`.

## Detalhe da venda (reimprimir cupom)
`GET /vendas/:id` → 200
```json
{ "id": 12, "created_at": "...", "total": "59.80", "status": "completed",
  "customer_cpf": "52998224725", "operator_name": "Maria",
  "items": [{ "product_id": 1, "name": "Camiseta", "sku": "CAM-01", "quantity": 2, "unit_price": "29.90", "subtotal": "59.80" }] }
```
404 se a venda não for da empresa. Nunca devolve custo.

## Editar colaborador
`PUT /colaboradores/:id` — só administrador / conta da empresa.
```json
{ "name": "Maria Souza", "role": "manager", "phone": "11912345678" }
```
`role`: `administrator | manager | operator`. 200 devolve o colaborador · 404 · 409 se tentar rebaixar a própria função.
Ativar/inativar continua em `PATCH /empresa/colaboradores/:id/ativo` `{ "is_active": false }`.

## Excluir produto
`DELETE /produtos/:id` → 204. Se o produto já foi vendido → **409** com mensagem pronta para mostrar (`error`). Não há inativação de produto nesta versão.

## Permissões
O backend aplica só os 3 papéis (`administrator`, `manager`, `operator`); operador não acessa o financeiro (403). Não existem permissões granulares.

## Rodar no Neon
Executar `migrations/005_cpf_contatos.sql` (seguro repetir).

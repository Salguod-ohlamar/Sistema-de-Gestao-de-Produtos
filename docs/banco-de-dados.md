# Banco de dados e migrações

## Pré-requisitos

O backend usa PostgreSQL, normalmente através do serviço Neon. `DATABASE_URL` deve apontar para o banco e schema corretos. A tabela de produtos base precisa existir antes da migração `001`; essa migração altera a tabela preexistente para adicionar propriedade por empresa.

O projeto não possui ferramenta automática de migração. Execute os arquivos SQL manualmente em um console PostgreSQL, na ordem abaixo. Antes de produção, confirme o ambiente e mantenha backup.

## Migrações

| Arquivo | Efeito principal |
|---|---|
| `001_companies_and_product_ownership.sql` | Cria empresas, credenciais, colaboradores e administradores root; adiciona `company_id`/compatibilidade a produtos e índices de escopo. |
| `002_sales.sql` | Cria cabeçalho de vendas com empresa, colaborador, total e status. |
| `003_sales_items.sql` | Cria itens de venda e vínculo com produto. |
| `004_dre.sql` | Adiciona custo unitário congelado por item e cria despesas empresariais. Para vendas antigas sem custo, usa o custo atual do produto como estimativa. |
| `005_cpf_contatos.sql` | Adiciona CPF opcional à venda e cria pedidos de contato públicos. |
| `006_contact_sources_and_password_reset.sql` | Adiciona aprovação de empresas, origem/vínculo de contatos e tokens de redefinição de senha. |

Para aplicar a migração `006`, abra o arquivo completo no editor SQL do banco selecionado e execute-o depois de `001`–`005`. Em caso de dúvida sobre a base ativa, não execute a migração até confirmar a conexão. A `006` não é executada automaticamente pela API.

### Efeito da migração `006`

- Empresas preexistentes recebem `approved_at` com a data de criação na primeira adição da coluna; novos cadastros ficam com `approved_at` vazio até aprovação.
- Pedidos antigos recebem origem `contact` por padrão.
- `contact_requests` passa a aceitar dados ausentes em campos de contato para registrar tentativas de recuperação por e-mail.
- `password_reset_tokens` armazena hash do token, identidade, expiração e data de uso; o token original não é persistido.

## Modelo lógico

- `companies`: cadastro, segmento, status ativo, aprovação e plano.
- `company_credentials`: credencial da conta principal da empresa.
- `collaborators`: usuários associados a uma empresa, função e status.
- `system_admins`: administradores globais (`root`).
- `products`: catálogo com `company_id`; chamadas empresariais filtram por esse identificador.
- `sales` e `sales_items`: vendas e itens; cada venda pertence a empresa e pode identificar colaborador.
- `expenses`: despesas vinculadas a empresa e, opcionalmente, colaborador criador.
- `contact_requests`: contatos públicos, cadastros empresariais e solicitações de recuperação; estado `handled`.
- `password_reset_tokens`: tokens temporários de uso único.

## Propriedade e isolamento

Operações empresariais usam a empresa associada ao token, inclusive consultas e alterações. Uma empresa não deve acessar produtos, vendas ou despesas de outra. Produtos que já existiam antes da associação podem permanecer com `company_id` nulo; confirme e atribua o proprietário manualmente antes de habilitar esses dados para clientes.

O administrador root usa endpoints próprios para administração e não recebe acesso às operações de uma empresa pelo token root.

## Provisionar o root

Após aplicar as migrações e preencher `ROOT_ADMIN_EMAIL` e `ROOT_ADMIN_PASSWORD` em `backend/.env`, execute `npm run seed:root` na pasta `backend/`. A senha deve ter ao menos 16 caracteres. Se o e-mail já existir, o script não altera a senha.

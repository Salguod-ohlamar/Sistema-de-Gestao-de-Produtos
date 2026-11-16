# Nexora — Sistema de Gestão Empresarial (Frontend)

Cockpit e ERP web moderno para controle e gestão integrada de produtos, catálogo, estoque, usuários e inteligência de vendas.

## Stack Tecnológica

- **Framework & Core:** React 19 + TypeScript (strict) + Vite 6
- **Estilização & Tokens:** Tailwind CSS v4 + Radix UI Primitives (Design System Shadcn customizado para tema dark)
- **Ícones:** Lucide React (`stroke-width: 1.5`, padrão 20px)
- **Tipografia Local:** Manrope (headings), Inter (interface e corpo), JetBrains Mono (códigos, moedas e SKUs) via `@fontsource`
- **Roteamento:** React Router v7
- **Gerenciamento de Estado de Servidor:** TanStack Query (React Query v5)
- **Tabelas de Dados:** TanStack Table v9
- **Formulários & Validação:** React Hook Form + Zod (mensagens em pt-BR)
- **Gráficos & Dashboards:** Recharts
- **Notificações:** Sonner (Dark Mode)
- **Mocks & APIs:** MSW v2 (Mock Service Worker) isolado em `src/lib/api`
- **Testes & Qualidade:** Vitest + Testing Library + ESLint + Prettier

## Design System & Identidade Visual

- **Tema Exclusivo:** Dark Mode único de alta fidelidade
  - Background base: `#05070D`
  - Superfícies: `#0A0F1C` (Sidebar / Menus), `#0E1526` (Cards / Painéis), `#141C30` (Modais / Popovers)
  - Bordas: `#1B2540` (padrão) e `#2A3A66` (destaque / hover)
  - Primário / Acento: `#2F6BFF` (hover `#4C82FF`, active `#1F52D6`)
  - Tipografia: `#EAF0FF` (títulos e ênfase), `#9AA8C7` (secundário), `#7A89AB` (auxiliar com contraste AA)
- **Raios de Borda:** Cards 14px (`rounded-[14px]`), Inputs & Botões 10px (`rounded-[10px]`), Badges em pílula (`rounded-full`).

## Instalação e Execução

### Pré-requisitos
- Node.js >= 20.x
- npm >= 10.x

### Instalação
```bash
npm install
```

### Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```
Variáveis disponíveis:
- `VITE_API_URL`: URL base da API (padrão `/api`)
- `VITE_USE_MOCKS`: `true` para rodar com MSW mocks no navegador

### Scripts Disponíveis
- `npm run dev`: Inicia o servidor Vite de desenvolvimento
- `npm run build`: Compila e gera o build de produção
- `npm run typecheck`: Executa validação estrita de tipos do TypeScript
- `npm run lint`: Executa a verificação estática do ESLint
- `npm run test`: Executa a suite de testes unitários com Vitest
- `npm run preview`: Visualiza o bundle de produção localmente

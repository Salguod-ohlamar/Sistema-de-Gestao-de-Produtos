---
trigger: always_on
---

# Regras do projeto Nexora (front-end)

## Stack obrigatória
React + TypeScript (strict) + Vite, Tailwind CSS, shadcn/ui, Lucide React, React Router, TanStack Query, TanStack Table, React Hook Form + Zod, Recharts, MSW (mocks), Vitest + Testing Library, Playwright. Não adicionar outras bibliotecas de UI (MUI, Ant, Chakra, Bootstrap) nem Next.js.

## Design
- Dark mode é o padrão e o único tema obrigatório.
- Nunca usar cores hexadecimais direto nos componentes: usar apenas tokens do tema (variáveis CSS / classes Tailwind mapeadas).
- Tokens de referência: fundo #05070D, superfícies #0A0F1C / #0E1526 / #141C30, bordas #1B2540 e #2A3A66, primário #2F6BFF, texto #EAF0FF / #9AA8C7 / #7A89AB.
- Fontes: Manrope (títulos), Inter (interface), JetBrains Mono (SKU e códigos), instaladas via pacotes locais (@fontsource), sem CDN.
- Raios: cards 14px, inputs e botões 10px, badges em pílula. Grid de 8px.
- Proibido: emojis na interface, gradientes roxos ou rosa, sombras pesadas, visual Material padrão, textos em inglês.

## Código
- TypeScript strict, sem `any`, sem `@ts-ignore`.
- Alias de importação `@/` para `src/`.
- Componentes pequenos, por feature (`src/features/<nome>`), sem lógica de API dentro de componentes visuais.
- Toda chamada HTTP passa por `src/lib/api`. Nenhum componente usa `fetch` diretamente.
- URL da API somente por variável de ambiente (`VITE_API_URL`); mocks controlados por `VITE_USE_MOCKS`.
- Toda lista/consulta trata 4 estados: carregando (skeleton), sucesso, vazio e erro.
- Formulários com React Hook Form + Zod; mensagens de erro em português.
- Textos da interface em português do Brasil; moeda em R$ via Intl.NumberFormat("pt-BR").
- Não guardar token de autenticação em localStorage.

## Acessibilidade
- Foco de teclado sempre visível, labels em todos os campos, alvos clicáveis de no mínimo 40px.
- Texto secundário pequeno usa #7A89AB (contraste AA); #5F6E8F só para itens desativados.
- Estados de erro nunca dependem só de cor.

## Qualidade
- Rodar `npm run lint`, `npm run typecheck` e `npm run test` antes de concluir cada fase.
- Commits pequenos e descritivos ao final de cada fase.
# CineVerse

Plataforma responsiva de descoberta de filmes e séries com dados reais da API do TMDB. O projeto usa Next.js App Router, React, TypeScript strict, Tailwind CSS, TanStack Query, Zustand, Motion e Vitest.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Token de leitura da API do TMDB ([obtenha nas configurações da sua conta](https://www.themoviedb.org/settings/api))

## Rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie `.env.local` na raiz e informe o token de leitura:

   ```env
   TMDB_READ_ACCESS_TOKEN=seu_token_de_leitura
   ```

   Ou copie `.env.example` para `.env.local`. O token é lido somente no servidor e nunca deve receber o prefixo `NEXT_PUBLIC_`.

3. Inicie o servidor:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
npm run dev       # desenvolvimento
npm run lint      # ESLint
npm run typecheck # verificação TypeScript
npm test          # testes com Vitest e Testing Library
npm run build     # build de produção
npm start         # servir o build localmente
```

## Funcionalidades

- Página inicial com destaques, tendências, lançamentos, filmes bem avaliados e séries populares.
- Catálogos de filmes e séries com filtros de gênero, ano, avaliação e paginação.
- Pesquisa de filmes e séries com debounce, filtro por tipo e paginação.
- Detalhes, elenco, notas, gêneros, temporadas, trailer oficial e recomendações relacionadas.
- Listas de favoritos, quero assistir e já assistidos, persistidas no armazenamento local do navegador.
- A interface informa explicitamente quando a chave da API está ausente, há erro HTTP ou não há trailer/imagem.

As consultas passam pelo Route Handler `/api/tmdb`, que valida os endpoints permitidos e mantém o token no servidor. As respostas são armazenadas em cache por cinco minutos. Favoritos são privados ao dispositivo e não são sincronizados entre navegadores.

## Deploy na Vercel

1. Importe este repositório na Vercel.
2. Em **Settings → Environment Variables**, adicione `TMDB_READ_ACCESS_TOKEN` para os ambientes desejados.
3. Faça o deploy; a Vercel detecta o Next.js e usa `npm run build`.

Não publique `.env.local` nem tokens. O `.env.example` contém apenas o nome da variável, sem credenciais.

## Créditos e atribuição

Este produto utiliza a API do TMDB, mas não é endossado ou certificado pelo TMDB. Os metadados e imagens são fornecidos pela TMDB. CineVerse não reproduz filmes completos; trailers oficiais são incorporados do YouTube quando disponíveis.

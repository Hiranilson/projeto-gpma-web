# 🛠️ Como Adicionar uma Nova Feature

Este guia descreve o passo a passo para contribuir com uma nova funcionalidade no projeto **vero-web**, seguindo os padrões e convenções já estabelecidos na base de código.

---

## Índice

1. [Visão Geral do Fluxo](#1-visão-geral-do-fluxo)
2. [Passo 1 — Criar a Função de API](#2-passo-1--criar-a-função-de-api)
3. [Passo 2 — Criar a Rota](#3-passo-2--criar-a-rota)
4. [Passo 3 — Buscar Dados com TanStack Query](#4-passo-3--buscar-dados-com-tanstack-query)
5. [Passo 4 — Criar Componentes Reutilizáveis](#5-passo-4--criar-componentes-reutilizáveis)
6. [Passo 5 — Adicionar Schemas de Validação](#6-passo-5--adicionar-schemas-de-validação)
7. [Passo 6 — Verificar Qualidade do Código](#7-passo-6--verificar-qualidade-do-código)
8. [Checklist da Feature](#8-checklist-da-feature)

---

## 1. Visão Geral do Fluxo

Toda nova feature segue esta sequência de camadas, do back-end para o front-end:

```
API Backend
    ↓
src/api/          ← Função que chama o endpoint
    ↓
src/routes/       ← Página/rota que usa os dados
    ↓
src/components/   ← Componentes visuais reutilizáveis
    ↓
src/utils/        ← Schemas de validação (se houver formulário)
```

> **Exemplo usado neste guia:** Adicionar uma página de listagem de **Produtos** (`/products`), acessível apenas para usuários autenticados.

---

## 2. Passo 1 — Criar a Função de API

Crie um arquivo em `src/api/` para cada operação do recurso. Cada arquivo deve ter:

- Tipagem explícita do corpo da requisição (body) e da resposta
- Uso da instância configurada `api` do Axios (de `@/lib/axios`)

```ts
// src/api/get-products.ts
import { api } from '@/lib/axios'

export interface Product {
  id: string
  name: string
  price: number
}

export interface GetProductsResponse {
  products: Product[]
}

export async function getProducts() {
  const response = await api.get<GetProductsResponse>('/products')
  return response.data
}
```

Para operações de escrita, exporte também o tipo do corpo da requisição:

```ts
// src/api/create-product.ts
import { api } from '@/lib/axios'
import type { Product } from './get-products'

export interface CreateProductBody {
  name: string
  price: number
}

export async function createProduct(body: CreateProductBody): Promise<Product> {
  const response = await api.post<Product>('/products', body)
  return response.data
}
```

> **Convenção:** um arquivo por operação (`get-products.ts`, `create-product.ts`, `delete-product.ts`). Nunca agrupe múltiplas operações em um único arquivo.

---

## 3. Passo 2 — Criar a Rota

O TanStack Router usa **roteamento baseado em arquivo**. O nome da pasta define a URL e `index.tsx` exporta a página.

### Onde criar a rota?

| Tipo de rota | Pasta | Proteção |
|---|---|---|
| Requer login | `src/routes/_app/` | Redireciona para `/sign-in` se não autenticado |
| Pública (sem login) | `src/routes/_auth/` | Redireciona para `/dashboard` se autenticado |

### Estrutura de arquivos

```
src/routes/
└── _app/
    └── products/
        └── index.tsx   ← acessível em /products
```

### Código mínimo da rota

```tsx
// src/routes/_app/products/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div>
      <h1>Produtos</h1>
    </div>
  )
}
```

> ⚠️ **Importante:** após criar o arquivo, execute `pnpm dev`. O TanStack Router **regenera automaticamente** o `src/routeTree.gen.ts`. **Nunca edite** esse arquivo manualmente.

---

## 4. Passo 3 — Buscar Dados com TanStack Query

Use `useQuery` para leitura de dados e `useMutation` para operações de escrita (criar, atualizar, deletar).

### Leitura com `useQuery`

```tsx
// src/routes/_app/products/index.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getProducts } from '@/api/get-products'

export const Route = createFileRoute('/_app/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (isLoading) return <p>Carregando...</p>

  return (
    <ul>
      {data?.products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### Escrita com `useMutation`

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createProduct } from '@/api/create-product'

function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalida o cache para refazer o fetch da lista
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar o produto.')
    },
  })
}
```

> **Convenção de `queryKey`:** use arrays de strings descritivos e únicos por recurso:
> - Lista: `['products']`
> - Item específico: `['products', productId]`

---

## 5. Passo 4 — Criar Componentes Reutilizáveis

Se a feature tiver partes visuais que se repetem, extraia-as para `src/components/`.

```tsx
// src/components/product-card.tsx
interface ProductCardProps {
  name: string
  price: number
}

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">{name}</h2>
      <p className="text-muted-foreground">R$ {price.toFixed(2)}</p>
    </div>
  )
}
```

### Precisa de um novo componente de UI base?

Use o shadcn/ui em vez de criar do zero:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add select
```

Os componentes são instalados automaticamente em `src/components/ui/`.

---

## 6. Passo 5 — Adicionar Schemas de Validação

Se a feature incluir um formulário, defina um schema Zod para validação.

### Schemas reutilizáveis (globais)

Se o schema puder ser reaproveitado em outras features, adicione-o em `src/utils/validation-schemas.ts`:

```ts
// src/utils/validation-schemas.ts
export const requiredPositiveNumber = () =>
  z.number().positive({ message: 'O valor deve ser maior que zero' })
```

### Schemas específicos da feature

Schemas exclusivos de uma página ficam no próprio arquivo da rota:

```tsx
// src/routes/_app/products/index.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { requiredString } from '@/utils/validation-schemas'

const createProductSchema = z.object({
  name: requiredString(),
  price: z.number().positive({ message: 'O preço deve ser maior que zero' }),
})

type CreateProductForm = z.infer<typeof createProductSchema>

function CreateProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
  })

  // ...
}
```

---

## 7. Passo 6 — Verificar Qualidade do Código

Antes de abrir um Pull Request, execute os seguintes comandos e certifique-se de que não há erros:

```bash
# 1. Verifica erros de tipagem TypeScript
pnpm typecheck

# 2. Corrige automaticamente problemas de linting e formatação
pnpm fix

# 3. Se quiser apenas verificar sem corrigir
pnpm check
```

---

## 8. Checklist da Feature

Use esta lista antes de abrir o PR:

- [ ] Função de API criada em `src/api/` com tipagem explícita de request e response
- [ ] Rota criada no grupo correto (`_app/` se autenticada, `_auth/` se pública)
- [ ] `routeTree.gen.ts` regenerado (basta rodar `pnpm dev`)
- [ ] Dados buscados com `useQuery` (leitura) ou `useMutation` (escrita)
- [ ] Cache do React Query invalidado após mutações (`queryClient.invalidateQueries`)
- [ ] Componentes reutilizáveis extraídos para `src/components/`
- [ ] Componentes de UI base adicionados via `npx shadcn@latest add` (quando necessário)
- [ ] Schema Zod criado para validação de formulários (se aplicável)
- [ ] `pnpm typecheck` executado sem erros
- [ ] `pnpm fix` executado

---

*Para dúvidas sobre a arquitetura geral do projeto, consulte o [README.md](./README.md).*

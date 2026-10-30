# Next.js Boilerplate

A starter for Next.js admin/dashboard apps that talk to a REST API. It comes with authentication (JWT + refresh cookie), route guards, data fetching, forms, a small design system and light/dark theming already wired together.

It works with any backend (Node, Django, Laravel, Go, …): point `NEXT_PUBLIC_API_BASE_URL` at it and make sure it follows the [backend contract](#backend-contract).

## Tech stack

| Area | Library |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + CSS variables in `src/app/globals.css` |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Forms | React Hook Form + Zod 4 |
| UI helpers | Headless UI, lucide-react icons, sonner toasts |

> **Note:** Next.js 16 has breaking changes compared to older versions. Before writing code, check the docs bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

Requirements: Node.js **20.9 or newer**, and a running backend API.

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is busy, Next.js picks the next free port (3001, …).

### Environment variables

| Variable | Example | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000/api/v1` | Base URL of the backend API. Required; the app throws a clear error if it is missing. |

- The `NEXT_PUBLIC_` prefix means the value is **built into the browser bundle**. Never put secrets in it.
- It is read at **build time**: after changing it for production, run `npm run build` again.
- The browser calls the backend directly, so the backend must allow the frontend's origin in CORS, with credentials allowed. A CORS rejection shows up as `TypeError: Failed to fetch`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
├── app/                 # Routes (App Router)
│   ├── (auth)/          #   Public auth pages: /login
│   ├── (main)/          #   Main app pages: /
│   ├── admin/           #   Staff-only pages, wrapped in AdminAuthGuard
│   ├── forbidden/       #   403 page
│   ├── health/          #   API health check page
│   ├── error.tsx        #   Error boundary (unexpected errors)
│   └── not-found.tsx    #   404 page
├── api/                 # HTTP client, error types, query client factory, endpoints
├── components/          # Shared design-system components (Ds*), guards, layouts
├── constants/           # Routes and other constants
├── features/            # Feature modules (auth, health, …)
├── hooks/               # Shared hooks (e.g. useAppForm)
├── providers/           # AppProviders: React Query, toasts, theme
├── stores/              # Zustand stores (theme)
└── types/               # Shared types
```

Import from `src` with the `@/src/...` alias, for example `import { DsButton } from "@/src/components"`.

### Feature modules

Each feature in `src/features/<name>/` keeps its own code together:

```text
features/auth/
├── api/          # Raw API calls (loginApi, currentUserApi, …)
├── hooks/        # React Query hooks (useLogin, useCurrentUser, …) and query keys
├── components/   # Feature UI (Login, LoginForm)
├── types/        # Types and Zod schemas
└── index.ts      # Public exports
```

To add a feature, copy this layout, add its endpoints to `src/api/api-endpoints.ts`, and re-export it from `src/features/index.ts`.

## Backend contract

Any backend works as long as it follows these rules. If yours differs, the places to adapt are listed in the last column.

| What | Expected | Where to change it |
| --- | --- | --- |
| Base URL | Set in `NEXT_PUBLIC_API_BASE_URL` | `.env.local` |
| Endpoint paths | `login`, `me`, `refresh`, `logout`, `register` | `src/api/api-endpoints.ts` (the only place auth paths are defined) |
| Success response | JSON envelope `{ "status": 200, "message": "...", "data": { ... } }` | `request()` in `src/api/create-api-client.ts` |
| Error response | Non-2xx status with `{ "message": "..." }` or `{ "detail": "..." }` | `getErrorMessage()` in `src/api/create-api-client.ts` |
| Auth header | Accepts `Authorization: Bearer <access token>` | `buildHeaders()` in `src/api/create-api-client.ts` |
| Login | Returns `data: { user, access }` and sets the refresh token as an HTTP-only cookie | `src/features/auth/api/login.ts` |
| Refresh | `POST` with the cookie, returns `data: { access }` | `refreshAccessToken` in `src/api/create-api-client.ts` |
| Current user | Returns `data` matching `AuthUser` (`id`, `email`, `first_name`, `last_name`, `is_staff`) | `src/features/auth/types/auth-user.ts` |
| CORS | Allows the frontend origin with credentials | Backend config |

## How things work

### API client

`api` from `@/src/api` wraps `fetch` and returns the backend's envelope (`{ status, message, data }`):

```ts
import { api } from "@/src/api";

const res = await api.get<HealthStatus>("/health/");
res.data; // HealthStatus | undefined
```

- Failed requests throw an `ApiError` with `status`, `message` (from the backend's `message` or `detail`) and the raw `body`.
- Paths are sent exactly as written, so match your backend's style (with or without a trailing `/`).

### Authentication

- The **access token** is kept in memory only (`src/api/token-store.ts`), never in `localStorage`.
- The **refresh token** is an HTTP-only cookie set by the backend; requests are sent with `credentials: "include"`.
- On a **401**, the client calls `/auth/refresh/` once and retries the request. Parallel 401s share a single refresh call.
- If refreshing fails, the query client sends the user to `/login`. A **403** sends them to `/forbidden`.

### Route guards

Wrap a layout in a guard to protect its routes:

| Guard | Shows loading while | Then |
| --- | --- | --- |
| `AuthGuard` | the current user loads | renders the page for any logged-in user |
| `AdminAuthGuard` | the current user loads | renders the page for staff (`is_staff`), otherwise redirects to `/forbidden` |

Not logged in (401) → `/login`. Any other error (network, 5xx) → `src/app/error.tsx`, whose **Try Again** button also refetches failed queries.

### Data fetching

Use React Query hooks inside features, with query keys kept in a `*.query-name.ts` file next to them:

```ts
export const useHealth = () =>
  useQuery({ queryKey: healthKeys.status(), queryFn: () => api.get<HealthStatus>("/health/") });
```

Each browser session and each server request gets its own `QueryClient` (created in `AppProviders`), so cached data is never shared between users.

### Forms

`useAppForm(schema)` creates a React Hook Form instance validated by a Zod schema. Pass it to `DsForm` and use `DsFormInput` for registered inputs with error messages:

```tsx
const form = useAppForm(authLoginSchema);

<DsForm form={form} onSubmit={(data) => submit(data)}>
  <DsFormInput name="email" type="email" label="Email" />
  <DsFormInput name="password" type="password" label="Password" />
  <DsButton type="submit">Login</DsButton>
</DsForm>
```

### Design system

Shared components live in `src/components` and start with `Ds`:

| Component | Purpose |
| --- | --- |
| `DsBox` | Layout container; `variant="card"`, `padding`, `as` |
| `DsTypography` | Text; `variant` = `h1`–`h4`, `body`, `bodySmall`, `helperText`, `caption` |
| `DsButton` | Button; `variant` = `primary`, `secondary`, `ghost`, `danger`; `size` = `sm`, `md`, `lg` |
| `DsInput` / `DsFormInput` | Text input, with icons and invalid state / React Hook Form version |
| `DsForm` | Form wired to React Hook Form |
| `DsField`, `DsLabel`, … | Field layout helpers (Headless UI) |
| `DsLoading` | The one loading indicator for the whole app; `fullScreen` for page-level loading |

Colors come from CSS variables (`--color-primary`, `--color-text-primary`, …) in `globals.css`. Use them in Tailwind as `bg-(--color-primary)` so components follow light/dark mode automatically.

### Theme

`useThemeStore()` exposes `theme` and `toggleTheme()`. The choice is saved in `localStorage`, and a small inline script in the root layout applies it before the first paint to avoid a flash.

## Conventions

- **Layout and page files:** name the default export `Layout` / `Page` (or similar), not the same as an imported component. A layout called `MainLayout` that renders `<MainLayout>` calls itself forever.
- **No circular imports:** code in `src/components` must not import the `@/src/features` barrel, because features import components. Import the exact file instead, e.g. `@/src/features/auth/hooks`. A cycle here shows up as `Maximum call stack size exceeded`.
- **Navigation:** use `useRouter()` / `<Link>` or `redirect()`, not `window.location`, for internal pages.
- **Loading UI:** always use `DsLoading` so every loading state looks the same.

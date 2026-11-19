# Next.js Boilerplate

A starter for Next.js admin/dashboard apps that talk to a REST API. It comes with authentication (JWT + refresh cookie), route guards, data fetching, forms, a small design system and light/dark theming already wired together.

It works with any backend (Node, Django, Laravel, Go, …): point `NEXT_PUBLIC_API_BASE_URL` at it and make sure it follows the [backend contract](#backend-contract).

## Tech stack

| Area | Library |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + design tokens in `src/app/globals.css` |
| Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives), copied into `src/components` as `Ds*` components |
| Tables | TanStack Table 9 (`DsDataTable`) |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Forms | React Hook Form + Zod 4 |
| UI helpers | lucide-react icons, sonner toasts, react-day-picker, class-variance-authority |

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
│   ├── admin/           #   Admin panel (dashboard, users, settings), wrapped in AdminAuthGuard
│   ├── forbidden/       #   403 page
│   ├── health/          #   API health check page
│   ├── error.tsx        #   Error boundary (unexpected errors)
│   └── not-found.tsx    #   404 page
├── api/                 # HTTP client, error types, query client factory, endpoints
├── components/          # Shared design-system components (Ds*), guards, layouts
├── constants/           # Routes, locale/direction and other constants
├── features/            # Feature modules (auth, health, …)
├── hooks/               # Shared hooks (e.g. useAppForm)
├── lib/                 # Small utilities (cn)
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

`useAppForm(schema, defaultValues?)` creates a React Hook Form instance validated by a Zod schema. Pass it to `DsForm` and use the `DsForm*` fields inside. Each field takes `name`, `label`, `description` and `disabled`, and shows its validation error under the control. On submit, the first invalid field gets focus.

```tsx
const schema = z.object({
  email: z.email("Enter a valid email"),
  role: z.string().min(1, "Pick a role"),
  birthday: z.date({ error: "Pick a date" }),
  terms: z.boolean().refine(Boolean, "You must accept the terms"),
});
const form = useAppForm(schema, { email: "", role: "", terms: false });

<DsForm form={form} onSubmit={(data) => save(data)}>
  <DsFormInput name="email" type="email" label="Email" />
  <DsFormSelect name="role" label="Role" options={[{ value: "admin", label: "Admin" }]} />
  <DsFormDatePicker name="birthday" label="Birthday" captionLayout="dropdown" />
  <DsFormCheckbox name="terms" label="I accept the terms" />
  <DsButton type="submit">Save</DsButton>
</DsForm>
```

| Field | Value type | Zod |
| --- | --- | --- |
| `DsFormInput` | `string` | `z.string()`, `z.email()`, `z.coerce.number()` for numbers |
| `DsFormTextarea` | `string` | `z.string().max(…)` |
| `DsFormSelect` | `string` (`options` or custom `children`) | `z.string().min(1, …)` with default `""` |
| `DsFormCombobox` | `string \| undefined` (searchable) | `z.string({ error: … })` |
| `DsFormRadioGroup` | `string` (`options` with optional `description`) | `z.enum([...])` |
| `DsFormCheckbox` | `boolean` | `z.boolean()`; must-accept: `.refine(Boolean, …)` |
| `DsFormSwitch` | `boolean` | `z.boolean()` |
| `DsFormDatePicker` | `Date \| undefined` | `z.date({ error: … })` |

For a control that has no `DsForm*` version, wrap it in `DsFormField`. It connects the control to the form and renders the label, description and error:

```tsx
<DsFormField name="color" label="Color">
  {({ field, controlProps }) => (
    <MyColorPicker {...controlProps} value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
  )}
</DsFormField>
```

Use `orientation="horizontal"` for checkbox-style controls (control first, label beside it).

### Design system

Every shared component lives in its own folder in `src/components` and starts with `Ds`. There is **one component per thing**: the shadcn/ui source was merged into the `Ds*` file, so there is no separate `ui/` folder to keep in sync. Import everything from `@/src/components`.

Open **`/ui-kit`** in the dev server to see every component and its variants (source: `src/app/ui-kit/page.tsx`).

| Component | Purpose |
| --- | --- |
| `DsBox` | Layout container; `variant` = `plain`, `card`, `muted`; `padding`; `shadow` = `true`, `sm`, `md`, `lg`; `as` |
| `DsTypography` | Text; `variant` = `h1`–`h4`, `body`, `bodySmall`, `helperText`, `caption`; `color` |
| `DsButton` | `variant` = `primary`, `secondary`, `outline`, `ghost`, `danger`, `link`; `size` = `xs`–`lg`, `icon-xs`–`icon-lg`; `loading`, `asChild` |
| `DsBadge` | Small status label |
| `DsInput` | Text input with icons and invalid state |
| `DsTextarea`, `DsCheckbox`, `DsSelect`, `DsSwitch`, `DsRadioGroup` | Other form controls |
| `DsCombobox` | Select with search for long lists; `options` with `keywords` for extra search terms |
| `DsDatePicker` | Button + popover calendar; `disabledDates`, `captionLayout="dropdown"`, `locale` |
| `DsForm*`, `DsFormField` | Form-connected versions of every control (see [Forms](#forms)) |
| `DsAlertDialog` | Confirmation before destructive or important actions |
| `DsSheet` | Side panel (`side` = `right`, `left`, `top`, `bottom`): mobile menu, filters, quick edit |
| `DsCommand` / `DsCommandDialog` | Searchable command list / ⌘K command palette (cmdk) |
| `DsAvatar` | User image with fallback initials, status badge, groups |
| `DsBreadcrumb`, `DsPageHeader` | Navigation trail / standard page title with description and actions |
| `DsEmpty` | Empty states ("no projects yet") with icon, text and action |
| `DsForm` | Form wired to React Hook Form |
| `DsField`, `DsLabel`, `DsFieldset`, … | Field layout helpers |
| `DsDialog`, `DsPopover`, `DsTooltip`, `DsDropdownMenu` | Overlays (Radix: focus trap, keyboard, positioning) |
| `DsTabs`, `DsAccordion` | Disclosure |
| `DsCalendar` | Date picker calendar (react-day-picker) |
| `DsTable` / `DsDataTable` | Plain table primitives / TanStack Table with sorting, pagination, loading and empty states |
| `DsSkeleton`, `DsSeparator` | Placeholders and dividers |
| `DsLoading` | The one loading indicator for the whole app; `fullScreen` for page-level loading |

**Colors** are design tokens in `globals.css` (`--primary`, `--muted-foreground`, `--success-soft`, …) with light and dark values. Each one is a Tailwind utility (`bg-primary`, `text-muted-foreground`, `bg-success-soft`), so use the utilities and never hard-code colors. The names follow shadcn's convention, so components copied from shadcn pick up the brand automatically.

**Text direction:** set `APP_DIR` (and `APP_LANG`) in `src/constants/locale.ts`. `<html dir>`, Radix menus and popovers, and toasts all follow it. Use logical classes (`ms-*`, `ps-*`, `start-*`, `text-start`) instead of `ml-*` / `left-*` so layouts flip correctly.

### Adding a shadcn/ui component

The shadcn CLI is configured in `components.json` (Radix base, Nova style, RTL enabled, lucide icons). The CLI writes a flat file with shadcn's names, so each new component needs a few manual steps to match the project layout. `DsAccordion` and `DsCalendar` were added this way and are good references.

Browse the available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

**1. Generate the file**

```bash
npx shadcn@latest add <name>       # e.g. npx shadcn@latest add switch
```

This creates `src/components/<name>.tsx` and installs any npm packages it needs.

**2. Delete duplicates the CLI re-created**

If the component depends on one we already have (for example `calendar` depends on `button`), the CLI also writes `src/components/button.tsx`. Delete it. We use our existing `DsButton` instead. Check with `git status`.

**3. Move it into its own folder**

```text
src/components/switch.tsx  →  src/components/Switch/DsSwitch.tsx
```

Then add `src/components/Switch/index.ts`:

```ts
export * from './DsSwitch';
```

And register it in `src/components/index.ts` (keep the list alphabetical):

```ts
export * from "./Switch";
```

**4. Rename to the `Ds` convention**

Inside the file, rename every exported component and helper:

| shadcn | Project |
| --- | --- |
| `Switch`, `SwitchThumb` | `DsSwitch`, `DsSwitchThumb` |
| `switchVariants` | `dsSwitchVariants` |

Do **not** rename the Radix import alias (`import { Switch as SwitchPrimitive } from "radix-ui"` stays as is).

**5. Fix the imports**

| shadcn import | Replace with |
| --- | --- |
| `import { cn } from "cn"` | `import { cn } from "@/src/lib/utils"` |
| `import { Button, buttonVariants } from "@/src/components/button"` | `import { DsButton, dsButtonVariants } from "../Button"` |
| Any other `@/src/components/<name>` | `../<Name>` (relative, so folders don't import themselves through the barrel) |

shadcn's button variants map to ours like this: `default` → `primary`, `destructive` → `danger`; sizes `default` → `md`, `icon` / `icon-sm` / `icon-xs` / `icon-lg` stay the same.

**6. Adjust the styles (optional)**

The component already uses the shared tokens (`bg-primary`, `border-input`, …), so it matches the theme as is. Change classes or add `cva` variants directly in the `Ds*` file. It is our code now.

**7. Add it to the UI kit**

Add a section to `src/app/ui-kit/page.tsx` showing its variants, and a link in the `sections` list at the top.

**8. Check**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

> **Prerender gotcha:** with Cache Components, Next.js fails the build if a Client Component reads `new Date()`, `Date.now()` or `Math.random()` while rendering. Put that code in its own component that calls `use(io())` (from `next/cache`) first, and wrap it in `<Suspense>`. See `CalendarDemo` in the UI kit and `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/io.md`.

### Admin panel

`/admin` uses `AdminLayout` (`src/components/Layouts/AdminLayout.tsx`) inside `AdminAuthGuard`:

- **Sidebar** (`DsSidebar`): collapses to icons on desktop (button or **Ctrl+B**), opens as a drawer on phones. The footer has the user menu (profile, theme, sign out).
- **Header**: breadcrumb built from the URL, **Ctrl+K** search over every page, theme toggle and notifications.
- **Navigation** lives in one place, `NAV_SECTIONS` in `src/constants/portal-nav.ts`. It feeds the sidebar, the breadcrumb labels and the Ctrl+K search. To add a page, create `src/app/admin/<name>/page.tsx`, add its path to `ROUTES.ADMIN`, and add an item to `NAV_SECTIONS` (`match: "exact"` for a page that shouldn't stay active on its sub-pages).

The pages are thin; their UI lives in `src/features/admin/`:

| Route | Component | What it shows |
| --- | --- | --- |
| `/admin` | `DashboardOverview` | Stat cards, recent users, activity |
| `/admin/users` | `UsersManagement` | Users table with add (dialog form), suspend/activate and delete (confirmation) |
| `/admin/settings` | `SettingsForms` | Profile form (pre-filled from the current user), theme, notification switches |

They use demo data from `src/features/admin/data/demo-users.ts` and simulated saves. Replace those with API calls and React Query hooks (see [Data fetching](#data-fetching)).

> Because `/admin` is guarded, it needs the backend: without it the current-user request fails and you see the error page. Log in as a user with `is_staff: true`.

### Theme

`useThemeStore()` exposes `theme` and `toggleTheme()`. The choice is saved in `localStorage`, and a small inline script in the root layout applies it before the first paint to avoid a flash.

## Conventions

- **Layout and page files:** name the default export `Layout` / `Page` (or similar), not the same as an imported component. A layout called `MainLayout` that renders `<MainLayout>` calls itself forever.
- **No circular imports:** code in `src/components` must not import the `@/src/features` barrel, because features import components. Import the exact file instead, e.g. `@/src/features/auth/hooks`. A cycle here shows up as `Maximum call stack size exceeded`.
- **Navigation:** use `useRouter()` / `<Link>` or `redirect()`, not `window.location`, for internal pages.
- **Loading UI:** always use `DsLoading` so every loading state looks the same.

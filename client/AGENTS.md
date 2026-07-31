# AGENTS.md

## Project overview

ForUm client — a React SPA forum frontend. Single package (not a monorepo). Backend lives in a separate repo (`MuriloObr/ForUm_Back-End`).

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v6 (BrowserRouter, routes in `src/main.tsx`)
- TanStack React Query v4 for server state
- Axios for HTTP
- Radix UI (hover-card, popover), Phosphor Icons
- Markdown rendering: `marked` + `dompurify` + `highlight.js`
- Storybook 8 (React-Vite)
- Orval for API code generation from OpenAPI spec

## Commands

```bash
pnpm dev              # Vite dev server on 0.0.0.0
pnpm build            # tsc && vite build
pnpm lint             # eslint . --ext ts,tsx (zero warnings allowed)
pnpm generate         # Generate API types and hooks from openapi.json
pnpm generate:watch   # Watch mode for generation
pnpm storybook        # Storybook on port 6006
pnpm build-storybook
```

No test runner is configured. There are no test scripts or test dependencies.

## Path aliases

Defined in both `vite.config.ts` and `tsconfig.json`:

- `@mytypes/*` → `src/types/*`
- `@components/*` → `src/components/*`

## Lint

ESLint extends `@rocketseat/eslint-config/react` — this enforces camelCase naming, specific import ordering, and other Rocketseat conventions. The `eslint-disable camelcase` comment appears in `postFunctions.ts` because the backend API uses snake_case field names. Lint is strict: `--max-warnings 0`.

## Architecture

- **Entry**: `src/main.tsx` — sets up React Query, SearchContext, AnswerContext, and router
- **Routes**: `src/routes/` — App, PostPage, Login, Register, Profile, About, ErrorPage
- **Components**: `src/components/` — Header, Post, PostComment, UserComponent, Modal/, Form/, ui/
- **API layer (legacy)**: `src/api/getFunctions.ts` and `src/api/postFunctions.ts` — hand-written backend calls via axios
- **API layer (generated)**: `src/api/generated/` — Orval-generated types, hooks, and functions (gitignored, run `pnpm generate`)
- **API mutator**: `src/api/mutator/custom-instance.ts` — shared Axios instance with `VITE_API_URL` env var and `withCredentials`
- **Types**: `src/types/typesAPI.ts` and `src/types/typesComponents.ts`
- **Contexts**: `src/context/SearchContext.tsx` and `src/context/AnswerContext.tsx`
- **Utils**: `src/utils/` — highlighter.ts, MDpurifiedHelper.ts

## API / backend

Backend URL is controlled via `VITE_API_URL` env var, set in environment-specific files:

- `.env.development` → `http://localhost:8000/api`
- `.env.production` → `/api` (relative, since FastAPI serves both static files and API)

The custom Axios instance (`src/api/mutator/custom-instance.ts`) reads `import.meta.env.VITE_API_URL`.

In development, Vite proxies `/api` requests to `http://localhost:8000` (configured in `vite.config.ts`).

Auth uses cookies (`withCredentials: true` on relevant requests).

## Orval code generation

Config in `orval.config.ts`. Generates react-query hooks + axios functions from `openapi.json`.

Output structure (`src/api/generated/`, gitignored):

- `endpoints.ts` — API functions and react-query hooks
- `model/` — TypeScript types from OpenAPI schemas

The backend's OpenAPI spec (`openapi.json`) is the source of truth for all API types. Run `pnpm generate` after updating the spec.

Generated code should never be edited manually — it is overwritten by `pnpm generate`.

## Deployment

Production build is served by FastAPI as static files. Vite builds to `dist/`, FastAPI serves `dist/` at `/` and API at `/api/*`.

## Conventions

- TypeScript strict mode enabled (`noUnusedLocals`, `noUnusedParameters`)
- Tailwind for all styling; custom CSS in `src/index.css` for markdown rendering
- Markdown rendered in a `.markdown` class with Tailwind `@apply` directives
- Storybook stories colocated with components (`*.stories.tsx`)

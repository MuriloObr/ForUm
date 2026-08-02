# ForUm

## Project overview

ForUm is a forum: a React SPA (`client/`) talking to a FastAPI backend (`server/`) backed by PostgreSQL. Both live in this single repo.

## Layout

- `client/` — React 18 + TypeScript + Vite SPA
- `server/` — FastAPI + SQLModel + Alembic, Python 3.13

## Commands (from repo root)

```bash
make dev        # Postgres + FastAPI in Docker, Vite on host
make down       # stop the Docker dev services
make test       # server pytest (SQLite in-memory)
make build      # client tsc + vite build
make prod       # build + run the combined production image
make lint       # client eslint (zero warnings allowed)
make generate   # regenerate client API types from openapi.json
```

Per-subdir package managers: `pnpm` (client), `uv` (server).

## Server (FastAPI)

Run locally: `uv run --directory server uvicorn src.main:app --reload` (requires `server/.env`).

Docker: `docker compose -f server/docker-compose.yml up --build` runs Postgres + FastAPI (hot-reload, `:8000`). The `DATABASE_URL` is overridden per-service so the `.env` value can point at `localhost` for host runs.

- **Entry**: `src/main.py` — FastAPI app, routes, JWT cookie auth, SPA fallback
- **Business logic**: `src/user_actions.py`, `src/post_actions.py`, `src/comment_actions.py`
- **Models**: `src/db/models/` (SQLModel: User, Post, Comment, link tables)
- **Engine**: `src/db/engine.py` — reads `DATABASE_URL`
- **Schemas**: `utils/api_types.py` (Pydantic)
- **Errors**: `utils/error_decorators.py` — `@errorHandler` decorator manages sessions and commits
- **Static serving**: `STATIC_DIR` env (default `client/dist`). The catch-all `/{path:path}` route serves real files, else `index.html`; unknown `/api/*` returns 404.

### Migrations (Alembic)

```bash
uv run --directory server alembic revision --autogenerate -m "description"
uv run --directory server alembic upgrade head
uv run --directory server alembic downgrade -1
uv run --directory server alembic check
```

Alembic reads `DATABASE_URL` from the environment (or `.env` via python-dotenv) and is configured against `src/db/models/` for autogenerate. `alembic.ini` uses `%(here)s` paths, so run alembic from `server/`.

### Tests

```bash
uv run --directory server pytest -v
```

Uses SQLite in-memory via `tests/conftest.py`; no Postgres required.

### Server gotchas

- The `@errorHandler("post")` decorator auto-commits; `"get"` does not. Route handlers return `[data, error]` tuples.
- Never call `@errorHandler`-decorated functions from within another `@errorHandler` block — nested sessions on `StaticPool` cause silent rollbacks. Use `_get_user_data()` instead of `get_user_by_id()` for inline user lookups.
- `model_dump()` does not include relationship fields (`likes`, `views`). Iterate ORM attributes directly.
- All models use `__tablename__` to match the plural DB table names (`users`, `posts`, `comments`, `posts_likes`, `posts_views`, `comments_likes`).
- Post tracks its answer via `answer_id: int | None` FK to `comments.id` (not a boolean on Comment).

## Client (React SPA)

### Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router v6 (BrowserRouter, routes in `src/main.tsx`)
- TanStack React Query v4 for server state
- Axios for HTTP
- Radix UI (hover-card, popover), Phosphor Icons
- Markdown: `marked` + `dompurify` + `highlight.js`
- Storybook 8 (React-Vite)
- Orval for API code generation from OpenAPI spec

### Commands (in `client/`)

```bash
pnpm dev              # Vite dev server on 0.0.0.0
pnpm build            # tsc && vite build
pnpm lint             # eslint --ext ts,tsx (zero warnings allowed)
pnpm generate         # Generate API types and hooks from openapi.json
pnpm storybook        # Storybook on port 6006
```

No test runner is configured.

### Path aliases

Defined in both `vite.config.ts` and `tsconfig.json`:

- `@mytypes/*` → `src/types/*`
- `@components/*` → `src/components/*`

### Lint

ESLint extends `@rocketseat/eslint-config/react` — enforces camelCase, specific import ordering, Rocketseat conventions. `eslint-disable camelcase` appears in `postFunctions.ts` because the backend API uses snake_case fields. Strict: `--max-warnings 0`.

### Architecture

- **Entry**: `src/main.tsx` — sets up React Query, SearchContext, AnswerContext, and router
- **Routes**: `src/routes/` — App, PostPage, Login, Register, Profile, About, ErrorPage
- **Components**: `src/components/` — Header, Post, PostComment, UserComponent, Modal/, Form/, ui/
- **API (legacy)**: `src/api/getFunctions.ts`, `src/api/postFunctions.ts` — hand-written axios calls
- **API (generated)**: `src/api/generated/` — Orval output (gitignored, run `pnpm generate`)
- **Mutator**: `src/api/mutator/custom-instance.ts` — shared Axios instance with `VITE_API_URL` and `withCredentials`
- **Types**: `src/types/typesAPI.ts`, `src/types/typesComponents.ts`
- **Contexts**: `src/context/SearchContext.tsx`, `src/context/AnswerContext.tsx`
- **Utils**: `src/utils/` — highlighter.ts, MDpurifiedHelper.ts

### API / backend

Backend URL via `VITE_API_URL` env var:

- `.env.development` → `http://localhost:8000` (direct, CORS)
- `.env.production` → `/api` (same-origin; FastAPI serves static + API)

The custom Axios instance reads `import.meta.env.VITE_API_URL`. Auth uses cookies (`withCredentials: true`).

### Orval code generation

Config in `orval.config.ts`; source of truth is the checked-in `openapi.json`. Generates react-query hooks + axios functions into `src/api/generated/` (gitignored). Never edit generated code — it is overwritten by `pnpm generate`. Run `pnpm generate` after updating the spec.

### Deployment

Production build (`client/dist`) is baked into the combined image (`server/Dockerfile.prod`) and served by FastAPI at `/`, with API at `/api/*`. Deep links fall back to `index.html`.

The image reads all config from environment variables (no `.env` is baked in): `DATABASE_URL`, `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `CORS_ORIGINS`, optional `STATIC_DIR` and `PORT`. `entrypoint.sh` runs `alembic upgrade head` at boot and binds uvicorn to `$PORT` (default 8000), so it runs on platforms that inject `PORT` (Railway, Render, Fly, Heroku, Cloud Run).

The build context is the repo root; a root `.dockerignore` keeps local secrets (`.env` files) and `node_modules` out of the image and the Docker daemon. `docker-compose.prod.yml` loads the root `.env` and does not override `DATABASE_URL`, so the `.env` value is authoritative (use `@db:5432` for the bundled `db` service, or a platform-managed URL for external Postgres).

## Documentation

- `CONTEXT.md` — domain glossary
- `docs/adr/` — architectural decision records
- `client/DESIGN.md` — design system

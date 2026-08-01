# ForUm

A lightweight, conversational forum. FastAPI backend + React SPA frontend, in one repo.

## Layout

- **`client/`** — React 18 + TypeScript + Vite SPA (Tailwind, React Router, TanStack Query)
- **`server/`** — FastAPI + SQLModel + Alembic, PostgreSQL (Python 3.13, uv)

## Requirements

- Docker (with compose)
- Node.js + pnpm
- Python 3.13 + uv

## Local development

```bash
cp server/.env.example server/.env   # then set JWT_SECRET_KEY to something random
make dev
```

`make dev` runs **Postgres + FastAPI in Docker** (API on `http://localhost:8000`) and **Vite on the host** (app on `http://localhost:5173`). Stop the Docker services with `make down`.

## API access from the client

- **Dev:** the SPA calls the API directly at `http://localhost:8000` (cross-origin, allowed via `CORS_ORIGINS` in `server/.env`).
- **Prod:** same-origin — FastAPI serves both the built SPA and `/api/*`.

## Tests

Server tests run on SQLite in-memory (no Postgres required):

```bash
make test
```

## Production

A single multi-stage image (`server/Dockerfile.prod`): a Node stage compiles the client to `client/dist`, a Python stage installs server deps, and the runtime image serves both the built SPA and the API on `:8000`.

```bash
make prod
```

This builds and starts the combined image (with Postgres) per `docker-compose.prod.yml`. Deep-link refreshes work via the SPA fallback route in `server/src/main.py`.

## Other commands

```bash
make build      # compile the client (tsc + vite)
make lint       # eslint on the client
make generate   # regenerate client API types from openapi.json (orval)
```

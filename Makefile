.PHONY: dev down test test-client build prod lint generate openapi help

help:
	@echo "dev         - start Postgres + FastAPI (Docker) and Vite (host)"
	@echo "down        - stop the Docker dev services"
	@echo "test        - run server tests (pytest)"
	@echo "test-client - run client tests (vitest)"
	@echo "build       - build the client (tsc + vite)"
	@echo "prod        - build and run the production image (Docker)"
	@echo "lint        - lint the client (eslint)"
	@echo "openapi     - extract the FastAPI OpenAPI spec to client/openapi.json"
	@echo "generate    - extract the OpenAPI spec, then regenerate client API types (orval)"

dev:
	docker compose -f server/docker-compose.yml up -d --build db webapp
	pnpm --dir client dev

down:
	docker compose -f server/docker-compose.yml down

test:
	uv run --directory server pytest

test-client:
	pnpm --dir client test

build:
	pnpm --dir client build

prod:
	docker compose -f docker-compose.prod.yml up --build

lint:
	pnpm --dir client lint

openapi:
	uv run --directory server python -c "import json; from src.main import app; print(json.dumps(app.openapi(), separators=(',', ':')), end='')" > client/openapi.json

generate: openapi
	pnpm --dir client generate

.PHONY: dev down test test-client build prod lint generate help

help:
	@echo "dev         - start Postgres + FastAPI (Docker) and Vite (host)"
	@echo "down        - stop the Docker dev services"
	@echo "test        - run server tests (pytest)"
	@echo "test-client - run client tests (vitest)"
	@echo "build       - build the client (tsc + vite)"
	@echo "prod        - build and run the production image (Docker)"
	@echo "lint        - lint the client (eslint)"
	@echo "generate    - regenerate client API types from openapi.json (orval)"

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

generate:
	pnpm --dir client generate

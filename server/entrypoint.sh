#!/bin/bash
set -e

alembic upgrade head

if [ "${SEED_DATA:-}" = "true" ]; then
  python -m src.seed
fi

exec uvicorn src.main:app --host 0.0.0.0 --port "${PORT:-8000}"

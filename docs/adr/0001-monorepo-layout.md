# Monorepo layout: `client/` + `server/` in one repo

The frontend (React SPA) and backend (FastAPI) previously lived in separate repositories. They are now co-located as `client/` and `server/` in a single repo, sharing one version history, one issue tracker, and one build/deploy pipeline. The two were deliberately *not* restructured into an `apps/` workspace or renamed: the existing configs, package managers (pnpm/uv), and AGENTS.md files all reference these paths, so moving them would churn every file for no functional gain.

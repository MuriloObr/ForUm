# ForUm — Domain Glossary

A vocabulary for the ForUm project: a lightweight, conversational forum.

## The product

- **Post** — A user-authored question or topic on the forum. Has a title, markdown content, a status (open/closed), likes, and views.
- **Comment** — A user-authored reply to a post. May be chosen as the post's **answer**.
- **Answer** — The comment a post's author marks as the resolution. A post tracks it via `answer_id`; a comment does not carry an "is answer" flag.
- **Like** — A user's engagement with a post or comment; the ratio of likes to dislikes on a post is the **engagement** metric.
- **View** — A counted visit to a post.

## The system

- **Client** — The browser application: a single-page React app served from the built `client/dist`.
- **API** — The FastAPI backend exposing all CRUD and engagement operations under `/api/*`.
- **Static Bundle** — The compiled client output (`client/dist`) produced by the Vite build; it is what the API serves in production.
- **SPA Fallback** — The behavior of serving `index.html` for any non-`/api` path, so deep links resolve in the browser router.
- **Dev Runtime** — The local development setup: PostgreSQL and the API run in Docker; the client runs on the host via Vite.
- **Production Image** — The single multi-stage container that bakes the Static Bundle in and serves both the API and the client.
- **Origin** — How the client reaches the API: cross-origin in dev (`http://localhost:8000` via CORS) and same-origin in production (`/api`).

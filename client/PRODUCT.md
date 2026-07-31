# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

General-purpose forum users — anyone who wants to browse, create, and discuss topics. No specific niche or community is targeted.

## Product Purpose

ForUm is a lightweight forum where users can create posts (written in markdown), comment on them, and engage in threaded discussion. Success means providing a fast, minimal discussion experience without the complexity or bloat of larger platforms.

## Positioning

ForUm is a simple, no-bloat forum. Unlike Reddit (subreddit ecosystem, algorithmic feed) or Discourse (heavy feature set, email-centric), ForUm focuses on the essential post-and-comment loop with markdown authoring, code highlighting, and minimal chrome.

## Operating Context

- Users browse a feed of posts, search by title, and click through to individual post pages
- Reading and posting are the primary workflows; users discover content via a flat chronological/sorted feed
- Markdown is the authoring format for both posts and comments, with `highlight.js` for code blocks
- Auth is cookie-based (withCredentials); login, register, and logout are handled by the backend
- The app is a React SPA; the backend (FastAPI, separate repo) serves both the API and the built static files in production
- Development uses Vite's dev server with a proxy to the backend at `localhost:8000`

## Capabilities and Constraints

### Capabilities

- Browse all posts; filter by title via search bar
- View individual post with its comments
- Create posts
- Create comments on posts
- Like/unlike posts and comments
- Mark a comment as the "best answer" (post owner, post must be open)
- Close/reopen posts (post owner)
- Register a new account; log in and log out
- View user profile (username, nickname, email, join date, their posts)
- Post content and comments render as HTML from markdown via `marked` + `dompurify`

### Technical Constraints

- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- State management: TanStack React Query v4 (server state); React context for search and answer-selection UI state
- API layer: Orval-generated hooks and types from an OpenAPI spec (`openapi.json`); hand-written API code has been fully migrated
- HTTP: Axios with `withCredentials: true` for cookie-based auth
- Deployment: Vite builds to `dist/`; FastAPI serves both `dist/` (static) and `/api/*` (API) from the same origin
- Backend URL: controlled via `VITE_API_URL` env var; `/api` in production, `http://localhost:8000/api` in development
- No test runner is configured
- ESLint is strict (`--max-warnings 0`) with Rocketseat conventions

### Terminology

- **Post**: A forum thread with a title, content (markdown), and an open/closed status
- **Comment**: A reply to a post; can be marked as the "best answer" by the post owner
- **Answer mode**: A toggle (`AnswerContext`) that lets the post owner select a comment as the best answer

## Brand Commitments

- **Name**: ForUm — capital F and U (Forum → ForUm)
- **Logo**: An SVG square icon with a stylized "F" character (`public/forUm.svg`)
- **No strict palette or typography**: Tailwind defaults (Inter/system-ui font stack); no brand color or typeface has been committed beyond what is coded

## Evidence on Hand

- SVG brand logo at `public/forUm.svg`
- An SVG search icon at `public/searchSvg.svg`
- No real user data, demo content, or test accounts

## Product Principles

1. **Minimal surface area** — every feature must earn its place. Avoid the feature creep of larger forum platforms.
2. **Markdown first** — the authoring experience and reading experience center on markdown with code highlighting.
3. **Fast by default** — optimistic UI patterns, stale-while-revalidate caching, and no unnecessary network calls.
4. **Writer-owned content** — post authors control their content (edit, delete, close, best-answer selection).
5. **No algorithmic mediation** — content is organized simply; no feeds or recommendations beyond search.

## Accessibility & Inclusion

No product-specific accessibility requirements have been established. The implementation should follow standard web accessibility practices.

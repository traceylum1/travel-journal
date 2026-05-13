# Travel Journal

A small full-stack app for logging trips on a map: register, sign in, create trips, and place markers. The backend is a Go HTTP API with cookie-based sessions; the frontend is a React app with Leaflet.

## Stack

- **Backend:** Go 1.25, [Gin](https://github.com/gin-gonic/gin), [pgx](https://github.com/jackc/pgx) (PostgreSQL)
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Leaflet

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (run the app)
- Go 1.25+ and Node.js 20+ (or current LTS) for tests, lint, and the E2E workflow

## Configuration

With `docker compose up`, the API’s **`DATABASE_URL`** is set in [`docker-compose.yml`](docker-compose.yml). For host-only commands (E2E, `go test`, `npm run e2e`, etc.), set `DATABASE_URL` yourself—see [E2E_DATABASE.md](E2E_DATABASE.md) for the E2E database URL.

Schema lives in `internal/db/schema.go`. The API container runs `go run ./cmd/e2e-db-prep` before the server so the dev database schema is applied idempotently.

## Run locally

From the repository root:

```sh
docker compose up
```

**URLs**

- Frontend (Vite): [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:8080](http://localhost:8080)

The Vite dev server proxies `/api` to the API (see `frontend/vite.config.js`; Compose sets `API_PROXY_TARGET` for the frontend service).

Postgres is exposed on the host at port **5434** (container port 5432) so it does not clash with a local Postgres on 5432. For optional host tools (`psql`, GUI clients), credentials match [`docker-compose.yml`](docker-compose.yml), for example:

`postgres://travel_journal:travel_journal@localhost:5434/travel_journal_dev?sslmode=disable`

[`docker-compose.e2e.yml`](docker-compose.e2e.yml) is only for Playwright/E2E Postgres; it uses a different database and port than this dev stack.

## Seed dev users

To insert a couple of fixed test accounts (idempotent: safe to run more than once), set `DATABASE_URL` on the host and run:

```sh
export DATABASE_URL='postgres://travel_journal:travel_journal@localhost:5434/travel_journal_dev?sslmode=disable'
go run ./cmd/seed
```

This applies the schema if needed, then inserts any missing seed users. Usernames and passwords are defined in [`internal/db/seed.go`](internal/db/seed.go) (`DevSeedUsers`). Defaults:

| Username | Password   |
|----------|------------|
| `test1`  | `Test1!ab` |
| `test2`  | `Test2!cd` |

## Scripts (frontend)

Run these from `frontend/` on your machine (tests and tooling are not wired into the Compose dev services):

| Command | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve built app (port 5173; proxies `/api` to :8080) |
| `npm run test` / `npm run test:run` | Vitest |
| `npm run e2e` / `npm run e2e:ui` | Playwright (see E2E section) |
| `npm run lint` | ESLint |

## End-to-end tests and Docker Postgres

E2E uses Dockerized Postgres, a small Go command to apply schema and optional data wipes, the API on port **8080**, and Playwright against **Vite preview** on **5173**. Full steps, env vars, and troubleshooting are in [E2E_DATABASE.md](E2E_DATABASE.md).

Quick outline:

1. `docker compose -f docker-compose.e2e.yml up -d postgres`
2. Export `DATABASE_URL` (see [E2E_DATABASE.md](E2E_DATABASE.md) for the default compose URL)
3. `go run ./cmd/e2e-db-prep`
4. `go run ./cmd/server`
5. From `frontend/`: `npm run e2e` (install browsers first if needed: `npx playwright install chromium`)

## Repository layout

| Path | Role |
|------|------|
| `cmd/server` | HTTP API entrypoint |
| `cmd/e2e-db-prep` | Apply schema + optional E2E DB reset |
| `cmd/seed` | Apply schema + insert dev seed users |
| `internal/db` | Postgres pool, schema, and dev seed helpers |
| `internal/handlers`, `internal/repository`, `internal/models` | HTTP layer and data access |
| `internal/router` | Route registration |
| `internal/session` | Session middleware and store |
| `frontend/` | React + Vite app |

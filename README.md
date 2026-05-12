# Travel Journal

A small full-stack app for logging trips on a map: register, sign in, create trips, and place markers. The backend is a Go HTTP API with cookie-based sessions; the frontend is a React app with Leaflet.

## Stack

- **Backend:** Go 1.25, [Gin](https://github.com/gin-gonic/gin), [pgx](https://github.com/jackc/pgx) (PostgreSQL)
- **Frontend:** React 19, Vite 7, Tailwind CSS 4, Leaflet

## Prerequisites

- Go 1.25+
- Node.js 20+ (or current LTS) and npm
- A running PostgreSQL instance and a connection URL

## Configuration

The API reads **`DATABASE_URL`** (a standard Postgres URL, for example `postgres://user:pass@localhost:5432/dbname?sslmode=disable`). Set it in your environment or in a `.env` file if your tooling loads it before `go run`.

Schema is defined in `internal/db/schema.go`. For a fresh database, ensure tables exist (the repo includes `cmd/e2e-db-prep` which applies schema idempotently—see below).

## Run locally

From the repository root, start the API on **:8080** and the Vite dev server together:

```sh
./scripts/dev.sh
```

The dev server proxies `/api` to `http://localhost:8080` (see `frontend/vite.config.js`).

### Run services separately

Terminal 1 — API (requires `DATABASE_URL`):

```sh
go run ./cmd/server
```

Terminal 2 — frontend:

```sh
cd frontend && npm install && npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Scripts (frontend)

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
| `internal/db` | Postgres pool and schema |
| `internal/handlers`, `internal/repository`, `internal/models` | HTTP layer and data access |
| `internal/router` | Route registration |
| `internal/session` | Session middleware and store |
| `frontend/` | React + Vite app |
| `scripts/dev.sh` | Local API + frontend |

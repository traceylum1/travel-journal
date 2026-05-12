# E2E Postgres setup

This project includes a reproducible Postgres instance for end-to-end testing in `docker-compose.e2e.yml`.

## Start Postgres

```sh
docker compose -f docker-compose.e2e.yml up -d postgres
```

## Stop Postgres

```sh
docker compose -f docker-compose.e2e.yml down
```

## DATABASE_URL for the Go server

Set `DATABASE_URL` before running `go run ./cmd/server`:

```sh
export DATABASE_URL="postgres://travel_journal:travel_journal@localhost:5433/travel_journal_e2e?sslmode=disable"
```

## Apply schema + optional wipe before suite

Run the DB prep command before Playwright (or any E2E suite):

```sh
go run ./cmd/e2e-db-prep
```

This command always applies schema idempotently, and can optionally wipe data:

- `E2E_WIPE_STRATEGY=truncate`: clears `users`, `trips`, and `markers` with `TRUNCATE ... RESTART IDENTITY CASCADE`.
- `E2E_WIPE_STRATEGY=prefix`: deletes only users whose usernames start with `E2E_USER_PREFIX` (defaults to `e2e_`), allowing parallel/local data to coexist.
- unset `E2E_WIPE_STRATEGY` (or `none`): no wipe, schema apply only.

Example with prefix wipe:

```sh
export E2E_WIPE_STRATEGY=prefix
export E2E_USER_PREFIX=e2e_
go run ./cmd/e2e-db-prep
```

Then start the API:

```sh
go run ./cmd/server
```

## Playwright E2E (frontend)

Playwright lives under `frontend/` with config in [`frontend/playwright.config.ts`](frontend/playwright.config.ts).

### Topology

1. **Postgres** — `docker compose -f docker-compose.e2e.yml up -d postgres` (see above).
2. **Schema / wipe** — `go run ./cmd/e2e-db-prep` with the same `DATABASE_URL` as the server.
3. **Go API** — must be running on **port 8080** before or while tests run (Playwright does not start it):

   ```sh
   export DATABASE_URL="postgres://travel_journal:travel_journal@localhost:5433/travel_journal_e2e?sslmode=disable"
   go run ./cmd/server
   ```

   The Vite dev server and `vite preview` both proxy `/api` to `http://localhost:8080` (see `frontend/vite.config.js`).

4. **Frontend** — `playwright test` starts **`vite build` + `vite preview`** on **5173** via the `webServer` block in `playwright.config.ts`. Override the URL with `PLAYWRIGHT_BASE_URL` if needed.

From `frontend/`:

```sh
npm run e2e
npm run e2e:ui
```

Install browsers after dependency install (CI often uses `npx playwright install --with-deps`):

```sh
cd frontend && npx playwright install chromium
```

If Chromium fails to launch with “executable doesn't exist” or an architecture mismatch, run the install command on the same machine that runs tests. Some toolchains set `PLAYWRIGHT_BROWSERS_PATH` to a cache built for a different CPU; unsetting it restores the default cache (for example `~/Library/Caches/ms-playwright` on macOS).

## Notes

- `internal/db/postgres.go` reads `DATABASE_URL`.
- If `DATABASE_URL` is unset, the server falls back to the original local default (`postgres://tracey@localhost:5432/traveljournal?sslmode=disable`).
- For CI, use the same connection string format against your Postgres service host/port.

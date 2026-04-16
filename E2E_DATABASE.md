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

Then start the API:

```sh
go run ./cmd/server
```

## Notes

- `internal/db/postgres.go` reads `DATABASE_URL`.
- If `DATABASE_URL` is unset, the server falls back to the original local default (`postgres://tracey@localhost:5432/traveljournal?sslmode=disable`).
- For CI, use the same connection string format against your Postgres service host/port.

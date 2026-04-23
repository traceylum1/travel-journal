package db

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

const schemaDDL = `
CREATE TABLE IF NOT EXISTS users (
	user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
	trip_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	trip_name TEXT NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	description TEXT NOT NULL,
	created_by TEXT NOT NULL,
	owner_id BIGINT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS markers (
	marker_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	trip_id BIGINT NOT NULL REFERENCES trips (trip_id) ON DELETE CASCADE,
	location TEXT NOT NULL,
	description TEXT NOT NULL,
	date DATE NOT NULL,
	latitude DOUBLE PRECISION NOT NULL,
	longitude DOUBLE PRECISION NOT NULL,
	created_by TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

type ResetStrategy string

const (
	ResetNone     ResetStrategy = "none"
	ResetPrefix   ResetStrategy = "prefix"
	ResetTruncate ResetStrategy = "truncate"
)

func ApplySchema(ctx context.Context, pool *pgxpool.Pool) error {
	if _, err := pool.Exec(ctx, schemaDDL); err != nil {
		return fmt.Errorf("apply schema: %w", err)
	}
	return nil
}

func ResetForE2E(ctx context.Context, pool *pgxpool.Pool, strategy ResetStrategy, userPrefix string) error {
	switch strategy {
	case "", ResetNone:
		return nil
	case ResetTruncate:
		_, err := pool.Exec(ctx, "TRUNCATE TABLE markers, trips, users RESTART IDENTITY CASCADE")
		if err != nil {
			return fmt.Errorf("truncate e2e data: %w", err)
		}
		return nil
	case ResetPrefix:
		if userPrefix == "" {
			return fmt.Errorf("prefix reset requires a non-empty prefix")
		}

		query := `
WITH matched_users AS (
	SELECT user_id
	FROM users
	WHERE username LIKE $1
)
DELETE FROM users
WHERE user_id IN (SELECT user_id FROM matched_users);
`
		if _, err := pool.Exec(ctx, query, escapeLikePrefix(userPrefix)+"%"); err != nil {
			return fmt.Errorf("prefix e2e wipe: %w", err)
		}
		return nil
	default:
		return fmt.Errorf("unsupported reset strategy %q", strategy)
	}
}

func escapeLikePrefix(prefix string) string {
	replacer := strings.NewReplacer(`\`, `\\`, `%`, `\%`, `_`, `\_`)
	return replacer.Replace(prefix)
}

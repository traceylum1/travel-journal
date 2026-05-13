package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/traceylum1/travel-journal/internal/models"
)

// DevSeedUsers are fixed accounts for local development. Passwords satisfy
// the same rules as the registration API (see internal/validation).
var DevSeedUsers = []struct {
	Username string
	Password string
}{
	{"test1", "Test1!ab"},
	{"test2", "Test2!cd"},
}

// SeedDevUsers inserts dev seed users if they are not already present.
func SeedDevUsers(ctx context.Context, pool *pgxpool.Pool) error {
	for _, u := range DevSeedUsers {
		input := &models.AuthenticationInput{Username: u.Username, Password: u.Password}
		if err := input.HashPassword(); err != nil {
			return fmt.Errorf("hash password for %q: %w", u.Username, err)
		}
		_, err := pool.Exec(ctx,
			`INSERT INTO users (username, password_hash) VALUES ($1, $2)
			 ON CONFLICT (username) DO NOTHING`,
			input.Username, input.Password,
		)
		if err != nil {
			return fmt.Errorf("insert user %q: %w", u.Username, err)
		}
	}
	return nil
}

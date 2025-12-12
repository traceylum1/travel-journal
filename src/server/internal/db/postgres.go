package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)


func NewPostgresPool(ctx context.Context) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig("postgres://tracey@localhost:5432/traveljournal?sslmode=disable")
	if err != nil {
		return nil, err
	}

	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour

	return pgxpool.NewWithConfig(ctx, config)
}
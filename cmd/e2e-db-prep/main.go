package main

import (
	"context"
	"log"
	"os"

	"github.com/traceylum1/travel-journal/internal/db"
)

func main() {
	ctx := context.Background()

	pool, err := db.NewPostgresPool(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	if err := db.ApplySchema(ctx, pool); err != nil {
		log.Fatal(err)
	}

	strategy := db.ResetStrategy(os.Getenv("E2E_WIPE_STRATEGY"))
	prefix := os.Getenv("E2E_USER_PREFIX")

	if strategy == db.ResetPrefix && prefix == "" {
		prefix = "e2e_"
	}

	if err := db.ResetForE2E(ctx, pool, strategy, prefix); err != nil {
		log.Fatal(err)
	}
}

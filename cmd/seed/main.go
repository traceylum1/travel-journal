package main

import (
	"context"
	"log"
	"os"

	"github.com/traceylum1/travel-journal/internal/db"
)

func main() {
	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx := context.Background()

	pool, err := db.NewPostgresPool(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	if err := db.ApplySchema(ctx, pool); err != nil {
		log.Fatal(err)
	}

	if err := db.SeedDevUsers(ctx, pool); err != nil {
		log.Fatal(err)
	}

	log.Println("schema applied; dev seed users ensured (usernames/passwords: internal/db/seed.go)")
}

package main

import (
    "context"
    "log"

    "github.com/traceylum1/travel-journal/internal/db"
    "github.com/traceylum1/travel-journal/internal/repository"
    "github.com/traceylum1/travel-journal/internal/handlers"
    "github.com/traceylum1/travel-journal/internal/router"
)

func main() {
    ctx := context.Background()

	pool, err := db.NewPostgresPool(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

    userRepo := repository.NewUserRepository(pool)
    userHandler := handlers.NewUserHandler(userRepo)
    markerRepo := repository.NewMarkerRepository(pool)
    markerHandler := handlers.NewMarkerHandler(markerRepo)

    router := router.NewRouter(userHandler, markerHandler)

    router.Run(":8080")
}

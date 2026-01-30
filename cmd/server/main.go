package main

import (
    "context"
    "log"
    "net/http"

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

    server := &http.Server{
        Addr:    ":8080",
        Handler: router,
    }

    server.ListenAndServe()
}

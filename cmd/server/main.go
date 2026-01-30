package main

import (
    "context"
    "log"
    "net/http"

    "github.com/traceylum1/travel-journal/internal/db"
    "github.com/traceylum1/travel-journal/internal/repository"
    "github.com/traceylum1/travel-journal/internal/handlers"
    "github.com/traceylum1/travel-journal/internal/router"
    "github.com/traceylum1/travel-journal/internal/middleware"
)

func main() {
    ctx := context.Background()

	pool, err := db.NewPostgresPool(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

    sessionManager := middleware.NewSessionManager(
        middleware.NewInMemorySessionStore(),
        10,
        10,
        20,
        "session",
    )
    
    userRepo := repository.NewUserRepository(pool)
    userHandler := handlers.NewUserHandler(userRepo)
    markerRepo := repository.NewMarkerRepository(pool)
    markerHandler := handlers.NewMarkerHandler(markerRepo)

    router := router.NewRouter(userHandler, markerHandler, sessionManager)

    server := &http.Server{
        Addr:    ":8080",
        Handler: router,
    }

    server.ListenAndServe()
}

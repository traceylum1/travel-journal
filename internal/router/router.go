package router

import (
	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
	"github.com/traceylum1/travel-journal/internal/session"
)

func NewRouter(
		userHandler *handlers.UserHandler, 
		markerHandler *handlers.MarkerHandler, 
		tripHandler * handlers.TripHandler, 
		sm *session.Manager,
	) *gin.Engine {

	r := gin.Default()

	auth := r.Group("/api/auth")
	auth.POST("register", userHandler.CreateUser(sm))
	auth.POST("login", userHandler.UserLogin(sm))

	protected := r.Group("/api/protected")
	protected.Use(session.Required(sm))
	protected.POST("addMarker", markerHandler.CreateMarker())
	protected.POST("createTrip", tripHandler.CreateTrip())
	// protected.GET("user/:username", userHandler.GetUserTrips())

	return r
}
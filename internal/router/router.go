package router

import (
	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
	"github.com/traceylum1/travel-journal/internal/session"
)

func NewRouter(userHandler *handlers.UserHandler, markerHandler *handlers.MarkerHandler, sessionManager *session.Manager) *gin.Engine {
	r := gin.Default()
	r.Use(sessionManager.Handle())

	publicRoutes := r.Group("/api/auth")
	publicRoutes.POST("register", userHandler.CreateUser)
	publicRoutes.POST("login", userHandler.UserLogin)

	protectedRoutes := r.Group("/api/protected")
	protectedRoutes.POST("addMarker", markerHandler.CreateMarker)
	protectedRoutes.GET("user/:username", userHandler.GetUserTrips)

	return r
}
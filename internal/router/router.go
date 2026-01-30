package router

import (
	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
	"github.com/traceylum1/travel-journal/internal/middleware"
)

func NewRouter(userHandler *handlers.UserHandler, markerHandler *handlers.MarkerHandler, sessionManager *middleware.SessionManager) *gin.Engine {
	r := gin.Default()
	r.Use(sessionManager.Handle()) 

	r.POST("api/register", userHandler.CreateUser)
	r.POST("api/login", userHandler.UserLogin)
	r.POST("api/addMarker", markerHandler.CreateMarker)
	r.GET("api/user/:username", userHandler.GetUserTrips)

	return r
}
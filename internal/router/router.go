package router

import (
	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
)

func NewRouter(userHandler *handlers.UserHandler, markerHandler *handlers.MarkerHandler) *gin.Engine {
	r := gin.Default()

	r.POST("api/register", userHandler.CreateUser)
	r.POST("api/login", userHandler.UserLogin)
	r.POST("api/addMarker", markerHandler.CreateMarker)
	r.GET("api/user/:username", userHandler.GetUserTrips)

	return r
}
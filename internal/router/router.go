package router

import (
	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
)

func NewRouter(userHandler *handlers.UserHandler, markerHandler *handlers.MarkerHandler) *gin.Engine {
	r := gin.Default()

	r.POST("api/user", userHandler.CreateUser)
	r.GET("api/user/:username", userHandler.GetUserTrips)
	r.POST("api/addMarker", markerHandler.CreateMarker)

	return r
}
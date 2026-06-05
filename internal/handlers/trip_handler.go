package handlers

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/models"
)

type tripRepository interface {
	CreateTrip(ctx context.Context, t *models.CreateTripInput) (int, error)
	GetUserTrips(ctx context.Context, userID string) (*[]int, error)
}

type TripHandler struct {
	repo tripRepository
}

func NewTripHandler(repo tripRepository) *TripHandler {
	return &TripHandler{repo: repo}
}


func (h *TripHandler) CreateTrip() gin.HandlerFunc {
	return func (c *gin.Context) {
		var input models.CreateTripInput

		if err := c.ShouldBindJSON(&input); err != nil {
			log.Printf("input error: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("parsed input: %+v", input)

		tripID, err := h.repo.CreateTrip(c.Request.Context(), &input)
		if err != nil {
			log.Printf("db error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}
		
		c.JSON(http.StatusCreated, gin.H{
			"trip_id": tripID,
		})
	}
}


func (h *TripHandler) GetUserTrips() gin.HandlerFunc {
	return func (c *gin.Context) {
		username := c.Param("username")

		trips, err := h.repo.GetUserTrips(c.Request.Context(), username)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "users trips not found"})
			return
		}

		c.JSON(http.StatusOK, trips)
	}
}


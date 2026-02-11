package handlers

import (
	"net/http"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/traceylum1/travel-journal/internal/repository"
)

type TripHandler struct {
	repo *repository.TripRepository
}

func NewTripHandler(repo *repository.TripRepository) *TripHandler {
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

		if err := h.repo.CreateTrip(c.Request.Context(), &input); err != nil {
			log.Printf("db error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}
		
		c.JSON(http.StatusCreated, input)
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


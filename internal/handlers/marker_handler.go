package handlers

import (
	"net/http"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/traceylum1/travel-journal/internal/repository"
	"github.com/google/uuid"
)

type MarkerHandler struct {
	repo *repository.MarkerRepository
}

func NewMarkerHandler(repo *repository.MarkerRepository) *MarkerHandler {
	return &MarkerHandler{repo: repo}
}

func (h *MarkerHandler) CreateMarker(c *gin.Context) {
	var input models.CreateMarkerInput

    if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("input error: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

	log.Printf("parsed input: %+v", input)

    tripID, err := uuid.Parse(input.TripID)
    if err != nil {
		log.Printf("invalid trip_id %q: %v", input.TripID, err)
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid trip_id"})
        return
    }

    marker := models.Marker{
        MarkerID:    uuid.New(),
        Location:    input.Location,
        Description: input.Description,
        Date:        input.Date,
        Latitude:    input.Latitude,
        Longitude:   input.Longitude,
        TripID:      tripID,
        CreatedBy:   input.CreatedBy, // from auth later
    }

    if err := h.repo.CreateMarker(c.Request.Context(), &marker); err != nil {
		log.Printf("db error: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
        return
    }
	
	c.JSON(http.StatusCreated, input)
}



func (h *MarkerHandler) GetMarkersByTrip(c *gin.Context) {
	userName := c.Param("username")

	trips, err := h.repo.GetUserTrips(c.Request.Context(), userName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, trips)
}
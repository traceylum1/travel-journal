package handlers

// import (
// 	"net/http"

// 	"github.com/gin-gonic/gin"
// 	"github.com/traceylum1/travel-journal/internal/models"
// 	"github.com/traceylum1/travel-journal/internal/repository"
// )

// type MarkerHandler struct {
// 	repo *repository.MarkerRepository
// }

// func NewMarkerHandler(repo *repository.MarkerRepository) *MarkerHandler {
// 	return &MarkerHandler{repo: repo}
// }

// func (h *MarkerHandler) CreateMarker(c *gin.Context) {
// 	var input models.Marker
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := h.repo.CreateMarker(c.Request.Context(), &input); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, input)
// }



// func (h *MarkerHandler) GetMarkersByTrip(c *gin.Context) {
// 	userName := c.Param("username")

// 	trips, err := h.repo.GetTrips(c.Request.Context(), userName)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, trips)
// }
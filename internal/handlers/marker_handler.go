package handlers

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/traceylum1/travel-journal/internal/repository"
)

type MarkerHandler struct {
	repo *repository.MarkerRepository
}

func NewMarkerHandler(repo *repository.MarkerRepository) *MarkerHandler {
	return &MarkerHandler{repo: repo}
}

func (h *MarkerHandler) CreateMarker() gin.HandlerFunc {
	return func(c *gin.Context) {
		var input models.CreateMarkerInput

		if err := c.ShouldBindJSON(&input); err != nil {
			log.Printf("input error: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("parsed input: %+v", input)

		markerID, err := h.repo.CreateMarker(c.Request.Context(), &input)
		if err != nil {
			log.Printf("db error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"marker_id": markerID,
		})
	}
}

func (h *MarkerHandler) UpdateMarker() gin.HandlerFunc {
	return func(c *gin.Context) {
		markerID, err := strconv.Atoi(c.Param("markerID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid marker id"})
			return
		}

		var input models.UpdateMarkerInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		input.ID = markerID

		if err := h.repo.UpdateMarker(c.Request.Context(), &input); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusNotFound, gin.H{"error": "marker not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "updated"})
	}
}

func (h *MarkerHandler) DeleteMarker() gin.HandlerFunc {
	return func(c *gin.Context) {
		markerID, err := strconv.Atoi(c.Param("markerID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid marker id"})
			return
		}

		if err := h.repo.DeleteMarker(c.Request.Context(), markerID); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusNotFound, gin.H{"error": "marker not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "deleted"})
	}
}

func (h *MarkerHandler) GetMarkersByTrip() gin.HandlerFunc {
	return func(c *gin.Context) {
		userName := c.Param("username")

		trips, err := h.repo.GetUserTrips(c.Request.Context(), userName)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}

		c.JSON(http.StatusOK, trips)
	}
}

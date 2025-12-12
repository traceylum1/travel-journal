package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/traceylum1/travel-journal/internal/repository"
)

type UserHandler struct {
	repo *repository.UserRepository
}

func NewUserHandler(repo *repository.UserRepository) *UserHandler {
	return &UserHandler{repo: repo}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.CreateUser(c.Request.Context(), &input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db error"})
		return
	}

	c.JSON(http.StatusCreated, input)
}



func (h *UserHandler) GetUserTrips(c *gin.Context) {
	userName := c.Param("username")

	trips, err := h.repo.GetTrips(c.Request.Context(), userName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, trips)
}
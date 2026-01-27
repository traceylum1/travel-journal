package handlers

import (
	"net/http"
	"log"
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/traceylum1/travel-journal/internal/repository"
	"github.com/traceylum1/travel-journal/internal/validation"
)


type UserHandler struct {
	repo *repository.UserRepository
}

func NewUserHandler(repo *repository.UserRepository) *UserHandler {
	return &UserHandler{repo: repo}
}


func (h *UserHandler) CreateUser(c *gin.Context) {
	var input models.CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if !validation.IsUsernameValid(input.Username) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "username must be 5 to 15 chars and contain only lowercase letters, numbers, or underscores",
		})
	}

	if !validation.IsPasswordValid(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "password must be 8 to 20 chars, include include upper, lower, digit, and special characters",
		})
	}

	userID, err := h.repo.CreateUser(c.Request.Context(), &input)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "username already exists"})
		return
	}

    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })

	c.JSON(http.StatusCreated, gin.H{
		"user": gin.H{
			"id": userID,
			"username": input.Username,
		},
	})
}

func (h *UserHandler) UserLogin(c *gin.Context) {
	var input models.LoginRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if !validation.IsUsernameValid(input.Username) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "username must be 5 to 15 chars and contain only lowercase letters, numbers, or underscores",
		})
	}

	if !validation.IsPasswordValid(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "password must be 8 to 20 chars, include include upper, lower, digit, and special characters",
		})
	}

	err := h.repo.ValidateUser(c.Request.Context(), input.Username, input.Password)
	if err != nil {
		if errors.Is(err, repository.ErrInvalidCredentials) {
			log.Printf("Validate error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "user credentials not valid"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to validate user"})
		return
	}

    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })

    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
}



func (h *UserHandler) GetUserTrips(c *gin.Context) {
	username := c.Param("username")

	trips, err := h.repo.GetTrips(c.Request.Context(), username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, trips)
}
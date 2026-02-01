package handlers

import (
	"net/http"
	"log"
	"errors"

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
	var input models.AuthenticationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if !validation.IsUsernameValid(input.Username) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "username must be 5 to 15 chars and contain only lowercase letters, numbers, or underscores",
		})
		return
	}

	if !validation.IsPasswordValid(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "password must be 8 to 20 chars, include include upper, lower, digit, and special characters",
		})
		return
	}

	if err := input.HashPassword(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	userID, err := h.repo.CreateUser(c.Request.Context(), &input)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrUserAlreadyExists):
			c.JSON(http.StatusConflict, gin.H{
				"error": "username already exists",
			})
		case errors.Is(err, repository.ErrInternal):
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "internal server error",
			})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "unexpected error",
			})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user_id": userID})
}

func (h *UserHandler) UserLogin(c *gin.Context) {
	var input models.AuthenticationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if !validation.IsUsernameValid(input.Username) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "username must be 5 to 15 chars and contain only lowercase letters, numbers, or underscores",
		})
		return
	}

	if !validation.IsPasswordValid(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "password must be 8 to 20 chars, include include upper, lower, digit, and special characters",
		})
		return
	}

	user, err := h.repo.GetUserByUsername(c.Request.Context(), input.Username)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			log.Printf("Username error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "username not found"})
			return
		}

		if err = user.ValidatePassword(input.Password); err != nil {
			// wrong password
			log.Printf("Password error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect password"})
			return
		}
		
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to validate user"})
		return
	}

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
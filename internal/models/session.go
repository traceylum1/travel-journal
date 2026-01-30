package models

import (
	"time"
	"github.com/gin-gonic/gin"
)

type Session struct {
	ID             string           `json:"session_id" db:"session_id"`
    CreatedAt      time.Time        `json:"created_at" db:"created_at"`
	LastActivityAt time.Time        `json:"last_activity_at" db:"last_activity_at"`
	Data           map[string]any   `json:"session_data" db:"session_data"`
}

func GetSession(c *gin.Context) *Session {
	if s, exists := c.Get("session"); exists {
		if session, ok := s.(*Session); ok {
			return session
		}
	}
	return nil
}
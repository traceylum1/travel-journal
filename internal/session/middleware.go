package session

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Required(m *Manager) gin.HandlerFunc {
	return func(c *gin.Context) {
		var session *Session

		log.Println("Validating cookie...")
		// Read From Cookie
		cookie, err := c.Cookie(m.cookieName)
		if err == nil {
			session, err = m.store.read(cookie)
			if err != nil {
				log.Printf("Failed to read session from store: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read session from store"})
			}
		}

		// If no session or not valid, delete cookie and log user out
		if session == nil || !m.validate(session) {
			c.SetCookieData(&http.Cookie{
				Name:   "session_id",
				Value:  "delete",
				Path:   "/",
				Domain:   "localhost",
				MaxAge:   -1,
				Secure:   true,
				HttpOnly: true,
				SameSite: http.SameSiteLaxMode,
				// Partitioned: true, // Go 1.22+
			})
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid session"})
		}

		// Attach session to context
		c.Set("session", session)
		c.Next()
	}
}

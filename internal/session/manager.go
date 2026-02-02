package session

import (
	"crypto/rand"
	"time"
	"encoding/base64"
	"io"
	"log"
	
	"github.com/gin-gonic/gin"
)



type Manager struct {
	store              Store
	idleExpiration     time.Duration
	absoluteExpiration time.Duration
	cookieName         string
}

func generateSessionId() string {
	id := make([]byte, 32)

	_, err := io.ReadFull(rand.Reader, id)
	if err != nil {
		panic("failed to generate session id")
	}

	return base64.RawURLEncoding.EncodeToString(id)
}


func newSession() *Session {
	return &Session{
		id:             generateSessionId(),
		data:           make(map[string]any),
		createdAt:      time.Now(),
		lastActivityAt: time.Now(),
	}
}


func NewSessionManager(
	store Store,
	gcInterval,
	idleExpiration,
	absoluteExpiration time.Duration,
	cookieName string) *Manager {

	m := &Manager{
		store:              store,
		idleExpiration:     idleExpiration,
		absoluteExpiration: absoluteExpiration,
		cookieName:         cookieName,
	}

	go m.gc(gcInterval)

	return m
}

func (m *Manager) gc(d time.Duration) {
	ticker := time.NewTicker(d)

	for range ticker.C {
		m.store.gc(m.idleExpiration, m.absoluteExpiration)
	}
}

func (m *Manager) validate(session *Session) bool {
	log.Println("session validate")
	if time.Since(session.createdAt) > m.absoluteExpiration ||
		time.Since(session.lastActivityAt) > m.idleExpiration {
        
        // Delete the session from the store
		err := m.store.destroy(session.id)
		if err != nil {
			panic(err)
		}

		return false
	}

	return true
}


func (m *Manager) save(session *Session) error {
	log.Println("session save")
	log.Println(session.id, session.createdAt)
	session.lastActivityAt = time.Now()

	err := m.store.write(session)
	if err != nil {
		return err
	}

	return nil
}


func (m *Manager) Create() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start the session
		session := newSession()

		// Create a new response writer
		sw := &sessionResponseWriter{
			ResponseWriter: c.Writer,
			sessionManager: m,
			c:              c,
		}

		// Replace original response writer with custom response writer
		c.Writer = sw

		// Add essential headers
		c.Header("Vary", "Cookie")
		c.Header("Cache-Control", `no-cache="Set-Cookie"`)

		// Save the session
		m.save(session)

		// Write the session cookie to the response if not already written
		sw.writeCookieIfNecessary()
	}
}
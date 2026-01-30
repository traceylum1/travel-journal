package middleware

import (
	"crypto/rand"
	"net/http"
	"time"
	"encoding/base64"
	"io"
	"log"
	"sync"

	"github.com/gin-gonic/gin"
)

func generateSessionId() string {
	id := make([]byte, 32)

	_, err := io.ReadFull(rand.Reader, id)
	if err != nil {
		panic("failed to generate session id")
	}

	return base64.RawURLEncoding.EncodeToString(id)
}

type Session struct {
	createdAt		time.Time
	lastActivityAt	time.Time
	id				string
	data			map[string]any
	mu				sync.RWMutex
}

type SessionStore interface {
	read(id string) (*Session, error)
	write(session *Session) error
	destroy(id string) error
	gc(idleExpiration, absoluteExpiration time.Duration) error
}

type SessionManager struct {
	store              SessionStore
	idleExpiration     time.Duration
	absoluteExpiration time.Duration
	cookieName         string
}

func newSession() *Session {
	return &Session{
		id:             generateSessionId(),
		data:           make(map[string]any),
		createdAt:      time.Now(),
		lastActivityAt: time.Now(),
	}
}

func (s *Session) Get(key string) any {
	return s.data[key]
}

func (s *Session) Put(key string, value any) {
	s.data[key] = value
}

func (s *Session) Delete(key string) {
	delete(s.data, key)
}


func NewSessionManager(
	store SessionStore,
	gcInterval,
	idleExpiration,
	absoluteExpiration time.Duration,
	cookieName string) *SessionManager {

	m := &SessionManager{
		store:              store,
		idleExpiration:     idleExpiration,
		absoluteExpiration: absoluteExpiration,
		cookieName:         cookieName,
	}

	go m.gc(gcInterval)

	return m
}

func (m *SessionManager) gc(d time.Duration) {
	ticker := time.NewTicker(d)

	for range ticker.C {
		m.store.gc(m.idleExpiration, m.absoluteExpiration)
	}
}

func (m *SessionManager) validate(session *Session) bool {
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

func (m *SessionManager) start(c *gin.Context) (*Session, *gin.Context) {
	var session *Session

    // Read From Cookie
	cookie, err := c.Cookie(m.cookieName)
	if err == nil {
		session, err = m.store.read(cookie)
		if err != nil {
			log.Printf("Failed to read session from store: %v", err)
		}
	}

    // Generate a new session
	if session == nil || !m.validate(session) {
		session = newSession()
	}

    // Attach session to context
	c.Set("session", session)

	return session, c
}


func (m *SessionManager) save(session *Session) error {
	session.lastActivityAt = time.Now()

	err := m.store.write(session)
	if err != nil {
		return err
	}

	return nil
}

func (m *SessionManager) migrate(session *Session) error {
	session.mu.Lock()
	defer session.mu.Unlock()

	err := m.store.destroy(session.id)
	if err != nil {
		return err
	}

	session.id = generateSessionId()

	return nil
}


func  (m *SessionManager) Handle() gin.HandlerFunc {
	return func(c *gin.Context) {

		// Start the session
		session, rws := m.start(c)

		// Create a new response writer
		sw := &sessionResponseWriter{
			ResponseWriter: c.Writer,
			sessionManager: m,
			c:              rws,
		}

		// Add essential headers
		c.Header("Vary", "Cookie")
		c.Header("Cache-Control", `no-cache="Set-Cookie"`)

		// Call the next handler
		c.Next()
		// Save the session
		m.save(session)

		// Write the session cookie to the response if not already written
		writeCookieIfNecessary(sw)
	}
}

type sessionResponseWriter struct {
	gin.ResponseWriter
	sessionManager *SessionManager
	c              *gin.Context
	done           bool
}

func (w *sessionResponseWriter) Write(b []byte) (int, error) {
	writeCookieIfNecessary(w)

	return w.ResponseWriter.Write(b)
}

func (w *sessionResponseWriter) WriteHeader(code int) {
	writeCookieIfNecessary(w)

	w.ResponseWriter.WriteHeader(code)
}

func (w *sessionResponseWriter) Unwrap() http.ResponseWriter {
	return w.ResponseWriter
}

func writeCookieIfNecessary(w *sessionResponseWriter) {
	if w.done {
		return
	}

	sessionAny, exists := w.c.Get("session")
	if !exists {
		return
	}

	session, ok := sessionAny.(*Session)
	if !ok {
		return
	}

	cookie := &http.Cookie{
		Name:     w.sessionManager.cookieName,
		Value:    session.id,
		Domain:   "localhost",
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
        Expires:  time.Now().Add(w.sessionManager.idleExpiration),
		MaxAge:   int(w.sessionManager.idleExpiration / time.Second),
	}

	http.SetCookie(w.ResponseWriter, cookie)

	w.done = true
}
package session

import (
	"net/http"
	"time"
	"log"
	
	"github.com/gin-gonic/gin"
)


type sessionResponseWriter struct {
	gin.ResponseWriter
	sessionManager *Manager
	c              *gin.Context
	status 			int
	done           bool
}

func (w *sessionResponseWriter) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	w.writeCookieIfNecessary()

	return w.ResponseWriter.Write(b)
}

func (w *sessionResponseWriter) WriteHeader(code int) {
	w.writeCookieIfNecessary()

	w.ResponseWriter.WriteHeader(code)
}

func (w *sessionResponseWriter) WriteHeaderNow() {
	if w.status == 0 {
		w.status = http.StatusOK
	}
	w.writeCookieIfNecessary()
	w.ResponseWriter.WriteHeaderNow()
}

func (w *sessionResponseWriter) Unwrap() http.ResponseWriter {
	return w.ResponseWriter
}

func (w *sessionResponseWriter) writeCookieIfNecessary() {
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

	log.Println("writing cookie")

	w.c.SetCookieData(&http.Cookie{
		Name:     w.sessionManager.cookieName,
		Value:    session.id,
		Domain:   "localhost",
		HttpOnly: true,
		Path:     "/",
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
        Expires:  time.Now().Add(w.sessionManager.idleExpiration),
		MaxAge:   int(w.sessionManager.idleExpiration / time.Second),
	})

	w.done = true
}
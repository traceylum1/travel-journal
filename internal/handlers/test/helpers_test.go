package handlers_test

import (
	"io"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/session"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func performRequest(handler gin.HandlerFunc, method, path, body string, params gin.Params) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	var bodyReader io.Reader
	if body != "" {
		bodyReader = strings.NewReader(body)
	}

	req := httptest.NewRequest(method, path, bodyReader)
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	c.Request = req
	c.Params = params

	handler(c)
	return w
}

func newTestSessionManager(t *testing.T) *session.Manager {
	t.Helper()
	return session.NewSessionManager(
		session.NewInMemorySessionStore(),
		time.Hour,
		time.Hour,
		time.Hour,
		"session",
	)
}

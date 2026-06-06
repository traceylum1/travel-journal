package handlers_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
)

func TestCurrentUser_NoCookie_Returns401(t *testing.T) {
	sm := newTestSessionManager(t)
	handler := handlers.NewUserHandler(nil)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)

	handler.CurrentUser(sm)(c)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestCurrentUser_ValidSession_Returns200(t *testing.T) {
	sm := newTestSessionManager(t)
	handler := handlers.NewUserHandler(nil)

	createW := httptest.NewRecorder()
	createC, _ := gin.CreateTestContext(createW)
	createC.Request = httptest.NewRequest(http.MethodPost, "/api/auth/login", nil)

	if err := sm.Create(createC, 42, "alice"); err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	cookie := createW.Result().Cookies()[0]

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req := httptest.NewRequest(http.MethodGet, "/api/auth/me", nil)
	req.AddCookie(cookie)
	c.Request = req

	handler.CurrentUser(sm)(c)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusOK, w.Body.String())
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}

	if body["user_id"] != float64(42) {
		t.Fatalf("user_id = %v, want 42", body["user_id"])
	}
	if body["username"] != "alice" {
		t.Fatalf("username = %v, want alice", body["username"])
	}
}

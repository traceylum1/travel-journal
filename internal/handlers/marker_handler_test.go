package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/traceylum1/travel-journal/internal/models"
)

type fakeMarkerRepo struct {
	createMarker func(ctx context.Context, m *models.CreateMarkerInput) (int, error)
	updateMarker func(ctx context.Context, m *models.UpdateMarkerInput) error
	deleteMarker func(ctx context.Context, markerID int) error
	getUserTrips func(ctx context.Context, username string) (*[]int, error)
}

func (f *fakeMarkerRepo) CreateMarker(ctx context.Context, m *models.CreateMarkerInput) (int, error) {
	return f.createMarker(ctx, m)
}

func (f *fakeMarkerRepo) UpdateMarker(ctx context.Context, m *models.UpdateMarkerInput) error {
	return f.updateMarker(ctx, m)
}

func (f *fakeMarkerRepo) DeleteMarker(ctx context.Context, markerID int) error {
	return f.deleteMarker(ctx, markerID)
}

func (f *fakeMarkerRepo) GetUserTrips(ctx context.Context, username string) (*[]int, error) {
	return f.getUserTrips(ctx, username)
}

const validCreateMarkerBody = `{
	"trip_id": 1,
	"location": "Paris",
	"description": "Eiffel Tower",
	"date": "2024-06-01",
	"latitude": 48.8584,
	"longitude": 2.2945,
	"created_by": "alice"
}`

const validUpdateMarkerBody = `{
	"location": "Lyon",
	"description": "Old town",
	"date": "2024-06-02"
}`

func TestCreateMarker_InvalidJSON_Returns400(t *testing.T) {
	handler := NewMarkerHandler(&fakeMarkerRepo{})

	w := performRequest(handler.CreateMarker(), http.MethodPost, "/api/protected/addMarker", `{`, nil)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusBadRequest, w.Body.String())
	}
}

func TestCreateMarker_RepoError_Returns500(t *testing.T) {
	repo := &fakeMarkerRepo{
		createMarker: func(ctx context.Context, m *models.CreateMarkerInput) (int, error) {
			return 0, errors.New("db down")
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(handler.CreateMarker(), http.MethodPost, "/api/protected/addMarker", validCreateMarkerBody, nil)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusInternalServerError, w.Body.String())
	}
}

func TestCreateMarker_Success_Returns201(t *testing.T) {
	repo := &fakeMarkerRepo{
		createMarker: func(ctx context.Context, m *models.CreateMarkerInput) (int, error) {
			if m.TripID != 1 || m.Location != "Paris" || m.CreatedBy != "alice" {
				t.Fatalf("unexpected input: %+v", m)
			}
			return 99, nil
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(handler.CreateMarker(), http.MethodPost, "/api/protected/addMarker", validCreateMarkerBody, nil)

	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusCreated, w.Body.String())
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if body["marker_id"] != float64(99) {
		t.Fatalf("marker_id = %v, want 99", body["marker_id"])
	}
}

func TestUpdateMarker_InvalidMarkerID_Returns400(t *testing.T) {
	handler := NewMarkerHandler(&fakeMarkerRepo{})

	w := performRequest(
		handler.UpdateMarker(),
		http.MethodPut,
		"/api/protected/marker/abc",
		validUpdateMarkerBody,
		gin.Params{{Key: "markerID", Value: "abc"}},
	)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusBadRequest, w.Body.String())
	}
}

func TestUpdateMarker_InvalidJSON_Returns400(t *testing.T) {
	handler := NewMarkerHandler(&fakeMarkerRepo{})

	w := performRequest(
		handler.UpdateMarker(),
		http.MethodPut,
		"/api/protected/marker/1",
		`{`,
		gin.Params{{Key: "markerID", Value: "1"}},
	)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusBadRequest, w.Body.String())
	}
}

func TestUpdateMarker_NotFound_Returns404(t *testing.T) {
	repo := &fakeMarkerRepo{
		updateMarker: func(ctx context.Context, m *models.UpdateMarkerInput) error {
			return pgx.ErrNoRows
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.UpdateMarker(),
		http.MethodPut,
		"/api/protected/marker/7",
		validUpdateMarkerBody,
		gin.Params{{Key: "markerID", Value: "7"}},
	)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusNotFound, w.Body.String())
	}
}

func TestUpdateMarker_Success_Returns200(t *testing.T) {
	repo := &fakeMarkerRepo{
		updateMarker: func(ctx context.Context, m *models.UpdateMarkerInput) error {
			if m.ID != 7 || m.Location != "Lyon" {
				t.Fatalf("unexpected input: %+v", m)
			}
			return nil
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.UpdateMarker(),
		http.MethodPut,
		"/api/protected/marker/7",
		validUpdateMarkerBody,
		gin.Params{{Key: "markerID", Value: "7"}},
	)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusOK, w.Body.String())
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if body["status"] != "updated" {
		t.Fatalf("status = %v, want updated", body["status"])
	}
}

func TestDeleteMarker_InvalidMarkerID_Returns400(t *testing.T) {
	handler := NewMarkerHandler(&fakeMarkerRepo{})

	w := performRequest(
		handler.DeleteMarker(),
		http.MethodDelete,
		"/api/protected/marker/abc",
		"",
		gin.Params{{Key: "markerID", Value: "abc"}},
	)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusBadRequest, w.Body.String())
	}
}

func TestDeleteMarker_NotFound_Returns404(t *testing.T) {
	repo := &fakeMarkerRepo{
		deleteMarker: func(ctx context.Context, markerID int) error {
			return pgx.ErrNoRows
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.DeleteMarker(),
		http.MethodDelete,
		"/api/protected/marker/3",
		"",
		gin.Params{{Key: "markerID", Value: "3"}},
	)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusNotFound, w.Body.String())
	}
}

func TestDeleteMarker_Success_Returns200(t *testing.T) {
	repo := &fakeMarkerRepo{
		deleteMarker: func(ctx context.Context, markerID int) error {
			if markerID != 3 {
				t.Fatalf("markerID = %d, want 3", markerID)
			}
			return nil
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.DeleteMarker(),
		http.MethodDelete,
		"/api/protected/marker/3",
		"",
		gin.Params{{Key: "markerID", Value: "3"}},
	)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusOK, w.Body.String())
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if body["status"] != "deleted" {
		t.Fatalf("status = %v, want deleted", body["status"])
	}
}

func TestGetMarkersByTrip_UserNotFound_Returns404(t *testing.T) {
	repo := &fakeMarkerRepo{
		getUserTrips: func(ctx context.Context, username string) (*[]int, error) {
			return nil, errors.New("user not found")
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.GetMarkersByTrip(),
		http.MethodGet,
		"/api/user/nobody",
		"",
		gin.Params{{Key: "username", Value: "nobody"}},
	)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusNotFound, w.Body.String())
	}
}

func TestGetMarkersByTrip_Success_Returns200(t *testing.T) {
	trips := []int{1, 2, 3}
	repo := &fakeMarkerRepo{
		getUserTrips: func(ctx context.Context, username string) (*[]int, error) {
			if username != "alice" {
				t.Fatalf("username = %q, want alice", username)
			}
			return &trips, nil
		},
	}
	handler := NewMarkerHandler(repo)

	w := performRequest(
		handler.GetMarkersByTrip(),
		http.MethodGet,
		"/api/user/alice",
		"",
		gin.Params{{Key: "username", Value: "alice"}},
	)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusOK, w.Body.String())
	}

	var body []float64
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if len(body) != 3 || body[0] != 1 || body[1] != 2 || body[2] != 3 {
		t.Fatalf("body = %v, want [1 2 3]", body)
	}
}

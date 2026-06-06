package handlers_test

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/traceylum1/travel-journal/internal/handlers"
	"github.com/traceylum1/travel-journal/internal/models"
)

type fakeTripRepo struct {
	createTrip   func(ctx context.Context, t *models.CreateTripInput) (int, error)
	getUserTrips func(ctx context.Context, userID string) (*[]int, error)
}

func (f *fakeTripRepo) CreateTrip(ctx context.Context, t *models.CreateTripInput) (int, error) {
	return f.createTrip(ctx, t)
}

func (f *fakeTripRepo) GetUserTrips(ctx context.Context, userID string) (*[]int, error) {
	return f.getUserTrips(ctx, userID)
}

const validCreateTripBody = `{
	"trip_name": "Summer in Europe",
	"start_date": "2024-06-01",
	"end_date": "2024-06-15",
	"description": "Backpacking",
	"created_by": "alice",
	"owner_id": 1
}`

func TestCreateTrip_InvalidJSON_Returns400(t *testing.T) {
	handler := handlers.NewTripHandler(&fakeTripRepo{})

	w := performRequest(handler.CreateTrip(), http.MethodPost, "/api/protected/createTrip", `{`, nil)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusBadRequest, w.Body.String())
	}
}

func TestCreateTrip_RepoError_Returns500(t *testing.T) {
	repo := &fakeTripRepo{
		createTrip: func(ctx context.Context, _ *models.CreateTripInput) (int, error) {
			return 0, errors.New("db down")
		},
	}
	handler := handlers.NewTripHandler(repo)

	w := performRequest(handler.CreateTrip(), http.MethodPost, "/api/protected/createTrip", validCreateTripBody, nil)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusInternalServerError, w.Body.String())
	}
}

func TestCreateTrip_Success_Returns201(t *testing.T) {
	repo := &fakeTripRepo{
		createTrip: func(ctx context.Context, input *models.CreateTripInput) (int, error) {
			if input.TripName != "Summer in Europe" || input.CreatedBy != "alice" || input.OwnerID != 1 {
				t.Fatalf("unexpected input: %+v", input)
			}
			return 42, nil
		},
	}
	handler := handlers.NewTripHandler(repo)

	w := performRequest(handler.CreateTrip(), http.MethodPost, "/api/protected/createTrip", validCreateTripBody, nil)

	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusCreated, w.Body.String())
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("json.Unmarshal() error = %v", err)
	}
	if body["trip_id"] != float64(42) {
		t.Fatalf("trip_id = %v, want 42", body["trip_id"])
	}
}

func TestGetUserTrips_NotFound_Returns404(t *testing.T) {
	repo := &fakeTripRepo{
		getUserTrips: func(ctx context.Context, userID string) (*[]int, error) {
			return nil, errors.New("not found")
		},
	}
	handler := handlers.NewTripHandler(repo)

	w := performRequest(
		handler.GetUserTrips(),
		http.MethodGet,
		"/api/user/nobody",
		"",
		gin.Params{{Key: "username", Value: "nobody"}},
	)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d; body = %s", w.Code, http.StatusNotFound, w.Body.String())
	}
}

func TestGetUserTrips_Success_Returns200(t *testing.T) {
	trips := []int{10, 20}
	repo := &fakeTripRepo{
		getUserTrips: func(ctx context.Context, userID string) (*[]int, error) {
			if userID != "alice" {
				t.Fatalf("userID = %q, want alice", userID)
			}
			return &trips, nil
		},
	}
	handler := handlers.NewTripHandler(repo)

	w := performRequest(
		handler.GetUserTrips(),
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
	if len(body) != 2 || body[0] != 10 || body[1] != 20 {
		t.Fatalf("body = %v, want [10 20]", body)
	}
}

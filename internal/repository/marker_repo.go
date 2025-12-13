package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
	"github.com/google/uuid"
)

type MarkerRepository struct {
	db *pgxpool.Pool
}

func NewMarkerRepository(db *pgxpool.Pool) *MarkerRepository {
	return &MarkerRepository{db: db}
}

func (r *MarkerRepository) CreateMarker(ctx context.Context, m *models.Marker) error {
	_, err := r.db.Exec(
        context.Background(), 
        `INSERT INTO markers (
			marker_id, 
			location, 
			description,
			date,
			latitude,
			longitude,
			trip_id,
			created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    	m.MarkerID, m.Location, m.Description, m.Date, m.Latitude, m.Longitude, m.TripID, m.CreatedBy,
        )
	if err != nil {
		fmt.Fprintf(os.Stderr, "Insert marker failed: %v\n", err)
		return err
	}
	return nil
}

func (r *MarkerRepository) GetUserTrips(ctx context.Context, username string) (*[]uuid.UUID, error) {
	var trips []uuid.UUID
	err := r.db.QueryRow(
		ctx,
		`SELECT trips FROM users WHERE username = $1`,
		username,
	).Scan(&trips)

	return &trips, err
}
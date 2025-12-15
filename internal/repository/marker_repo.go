package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
)

type MarkerRepository struct {
	db *pgxpool.Pool
}

func NewMarkerRepository(db *pgxpool.Pool) *MarkerRepository {
	return &MarkerRepository{db: db}
}

func (r *MarkerRepository) CreateMarker(ctx context.Context, m *models.CreateMarkerInput) error {
	_, err := r.db.Exec(
        context.Background(), 
        `INSERT INTO markers (
			trip_id,
			location, 
			description,
			date,
			latitude,
			longitude,
			created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    	m.TripID, m.Location, m.Description, m.Date, m.Latitude, m.Longitude, m.CreatedBy,
        )
	if err != nil {
		fmt.Fprintf(os.Stderr, "Insert marker failed: %v\n", err)
		return err
	}
	return nil
}

func (r *MarkerRepository) GetUserTrips(ctx context.Context, username string) (*[]int, error) {
	var trips []int
	err := r.db.QueryRow(
		ctx,
		`SELECT trips FROM users WHERE username = $1`,
		username,
	).Scan(&trips)

	return &trips, err
}
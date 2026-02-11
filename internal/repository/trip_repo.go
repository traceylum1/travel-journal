package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
)

type TripRepository struct {
	db *pgxpool.Pool
}

func NewTripRepository(db *pgxpool.Pool) *TripRepository {
	return &TripRepository{db: db}
}

func (r *TripRepository) CreateTrip(ctx context.Context, t *models.CreateTripInput) error {
	_, err := r.db.Exec(
        context.Background(), 
        `INSERT INTO trips (
			trip_name, 
			start_date,
			end_date,
			description,
			created_by)
        VALUES ($1, $2, $3, $4, $5)`,
    	t.TripName, t.StartDate, t.EndDate, t.Description, t.CreatedBy,
        )
	if err != nil {
		fmt.Fprintf(os.Stderr, "create trip failed: %v\n", err)
		return err
	}
	return nil
}

func (r *TripRepository) GetUserTrips(ctx context.Context, userID string) (*[]int, error) {
	var trips []int
	err := r.db.QueryRow(
		ctx,
		`SELECT * FROM trips WHERE user_id = $1`,
		userID,
	).Scan(&trips)

	return &trips, err
}
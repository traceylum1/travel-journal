package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
)

type MarkerRepository struct {
	db *pgxpool.Pool
}

func NewMarkerRepository(db *pgxpool.Pool) *MarkerRepository {
	return &MarkerRepository{db: db}
}

func (r *MarkerRepository) CreateMarker(ctx context.Context, m *models.CreateMarkerInput) (int, error) {
	var markerID int
	err := r.db.QueryRow(
		ctx,
		`INSERT INTO markers (
			trip_id,
			location, 
			description,
			date,
			latitude,
			longitude,
			created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING marker_id`,
		m.TripID, m.Location, m.Description, m.Date, m.Latitude, m.Longitude, m.CreatedBy,
	).Scan(&markerID)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Insert marker failed: %v\n", err)
		return 0, err
	}
	return markerID, nil
}

func (r *MarkerRepository) UpdateMarker(ctx context.Context, m *models.UpdateMarkerInput) error {
	cmd, err := r.db.Exec(
		ctx,
		`UPDATE markers
		 SET location = $1,
		     description = $2,
		     date = $3
		 WHERE marker_id = $4`,
		m.Location, m.Description, m.Date, m.ID,
	)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *MarkerRepository) DeleteMarker(ctx context.Context, markerID int) error {
	cmd, err := r.db.Exec(
		ctx,
		`DELETE FROM markers WHERE marker_id = $1`,
		markerID,
	)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
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

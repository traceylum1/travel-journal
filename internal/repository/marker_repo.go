package repository

// import (
// 	"context"
// 	"fmt"
// 	"os"

// 	"github.com/jackc/pgx/v5/pgxpool"
// 	"github.com/traceylum1/travel-journal/internal/models"
// )

// type MarkerRepository struct {
// 	db *pgxpool.Pool
// }

// func NewMarkerRepository(db *pgxpool.Pool) *MarkerRepository {
// 	return &MarkerRepository{db: db}
// }

// func (r *MarkerRepository) CreateMarker(ctx context.Context, u *models.Marker) error {
// 	_, err := r.db.Exec(
//         context.Background(), 
//         `INSERT INTO markers (username, password, trips)
//         VALUES ($1, $2, $3)`,
//     	u.UserName, u.Password, u.Trips,
//         )
// 	if err != nil {
// 		fmt.Fprintf(os.Stderr, "Insert user failed: %v\n", err)
// 		return err
// 	}
// 	return nil
// }

// func (r *MarkerRepository) GetByTripId(ctx context.Context, id int64) (*models.Marker, error) {
// 	var u models.User
// 	err := r.db.QueryRow(
// 		ctx,
// 		`SELECT id, name, email FROM users WHERE id = $1`,
// 		id,
// 	).Scan(&u.ID, &u.Name, &u.Email)

// 	return &u, err
// }
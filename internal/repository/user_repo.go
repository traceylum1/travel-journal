package repository

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(ctx context.Context, u *models.CreateUserInput) error {
	_, err := r.db.Exec(
        context.Background(), 
        `INSERT INTO users (username, password, trips)
        VALUES ($1, $2, $3)`,
    	u.Username, u.Password, u.UserTrips,
        )
	if err != nil {
		fmt.Fprintf(os.Stderr, "Create new user failed: %v\n", err)
	}
	return err
}

func (r *UserRepository) GetTrips(ctx context.Context, userName string) (*[]string, error) {
	var trips []string
	err := r.db.QueryRow(
		ctx,
		`SELECT trips FROM users WHERE username=$1`,
		userName,
	).Scan(&trips)

	return &trips, err
}
package repository

import (
	"context"
	"fmt"
	"os"
	"errors"

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


func (r *UserRepository) ValidateUser(
	ctx context.Context,
	username string,
	password string,
) error {
	var exists bool

	err := r.db.QueryRow(
		ctx,
		`SELECT EXISTS (
			SELECT 1
			FROM users
			WHERE username = $1 AND password = $2
		);`,
		username,
		password,
	).Scan(&exists)

	if err != nil {
		// database / query failure
		return err
	}

	if !exists {
		// user not found or invalid credentials
		return errors.New("invalid username or password")
	}

	return nil
}


func (r *UserRepository) GetTrips(ctx context.Context, username string) (*[]string, error) {
	var trips []string
	err := r.db.QueryRow(
		ctx,
		`SELECT trips FROM users WHERE username=$1`,
		username,
	).Scan(&trips)

	return &trips, err
}
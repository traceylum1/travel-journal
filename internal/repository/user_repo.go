package repository

import (
	"context"
	"fmt"
	"os"
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(
	ctx context.Context, 
	u *models.AuthenticationInput,
) (int, error) {
	var userID int

	err := r.db.QueryRow(
        ctx, 
        `INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
		RETURNING user_id`,
    	u.Username, u.Password,
    ).Scan(&userID)
	
	if err != nil {
        var pgErr *pgconn.PgError
        // Check if it's a PostgreSQL error
        if errors.As(err, &pgErr) {
            // 23505 is the code for unique_violation
            if pgErr.Code == "23505" {
                return 0, fmt.Errorf("duplicate username: %w", ErrUserAlreadyExists)
            }
        }
        return 0, fmt.Errorf("create user: %w", ErrInternal)
    }

	return userID, nil
}


func (r *UserRepository) GetUserByUsername(
	ctx context.Context,
	username string,
) (models.User, error) {
	var user models.User

	err := r.db.QueryRow(
		ctx,
		`SELECT user_id, username, password_hash, created_at
		 FROM users
		 WHERE username = $1`,
		username,
	).Scan(
		&user.ID,
		&user.Username,
		&user.PasswordHash,
		&user.CreatedAt,
	)

	if err != nil {
		// user does not exist
		if errors.Is(err, pgx.ErrNoRows) {
			return models.User{}, fmt.Errorf("get user: %w", ErrUserNotFound)
		}
		return models.User{}, fmt.Errorf("get user: %w", ErrInternal)
	}

	return user, nil
}


func (r *UserRepository) GetTrips(
	ctx context.Context, 
	username string,
) (*[]string, error) {
	var trips []string
	err := r.db.QueryRow(
		ctx,
		`SELECT trips FROM users WHERE username=$1`,
		username,
	).Scan(&trips)

	if err != nil {
		return nil, fmt.Errorf("get trips: %w", ErrInternal)
	}

	return &trips, nil
}
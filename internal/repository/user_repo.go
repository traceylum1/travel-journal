package repository

import (
	"context"
	"fmt"
	"os"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/traceylum1/travel-journal/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

var ErrInvalidCredentials = errors.New("invalid credentials")

func (r *UserRepository) CreateUser(ctx context.Context, u *models.CreateUserInput) error {
	// Hash password
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(u.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(
        context.Background(), 
        `INSERT INTO users (username, password_hash)
        VALUES ($1, $2)`,
    	u.Username, hash,
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
	var passwordHash string

	err := r.db.QueryRow(
		ctx,
		`SELECT password_hash
		 FROM users
		 WHERE username = $1`,
		username,
	).Scan(&passwordHash)

	if err != nil {
		// user does not exist
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrInvalidCredentials
		}
		return err
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(password),
	)

	if err != nil {
		// wrong password
		return ErrInvalidCredentials
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
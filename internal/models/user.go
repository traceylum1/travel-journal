package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

// AuthenticationInput represents the user input data sent to the backend to login or create the user
type AuthenticationInput struct {
	Username    string  `json:"username" db:"username" binding:"required"`
    Password    string  `json:"password" db:"password" binding:"required"`
}

func (a *AuthenticationInput) HashPassword() error {
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(a.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}
	a.Password = string(hash)
	return err
}

// User represents the stored data about a user
type User struct {
    ID				int         `json:"user_id" db:"user_id"`
	Username		string      `json:"username" db:"username"`
    PasswordHash    string		`json:"password_hash" db:"password_hash"`
    CreatedAt		time.Time   `json:"created_at" db:"created_at"`
}

func (user *User) ValidatePassword(password string) error {
	return bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	)
}
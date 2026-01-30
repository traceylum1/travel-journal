package models

import "time"

// CreateUserInput represents the user input data sent to the backend to create the user
type CreateUserInput struct {
	Username    string  `json:"username" db:"username"`
    Password    string  `json:"password" db:"password"`
}

// User represents the stored data about a user
type User struct {
    ID          int         `json:"user_id" db:"user_id"`
	Username    string      `json:"username" db:"username"`
    Password    string      `json:"password" db:"password"`
    CreatedAt   time.Time   `json:"created_at" db:"created_at"`
}

// LoginRequest represents the user input data sent to the backend to validate login credentials
type LoginRequest struct {
	Username string `json:"username" db:"username" binding:"required"`
	Password string `json:"password" db:"password" binding:"required"`
}

package models

import "time"

// CreateUserInput represents the user input data sent to the backend to create the user
type CreateUserInput struct {
	Username    string  `json:"username" db:"username"`
    Password    string  `json:"password" db:"username"`
}

// User represents the stored data about a user
type User struct {
    ID          int         `json:"user_id" db:"user_id"`
	Username    string      `json:"username" db:"username"`
    Password    string      `json:"password" db:"password"`
	UserTrips   []int       `json:"user_trips" db:"user_trips"`
    CreatedAt   time.Time   `json:"created_at" db:"created_at"`
}

// LoginRequest represents the user input data sent to the backend to validate login credentials
type LoginRequest struct {
	Username string `json:"username" db:"username" binding:"required"`
	Password string `json:"password" db:"password" binding:"required"`
}

// CreateMarkerInput represents the user input data sent to the backend to create the marker
type CreateMarkerInput struct {
    TripID      int         `json:"trip_id" db:"trip_id"`
    Location    string      `json:"location" db:"location"`
    Description string      `json:"description" db:"description"`
    Date        DateOnly    `json:"date" db:"date"`
    Latitude    float64     `json:"latitude" db:"latitude"`
    Longitude   float64     `json:"longitude" db:"longitude"`
    CreatedBy   string      `json:"created_by" db:"created_by"`
}

// Marker represents the stored data about a marker that was placed on the map
type Marker struct {
    ID          int         `json:"marker_id" db:"marker_id"`
    TripID      int         `json:"trip_id" db:"trip_id"`
    Location    string      `json:"location" db:"location"`
    Description string      `json:"description" db:"description"`
    Date        DateOnly    `json:"date" db:"date"`
    Latitude    float64     `json:"latitude" db:"latitude"`
    Longitude   float64     `json:"longitude" db:"longitude"`
    CreatedBy   string      `json:"created_by" db:"created_by"`
}

// CreateTripInput represents the user input data sent to the backend to create the marker
type CreateTripInput struct {
    TripName    string      `json:"trip_name" db:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date" db:"start_date"`
    EndDate     DateOnly    `json:"end_date" db:"end_date"`
    Description string      `json:"description" db:"description"`
    CreatedBy   string      `json:"created_by" db:"created_by"`
}

// Trip represents the stored data about a trip that was created
type Trip struct {
    ID          int         `json:"trip_id" db:"trip_id"`
    TripName    string      `json:"trip_name" db:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date" db:"start_date"`
    EndDate     DateOnly    `json:"end_date" db:"end_date"`
    Description string      `json:"description" db:"description"`
    CreatedBy   string      `json:"created_by" db:"created_by"`
}

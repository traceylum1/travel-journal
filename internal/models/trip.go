package models

import "time"

// CreateTripInput represents the user input data sent to the backend to create the marker
type CreateTripInput struct {
    TripName    string      `json:"trip_name" db:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date" db:"start_date"`
    EndDate     DateOnly    `json:"end_date" db:"end_date"`
    Description string      `json:"description" db:"description"`
    CreatedBy   int         `json:"created_by" db:"created_by"`
}

// Trip represents the stored data about a trip that was created
type Trip struct {
    ID          int         `json:"trip_id" db:"trip_id"`
    TripName    string      `json:"trip_name" db:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date" db:"start_date"`
    EndDate     DateOnly    `json:"end_date" db:"end_date"`
    Description string      `json:"description" db:"description"`
    CreatedBy   int         `json:"created_by" db:"created_by"`
}

type TripMembership struct {
    TripID      int         `json:"trip_id" db:"trip_id"`
    UserID      int         `json:"user_id" db:"user_id"`
    Role        string      `json:"role" db:"role"`
    JoinedAt    time.Time   `json:"created_at" db:"created_at"`
}
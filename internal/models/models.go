package models

import (
    "github.com/google/uuid"
)

type User struct {
	UserName     string  `json:"username"`
    Password    string `json:"password"`
	Trips []uuid.UUID `json:"trips"`
}

// marker represents data about a marker that was placed on the map
type Marker struct {
    MarkerID     uuid.UUID  `json:"marker_id"`
    Location string  `json:"location"`
    Description  string `json:"description"`
    Date DateOnly `json:"date"`
    Latitude float64 `json:"latitutde"`
    Longitude float64 `json:"longitude"`
	TripID  uuid.UUID `json:"trip_id"`
    CreatedBy string `json:"created_by"`
}

type CreateMarkerInput struct {
    Location    string  `json:"location"`
    Description string  `json:"description"`
    Date        DateOnly `json:"date"`
    Latitude    float64 `json:"latitude"`
    Longitude   float64 `json:"longitude"`
    TripID      string  `json:"trip_id"`
    CreatedBy   strong  `json:""`
}

type Trip struct {
	TripID  uuid.UUID  `json:"trip_id"`
    TripName    string  `json:"trip_name"`
	StartDate   DateOnly	`json:"start_date"`
    EndDate DateOnly  `json:"end_date"`
    Description string `json:"description"`
	Markers []uuid.UUID `json:"markers"`
}

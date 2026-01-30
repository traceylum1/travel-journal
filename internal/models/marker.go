package models

// CreateMarkerInput represents the user input data sent to the backend to create the marker
type CreateMarkerInput struct {
    TripID      int         `json:"trip_id" db:"trip_id"`
    Location    string      `json:"location" db:"location"`
    Description string      `json:"description" db:"description"`
    Date        DateOnly    `json:"date" db:"date"`
    Latitude    float64     `json:"latitude" db:"latitude"`
    Longitude   float64     `json:"longitude" db:"longitude"`
    CreatedBy   int         `json:"created_by" db:"created_by"`
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
    CreatedBy   int         `json:"created_by" db:"created_by"`
}

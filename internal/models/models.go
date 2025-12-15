package models

// User represents the stored data about a user
type User struct {
    UserID      int     `json:"user_id"`
	Username    string  `json:"username"`
    Password    string  `json:"password"`
	UserTrips   []int   `json:"user_trips"`
}

// CreateUserInput represents the input data sent to the backend to create the user
type CreateUserInput struct {
	Username    string  `json:"username"`
    Password    string  `json:"password"`
	UserTrips   []int   `json:"user_trips"`
}

// Marker represents the stored data about a marker that was placed on the map
type Marker struct {
    MarkerID    int         `json:"marker_id"`
    TripID      int         `json:"trip_id"`
    Location    string      `json:"location"`
    Description string      `json:"description"`
    Date        DateOnly    `json:"date"`
    Latitude    float64     `json:"latitutde"`
    Longitude   float64     `json:"longitude"`
    CreatedBy   string      `json:"created_by"`
}

// CreateMarkerInput represents the input data sent to the backend to create the marker
type CreateMarkerInput struct {
    TripID      int         `json:"trip_id"`
    Location    string      `json:"location"`
    Description string      `json:"description"`
    Date        DateOnly    `json:"date"`
    Latitude    float64     `json:"latitude"`
    Longitude   float64     `json:"longitude"`
    CreatedBy   string      `json:"created_by"`
}

// Trip represents the stored data about a trip that was created
type Trip struct {
    TripID      int         `json:"trip_id"`
    TripName    string      `json:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date"`
    EndDate     DateOnly    `json:"end_date"`
    Description string      `json:"description"`
    CreatedBy   string      `json:"created_by"`
}

// CreateTripInput represents the input data sent to the backend to create the marker
type CreateTripInput struct {
    TripName    string      `json:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date"`
    EndDate     DateOnly    `json:"end_date"`
    Description string      `json:"description"`
    CreatedBy   string      `json:"created_by"`
}

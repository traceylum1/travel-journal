package models

type User struct {
    UserID      int     `json:"user_id"`
	UserName    string  `json:"username"`
    Password    string  `json:"password"`
	UserTrips   []int   `json:"user_trips"`
}

// marker represents data about a marker that was placed on the map
type Marker struct {
    TripID      int         `json:"trip_id"`
    Location    string      `json:"location"`
    Description string      `json:"description"`
    Date        DateOnly    `json:"date"`
    Latitude    float64     `json:"latitutde"`
    Longitude   float64     `json:"longitude"`
    CreatedB    string      `json:"created_by"`
}

type CreateMarkerInput struct {
    TripID      int         `json:"trip_id"`
    Location    string      `json:"location"`
    Description string      `json:"description"`
    Date        DateOnly    `json:"date"`
    Latitude    float64     `json:"latitude"`
    Longitude   float64     `json:"longitude"`
    CreatedBy   string      `json:"created_by"`
}

type Trip struct {
    TripName    string      `json:"trip_name"`
    TripMarkers []int       `json:"trip_markers"`
	StartDate   DateOnly	`json:"start_date"`
    EndDate     DateOnly    `json:"end_date"`
    Description string      `json:"description"`
    CreatedBy   string      `json:"created_by"`
}

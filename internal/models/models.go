package models

type User struct {
	UserName     string  `json:"username"`
    Password    string `json:"password"`
	Trips []string `json:"trips"`
}

// marker represents data about a marker that was placed on the map
type Marker struct {
    MarkerID     string  `json:"markerid"`
    Location string  `json:"location"`
    Description  string `json:"description"`
    Date string `json:"date"`
    Latitude string `json:"latitutde"`
    Longitude string `json:"longitude"`
	TripID string `json:"tripid"`
    CreatedBy string `json:"createdby"`
}

type Trip struct {
	TripID  string  `json:"tripid"`
    TripName    string  `json:"tripname"`
	StartDate   string	`json:"startdate"`
    EndDate string  `json:"enddate"`
    Description string `json:"description"`
	Markers []string `json:"markers"`
}

// album represents data about a record album.
type Album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}
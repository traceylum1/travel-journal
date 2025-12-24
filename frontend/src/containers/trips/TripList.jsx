
function TripList({setTripDisplay}) {
    return (
        <div className="trip-list">
            <h2>Your Trips</h2>
            <ul className="trip-items">
                <li onClick={() => setTripDisplay("Belize")}>Belize</li>
                <li onClick={() => setTripDisplay("Kenya")}>Kenya</li>
                <li onClick={() => setTripDisplay("Taiwan")}>Taiwan</li>
            </ul>
        </div>
    )
}

export default TripList;
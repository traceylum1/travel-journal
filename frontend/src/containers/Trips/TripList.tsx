import { TripListProps } from '../../Types/Props';
import CreateTripBtn from '../Controls/CreateTrip/CreateTripBtn';


function TripList({setTripDisplay}: TripListProps) {

    return (
        <div className="trip-list">
            <div className="trip-list-header">
                <h2>Your Trips</h2>
                <CreateTripBtn/>
            </div>
            
            <ul className="trip-items">
                <li onClick={() => setTripDisplay("Belize")}>Belize</li>
                <li onClick={() => setTripDisplay("Kenya")}>Kenya</li>
                <li onClick={() => setTripDisplay("Taiwan")}>Taiwan</li>
            </ul>
        </div>
    )
}

export default TripList;
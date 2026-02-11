import AddMarkerBtn from '../Controls/AddMarkerBtn';
import { TripProps } from '../../Types/Props';

function Trip({tripDisplay, addMarker, setAddMarker}: TripProps) {


    return (
        <div className="trip-display">
            <div className="trip-display-header">
                <h2>{tripDisplay}</h2>
                <AddMarkerBtn
                    addMarker={addMarker}
                    setAddMarker={setAddMarker}
                />
            </div>
        </div>
    )
}

export default Trip;
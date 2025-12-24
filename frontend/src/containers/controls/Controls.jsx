import AddMarkerBtn from './AddMarkerBtn';
import CreateTripBtn from './CreateTrip/CreateTripBtn';

function Controls({ addMarker, setAddMarker }) {

    return (
        <div id="controls">
          <AddMarkerBtn
            addMarker={addMarker}
            setAddMarker={setAddMarker}
          />

          <CreateTripBtn/>

        </div>
    )
}

export default Controls
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

          <button className="control-button">
            other button
          </button>

          <button className="control-button">
            other button
          </button>

          <button className="control-button">
            other button
          </button>

        </div>
    )
}

export default Controls
import AddMarkerBtn from './AddMarkerBtn';

function Controls({ addMarker, setAddMarker }) {

    return (
        <div id="controls">
          <AddMarkerBtn
            addMarker={addMarker}
            setAddMarker={setAddMarker}
          />

          <button className="control-button">
            other button
          </button>

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
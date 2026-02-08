import AddMarkerBtn from "../Controls/AddMarkerBtn";


function Trip({tripDisplay, addMarker, setAddMarker}) {
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
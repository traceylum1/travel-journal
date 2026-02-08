// BUG: marker color buggy, doesn't change back to default when clicking on map to add marker, even tho the useState value is correctly switched

import { AddMarkerBtnProps } from "../../Types/Props";

function AddMarkerBtn({addMarker, setAddMarker}: AddMarkerBtnProps) {
    
    return (
        <div>
            <button className="control-button"
                onClick={() => setAddMarker(prev => !prev)}
                style={{
                    backgroundColor: addMarker ? "gray" : "white",
                }}
            >
                add marker
            </button>
        </div>
    )

}

export default AddMarkerBtn;
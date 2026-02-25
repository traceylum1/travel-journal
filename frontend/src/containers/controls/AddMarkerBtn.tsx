// BUG: marker color buggy, doesn't change back to default when clicking on map to add marker, even tho the useState value is correctly switched

import { AddMarkerBtnProps } from '../../Types/Props';

function AddMarkerBtn({addMarker, setAddMarker}: AddMarkerBtnProps) {
    
    return (
        <div className="w-28">
            <button className={`control-button w-full ${addMarker ? "border-zinc-600 bg-zinc-400 text-white hover:bg-zinc-500" : ""}`}
                onClick={() => setAddMarker(prev => !prev)}
            >
                Add marker
            </button>
        </div>
    )

}

export default AddMarkerBtn;
function AddMarkerBtn({addMarker, setAddMarker}) {
    return (
        <div>
            {/* description:
            <form>
                <input id="popup-input">
                </input>
            </form> */}
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
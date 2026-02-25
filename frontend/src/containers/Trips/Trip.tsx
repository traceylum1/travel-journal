import AddMarkerBtn from '../controls/AddMarkerBtn';
import { TripProps } from '../../Types/Props';

function Trip({tripDisplay, addMarker, setAddMarker}: TripProps) {


    return (
        <section className="flex flex-1 flex-col rounded-xl bg-zinc-100 shadow-sm">
            <div className="flex items-center justify-between p-3">
                <h2 className="m-0 text-lg font-semibold text-zinc-900">{tripDisplay}</h2>
                <AddMarkerBtn
                    addMarker={addMarker}
                    setAddMarker={setAddMarker}
                />
            </div>
        </section>
    )
}

export default Trip;
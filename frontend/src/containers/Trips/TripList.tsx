import { TripListProps } from '../../Types/Props';
import CreateTripBtn from '../controls/CreateTrip/CreateTripBtn';


function TripList({setTripDisplay}: TripListProps) {

    return (
        <section className="flex min-h-0 flex-1 flex-col rounded-xl bg-zinc-100 shadow-sm">
            <div className="flex items-center justify-between p-3">
                <h2 className="m-0 text-lg font-semibold text-zinc-900">Your Trips</h2>
                <CreateTripBtn/>
            </div>
            
            <ul className="m-0 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
                <li className="cursor-pointer rounded-md px-3 py-2 text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900" onClick={() => setTripDisplay("Belize")}>Belize</li>
                <li className="cursor-pointer rounded-md px-3 py-2 text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900" onClick={() => setTripDisplay("Kenya")}>Kenya</li>
                <li className="cursor-pointer rounded-md px-3 py-2 text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900" onClick={() => setTripDisplay("Taiwan")}>Taiwan</li>
            </ul>
        </section>
    )
}

export default TripList;
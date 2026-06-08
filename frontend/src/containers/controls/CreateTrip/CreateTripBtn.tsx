import { useState } from 'react';
import CountryList from './CountryList';
import DialogueBox from './DialogueBox';
import apiCalls from '../../../Requests/apiCalls';
import { useAuth } from '../../../context/useAuth';
import { CreateTripBtnProps, TripListItem } from '../../../Types/Props';

function CreateTripBtn({ setTripList, setTripDisplay }: CreateTripBtnProps) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInput(value);
  }

  const nowUtc = new Date();
  // Get the date part (YYYY-MM-DD)
  const formattedDateUtc = nowUtc.toISOString().split('T')[0];

  function resetCreateTripForm() {
    setTripName("");
    setInput("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setErrorMessage("");
  }

  async function handleCreateTrip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await apiCalls.createTrip({
      tripName: tripName.trim(),
      description: description.trim(),
      startDate: startDate || formattedDateUtc,
      endDate: endDate || formattedDateUtc,
      createdBy: user?.username ?? "",
      ownerId: user?.userId ?? NaN,
    });

    if (!result.success) {
      const message = "message" in result && result.message ? result.message : "Unable to create trip right now.";
      setErrorMessage(message);
      setIsSubmitting(false);
      return;
    }

    const newTrip: TripListItem = {
      trip_id: result.tripId ?? Date.now(),
      trip_name: tripName.trim(),
      description: description.trim(),
      start_date: startDate || formattedDateUtc,
      end_date: endDate || formattedDateUtc,
      created_by: user?.username ?? "",
      owner_id: user?.userId ?? 0,
    };

    setTripList((previousTrips) => [...previousTrips, newTrip]);
    setTripDisplay(newTrip);
    setIsSubmitting(false);
    setIsDialogOpen(false);
    resetCreateTripForm();
  }

  const dialogueContent = 
    <form className="space-y-4" onSubmit={handleCreateTrip}>
      <div className="space-y-1">
        <label htmlFor="trip-name" className="text-sm font-medium text-zinc-700">Trip name</label>
        <textarea id="trip-name" name="tripName" rows={2} value={tripName} onChange={(e) => setTripName(e.target.value)} className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"></textarea>
      </div>

      <div className="relative space-y-1">
        <label htmlFor="country-name" className="text-sm font-medium text-zinc-700">Country</label>
        <input id="country-name" value={input} className="country-name w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" onInput={handleInput} />
        <CountryList input={input} setInput={setInput} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="trip-start" className="text-sm font-medium text-zinc-700">Start date</label>
          <input id="trip-start" type="date" value={startDate || formattedDateUtc} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" />
        </div>

        <div className="space-y-1">
          <label htmlFor="trip-end" className="text-sm font-medium text-zinc-700">End date</label>
          <input id="trip-end" type="date" value={endDate || formattedDateUtc} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70" />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="trip-description" className="text-sm font-medium text-zinc-700">Description</label>
        <textarea id="trip-description" name="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"></textarea>
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <div className="flex justify-end">
        <button className="control-button w-28" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save trip"}
        </button>
      </div>
    </form>


  return (
    <>
      <div className="w-28">
        <button className="control-button w-full" 
          onClick={() => {
            setStartDate(formattedDateUtc);
            setEndDate(formattedDateUtc);
            setErrorMessage("");
            setIsDialogOpen(true);
          }}
        >
          Create trip
        </button>

        <DialogueBox
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setIsSubmitting(false);
          }}
          title="Create New Trip"
        >
          {dialogueContent}
        </DialogueBox>
      </div>
    </>

  )

}

export default CreateTripBtn;
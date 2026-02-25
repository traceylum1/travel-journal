import { useState, type FormEvent } from "react";

type MarkerFormData = {
  markerDate: string;
  markerLocation: string;
  markerDescription: string;
};

interface MarkerPopupContentProps {
  defaultDate: string;
  onSave: (data: MarkerFormData) => Promise<boolean>;
  onCancel: () => void;
  onDelete: () => void;
}

function MarkerPopupContent({ defaultDate, onSave, onCancel, onDelete }: MarkerPopupContentProps) {
  const [mode, setMode] = useState<"edit" | "saved">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<MarkerFormData>({
    markerDate: defaultDate,
    markerLocation: "",
    markerDescription: "",
  });

  function updateField(field: keyof MarkerFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    const success = await onSave(formData);
    setIsSaving(false);

    if (success) {
      setMode("saved");
      return;
    }

    setErrorMessage("Failed to save marker. Please try again.");
  }

  if (mode === "saved") {
    return (
      <div className="w-72 space-y-3 text-zinc-900">
        <div className="space-y-1">
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-zinc-500">Date</p>
          <p className="m-0 rounded-md bg-zinc-100 px-2 py-1 text-sm">{formData.markerDate}</p>
        </div>

        <div className="space-y-1">
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-zinc-500">Location</p>
          <p className="m-0 max-h-20 overflow-y-auto whitespace-pre-wrap rounded-md bg-zinc-100 px-2 py-1 text-sm">
            {formData.markerLocation}
          </p>
        </div>

        <div className="space-y-1">
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-zinc-500">Description</p>
          <p className="m-0 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-md bg-zinc-100 px-2 py-1 text-sm">
            {formData.markerDescription}
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="control-button flex-1"
            onClick={() => setMode("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className="control-button flex-1 border-red-300 text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="w-72 space-y-3 text-zinc-900" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label htmlFor="marker-date" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Date
        </label>
        <input
          id="marker-date"
          type="date"
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
          value={formData.markerDate}
          onChange={(e) => updateField("markerDate", e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="marker-location" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Location
        </label>
        <textarea
          id="marker-location"
          className="max-h-24 min-h-16 w-full resize-y rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
          value={formData.markerLocation}
          onChange={(e) => updateField("markerLocation", e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="marker-description" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Description
        </label>
        <textarea
          id="marker-description"
          className="max-h-36 min-h-24 w-full resize-y rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
          value={formData.markerDescription}
          onChange={(e) => updateField("markerDescription", e.target.value)}
          required
        />
      </div>

      {errorMessage ? <p className="m-0 text-xs text-red-600">{errorMessage}</p> : null}

      <div className="flex gap-2 pt-1">
        <button type="submit" className="control-button flex-1" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button type="button" className="control-button flex-1" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export type { MarkerFormData };
export default MarkerPopupContent;

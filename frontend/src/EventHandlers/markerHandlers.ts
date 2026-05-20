import apiCalls from "../Requests/apiCalls";
import { AddMarkerProps, SaveMarkerProps } from "../Types/Props";
import { MarkerSaveResult } from "../Types/Response";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import MarkerPopupContent, { type MarkerFormData } from "../containers/controls/MarkerPopupContent";

const markerEventHandlers = {
  addMarker: function({e, addMarker, setAddMarker, map, L}: AddMarkerProps)  {
    if (!addMarker) return;

    const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    const popupContent = document.createElement('div');

    const nowUtc = new Date();
    const formattedDateUtc = nowUtc.toISOString().split('T')[0];

    marker.bindPopup(popupContent, { minWidth: 320 }).openPopup();
    setAddMarker(prev => !prev);

    const root = createRoot(popupContent);
    const onSave = async (data: MarkerFormData, markerId: number | null): Promise<MarkerSaveResult> => {
      return this.handleClickSaveMarker({
        markerId: markerId ?? undefined,
        markerLat: e.latlng.lat,
        markerLng: e.latlng.lng,
        markerDate: data.markerDate,
        markerLocation: data.markerLocation,
        markerDescription: data.markerDescription,
      });
    };

    root.render(
      createElement(MarkerPopupContent, {
        defaultDate: formattedDateUtc,
        onSave: onSave,
        onCancel: () => map.removeLayer(marker),
        onDelete: async (markerId: number | null) => {
          if (markerId === null) {
            map.removeLayer(marker);
            return true;
          }

          const success = await apiCalls.deleteMarker({ markerId });
          if (success) {
            map.removeLayer(marker);
          }
          return success;
        },
      })
    );

    marker.once("popupclose", () => {
      root.unmount();
    });
  },

  // TODO: Pass in appropriate tripID and get username from local storage
  saveMarker: async ({
    markerId,
    markerLat,
    markerLng,
    markerDate,
    markerLocation,
    markerDescription,
  }: SaveMarkerProps ) => {
    const username = "Marcus";
    const tripId = 1;

    if (typeof markerId === "number") {
      return apiCalls.updateMarker({ 
        markerId, 
        markerLocation, 
        markerDescription, 
        markerDate,
      });
    } else {
      return apiCalls.addMarker({ 
        tripId, 
        markerLocation, 
        markerDescription, 
        markerDate, 
        markerLat, 
        markerLng, 
        username,
        e,
      });
    }
  },

  editMarker: async function() {

  }
}

export default markerEventHandlers;
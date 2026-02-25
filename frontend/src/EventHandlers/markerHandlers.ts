import apiCalls from "../Requests/apiCalls";
import { HandleClickAddMarkerProps, HandleClickSaveMarkerProps } from "../Types/Props";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import MarkerPopupContent, { type MarkerFormData } from "../containers/controls/MarkerPopupContent";

const markerEventHandlers = {
    handleClickAddMarker: function({e, addMarker, setAddMarker, map, L}: HandleClickAddMarkerProps)  {
        if (!addMarker) return;

        const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        const popupContent = document.createElement('div');

        const nowUtc = new Date();
        const formattedDateUtc = nowUtc.toISOString().split('T')[0];

        marker.bindPopup(popupContent, { minWidth: 320 }).openPopup();
        setAddMarker(prev => !prev);

        const root = createRoot(popupContent);
        const onSave = async (data: MarkerFormData) => {
            const saveSuccess = await this.handleClickSaveMarker({
                markerLat: e.latlng.lat,
                markerLng: e.latlng.lng,
                markerDate: data.markerDate,
                markerLocation: data.markerLocation,
                markerDescription: data.markerDescription,
            });
            return saveSuccess;
        };

        root.render(
            createElement(MarkerPopupContent, {
                defaultDate: formattedDateUtc,
                onSave: onSave,
                onCancel: () => map.removeLayer(marker),
                onDelete: () => map.removeLayer(marker),
            })
        );

        marker.once("popupclose", () => {
            root.unmount();
        });
    },

    handleClickSaveMarker: async ({
        markerLat,
        markerLng,
        markerDate,
        markerLocation,
        markerDescription,
    }: HandleClickSaveMarkerProps ) => {
        const username = "Marcus";
        const tripId = 1;
        
        try {
            await apiCalls.addMarker({ 
                tripId: tripId, 
                markerLocation: markerLocation, 
                markerDescription: markerDescription, 
                markerDate: markerDate, 
                markerLat: markerLat, 
                markerLng: markerLng, 
                username: username
            });
            return true;
        } catch {
            console.error("failed to save marker");
            return false;
        }

    },

    handleClickEditMarker: async function() {

    }
}

export default markerEventHandlers;
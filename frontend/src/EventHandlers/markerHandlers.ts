import apiCalls from "../Requests/apiCalls";
import { HandleClickAddMarkerProps, HandleClickSaveMarkerProps, MarkerSaveResult } from "../Types/Props";
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

    handleClickSaveMarker: async ({
        markerId,
        markerLat,
        markerLng,
        markerDate,
        markerLocation,
        markerDescription,
    }: HandleClickSaveMarkerProps ) => {
        const username = "Marcus";
        const tripId = 1;

        if (typeof markerId === "number") {
            return apiCalls.updateMarker({
                markerId,
                markerLocation,
                markerDescription,
                markerDate,
            });
        }

        return apiCalls.addMarker({
            tripId: tripId,
            markerLocation: markerLocation,
            markerDescription: markerDescription,
            markerDate: markerDate,
            markerLat: markerLat,
            markerLng: markerLng,
            username: username
        });
    },

    handleClickEditMarker: async function() {

    }
}

export default markerEventHandlers;
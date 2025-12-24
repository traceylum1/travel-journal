
const apiCalls = {
    addMarker: async function ({ tripId, markerLocation, markerDescription, markerDate, markerLat, markerLng, username }) {
        try {
            const response = await fetch("/api/addMarker", {
                method: "POST",
                body: JSON.stringify({ 
                    trip_id: Number(tripId), 
                    location: markerLocation, 
                    description: markerDescription, 
                    date: markerDate, 
                    latitude: Number(markerLat), 
                    longitude: Number(markerLng), 
                    created_by: username 
                }),
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    }
}

export default apiCalls;
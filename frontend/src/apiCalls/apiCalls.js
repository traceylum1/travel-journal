
const apiCalls = {
    addMarker: async function ({ markerLocation, markerDescription, markerDate, markerLat, markerLng, tripId, userName }) {
        console.log(markerLat, markerLng);
        console.log(typeof(markerLat));
        try {
            const response = await fetch("/api/addMarker", {
                method: "POST",
                body: JSON.stringify({ 
                    Location: markerLocation, 
                    Description: markerDescription, 
                    Date: markerDate, 
                    Latitude: Number(markerLat), 
                    Longitude: Number(markerLng), 
                    TripID: tripId, 
                    CreatedBy: userName 
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

const apiCalls = {
    addMarker: async function (markerId, userName, markerLocation, markerDescription, markerDate, markerTrip) {
        // const url = "https://localhost:8080/addMarker";
        try {
            const response = await fetch("/api/addMarker", {
                method: "POST",
                body: JSON.stringify({ ID: markerId, Owner: userName, Location: markerLocation, Description: markerDescription, Date: markerDate, Trip: markerTrip }),
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
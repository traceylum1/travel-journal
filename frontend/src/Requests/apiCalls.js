
const apiCalls = {
    login: async function ({ username, password }) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error.message)
        }
    },

    register: async function ({ username, password }) {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error.message)
        }
    },
    
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
            console.log("response", response);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    },
}

export default apiCalls;
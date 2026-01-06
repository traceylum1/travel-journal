
const apiCalls = {
    login: async function ({ username, password }) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            // Request reached the server, but login failed
            if (response.status === 401) {
                return {
                    success: false,
                    type: "AUTH",
                    message: "Invalid username or password",
                };
            }

            // Other non-OK HTTP errors (500, 503, etc.)
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Successful login
            localStorage.setItem("username", username);
            return {
                success: true,
            };

        } catch {
            // Network error, CORS, timeout, DNS, etc.
            return {
                success: false,
                type: "NETWORK",
                message: "Unable to reach server. Please try again.",
            };
        }
    },

    register: async function ({ username, password }) {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            // Successful register
            return {
                success: true,
            };
        } catch {
            // Network error, CORS, timeout, DNS, etc.
            return {
                success: false,
                type: "NETWORK",
                message: "Unable to reach server. Please try again.",
            };
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
import { AddMarkerProps, UserCredentialsProps, CreateTripProps } from "../Types/Props";


const apiCalls = {
    login: async function ({ username, password }: UserCredentialsProps) {
        try {
            const response = await fetch("api/auth/login", {
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
            const data = await response.json();

            localStorage.setItem("username", JSON.stringify(username));
            localStorage.setItem("userId", JSON.stringify(data.user_id));

            return {
                success: true,
                message: "Successfully logged in!"
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

    register: async function ({ username, password }: UserCredentialsProps) {
        try {
            const response = await fetch("api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })

            // Request reached the server, but did not create new user
            if (response.status === 409) {
                return {
                    success: false,
                    message: "Username already exists. Please try a new username.",
                };
            }

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            // Successful register
            const data = await response.json();

            localStorage.setItem("username", JSON.stringify(username));
            localStorage.setItem("userId", JSON.stringify(data.user_id));

            return {
                success: true,
                message: "Successfully signed up!"
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

    // TODO: Make createTrip endpoint
    createTrip: async function ({ tripName, description, startDate, endDate }: CreateTripProps) {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");

        try {
            const response = await fetch("/api/protected/createTrip", {
                method: "POST",
                body: JSON.stringify({ 
                    trip_name: tripName, 
                    description: description, 
                    start_date: startDate, 
                    end_date: endDate,
                    created_by: username,
                    owner_id: userId
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
    
    addMarker: async function ({ tripId, markerLocation, markerDescription, markerDate, markerLat, markerLng, username }: AddMarkerProps) {
        try {
            const response = await fetch("/api/protected/addMarker", {
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unknown server error");
            }
            
            console.log(data);
        } catch (error) {
            console.error(error.message);
        }
    },
}

export default apiCalls;
import apiCalls from "../Requests/apiCalls";

const tripEventHandlers = {
    handleClickSaveMarker: async ({tripName, description, startDate, endDate}: HandleClickSaveMarkerProps ) => {
        const username = "Marcus";
        const tripId = "1";

        const markerLocation = document.querySelector("#marker-location").value;
        console.log("markerLocation", markerLocation);

        const markerDescription = document.querySelector("#marker-description").value;
        console.log("markerDescription", markerDescription);

        const markerDate = document.querySelector('input[type="date"]').value;
        console.log("markerDate", markerDate);
        
        
        try {
            await apiCalls.createTrip({ 
                tripName: tripName, 
                description: markerLocation, 
                startDate: markerDescription, 
                endDate: markerDate, 
            });

            popupContent.innerHTML = `
                <div style="width: 15em">
                    Date:
                    <div style="background-color: gainsboro">
                        ${markerDate}
                    </div>
                    Location:
                    <div style="white-space: pre-wrap; background-color: gainsboro; height: 3em; overflow-x: none; overflow-y: auto">${markerLocation}
                    </div>
                    Description:
                    <div style="white-space: pre-wrap; background-color: gainsboro; height: 6em; overflow-x: none; overflow-y: auto">${markerDescription}
                    </div>
                    <br/>
                    <div style="display: flex; justify-content: space-evenly">
                        <button id="edit-marker-btn">Edit</button>
                        <button id="delete-marker-btn">Delete</button>
                    </div>
                <div/>
            `;

        } catch {
            console.error("failed to save marker");
        }

    },
}
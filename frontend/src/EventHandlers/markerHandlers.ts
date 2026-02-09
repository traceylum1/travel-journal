import apiCalls from "../Requests/apiCalls";
import { HandleClickAddMarkerProps, HandleClickSaveMarkerProps } from "../Types/Props";

const eventHandlers = {
    handleClickAddMarker: function({e, addMarker, setAddMarker, map, L}: HandleClickAddMarkerProps)  {
        if (!addMarker) return;

        const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

        console.log(typeof(e.latlng.lat), e.latlng.lat);
        //   const popupDescription = document.querySelector('#popup-input').value;
        const popupContent = document.createElement('div');

        const nowUtc = new Date();
        // Get the date part (YYYY-MM-DD)
        const formattedDateUtc = nowUtc.toISOString().split('T')[0];
      
        popupContent.innerHTML = `
            <form>
                <label>Date:</label>
                <br/>
                <input type="date" value=${formattedDateUtc} />
                <br/>
                Location:
                <br/>
                <textarea id="marker-location" name="location" rows="2" cols="30"></textarea>
                <br/>
                Description:
                <br/>
                <textarea id="marker-description" name="description" rows="5" cols="30"></textarea>
            </form>
            <br/>
            <div style="display: flex; justify-content: space-evenly">
                <button id="save-marker-btn">Save</button>
                <button id="cancel-marker-btn">Cancel</button>
            </div>
        `;

        // Bind popup
        marker.bindPopup(popupContent).openPopup();
        setAddMarker(prev => !prev)
        

        // Attach event listeners AFTER popup is added to the DOM
        popupContent
            .querySelector("#save-marker-btn")
            .addEventListener("click", async () => this.handleClickSaveMarker({popupContent, markerLat: e.latlng.lat, markerLng: e.latlng.lng}));

        popupContent
            .querySelector("#cancel-marker-btn")
            .addEventListener("click", () => {
            map.removeLayer(marker); // remove marker
        });
    },

    handleClickSaveMarker: async ({popupContent, markerLat, markerLng}: HandleClickSaveMarkerProps ) => {
        const username = "Marcus";
        const tripId = "1";

        const markerLocation = document.querySelector("#marker-location").value;
        console.log("markerLocation", markerLocation);

        const markerDescription = document.querySelector("#marker-description").value;
        console.log("markerDescription", markerDescription);

        const markerDate = document.querySelector('input[type="date"]').value;
        console.log("markerDate", markerDate);
        
        
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

    handleClickEditMarker: async function() {

    }
}

export default eventHandlers;
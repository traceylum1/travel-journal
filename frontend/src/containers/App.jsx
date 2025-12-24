import { useState } from 'react';
import Map from './Map';
import Controls from './controls/Controls';
import TripList from './trips/TripList';
import Trip from './trips/Trip';

function App() {
  const [ addMarker, setAddMarker ] = useState(false);
  const [ tripDisplay, setTripDisplay ] = useState("");


  return (
    <div className="app">
      
      <div id="main-left">
        <h1 id="header">Travel Journal</h1>
        <Controls
          addMarker={addMarker}
          setAddMarker={setAddMarker}
        />
        <TripList
          setTripDisplay={setTripDisplay}
        />
        { tripDisplay ?
          <Trip
            tripDisplay={tripDisplay}
          /> : null 
        }
      </div>

        <Map
          addMarker={addMarker}
          setAddMarker={setAddMarker}
          />
        

    </div>
  )
}

export default App

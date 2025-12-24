import { useState } from 'react';
import Map from './Map';
import Controls from './Controls/Controls';
import TripList from './Trips/TripList';
import Trip from './Trips/Trip';
import LoginPage from './Login/LoginPage';

function App() {
  const [ addMarker, setAddMarker ] = useState(false);
  const [ tripDisplay, setTripDisplay ] = useState("");

  const mainContainer = 
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
  
  const loginPage = <LoginPage/>

  return (
    localStorage.getItem("username") === "" ? loginPage : mainContainer
  )
}

export default App;

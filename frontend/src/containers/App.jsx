import { useState } from 'react';
import Map from './Map';
import TripList from './Trips/TripList';
import Trip from './Trips/Trip';
import LoginPage from './Login/LoginPage';
import { useLocalStorageState } from '../CustomHooks/customHooks';

function App() {
  const [ addMarker, setAddMarker ] = useState(false);
  const [ tripDisplay, setTripDisplay ] = useState("");
  const [ username, setUsername ] = useLocalStorageState("username", null)

  const mainContainer = 
    <div className="flex h-full w-full flex-col gap-3 p-3 md:flex-row">
      <div className="flex h-[46%] w-full flex-col gap-3 md:h-full md:w-[420px] md:min-w-[360px] md:max-w-[460px]">
        <h1 className="m-0 px-1 text-3xl font-semibold tracking-tight text-amber-100">Travel Journal</h1>
        {/* <Controls
          addMarker={addMarker}
          setAddMarker={setAddMarker}
        /> */}
        <TripList
          setTripDisplay={setTripDisplay}
        />
        { tripDisplay ?
          <Trip
            tripDisplay={tripDisplay}
            addMarker={addMarker}
            setAddMarker={setAddMarker}
          /> : null 
        }
      </div>
      <div className="h-[54%] w-full overflow-hidden rounded-xl border border-zinc-700 md:h-full">
        <Map
          addMarker={addMarker}
          setAddMarker={setAddMarker}
          tripID={tripDisplay}
        />
      </div>
    </div>
  
  const loginPage = <LoginPage/>

  return (
    JSON.parse(localStorage.getItem("username")) === null ? loginPage : mainContainer
  )
}

export default App;

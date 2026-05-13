import { useState } from 'react';
import Map from './Map';
import TripList from './Trips/TripList';
import Trip from './Trips/Trip';
import LoginPage from './Login/LoginPage';
import UserAccountMenu from './UserAccountMenu';
import { useLocalStorageState } from '../CustomHooks/customHooks';

function getStoredUsername() {
  try {
    const raw = localStorage.getItem("username");
    if (raw == null) return null;
    const value = JSON.parse(raw);
    return typeof value === "string" && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function App() {
  const [ addMarker, setAddMarker ] = useState(false);
  const [ tripDisplay, setTripDisplay ] = useState(null);
  const [, setUsername ] = useLocalStorageState("username", null)
  const [ tripList, setTripList ] = useLocalStorageState("tripList", [])
  const sessionUser = getStoredUsername();

  function handleLoggedOut() {
    setTripDisplay(null);
    setUsername(null);
    setTripList([]);
    localStorage.removeItem("userId");
  }

  const mainContainer = 
    <div className="flex h-full w-full flex-col gap-3 p-3 md:flex-row">
      <div className="flex h-[46%] w-full flex-col gap-3 md:h-full md:w-[420px] md:min-w-[360px] md:max-w-[460px]">
        <div className="flex items-center justify-between gap-2 px-1">
          <h1 className="m-0 text-3xl font-semibold tracking-tight text-amber-100">Travel Journal</h1>
          {sessionUser ? (
            <UserAccountMenu username={sessionUser} onLoggedOut={handleLoggedOut} />
          ) : null}
        </div>
        {/* <Controls
          addMarker={addMarker}
          setAddMarker={setAddMarker}
        /> */}
        <TripList
          setTripDisplay={setTripDisplay}
          tripList={tripList}
          setTripList={setTripList}
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
          tripID={tripDisplay ? tripDisplay.trip_id : null}
        />
      </div>
    </div>
  
  const loginPage = <LoginPage/>

  return sessionUser === null ? loginPage : mainContainer
}

export default App;

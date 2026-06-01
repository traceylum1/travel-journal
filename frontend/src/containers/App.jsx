import { useState } from 'react';
import Map from './Map';
import TripList from './Trips/TripList';
import Trip from './Trips/Trip';
import LoginPage from './Login/LoginPage';
import UserAccountMenu from './UserAccountMenu';
import { useLocalStorageState } from '../CustomHooks/customHooks';
import { useAuth } from '../context/useAuth';

function App() {
  const { status, isAuthenticated } = useAuth();
  const [ addMarker, setAddMarker ] = useState(false);
  const [ tripDisplay, setTripDisplay ] = useState(null);
  const [ tripList, setTripList ] = useLocalStorageState("tripList", [])

  function handleLoggedOut() {
    setTripDisplay(null);
    setTripList([]);
  }

  if (status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-400">
        Loading…
      </div>
    );
  }

  const mainContainer = 
    <div className="flex h-full w-full flex-col gap-3 p-3 md:flex-row">
      <div className="flex h-[46%] w-full flex-col gap-3 md:h-full md:w-[420px] md:min-w-[360px] md:max-w-[460px]">
        <div className="flex items-center justify-between gap-2 px-1">
          <h1 className="m-0 text-3xl font-semibold tracking-tight text-amber-100">Travel Journal</h1>
          {isAuthenticated ? (
            <UserAccountMenu onLoggedOut={handleLoggedOut} />
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

  return isAuthenticated ? mainContainer : loginPage
}

export default App;

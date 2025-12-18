import { useState } from 'react';
import Map from './Map';
import Controls from './controls/Controls';

function App() {
  const [ addMarker, setAddMarker ] = useState(false);
  console.log("addMarker", addMarker);

  return (
    <div className="app">
      
      <div id="main-left">
        <h1 id="header">Travel Journal</h1>
        <Controls
          addMarker={addMarker}
          setAddMarker={setAddMarker}
        />
      </div>

        <Map
          addMarker={addMarker}
          setAddMarker={setAddMarker}
          />
    </div>
  )
}

export default App

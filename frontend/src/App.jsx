import { useState } from 'react';
import Map from './Map';
import Controls from './controls/Controls';

function App() {
  const [ addMarker, setAddMarker ] = useState(false);

  return (
    <div className="app">
      <h1 id="header">Travel Journal</h1>
      <div id="main">
        <Controls
          addMarker={addMarker}
          setAddMarker={setAddMarker}
        />
        
        <Map
          addMarker={addMarker}
          setAddMarker={setAddMarker}
          />
        </div>
    </div>
  )
}

export default App

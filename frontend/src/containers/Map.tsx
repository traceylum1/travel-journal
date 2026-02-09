import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import * as GeoSearch from 'leaflet-geosearch';
import eventHandlers from '../EventHandlers/markerHandlers';
import { MapProps } from '../Types/Props';

function Map({ addMarker, setAddMarker }: MapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map('map').setView([37.815209, -122.290192], 11);
    mapRef.current = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Disable double-click zoom after map creation
    map.doubleClickZoom.disable();
    
    // Add search plugin
    const search = new GeoSearch.GeoSearchControl({
      provider: new GeoSearch.OpenStreetMapProvider(),
    });

    map.addControl(search);

    return () => map.remove(); // cleanup if component unmounts
  }, []);

  // Add/remove click handler when addMarker changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markerHandler = (e: L.LeafletMouseEvent) => {
      eventHandlers.handleClickAddMarker({
        e: e, 
        addMarker: addMarker,
        setAddMarker: setAddMarker,
        map: map,
        L: L,
      });
    };
    
    map.on("click", markerHandler);

    // Cleanup when addMarker changes or component unmounts
    return () => map.off("click", markerHandler);
  }, [addMarker]); // <-- update listeners only when needed
  

  return <div id='map'></div>
}

export default Map

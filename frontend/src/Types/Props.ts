import { LatLng } from 'leaflet-geosearch/dist/providers/provider.js';
import Trie from '../Containers/Controls/CreateTrip/Trie';

export interface MapProps {
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<boolean>>,
    tripID: number | null,
}

export interface TripListProps {
    setTripDisplay: React.Dispatch<React.SetStateAction<TripListItem | null>>,
    tripList: TripListItem[],
    setTripList: React.Dispatch<React.SetStateAction<TripListItem[]>>
}

export interface TripListItem {
    trip_id: number,
    trip_name: string,
    description: string,
    start_date: string,
    end_date: string,
    created_by: string,
    owner_id: number,
}

export interface CreateTripBtnProps {
    setTripList: React.Dispatch<React.SetStateAction<TripListItem[]>>,
    setTripDisplay: React.Dispatch<React.SetStateAction<TripListItem | null>>,
}

export interface TripProps {
    tripDisplay: TripListItem,
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AddMarkerBtnProps {
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<boolean>>
}


export interface CountryListProps {
    trie: Trie,
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
}

// TODO: Figure out leaflet types for L, or change to L.Marker
export interface HandleClickAddMarkerProps {
    e: L.LeafletMouseEvent,
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<boolean>>,
    map: L.Map,
    L: any
}

export interface HandleClickSaveMarkerProps {
    markerId?: number,
    markerLat: number,
    markerLng: number,
    markerDate: string,
    markerLocation: string,
    markerDescription: string,
}

export interface UserCredentialsProps {
    username: string,
    password: string,
}

export interface AddMarkerProps {
    tripId: number,
    markerLocation: string,
    markerDescription: string,
    markerDate: string,
    markerLat: number,
    markerLng: number,
    username: string,
}

export interface UpdateMarkerProps {
    markerId: number,
    markerLocation: string,
    markerDescription: string,
    markerDate: string,
}

export interface DeleteMarkerProps {
    markerId: number,
}

export interface MarkerSaveResult {
    success: boolean,
    markerId?: number,
}

export interface CreateTripProps {
    tripName: string,
    description: string,
    startDate: string,
    endDate: string,
}

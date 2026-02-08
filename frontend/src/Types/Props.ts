import Trie from "../Containers/Controls/CreateTrip/Trie"

export interface MapProps {
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface TripListProps {
    setTripDisplay: React.Dispatch<React.SetStateAction<string>>
}

export interface TripProps {
    tripDisplay: string,
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
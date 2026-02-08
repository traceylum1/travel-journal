export interface TripListProps {
    setTripDisplay: React.Dispatch<React.SetStateAction<string>>
}

export interface TripProps {
    tripDisplay: string,
    addMarker: boolean,
    setAddMarker: React.Dispatch<React.SetStateAction<string>>
}
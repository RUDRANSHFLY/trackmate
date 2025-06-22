import { locationType } from "@/types";

export const calculateDistance = (coords: locationType[]): number => {
    if (coords.length < 2) {
        return 0;
    }

    const toRad = (x : number) => (x * Math.PI) / 180;
    let total = 0 ;

    for(let i = 1 ; i < coords.length ; i++){
        const prev = coords[i-1];
        const curr = coords[i]

        const R = 6371 ;
        const dLat = toRad(curr.latitude - prev.latitude)
        const dLon = toRad(curr.longitude - prev.longitude)

        const a  = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prev.latitude)) * Math.cos(toRad(curr.latitude)) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
        total +=  R * c;
    }
    return total;
}
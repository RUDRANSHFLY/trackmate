import axios from "axios";


export type Shape2Point = {
    x: number,
    y: number,
}

export type LatLng = {
  latitude: number;
  longitude: number;
};

export const generateWalkableRoute = async (
    shape : Shape2Point[],
    center : LatLng,
) : Promise<LatLng[]> => {
    const snappedPoints : LatLng[] = [];

    for(let i = 0 ; i < shape.length ; i++){
        const offsetX = shape[i].x * 0.0008;
        const offsetY = shape[i].y * 0.0008;

        const rawPoint = {
            latitude : center.latitude + offsetX,
            longitude : center.longitude + offsetY
        };

        const snapped = await snapToStreet(rawPoint);
        if(snapped) snappedPoints.push(snapped)
    }


    return snappedPoints;
} 



//? Snap this point to nearest walkable road using OpenStreetMap
export const snapToStreet = async (point : LatLng) : Promise<LatLng | null> => {
    try {
        const url = `https://router.project-osrm.org/nearest/v1/foot/${point.longitude},${point.latitude}`;
        const res = await axios.get(url);

        if(res.data.waypoints && res.data.waypoints.length > 0){
            const coord = res.data.waypoints[0].location;
            return {
                latitude : coord[1] as number,
                longitude : coord[0] as number,
            };
        }else{
            return null;
        }

    } catch (error) {
        console.error("Snap to street failed",error)
    }
    return null;
}
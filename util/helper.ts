export const convertShapeToGeoCoords = (
    shape2D: { x: number, y: number }[],
    center: { latitude: number, longitude: number },
    sizeInMeters = 100
): { latitude: number, longitude: number }[] => {
    const meterToLat = 1 / 111111;
    const meterToLng = 1 / (111111 * Math.cos(center.latitude * (Math.PI / 180)))

    const geoCoordinates = shape2D.map(({ x, y }) => ({
        latitude: center.latitude + y * sizeInMeters * meterToLat,
        longitude: center.longitude + x * sizeInMeters * meterToLng,
    }));

    return geoCoordinates;
}



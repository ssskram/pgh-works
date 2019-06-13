// provided an array of points from a polygon,
// returns the center of the shape for rendering on map

export default function setCenter(points) {
  const bounds = new google.maps.LatLngBounds();
  if (points) {
    let i;
    for (i = 0; i < points.length; i++) {
      bounds.extend(points[i]);
    }
    const lat = bounds.getCenter().lat();
    const lng = bounds.getCenter().lng();
    const center = { lat: lat, lng: lng };
    return center;
  }
}

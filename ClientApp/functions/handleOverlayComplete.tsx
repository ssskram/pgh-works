
// fired when user is finished drawing a polygon
// returns the shape to be rendered

export default function handleOverlayComplete (evt) {
    let shape = { points: [] as any }
    let vertices = evt.overlay.getPath()

    for (let i = 0; i < vertices.getLength(); i++) {
        let xy = vertices.getAt(i);
        const coord = { lat: xy.lat(), lng: xy.lng() }
        shape.points.push(coord)
    }
    return shape
}
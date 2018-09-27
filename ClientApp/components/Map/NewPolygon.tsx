import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"

export default class PolygonGeneration extends React.Component<any, any> {

    handleOverlayComplete = (evt) => {
        let shape = { points: [] as any }
        let vertices = evt.overlay.getPath()

        for (var i = 0; i < vertices.getLength(); i++) {
            var xy = vertices.getAt(i);
            var coord = { lat: xy.lat(), lng: xy.lng() }
            shape.points.push(coord)
        }

        this.props.passShape(shape)
    }

    render() {
        const MapComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g&v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{ height: `100%`, }} />,
                containerElement: <div style={{ height: `100%` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap
        )((props) =>
            <GoogleMap
                defaultZoom={13}
                defaultCenter={{ lat: 40.437470539681442, lng: -79.987124601795273 }}
            >
                <DrawingManager
                    defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
                    defaultOptions={{
                        drawingControl: true,
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [
                                google.maps.drawing.OverlayType.POLYGON
                            ]
                        }
                    }}
                    {...props}
                    onOverlayComplete={this.handleOverlayComplete}
                />
            </GoogleMap>
        )
        return (
            <div id='polygon-draw'>
                <MapComponent />
            </div>
        )
    }
}
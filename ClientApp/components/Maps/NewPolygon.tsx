
// user draws a new polygon here

import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import handleOverlayComplete from './../../functions/handleOverlayComplete'

export default class PolygonGeneration extends React.Component<any, any> {

    handleShape = (evt) => {
        this.props.passShape(handleOverlayComplete(evt))
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
                    onOverlayComplete={this.handleShape}
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
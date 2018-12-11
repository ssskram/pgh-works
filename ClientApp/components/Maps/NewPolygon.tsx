
// user draws a new polygon here

import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import handleOverlayComplete from './../../functions/handleOverlayComplete'
import Autocomplete from '../FormElements/autocomplete'

const mapStyle = require('./featurelessLight.json')
const place = require('../../images/place.png')

export default class PolygonGeneration extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            latlng: { lat: 40.437470539681442, lng: -79.987124601795273 },
            zoom: 13,
            marker: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState != this.state) {
            return true
        }
        else return false
    }

    handleShape = (evt) => {
        this.props.passShape(handleOverlayComplete(evt))
    }

    handleAutoselect(latlng) {
        if (Object.keys(latlng).length == 0) {
            this.setState({
                latlng: { lat: 40.437470539681442, lng: -79.987124601795273 },
                zoom: 13,
                marker: false
            })
        } else {
            this.setState({ latlng, zoom: 17, marker: true })
        }
    }

    render() {
        const {
            latlng,
            zoom,
            marker
        } = this.state

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
                defaultZoom={zoom}
                defaultCenter={latlng}
                defaultOptions={{ styles: mapStyle as any }}
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
                {marker == true &&
                    <Marker
                        position={latlng}
                        defaultIcon={place}
                    />
                }
            </GoogleMap>
        )
        return (
            <div>
                <Autocomplete selectAddress={this.handleAutoselect.bind(this)} />
                <div className='col-md-12 pull-right'>
                    <div id='polygon-draw'>
                        <MapComponent />
                    </div>
                </div>
            </div>
        )
    }
}
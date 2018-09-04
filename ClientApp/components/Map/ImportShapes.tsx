import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"

export default class ImportShapes extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            assets: props.assets,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedShape: {}
        }
        this.polygonSelection = this.polygonSelection.bind(this)
    }

    polygonSelection(asset) {
        const bounds = new google.maps.LatLngBounds()
        var i
        for (i = 0; i < asset.shape.points.length; i++) {
            bounds.extend(asset.shape.points[i]);
        }
        let lat = bounds.getCenter().lat()
        let lng = bounds.getCenter().lng()
        this.setState ({
            selectedShape: asset.shape.points,
            center: { lat: lat, lng: lng},
            zoom: 17
        })

        // zoom to shape
        // make accept/redo buttons visible
        // filter assets by those with atleast one share point
    }

    render() {
        const {
            assets,
            zoom,
            center,
            selectedShape
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
                defaultCenter={center}
            >
                {assets &&
                    assets.map((asset) => {
                        return (
                            <Polygon
                                paths={[asset.shape.points]}
                                key={asset.assetOID}
                                onClick={() => this.polygonSelection(asset)}
                            />
                        )
                    })
                }
            </GoogleMap>
        )

        return (
            <div id='polygon-draw'>
                <MapComponent />
            </div>
        )
    }
}
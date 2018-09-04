import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"

export default class ImportShapes extends React.Component<any, any> {

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
                {this.props.assets &&
                    this.props.assets.map((asset) => {
                        console.log(asset)
                        return (
                            <Polygon
                                paths={[asset.shape.points]}
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
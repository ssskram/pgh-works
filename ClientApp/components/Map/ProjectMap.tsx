import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"

export default class ProjectMap extends React.Component<any, any> {

    render() {
        const bounds = new google.maps.LatLngBounds()
        if (this.props.shape.points) {
            var i
            for (i = 0; i < this.props.shape.points.length; i++) {
                bounds.extend(this.props.shape.points[i]);
            }
        }


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
                defaultZoom={15}
                ref={(map) => { if (map) map.fitBounds(bounds) }}
            >
                <Polygon
                    paths={[this.props.shape.points]}
                />
            </GoogleMap>
        )

        return (
            <div id='single-project'>
                <MapComponent />
            </div>
        )
    }
}
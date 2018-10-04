
// thumbnail map on project cards

import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"
import setCenter from './../../functions/setCenter'

export default class MapThumbnail extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            center: { lat: 40.437470539681442, lng: -79.987124601795273 }
        }
    }

    componentDidMount () {
        this.setState ({
            center: setCenter(this.props.shape)
        })
    }

    componentWillReceiveProps (nextProps) {
        this.setState ({
            center: setCenter(nextProps.shape)
        })
    }

    render() {
        const {
            center
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
                defaultZoom={13}
                defaultCenter={center}
            >
                <Polygon
                    paths={[this.props.shape]}
                />
            </GoogleMap>
        )

        return (
            <div id='project-thumbnail' style={{margin: '0 auto'}}>
                <MapComponent />
            </div>
        )
    }
}
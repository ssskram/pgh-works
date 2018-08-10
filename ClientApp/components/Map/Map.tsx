import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g&v=3",
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
        {props.isMarkerShown && <Marker position={{ lat: 40.437470539681442, lng: -79.987124601795273 }} onClick={props.onMarkerClick} />}
    </GoogleMap>
)

export default class MyFancyComponent extends React.Component<any, any> {
    state = {
        isMarkerShown: true,
    }

    handleMarkerClick = () => {
        this.setState({
            isMarkerShown: false
        })
    }

    render() {
        return (
            <div>
                <div id='map'>
                    <MyMapComponent
                        isMarkerShown={this.state.isMarkerShown}
                        onMarkerClick={this.handleMarkerClick}
                    />
                </div>
            </div>
        )
    }
}
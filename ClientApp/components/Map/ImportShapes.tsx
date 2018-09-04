import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"

export default class ImportShapes extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            assets: props.assets,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedAsset: {},
            showInfowindow: false
        }
        this.polygonSelection = this.polygonSelection.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.assets.length === 1) {
            let foundAsset = nextProps.assets[0]
            this.setCenter(foundAsset.shape.points)
            this.setState({
                assets: nextProps.assets,
                selectedAsset: foundAsset,
                showInfowindow: true
            })
        } else {
            this.setState({
                assets: nextProps.assets,
                zoom: 13,
                center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            })
        }

    }

    polygonSelection(asset) {
        this.setCenter(asset.shape.points)
        this.setState({
            selectedAsset: asset,
            showInfowindow: true
        })
    }

    setCenter(points) {
        const bounds = new google.maps.LatLngBounds()
        var i
        for (i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }
        let lat = bounds.getCenter().lat()
        let lng = bounds.getCenter().lng()
        this.setState({
            center: { lat: lat, lng: lng },
            zoom: 16
        })
    }

    closeWindow () {
        this.setState({
            showInfowindow: false
        })
    }

    render() {
        const {
            assets,
            zoom,
            center,
            showInfowindow,
            selectedAsset
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
                    assets.map((asset, index) => {
                        if (asset.shape) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        paths={[asset.shape.points]}
                                        onClick={() => this.polygonSelection(asset)}>
                                    </Polygon>
                                </div>

                            )
                        }
                    })
                }
                {showInfowindow == true &&
                    <InfoWindow position={center} onCloseClick={this.closeWindow.bind(this)}>
                        <div className='col-md-12'>
                        <h4>{selectedAsset.assetName}</h4>
                        <button onClick={() => this.props.receiveAsset(selectedAsset)} className='btn btn-success'>Save & continue</button>
                        </div>
                    </InfoWindow>
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
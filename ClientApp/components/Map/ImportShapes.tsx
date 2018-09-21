import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"
import LoadingMap from './../Utilities/LoadingMap'
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"

let selectedAsset = {} as any
let showInfoWindow = false

export default class ImportShapes extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            assets: props.assets,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedAsset: {}
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
        selectedAsset = asset
        showInfoWindow = true
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

    closeWindow() {
        showInfoWindow = false
        selectedAsset = {}
    }

    handleOverlayComplete = (evt) => {
        let shape: any[] = []
        let vertices = evt.overlay.getPath()

        for (var i = 0; i < vertices.getLength(); i++) {
            var xy = vertices.getAt(i);
            var coord = { lat : xy.lat(), lng: xy.lng() }
            shape.push(coord)
        }
        this.props.passShape(shape)
    }
    
    render() {
        const {
            assets,
            zoom,
            center,
        } = this.state

        const {
            grabby
        } = this.props

        const MapComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g&v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{ height: `100%`, }}><LoadingMap notice={"...loading map..."} /></div>,
                containerElement: <div style={{ height: `100%` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap
        )((props) =>
            <GoogleMap
                zoom={zoom}
                defaultCenter={center}
            >
                {assets && grabby != true &&
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
                {assets && grabby == true &&
                    assets.map((asset, index) => {
                        if (asset.shape) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        paths={[asset.shape.points]}>
                                    </Polygon>
                                </div>

                            )
                        }
                    })
                }

                {grabby == true &&
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
                }

                {showInfoWindow == true &&
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
            <div id='polygon-draw' style={{ margin: '0 auto' }}>
                <MapComponent />
            </div>
        )
    }
}
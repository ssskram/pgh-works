
// map used to import a shape
// throws polygons according to selected asset type

import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import setCenter from './../../functions/setCenter'
import handleOverlayComplete from './../../functions/handleOverlayComplete'
import findMiddleSegment from './../../functions/findMiddleSegment'

const mapStyle = require('./featurelessLight.json')

export default class ImportShapes extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            assets: props.assets,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedAsset: {},
            shoeInfowindow: false,
        }
        this.polygonSelection = this.polygonSelection.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state != nextState) {
            return true
        } else return false
    }

    componentDidMount() {
        // if user is grabbing street segments, grabby == true
        if (this.props.grabby == true) {
            if (this.props.assets.length === 1) {
                let foundSegment = this.props.assets[0]
                this.setState({
                    center: setCenter(foundSegment.shape.points),
                    zoom: 16
                })
            } else {
                this.setState({
                    center: setCenter(findMiddleSegment(this.props.assets).shape.points),
                    zoom: 13
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.assets.length == 1) {
            let foundAsset = nextProps.assets[0]
            this.setState({
                center: setCenter(foundAsset.shape.points),
                zoom: 16,
                assets: nextProps.assets,
                selectedAsset: foundAsset,
                showInfoWindow: true
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
        this.setState({
            center: setCenter(asset.shape.points),
            zoom: 16,
            selectedAsset: asset,
            showInfoWindow: true
        })
    }

    closeWindow() {
        this.setState({
            selectedAsset: {},
            showInfoWindow: false
        })
    }

    handleShape = (evt) => {
        this.props.passShape(handleOverlayComplete(evt))
    }

    render() {
        const {
            assets,
            zoom,
            center,
            selectedAsset,
            showInfoWindow
        } = this.state

        const {
            grabby
        } = this.props

        const MapComponent = compose(
            withProps({
                googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g&v=3.exp&libraries=geometry,drawing,places",
                loadingElement: <div style={{ height: `100%`, }}></div>,
                containerElement: <div style={{ height: `100%` }} />,
                mapElement: <div style={{ height: `100%` }} />,
            }),
            withScriptjs,
            withGoogleMap
        )((props) =>
            <GoogleMap
                zoom={zoom}
                defaultCenter={center}
                defaultOptions={{ styles: mapStyle as any }}
            >
                {assets && grabby != true &&
                    assets.map((asset, index) => {
                        if (asset.shape) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        options={{ fillColor: '#337ab7', strokeColor: '#337ab7', strokeWeight: 3, fillOpacity: 0.4 }}
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
                            },
                            polygonOptions: {
                                fillColor: 'red',
                                strokeColor: 'red',
                                strokeOpacity: 1,
                                strokeWeight: 3
                            }
                        }}
                        {...props}
                        onOverlayComplete={this.handleShape}
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
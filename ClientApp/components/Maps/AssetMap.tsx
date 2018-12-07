
// map that is rendered on project report

import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"
import setCenter from './../../functions/setCenter'
import randomcolor from 'randomcolor'

const mapStyle = require('./featurelessLight.json')

export default class AssetMap extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            assets: props.assets,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedAsset: {},
            showInfowindow: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.assets != nextState.assets) {
            return true
        }
        if (this.state.center.lat != nextState.center.lat) {
            return true
        } else return false
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            assets: nextProps.assets
        })
    }

    polygonSelection(asset) {
        this.setState({
            center: setCenter(asset.shape.points),
            zoom: 16,
            selectedAsset: asset,
            showInfowindow: true
        })
    }

    closeWindow() {
        this.setState({
            showInfowindow: false,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 }
        })
    }

    render() {
        const {
            center,
            zoom,
            showInfowindow,
            selectedAsset,
            assets
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
                defaultOptions={{ styles: mapStyle as any }}
            >
                {assets.length > 0 &&
                    assets.map((asset, index) => {
                        let color = randomcolor()
                        if (asset.shape && asset.shape.points != null) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        options={{ fillColor: color, strokeColor: color, strokeWeight: 3, fillOpacity: 0.4 }}
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
                        <div className='col-md-12 text-center' style={{ maxWidth: '250px' }}>
                            <h5>{selectedAsset.assetType}</h5>
                            <h4>{selectedAsset.assetName}</h4>
                            <button className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>
                        </div>
                    </InfoWindow>
                }
            </GoogleMap>
        )

        return (
            <div id='asset-map'>
                <MapComponent />
            </div>
        )
    }
}
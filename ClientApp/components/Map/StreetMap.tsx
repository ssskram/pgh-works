import * as React from "react";
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"
import LoadingMap from './../Utilities/LoadingMap'
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"

export class StreetMap extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            assets: []
        }
    }

    componentDidMount() {
        this.collectSegmentShapes(this.props.street)
    }

    componentWillReceiveProps(nextProps) {
        this.collectSegmentShapes(nextProps.street)
    }

    collectSegmentShapes(street) {
        const assets = this.props.assets.filter(asset => {
            return asset.assetName == street
        })
        this.setState ({
            assets: assets
        })
    }

    handleOverlayComplete = (evt) => {
        let shape: any[] = []
        let vertices = evt.overlay.getPath()

        for (var i = 0; i < vertices.getLength(); i++) {
            var xy = vertices.getAt(i);
            var coord = { lat: xy.lat(), lng: xy.lng() }
            shape.push(coord)
        }
        this.props.passShape(shape)
    }

    render() {
        const {
            assets,
            zoom,
            center
        } = this.state

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
                {assets &&
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
            </GoogleMap>
        )

        return (
            <div id='single-project'>
                <MapComponent />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets
    }),
    ({
        ...Assets.actionCreators
    })
)(StreetMap as any) as typeof StreetMap
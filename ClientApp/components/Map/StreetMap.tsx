import * as React from "react";
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"
import LoadingMap from './../Utilities/LoadingMap'
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import inside from 'point-in-polygon'

export class StreetMap extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            assets: [],
            onFilter: false
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
        var middle = Math.floor(assets.length / 2);
        const middleSegment = assets[middle]
        this.setCenter(middleSegment.shape.points, 13)
        this.setState({
            assets: assets
        })
    }

    setCenter(points, zoom) {
        const bounds = new google.maps.LatLngBounds()
        var i
        for (i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }
        let lat = bounds.getCenter().lat()
        let lng = bounds.getCenter().lng()
        this.setState({
            center: { lat: lat, lng: lng },
            zoom: zoom
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
        this.setState({
            onFilter: true
        })
        this.props.passShape(shape)
    }

    render() {
        const {
            assets,
            zoom,
            center,
            onFilter
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
                        },
                        polygonOptions: {
                            fillColor: 'red',
                            strokeColor: 'red'
                        }
                    }}
                    {...props}
                    onOverlayComplete={this.handleOverlayComplete}
                />
            </GoogleMap>
        )

        return (
            <div>
                <div>
                    <div>
                        {onFilter == false &&
                            <div className='text-center'>
                                <h4><i>To filter relevant projects/phases by specific street area,<br />use the drawing tool to select street segment</i></h4>
                            </div>
                        }
                        {onFilter == true &&
                            <div className='text-center'>
                                <button className='btn btn-warning'>Clear filter</button>
                            </div>
                        }
                    </div>
                </div>
                <div id='single-project'>
                    <MapComponent />
                </div>
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
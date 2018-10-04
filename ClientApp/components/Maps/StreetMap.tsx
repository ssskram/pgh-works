import * as React from "react";
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon } from "react-google-maps"
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager"
import inside from 'point-in-polygon'
import setCenter from './../../functions/setCenter'

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
        const middle = Math.floor(assets.length / 2);
        const middleSegment = assets[middle]
        this.setState({
            center: setCenter(middleSegment.shape.points),
            zoom: 13,
            assets: assets
        })
    }

    handleOverlayComplete = (evt) => {
        let shape = { points: [] as any }
        let vertices = evt.overlay.getPath()
        for (let i = 0; i < vertices.getLength(); i++) {
            let xy = vertices.getAt(i);
            let coord = { lat: xy.lat(), lng: xy.lng() }
            shape.points.push(coord)
        }
        let formattedShape = [] as any
        shape.points.forEach(point => {
            const shapeArray = [point.lat, point.lng]
            formattedShape.push(shapeArray)
        })
        this.props.passShape(formattedShape)
        const filteredAssets = [] as any
        const assets = this.props.assets.filter(asset => {
            return asset.assetName == this.props.street
        })
        assets.forEach(asset => {
            if (asset.shape) {
                asset.shape.points.forEach(function (point) {
                    const ins = inside([point.lat, point.lng], formattedShape)
                    if (ins == true && !filteredAssets.includes(asset)) {
                        filteredAssets.push(asset)
                    }
                })
            }
        })
        const middle = Math.floor(filteredAssets.length / 2);
        const middleSegment = filteredAssets[middle]
        this.setState({
            center: setCenter(middleSegment.shape.points),
            zoom: 13,
            assets: filteredAssets,
            onFilter: true
        })
    }

    reset() {
        this.setState({
            onFilter: false
        }, function (this) {
            this.collectSegmentShapes(this.props.street)
            this.props.reset()
        })
    }

    render() {
        const {
            assets,
            zoom,
            center,
            onFilter
        } = this.state

        const {
            assetName
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
                            strokeColor: 'red',
                            strokeOpacity: 1,
                            strokeWeight: 3
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
                    {onFilter == false &&
                        <div className='text-center'>
                            <h4><i>To filter by specific span of {assetName},<br />use the drawing tool to outline a segment</i></h4>
                        </div>
                    }
                    {onFilter == true &&
                        <div className='text-center'>
                            <button className='btn btn-warning' onClick={this.reset.bind(this)}>Clear filter</button>
                        </div>
                    }
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
// map that renders on asset report where asset type == street
// handles user input through polygon tool to filter
// tags by certain segment of street

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as Assets from "../../store/GETS/taggableAssets";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon
} from "react-google-maps";
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import setCenter from "./../../functions/setCenter";
import handleOverlayComplete from "./../../functions/handleOverlayComplete";
import findMiddleSegment from "./../../functions/findMiddleSegment";
import assetsInPolygon from "./../../functions/assetsInPolygon";

const mapStyle = require("./featurelessLight.json");

export class StreetMap extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 13,
      center: { lat: 40.437470539681442, lng: -79.987124601795273 },
      assets: [],
      onFilter: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.center.lat != this.state.center.lat) {
      return true;
    } else if (this.state.onFilter != nextState.onFilter) {
      return true;
    } else return false;
  }

  componentDidMount() {
    this.collectSegmentShapes(this.props.street);
  }

  componentWillReceiveProps(nextProps) {
    this.collectSegmentShapes(nextProps.street);
  }

  collectSegmentShapes(street) {
    const assets = this.props.assets.filter(asset => {
      return asset.assetName == street;
    });
    this.setState({
      center: setCenter(findMiddleSegment(assets).shape.points),
      zoom: 13,
      assets: assets,
      onFilter: false
    });
  }

  handleShape = evt => {
    const shape = handleOverlayComplete(evt);
    this.props.passShape(shape.points);
    const assets = this.props.assets.filter(asset => {
      return asset.assetName == this.props.street;
    });
    const filteredAssets = assetsInPolygon(shape.points, assets);
    this.setState({
      center: setCenter(findMiddleSegment(filteredAssets).shape.points),
      zoom: 13,
      assets: filteredAssets,
      onFilter: true
    });
  };

  reset() {
    this.collectSegmentShapes(this.props.street);
    this.props.reset();
  }

  render() {
    const { assets, zoom, center, onFilter } = this.state;

    const { assetName } = this.props;

    const MapComponent = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyA89-c5tGTUcwg5cbyoY9QX1nFwATbvk6g&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />
      }),
      withScriptjs,
      withGoogleMap
    )(props => (
      <GoogleMap
        zoom={zoom}
        defaultCenter={center}
        defaultOptions={{ styles: mapStyle as any }}
      >
        {assets &&
          assets.map((asset, index) => {
            if (asset.shape) {
              return (
                <div key={index}>
                  <Polygon
                    options={{
                      fillColor: "#337ab7",
                      strokeColor: "#337ab7",
                      strokeWeight: 3,
                      fillOpacity: 0.4
                    }}
                    paths={[asset.shape.points]}
                  />
                </div>
              );
            }
          })}
        <DrawingManager
          defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
              fillColor: "red",
              strokeColor: "red",
              strokeOpacity: 1,
              strokeWeight: 3
            }
          }}
          {...props}
          onOverlayComplete={this.handleShape}
        />
      </GoogleMap>
    ));

    return (
      <div>
        <div>
          {onFilter == false && (
            <div className="text-center">
              <h4>
                <i>
                  To filter by specific span of {assetName},<br />
                  use the drawing tool to outline a segment
                </i>
              </h4>
            </div>
          )}
          {onFilter == true && (
            <div className="text-center">
              <button
                className="btn btn-warning"
                onClick={this.reset.bind(this)}
              >
                Clear segment selection
              </button>
            </div>
          )}
        </div>
        <div id="single-project">
          <MapComponent />
        </div>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.taggableAssets
  }),
  {
    ...Assets.actionCreators
  }
)(StreetMap as any) as typeof StreetMap;

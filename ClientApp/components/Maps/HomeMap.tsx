// returns all projects to home map

import * as React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
  InfoWindow
} from "react-google-maps";
import randomcolor from "randomcolor";
import setCenter from "./../../functions/setCenter";

const mapStyle = require("./featurelessLight.json");

export default class HomeMap extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      projects: props.projects,
      zoom: 13,
      center: { lat: 40.449801, lng: -79.994935 },
      selectedProject: {},
      showInfowindow: false
    };
  }

  componentWillMount() {
    if (window.innerWidth < 1000) {
      this.setState({ zoom: 12 });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.projects != nextState.projects) {
      return true;
    }
    if (this.state.center.lat != nextState.center.lat) {
      return true;
    } else return false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      projects: nextProps.projects
    });
  }

  polygonSelection(project) {
    this.setState({
      center: setCenter(project.shape.points),
      zoom: 16,
      selectedProject: project,
      showInfowindow: true
    });
  }

  closeWindow() {
    this.setState({
      showInfowindow: false,
      zoom: 13,
      center: { lat: 40.437470539681442, lng: -79.987124601795273 }
    });
  }

  render() {
    const {
      projects,
      zoom,
      center,
      showInfowindow,
      selectedProject
    } = this.state;

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
        defaultZoom={zoom}
        defaultCenter={center}
        defaultOptions={{ styles: mapStyle as any }}
      >
        {projects &&
          projects.map((project, index) => {
            let color = randomcolor();
            if (project.shape.points) {
              return (
                <div key={index}>
                  <Polygon
                    options={{
                      fillColor: color,
                      strokeColor: color,
                      strokeWeight: 3,
                      fillOpacity: 0.4
                    }}
                    paths={[project.shape.points]}
                    onClick={() => this.polygonSelection(project)}
                  />
                </div>
              );
            }
          })}
        {showInfowindow == true && (
          <InfoWindow
            position={center}
            onCloseClick={this.closeWindow.bind(this)}
          >
            <div
              className="col-md-12 text-center"
              style={{ maxWidth: "250px" }}
            >
              <div>
                <b>Project</b>
              </div>
              <h4>{selectedProject.projectName}</h4>
              <button
                onClick={() => this.props.receiveProject(selectedProject)}
                className="btn"
              >
                <span className="glyphicon glyphicon-arrow-right" />
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    ));
    return (
      <div id="home-map">
        <MapComponent />
      </div>
    );
  }
}

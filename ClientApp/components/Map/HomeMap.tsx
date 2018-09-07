import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"

export default class HomeMap extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            projects: props.projects,
            zoom: 13,
            center: { lat: 40.437470539681442, lng: -79.987124601795273 },
            selectedProject: {},
            showInfowindow: false
        }
    }

    componentDidMount() {
        console.log(this.props.projects)
    }

    polygonSelection(project) {
        this.setCenter(project.shape)
        this.setState({
            selectedProject: project,
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

    closeWindow() {
        this.setState({
            showInfowindow: false,
            zoom: 13
        })
    }

    render() {
        const {
            projects,
            zoom,
            center,
            showInfowindow,
            selectedProject
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
                {projects &&
                    projects.map((project, index) => {
                        if (project.shape) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        paths={[project.shape]}
                                        onClick={() => this.polygonSelection(project)}>
                                    </Polygon>
                                </div>

                            )
                        }
                    })
                }
                {showInfowindow == true &&
                    <InfoWindow position={center} onCloseClick={this.closeWindow.bind(this)}>
                        <div className='col-md-12'>
                            <h4>{selectedProject.projectName}</h4>
                            <button onClick={() => this.props.receiveProject(selectedProject)} className='btn btn-success'>Open project</button>
                        </div>
                    </InfoWindow>
                }
            </GoogleMap>
        )
        return (
            <div id='home-map'>
                <MapComponent />
            </div>
        )
    }
}
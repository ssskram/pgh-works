import * as React from "react";
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Polygon, InfoWindow } from "react-google-maps"
import randomcolor from 'randomcolor'

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

    componentWillReceiveProps(nextProps) {
        this.setState ({
            projects: nextProps.projects
        })
    }

    polygonSelection(project) {
        this.setCenter(project.shape.points)
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
            showInfowindow: false
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
                        let color = randomcolor()
                        if (project.shape.points) {
                            return (
                                <div key={index}>
                                    <Polygon
                                        options={{fillColor: color, strokeColor: color, strokeWeight: 3, fillOpacity: 0.4}}
                                        paths={[project.shape.points]}
                                        onClick={() => this.polygonSelection(project)}>
                                    </Polygon>
                                </div>

                            )
                        }
                    })
                }
                {showInfowindow == true &&
                    <InfoWindow position={center} onCloseClick={this.closeWindow.bind(this)}>
                        <div className='col-md-12 text-center' style={{maxWidth: '250px'}}>
                            <h3>{selectedProject.projectName}</h3>
                            <button onClick={() => this.props.receiveProject(selectedProject)} className='btn btn-success' style={{width: '100%'}}><span className='glyphicon glyphicon-arrow-right'></span></button>
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
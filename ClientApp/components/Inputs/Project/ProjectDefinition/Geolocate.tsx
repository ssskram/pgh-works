// project geolocation module
// import a shape, or create a new shape

import * as React from "react";
import Modal from "react-responsive-modal";
import Import from "../../Shapes/ImportShape";
import New from "../../Shapes/NewShape";
import Map from "../../../Maps/ProjectMap";

const newShapeImg = require("./../../../../images/importShape.png");
const polygonImg = require("./../../../../images/polygon.png");

const imgSize = {
  height: "120px",
  margin: "10px"
};

const bigFont = {
  fontSize: "25px"
};

const saveBtn = {
  fontSize: "22px",
  padding: "15px"
};

export default class Geolocate extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      modalIsOpen: false,
      shape: {}
    };
  }

  componentDidMount() {
    if (this.props.shape) {
      this.setState({
        shape: this.props.shape
      });
    }
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  importShape() {
    this.setState({
      type: "import",
      modalIsOpen: true
    });
  }

  newShape() {
    this.setState({
      type: "new",
      modalIsOpen: true
    });
  }

  setShape(shape) {
    this.props.setShape(shape, this.state.type);
    this.setState({
      shape: shape,
      modalIsOpen: false
    });
  }

  public render() {
    const { modalIsOpen, shape, type } = this.state;

    return (
      <div className="text-center">
        {shape.points && (
          <div>
            <Map shape={shape} />
            <br />
            <div className="row">
              <button
                style={saveBtn}
                onClick={this.props.next}
                className="btn btn-success"
              >
                <b>Save and continue</b>
              </button>
            </div>
            <div className="row">
              <button
                onClick={this.newShape.bind(this)}
                className="btn btn-warning"
              >
                Draw a new shape
              </button>
            </div>
            <div className="row">
              <button
                onClick={this.importShape.bind(this)}
                className="btn btn-warning"
              >
                Import a different shape
              </button>
            </div>
          </div>
        )}
        {Object.keys(shape).length == 0 && (
          <div>
            <button
              onClick={this.newShape.bind(this)}
              className="btn btn-primary btn-big"
            >
              <div className="row">
                <div className="col-md-12">
                  <img style={imgSize} src={polygonImg as string} />
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <span style={bigFont}>
                      <b>New shape</b>
                    </span>
                  </div>
                  <div className="row">
                    <i>
                      Draw a polygon that will serve as the geographical bounds
                      for your project
                    </i>
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={this.importShape.bind(this)}
              className="btn btn-primary btn-big"
            >
              <div className="row">
                <div className="col-md-12">
                  <img style={imgSize} src={newShapeImg as string} />
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <span style={bigFont}>
                      <b>Import shape</b>
                    </span>
                  </div>
                  <div className="row">
                    <i>
                      Import an existing polygon from a facility, pool,
                      playground, intersection, bridge, project, retaining wall,
                      street segment, park, or steps
                    </i>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}
        <Modal
          open={modalIsOpen}
          onClose={this.closeModal.bind(this)}
          classNames={{
            overlay: "custom-overlay",
            modal: "custom-modal"
          }}
          center
        >
          {type == "import" && <Import passShape={this.setShape.bind(this)} />}
          {type == "new" && <New passShape={this.setShape.bind(this)} />}
        </Modal>
      </div>
    );
  }
}

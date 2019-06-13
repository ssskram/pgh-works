// module to update the location of an existing project

import * as React from "react";
import Import from "../Shapes/ImportShape";
import New from "../Shapes/NewShape";
import TaggableAssetSelection from "./../../Inputs/Tag/RelevantAssetTypes";

const newShapeImg = require("./../../../images/importShape.png");
const polygonImg = require("./../../../images/polygon.png");

const imgSize = {
  height: "70px"
};

const minWidth = {
  minWidth: "250px"
};

export default class UpdateLocation extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      stage: "",
      shape: [],
      types: []
    };
  }

  importShape() {
    this.setState({
      stage: "import"
    });
  }

  newShape() {
    this.setState({
      stage: "new"
    });
  }

  saveShape(shape) {
    const fullShape = {
      points: shape.points,
      breaks: [],
      shapeType: "3"
    };
    this.setState({
      shape: fullShape,
      stage: "types"
    });
  }

  receiveTypes(types) {
    this.setState(
      {
        types: types
      },
      function(this) {
        this.setShape(this.state.shape);
      }
    );
  }

  setShape(shape) {
    if (this.state.stage == "import") {
      this.props.setShape(shape, "all");
    } else {
      // new shape, include types
      this.props.setShape(shape, this.state.types);
    }
  }

  public render() {
    const { stage } = this.state;

    return (
      <div>
        <br />
        {stage == "" && (
          <div>
            <h3 className="text-center">Change the location</h3>
            <hr />
            <div className="text-center" style={minWidth}>
              <div className="row">
                <button
                  onClick={this.newShape.bind(this)}
                  title="Draw a new shape"
                  className="btn btn-primary btn-big"
                >
                  <div className="row">
                    <div className="col-md-12">
                      <img style={imgSize} src={polygonImg as string} />
                    </div>
                  </div>
                </button>
              </div>
              <div className="row">
                <button
                  onClick={this.importShape.bind(this)}
                  title="Import from existing asset"
                  className="btn btn-primary btn-big"
                >
                  <div className="row">
                    <div className="col-md-12">
                      <img style={imgSize} src={newShapeImg as string} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {stage == "new" && <New passShape={this.saveShape.bind(this)} />}
        {stage == "import" && <Import passShape={this.setShape.bind(this)} />}
        {stage == "types" && (
          <TaggableAssetSelection receiveTypes={this.receiveTypes.bind(this)} />
        )}
      </div>
    );
  }
}

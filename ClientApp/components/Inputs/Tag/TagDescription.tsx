// tag description form

import * as React from "react";
import TextArea from "../../FormElements/textarea";

export default class TagDescription extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      tagDescription: ""
    };
  }

  handleChildChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  postTag() {
    if (this.props.asset) {
      const tagLoad = {
        taggedAssetName: this.props.asset.assetName,
        taggedAssetOID: this.props.asset.assetOID,
        tagType: this.props.asset.assetType,
        tagDescription: this.state.tagDescription
      };
      this.props.receiveDescription(tagLoad);
    } else {
      this.props.receiveDescription(this.state.tagDescription);
    }
  }

  public render() {
    const { tagDescription } = this.state;

    const isEnabled = tagDescription != "";

    return (
      <div>
        <div className="col-md-12">
          <TextArea
            value={tagDescription}
            name="tagDescription"
            header="Description"
            required={true}
            placeholder="Provide a brief explanation of the relationship"
            callback={this.handleChildChange.bind(this)}
          />
        </div>
        <div className="col-md-12">
          <button
            onClick={this.props.back}
            className="btn btn-warning pull-left"
          >
            Back
          </button>
          <button
            disabled={!isEnabled}
            onClick={this.postTag.bind(this)}
            className="btn btn-success pull-right"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

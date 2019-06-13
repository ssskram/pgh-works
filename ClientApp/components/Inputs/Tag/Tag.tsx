// passes tag back to parent container

import * as React from "react";
import TaggableAssetSelection from "./NewTag";

export default class Tag extends React.Component<any, any> {
  receiveTag(tag) {
    // set state here
    this.props.postTag(tag);
  }

  public render() {
    return (
      <div>
        <br />
        <TaggableAssetSelection
          parent={"asset"}
          receiveTag={this.receiveTag.bind(this)}
          parentID={this.props.parentID}
          parentName={this.props.parentName}
          parentType={this.props.parentType}
          closeModal={this.props.closeModal}
        />
      </div>
    );
  }
}

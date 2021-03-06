import * as React from "react";
import NavMenu from "./NavMenu";

export class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <div className="container-fluid mainApp">
        <div className="col-sm-3">
          <div className="row">
            <NavMenu />
          </div>
        </div>
        <div className="col-sm-9">{this.props.children}</div>
      </div>
    );
  }
}

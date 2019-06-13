import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as Milestones from "../../store/milestones";

export class DeleteMilestone extends React.Component<any, any> {
  deleteMilestone() {
    // remove from store
    this.props.deleteMilestone(this.props.milestone);
    // then delete locally
    this.props.removeMilestone(this.props.milestone);
    this.props.closeModal();
  }

  public render() {
    return (
      <div className="col-md-12 text-center">
        <h2>Are you sure you want to delete this milestone?</h2>
        <button
          onClick={this.deleteMilestone.bind(this)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.milestones
  }),
  {
    ...Milestones.actionCreators
  }
)(DeleteMilestone as any) as typeof DeleteMilestone;

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as Tasks from "../../store/tasks";

export class DeleteTask extends React.Component<any, any> {
  deleteTask() {
    // remove from store
    this.props.deleteTask(this.props.task);
    // then delete locally
    this.props.removeTask(this.props.task);
    this.props.closeModal();
  }

  public render() {
    return (
      <div className="col-md-12 text-center">
        <h2>Are you sure you want to delete this task?</h2>
        <button onClick={this.deleteTask.bind(this)} className="btn btn-danger">
          Delete
        </button>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.tasks
  }),
  {
    ...Tasks.actionCreators
  }
)(DeleteTask as any) as typeof DeleteTask;

// new task generation

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as Tasks from "../../store/tasks";
import * as User from "../../store/GETS/user";
import Input from "../FormElements/input";
import Datepicker from "../FormElements/datepicker";
import { v1 as uuid } from "uuid";
import * as moment from "moment";

export class TaskInputs extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      projectID: "",
      phaseID: "",
      taskID: "",
      cartegraphID: "",
      taskName: "",
      notes: "",
      percentComplete: 0,
      dueDate: "",
      dateCompleted: ""
    };
  }

  componentDidMount() {
    this.editTask(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.editTask(nextProps);
  }

  editTask(props) {
    if (props.task) {
      // update task
      this.setState({
        projectID: this.props.task.projectID,
        phaseID: this.props.task.phaseID,
        taskID: this.props.task.taskID,
        cartegraphID: this.props.task.cartegraphID,
        taskName: this.props.task.taskName,
        notes: this.props.task.notes,
        percentComplete: this.props.task.percentComplete,
        dueDate: this.props.task.dueDate,
        dateCompleted: this.props.task.dateCompleted
      });
    } else {
      // new task
      const guid: string = uuid();
      this.setState({
        projectID: this.props.projectID,
        phaseID: this.props.phaseID,
        taskID: guid
      });
    }
  }

  handleChildChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDueDate(date) {
    if (date) {
      this.setState({
        dueDate: moment(date).format("MM/DD/YYYY")
      });
    } else {
      this.setState({
        dueDate: null
      });
    }
  }

  post() {
    if (this.props.task) {
      // update
      this.props.updateTask(this.state);
      this.props.closeModal();
    } else {
      // new
      this.props.addTask(this.state);
      this.props.closeModal();
    }
  }

  public render() {
    const { taskName, dueDate, notes } = this.state;

    // validation
    const isEnabled = taskName != "";

    return (
      <div>
        <h3>Task</h3>
        <hr />
        <div className="col-md-12">
          <Input
            value={taskName}
            required={true}
            name="taskName"
            header="Task"
            placeholder="Enter a task"
            callback={this.handleChildChange.bind(this)}
          />
        </div>

        <div className="col-md-12">
          <Datepicker
            value={dueDate}
            name="dueDate"
            required={false}
            header="Due date"
            placeholder="Select a date"
            callback={this.handleDueDate.bind(this)}
          />
        </div>

        <div className="col-md-12">
          <Input
            value={notes}
            required={false}
            name="notes"
            header="Notes"
            placeholder="Other relevant information"
            callback={this.handleChildChange.bind(this)}
          />
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <div>
              <button
                disabled={!isEnabled}
                className="btn btn-success"
                onClick={this.post.bind(this)}
              >
                <b>Save</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.tasks,
    ...state.user
  }),
  {
    ...User.actionCreators,
    ...Tasks.actionCreators
  }
)(TaskInputs as any) as typeof TaskInputs;

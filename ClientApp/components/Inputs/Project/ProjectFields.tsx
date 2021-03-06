// form fields for project input/update

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import * as Personnel from "../../../store/GETS/personnel";
import Input from "../../FormElements/input";
import TextArea from "../../FormElements/textarea";
import Select from "../../FormElements/select";
import Datepicker from "../../FormElements/datepicker";

const statuses = [
  { value: "Not started", label: "Not started", name: "projectStatus" },
  { value: "Programming", label: "Programming", name: "projectStatus" },
  { value: "Design", label: "Design", name: "projectStatus" },
  { value: "Construction", label: "Construction", name: "projectStatus" },
  { value: "Complete", label: "Complete", name: "projectStatus" }
];

const departments = [
  { value: "DOMI", label: "DOMI", name: "projectDepartment" },
  { value: "DPW", label: "DPW", name: "projectDepartment" }
];

const sectionHeader = {
  marginLeft: "30px",
  letterSpacing: "2px",
  fontWeight: 600 as any
};

const dateStyle = {
  backgroundColor: "rgba(92, 184, 92, .05)",
  padding: "10px",
  borderRadius: "10px",
  margin: "20px 0px"
};

const ownerStyle = {
  backgroundColor: "rgba(34, 41, 107, .05)",
  padding: "10px",
  borderRadius: "10px",
  margin: "20px 0px"
};

const glyphs = {
  marginRight: "25px",
  fontSize: "30px"
};

export class ProjectInputs extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      personnel: [],
      throwDateError: false
    };
    this.handleDate = this.handleDate.bind(this);
  }

  componentDidMount() {
    const personnel = [] as any;
    this.props.personnel.forEach(user => {
      const personnelSelect = {
        value: user.title,
        label: user.title,
        name: "projectManager"
      };
      personnel.push(personnelSelect);
    });
    this.setState({
      personnel: personnel
    });
  }

  handleChildChange(event) {
    this.props.handleInput(event);
  }

  handleChildSelect(event) {
    this.props.handleSelect(event);
  }

  handleMembersMulti(value) {
    this.props.handleMulti("projectMembers", value);
  }

  handleDate(date, name) {
    // check for valid span
    let valid = true;
    if (name == "expectedStartDate") {
      if (this.props.description.expectedEndDate)
        valid = date.isBefore(this.props.description.expectedEndDate, "day");
    }
    if (name == "expectedEndDate") {
      if (this.props.description.expectedStartDate)
        valid = date.isAfter(this.props.description.expectedStartDate, "day");
    }
    if (name == "actualStartDate") {
      if (this.props.description.actualEndDate)
        valid = date.isBefore(this.props.description.actualEndDate, "day");
    }
    if (name == "actualEndDate") {
      if (this.props.description.actualStartDate)
        valid = date.isAfter(this.props.description.actualStartDate, "day");
    }
    if (valid == true) {
      this.props.handleDate(date, name);
      this.setState({ throwDateError: false });
    } else {
      this.setState({ throwDateError: true });
    }
  }

  handleCurrency(event, maskedvalue, floatvalue) {
    this.props.handleCurrency(floatvalue);
  }

  public render() {
    const {
      projectName,
      expectedStartDate,
      expectedEndDate,
      actualStartDate,
      actualEndDate,
      projectManager,
      projectMembers,
      projectDepartment,
      projectDescription,
      projectStatus,
      projectLocation,
      notes,
      update
    } = this.props.description;

    const { personnel, throwDateError } = this.state;

    return (
      <div style={{ padding: "10px" }}>
        {!update && (
          <div className="col-md-12">
            <br />
            <div className="text-center" style={{ marginBottom: "-35px" }}>
              Try to include special identifying information, such as a year
            </div>
            <Input
              value={projectName}
              name="projectName"
              required={true}
              header="Project name"
              placeholder="Enter a name"
              callback={this.handleChildChange.bind(this)}
            />
          </div>
        )}

        <div className="col-md-12">
          <Select
            value={projectStatus}
            name="projectStatus"
            header="Project status"
            placeholder="Select status(es)"
            onChange={this.handleChildSelect.bind(this)}
            multi={false}
            required={true}
            options={statuses}
          />
        </div>

        <div className="col-md-6">
          <TextArea
            value={projectDescription}
            name="projectDescription"
            header="Project description"
            placeholder="Provide a brief explanation of the project"
            callback={this.handleChildChange.bind(this)}
          />
        </div>

        <div className="col-md-6">
          <TextArea
            value={notes}
            name="notes"
            header="Notes"
            placeholder="Enter any other relevant information"
            callback={this.handleChildChange.bind(this)}
          />
        </div>

        <div className="col-md-12">
          <Input
            value={projectLocation}
            name="projectLocation"
            required={false}
            header="Location"
            placeholder="Room, floor, etc."
            callback={this.handleChildChange.bind(this)}
          />
        </div>

        <div className="col-md-12" style={ownerStyle}>
          <h3 style={sectionHeader}>
            Owners
            <span
              style={glyphs}
              className="glyphicon glyphicon-user hidden-sm hidden-xs pull-right"
            />
          </h3>
          <div className="col-md-12">
            <Select
              value={projectDepartment}
              name="projectDepartment"
              required={true}
              header="Department"
              placeholder="Select a department"
              onChange={this.handleChildSelect.bind(this)}
              multi={false}
              options={departments}
            />
          </div>

          <div className="col-md-12">
            <Select
              value={projectManager}
              name="projectManager"
              header="Project manager"
              required={true}
              placeholder="Select manager"
              onChange={this.handleChildSelect.bind(this)}
              multi={false}
              options={personnel}
            />
          </div>

          <div className="col-md-12">
            <Select
              value={projectMembers}
              name="projectMembers"
              header="Project members"
              placeholder="Select team members"
              onChange={this.handleMembersMulti.bind(this)}
              multi={true}
              options={personnel}
              delimiter="; "
            />
          </div>
        </div>
        {throwDateError == true && (
          <div className="col-md-12">
            <div className="alert alert-danger text-center">
              <span style={{ fontSize: "1.5em" }}>Please check your dates</span>
              <br />
              End dates can not come before start dates
            </div>
          </div>
        )}
        <div style={dateStyle} className="col-md-12">
          <h3 style={sectionHeader}>
            Duration
            <span
              style={glyphs}
              className="glyphicon glyphicon-calendar hidden-sm hidden-xs pull-right"
            />
          </h3>
          <div className="col-md-6">
            <Datepicker
              value={expectedStartDate}
              name="expectedStartDate"
              header="Expected start date"
              required={true}
              placeholder="Select a date"
              callback={value => this.handleDate(value, "expectedStartDate")}
            />
          </div>

          <div className="col-md-6">
            <Datepicker
              value={expectedEndDate}
              name="expectedEndDate"
              header="Expected end date"
              required={true}
              placeholder="Select a date"
              callback={value => this.handleDate(value, "expectedEndDate")}
            />
          </div>

          <div className="col-md-6">
            <Datepicker
              value={actualStartDate}
              name="actualStartDate"
              header="Actual start date"
              placeholder="Select a date"
              callback={value => this.handleDate(value, "actualStartDate")}
            />
          </div>

          <div className="col-md-6">
            <Datepicker
              value={actualEndDate}
              name="actualEndDate"
              header="Actual end date"
              placeholder="Select a date"
              callback={value => this.handleDate(value, "actualEndDate")}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.personnel
  }),
  {
    ...Personnel.actionCreators
  }
)(ProjectInputs as any) as typeof ProjectInputs;

// top level phase report
// parent of Phasecard.tsx
// parent of Milestones.tsx
// parent of SubPhases.tsx
// co-parent of Tags.tsx

import * as React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import * as Ping from "../../../store/GETS/ping";
import * as Projects from "../../../store/projects";
import * as Phases from "../../../store/phases";
import * as Personnel from "../../../store/GETS/personnel";
import * as User from "../../../store/GETS/user";
import Spinner from "../../Utilities/Spinner";
import Modal from "react-responsive-modal";
import PhaseForm from "../../Inputs/Phase/Phase";
import PhaseCard from "../../Cards/PhaseSlider";
import Tags from "../Tags";
import Milestones from "./Milestones";
import Subphases from "./SubPhases";
import Timeline from "../../Timeline/PhaseTimeline";
import DeletePhase from "../../DeleteConfirmations/DeletePhase";
import Hydrate from "./../../Utilities/HydrateStore";
import canEdit from "../../../functions/canEdit";
import Tasks from "./Tasks";

const btnMargin = {
  margin: "25px",
  padding: "5px 12px"
};

const marginBottom = {
  marginBottom: "70px"
};

export class Phase extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // utilities
      spinner: true,
      modalIsOpen: false,
      modalType: "",
      redirect: false,
      redirectLink: "",
      canEdit: true,

      // phase state
      phaseID: "",
      cartegraphID: "",
      phaseName: "",
      phaseType: "",
      expectedStartDate: "",
      expectedEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      phaseDescription: "",
      phaseStatus: "",
      percentComplete: "",
      notes: "",

      // parent project
      projectID: "",
      projectName: ""
    };
    this.setPhaseState = this.setPhaseState.bind(this);
    this.findPhase = this.findPhase.bind(this);
    this.findProject = this.findProject.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // ping server
    this.props.ping();
    this.findPhase(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.findPhase(nextProps);
    }
  }

  findPhase(props) {
    // set phase, and pass phase to setProjectState
    const id = this.props.match.params.id;
    let phase = props.phases.find(function(item) {
      return item.phaseID == id;
    });
    if (phase && props.personnel && props.user) {
      this.setPhaseState(phase, props.personnel, props.user);
    }
  }

  setPhaseState(phase, personnel, user) {
    const project = this.props.projects.find(project => {
      return project.projectID == phase.projectID;
    });
    this.setState(
      {
        projectID: phase.projectID,
        phaseID: phase.phaseID,
        cartegraphID: phase.cartegraphID,
        phaseName: phase.phaseName,
        phaseType: phase.phaseType,
        expectedStartDate: phase.expectedStartDate,
        expectedEndDate: phase.expectedEndDate,
        actualStartDate: phase.actualStartDate,
        actualEndDate: phase.actualEndDate,
        phaseDescription: phase.phaseDescription,
        phaseStatus: phase.phaseStatus,
        percentComplete: phase.percentComplete,
        notes: phase.notes,
        canEdit: canEdit(project, personnel, user)
      },
      function(this) {
        this.findProject(this.state.projectID);
      }
    );
  }

  findProject(id) {
    let project = this.props.projects.find(function(item) {
      return item.projectID == id;
    });
    if (project) {
      this.setState({
        projectName: project.projectName,
        spinner: false
      });
    }
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      modalType: ""
    });
  }

  returnToProject() {
    this.setState({
      redirect: true,
      redirectLink: "/Project/id=" + this.state.projectID
    });
  }

  editPhase() {
    this.setState({
      modalIsOpen: true,
      modalType: "edit"
    });
  }

  deletePhase() {
    this.setState({
      modalIsOpen: true,
      modalType: "delete"
    });
  }

  public render() {
    const {
      redirect,
      redirectLink,
      spinner,
      modalIsOpen,
      modalType,
      canEdit,
      phaseID,
      phaseName,
      phaseType,
      projectID,
      projectName,
      expectedStartDate,
      expectedEndDate
    } = this.state;

    if (redirect) {
      return <Redirect push to={redirectLink} />;
    }

    return (
      <div>
        {spinner == true && <Spinner notice="...loading the phase..." />}
        {spinner == false && (
          <div>
            <div style={{ letterSpacing: "2px" }}>
              <div style={{ marginLeft: "5px" }}>Project</div>
              <div
                className="btn btn-secondary"
                onClick={this.returnToProject.bind(this)}
                title="Return to project"
              >
                <span
                  style={{ marginRight: "10px" }}
                  className="glyphicon glyphicon-home"
                />
                {projectName}
              </div>
            </div>
            <br />
            <h5 className="text-center" style={{ marginBottom: "-15px" }}>
              Phase
            </h5>
            <h1 className="text-center">{phaseName}</h1>
            <h4 className="text-center">{phaseType}</h4>
            {canEdit == true && (
              <div className="text-center" style={{ marginTop: "20px" }}>
                <span>
                  <button
                    onClick={this.editPhase.bind(this)}
                    title="Update info"
                    style={btnMargin}
                    type="button"
                    className="btn  btn-primary"
                  >
                    Edit phase
                  </button>
                </span>
                <span>
                  <button
                    onClick={this.deletePhase.bind(this)}
                    title="Delete phase"
                    style={btnMargin}
                    type="button"
                    className="btn  btn-danger"
                  >
                    Delete phase
                  </button>
                </span>
              </div>
            )}
            <div className="col-md-12">
              <PhaseCard phase={this.state} />
            </div>
            {expectedStartDate && expectedEndDate && (
              <div style={marginBottom} className="col-md-12 row">
                <Timeline phase={this.state} />
              </div>
            )}
            <div style={marginBottom} className="col-md-12 row">
              <Tasks
                canEdit={canEdit}
                phaseID={phaseID}
                projectID={projectID}
              />
            </div>
            <div style={marginBottom} className="col-md-12 row">
              <Milestones
                canEdit={canEdit}
                phaseID={phaseID}
                projectID={projectID}
              />
            </div>
            <div style={marginBottom} className="col-md-12 row">
              <Subphases
                canEdit={canEdit}
                phaseID={phaseID}
                projectID={projectID}
              />
            </div>
            <div style={marginBottom} className="col-md-12 row">
              <Tags
                canEdit={canEdit}
                parentID={phaseID}
                parentName={phaseName}
                parentType="Phase"
              />
            </div>
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
          {modalType == "edit" && (
            <PhaseForm
              phaseID={phaseID}
              closeModal={this.closeModal.bind(this)}
              update
            />
          )}
          {modalType == "delete" && (
            <DeletePhase
              phase={this.state}
              returnToProject={this.returnToProject.bind(this)}
            />
          )}
        </Modal>
        <Hydrate />
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.ping,
    ...state.projects,
    ...state.phases,
    ...state.user,
    ...state.personnel
  }),
  {
    ...Ping.actionCreators,
    ...Projects.actionCreators,
    ...Phases.actionCreators,
    ...User.actionCreators,
    ...Personnel.actionCreators
  }
)(Phase as any) as typeof Phase;

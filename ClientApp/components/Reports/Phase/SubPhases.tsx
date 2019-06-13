// returns all subphases per phase
// parent of SubphaseCard.tsx

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import * as SubphaseStore from "../../../store/subphases";
import Modal from "react-responsive-modal";
import SubphaseCard from "../../Cards/SubphaseCard";
import SubphaseForm from "../../Inputs/Subphase";

const subphaseImg = require("./../../../images/subphase.png");

const iconStyle = {
  marginRight: "8px",
  marginTop: "-8px",
  height: "40px"
};

export class SubPhases extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // utilities
      modalIsOpen: false,

      // subphases
      subphases: []
    };
    this.getSubs = this.getSubs.bind(this);
  }

  componentDidMount() {
    this.getSubs(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getSubs(nextProps);
  }

  getSubs(props) {
    if (props.subphases) {
      let subphases = props.subphases.filter(function(item) {
        return item.phaseID == props.phaseID;
      });
      if (subphases.length > 0) {
        this.setState({
          subphases: subphases.sort(function(a, b) {
            return (
              +new Date(a.expectedStartDate) - +new Date(b.expectedStartDate)
            );
          })
        });
      }
    }
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  removeSubphase(subphase) {
    // removes subphase locally from state
    // done in step with mutable delete from redux store
    const subphasesCopy = this.state.subphases.slice();
    subphasesCopy.splice(subphasesCopy.indexOf(subphase), 1);
    this.setState({
      subphases: subphasesCopy
    });
  }

  public render() {
    const { modalIsOpen, subphases } = this.state;

    const { canEdit } = this.props;

    return (
      <div className="row">
        <h2>
          <img style={iconStyle} src={subphaseImg as string} />
          Subphases
          <span>
            {canEdit == true && (
              <div
                onClick={this.openModal.bind(this)}
                title="Add subphase"
                className="btn-add pull-right hidden-xs"
              >
                <span
                  style={{ marginTop: "10px" }}
                  className="glyphicon glyphicon-plus"
                />
              </div>
            )}
          </span>
        </h2>
        <hr />
        {subphases.length == 0 && (
          <h4 className="text-center">
            <i>No subphases</i>
          </h4>
        )}
        {subphases.length > 0 &&
          subphases.map((subphase, index) => {
            return (
              <SubphaseCard
                canEdit={canEdit}
                key={index}
                subphase={subphase}
                removeSubphase={this.removeSubphase.bind(this)}
              />
            );
          })}
        <Modal
          open={modalIsOpen}
          onClose={this.closeModal.bind(this)}
          classNames={{
            overlay: "custom-overlay",
            modal: "custom-modal"
          }}
          center
        >
          <SubphaseForm
            canEdit={canEdit}
            phaseID={this.props.phaseID}
            projectID={this.props.projectID}
            closeModal={this.closeModal.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.subphases
  }),
  {
    ...SubphaseStore.actionCreators
  }
)(SubPhases as any) as typeof SubPhases;

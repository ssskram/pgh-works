// returns all phases per project
// parent of ProjectPhaseCard.tsx

import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ApplicationState } from "../../../store";
import * as PhasesStore from "../../../store/phases";
import Modal from "react-responsive-modal";
import PhaseForm from "../../Inputs/Phase/Phase";
import ReactTable from "react-table";
import TL from "../../Timeline/Timeline";

const phaseImg = require("./../../../images/phaseGrey.png");

const iconStyle = {
  marginRight: "10px",
  marginTop: "-8px",
  height: "40px"
};

export class Phases extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // utilities
      modalIsOpen: false,

      // phases
      phases: []
    };
    this.getPhases = this.getPhases.bind(this);
  }

  componentDidMount() {
    this.getPhases(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getPhases(nextProps);
  }

  getPhases(props) {
    if (props.phases) {
      let phases = props.phases.filter(function(item) {
        return item.projectID == props.projectID;
      });
      if (phases.length > 0) {
        this.setState({
          phases: phases.sort(function(a, b) {
            return (
              +new Date(a.expectedStartDate) - +new Date(b.expectedStartDate)
            );
          })
        });
      }
    }
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  public render() {
    const { modalIsOpen, phases } = this.state;

    const { canEdit } = this.props;

    const columns = [
      {
        Header: "Name",
        accessor: "phaseName",
        Cell: props => <b>{props.value}</b>
      },
      {
        Header: "Type",
        accessor: "phaseType"
      },
      {
        Header: "Exp. Start",
        accessor: "expectedStartDate"
      },
      {
        Header: "Exp. End",
        accessor: "expectedEndDate"
      },
      {
        Header: "Status",
        accessor: "phaseStatus"
      },
      {
        Header: "",
        accessor: "phaseID",
        Cell: props => (
          <Link to={"/Phase/id=" + props.value}>
            <button className="btn btn-secondary">
              <span className="glyphicon glyphicon-arrow-right" />
            </button>
          </Link>
        ),
        maxWidth: 70
      }
    ];

    // timeline configs
    const items = [] as any;
    let counter = 0;
    phases.forEach(function(phase) {
      let expected = {
        id: counter,
        content: phase.phaseName,
        start: phase.expectedStartDate,
        end: phase.expectedEndDate,
        itemType: "phaseExpected",
        style: "background-color: #DAECFB; border-color: #DAECFB;"
      };
      counter++;
      items.push(expected);
    });

    phases.forEach(function(phase) {
      if (phase.actualStartDate && phase.actualEndDate) {
        let actual = {
          id: counter,
          content: phase.phaseName,
          start: phase.actualStartDate,
          end: phase.actualEndDate,
          itemType: "phaseActual",
          style:
            "background-color: #3473A8; border-color: #3473A8; color: #fffcf5;"
        };
        counter++;
        items.push(actual);
      }
    });

    return (
      <div className="row">
        <h2>
          <img style={iconStyle} src={phaseImg as string} />
          Phases
          {canEdit == true && (
            <span>
              <div
                onClick={this.openModal.bind(this)}
                className="btn-add pull-right hidden-xs"
              >
                <span
                  style={{ marginTop: "10px" }}
                  title="Add a phase"
                  className="glyphicon glyphicon-plus"
                />
              </div>
            </span>
          )}
        </h2>
        <hr />
        {phases.length == 0 && (
          <h4 className="text-center">
            <i>No phases</i>
          </h4>
        )}
        {phases.length > 0 && (
          <div className="col-md-12 hidden-xs">
            <div
              className="col-md-12"
              style={{ marginBottom: "15px", fontSize: "14px" }}
            >
              <span
                style={{
                  backgroundColor: "#DAECFB",
                  padding: "8px",
                  borderRadius: "5px 0px 0px 5px"
                }}
              >
                Expected
              </span>
              <span
                style={{
                  backgroundColor: "#3473A8",
                  color: "#fffcf5",
                  padding: "8px",
                  borderRadius: "0px 5px 5px 0px"
                }}
              >
                Actual
              </span>
            </div>
            <TL items={items} />
            <br />
            <br />
          </div>
        )}
        {phases.length > 0 && (
          <ReactTable
            data={phases}
            columns={columns}
            loading={false}
            minRows={0}
            pageSize={5}
            showPagination={true}
            showPageSizeOptions={false}
            noDataText=""
            getTdProps={() => ({
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: "14px"
              }
            })}
          />
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
          <PhaseForm
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
    ...state.phases
  }),
  {
    ...PhasesStore.actionCreators
  }
)(Phases as any) as typeof Phases;

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as Projects from "../../store/projects";
import * as Phases from "../../store/phases";
import Select from "../FormElements/select";
import Datepicker from "../FormElements/datepicker";
import Modal from "react-responsive-modal";
import * as moment from "moment";
import { Helmet } from "react-helmet";
import filterTags from "./../../functions/filters/filterTags";

const dropdownStyle = ".Select-menu-outer { overflow: visible}";

const types = [
  { value: "Project", label: "Project", name: "parentType" },
  { value: "Phase", label: "Phase", name: "parentType" }
];

export class TagFilter extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      onFilter: false,
      modalIsOpen: false,
      parentType: "",
      startDate: "",
      endDate: ""
    };
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

  handleChildChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChildSelect(event) {
    this.setState({ [event.name]: event.value });
  }

  handleDate(date, name) {
    if (date) {
      this.setState({
        [name]: moment(date).format("MM/DD/YYYY")
      });
    } else {
      this.setState({
        [name]: null
      });
    }
  }

  filter() {
    const filterLoad = {
      parentType: this.state.parentType,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };
    this.props.returnFiltered(
      filterTags(
        this.props.tags,
        this.props.projects,
        this.props.phases,
        filterLoad
      )
    );
    this.setState({
      onFilter: true,
      modalIsOpen: false
    });
  }

  clearFilter() {
    this.props.reset();
    this.setState({
      onFilter: false,
      parentType: "",
      startDate: "",
      endDate: ""
    });
  }

  public render() {
    const {
      onFilter,
      modalIsOpen,
      parentType,
      startDate,
      endDate
    } = this.state;
    return (
      <div>
        <Helmet>
          <style>{dropdownStyle}</style>
        </Helmet>
        {onFilter == false && (
          <button
            onClick={this.openModal.bind(this)}
            className="btn  btn-primary"
          >
            <span>Search</span>
          </button>
        )}
        {onFilter == true && (
          <button
            onClick={this.clearFilter.bind(this)}
            className="btn  btn-primary"
          >
            <span>Clear</span>
          </button>
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
          <div>
            <div className="col-md-12">
              <Select
                value={parentType}
                name="parentType"
                header="Filter by type"
                placeholder="Projects or phases"
                onChange={this.handleChildSelect.bind(this)}
                multi={false}
                options={types}
              />
            </div>

            <div className="col-md-6">
              <Datepicker
                value={startDate}
                name="startDate"
                header="From"
                placeholder="Select a date"
                callback={value => this.handleDate(value, "startDate")}
              />
            </div>

            <div className="col-md-6">
              <Datepicker
                value={endDate}
                name="endDate"
                header="To"
                placeholder="Select a date"
                callback={value => this.handleDate(value, "endDate")}
              />
            </div>

            <div className="col-md-12 text-center">
              <button
                onClick={this.filter.bind(this)}
                className="btn btn-success"
              >
                Apply filter
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.projects,
    ...state.phases
  }),
  {
    ...Projects.actionCreators,
    ...Phases.actionCreators
  }
)(TagFilter as any) as typeof TagFilter;

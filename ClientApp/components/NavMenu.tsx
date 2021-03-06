import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import * as User from "../store/GETS/user";
import * as Personnel from "../store/GETS/personnel";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import Modal from "react-responsive-modal";
import isPersonnel from "../functions/userIsPersonnel";
const workerImg = require("./../images/worker.png");
const projectsImg = require("./../images/projects.png");
const assetsImg = require("./../images/assets.png");
const timelineImg = require("./../images/timeline.png");
const addImg = require("./../images/add.png");

const btnWidth = {
  width: "93%"
};

const marginTop = {
  marginTop: "18px"
};

const iconStyle = {
  height: "25px",
  marginTop: "-3px",
  marginLeft: "5px",
  marginRight: "15px"
};

const modalLogout = {
  color: "#383838"
};

export class NavMenu extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      modalIsOpen: false
    };
  }

  componentDidMount() {
    // load user
    this.props.requestUser();
  }

  componentWillReceiveProps(props) {
    let self = this;
    self.setState({ user: props.user });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  navModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  public render() {
    const { user, modalIsOpen } = this.state;

    return (
      <div className="main-nav">
        <div className="navbar navbar-inverse">
          <div className="navbar-header">
            <button
              onClick={this.navModal.bind(this)}
              type="button"
              className="navbar-toggle"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to={"/"}>
              <div style={marginTop}>
                PGH <strong>Works</strong>
              </div>
            </Link>
          </div>
          <div className="clearfix" />
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li>
                <NavLink className="myProjects" to={"/MyProjects"}>
                  <span>
                    <img style={iconStyle} src={workerImg as string} />
                  </span>{" "}
                  My projects
                </NavLink>
              </li>
              <li>
                <NavLink className="allProjects" to={"/AllProjects"}>
                  <span>
                    <img style={iconStyle} src={projectsImg as string} />
                  </span>{" "}
                  All Projects
                </NavLink>
              </li>
              <li>
                <NavLink className="allAssets" to={"/AllAssets"}>
                  <span>
                    <img style={iconStyle} src={assetsImg as string} />
                  </span>{" "}
                  Assets
                </NavLink>
              </li>
              <li>
                <NavLink className="timeline" to={"/Timeline"}>
                  <span>
                    <img style={iconStyle} src={timelineImg as string} />
                  </span>{" "}
                  Timeline
                </NavLink>
              </li>
              {isPersonnel(user, this.props.personnel) && (
                <div className="text-center">
                  <NavLink
                    to={"/ProjectDefinition"}
                    style={btnWidth}
                    className="btn btn-primary addProject"
                  >
                    <b>Add a Project</b>
                  </NavLink>
                </div>
              )}
              <div className="accountcontainer">
                <div className="account">{user}</div>
                <div className="logout">
                  <a
                    href="/Account/Login"
                    id="logout"
                    className="btn btn-link navbar-logout-btn"
                  >
                    <span className="glyphicon glyphicon-user nav-glyphicon" />
                    Logout
                  </a>
                </div>
              </div>
            </ul>
          </div>
        </div>
        <Modal
          open={modalIsOpen}
          onClose={this.closeModal.bind(this)}
          classNames={{
            overlay: "custom-overlay",
            modal: "custom-modal"
          }}
          center
        >
          <div className="col-md-12">
            <br />
            <br />
            <div className="text-center">
              <Link
                onClick={this.closeModal.bind(this)}
                to={"/MyProjects"}
                style={btnWidth}
                className="btn btn-primary"
              >
                <span>
                  <img style={iconStyle} src={workerImg as string} />
                </span>{" "}
                My Projects
              </Link>
              <Link
                onClick={this.closeModal.bind(this)}
                to={"/AllProjects"}
                style={btnWidth}
                className="btn btn-primary"
              >
                <span>
                  <img style={iconStyle} src={projectsImg as string} />
                </span>{" "}
                All Projects
              </Link>
              <Link
                onClick={this.closeModal.bind(this)}
                to={"/AllAssets"}
                style={btnWidth}
                className="btn btn-primary"
              >
                <span>
                  <img style={iconStyle} src={assetsImg as string} />
                </span>{" "}
                Assets
              </Link>
              <Link
                onClick={this.closeModal.bind(this)}
                to={"/Timeline"}
                style={btnWidth}
                className="btn btn-primary hidden-xs"
              >
                <span>
                  <img style={iconStyle} src={timelineImg as string} />
                </span>{" "}
                Timeline
              </Link>
              {isPersonnel(user, this.props.personnel) && (
                <Link
                  onClick={this.closeModal.bind(this)}
                  to={"/ProjectDefinition"}
                  style={btnWidth}
                  className="btn btn-primary hidden-xs"
                >
                  <span>
                    <img style={iconStyle} src={addImg as string} />
                  </span>{" "}
                  New Project
                </Link>
              )}
            </div>
            <div className="accountcontainer">
              <div style={modalLogout} className="account">
                {user}
              </div>
              <div style={modalLogout} className="logout">
                <NavLink
                  style={modalLogout}
                  to={"/Account/Login"}
                  activeClassName="active"
                  id="logout"
                  className="btn btn-link navbar-logout-btn"
                >
                  <span className="glyphicon glyphicon-user nav-glyphicon" />
                  Logout
                </NavLink>
              </div>
            </div>
            <br />
            <br />
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.user,
    ...state.personnel
  }),
  {
    ...User.actionCreators,
    ...Personnel.actionCreators
  }
)(NavMenu as any) as typeof NavMenu;

import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'
import * as User from '../store/user'
import { connect } from 'react-redux'
import { ApplicationState } from '../store'
import Modal from 'react-responsive-modal'

const btnWidth = {
    width: '93%'
}

const imgSize = {
    height: '50px'
}

const marginTop = {
    marginTop: '18px',
}

const iconStyle = {
    height: '28px',
    marginTop: '-3px',
    marginLeft: '5px',
    marginRight: '15px'
}

const modalLogout = {
    color: '#383838',
}

export class NavMenu extends React.Component<any, any>  {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            modalIsOpen: false
        }
    }

    componentDidMount() {
        // load user
        this.props.requestUser()
    }

    componentWillReceiveProps(props) {
        let self = this;
        self.setState({ user: props.user })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    navModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    public render() {
        const {
            user,
            modalIsOpen
        } = this.state

        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button onClick={this.navModal.bind(this)} type='button' className='navbar-toggle'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'} data-toggle="collapse" data-target=".in">
                        <div style={marginTop} className='pull-left'>PGH <strong>Works</strong></div>
                        <div><img style={imgSize} className='pull-right hidden-md hidden-sm hidden-xs' src='./images/construction.png' /></div>
                    </Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/MyProjects'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/worker.png' /></span> My projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/AllProjects'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/list.png' /></span> All projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Programs'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/money.png' /></span> Programs/Funds
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/Timeline'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/timeline.png' /></span> Timeline
                            </NavLink>
                        </li>
                        <div className='text-center'>
                            <NavLink to={'/NewProject'} style={btnWidth} className='btn btn-primary'>
                                <b>Add a Project</b>
                            </NavLink>
                        </div>
                        <div className='accountcontainer'>
                            <div className="account">{user}</div>
                            <div className='logout'>
                                <a href='/Account/Login' id="logout" className='btn btn-link navbar-logout-btn'>
                                    <span className='glyphicon glyphicon-user nav-glyphicon'></span>Logout
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
                    overlay: 'custom-overlay',
                    modal: 'custom-modal'
                }}
                center>
                <div className='col-md-12'>
                    <br />
                    <br />
                    <div className='text-center'>
                        <Link onClick={this.closeModal.bind(this)} to={'/AllProjects'} style={btnWidth} className='btn btn-primary'>
                            <span><img style={iconStyle} src='./images/list.png' /></span> <b>All Projects</b>
                        </Link>
                        <Link onClick={this.closeModal.bind(this)} to={'/MyProjects'} style={btnWidth} className='btn btn-primary'>
                            <span><img style={iconStyle} src='./images/worker.png' /></span> My Projects
                    </Link>
                        <Link onClick={this.closeModal.bind(this)} to={'/Programs'} style={btnWidth} className='btn btn-primary'>
                            <span><img style={iconStyle} src='./images/money.png' /></span> Programs/Funds
                    </Link>
                        <Link onClick={this.closeModal.bind(this)} to={'/Timeline'} style={btnWidth} className='btn btn-primary'>
                            <span><img style={iconStyle} src='./images/timeline.png' /></span> Timeline
                    </Link>
                        <Link onClick={this.closeModal.bind(this)} to={'/NewProject'} style={btnWidth} className='btn btn-primary'>
                            <span><img style={iconStyle} src='./images/add.png' /></span> New Project
                    </Link>
                    </div>
                    <div className='accountcontainer'>
                        <div style={modalLogout} className="account">{user}</div>
                        <div style={modalLogout} className='logout'>
                            <NavLink style={modalLogout} to={'/Account/Login'} activeClassName='active' id="logout" className='btn btn-link navbar-logout-btn'>
                                <span className='glyphicon glyphicon-user nav-glyphicon'></span>Logout
                            </NavLink>
                        </div>
                    </div>
                    <br />
                    <br />
                </div>
            </Modal>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) =>
        state.user,
    User.actionCreators
)(NavMenu as any) as typeof NavMenu;


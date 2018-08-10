import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as User from '../store/user';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';

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

export class NavMenu extends React.Component<any, any>  {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
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

    public render() {
        const { user } = this.state

        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'} data-toggle="collapse" data-target=".in">
                        <div style={marginTop} className='pull-left'>pgh <strong>Works</strong></div>
                        <div><img style={imgSize} className='pull-right hidden-md hidden-sm hidden-xs' src='./images/construction.png' /></div>
                    </Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/list.png' /></span> All projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/worker.png' /></span> My projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/money.png' /></span> Programs/Funds
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/'} activeClassName='active' data-toggle="collapse" data-target=".in">
                                <span><img style={iconStyle} src='./images/timeline.png' /></span> Timelines
                            </NavLink>
                        </li>
                        <div className='text-center'>
                            <NavLink to={'/'} style={btnWidth} className='btn btn-primary'>
                                <b>Add a Project</b>
                            </NavLink>
                        </div>
                        <div className='accountcontainer'>
                            <li className="account">{user}</li>
                            <li className='logout'>
                                <a href='/Account/Login' id="logout" className='btn btn-link navbar-logout-btn navbar-link'>
                                    <span className='glyphicon glyphicon-user'></span>Logout
                                </a>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) =>
        state.user,
    User.actionCreators
)(NavMenu as any) as typeof NavMenu;


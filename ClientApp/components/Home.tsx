import * as React from 'react'
import { Redirect } from 'react-router-dom'
import Hydrate from './Utilities/HydrateStore'
import { connect } from 'react-redux'
import { ApplicationState } from '../store'
import * as Ping from '../store/GETS/ping'
import * as Projects from '../store/projects'
import Map from './Maps/HomeMap'
import { Helmet } from "react-helmet"
import Filters from './Filters/ProjectFilter'
import Spinner from './Utilities/Spinner'

const floatingPanelBig = {
    position: 'absolute' as any,
    bottom: '17px',
    left: '25%',
    zIndex: 99,
    padding: '5px',
    paddingLeft: '10px'
}

const floatingPanelSmall = {
    position: 'absolute' as any,
    bottom: '17px',
    left: '15px',
    zIndex: 99,
    padding: '5px',
    paddingLeft: '10px'
}

export class Home extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            projects: [],
            redirect: false,
            projectID: ''
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)

        this.setState ({
            projects: this.props.projects
        })

        // ping server
        this.props.ping()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.projects.length == 0) {
            this.setState ({
                projects: nextProps.projects
            })
        }
    }

    receiveProject(project) {
        this.setState({
            redirect: true,
            projectID: project.projectID
        })
    }

    receiveFilteredProjects(projects) {
        console.log(projects)
        this.setState({
            projects: projects
        })
    }

    public render() {
        const {
            redirect,
            projectID,
            projects
        } = this.state

        const link = "/Project/id=" + projectID

        if (redirect) {
            return <Redirect to={link} />
        }

        return <div>
            {projects.length == 0 &&
                <Spinner notice='...loading the projects...' />
            }
            <Hydrate />
            <Helmet>
                <style>{'.col-sm-9 { width: 100%; padding: 0; } .container-fluid { padding: 0; } body { padding: 0 } '}</style>
            </Helmet>
            <Map projects={projects} receiveProject={this.receiveProject.bind(this)} />
            <div style={floatingPanelBig} className='hidden-sm hidden-xs'>
                <Filters
                    filterType="all"
                    returnFiltered={this.receiveFilteredProjects.bind(this)}
                />
            </div>
            <div style={floatingPanelSmall} className='hidden-md hidden-lg hidden-xl'>
                <Filters
                    filterType="all"
                    returnFiltered={this.receiveFilteredProjects.bind(this)}
                />
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects,
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators,
    })
)(Home as any) as typeof Home;
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import Hydrate from './Utilities/HydrateStore'
import { connect } from 'react-redux'
import { ApplicationState } from '../store'
import * as Ping from '../store/GETS/ping'
import * as Projects from '../store/projects'
import Map from './Map/HomeMap'
import { Helmet } from "react-helmet"

export class Home extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            redirect: false,
            projectID: ''
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()
    }

    receiveProject (project) {
        this.setState ({
            redirect: true,
            projectID: project.projectID
        })
    }

    public render() {
        const {
            projects
        } = this.props

        const {
            redirect,
            projectID
        } = this.state

        const link = "/Project/id=" + projectID

        if (redirect) {
            return <Redirect to={link} />
        }

        return <div>
            <Hydrate />
            <Helmet>
                <style>{'.col-sm-9 { width: 100%; padding: 0; } .container-fluid { padding: 0; } body { padding: 0 } '}</style>
            </Helmet>
            <Map projects={projects} receiveProject={this.receiveProject.bind(this)}/>
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
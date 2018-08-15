
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import Spinner from '../Utilities/Spinner'
import Map from '../Map/ProjectMap'
import Moment from 'react-moment'

const bigFont = {
    fontSize: '18px'
}
const borderNone = {
    border: 'none'
}

export class Project extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            spinner: true,

            // project state
            cartegraphID: '',
            projectID: '',
            projectName: '',
            startDate: '',
            endDate: '',
            projectManager: '',
            projectMembers: '',
            projectDescription: '',
            projectStatus: '',
            expectedCost: '',
            actualCost: '',
            notes: '',
            created: '',
            createdBy: '',
            lastModifiedBy: '',
            shape: []
        }
        this.setProjectState = this.setProjectState.bind(this);
        this.findProject = this.findProject.bind(this);
    }

    componentDidMount() {
        // ping server
        this.props.ping()
        this.findProject(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.findProject(nextProps)
    }

    findProject(props) {
        // set project, and pass project to setProjectState
        const id = this.props.match.params.id
        let project = props.projects.find(function (item) {
            return item.projectID == id
        })
        if (project) {
            console.log(project)
            this.setProjectState(project)
        }
    }

    setProjectState(project) {
        this.setState({
            cartegraphID: project.cartegraphID,
            projectID: project.projectID,
            projectName: project.projectName,
            startDate: project.startDate,
            endDate: project.endDate,
            projectManager: project.projectManager,
            projectMembers: project.projectMembers,
            projectDescription: project.projectDescription,
            projectStatus: project.projectStatus,
            expectedCost: project.expectedCost,
            actualCost: project.actualCost,
            notes: project.notes,
            created: project.created,
            createdBy: project.createdBy,
            lastModifiedBy: project.lastModifiedBy,
            shape: project.shape
        }, function (this) {
            this.setState({
                spinner: false
            })
        })
    }

    public render() {
        const {
            spinner,
            projectID,
            cartegraphID,
            projectName,
            startDate,
            endDate,
            projectManager,
            projectMembers,
            projectDescription,
            projectStatus,
            expectedCost,
            actualCost,
            notes,
            created,
            createdBy,
            lastModifiedBy,
            shape
        } = this.state
        return (
            <div>
                <h2>{projectName}</h2>
                <hr />
                <Map shape={shape} />
                <br />
                <div className='col-md-6'>
                    <table className="table">
                        <tbody>
                            <tr style={bigFont}>
                                <th style={borderNone} scope="row">Status</th>
                                <td style={borderNone}>{projectStatus}</td>
                            </tr>
                            <tr>
                                <th scope="row">Start date</th>
                                <td><Moment format="MM/DD/YYYY" date={startDate} /></td>
                            </tr>
                            <tr>
                                <th scope="row">End date</th>
                                <td><Moment format="MM/DD/YYYY" date={endDate} /></td>
                            </tr>
                            <tr>
                                <th scope="row">Project manager</th>
                                <td>{projectManager}</td>
                            </tr>
                            <tr>
                                <th scope="row">Project members</th>
                                <td>{projectMembers}</td>
                            </tr>
                            <tr>
                                <th scope="row">Project description</th>
                                <td>{projectDescription}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-md-12'>
                    <h3>Monies</h3>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <h3>Phases</h3>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <h3>Attachments</h3>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <h3>Tags</h3>
                    <hr />
                </div>

                {spinner == true &&
                    <Spinner notice='...loading the project...' />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators
    })
)(Project as any) as typeof Project
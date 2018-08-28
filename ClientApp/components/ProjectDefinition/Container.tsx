
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as User from '../../store/GETS/user'
import * as Projects from '../../store/projects'
import Geolocate from './Geolocate/Geolocate'
import ProjectDescription from './Description/Description'
import Map from '../Map/ProjectMap'
import * as moment from 'moment'
import { v1 as uuid } from 'uuid'

export class ProjectDefinition extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // utilities
            step: 1,
            redirect: false,

            // project state
            projectID: '',
            shape: [],
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
            created: moment().format('MM/DD/YYYY'),
            createdBy: this.props.user,
            lastModifiedBy: this.props.user
        }
    }

    componentDidMount() {
        // ping server
        this.props.ping()

        // generate uuid for projectID
        const guid: string = uuid()
        this.setState({
            projectID: guid
        })
    }

    setShape(shape) {
        this.setState({
            shape: shape
        })
    }

    setName(name) {
        this.setState({
            projectName: name
        })
    }

    next() {
        this.setState({
            step: this.state.step + 1
        })
    }

    back() {
        this.setState({
            step: this.state.step - 1
        })
    }

    post(projectDesc) {
        this.setState({
            projectName: projectDesc.projectName,
            startDate: projectDesc.startDate,
            endDate: projectDesc.endDate,
            projectManager: projectDesc.projectManager,
            projectMembers: projectDesc.projectMembers,
            projectDescription: projectDesc.projectDescription,
            projectStatus: projectDesc.projectStatus,
            projectType: projectDesc.projectType,
            expectedCost: projectDesc.expectedCost,
            actualCost: projectDesc.actualCost,
            notes: projectDesc.notes
        }, function (this) {
            // add to project store 
            this.props.addProject(this.state)
        })
        this.setState({
            redirect: true
        })
    }

    public render() {
        const {
            step,
            redirect,
            projectID,
            shape,
        } = this.state

        const link = "/Project/id=" + projectID

        if (redirect) {
            return <Redirect to={link} />
        }

        return (
            <div>
                <h2>
                    <span>New project</span>
                    <b>
                        {step == 1 &&
                            <span className='pull-right'><span className='glyphicon glyphicon-map-marker nav-glyphicon hidden-xs'></span>Location</span>
                        }
                        {step == 2 &&
                            <span className='pull-right'><span className='glyphicon glyphicon-info-sign nav-glyphicon hidden-xs'></span>Description</span>
                        }
                    </b>
                </h2>
                <hr />
                <div>
                    {step == 1 &&
                        <Geolocate
                            next={this.next.bind(this)}
                            setShape={this.setShape.bind(this)}
                            shape={shape}
                        />
                    }
                    {step == 2 &&
                    <div>
                        <Map shape={shape} />
                        <br/>
                        <ProjectDescription
                            back={this.back.bind(this)}
                            post={this.post.bind(this)}
                            shape={shape}
                        />
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.user,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators
    })
)(ProjectDefinition as any) as typeof ProjectDefinition
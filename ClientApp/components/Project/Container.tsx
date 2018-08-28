
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Modal from 'react-responsive-modal'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import Spinner from '../Utilities/Spinner'
import Map from '../Map/ProjectMap'
import Phases from './Phases'
import Funds from './ProgramsFunds'
import Attachments from './Attachments'
import * as User from '../../store/GETS/user'
import ProjectFields from '../Inputs/Project'
import Tags from '../Tags/Tags'
import * as moment from 'moment'
import UpdateLocation from './UpdateLocation'
import ProjectCard from './ProjectCard'

const btnMargin = {
    margin: '0px 5px'
}

export class Project extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            spinner: true,
            modalIsOpen: false,
            update: '',

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
            projectType: '',
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
        if (props.projects) {
            let project = props.projects.find(function (item) {
                return item.projectID == id
            })
            if (project) {
                this.setProjectState(project)
            }
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
            projectType: project.projectType,
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

    editProject() {
        this.setState({
            modalIsOpen: true,
            edit: 'project'
        })
    }

    editLocation() {
        this.setState({
            modalIsOpen: true,
            edit: 'location'
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            edit: ''
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    handleMultiSelect(field, value) {
        this.setState({ [field]: value })
    }

    handleActualCost(value) {
        this.setState({ actualCost: value })
    }

    handleExpectedCost(value) {
        this.setState({ expectedCost: value })
    }

    handleStartDate(date) {
        if (date) {
            this.setState({
                startDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                startDate: null
            });
        }
    }

    handleEndDate(date) {
        if (date) {
            this.setState({
                endDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                endDate: null
            });
        }
    }

    setShape(shape) {
        this.setState({
            shape: shape
        })
    }

    put() {
        this.closeModal()
        this.setState({
            lastModifiedBy: this.props.user
        }, function (this) {
            this.props.updateProject(this.state)
        })
    }

    public render() {
        const {
            modalIsOpen,
            edit,
            spinner,
            projectID,
            projectName,
            startDate,
            endDate,
            projectManager,
            projectStatus,
            shape
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
            startDate != '' &&
            endDate != '' &&
            projectManager != '' &&
            projectStatus != ''

        return (
            <div>
                <h2 style={{ letterSpacing: '2px' }}>{projectName}
                    <span><button onClick={this.editProject.bind(this)} style={btnMargin} className='btn pull-right hidden-xs'>Update info</button></span>
                    <span><button onClick={this.editLocation.bind(this)} style={btnMargin} className='btn pull-right hidden-xs'>Modify location</button></span>
                </h2>
                <hr />
                <Map shape={shape} />
                <br />
                <div className='col-md-12'>
                    <ProjectCard project={this.state} />
                    <br />
                </div>
                <div className='col-md-12'>
                    <Tags parentID={projectID} parentName={projectName}/>
                    <br />
                </div>
                <div className='col-md-12'>
                    <Phases projectID={projectID} />
                    <br />
                </div>
                <div className='col-md-12'>
                    <Funds projectID={projectID} />
                    <br />
                </div>
                <div className='col-md-12'>
                    <Attachments projectID={projectID} />
                    <br />
                </div>

                {spinner == true &&
                    <Spinner notice='...loading the project...' />
                }

                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {edit == 'project' &&
                        <div>
                            <ProjectFields
                                description={this.state}
                                handleInput={this.handleChildChange.bind(this)}
                                handleSelect={this.handleChildSelect.bind(this)}
                                handleMulti={this.handleMultiSelect.bind(this)}
                                handleStartDate={this.handleStartDate.bind(this)}
                                handleEndDate={this.handleEndDate.bind(this)}
                                handleExpectedCost={this.handleExpectedCost.bind(this)}
                                handleActualCost={this.handleActualCost.bind(this)}
                            />
                            <div className='row'>
                                <div className='col-md-12 text-center'>
                                    <div>
                                        <button disabled={!isEnabled} className='btn btn-success' onClick={this.put.bind(this)}><b>Save</b></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    }
                    {edit == 'location' &&
                        <UpdateLocation
                            setShape={this.setShape.bind(this)}
                            put={this.put.bind(this)}
                        />
                    }
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects,
        ...state.user,
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators
    })
)(Project as any) as typeof Project
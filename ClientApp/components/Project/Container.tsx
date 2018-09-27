
import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Modal from 'react-responsive-modal'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import Spinner from '../Utilities/Spinner'
import Map from '../Map/ProjectMap'
import Phases from './Phases'
import Drawdowns from '../ProgramsFunds/Drawdowns'
import Attachments from '../Attachments/Attachments'
import * as User from '../../store/GETS/user'
import * as Assets from '../../store/GETS/taggableAssets'
import * as TagStore from '../../store/tags'
import * as Timeline from '../../store/timeline'
import * as PhasesStore from '../../store/phases'
import ProjectFields from '../Inputs/Project'
import Tags from '../Tags/Tags'
import * as moment from 'moment'
import UpdateLocation from './UpdateLocation'
import ProjectCard from './Cards/ProjectCard'
import { v1 as uuid } from 'uuid'
import inside from 'point-in-polygon'
import ProjectTimeline from './ProjectTimeline'

const btnMargin = {
    margin: '0px 5px'
}

const marginBottom = {
    marginBottom: '70px'
}

const iconStyle = {
    height: '28px',
}

export class Project extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            spinner: true,
            modalIsOpen: false,
            update: 'true',

            // project state
            cartegraphID: '',
            projectID: '',
            projectName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            projectManager: '',
            projectMembers: '',
            projectDepartment: '',
            projectDescription: '',
            projectStatus: '',
            projectBudget: '',
            notes: '',
            shape: []
        }
        this.setProjectState = this.setProjectState.bind(this);
        this.findProject = this.findProject.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0)
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
            expectedStartDate: project.expectedStartDate,
            expectedEndDate: project.expectedEndDate,
            actualStartDate: project.actualStartDate,
            actualEndDate: project.actualEndDate,
            projectManager: project.projectManager,
            projectMembers: project.projectMembers,
            projectDepartment: project.projectDepartment,
            projectDescription: project.projectDescription,
            projectStatus: project.projectStatus,
            projectBudget: project.projectBudget,
            notes: project.notes,
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

    handleCurrency(value) {
        this.setState({ projectBudget: value })
    }

    handleDate(date, name) {
        if (date) {
            this.setState({
                [name]: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                [name]: null
            });
        }
    }

    setShape(shape) {
        let existingShape = this.state.shape
        this.setState({
            shape: shape,
            modalIsOpen: false,
            edit: ''
        }, function (this) {
            if (existingShape != shape) {
                // delete existing geospatial tags
                let self = this
                let tags = this.props.tags.filter(function (item) {
                    return item.parentID == self.state.projectID
                })
                let tagsToDelete = tags.filter(function (tag) {
                    return tag.tagDescription == 'Within project bounds'
                })
                tagsToDelete.forEach(function (tag) {
                    self.props.deleteTag(tag)
                })

                // refresh geospatial tags with new shape
                let shape = [] as any
                let componentAssets = [] as any
                this.state.shape.forEach(function (point) {
                    const shapeArray = [point.lat, point.lng]
                    shape.push(shapeArray)
                })
                this.props.assets.forEach(function (asset) {
                    if (asset.shape) {
                        asset.shape.points.forEach(function (point) {
                            const ins = inside([point.lat, point.lng], shape)
                            if (ins == true && !componentAssets.includes(asset)) {
                                componentAssets.push(asset)
                            }
                        })
                    }
                })
                if (componentAssets.length > 0) {
                    componentAssets.forEach(function (component) {
                        self.createTag(component)
                    })
                }
            }
        })
        this.setState({
            shape: shape
        }, function (this) {
            this.props.updateProject(this.state)
        })
    }

    put() {
        this.closeModal()
        this.props.updateProject(this.state)
    }

    createTag(asset) {
        const guid: string = uuid()
        let tagLoad = {
            tagID: guid,
            parentID: this.state.projectID,
            parentType: 'Project',
            parentName: this.state.projectName,
            taggedAssetOID: asset.assetOID,
            taggedAssetName: asset.assetName,
            tagType: asset.assetType,
            tagDescription: 'Within project bounds',
        }
        this.props.addTag(tagLoad)
    }

    addToTimeline() {
        let self = this
        const timelineLoad = {
            id: self.state.projectID,
            type: 'Project',
            name: self.state.projectName,
            expectedStartDate: self.state.expectedStartDate,
            expectedEndDate: self.state.expectedEndDate,
            actualStartDate: self.state.actualStartDate,
            actualEndDate: self.state.actualEndDate
        }
        this.props.addTimeline(timelineLoad)
        const phases = this.props.phases.filter(function (phase) {
            return phase.projectID == self.state.projectID
        })
        phases.forEach(function (phase) {
            const phaseLoad = {
                id: phase.phaseID,
                type: 'Phase',
                name: phase.phaseName,
                parentProjectID: phase.projectID,
                expectedStartDate: phase.expectedStartDate,
                expectedEndDate: phase.expectedEndDate,
                actualStartDate: phase.actualStartDate,
                actualEndDate: phase.actualEndDate
            }
            self.props.addTimeline(phaseLoad)
        })
    }

    public render() {
        const {
            modalIsOpen,
            edit,
            spinner,
            projectID,
            projectName,
            projectStatus,
            shape,
            expectedStartDate,
            expectedEndDate,
            projectBudget
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
            projectStatus != ''

        return (
            <div>
                <h2 style={{ letterSpacing: '2px' }}>
                    <span>{projectName}</span>
                    <span><button onClick={this.editProject.bind(this)} style={btnMargin} title='Update info' className='btn pull-right hidden-xs'><span className='glyphicon'><img style={iconStyle} src='./images/infoDark.png'></img></span></button></span>
                    <span><button onClick={this.editLocation.bind(this)} style={btnMargin} title='Modify location' className='btn pull-right hidden-xs'><span className='glyphicon'><img style={iconStyle} src='./images/mapDark.png'></img></span></button></span>
                    <span><Link to={'/Timeline'}><button style={btnMargin} onClick={this.addToTimeline.bind(this)} title='Add to timeline' className='btn pull-right hidden-xs'><span className='glyphicon'><img style={iconStyle} src='./images/timelineDark.png'></img></span></button></Link></span>
                </h2>
                <hr />
                <Map shape={shape} />
                <br />
                <div className='col-md-12'>
                    <ProjectCard project={this.state} />
                </div>
                {expectedStartDate && expectedEndDate &&
                    <div style={marginBottom} className='col-md-12'>
                        <ProjectTimeline project={this.state} />
                    </div>
                }
                <div style={marginBottom} className='col-md-12 row'>
                    <Phases projectID={projectID} />
                </div>
                <div style={marginBottom} className='col-md-12 row'>
                    <Drawdowns parentID={projectID} parentType={'Project'} budget={projectBudget}/>
                </div>
                <div style={marginBottom} className='col-md-12 row'>
                    <Tags parentID={projectID} parentName={projectName} parentType='Project' />
                </div>
                <div style={marginBottom} className='col-md-12 row'>
                    <Attachments parentID={projectID} parentType={'Project'} parentName={projectName}/>
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
                                handleDate={this.handleDate.bind(this)}
                                handleCurrency={this.handleCurrency.bind(this)}
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
        ...state.taggableAssets,
        ...state.user,
        ...state.tags,
        ...state.timeline,
        ...state.phases
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators,
        ...Assets.actionCreators,
        ...TagStore.actionCreators,
        ...Timeline.actionCreators,
        ...PhasesStore.actionCreators
    })
)(Project as any) as typeof Project

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
import Attachments from '../Attachments/Attachments'
import * as User from '../../store/GETS/user'
import * as Assets from '../../store/GETS/taggableAssets'
import * as TagStore from '../../store/tags'
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
    marginBottom: '50px'
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
            expectedStartDate: project.expectedStartDate,
            expectedEndDate: project.expectedEndDate,
            actualStartDate: project.actualStartDate,
            actualEndDate: project.actualEndDate,
            projectManager: project.projectManager,
            projectMembers: project.projectMembers,
            projectDepartment: project.projectDepartment,
            projectDescription: project.projectDescription,
            projectStatus: project.projectStatus,
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
            lastModifiedBy: this.props.user,
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
        this.setState({
            lastModifiedBy: this.props.user
        }, function (this) {
            this.props.updateProject(this.state)
        })
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
            dateCreated: moment().format('MM/DD/YYYY'),
            tagType: asset.assetType,
            tagDescription: 'Within project bounds',
        }
        this.props.addTag(tagLoad)
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
            expectedEndDate
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
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
                <div className='row col-md-12'>
                    <ProjectCard project={this.state} />
                </div>
                {expectedStartDate && expectedEndDate &&
                    <div style={marginBottom} className='row col-md-12'>
                        <ProjectTimeline project={this.state} />
                    </div>
                }
                <div style={marginBottom} className='row col-md-12'>
                    <Phases projectID={projectID} />
                </div>
                <div style={marginBottom} className='row col-md-12'>
                    <Funds projectID={projectID} />
                </div>
                <div style={marginBottom} className='row col-md-12'>
                    <Tags parentID={projectID} parentName={projectName} parentType='Project' />
                </div>
                <div style={marginBottom} className='row col-md-12'>
                    <Attachments parentID={projectID} parentType={'Project'} />
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
        ...state.taggableAssets,
        ...state.user,
        ...state.tags
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators,
        ...Assets.actionCreators,
        ...TagStore.actionCreators
    })
)(Project as any) as typeof Project

// top level project report
// parent of ProjectCard.tsx
// co-parent of Tags.tsx

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import Modal from 'react-responsive-modal'
import * as Ping from '../../../store/GETS/ping'
import * as Projects from '../../../store/projects'
import * as Personnel from '../../../store/GETS/personnel'
import Spinner from '../../Utilities/Spinner'
import Map from '../../Maps/ProjectMap'
import Phases from './Phases'
import * as User from '../../../store/GETS/user'
import * as Assets from '../../../store/GETS/taggableAssets'
import * as TagStore from '../../../store/tags'
import ProjectFields from '../../Inputs/Project/ProjectFields'
import Tags from '../Tags'
import * as moment from 'moment'
import ProjectCard from '../../Cards/ProjectSlider'
import { v1 as uuid } from 'uuid'
import ProjectTimeline from '../../Timeline/ProjectTimeline'
import Hydrate from './../../Utilities/HydrateStore'
import canEdit from '../../../functions/canEdit'
import assetsInPolygon from '../../../functions/assetsInPolygon'
import UpdateLocation from '../../Inputs/Project/UpdateLocation'
import ActivityFeed from './Activity'

const btnMargin = {
    margin: '20px 5px 0px 5px',
}

const marginBottom = {
    marginBottom: '70px'
}

export class Project extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // utilities
            spinner: true,
            modalIsOpen: false,
            update: 'true',
            canEdit: true,

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
            shape: {}
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
        if (this.props != nextProps) {
            this.findProject(nextProps)
        }
    }

    findProject(props) {
        // set project, and pass project to setProjectState
        const id = this.props.match.params.id
        if (props.projects && props.personnel && props.user) {
            let project = props.projects.find(function (item) {
                return item.projectID == id
            })
            if (project) {
                this.setProjectState(project, props.personnel, props.user)
            }
        }
    }

    setProjectState(project, personnel, user) {
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
            shape: project.shape,
            // canEdit: canEdit(project, personnel, user)
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

    put() {
        this.closeModal()
        this.props.updateProject(this.state)
    }

    setShape(shape, types) {
        let existingShape = this.state.shape
        this.setState({
            shape: shape,
            modalIsOpen: false,
            edit: ''
        }, function (this) {
            // post new state
            this.props.updateProject(this.state)
            
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

                if (types == 'all') {
                    // refresh geospatial tags with new shape
                    const componentAssets = assetsInPolygon(this.state.shape.points, this.props.assets)
                    if (componentAssets.length > 0) {
                        componentAssets.forEach(function (component) {
                            if (component.assetName != self.state.projectName) {
                                self.createTag(component)
                            }
                        })
                    }
                } else {
                    const assets = this.props.assets.filter(asset => {
                        return types.includes(asset.assetType)
                    })
                    const componentAssets = assetsInPolygon (this.state.shape.points, assets)
                    // for each asset inside polygon, generate a tag
                    if (componentAssets.length > 0) {
                        componentAssets.forEach(function (component) {
                            if (component.assetName != self.state.projectName) {
                                self.createTag(component)
                            }
                        })
                    }
                }
            }
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
            canEdit,
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
                {spinner == true &&
                    <Spinner notice='...loading the project...' />
                }
                {spinner == false &&
                    <div className='row text-center' style={{ marginBottom: '25px', letterSpacing: '2px' }}>
                        <div className='col-md-12'>
                            <h4>Project</h4>
                            <h1>{projectName}</h1>
                        </div>
                        {canEdit == true &&
                            <div className='col-md-12'>
                                <div>
                                    <a href={'https://cityofpittsburgh.sharepoint.com/sites/pghworks/' + projectName} target='_blank' style={btnMargin} className='btn btn-warning'>Documents</a>
                                    <button onClick={this.editProject.bind(this)} style={btnMargin} title='Update info' type='button' className='btn  btn-primary'>Edit</button>
                                    <button className='btn btn-primary' onClick={this.editLocation.bind(this)} title='Modify location'>Change location</button>
                                </div>
                            </div>
                        }
                    </div>
                }
                <Map shape={shape} />
                <br />
                {spinner == false &&
                    <div>
                        <div className='col-md-12'>
                            <ProjectCard project={this.state} />
                        </div>
                        {expectedStartDate && expectedEndDate &&
                            <div style={marginBottom} className='col-md-12 row'>
                                <ProjectTimeline project={this.state} />
                            </div>
                        }
                        <div style={marginBottom} className='col-md-12 row'>
                            <ActivityFeed 
                                projectId={projectID}
                            />
                        </div>
                        <div style={marginBottom} className='col-md-12 row'>
                            <Phases
                                canEdit={canEdit}
                                projectID={projectID}
                            />
                        </div>
                        <div style={marginBottom} className='col-md-12 row'>
                            <Tags
                                canEdit={canEdit}
                                parentID={projectID}
                                parentName={projectName}
                                parentType='Project'
                            />
                        </div>
                    </div>
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
                            />
                            <div className='row'>
                                <div className='col-md-12 text-center'>
                                    <button disabled={!isEnabled} className='btn btn-success' onClick={this.put.bind(this)}><b>Save</b></button>
                                </div>
                            </div>
                        </div>
                    }
                    {edit == 'location' &&
                        <UpdateLocation
                            setShape={this.setShape.bind(this)}
                        />
                    }
                </Modal>
                <Hydrate />
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
        ...state.personnel
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators,
        ...Assets.actionCreators,
        ...TagStore.actionCreators,
        ...Personnel.actionCreators
    })
)(Project as any) as typeof Project
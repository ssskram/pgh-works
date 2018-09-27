
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as User from '../../store/GETS/user'
import * as Projects from '../../store/projects'
import * as Assets from '../../store/GETS/taggableAssets'
import * as TagStore from '../../store/tags'
import Geolocate from './Geolocate/Geolocate'
import ProjectDescription from './Description/Description'
import Map from '../Map/ProjectMap'
import * as moment from 'moment'
import { v1 as uuid } from 'uuid'
import inside from 'point-in-polygon'
import Modal from 'react-responsive-modal'
import TaggableAssetSelection from './AssetTypeSelection'

export class ProjectDefinition extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // utilities
            step: 1,
            redirect: false,
            shapeType: '',
            relevantAssetTypes: [],
            assetTypeCheck: false,
            modalIsOpen: false,

            // project state
            projectID: '',
            shape: [],
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
            created: moment().format('MM/DD/YYYY')
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

    setShape(shape, type) {
        this.setState({
            shape: shape,
            shapeType: type
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
            expectedStartDate: projectDesc.expectedStartDate,
            expectedEndDate: projectDesc.expectedEndDate,
            actualStartDate: projectDesc.actualStartDate,
            actualEndDate: projectDesc.actualEndDate,
            projectManager: projectDesc.projectManager,
            projectMembers: projectDesc.projectMembers,
            projectDepartment: projectDesc.projectDepartment,
            projectDescription: projectDesc.projectDescription,
            projectStatus: projectDesc.projectStatus,
            projectBudget: projectDesc.projectBudget,
            notes: projectDesc.notes
        }, function (this) {
            if (this.state.shapeType == 'new' && this.state.assetTypeCheck == false) {
                this.setState({
                    modalIsOpen: true
                })
            } else {
                const projectLoad = {
                    projectID: this.state.projectID,
                    projectName: this.state.projectName,
                    expectedStartDate: this.state.expectedStartDate,
                    expectedEndDate: this.state.expectedEndDate,
                    actualStartDate: this.state.actualStartDate,
                    actualEndDate: this.state.actualEndDate,
                    projectManager: this.state.projectManager,
                    projectMembers: this.state.projectMembers,
                    projectDepartment: this.state.projectDepartment,
                    projectDescription: this.state.projectDescription,
                    projectStatus: this.state.projectStatus,
                    projectBudget: this.state.projectBudget,
                    notes: this.state.notes,
                    created: this.state.created,
                    shape: this.state.shape
                }
                this.props.addProject(projectLoad)
                this.pointsInPolygon('import')
                this.setState({
                    redirect: true
                })
            }
        })
    }

    receiveTypes(typeArray) {
        this.setState({
            relevantAssetTypes: typeArray,
            assetTypeCheck: true,
            modalIsOpen: false
        }, function (this) {
            const projectLoad = {
                projectID: this.state.projectID,
                projectName: this.state.projectName,
                expectedStartDate: this.state.expectedStartDate,
                expectedEndDate: this.state.expectedEndDate,
                actualStartDate: this.state.actualStartDate,
                actualEndDate: this.state.actualEndDate,
                projectManager: this.state.projectManager,
                projectMembers: this.state.projectMembers,
                projectDepartment: this.state.projectDepartment,
                projectDescription: this.state.projectDescription,
                projectStatus: this.state.projectStatus,
                projectBudget: this.state.projectBudget,
                notes: this.state.notes,
                created: this.state.created,
                shape: this.state.shape
            }
            this.props.addProject(projectLoad)
            this.pointsInPolygon('new')
        })
        this.setState({
            redirect: true
        })
    }

    pointsInPolygon(type) {
        const self = this
        let shape = [] as any
        let componentAssets = [] as any
        this.state.shape.forEach(function (point) {
            const shapeArray = [point.lat, point.lng]
            shape.push(shapeArray)
        })
        let assets = [] as any
        if (type == 'new') {
            assets = this.props.assets.filter(asset => {
                return this.state.relevantAssetTypes.includes(asset.assetType)
            })
        } else {
            assets = this.props.assets
        }
        assets.forEach(function (asset) {
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

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
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
            step,
            redirect,
            projectID,
            shape,
            modalIsOpen
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
                            <br />
                            <ProjectDescription
                                back={this.back.bind(this)}
                                post={this.post.bind(this)}
                                shape={shape}
                            />
                        </div>
                    }
                </div>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <div>
                        <TaggableAssetSelection
                            receiveTypes={this.receiveTypes.bind(this)} />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.user,
        ...state.projects,
        ...state.taggableAssets,
        ...state.tags
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators,
        ...Assets.actionCreators,
        ...TagStore.actionCreators
    })
)(ProjectDefinition as any) as typeof ProjectDefinition
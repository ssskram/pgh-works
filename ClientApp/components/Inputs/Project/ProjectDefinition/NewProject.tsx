
// project generation container
// parent of both Description.tsx
// and Geolocate.tsx

import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../../store'
import * as Ping from '../../../../store/GETS/ping'
import * as User from '../../../../store/GETS/user'
import * as Projects from '../../../../store/projects'
import * as Assets from '../../../../store/GETS/taggableAssets'
import * as TagStore from '../../../../store/tags'
import Geolocate from './Geolocate'
import ProjectDescription from './Description'
import Map from '../../../Maps/ProjectMap'
import { v1 as uuid } from 'uuid'
import Modal from 'react-responsive-modal'
import TaggableAssetSelection from '../../Tag/RelevantAssetTypes'
import assetsInPolygon from './../../../../functions/assetsInPolygon'

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
            shape: {},
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
            notes: ''
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
        shape.ShapeType = "3"
        shape.Breaks = []
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
                    notes: this.state.notes,
                    shape: this.state.shape
                }
                this.props.addProject(projectLoad)
                this.assetsInside('import')
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
                notes: this.state.notes,
                shape: this.state.shape
            }
            this.props.addProject(projectLoad)
            this.assetsInside('new')
        })
        this.setState({
            redirect: true
        })
    }

    assetsInside(type) {
        let self = this
        let assets = [] as any
        // if user drew the shape, only pass the assets they deem as relevant
        if (type == 'new') {
            assets = this.props.assets.filter(asset => {
                return this.state.relevantAssetTypes.includes(asset.assetType)
            })
        // else take em all
        } else {
            assets = this.props.assets
        }
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
            return <Redirect push to={link} />
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
                                projects={this.props.projects}
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
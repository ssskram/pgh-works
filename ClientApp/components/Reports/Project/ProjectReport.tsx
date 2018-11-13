
// top level project report
// parent of ProjectCard.tsx
// parent of Attachments.tsx
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
import Attachments from './Attachments'
import * as User from '../../../store/GETS/user'
import * as Assets from '../../../store/GETS/taggableAssets'
import * as TagStore from '../../../store/tags'
import ProjectFields from '../../Inputs/Project/ProjectFields'
import Tags from '../Tags'
import * as moment from 'moment'
import ProjectCard from '../../Cards/ProjectCard'
import { v1 as uuid } from 'uuid'
import ProjectTimeline from '../../Timeline/ProjectTimeline'
import Hydrate from './../../Utilities/HydrateStore'
import canEdit from '../../../functions/canEdit'

const btnMargin = {
    margin: '20px 5px 0px 5px',
    border: '1px solid #383838'
}

const marginBottom = {
    marginBottom: '70px'
}

export class Project extends React.Component<any, any> {
    constructor() {
        super();
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
            canEdit: canEdit(project, personnel, user)
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
                    <div className='row text-center' style={{marginBottom: '25px'}}>
                        <div className='col-md-12'>
                            <h1 style={{ letterSpacing: '2px' }}>{projectName}</h1>
                        </div>
                        {canEdit == true &&
                            <div className='col-md-12'>
                                <div>
                                    <button onClick={this.editProject.bind(this)} style={btnMargin} title='Update info' type='button' className='btn  btn-primary'>Edit</button>
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
                        <div style={marginBottom} className='col-md-12 row'>
                            <Attachments
                                canEdit={canEdit}
                                parentID={projectID}
                                parentType={'Project'}
                                parentName={projectName}
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
                                    <div>
                                        <button disabled={!isEnabled} className='btn btn-success' onClick={this.put.bind(this)}><b>Save</b></button>
                                    </div>
                                </div>
                            </div>
                        </div>

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
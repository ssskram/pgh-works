
// top level phase report
// parent of Phasecard.tsx
// parent of Milestones.tsx
// parent of SubPhases.tsx
// co-parent of Tags.tsx

import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Ping from '../../../store/GETS/ping'
import * as Projects from '../../../store/projects'
import * as Phases from '../../../store/phases'
import * as Personnel from '../../../store/GETS/personnel'
import * as User from '../../../store/GETS/user'
import Spinner from '../../Utilities/Spinner'
import Modal from 'react-responsive-modal'
import PhaseForm from '../../Inputs/Phase/Phase'
import PhaseCard from '../../Cards/PhaseCard'
import Tags from '../Tags'
import Milestones from './Milestones'
import Subphases from './SubPhases'
import Timeline from '../../Timeline/PhaseTimeline'
import PhaseFollows from '../../Inputs/Phase/PhaseFollows'
import DeletePhase from '../../DeleteConfirmations/DeletePhase'
import Hydrate from './../../Utilities/HydrateStore'
import canEdit from '../../../functions/canEdit'

const btnMargin = {
    margin: '5px',
    padding: '5px 12px'
}

const marginBottom = {
    marginBottom: '70px'
}

const iconStyle = {
    height: '30px',
}

export class Phase extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            spinner: true,
            modalIsOpen: false,
            modalType: '',
            redirect: false,
            redirectLink: '',
            canEdit: true,

            // phase state
            phaseID: '',
            cartegraphID: '',
            phaseName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            phaseDescription: '',
            phaseFollows: { project: '', phase: '' },
            phaseStatus: '',
            percentComplete: '',
            notes: '',

            // parent project
            projectID: '',
            projectName: ''
        }
        this.setPhaseState = this.setPhaseState.bind(this)
        this.findPhase = this.findPhase.bind(this)
        this.findProject = this.findProject.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        // ping server
        this.props.ping()
        this.findPhase(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.findPhase(nextProps)
        }
    }

    findPhase(props) {
        // set phase, and pass phase to setProjectState
        const id = this.props.match.params.id
        let phase = props.phases.find(function (item) {
            return item.phaseID == id
        })
        if (phase) {
            this.setPhaseState(phase)
        }
    }

    setPhaseState(phase) {
        const project = this.props.projects.find(project => {
            return project.projectID == phase.projectID
        })
        this.setState({
            projectID: phase.projectID,
            phaseID: phase.phaseID,
            cartegraphID: phase.cartegraphID,
            phaseName: phase.phaseName,
            expectedStartDate: phase.expectedStartDate,
            expectedEndDate: phase.expectedEndDate,
            actualStartDate: phase.actualStartDate,
            actualEndDate: phase.actualEndDate,
            phaseDescription: phase.phaseDescription,
            phaseStatus: phase.phaseStatus,
            phaseFollows: phase.phaseFollows,
            percentComplete: phase.percentComplete,
            notes: phase.notes,
            // canEdit: canEdit(project, this.props.personnel, this.props.user)
        }, function (this) {
            this.findProject(this.state.projectID)
        })
    }

    findProject(id) {
        let project = this.props.projects.find(function (item) {
            return item.projectID == id
        })
        if (project) {
            this.setState({
                projectName: project.projectName,
                spinner: false
            })
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalType: ''
        })
    }

    returnToProject() {
        this.setState({
            redirect: true,
            redirectLink: "/Project/id=" + this.state.projectID
        })
    }

    pfProjectRedirect() {
        this.setState({
            redirect: true,
            redirectLink: "/Project/id=" + this.state.phaseFollows.project
        })
    }

    setPhaseFollows() {
        this.setState({
            modalIsOpen: true,
            modalType: 'follows'
        })
    }

    editPhase() {
        this.setState({
            modalIsOpen: true,
            modalType: 'edit'
        })
    }

    deletePhase() {
        this.setState({
            modalIsOpen: true,
            modalType: 'delete'
        })
    }

    putPhaseFollows(phaseFollows) {
        this.setState({
            phaseFollows: phaseFollows
        }, function (this) {
            const putLoad = {
                phaseID: this.state.phaseID,
                projectID: this.state.projectID,
                cartegraphID: this.state.cartegraphID,
                phaseName: this.state.phaseName,
                expectedStartDate: this.state.expectedStartDate,
                expectedEndDate: this.state.expectedEndDate,
                actualStartDate: this.state.actualStartDate,
                actualEndDate: this.state.actualEndDate,
                phaseDescription: this.state.phaseDescription,
                phaseFollows: this.state.phaseFollows,
                phaseStatus: this.state.phaseStatus,
                percentComplete: this.state.percentComplete,
                notes: this.state.notes
            }
            this.props.updatePhase(putLoad)
            this.closeModal()
        })
    }

    public render() {
        const {
            redirect,
            redirectLink,
            spinner,
            modalIsOpen,
            modalType,
            canEdit,
            phaseID,
            phaseName,
            projectID,
            projectName,
            expectedStartDate,
            expectedEndDate,
            phaseFollows
        } = this.state


        let pfProject = {} as any
        let pfPhase = {} as any
        if (phaseFollows.project != '' && phaseFollows.phase != '') {
            pfProject = this.props.projects.find(project => {
                return project.projectID == phaseFollows.project
            })
            pfPhase = this.props.phases.find(phase => {
                return phase.phaseID == phaseFollows.phase
            })
        }

        if (redirect) {
            return <Redirect push to={redirectLink} />
        }

        return (
            <div>
                {spinner == true &&
                    <Spinner notice='...loading the phase...' />
                }
                {spinner == false &&
                    <div>
                        <h2 style={{ letterSpacing: '2px' }}>
                            {projectName}
                            <span className='pull-right hidden-sm hidden-xs'><button onClick={this.returnToProject.bind(this)} title='Return to project' style={btnMargin} type='button' className='btn btn-success'>
                                <span className='glyphicon glyphicon-arrow-right'></span>
                            </button>
                            </span>
                        </h2>
                        <hr />
                        <br />
                        <h1 className='text-center'><b><img style={{ marginTop: '-12px', marginRight: '5px' }} src='./images/phaseGrey.png' /></b>{phaseName}</h1>
                        {pfProject.projectName && pfPhase.phaseName &&
                            <div className='text-center'>
                                <h4>Follows <b>{pfPhase.phaseName}</b> phase of <a style={{ cursor: 'pointer' }} onClick={this.pfProjectRedirect.bind(this)}><b>{pfProject.projectName}</b></a></h4>
                            </div>
                        }
                        {canEdit == true &&
                            <div className='text-center'>
                                <span><button onClick={this.editPhase.bind(this)} title='Update info' style={btnMargin} type='button' className='btn  btn-primary'>Edit</button></span>
                                <span><button onClick={this.setPhaseFollows.bind(this)} title='Phase follows' style={btnMargin} type='button' className='btn  btn-primary'>Follows</button></span>
                                <span><button onClick={this.deletePhase.bind(this)} title='Delete phase' style={btnMargin} type='button' className='btn  btn-primary'>Delete</button></span>
                            </div>
                        }
                        <div className='col-md-12'>
                            <PhaseCard phase={this.state} />
                        </div>
                        {expectedStartDate && expectedEndDate &&
                            <div style={marginBottom} className='col-md-12 row'>
                                <Timeline phase={this.state} />
                            </div>
                        }
                        <div style={marginBottom} className='col-md-12 row'>
                            <Milestones
                                canEdit={canEdit}
                                phaseID={phaseID}
                                projectID={projectID}
                            />
                        </div>
                        <div style={marginBottom} className='col-md-12 row'>
                            <Subphases
                                canEdit={canEdit}
                                phaseID={phaseID}
                                projectID={projectID}
                            />
                        </div>
                        <div style={marginBottom} className='col-md-12 row'>
                            <Tags
                                canEdit={canEdit}
                                parentID={phaseID}
                                parentName={phaseName}
                                parentType='Phase'
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
                    {modalType == 'edit' &&
                        <PhaseForm
                            phaseID={phaseID}
                            closeModal={this.closeModal.bind(this)}
                            update
                        />
                    }
                    {modalType == 'follows' &&
                        <PhaseFollows
                            passFollows={this.putPhaseFollows.bind(this)}
                        />
                    }
                    {modalType == 'delete' &&
                        <DeletePhase
                            phase={this.state}
                            returnToProject={this.returnToProject.bind(this)}
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
        ...state.phases,
        ...state.user,
        ...state.personnel
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators,
        ...Phases.actionCreators,
        ...User.actionCreators,
        ...Personnel.actionCreators
    })
)(Phase as any) as typeof Phase
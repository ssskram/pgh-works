
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import Spinner from '../Utilities/Spinner'
import Modal from 'react-responsive-modal'
import PhaseForm from '../Inputs/Phase'
import PhaseCard from './PhaseCard'
import Tags from '../Tags/Tags'
import Milestones from './Milestones'
import Attachments from './../Attachments/Attachments'

const btnMargin = {
    margin: '0px 5px'
}

const marginBottom = {
    marginBottom: '50px'
}

export class Phase extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            spinner: true,
            modalIsOpen: false,
            redirect: false,

            // phase state
            phaseID: '',
            cartegraphID: '',
            phaseName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            phaseDescription: '',
            phaseType: '',
            phaseFollows: '',
            phaseStatus: '',
            percentComplete: '',
            notes: '',
            created: '',
            createdBy: '',
            lastModifiedBy: '',

            // parent project
            projectID: '',
            projectName: '',
            shape: []
        }
        this.setPhaseState = this.setPhaseState.bind(this)
        this.findPhase = this.findPhase.bind(this)
        this.findProject = this.findProject.bind(this)
    }
    componentDidMount() {
        // ping server
        this.props.ping()
        this.findPhase(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.findPhase(nextProps)
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
            phaseType: phase.phaseType,
            phaseFollows: phase.phaseFollows,
            percentComplete: phase.percentComplete,
            notes: phase.notes,
            created: phase.created,
            createdBy: phase.createdBy,
            lastModifiedBy: phase.lastModifiedBy,
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
                shape: project.shape,
                spinner: false
            })
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    returnToProject() {
        this.setState({
            redirect: true
        })
    }

    editPhase() {
        this.setState({
            modalIsOpen: true,
        })
    }

    public render() {
        const {
            redirect,
            spinner,
            modalIsOpen,
            phaseID,
            phaseName,
            phaseFollows,
            projectID,
            projectName
        } = this.state

        const link = "/Project/id=" + projectID
        if (redirect) {
            return <Redirect to={link} />
        }

        function lowerFirstLetter(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        }

        const phaseFollowsFormatted = lowerFirstLetter(phaseFollows)

        return (
            <div>
                <h2 style={{ letterSpacing: '2px' }}>{projectName}
                    <span><button onClick={this.editPhase.bind(this)} style={btnMargin} className='btn pull-right hidden-xs'>Update phase</button></span>
                    <span><button onClick={this.returnToProject.bind(this)} style={btnMargin} className='btn pull-right'>Return to project</button></span>
                </h2>
                <hr />
                <br />
                <h2 className='text-center'><b><img style={{marginTop: '-12px'}} src='./images/phaseGrey.png' /></b> {phaseName}</h2>
                {phaseFollows &&
                    <h4 className='text-center'><i>Follows {phaseFollowsFormatted}</i></h4>
                }
                <h4></h4>
                <div style={marginBottom} className='col-md-12'>
                    <PhaseCard phase={this.state} />
                </div>
                <div style={marginBottom} className='col-md-12'>
                    <Milestones phaseID={phaseID} projectID={projectID}/>
                </div>
                <div style={marginBottom} className='row col-md-12'>
                    <Tags parentID={projectID} parentName={projectName} parentType='Project' />
                </div>
                <div style={marginBottom} className='col-md-12'>
                    <Attachments projectID={projectID} />
                </div>
                {spinner == true &&
                    <Spinner notice='...loading the phase...' />
                }
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <PhaseForm
                        phaseID={phaseID}
                        closeModal={this.closeModal.bind(this)}
                        update
                    />
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects,
        ...state.phases
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators,
        ...Phases.actionCreators
    })
)(Phase as any) as typeof Phase
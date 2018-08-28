
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as PhasesStore from '../../store/phases'
import Modal from 'react-responsive-modal'
import PhaseForm from '../Inputs/Phase'

export class Phases extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,

            // phases
            phases: [],
        }
        this.getPhases = this.getPhases.bind(this);
    }

    componentDidMount() {
        this.getPhases(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getPhases(nextProps)
    }

    getPhases(props) {
        console.log(props)
        if (props.phases) {
            let phases = props.phases.filter(function (item) {
                return item.projectID == props.projectID
            })
            console.log(phases)
            if (phases.length > 0) {
                this.setState({
                    phases: phases
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen,
            phases
        } = this.state

        return (
            <div>
                <h3>Phases<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Define a new phase</button></span></h3>
                <hr />
                {phases.length == 0 &&
                    <h4 className='text-center'>No phases</h4>
                }
                {phases.length > 0 &&
                    phases.map((phase) => {
                        return (
                            <div className="col-sm-12" key={phase.phaseID}>
                                <div className="panel">
                                    <div className="panel-body text-center">
                                        <h3>{phase.phaseName}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    })
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
                        projectID={this.props.projectID}
                        closeModal={this.closeModal.bind(this)}
                    />
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.phases
    }),
    ({
        ...PhasesStore.actionCreators
    })
)(Phases as any) as typeof Phases
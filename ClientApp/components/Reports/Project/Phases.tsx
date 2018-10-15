
// returns all phases per project
// parent of ProjectPhaseCard.tsx

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as PhasesStore from '../../../store/phases'
import Modal from 'react-responsive-modal'
import PhaseForm from '../../Inputs/Phase/Phase'
import PhaseCard from '../../Cards/ProjectPhaseCard'
import TL from '../../Timeline/Timeline'

const iconStyle = {
    marginRight: '10px',
    marginTop: '-8px',
    height: '40px'
}

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
        if (props.phases) {
            let phases = props.phases.filter(function (item) {
                return item.projectID == props.projectID
            })
            if (phases.length > 0) {
                this.setState({
                    phases: phases.sort(function (a, b) {
                        return +new Date(a.expectedStartDate) - +new Date(b.expectedStartDate);
                    })
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

        const {
            canEdit
        } = this.props

        // timeline configs
        const items = [] as any
        let counter = 0
        phases.forEach(function (phase) {
            let expected = {
                id: counter,
                content: phase.phaseName,
                start: phase.expectedStartDate,
                end: phase.expectedEndDate,
                style: 'background-color: rgba(0, 153, 255, 0.3); border-color: rgba(0, 153, 255, 0.3)'
            }
            counter++
            items.push(expected)
        })

        phases.forEach(function (phase) {
            if (phase.actualStartDate && phase.actualEndDate) {
                let actual = {
                    id: counter,
                    content: phase.phaseName,
                    start: phase.actualStartDate,
                    end: phase.actualEndDate,
                    style: 'background-color: rgba(255, 167, 167, .6); border-color: rgba(255, 167, 167, .6)'
                }
                counter++
                items.push(actual)
            }
        })

        return (
            <div>
                <h2>
                    <img style={iconStyle} src='./images/phaseGrey.png' />
                    Phases
                    {canEdit == true &&
                        <span>
                            <button onClick={this.openModal.bind(this)} type='button' className='btn  btn-primary pull-right hidden-xs'>
                                <span style={{ fontSize: '20px' }} title='Add a phase' className='glyphicon glyphicon-plus'></span>
                            </button>
                        </span>
                    }
                </h2>
                <hr />
                {phases.length == 0 &&
                    <h4 className='text-center'><i>No phases</i></h4>
                }
                {phases.length > 0 &&
                    <div className='col-md-12 hidden-xs'>
                        <TL items={items} />
                        <br />
                        <br />
                    </div>
                }
                {phases.length > 0 &&
                    phases.map((phase) => {
                        return (
                            <PhaseCard phase={phase} key={phase.phaseID} />
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
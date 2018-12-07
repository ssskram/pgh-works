
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

const phaseImg = require('./../../../images/phaseGrey.png')

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
                itemType: 'phaseExpected',
                style: 'background-color: #ACD1EF; border-color: #ACD1EF;'
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
                    itemType: 'phaseActual',
                    style: 'background-color: #1561A1; border-color: #1561A1; color: #fffcf5;'
                }
                counter++
                items.push(actual)
            }
        })

        return (
            <div className='row'>
                <h2>
                    <img style={iconStyle} src={phaseImg as string} />
                    Phases
                    {canEdit == true &&
                        <span>
                            <div onClick={this.openModal.bind(this)} className='btn-add pull-right hidden-xs'>
                                <span style={{ marginTop: '10px' }} title='Add a phase' className='glyphicon glyphicon-plus'></span>
                            </div>
                        </span>
                    }
                </h2>
                <hr />
                {phases.length == 0 &&
                    <h4 className='text-center'><i>No phases</i></h4>
                }
                {phases.length > 0 &&
                    <div className='col-md-12 hidden-xs'>
                        <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ backgroundColor: '#ACD1EF', padding: '8px', borderRadius: '5px 0px 0px 5px' }}>Expected</span>
                            <span style={{ backgroundColor: '#1561A1', color: '#fffcf5', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Actual</span>
                        </div>
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
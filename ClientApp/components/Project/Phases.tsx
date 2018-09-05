
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as PhasesStore from '../../store/phases'
import Modal from 'react-responsive-modal'
import PhaseForm from '../Inputs/Phase'
import PhaseCard from './Cards/PhaseCard'
import TL from 'react-visjs-timeline'

const iconStyle = {
    marginRight: '5px',
    marginTop: '-8px',
    height: '35px'
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

        // timeline configs

        const timelineHeight = phases.length * 40 + 90

        const timelineOptions = {
            width: '100%',
            height: timelineHeight + 'px',
            stack: true,
            showMajorLabels: true,
            showCurrentTime: true,
            zoomMin: 1000000,
            format: {
                minorLabels: {
                    minute: 'h:mma',
                    hour: 'ha'
                }
            }
        }

        const items = [] as any

        phases.forEach(function (phase, index) {
            let timelineItem = {
                id: index,
                content: phase.phaseName,
                start: phase.expectedStartDate,
                end: phase.expectedEndDate
            }
            items.push(timelineItem)
        })

        return (
            <div>
                <h3><img style={iconStyle} src='./images/phaseGrey.png' /> Phases<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Define a new phase</button></span></h3>
                <hr />
                {phases.length == 0 &&
                    <h4 className='text-center'><i>No phases</i></h4>
                }
                {phases.length > 0 &&
                    <div className='col-md-10 col-md-offset-1 hidden-xs'>
                        <TL options={timelineOptions} items={items} />
                        <br />
                    </div>
                }
                {phases.length > 0 &&
                    phases.map((phase) => {
                        return (
                            <PhaseCard phase={phase} />
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
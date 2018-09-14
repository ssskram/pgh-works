
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Drawdowns from '../../store/drawdowns'
import * as Phases from '../../store/phases'

export class DeleteDrawdown extends React.Component<any, any> {

    deleteDrawdown() {
        const drawdown = this.props.drawdown
        console.log(drawdown)
        const allDrawdowns = this.props.drawdowns
        const phases = this.props.phases
        let self = this
        // remove from store
        this.props.deleteDrawdown(drawdown)
        // then delete locally
        this.props.removeDrawdown(drawdown)
        if (drawdown.parentType == 'Project') {
            let relevantPhases = phases.filter(phase => phase.projectID == drawdown.parentID)
            console.log(relevantPhases)
            let phaseDrawdowns = [] as any
            relevantPhases.forEach(function (phase) {
                const phaseDrawdown = allDrawdowns.find(function (drawdown) {
                    drawdown.parentID == phase.phaseID && drawdown.drawdownType == 'Phase'
                })
                phaseDrawdowns.push(phaseDrawdown)
            })
            phaseDrawdowns.forEach(function (phase) {
                self.props.deleteDrawdown(phase)
                self.props.removeDrawdown(phase)
            })
        }
        this.props.closeModal()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this drawdown?</h2>
                <button onClick={this.deleteDrawdown.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.drawdowns,
        ...state.phases
    }),
    ({
        ...Drawdowns.actionCreators,
        ...Phases.actionCreators
    })
)(DeleteDrawdown as any) as typeof DeleteDrawdown
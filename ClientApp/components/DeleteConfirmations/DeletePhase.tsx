
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Phases from '../../store/phases'

export class DeletePhase extends React.Component<any, any> {

    deletePhase () {
        // remove from store
        const phase = this.props.phase
        const deleteLoad = {
            cartegraphID: phase.cartegraphID,
            phaseID: phase.phaseID,
            projectID: phase.projectID,
            phaseName: phase.phaseName,
            phaseDescription: phase.phaseDescription,
            expectedStartDate: phase.expectedStartDate,
            expectedEndDate: phase.expectedEndDate,
            actualStartDate: phase.actualStartDate,
            actualEndDate: phase.actualEndDate,
            phaseStatus: phase.phaseStatus,
            notes: phase.notes
        }
        this.props.deletePhase(deleteLoad)
        this.props.returnToProject()
    }

    public render() {
        return (
            <div className='col-md-12 text-center'>
                <h2>Are you sure you want to delete this phase?</h2>
                <button onClick={this.deletePhase.bind(this)} className='btn btn-danger'>Delete</button>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.phases
    }),
    ({
        ...Phases.actionCreators
    })
  )(DeletePhase as any) as typeof DeletePhase
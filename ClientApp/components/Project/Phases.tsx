
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as PhasesStore from '../../store/phases'

export class Phases extends React.Component<any, any> {

    public render() {
        const {
            projectID
        } = this.props
        return (
            <div>
                <h5>Return phases created for project {projectID}</h5>
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
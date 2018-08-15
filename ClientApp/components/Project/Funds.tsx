
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as FundStore from '../../store/funds'

export class Funds extends React.Component<any, any> {

    public render() {
        const {
            projectID
        } = this.props
        return (
            <div>
                <h5>Return funds associated with project {projectID}</h5>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.funds
    }),
    ({
        ...FundStore.actionCreators
    })
  )(Funds as any) as typeof Funds
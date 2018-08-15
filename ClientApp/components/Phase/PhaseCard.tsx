
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'

export class PhaseData extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h3>Phase data</h3>
                <hr/>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
  )(PhaseData as any) as typeof PhaseData
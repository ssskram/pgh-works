
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'
import TL from './Timeline'

export class Timeline extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h2>Timeline</h2>
                <hr/>
                <TL />
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
  )(Timeline as any) as typeof Timeline
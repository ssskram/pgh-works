
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'

export class ProjectData extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h3>Project data</h3>
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
  )(ProjectData as any) as typeof ProjectData
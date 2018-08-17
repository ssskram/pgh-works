
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'

export class AllMilestones extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h2>All Milestones</h2>
                <hr/>
                <i className='text-center'>Return filterable list of all milestones in system</i>
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
  )(AllMilestones as any) as typeof AllMilestones
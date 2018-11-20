
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Activity from '../../store/activity'

export class AllActivity extends React.Component<any, any> {
    constructor() {
        super()
    }

    componentDidMount() {
        console.log(this.props)
    }


    public render() {
        return (
            <div>
                <Hydrate />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.activity
    }),
    ({
        ...Ping.actionCreators,
        ...Activity.actionCreators
    })
)(AllActivity as any) as typeof AllActivity
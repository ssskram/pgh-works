
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Funds from '../../store/GETS/funds'

export class ProgramsFunds extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
        console.log(this.props)
    }

    public render() {
        return (
            <div>
                <h2>Programs & Funds</h2>
                <hr/>
                <i className='text-center'>Return filterable list of programs/funding sources</i>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.funds
    }),
    ({
        ...Ping.actionCreators,
        ...Funds.actionCreators
    })
  )(ProgramsFunds as any) as typeof ProgramsFunds
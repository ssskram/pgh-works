
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Phases from '../../store/phases'
import PhaseFilters from '../Filters/PhaseFilter'

export class AllPhases extends React.Component<any, any> {
    constructor (props) {
        super(props)
        this.state = {
            phases: props.phases
        }
    }

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h2>All Phases <span style={{marginTop: '-10px'}} className='pull-right'><PhaseFilters /></span></h2>
                <hr/>
                <i className='text-center'>Return filterable list of all phases in system</i>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.phases
    }),
    ({
        ...Ping.actionCreators,
        ...Phases.actionCreators
    })
  )(AllPhases as any) as typeof AllPhases
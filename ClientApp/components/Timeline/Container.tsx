
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import TL from './Timeline'

const groups = [
    { id: 'Project A', content: 'Project A' },
    { id: 'Project B', content: 'Project B' }
]

const items = [
    { id: 1, group: 'Project A', content: 'Phase A', start: '04/20/2018', end: '09/20/2018' },
    { id: 2, group: 'Project A', content: 'Phase b', start: '05/22/2017', end: '06/03/2018' },
    { id: 3, group: 'Project B', content: 'Phase A', start: '01/31/2018', end: '04/18/2018' },
    { id: 4, group: 'Project B', content: 'Phase B', start: '03/08/2017', end: '09/19/2018' },
    { id: 5, group: 'Project B', content: 'Phase C', start: '12/03/2017', end: '12/03/2018' },
    { id: 6, group: 'Project A', content: 'Phase C', start: '08/03/2018', end: '09/19/2018' },
]

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
                <TL groups={groups} items={items}/>
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
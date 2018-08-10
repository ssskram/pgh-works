
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'
import TL from 'react-visjs-timeline'

const options = {
    width: '100%',
    height: '600px',
    stack: true,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 1000000,
    format: {
        minorLabels: {
            minute: 'h:mma',
            hour: 'ha'
        }
    }
}

const groups = [
    { id: 1, content: 'Group A' },
    { id: 2, content: 'Group B' }
]

const items = [
    { id: 1, group: 1, content: 'Project A', start: '2018-04-20', end: '2018-09-20' },
    { id: 2, group: 1, content: 'Project B', start: '2017-05-22', end: '2018-06-03' },
    { id: 3, group: 2, content: 'Project C', start: '2018-01-31', end: '2018-04-18' },
    { id: 4, group: 2, content: 'Project D', start: '2017-08-03', end: '2018-09-19' },
    { id: 5, group: 2, content: 'Project E', start: '2017-12-03', end: '2018-12-03' },
    { id: 6, group: 1, content: 'Project F', start: '2018-08-03', end: '2018-09-19' },
]

export class Line extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <TL options={options} items={items} groups={groups} />
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
)(Line as any) as typeof Line
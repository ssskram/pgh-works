
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as TimelineStore from '../../store/timeline'
import TL from './Timeline'

const groups = [
    { id: 'Project', content: 'Projects' },
    { id: 'Phase', content: 'Phases' }
]

export class Timeline extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
        console.log(this.props)
    }

    public render() {
        const {
            timeline
        } = this.props

        let groups = [] as any
        let items = [] as any
        let index = 1
        timeline.forEach(function (item) {
            if (item.type == 'Project') {
                let group = {
                    id: item.id,
                    content: item.name
                }
                groups.push(group)

                let expected = {
                    id: index,
                    content: item.expectedStartDate + ' - ' + item.expectedEndDate,
                    start: item.expectedStartDate,
                    end: item.expectedEndDate,
                    group: item.id,
                    style: 'background-color: #d5ddf6; border-color: #d5ddf6'
                }
                index = index + 1
                items.push(expected)
                if (item.actualStartDate && item.actualEndDate) {
                    let actual = {
                        id: index,
                        content: item.actualStartDate + ' - ' + item.actualEndDate,
                        start: item.actualStartDate,
                        end: item.actualEndDate,
                        group: item.id,
                        style: 'background-color: pink; border-color: pink'
                    }
                    index = index + 1
                    items.push(actual)
                }
            } else {
                let expected = {
                    id: index,
                    content: "Phase: " + item.name,
                    start: item.expectedStartDate,
                    end: item.expectedEndDate,
                    group: item.parentProjectID,
                    style: 'background-color: #d5ddf6; border-color: #d5ddf6'
                }
                index = index + 1
                items.push(expected)
                if (item.actualStartDate && item.actualEndDate) {
                    let actual = {
                        id: index,
                        content: "Phase: " + item.name,
                        start: item.actualStartDate,
                        end: item.actualEndDate,
                        group: item.parentProjectID,
                        style: 'background-color: pink; border-color: pink'
                    }
                    index = index + 1
                    items.push(actual)
                }
            }
        })
        return (
            <div>
                <h2>Timeline</h2>
                <hr />
                {timeline.length > 0 &&
                    <div>
                        <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ backgroundColor: '#d5ddf6', padding: '8px' }}>Expected</span>
                            <span style={{ backgroundColor: 'pink', padding: '8px' }}>Actual</span>
                        </div>
                        <TL groups={groups} items={items} />
                    </div>
                }
                {timeline.length == 0 &&
                    <div className='col-md-12'>
                        <h1>Your timeline is empty</h1>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.timeline
    }),
    ({
        ...Ping.actionCreators,
        ...TimelineStore.actionCreators
    })
)(Timeline as any) as typeof Timeline

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import { Link } from 'react-router-dom' 
import * as Ping from '../../store/GETS/ping'
import * as TimelineStore from '../../store/timeline'
import TL from './Timeline'
import Table from 'react-table'

export class Timeline extends React.Component<any, any> {
    constructor () {
        super()
        this.state = {
            timeline: [],
            items: [],
            groups: []
        }
    }
    componentDidMount() {
        // ping server
        this.props.ping()
        this.setState ({
            timeline: this.props.timeline
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState ({
            timeline: nextProps.timeline
        })
    }

    returnPhaseCount(projectID) {
        const phases = this.state.timeline.filter(function (item) {
            return item.parentProjectID == projectID
        }) 
        return phases.length
    }

    deleteTimelineItem (projectID) {
        this.props.deleteTimeline(projectID)
    }

    public render() {
        const {
            timeline
        } = this.state

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
                    content: item.name + ', ' + item.expectedStartDate + ' - ' + item.expectedEndDate,
                    start: item.expectedStartDate,
                    end: item.expectedEndDate,
                    group: item.parentProjectID,
                    style: 'background-color: #d5ddf6; border-color: green; border-width: 2px;'
                }
                index = index + 1
                items.push(expected)
                if (item.actualStartDate && item.actualEndDate) {
                    let actual = {
                        id: index,
                        content: item.name + ', ' + item.actualStartDate + ' - ' + item.actualEndDate,
                        start: item.actualStartDate,
                        end: item.actualEndDate,
                        group: item.parentProjectID,
                        style: 'background-color: pink; border-color: green; border-width: 2px;'
                    }
                    index = index + 1
                    items.push(actual)
                }
            }
        })

        const columns = [{
            Header: 'Project',
            accessor: 'name'
        }, {
            Header: 'Phases',
            accessor: 'id',
            Cell: props => <div>{this.returnPhaseCount(props.value)}</div>
        }, {
            Header: '',
            accessor: 'id',
            Cell: props => <button onClick={() => this.deleteTimelineItem(props.value)} className='btn btn-danger'><span className='glyphicon glyphicon glyphicon-remove'></span></button>,
            maxWidth: 100
        }, {
            Header: '',
            accessor: 'id',
            Cell: props => <Link to={'/Project/id=' + props.value}><button className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button></Link>,
            maxWidth: 100
        }]

        return (
            <div>
                <h2>Timeline</h2>
                <hr />
                {timeline.length > 0 &&
                    <div>
                        <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ border: '2px solid #d5ddf6', backgroundColor: '#d5ddf6', padding: '8px' }}>Expected</span>
                            <span style={{ border: '2px solid pink', backgroundColor: 'pink', padding: '8px' }}>Actual</span>
                            <span style={{ border: '2px solid green', padding: '8px' }}>Phase</span>
                        </div>
                        <TL groups={groups} items={items} />
                        <br />
                        <Table
                            data={timeline.filter(function (item) {
                                return item.type == 'Project'
                            })}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={50}
                            showPageJump={false}
                            showPagination={timeline > 50}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }
                            })}
                        />
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
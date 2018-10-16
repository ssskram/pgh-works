
// timeline component rendered on project report

import * as React from 'react'
import TL from './Timeline'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Timeline from '../../store/timeline'
import * as Phases from '../../store/phases'

const timelineImg = require('./../../images/timelineDark.png')

const btnMargin = {
    marginBottom: '10px',
    border: '1px solid #383838'
}

const iconStyle = {
    height: '30px',
}

export class ProjectTimeline extends React.Component<any, any> {

    addToTimeline() {
        let self = this
        const timelineLoad = {
            id: self.props.project.projectID,
            type: 'Project',
            name: self.props.project.projectName,
            expectedStartDate: self.props.project.expectedStartDate,
            expectedEndDate: self.props.project.expectedEndDate,
            actualStartDate: self.props.project.actualStartDate,
            actualEndDate: self.props.project.actualEndDate
        }
        this.props.addTimeline(timelineLoad)
        const phases = this.props.phases.filter(function (phase) {
            return phase.projectID == self.props.project.projectID
        })
        phases.forEach(function (phase) {
            const phaseLoad = {
                id: phase.phaseID,
                type: 'Phase',
                name: phase.phaseName,
                parentProjectID: phase.projectID,
                expectedStartDate: phase.expectedStartDate,
                expectedEndDate: phase.expectedEndDate,
                actualStartDate: phase.actualStartDate,
                actualEndDate: phase.actualEndDate
            }
            self.props.addTimeline(phaseLoad)
        })
    }

    public render() {
        const {
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate
        } = this.props.project

        const items = [] as any
        let expected = {
            id: 1,
            content: expectedStartDate + ' - ' + expectedEndDate,
            start: expectedStartDate,
            end: expectedEndDate,
            style: 'background-color: #5393C8; border-color: #5393C8; color: #fffcf5;'
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                style: 'background-color: #FFBB5F; border-color: #FFBB5F;'
            }
            items.push(actual)
        }

        return (
            <div>
                <br />
                <br />
                <div className='col-md-12'>
                    <div style={{ marginBottom: '-38px', fontSize: '14px' }}>
                        <span style={{ backgroundColor: '#5393C8', color: '#fffcf5', padding: '8px' }}>Expected</span>
                        <span style={{ backgroundColor: '#FFBB5F', padding: '8px' }}>Actual</span>
                    </div>
                    <Link to={'/Timeline'}>
                        <button style={btnMargin} onClick={this.addToTimeline.bind(this)} title='Add to timeline' type='button' className='btn  btn-secondary pull-right'>
                            <span className='glyphicon'>
                                <img style={iconStyle} src={timelineImg as string}></img>
                            </span>
                        </button>
                    </Link>
                </div>
                {this.props.project &&
                    <TL items={items} />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.timeline,
        ...state.phases
    }),
    ({
        ...Timeline.actionCreators,
        ...Phases.actionCreators,
    })
)(ProjectTimeline as any) as typeof ProjectTimeline

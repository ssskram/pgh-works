
// timeline component rendered on project report

import * as React from 'react'
import TL from './Timeline'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Timeline from '../../store/timeline'
import * as Phases from '../../store/phases'

export class ProjectTimeline extends React.Component<any, any> {

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
            itemType: 'projectExpected',
            style: 'background-color: #ACD1EF; border-color: #ACD1EF;'
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                itemType: 'projectActual',
                style: 'background-color: #1561A1; border-color: #1561A1; color: #fffcf5;'
            }
            items.push(actual)
        }

        return (
            <div>
                <br />
                <br />
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#ACD1EF', padding: '8px', borderRadius: '5px 0px 0px 5px' }}>Expected</span>
                    <span style={{ backgroundColor: '#1561A1', color: '#fffcf5', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Actual</span>
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
        ...state.phases,
    }),
    ({
        ...Timeline.actionCreators,
        ...Phases.actionCreators,
    })
)(ProjectTimeline as any) as typeof ProjectTimeline

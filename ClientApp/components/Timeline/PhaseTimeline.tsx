
// timeline component rendered on phase report

import * as React from 'react'
import TL from './Timeline'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Subphases from '../../store/subphases'
import * as Milestones from '../../store/milestones'

export class PhaseTimeline extends React.Component<any, any> {

    componentDidMount() {
        console.log(this.props)
    }

    public render() {
        const {
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
        } = this.props.phase

        const items = [] as any
        let expected = {
            id: 1,
            content: expectedStartDate + ' - ' + expectedEndDate,
            start: expectedStartDate,
            end: expectedEndDate,
            style: 'background-color: #ACD1EF; border-color: #ACD1EF;'
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                style: 'background-color: #1561A1; border-color: #1561A1; color: #fffcf5;'
            }
            items.push(actual)
        }

        const milestones = this.props.milestones.filter(ms => ms.phaseID == this.props.phase.phaseID).forEach((m, i) => {
            let mi
            if (m.percentComplete < 100) {
                mi = {
                    id: i + 4,
                    content: m.milestoneName,
                    start: m.dueDate,
                    style: 'max-width: 250px; background-color: #FFEEBB; border-color: #FFEEBB;'
                }
            } else {
                mi = {
                    id: i + 4,
                    content: m.milestoneName,
                    start: m.dateCompleted,
                    style: 'max-width: 250px; background-color: #FFEEBB; border-color: #FFEEBB;'
                }
            }
            items.push(mi)
        })

        const subphases = this.props.subphases.filter(sp => sp.phaseID == this.props.phase.phaseID)
        console.log(subphases)

        return (
            <div>
                <br />
                <br />
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#ACD1EF', padding: '8px' }}>Expected</span>
                    <span style={{ backgroundColor: '#1561A1', color: '#fffcf5', padding: '8px' }}>Actual</span>
                </div>
                {this.props.phase &&
                    <TL items={items} />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.subphases,
        ...state.milestones
    }),
    ({
        ...Subphases.actionCreators,
        ...Milestones.actionCreators
    })
)(PhaseTimeline as any) as typeof PhaseTimeline

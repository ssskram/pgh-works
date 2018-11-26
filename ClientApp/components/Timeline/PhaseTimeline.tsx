
// timeline component rendered on phase report

import * as React from 'react'
import TL from './Timeline'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Subphases from '../../store/subphases'
import * as Milestones from '../../store/milestones'

export class PhaseTimeline extends React.Component<any, any> {

    public render() {
        const {
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
        } = this.props.phase

        let counter = 0
        const items = [] as any

        // expected dates
        let expected = {
            id: counter,
            content: expectedStartDate + ' - ' + expectedEndDate,
            start: expectedStartDate,
            end: expectedEndDate,
            itemType: 'phaseExpected',
            style: 'background-color: #ACD1EF; border-color: #ACD1EF;'
        }
        counter++
        items.push(expected)

        // if actual dates, add
        if (actualStartDate && actualEndDate) {
            let actual = {
                id: counter + 1,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                itemType: 'phaseActual',
                style: 'background-color: #1561A1; border-color: #1561A1; color: #fffcf5;'
            }
            items.push(actual)
            counter++
        }

        // add subphases
        this.props.subphases.filter(sp => sp.phaseID == this.props.phase.phaseID).forEach((s) => {
            const sb = {
                id: counter + 1,
                content: s.subphaseName,
                start: s.startDate,
                end: s.endDate,
                itemType: 'subphase',
                style: 'background-color: #FFE6DB; border-color: #FFE6DB;'
            }
            items.push(sb)
            counter++
        })

        // add milestones
        this.props.milestones.filter(ms => ms.phaseID == this.props.phase.phaseID).forEach((m, i) => {
            let mi
            if (m.percentComplete < 100) {
                if (m.dueDate) {
                    mi = {
                        id: counter + 1,
                        content: m.milestoneName,
                        start: m.dueDate,
                        itemType: 'milestoneOpen',
                        style: 'max-width: 250px; background-color: #FFEEBB; border-color: #FFEEBB;'
                    }
                    counter++
                }
            } else {
                mi = {
                    id: counter + 1,
                    content: m.milestoneName,
                    start: m.dateCompleted,
                    itemType: 'milestoneCompleted',
                    style: 'max-width: 250px; background-color: #FFEEBB; border-color: #FFEEBB;'
                }
                counter++
            }
            if (mi) items.push(mi)
        })

        console.log(items)
        return (
            <div>
                <br />
                <br />
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#ACD1EF', padding: '8px' }}>Expected</span>
                    <span style={{ backgroundColor: '#1561A1', color: '#fffcf5', padding: '8px' }}>Actual</span>
                    <span style={{ backgroundColor: '#FFE6DB', padding: '8px' }}>Subphase</span>
                    <span style={{ backgroundColor: '#FFEEBB', padding: '8px' }}>Milestone</span>
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

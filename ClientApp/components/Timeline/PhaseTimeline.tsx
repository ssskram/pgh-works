
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
            style: 'background-color: #DAECFB; border-color: #DAECFB;'
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
                style: 'background-color: #3473A8; border-color: #3473A8; color: #fffcf5;'
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
                style: 'background-color: #FFB043; border-color: #FFB043;'
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
                        style: 'max-width: 250px; background-color: #FF7B43; border-color: #FF7B43;'
                    }
                    counter++
                }
            } else {
                mi = {
                    id: counter + 1,
                    content: m.milestoneName,
                    start: m.dateCompleted,
                    itemType: 'milestoneCompleted',
                    style: 'max-width: 250px; background-color: #FF7B43; border-color: #FF7B43;'
                }
                counter++
            }
            if (mi) items.push(mi)
        })

        return (
            <div>
                <br />
                <br />
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#DAECFB', padding: '8px', borderRadius: '5px 0px 0px 5px' }}>Expected</span>
                    <span style={{ backgroundColor: '#3473A8', color: '#fffcf5', padding: '8px' }}>Actual</span>
                    <span style={{ backgroundColor: '#FFB043', padding: '8px' }}>Subphase</span>
                    <span style={{ backgroundColor: '#FF7B43', padding: '8px', borderRadius: '0px 5px 5px 0px'}}>Milestone</span>
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

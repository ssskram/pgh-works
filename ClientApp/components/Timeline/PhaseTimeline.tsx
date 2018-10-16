
// timeline component rendered on phase report

import * as React from 'react'
import TL from './Timeline'

export default class PhaseTimeline extends React.Component<any, any> {

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
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#5393C8', color: '#fffcf5', padding: '8px' }}>Expected</span>
                    <span style={{ backgroundColor: '#FFBB5F', padding: '8px' }}>Actual</span>
                </div>
                {this.props.phase &&
                    <TL items={items} />
                }
            </div>
        )
    }
}

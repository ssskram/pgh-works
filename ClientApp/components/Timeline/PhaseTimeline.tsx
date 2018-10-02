
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
            style: 'background-color: rgba(0, 153, 255, 0.3); border-color: rgba(0, 153, 255, 0.3)'
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                style: 'background-color: rgba(255, 167, 167, .6); border-color: rgba(255, 167, 167, .6)'
            }
            items.push(actual)
        }

        return (
            <div>
                <br />
                <br />
                <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                    <span style={{ backgroundColor: 'rgba(0, 153, 255, 0.3)', padding: '8px' }}>Expected</span>
                    <span style={{ backgroundColor: 'rgba(255, 167, 167, .4)', padding: '8px' }}>Actual</span>
                </div>
                {this.props.phase &&
                    <TL items={items} />
                }
            </div>
        )
    }
}

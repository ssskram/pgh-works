
import * as React from 'react'
import TL from './../Timeline/Timeline'

export default class ProjectTimeline extends React.Component<any, any> {

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
            end: expectedEndDate
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: actualStartDate + ' - ' + actualEndDate,
                start: actualStartDate,
                end: actualEndDate,
                style: 'background-color: pink'
            }
            items.push(actual)
        }

        return (
            <div>
                <div className='col-md-12'>
                    <br />
                    <br />
                    <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                        <span style={{ backgroundColor: '#d5ddf6', padding: '8px' }}>Expected</span>
                        <span style={{ backgroundColor: 'pink', padding: '8px' }}>Actual</span>
                    </div>
                    <div className='col-md-12'>
                        {this.props.project &&
                            <TL items={items} />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

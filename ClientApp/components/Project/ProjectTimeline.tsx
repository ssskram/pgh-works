
import * as React from 'react'
import TL from './../Timeline/Timeline'

export default class ProjectTimeline extends React.Component<any, any> {

    public render() {
        const {
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
            projectName
        } = this.props.project

        const items = [] as any
        let expected = {
            id: 1,
            content: projectName + ', ' + expectedStartDate + ' - ' + expectedEndDate + ' (expected)',
            start: expectedStartDate,
            end: expectedEndDate
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: projectName + ', ' + actualStartDate + ' - ' + actualEndDate + ' (actual)',
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
                    {this.props.project &&
                        <TL items={items} />
                    }
                </div>
            </div>
        )
    }
}


import * as React from 'react'
import TL from './../Timeline/Timeline'

const timelineContainer = {
    margin: '25px 0px',
    borderRadius: '5px',
    padding: '20px 40px',
    backgroundColor: 'rgba(92, 184, 92, .08)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)'
}
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
            content: projectName + ' (expected)',
            start: expectedStartDate,
            end: expectedEndDate
        }
        items.push(expected)

        if (actualStartDate && actualEndDate) {
            let actual = {
                id: 2,
                content: projectName + ' (actual)',
                start: actualStartDate,
                end: actualEndDate,
                style: 'background-color: pink'
            }
            items.push(actual)
        }

        return (
            <div>
                <div style={timelineContainer} className='col-md-12'>
                    <div className='col-md-6'>
                        <h3>Expected duration</h3>
                        <h4><b>{expectedStartDate} - {expectedEndDate}</b></h4>
                    </div>
                    {actualStartDate && actualEndDate &&
                        <div className='col-md-6'>
                            <h3>Actual duration</h3>
                            <h4><b>{actualStartDate} - {actualEndDate}</b></h4>
                        </div>
                    }
                    {this.props.project &&
                        <TL items={items} />
                    }
                </div>
            </div>
        )
    }
}
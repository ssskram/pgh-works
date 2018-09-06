
import * as React from 'react'
import TL from 'react-visjs-timeline'

export default class Line extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    public render() {
        const {
            groups,
            items
        } = this.props

        const timelineHeight = items.length * 40 + 90

        const timelineOptions = {
            width: '100%',
            height: timelineHeight + 'px',
            stack: true,
            showMajorLabels: true,
            showCurrentTime: true,
            zoomMin: 1000000,
            format: {
                minorLabels: {
                    minute: 'h:mma',
                    hour: 'ha'
                }
            }
        }

        return (
            <div>
                <TL options={timelineOptions} items={items} groups={groups} />
            </div>
        )
    }
}

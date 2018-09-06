
import * as React from 'react'
import TL from 'react-visjs-timeline'

export default class Line extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            groups: [],
            items: [],
        }
        this.redraw = this.redraw.bind(this)
    }

    componentWillMount() {
        this.redraw()
    }

    componentWillReceiveProps () {
        this.redraw()
    }

    redraw() {
        this.setState ({
            groups: this.props.groups,
            items: this.props.items
        })
    }

    moveWindow() {
        window.scrollTo(0,0)
    }
    public render() {
        const {
            groups,
            items
        } = this.state

        const timelineHeight = items.length * 40 + 90

        const timelineOptions = {
            width: '100%',
            height: timelineHeight + 'px',
            stack: true,
            autoResize: true,
            showMajorLabels: true,
            showCurrentTime: true,
            onUpdate: this.moveWindow(),
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

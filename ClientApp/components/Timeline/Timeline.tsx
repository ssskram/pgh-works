
// core timeline component

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
        let self = this
        this.redraw(this.props)
        // I know, it's crazy
        // but the timeline doesn't like rendering when it's supposed to
        // so I call it up a second time and it always works
        setTimeout(function () {
            self.forceUpdate()
        }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        this.redraw(nextProps)
    }

    redraw(props) {
        this.setState({
            groups: props.groups,
            items: props.items
        })
    }

    public render() {
        const {
            groups,
            items
        } = this.state

        const timelineOptions = {
            width: '100%',
            stack: true,
            autoResize: true,
            showMajorLabels: true,
            showCurrentTime: true,
            zoomMin: 1000000,
            orientation: 'top',
            format: {
                minorLabels: {
                    minute: 'h:mma',
                    hour: 'ha'
                }
            }
        }

        return (
            <div>
                <TL
                    options={timelineOptions}
                    items={items}
                    groups={groups} />
            </div>
        )
    }
}

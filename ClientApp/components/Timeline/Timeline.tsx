
// core timeline component

import * as React from 'react'
import TL from 'react-visjs-timeline'

export default class Line extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            groups: [],
            items: [],
            hidden: false
        }
        this.redraw = this.redraw.bind(this)
    }

    componentWillMount() {
        let self = this
        this.redraw(this.props)
        setTimeout(function () {
            self.forceUpdate()
        }, 10);
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
            items,
            hidden,
        } = this.state

        const timelineOptions = {
            width: '100%',
            stack: true,
            autoResize: true,     
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
                {!hidden &&
                    <TL
                        options={timelineOptions}
                        items={items}
                        groups={groups} />
                }
            </div>
        )
    }
}

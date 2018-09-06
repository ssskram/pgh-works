
import * as React from 'react'
import TL from 'react-visjs-timeline'

export default class Line extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            groups: [],
            items: [],
            hidden: true
        }
        this.redraw = this.redraw.bind(this)
    }

    componentWillMount() {
        let self = this
        this.redraw()
        setTimeout(function () {
            self.setState({
                hidden: false
            })
        }, 10);
    }

    componentWillReceiveProps() {
        this.redraw()
    }

    redraw() {
        this.setState({
            groups: this.props.groups,
            items: this.props.items
        })
    }

    public render() {
        const {
            groups,
            items,
            hidden
        } = this.state

        const timelineHeight = items.length * 40 + 90

        const timelineOptions = {
            width: '100%',
            height: timelineHeight + 'px',
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

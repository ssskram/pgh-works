
import * as React from 'react'
import TL from 'react-visjs-timeline'
import * as moment from 'moment'

export default class Line extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            groups: [],
            items: [],
            hidden: true,
            timelineHeight: 0
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
        }, function (this) {
            this.setTimelineHeight()
        })
    }

    setTimelineHeight() {
        let timelineHeight = 135
        let self = this
        let indexes = [] as any
        this.state.items.forEach(function (date) {
            const start = moment(date.start)
            const end = moment(date.end)
            const isBetween = self.checkRange(start, end, indexes)
            if (isBetween == true) {
                timelineHeight = timelineHeight + 40
                indexes.push(date.id)
            }
        })
        this.setState({
            timelineHeight: timelineHeight
        })
    }

    checkRange(startDate, endDate, indexes) {
        let stacked = false
        this.state.items.forEach(function (check) {
            if (indexes.includes(check.id)) {
                return
            }
            else {
                const startCheck = moment(check.start)
                const endCheck = moment(check.end)
                if (startDate.isBetween(startCheck, endCheck)) {
                    stacked = true
                }
                if (endDate.isBetween(startCheck, endCheck)) {
                    stacked = true
                }
            }
        })
        return stacked
    }

    public render() {
        const {
            groups,
            items,
            hidden,
            timelineHeight
        } = this.state

        const timelineOptions = {
            width: '100%',
            height: timelineHeight + 'px',
            stack: true,
            autoResize: true,
            zoomable: false,            
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

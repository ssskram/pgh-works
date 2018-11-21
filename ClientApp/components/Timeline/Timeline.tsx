
// core timeline component

import * as React from 'react'
import TL from 'react-visjs-timeline'
import Modal from 'react-responsive-modal'

export default class Line extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            groups: [],
            items: [],
            selectedSpan: {},
            selectedActivity: {},
            investigate: false
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

    clickHandler(props) {
        const item = this.state.items.find(it => it.id == props.item)
        if (item) {
            if (item.id > 2) {
                this.setState({ selectedActivity: item, investigate: true })
            }
        }
    }

    public render() {
        const {
            groups,
            items,
            selectedActivity,
            investigate
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
                    groups={groups}
                    clickHandler={this.clickHandler.bind(this)} />
                <Modal
                    open={investigate}
                    onClose={() => this.setState({
                        investigate: false,
                        selectedActivity: {}
                    })}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <div className='col-md-12'>
                        <h3>"{selectedActivity.content}"</h3>
                        <h4>{selectedActivity.start}</h4>
                        {selectedActivity.user &&
                            <h4>{selectedActivity.user}</h4>
                        }
                    </div>
                </Modal>
            </div>

        )
    }
}

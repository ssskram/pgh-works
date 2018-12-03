import * as React from 'react'

export default class Timeline extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>This is the timeline</h3>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>What do I do with it?</b></h4>
                <h5>Are there a handful of projects that overlap in time, but no way to visualize them? Meet the timeline.</h5>
                <h4><b>Can I save the timeline?</b></h4>
                <h5>All projects added to the timeline will disappear when you leave the site, and will need to be re-added on future visits.</h5>
                <h4><b>Can I export the timeline?</b></h4>
                <h5>Try a screen shot.</h5>
            </div>
        </div>
    }
}
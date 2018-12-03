import * as React from 'react'

export default class Timeline extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>This is the timeline</h3>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>What do I do with it?</b></h4>
                <h5>Add projects to see where they overlap in time</h5>
                <h4><b>Can I save the timeline?</b></h4>
                <h5>No.  Different configurations of the timeline cannot be saved for future reference</h5>
                <h4><b>Can I export the timeline?</b></h4>
                <h5>How about a screen shot?</h5>
            </div>
        </div>
    }
}
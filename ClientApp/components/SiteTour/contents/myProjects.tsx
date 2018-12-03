import * as React from 'react'

export default class MyProjects extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>These are your projects</h3>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>What does this mean?</b></h4>
                <h5>You have been identified as either a project member, or a project manager for the projects within this view</h5>
                <h4><b>Does this make me special?</b></h4>
                <h5>Absolutely.  You have full edit privileges for all of the projects here: you can update the status, add phases & milestones, post activity, and so much more</h5>
            </div>
        </div>
    }
}
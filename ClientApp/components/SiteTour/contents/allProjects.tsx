import * as React from 'react'

export default class AllProjectss extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>These are all of the projects</h3>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>Wait...you mean the projects are visible to everyone?</b></h4>
                <h5>That's right.  Welcome to the golden age of transparency.</h5>
                <h4><b>Can anybody edit a project?</b></h4>
                <h5>Nope.  Only project members and project managers have edit priveleges</h5>
                <h4><b>How do I find what I'm looking for?</b></h4>
                <h5>You can filter by project name, status, department, manager, and time span.</h5>
            </div>
        </div>
    }
}
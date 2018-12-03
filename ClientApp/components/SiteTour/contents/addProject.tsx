import * as React from 'react'

export default class AddProject extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>And this is where it all begins</h3>
            <h4><i>Projects have many parts.  These are the basics.</i></h4>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>A place</b></h4>
                <h5>You can import the location from an existing asset, or draw the location on a map.</h5>
                <h4><b>A name</b></h4>
                <h5>Choose carefully: this can't be changed once the project is created</h5>
                <h4><b>A status</b></h4>
                <h5>Programming, Design, Construction, or Complete</h5>
                <h4><b>A department</b></h4>
                <h5>Only one per project</h5>
                <h4><b>A manager</b></h4>
                <h5>Only one per project</h5>
                <h4><b>An anticipated time span</b></h4>
                <h5>Choose carefully: this can't be changed once the project is created</h5>
            </div>
        </div>
    }
}
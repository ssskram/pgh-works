import * as React from 'react'

export default class AllActivity extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>These are the goings-on</h3>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>What kind of activity?</b></h4>
                <h5>Any updates, gripes, developments, or musings deemed relevant to the project, in 280 characters or less</h5>
                <h4><b>Who adds activity?</b></h4>
                <h5>Project members and project managers</h5>
                <h4><b>Who can see the activity?</b></h4>
                <h5>Everyone</h5>
            </div>
            <br/>
            <h4><i>It's like Twitter...but for work</i></h4>
        </div>
    }
}
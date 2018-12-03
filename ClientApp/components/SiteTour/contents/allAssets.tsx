import * as React from 'react'

export default class AllAssets extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>These are City assets</h3>
            <h5><i>Born of, and modified by your projects</i></h5>
            <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h4><b>What kind of assets?</b></h4>
                <h5>Facilities, steps, retaining walls, pools, spray parks, playgrounds, intersections, bridges, courts, ball fields, streets, parks, and projects</h5>
                <h4><b>What are they doing here?</b></h4>
                <h5>When a new project is created, all of the assets within the geographical bounds of the project are tagged as related to that project</h5>
                <h4><b>What for?</b></h4>
                <h5>So the next time that work needs done on an asset, you won't have to go find the oldest, wisest civil servant around for information on when that work may have been performed last.  It'll all be here. </h5>
            </div>
        </div>
    }
}
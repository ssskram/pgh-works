
// Module to draw a new shape

import * as React from 'react'
import Map from '../../Maps/NewPolygon'

export default class NewShape extends React.Component<any, any> {

    public render() {

        return (
            <div>
                <h3 className='text-center'>Use the polygon tool to outline the location</h3>
                <hr/>
                <Map passShape={this.props.passShape}/>
            </div>
        )
    }
}
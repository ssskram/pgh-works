
import * as React from 'react'
import Map from '../../Map/NewPolygon'

export default class NewShape extends React.Component<any, any> {

    public render() {

        return (
            <div className='text-center'>
                <h3>Use the polygon tool to draw your projects location</h3>
                <Map passShape={this.props.passShape}/>
            </div>
        )
    }
}
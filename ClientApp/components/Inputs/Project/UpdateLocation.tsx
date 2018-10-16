
// module to update the location of an existing project

import * as React from 'react'
import Import from '../Shapes/ImportShape'
import New from '../Shapes/NewShape'

const newShapeImg = require('./../../../images/importShape.png')
const polygonImg = require('./../../../images/polygon.png')

const imgSize = {
    height: '70px'
}

const minWidth = {
    minWidth: '250px'
}

export default class UpdateLocation extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            shapeType: ''
        }
    }

    importShape() {
        this.setState({
            shapeType: 'import',
        })
    }

    newShape() {
        this.setState({
            shapeType: 'new',
        })
    }

    setShape(shape) {
        this.props.setShape(shape)
    }

    public render() {
        const {
            shapeType
        } = this.state

        return (
            <div>
                <br />
                {shapeType == '' &&
                    <div>
                        <h3 className='text-center'>Change the location</h3>
                        <hr />
                        <div className='text-center' style={minWidth}>
                            <div className='row'>
                                <button onClick={this.newShape.bind(this)} title='Draw a new shape' className='btn btn-primary btn-big'>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <img style={imgSize} src={polygonImg as string} />
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className='row'>
                                <button onClick={this.importShape.bind(this)} title='Import from existing asset' className='btn btn-primary btn-big'>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <img style={imgSize} src={newShapeImg as string} />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                {shapeType == 'new' &&
                    <New passShape={this.setShape.bind(this)} />
                }
                {shapeType == 'import' &&
                    <Import passShape={this.setShape.bind(this)} />
                }
            </div>
        )
    }
}

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Import from '../ProjectDefinition/Geolocate/ImportShape'
import New from '../ProjectDefinition/Geolocate/NewShape'

const imgSize = {
    height: '70px'
}

const minWidth = {
    minWidth: '250px'
}

export class UpdateLocation extends React.Component<any, any> {
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
        this.props.put()
    }

    public render() {
        const {
            shapeType
        } = this.state

        return (
            <div>
                <br />
                {shapeType == '' &&
                    <div className='text-center' style={minWidth}>
                        <div className='row'>
                            <button onClick={this.newShape.bind(this)} className='btn btn-primary btn-big'>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <img style={imgSize} src='./images/polygon.png' />
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div className='row'>
                            <button onClick={this.importShape.bind(this)} className='btn btn-primary btn-big'>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <img style={imgSize} src='./images/importShape.png' />
                                    </div>
                                </div>
                            </button>
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

export default connect(
    (state: ApplicationState) => ({
    }),
    ({
    })
)(UpdateLocation as any) as typeof UpdateLocation
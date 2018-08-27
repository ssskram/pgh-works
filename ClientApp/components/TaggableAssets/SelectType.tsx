
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'

export class SelectAssetType extends React.Component<any, any> {
    constructor() {
        super()
    }

    componentDidMount() {
        console.log(this.props)
    }

    passType (type) {
        this.props.receiveType(type)
    }

    public render() {
        return (
            <div>
                <h3>Select asset type</h3>
                <hr />
                <div className='row col-md-12'>
                    <button onClick={() => this.passType('Facility')} className='btn btn-secondary'>Facility</button>
                    <button onClick={() => this.passType('Project')} className='btn btn-secondary'>Project</button>
                    <button onClick={() => this.passType('Steps')} className='btn btn-secondary'>Steps</button>
                    <button onClick={() => this.passType('Retaining Wall')} className='btn btn-secondary'>Retaining Wall</button>
                    <button onClick={() => this.passType('Pool')} className='btn btn-secondary'>Pool</button>
                    <button onClick={() => this.passType('Playground')} className='btn btn-secondary'>Playground</button>
                    <button onClick={() => this.passType('Park')} className='btn btn-secondary'>Park</button>
                    <button onClick={() => this.passType('Intersection')} className='btn btn-secondary'>Intersection</button>
                    <button onClick={() => this.passType('Bridge')} className='btn btn-secondary'>Bridge</button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets
    }),
    ({
        ...Assets.actionCreators
    })
)(SelectAssetType as any) as typeof SelectAssetType
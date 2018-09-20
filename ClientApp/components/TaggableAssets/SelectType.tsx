
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import Spinner from '../Utilities/Spinner'

export class SelectAssetType extends React.Component<any, any> {
    constructor() {
        super()
    }
    
    passType(type) {
        this.props.receiveType(type)
    }

    public render() {
        const {
            parentComponent
        } = this.props

        return (
            <div>
                {this.props.assets.length == 0 &&
                    <Spinner notice='...loading assets...' />
                }
                <h3>Select asset type</h3>
                <hr />
                <div className='row col-md-12'>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Facility')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/facilities.png' /></span><br />
                            Facility
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Project')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/projects.png' /></span><br />
                            Project
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Steps')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/steps.png' /></span><br />
                            Steps
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Retaining Wall')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/wall.png' /></span><br />
                            Retaining Wall
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Pool')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/pools.png' /></span><br />
                            Pool
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Playground')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/playground.png' /></span><br />
                            Playground
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Intersection')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/signal.png' /></span><br />
                            Intersection
                        `</button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Bridge')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/bridges.png' /></span><br />
                            Bridge
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Court')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/courts.png' /></span><br />
                            Court
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Playing Field')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/baseball.png' /></span><br />
                            Playing Field
                        </button>
                    </div>
                    {parentComponent == 'asset' &&
                        <div className='col-md-4 text-center'>
                            <button onClick={() => this.passType('Street')} className='btn btn-assetType'>
                                <span><img src='./images/assetTypes/street.png' /></span><br />
                                Street Segment
                        </button>
                        </div>
                    }
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Park')} className='btn btn-assetType'>
                            <span><img src='./images/assetTypes/parks.png' /></span><br />
                            Park
                        </button>
                    </div>
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
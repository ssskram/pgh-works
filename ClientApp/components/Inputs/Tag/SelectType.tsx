

// when user is importing shape or tagging an existing asset, 
// directed here first to select asset type
// then, all corresponding assets render on map

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Assets from '../../../store/GETS/taggableAssets'
import Spinner from '../../Utilities/Spinner'
import getIcon from '../../../functions/getAssetIcon'

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
                            <span><img src={getIcon('Facility')} /></span><br />
                            Facility
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Project')} className='btn btn-assetType'>
                            <span><img src={getIcon('Project')} /></span><br />
                            Project
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Steps')} className='btn btn-assetType'>
                            <span><img src={getIcon('Steps')} /></span><br />
                            Steps
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Retaining Wall')} className='btn btn-assetType'>
                            <span><img src={getIcon('Retaining Wall')} /></span><br />
                            Retaining Wall
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Pool')} className='btn btn-assetType'>
                            <span><img src={getIcon('Pool')} /></span><br />
                            Pool/Spray Park
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Playground')} className='btn btn-assetType'>
                            <span><img src={getIcon('Playground')} /></span><br />
                            Playground
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Intersection')} className='btn btn-assetType'>
                            <span><img src={getIcon('Intersection')} /></span><br />
                            Intersection
                        `</button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Bridge')} className='btn btn-assetType'>
                            <span><img src={getIcon('Bridge')} /></span><br />
                            Bridge
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Court')} className='btn btn-assetType'>
                            <span><img src={getIcon('Court')} /></span><br />
                            Court
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Playing Field')} className='btn btn-assetType'>
                            <span><img src={getIcon('Playing Field')} /></span><br />
                            Playing Field
                        </button>
                    </div>
                    {parentComponent == 'asset' &&
                        <div className='col-md-4 text-center'>
                            <button onClick={() => this.passType('Street')} className='btn btn-assetType'>
                                <span><img src={getIcon('Street')} /></span><br />
                                Street Segment
                        </button>
                        </div>
                    }
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.passType('Park')} className='btn btn-assetType'>
                            <span><img src={getIcon('Park')} /></span><br />
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
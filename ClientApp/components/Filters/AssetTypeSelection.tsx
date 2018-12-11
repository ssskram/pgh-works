
import * as React from 'react'
import getIcon from '../../functions/getAssetIcon'

export default class SelectAssetType extends React.Component<any, any> {
    
    public render() {
        const {
            receiveType
        } = this.props

        return (
            <div>
                <h3>Select asset type</h3>
                <hr />
                <div className='row col-md-12'>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Facility')} className='btn btn-assetType'>
                            <span><img src={getIcon('Facility')} /></span><br />
                            Facility
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Project')} className='btn btn-assetType'>
                            <span><img src={getIcon('Project')} /></span><br />
                            Project
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Steps')} className='btn btn-assetType'>
                            <span><img src={getIcon('Steps')} /></span><br />
                            Steps
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Retaining Wall')} className='btn btn-assetType'>
                            <span><img src={getIcon('Retaining Wall')} /></span><br />
                            Retaining Wall
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Pool')} className='btn btn-assetType'>
                            <span><img src={getIcon('Pool')} /></span><br />
                            Pool/Spray Park
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Playground')} className='btn btn-assetType'>
                            <span><img src={getIcon('Playground')} /></span><br />
                            Playground
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Intersection')} className='btn btn-assetType'>
                            <span><img src={getIcon('Intersection')} /></span><br />
                            Intersection
                        `</button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Bridge')} className='btn btn-assetType'>
                            <span><img src={getIcon('Bridge')} /></span><br />
                            Bridge
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Court')} className='btn btn-assetType'>
                            <span><img src={getIcon('Court')} /></span><br />
                            Court
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Playing Field')} className='btn btn-assetType'>
                            <span><img src={getIcon('Playing Field')} /></span><br />
                            Playing Field
                        </button>
                    </div>
                        <div className='col-md-4 text-center'>
                            <button onClick={() => receiveType('Street')} className='btn btn-assetType'>
                                <span><img src={getIcon('Street')} /></span><br />
                                Street
                        </button>
                        </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => receiveType('Park')} className='btn btn-assetType'>
                            <span><img src={getIcon('Park')} /></span><br />
                            Park
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

// when user is drawing a new shape for a new project, 
// before project is created they are directed here
// to select which assets are relevant to the project.
// the array of relevant types is passed on
// for new tag generation

import * as React from 'react'
import returnAssetIcon from './../../../functions/getAssetIcon';

const clicked = {
    boxShadow: '0px 0px 20px #383838',
    borderRadius: '5px'
}

const unclicked = {
    boxShadow: '0px 0px 0px #383838'
}

export default class TaggableAssetSelection extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            selectedTypes: []
        }
    }

    addRemoveType(type) {
        if (!this.state.selectedTypes.includes(type)) {
            this.setState({
                selectedTypes: [...this.state.selectedTypes, type]
            })
        } else {
            let filteredArray = this.state.selectedTypes.filter(item => {
                return item != type 
            })
            this.setState({
                selectedTypes: filteredArray
            })
        }
    }

    passTypes() {
        this.props.receiveTypes(this.state.selectedTypes)
    }

    public render() {
        const {
            selectedTypes
        } = this.state

        return (
            <div>
                <h3>Which assets matter?</h3>
                <h5><i>Relevant assets within the project bounds will be tagged</i></h5>
                <hr />
                <div className='row col-md-12'>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Facility')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Facility')) ? clicked : unclicked} src={returnAssetIcon('Facility')} /></span><br />
                            Facilities
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Project')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Project')) ? clicked : unclicked} src={returnAssetIcon('Project')} /></span><br />
                            Projects
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Steps')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Steps')) ? clicked : unclicked} src={returnAssetIcon('Steps')} /></span><br />
                            Steps
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Retaining Wall')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Retaining Wall')) ? clicked : unclicked} src={returnAssetIcon('Retaining Wall')} /></span><br />
                            Retaining Walls
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Pool')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Pool')) ? clicked : unclicked} src={returnAssetIcon('Pool')} /></span><br />
                            Pools & Spray Parks
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Playground')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Playground')) ? clicked : unclicked} src={returnAssetIcon('Playground')} /></span><br />
                            Playgrounds
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Intersection')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Intersection')) ? clicked : unclicked} src={returnAssetIcon('Intersection')} /></span><br />
                            Intersections
                        `</button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Bridge')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Bridge')) ? clicked : unclicked} src={returnAssetIcon('Bridge')} /></span><br />
                            Bridges
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Court')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Court')) ? clicked : unclicked} src={returnAssetIcon('Court')} /></span><br />
                            Courts
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Playing Field')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Playing Field')) ? clicked : unclicked} src={returnAssetIcon('Playing Field')} /></span><br />
                            Playing Fields
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Street')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Street')) ? clicked : unclicked} src={returnAssetIcon('Street')} /></span><br />
                            Streets
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Park')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Park')) ? clicked : unclicked} src={returnAssetIcon('Park')} /></span><br />
                            Parks
                        </button>
                    </div>
                    <div className='col-md-12 text-center'>
                        <button className='btn btn-success' onClick={this.passTypes.bind(this)}>Continue</button>
                    </div>
                </div>
            </div>
        )
    }
}
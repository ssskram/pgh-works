import * as React from 'react'

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
                <h3 className='text-center'>Which assets within the project bounds should be tagged by this project?</h3>
                <hr />
                <div className='row col-md-12'>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Facility')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Facility')) ? clicked : unclicked} src='./images/assetTypes/facilities.png' /></span><br />
                            Facilities
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Project')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Project')) ? clicked : unclicked} src='./images/assetTypes/projects.png' /></span><br />
                            Projects
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Steps')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Steps')) ? clicked : unclicked} src='./images/assetTypes/steps.png' /></span><br />
                            Steps
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Retaining Wall')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Retaining Wall')) ? clicked : unclicked} src='./images/assetTypes/wall.png' /></span><br />
                            Retaining Walls
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Pool')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Pool')) ? clicked : unclicked} src='./images/assetTypes/pools.png' /></span><br />
                            Pools
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Playground')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Playground')) ? clicked : unclicked} src='./images/assetTypes/playground.png' /></span><br />
                            Playgrounds
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Intersection')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Intersection')) ? clicked : unclicked} src='./images/assetTypes/signal.png' /></span><br />
                            Intersections
                        `</button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Bridge')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Bridge')) ? clicked : unclicked} src='./images/assetTypes/bridges.png' /></span><br />
                            Bridges
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Court')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Court')) ? clicked : unclicked} src='./images/assetTypes/courts.png' /></span><br />
                            Courts
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Playing Field')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Playing Field')) ? clicked : unclicked} src='./images/assetTypes/baseball.png' /></span><br />
                            Playing Fields
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Street')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Street')) ? clicked : unclicked} src='./images/assetTypes/street.png' /></span><br />
                            Streets
                        </button>
                    </div>
                    <div className='col-md-4 text-center'>
                        <button onClick={() => this.addRemoveType('Park')} className='btn btn-assetType'>
                            <span><img style={(selectedTypes.includes('Park')) ? clicked : unclicked} src='./images/assetTypes/parks.png' /></span><br />
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
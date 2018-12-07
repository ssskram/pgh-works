import * as React from 'react'
import { connect } from 'react-redux';

const consolidate = require('../../../images/consolidate.png')
const timeline = require('../../../images/timelineDark.png')
const report = require('../../../images/reportProgress.png')
const connections = require('../../../images/connections.png')

const imgSize = {
    height: '50px',
    margin: '10px 150px 10px 25px !important',
    marginBottom: '-60px'
}

export default class MainApp extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>Welcome to PGH Works</h3>
            <br />
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                <div className='row text-center'>
                    <div className='col-md-2'>
                        <img style={imgSize} src={consolidate as string} />
                    </div>
                    <div className='col-md-10'>
                        <h4><b>Consolidate project data</b></h4>
                        <h5>A single source of truth for high level project details & records</h5>
                    </div>
                </div>
                <div className='row text-center'>
                    <div className='col-md-2'>
                        <img style={imgSize} src={timeline as string} />
                    </div>
                    <div className='col-md-10'>
                        <h4><b>Visualize in time</b></h4>
                        <h5>See where, when, and how work overlaps in time</h5>
                    </div>
                </div>
                <div className='row text-center'>
                    <div className='col-md-2'>
                        <img style={imgSize} src={connections as string} />
                    </div>
                    <div className='col-md-10'>
                        <h4><b>Establish connections</b></h4>
                        <h5>Define and explore the history of work upon City assets</h5>
                    </div>
                </div>
                <div className='row text-center'>
                    <div className='col-md-2'>
                    <img style={imgSize} src={report as string} />
                    </div>
                    <div className='col-md-10'>
                        <h4><b>Report up, painlessly</b></h4>
                        <h5>Because really...what can't be communicated in 280 characters or less?</h5>
                    </div>
                </div>
            </div>
        </div>
    }
}
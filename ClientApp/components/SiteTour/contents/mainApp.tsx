import * as React from 'react'

const consolidate = require('../../../images/consolidate.png')
const timeline = require('../../../images/timelineDark.png')
const report = require('../../../images/reportProgress.png')
const connections = require('../../../images/connections.png')

const imgSize = {
    height: '50px',
    margin: '10px 25px'
}

export default class MainApp extends React.Component<any, any> {

    public render() {
        return <div>
            <h3>Welcome to PGH Works</h3>
            <br />
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                <h4><img style={imgSize} src={consolidate as string} />Consolidate project data</h4>
                <h4><img style={imgSize} src={timeline as string} />Visualize overlap</h4>
                <h4><img style={imgSize} src={connections as string} />Create connections</h4>
                <h4><img style={imgSize} src={report as string} />Report on progress</h4>
            </div>
        </div>
    }
}
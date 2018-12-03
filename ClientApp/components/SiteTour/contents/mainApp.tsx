import * as React from 'react'

const organize = require('../../../images/organizeWork.png')
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
            <br/>
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
                <h4><img style={imgSize} src={organize as string} />Organize your work</h4>
                <h4><img style={imgSize} src={timeline as string} />Plan ahead</h4>
                <h4><img style={imgSize} src={report as string} />Report on progress</h4>
                <h4><img style={imgSize} src={connections as string} />Create connections</h4>
            </div>
        </div>
    }
}

// chat rooooom

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Activity from '../../../store/activity'

const activityContainer = {
    width: '100%',
    backgroundColor: '#383838',
    borderRadius: '5px',
    padding: '5px',
    maxHeight: '400px',
    margin: '0 auto',
    overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden'
}

const activityItem = {
    backgroundColor: '#fff',
    padding: '5px 8px',
    margin: '8px',
    borderRadius: '5px',
    textAlign: 'right' as 'right'
}

const smallFont = {
    fontSize: '.8em'
}

export class ActivityFeed extends React.Component<any, any> {
    constructor(props) {
        super(props)
    }

    public render() {

        return (
            <div style={activityContainer} className='col-md-12 row chatContainer'>
                {this.props.activity.reverse().map((item, index) => {
                    return (
                        <div className='col-md-12'>
                            <div key={index} style={activityItem} className='pull-right speech-bubble'>
                                <b>{item.activity}</b><br />
                                <span style={smallFont}>{item.user}</span><br />
                                <span style={smallFont}>{item.date}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.activity
    }),
    ({
        ...Activity.actionCreators,
    })
)(ActivityFeed as any) as typeof ActivityFeed

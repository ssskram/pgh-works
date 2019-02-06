
// chat rooooom

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Activity from '../../../store/activity'
import * as User from '../../../store/GETS/user'
import * as Personnel from '../../../store/GETS/personnel'
import { animateScroll } from "react-scroll"
import { subscribeToActivity } from '../../../sockets/activity'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'

const talkBubble = require('../../../images/talkBubble.png')

const iconStyle = {
    marginRight: '10px',
    marginTop: '-8px',
    height: '40px'
}

const activityContainer = {
    width: '100%',
    backgroundColor: '#383838',
    padding: '5px',
    maxHeight: '400px',
    margin: '0 auto',
    overflowY: 'scroll' as 'scroll',
    overflowX: 'hidden' as 'hidden'
}

const otherActivity = {
    backgroundColor: '#DAECFB',
    padding: '5px 8px',
    borderRadius: '5px',
    textAlign: 'right' as 'right'
}

const myActivity = {
    backgroundColor: '#3473A8',
    color: '#fff',
    padding: '5px 8px',
    borderRadius: '5px',
    textAlign: 'left' as 'left'
}

const smallFont = {
    fontSize: '.8em'
}

export class ActivityFeed extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            activityID: '',
            parentID: '',
            parentType: 'Project',
            user: '',
            date: '',
            activity: ''
        }
        subscribeToActivity((err, activity) => this.props.receiveActivity(activity))
    }

    componentDidMount() {
        this.scrollDown()
        const guid: string = uuid()
        this.setState({
            parentID: this.props.projectID,
            activityID: guid,
        })
    }

    componentWillReceiveProps(nextProps) {
        this.scrollDown()
        if (nextProps.personnel.length > 0 && nextProps.user) {
            const user = nextProps.personnel.find(person => person.email == nextProps.user)
            this.setState({
                user: user.title
            })
        }
    }

    componentDidUpdate() {
        this.scrollDown()
    }


    scrollDown() {
        animateScroll.scrollToBottom({
            containerId: "scrollTo"
        })
    }

    post() {
        this.setState({
            date: moment().format('MM/DD/YYYY, hh:mm:ss A')
        }, () => {
            this.props.addActivity(this.state)
            this.setState({ activity: '' })
        })
    }

    keyPress(e) {
        if (e.keyCode == 13) {
            if (this.state.activity != '') {
                this.post()
            }
        }
    }

    public render() {

        const user = this.props.personnel.find(person => person.email == this.props.user)
        const isEnabled = this.state.activity != ''

        // TODO filter activity
        return (
            <div className='row'>
                <h2>
                    <img style={iconStyle} src={talkBubble as string} />
                    Activity
                        </h2>
                <hr />
                <div style={activityContainer} id='scrollTo'>
                    {user && this.props.activity.sort((a, b) => +new Date(a.date) - +new Date(b.date)).map((item, index) => {
                        if (user.title != item.user) {
                            return (
                                <div key={index} className='col-md-12' style={{ margin: '8px' }}>
                                    <div className='col-md-12'>
                                        <div style={otherActivity} className='speech-bubble-right pull-right'>
                                            <b>{item.activity}</b><br />
                                            <span style={smallFont}>{item.user}</span><br />
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div className='pull-right'>
                                            <span style={{ fontSize: '.7em', color: '#fff' }}>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className='col-md-12' style={{ margin: '8px' }}>
                                    <div className='col-md-12'>
                                        <div style={myActivity} className='speech-bubble-left pull-left'>
                                            <b>{item.activity}</b><br />
                                            <span style={smallFont}>{item.user}</span><br />
                                        </div>
                                    </div>
                                    <div className='col-md-12'>
                                        <div className='pull-left'>
                                            <span style={{ fontSize: '.7em', color: '#fff' }}>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                <div>
                    <input value={this.state.activity} onKeyDown={this.keyPress.bind(this)} onChange={e => this.setState({ activity: e.target.value })} className='chatInput' placeholder='New mesage'></input>
                    <button disabled={!isEnabled} className='chatButton btn' onClick={this.post.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.activity,
        ...state.user,
        ...state.personnel
    }),
    ({
        ...Activity.actionCreators,
        ...User.actionCreators,
        ...Personnel.actionCreators
    })
)(ActivityFeed as any) as typeof ActivityFeed


// new milestone generation

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Activity from '../../../store/activity'
import * as User from '../../../store/GETS/user'
import * as Personnel from '../../../store/GETS/personnel'
import Textarea from '../../FormElements/textarea'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'
import hashtagIt from '../../../functions/hashtagIt'

export class ActivityInput extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            activityID: '',
            parentID: '',
            parentType: 'Project',
            user: '',
            date: '',
            activity: ''
        }
    }

    componentDidMount() {
        // new milestone
        const guid: string = uuid()
        const user = this.props.personnel.find(person => person.email == this.props.user)
        this.setState({
            parentID: this.props.projectID,
            activityID: guid,
            user: user.title,
            date: moment().format('MM/DD/YYYY, hh:mm A')
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    post() {
        this.props.addActivity(this.state)
        this.props.closeModal()
    }

    public render() {
        const {
            activity
        } = this.state

        // validation
        const isEnabled =
            activity != ''

        return (
            <div>
                <div className='col-md-12'>
                    <Textarea
                        value={activity}
                        required={true}
                        name="activity"
                        header="What's happening?"
                        placeholder=""
                        callback={this.handleChildChange.bind(this)}
                        maxLength={180}
                    />
                </div>

                <div className='row'>
                    <div className='col-md-12 text-center'>
                        <b>#{hashtagIt(this.props.projectName)}</b>
                        <div>
                            <button disabled={!isEnabled} className='btn btn-success' onClick={this.post.bind(this)}><b>Save</b></button>
                        </div>
                    </div>
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
        ...User.actionCreators,
        ...Activity.actionCreators,
        ...Personnel.actionCreators
    })
)(ActivityInput as any) as typeof ActivityInput
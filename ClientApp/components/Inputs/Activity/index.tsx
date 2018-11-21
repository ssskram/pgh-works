
// new milestone generation

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Activity from '../../../store/activity'
import * as User from '../../../store/GETS/user'
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
        this.setState({
            parentID: this.props.projectID,
            activityID: guid
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleDate(date) {
        if (date) {
            this.setState({
                dueDate: moment(date).format('MM/DD/YYYY')
            })
        } else {
            this.setState({
                dueDate: null
            })
        }
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
                        header="What's happenin?"
                        placeholder=""
                        callback={this.handleChildChange.bind(this)}
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
        ...state.user
    }),
    ({
        ...User.actionCreators,
        ...Activity.actionCreators
    })
)(ActivityInput as any) as typeof ActivityInput
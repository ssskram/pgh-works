
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Milestones from '../../store/milestones'
import * as User from '../../store/GETS/user'
import Input from '../FormElements/input'
import Datepicker from '../FormElements/datepicker'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'

export class MilestoneInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projectID: '',
            phaseID: '',
            milestoneID: '',
            cartegraphID: '',
            milestoneName: '',
            percentComplete: 0,
            dueDate: '',
            dateCompleted: '',
            created: '',
        }
    }
    componentDidMount() {
        // new milestone
        const guid: string = uuid()
        this.setState({
            projectID: this.props.projectID,
            phaseID: this.props.phaseID,
            milestoneID: guid,
            created: moment().format('MM/DD/YYYY')
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleDueDate(date) {
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
        if (this.props.milestoneID) {
            // update
            this.props.updateMilestone(this.state)
            this.props.closeModal()
        } else {
            // new
            this.props.addMilestone(this.state)
            this.props.closeModal()
        }
    }

    public render() {
        const {
            milestoneName,
            dueDate,
        } = this.state

        // validation
        const isEnabled =
            milestoneName != '' &&
            dueDate != ''

        return (
            <div>
                <h3>New milestone</h3>
                <hr/>
                <div className='col-md-12'>
                    <Input
                        value={milestoneName}
                        required={true}
                        name="milestoneName"
                        header="Milestone name"
                        placeholder="Enter a name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Datepicker
                        value={dueDate}
                        name="dueDate"
                        required={true}
                        header="Due date"
                        placeholder="Select a date"
                        callback={this.handleDueDate.bind(this)}
                    />
                </div>

                <div className='row'>
                    <div className='col-md-12 text-center'>
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
        ...state.milestones,
        ...state.user
    }),
    ({
        ...User.actionCreators,
        ...Milestones.actionCreators
    })
)(MilestoneInputs as any) as typeof MilestoneInputs
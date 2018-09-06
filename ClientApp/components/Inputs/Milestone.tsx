
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Milestones from '../../store/milestones'
import * as User from '../../store/GETS/user'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import Percent from '../FormElements/numbers'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'
import Progress from 'react-progressbar'

const sliderContainer = {
    padding: '0px 15px'
}

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'milestoneStatus' },
    { value: 'Mobilizing', label: 'Mobilizing', name: 'milestoneStatus' },
    { value: 'Complete', label: 'Complete', name: 'milestoneStatus' }
]

export class MilestoneInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projectID: '',
            phaseID: '',
            milestoneID: '',
            cartegraphID: '',
            milestoneName: '',
            dueDate: '',
            milestoneDescription: '',
            created: '',
            createdBy: '',
        }
    }
    componentDidMount() {
        if (this.props.milestoneID) {
            // update milestone
            let milestoneID = this.props.milestoneID
            let milestone = this.props.milestones.find(function (item) {
                return item.milestoneID == milestoneID
            })
            this.setState({
                projectID: milestone.projectID,
                phaseID: milestone.phaseID,
                milestoneID: milestone.milestoneID,
                cartegraphID: milestone.cartegraphID,
                milestoneName: milestone.milestoneName,
                dueDate: milestone.dueDate,
                milestoneDescription: milestone.milestoneDescription,
                milestoneStatus: milestone.milestoneStatus,
                created: milestone.created,
                createdBy: milestone.createdBy
            })
        }
        else {
            // new milestone
            const guid: string = uuid()
            this.setState({
                projectID: this.props.projectID,
                phaseID: this.props.phaseID,
                milestoneID: guid,
                created: moment().format('MM/DD/YYYY'),
                createdBy: this.props.user
            })
        }
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
            milestoneID,
            milestoneName,
            dueDate,
            milestoneDescription,
        } = this.state

        // validation
        const isEnabled =
            milestoneName != '' &&
            dueDate != ''

        return (
            <div>
                <div className='col-md-12'>
                    <Input
                        value={milestoneName}
                        name="milestoneName"
                        header="Milestone name"
                        placeholder="Enter a name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <TextArea
                        value={milestoneDescription}
                        name="milestoneDescription"
                        header="Milestone description"
                        placeholder="Provide a brief explanation of the milestone"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={dueDate}
                        name="endDate"
                        header="End date"
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

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
    constructor(props) {
        super(props)
        this.state = {
            projectID: '',
            phaseID: '',
            milestoneID: '',
            cartegraphID: '',
            milestoneName: '',
            startDate: '',
            endDate: '',
            milestoneDescription: '',
            milestoneStatus: '',
            percentComplete: '',
            notes: '',
            created: '',
            createdBy: '',
            lastModifiedBy: ''
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
                startDate: milestone.startDate,
                endDate: milestone.endDate,
                milestoneDescription: milestone.milestoneDescription,
                milestoneStatus: milestone.milestoneStatus,
                percentComplete: milestone.percentComplete,
                notes: milestone.notes,
                created: milestone.created,
                createdBy: milestone.createdBy,
                lastModifiedBy: this.props.user,
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
                createdBy: this.props.user,
                lastModifiedBy: this.props.user
            })
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleStartDate(date) {
        if (date) {
            this.setState({
                startDate: moment(date).format('MM/DD/YYYY')
            })
        } else {
            this.setState({
                startDate: null
            })
        }
    }

    handleEndDate(date) {
        if (date) {
            this.setState({
                endDate: moment(date).format('MM/DD/YYYY')
            })
        } else {
            this.setState({
                endDate: null
            })
        }
    }

    handleStatusMulti(value) {
        this.setState({ milestoneStatus: value });
    }

    handlePercent(event, maskedvalue, floatvalue) {
        let value = 0
        if (floatvalue > 100) {
            value = 100
        } else {
            value = floatvalue
        }
        this.setState({ percentComplete: value })
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
            startDate,
            endDate,
            milestoneDescription,
            milestoneStatus,
            percentComplete,
            notes,
        } = this.state

        // validation
        const isEnabled =
            milestoneName != '' &&
            startDate != '' &&
            endDate != '' &&
            milestoneStatus != ''

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
                    <TextArea
                        value={notes}
                        name="notes"
                        header="Notes"
                        placeholder="Enter any other relevant information"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={milestoneStatus}
                        name="milestoneStatus"
                        header='Milestone status'
                        placeholder='Select statuses'
                        onChange={this.handleStatusMulti.bind(this)}
                        multi={true}
                        options={statuses}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={startDate}
                        name="startDate"
                        header="Start date"
                        placeholder="Select a date"
                        callback={this.handleStartDate.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={endDate}
                        name="endDate"
                        header="End date"
                        placeholder="Select a date"
                        callback={this.handleEndDate.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Percent
                        value={percentComplete}
                        name="percentComplete"
                        header="Percent complete"
                        placeholder="Enter a number"
                        prefix="% "
                        callback={this.handlePercent.bind(this)}
                    />
                </div>
                {percentComplete > 0 &&
                    <div style={sliderContainer}>
                        <div className='col-md-12'>
                            <Progress completed={percentComplete} color='#337ab7' />
                            <br />
                        </div>
                    </div>
                }

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
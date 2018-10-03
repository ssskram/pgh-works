
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Subphases from '../../store/subphases'
import * as User from '../../store/GETS/user'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import Percent from '../FormElements/numbers'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'subphaseStatus' },
    { value: 'On hold', label: 'On hold', name: 'subphaseStatus' },
    { value: 'Complete', label: 'Complete', name: 'subphaseStatus' }
]

export class SubphaseInput extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projectID: '',
            phaseID: '',
            subphaseID: '',
            cartegraphID: '',
            subphaseName: '',
            startDate: '',
            endDate: '',
            subphaseDescription: '',
            subphaseStatus: '',
            percentComplete: 0,
            notes: ''
        }
    }
    componentDidMount() {
        if (this.props.subphaseID) {
            // update subphase
            let subphaseID = this.props.subphaseID
            let subphase = this.props.subphases.find(function (item) {
                return item.subphaseID == subphaseID
            })
            this.setState({
                projectID: subphase.projectID,
                phaseID: subphase.phaseID,
                subphaseID: subphase.subphaseID,
                cartegraphID: subphase.cartegraphID,
                subphaseName: subphase.subphaseName,
                startDate: subphase.startDate,
                endDate: subphase.endDate,
                subphaseDescription: subphase.subphaseDescription,
                subphaseStatus: subphase.subphaseStatus,
                percentComplete: subphase.percentComplete,
                notes: subphase.notes
            })
        }
        else {
            // new subphase
            const guid: string = uuid()
            this.setState({
                projectID: this.props.projectID,
                phaseID: this.props.phaseID,
                subphaseID: guid
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

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
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
        if (this.props.subphaseID) {
            // update
            this.props.updateSubphase(this.state)
            this.props.closeModal()
        } else {
            // new
            this.props.addSubphase(this.state)
            this.props.closeModal()
        }
    }

    public render() {
        const {
            subphaseName,
            startDate,
            endDate,
            subphaseDescription,
            subphaseStatus,
            percentComplete,
            notes,
        } = this.state

        const {
            canEdit
        } = this.props

        // validation
        const isEnabled =
            subphaseName != '' &&
            startDate != '' &&
            endDate != '' &&
            subphaseStatus != ''

        return (
            <div>
                <h3>Subphase</h3>
                <hr />
                {canEdit == true &&
                    <div>
                        <div className='col-md-12'>
                            <Input
                                value={subphaseName}
                                name="subphaseName"
                                header="Subphase name"
                                required={true}
                                placeholder="Enter a name"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-6'>
                            <TextArea
                                value={subphaseDescription}
                                name="subphaseDescription"
                                header="Subphase description"
                                placeholder="Provide a brief explanation of the subphase"
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
                                value={subphaseStatus}
                                name="subphaseStatus"
                                header='Subphase status'
                                required={true}
                                placeholder='Select statuses'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={statuses}
                            />
                        </div>

                        <div className='col-md-6'>
                            <Datepicker
                                value={startDate}
                                name="startDate"
                                required={true}
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
                                required={true}
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

                        <div className='row'>
                            <div className='col-md-12 text-center'>
                                <div>
                                    <button disabled={!isEnabled} className='btn btn-success' onClick={this.post.bind(this)}><b>Save</b></button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {canEdit != true &&
                    <div className='col-md-12'>
                        <h4><b>Name</b></h4>
                        <h4>{subphaseName}</h4>
                        {subphaseDescription != '' &&
                            <div>
                                <h4><b>Description</b></h4>
                                <h4>{subphaseDescription}</h4>
                            </div>
                        }
                        <h4><b>Status</b></h4>
                        <h4>{subphaseStatus}</h4>
                        <h4><b>Start date</b></h4>
                        <h4>{startDate}</h4>
                        <h4><b>End date</b></h4>
                        <h4>{endDate}</h4>
                        {percentComplete != '' && percentComplete != 0 &&
                            <div>
                                <h4><b>Percent complete</b></h4>
                                <h4>{percentComplete}</h4>
                            </div>
                        }
                        {notes != '' &&
                            <div>
                                <h4><b>Notes</b></h4>
                                <h4>{notes}</h4>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.subphases,
        ...state.user
    }),
    ({
        ...User.actionCreators,
        ...Subphases.actionCreators
    })
)(SubphaseInput as any) as typeof SubphaseInput
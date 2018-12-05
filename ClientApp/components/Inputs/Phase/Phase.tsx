
// phase generation/update form

import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Phases from '../../../store/phases'
import * as User from '../../../store/GETS/user'
import TextArea from '../../FormElements/textarea'
import Select from '../../FormElements/select'
import Datepicker from '../../FormElements/datepicker'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'

const statuses = [
    { value: 'Not started', label: 'Not started', name: 'phaseStatus' },
    { value: 'In progress', label: 'In progress', name: 'phaseStatus' },
    { value: 'On hold', label: 'On hold', name: 'phaseStatus' },
    { value: 'Complete', label: 'Complete', name: 'phaseStatus' }
]

const types = [
    { value: 'Programming', label: 'Programming', name: 'phaseName' },
    { value: 'Design', label: 'Design', name: 'phaseName' },
    { value: 'Construction', label: 'Construction', name: 'phaseName' },
    { value: 'Multi-faceted', label: 'Multi-faceted', name: 'phaseName' }
]

export class PhaseInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            // utilities
            redirect: false,
            throwDateError: false,

            // phase state
            projectID: '',
            phaseID: '',
            cartegraphID: '',
            phaseName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            phaseDescription: '',
            phaseStatus: '',
            notes: ''
        }
        this.handleDate = this.handleDate.bind(this)
    }

    componentDidMount() {
        if (this.props.phaseID) {
            // update phase
            let phaseID = this.props.phaseID
            let phase = this.props.phases.find(function (item) {
                return item.phaseID == phaseID
            })
            this.setState({
                projectID: phase.projectID,
                phaseID: phase.phaseID,
                cartegraphID: phase.cartegraphID,
                phaseName: phase.phaseName,
                expectedStartDate: phase.expectedStartDate,
                expectedEndDate: phase.expectedEndDate,
                actualStartDate: phase.actualStartDate,
                actualEndDate: phase.actualEndDate,
                phaseDescription: phase.phaseDescription,
                phaseStatus: phase.phaseStatus,
                notes: phase.notes
            })
        }
        else {
            // new phase
            const guid: string = uuid()
            this.setState({
                projectID: this.props.projectID,
                phaseID: guid
            })
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleDate(date, name) {
        console.log(date, name)
        if (date) {
            // check for valid span
            let valid = true
            if (name == 'expectedStartDate') {
                if (this.state.expectedEndDate)
                    valid = date.isBefore(this.state.expectedEndDate, 'day')
            }
            if (name == 'expectedEndDate') {
                if (this.state.expectedStartDate)
                    valid = date.isAfter(this.state.expectedStartDate, 'day')
            }
            if (name == 'actualStartDate') {
                if (this.state.actualEndDate)
                    valid = date.isBefore(this.state.actualEndDate, 'day')
            }
            if (name == 'actualEndDate') {
                if (this.state.actualStartDate)
                    valid = date.isAfter(this.state.actualStartDate, 'day')
            }
            if (valid == true) {
                this.setState({
                    [name]: moment(date).format('MM/DD/YYYY'),
                    throwDateError: false
                })
            } else {
                this.setState({ throwDateError: true })
            }
        } else {
            this.setState({
                [name]: null
            })
        }
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    post() {
        if (this.props.phaseID) {
            // update
            this.props.updatePhase(this.state)
            this.props.closeModal()
        } else {
            // new
            this.props.addPhase(this.state)
            this.setState({
                redirect: true
            })
        }
    }

    public render() {
        const {
            redirect,
            throwDateError,
            phaseID,
            phaseName,
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
            phaseDescription,
            phaseStatus,
            notes
        } = this.state

        // validation
        const isEnabled =
            phaseName != '' &&
            expectedStartDate != '' &&
            expectedEndDate != '' &&
            phaseStatus != ''

        const link = "/Phase/id=" + phaseID

        if (redirect) {
            return <Redirect push to={link} />
        }

        return (
            <div>
                <div className='col-md-12'>
                    <Select
                        value={phaseName}
                        name="phaseName"
                        header='Phase name'
                        placeholder='Select phase'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={types}
                    />
                </div>

                <div className='col-md-6'>
                    <TextArea
                        value={phaseDescription}
                        name="phaseDescription"
                        header="Phase description"
                        placeholder="Provide a brief explanation of the phase"
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
                        value={phaseStatus}
                        name="phaseStatus"
                        required={true}
                        header='Phase status'
                        placeholder='Select statuses'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={statuses}
                    />
                </div>
                {throwDateError == true &&
                    <div className='col-md-12'>
                        <div className='alert alert-danger text-center'>
                            <span style={{ fontSize: '1.5em' }}>Please check your dates</span><br />
                            End dates can not come before start dates
                            </div>
                    </div>
                }
                {!this.props.update &&
                    <div>
                        <div className='col-md-6'>
                            <Datepicker
                                value={expectedStartDate}
                                name="expectedStartDate"
                                required={true}
                                header="Expected start date"
                                placeholder="Select a date"
                                callback={(value) => this.handleDate(value, 'expectedStartDate')}
                            />
                        </div>

                        <div className='col-md-6'>
                            <Datepicker
                                value={expectedEndDate}
                                name="expectedEndDate"
                                header="Expected end date"
                                required={true}
                                placeholder="Select a date"
                                callback={(value) => this.handleDate(value, 'expectedEndDate')}
                            />
                        </div>
                    </div>
                }
                <div className='col-md-6'>
                    <Datepicker
                        value={actualStartDate}
                        name="actualStartDate"
                        header="Actual start date"
                        placeholder="Select a date"
                        callback={(value) => this.handleDate(value, 'actualStartDate')}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={actualEndDate}
                        name="actualEndDate"
                        header="Actual end date"
                        placeholder="Select a date"
                        callback={(value) => this.handleDate(value, 'actualEndDate')}
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
        ...state.phases,
        ...state.user
    }),
    ({
        ...User.actionCreators,
        ...Phases.actionCreators
    })
)(PhaseInputs as any) as typeof PhaseInputs
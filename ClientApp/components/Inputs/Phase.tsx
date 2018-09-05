
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Phases from '../../store/phases'
import * as User from '../../store/GETS/user'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import Percent from '../FormElements/numbers'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'
import Progress from 'react-progressbar'
import PhaseFollows from './PhaseFollows'

const sliderContainer = {
    padding: '0px 15px'
}

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'phaseStatus' },
    { value: 'Mobilizing', label: 'Mobilizing', name: 'phaseStatus' },
    { value: 'Complete', label: 'Complete', name: 'phaseStatus' }
]

const types = [
    { value: 'Programming', label: 'Programming', name: 'phaseType' },
    { value: 'Design', label: 'Design', name: 'phaseType' },
    { value: 'Construction', label: 'Construction', name: 'phaseType' },
    { value: 'Multi-faceted', label: 'Multi-faceted', name: 'phaseType' }
]

export class PhaseInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            // utilities
            redirect: false,

            // phase state
            projectID: '',
            phaseID: '',
            cartegraphID: '',
            phaseName: '',
            phaseType: '',
            phaseFollows: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            phaseDescription: '',
            phaseStatus: '',
            percentComplete: '',
            notes: '',
            created: '',
            createdBy: '',
            lastModifiedBy: ''
        }
        this.handleDate = this.handleDate.bind(this)
    }
    componentDidMount() {
        console.log(this.props)
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
                phaseType: phase.phaseType,
                phaseFollows: phase.phaseFollows,
                expectedStartDate: phase.expectedStartDate,
                expectedEndDate: phase.expectedEndDate,
                actualStartDate: phase.actualStartDate,
                actualEndDate: phase.actualEndDate,
                phaseDescription: phase.phaseDescription,
                phaseStatus: phase.phaseStatus,
                percentComplete: phase.percentComplete,
                notes: phase.notes,
                created: phase.created,
                createdBy: phase.createdBy,
                lastModifiedBy: this.props.user,
            })
        }
        else {
            // new phase
            const guid: string = uuid()
            this.setState({
                projectID: this.props.projectID,
                phaseID: guid,
                created: moment().format('MM/DD/YYYY'),
                createdBy: this.props.user,
                lastModifiedBy: this.props.user
            })
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleDate(date, name) {
        if (date) {
            this.setState({
                [name]: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                [name]: null
            });
        }
    }

    handleStatusMulti(value) {
        this.setState({ phaseStatus: value });
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
            phaseID,
            phaseName,
            phaseType,
            phaseFollows,
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
            phaseDescription,
            phaseStatus,
            percentComplete,
            notes,
        } = this.state

        // validation
        const isEnabled =
            phaseName != '' &&
            expectedStartDate != '' &&
            expectedEndDate != '' &&
            phaseStatus != ''

        const link = "/Phase/id=" + phaseID

        if (redirect) {
            return <Redirect to={link} />
        }

        return (
            <div>
                <div className='col-md-12'>
                    <Input
                        value={phaseName}
                        name="phaseName"
                        header="Phase name"
                        placeholder="Enter a name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={phaseType}
                        name="phaseType"
                        header='Phase type'
                        placeholder='Select type'
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
                        header='Phase status'
                        placeholder='Select statuses'
                        onChange={this.handleStatusMulti.bind(this)}
                        multi={true}
                        options={statuses}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={phaseFollows}
                        name="phaseFollows"
                        header='Phase follows'
                        placeholder='Identify preceding work'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                    />
                </div>

                {!this.props.update &&
                    <div>
                        <div className='col-md-6'>
                            <Datepicker
                                value={expectedStartDate}
                                name="expectedStartDate"
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
        ...state.phases,
        ...state.user
    }),
    ({
        ...User.actionCreators,
        ...Phases.actionCreators
    })
)(PhaseInputs as any) as typeof PhaseInputs
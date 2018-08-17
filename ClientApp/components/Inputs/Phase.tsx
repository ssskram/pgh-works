
import * as React from 'react'
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

const sliderContainer = {
    padding: '0px 15px'
}

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' }
]

export class PhaseInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projectID: '',
            phaseID: '',
            cartegraphID: '',
            phaseName: '',
            startDate: '',
            endDate: '',
            phaseDescription: '',
            phaseStatus: '',
            percentComplete: '',
            notes: '',
            created: '',
            createdBy: '',
            lastModifiedBy: ''
        }
    }
    componentDidMount() {
        // set status dropdown
        if (this.props.phaseName) {
            // update phase
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
        this.setState({ [event.target.name]: event.target.value });
    }

    handleStartDate(date) {
        if (date) {
            this.setState({
                startDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                startDate: null
            });
        }
    }

    handleEndDate(date) {
        if (date) {
            this.setState({
                endDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                endDate: null
            });
        }
    }

    handleStatusMulti(value) {
        this.setState({ phaseStatus: value });
    };

    handlePercent(event, maskedvalue, floatvalue) {
        let value = 0
        console.log(floatvalue)
        if (floatvalue > 100) {
            value = 100
        } else {
            value = floatvalue
        }
        this.setState({ percentComplete: value })
    }

    post() {
        console.log(this.state)
    }

    public render() {
        const {
            phaseName,
            startDate,
            endDate,
            phaseDescription,
            phaseStatus,
            percentComplete,
            notes,
        } = this.state

        // validation
        const isEnabled =
            phaseName != '' &&
            startDate != '' &&
            endDate != '' &&
            phaseStatus != '' &&
            percentComplete != ''

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
                        <br/>
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
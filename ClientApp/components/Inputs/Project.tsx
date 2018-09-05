
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Statuses from '../../store/GETS/status'
import * as Personnel from '../../store/GETS/personnel'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'

const managers = [
    { value: 'John Smith', label: 'John Smith', name: 'projectManager' },
    { value: 'Jane Doe', label: 'Jane Doe', name: 'projectManager' }
]

const members = [
    { value: 'John Smith', label: 'John Smith', name: 'projectMembers' },
    { value: 'Jane Doe', label: 'Jane Doe', name: 'projectMembers' }
]

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'projectStatus' },
    { value: 'Mobilizing', label: 'Mobilizing', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' }
]

const types = [
    { value: 'Programming', label: 'Programming', name: 'projectType' },
    { value: 'Design', label: 'Design', name: 'projectType' },
    { value: 'Construction', label: 'Construction', name: 'projectType' },
    { value: 'Multi-faceted', label: 'Multi-faceted', name: 'projectType' }
]

const departments = [
    { value: 'DOMI', label: 'DOMI', name: 'projectDepartment' },
    { value: 'DPW', label: 'DPW', name: 'projectDepartment' }
]

export class ProjectInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.handleDate = this.handleDate.bind(this)
    }
    componentDidMount() {
        // set personnel dropdowns
        // set status dropdowns
        console.log(this.props)
    }

    handleChildChange(event) {
        this.props.handleInput(event)
    }

    handleChildSelect(event) {
        this.props.handleSelect(event)
    }

    handleMembersMulti(value) {
        this.props.handleMulti("projectMembers", value)
    }

    handleStatusMulti(value) {
        this.props.handleMulti("projectStatus", value)
    }

    handleDate(date, name) {
        this.props.handleDate(date, name)
    }

    public render() {
        const {
            projectName,
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
            projectManager,
            projectMembers,
            projectDepartment,
            projectDescription,
            projectStatus,
            notes,
            update
        } = this.props.description

        return (
            <div>
                <div className='col-md-12'>
                    <Input
                        value={projectName}
                        name="projectName"
                        header="Project name"
                        placeholder="Enter a name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={projectStatus}
                        name="projectStatus"
                        header='Project status'
                        placeholder='Select status(es)'
                        onChange={this.handleStatusMulti.bind(this)}
                        multi={true}
                        options={statuses}
                    />
                </div>

                <div className='col-md-6'>
                    <TextArea
                        value={projectDescription}
                        name="projectDescription"
                        header="Project description"
                        placeholder="Provide a brief explanation of the project"
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
                {!update &&
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
                    <Select
                        value={projectManager}
                        name="projectManager"
                        header='Project manager'
                        placeholder='Select manager'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={managers}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={projectMembers}
                        name="projectMembers"
                        header='Project members'
                        placeholder='Select team members'
                        onChange={this.handleMembersMulti.bind(this)}
                        multi={true}
                        options={members}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={projectDepartment}
                        name="projectDepartment"
                        header='Project department'
                        placeholder='Select a department'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={departments}
                    />
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.statuses,
        ...state.personnel
    }),
    ({
        ...Statuses.actionCreators,
        ...Personnel.actionCreators
    })
)(ProjectInputs as any) as typeof ProjectInputs

import * as React from 'react'
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
    { value: 'Complete', label: 'Complete', name: 'projectStatus' }
]

export default class ProjectInputs extends React.Component<any, any> {

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

    handleStartDate(date) {
        this.props.handleStartDate(date)
    }

    handleEndDate(date) {
        this.props.handleEndDate(date)
    }

    public render() {
        const {
            projectName,
            startDate,
            endDate,
            projectManager,
            projectMembers,
            projectDescription,
            projectStatus,
            expectedCost,
            actualCost,
            notes
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
                        placeholder='Select statuses'
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

                <div className='col-md-6'>
                    <Input
                        value={expectedCost}
                        name="expectedCost"
                        header="Expected cost"
                        placeholder="Enter an amount"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <Input
                        value={actualCost}
                        name="actualCost"
                        header="Actual cost"
                        placeholder="Enter an amount"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
            </div>
        )
    }
}